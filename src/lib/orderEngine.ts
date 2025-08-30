import { PlayerScore, PlayerId } from '../types/domain'

/**
 * Sorts players by highest score first, using previous round winner as a tiebreaker if needed.
 */
export function getTurnOrder(
  scores: PlayerScore[],
  lastRoundWinnerId?: PlayerId
): PlayerId[] {
  return [...scores]
    .sort((a, b) => {
      if (b.total !== a.total) return b.total - a.total
      if (a.playerId === lastRoundWinnerId) return -1
      if (b.playerId === lastRoundWinnerId) return 1
      return 0
    })
    .map(p => p.playerId)
}