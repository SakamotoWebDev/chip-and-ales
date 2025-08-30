import { ChipResult, PuttResult, PlayerId, ScoreDelta } from '../types/domain'

/**
 * Returns the player who had the closest chip.
 * Assumes chipDistances is pre-sorted by distance (ascending).
 */
export function getClosestChipWinner(chipDistances: ChipResult[]): PlayerId | null {
  if (chipDistances.length === 0) return null
  const [closest, ...rest] = chipDistances
  const isTie = rest.some(r => r.distance === closest.distance)
  return isTie ? null : closest.playerId
}

/**
 * Returns a score delta for this round based on all inputs.
 */
export function computeRoundScoreDelta(
  chips: ChipResult[],
  putts: PuttResult[]
): ScoreDelta[] {
  const deltas: ScoreDelta[] = []

  // Check if any player holed out on chip
  for (const chip of chips) {
    if (chip.holed) {
      deltas.push({ playerId: chip.playerId, delta: 4 })
    }
  }

  const holedPlayers = new Set(deltas.map(d => d.playerId))

  // Closest chip (only if no one holed out)
  if (holedPlayers.size === 0) {
    const closestWinner = getClosestChipWinner(chips)
    if (closestWinner) {
      deltas.push({ playerId: closestWinner, delta: 1 })
    }
  }

  // Putting scores (2 pts for each successful putt, unless holed out earlier)
  for (const putt of putts) {
    if (putt.made && !holedPlayers.has(putt.playerId)) {
      deltas.push({ playerId: putt.playerId, delta: 2 })
    }
  }

  return deltas
}