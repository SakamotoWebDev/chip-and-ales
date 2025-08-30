import { useMemo, useState } from 'react'
import { useRootStore } from '../../store/createStore'
import { PlayerId, PuttResult, ScoreDelta, RoundRecord } from '../../types/domain'
import { GameEventType } from '../../types/events'
import { formatTime } from '../../lib/time'
import { generateId } from '../../lib/id'

type Props = {
  roundId: string
  closestWinnerId?: PlayerId
  onRoundComplete: (args: { round: RoundRecord; matchWinnerId?: PlayerId }) => void
}

/**
 * PuttingController:
 * - One putt try per player not already holed-out on chip.
 * - +2 for made putt. If anyone holed-out on chip, closest +1 is ignored.
 * - Finalizes the round: applies deltas, stores RoundRecord, checks match win condition (7 w/ 2-pt lead).
 */
export default function PuttingController({ roundId, closestWinnerId, onRoundComplete }: Props) {
  const players = useRootStore(s => s.players)
  const scores = useRootStore(s => s.scores)
  const chipResults = useRootStore(s => s.chipResults)
  const puttResults = useRootStore(s => s.puttResults)
  const addPuttResult = useRootStore(s => s.addPuttResult)
  const resetPuttResults = useRootStore(s => s.resetPuttResults)
  const resetChipResults = useRootStore(s => s.resetChipResults)

  const applyDeltas = useRootStore(s => s.applyDeltas)
  const addRound = useRootStore(s => s.addRound)
  const incrementRound = useRootStore(s => s.incrementRound)
  const recordEvent = useRootStore(s => s.recordEvent)
  const startMatch = useRootStore(s => s.startMatch) // in case you want to auto-start via dashboard
  const endMatch = useRootStore(s => s.endMatch)

  const useShotTimer = useRootStore(s => s.useShotTimer)
  const shotClock = useRootStore(s => s.shotClock)

  const [localMade, setLocalMade] = useState<Record<PlayerId, boolean>>({})

  const holedPlayers = useMemo(
    () => new Set(chipResults.filter((c: { holed: any }) => c.holed).map((c: { playerId: any }) => c.playerId)),
    [chipResults]
  )

  const someoneHoled = holedPlayers.size > 0

  const playersEligibleToPutt = useMemo(
    () => players.filter(p => !holedPlayers.has(p.playerId)),
    [players, holedPlayers]
  )

  const savePutt = (playerId: PlayerId, made: boolean) => {
    setLocalMade(prev => ({ ...prev, [playerId]: made }))
    // Keep a mirrored slice record for history/debug; optional
    const exists = puttResults.find((pr: { playerId: string }) => pr.playerId === playerId)
    if (!exists) addPuttResult({ playerId, made })
    recordEvent({ type: GameEventType.PUTT_COMPLETE, payload: { playerId, made }, timestamp: Date.now() })
  }

  // Build deterministic deltas for this round (controller-level, to support judge mode)
  const buildDeltas = (): ScoreDelta[] => {
    const deltas: ScoreDelta[] = []

    // +4 for chip hole-outs
    for (const c of chipResults) {
      if (c.holed) deltas.push({ playerId: c.playerId, delta: 4 })
    }

    // +1 for closest IF nobody holed out
    if (!someoneHoled && closestWinnerId) {
      deltas.push({ playerId: closestWinnerId, delta: 1 })
    }

    // +2 for made putts (skip those who holed earlier)
    for (const p of playersEligibleToPutt) {
      const made = localMade[p.playerId] ?? false
      if (made) deltas.push({ playerId: p.playerId, delta: 2 })
    }

    return deltas
  }

  const computeRoundWinnerId = (deltas: ScoreDelta[]): PlayerId | undefined => {
    // Rule of thumb for “round winner” (decides next start location):
    // - If any chip hole-out happened: that player is the round winner.
    // - Else: the closest chip winner.
    if (someoneHoled) {
      // If (somehow) multiple hole-outs happen, pick the first (should be rare/impossible in practice).
      return chipResults.find((c: { holed: any }) => c.holed)?.playerId
    }
    return closestWinnerId
  }

  const checkMatchWinner = (): PlayerId | undefined => {
    if (!scores.length) return undefined
    const sorted = [...scores].sort((a, b) => b.total - a.total)
    const top = sorted[0]
    const runnerUp = sorted[1]
    if (!top) return undefined

    const topScore = top.total
    const diff = (runnerUp ? top.total - runnerUp.total : top.total)

    if (topScore >= 7 && diff >= 2) return top.playerId
    return undefined
  }

  const handleFinalizeRound = () => {
    // Require at least an explicit closest if no hole-out
    if (!someoneHoled && !closestWinnerId) {
      alert('Select a single closest winner to continue.')
      return
    }

    const deltas = buildDeltas()
    applyDeltas(deltas)

    const winnerId = computeRoundWinnerId(deltas)
    const round: RoundRecord = {
      roundId,
      chipResults: [...chipResults],
      puttResults: playersEligibleToPutt.map(p => ({
        playerId: p.playerId,
        made: localMade[p.playerId] ?? false,
      })),
      deltas,
      winnerId,
      startLocation: 'see previous screen', // The actual text was captured in ChippingController props; store it there when you add rounds here if you prefer.
    }

    addRound(round)
    recordEvent({ type: GameEventType.SCORE_UPDATED, payload: { playerId: 'ALL', newTotal: -1 }, timestamp: Date.now() })

    // Clean up per-round working state
    resetChipResults()
    resetPuttResults()

    // Check match completion after deltas apply
    const matchWinnerId = checkMatchWinner()
    if (matchWinnerId) {
      recordEvent({ type: GameEventType.MATCH_COMPLETE, payload: { winnerId: matchWinnerId }, timestamp: Date.now() })
      endMatch()
      onRoundComplete({ round, matchWinnerId })
      return
    }

    // Otherwise advance to next round
    incrementRound()
    onRoundComplete({ round })
  }

  const fakeStartIfNeeded = () => {
    // Optional helper to guarantee match state is active
    startMatch()
  }

  return (
    <div className="rounded-2xl border p-3 sm:p-4">
      <div className="mb-2 text-lg font-semibold">Putting — One attempt each</div>

      {useShotTimer && (
        <div className="mb-2 text-sm opacity-80">
          Shot clock: {formatTime(shotClock)}
        </div>
      )}

      <div className="space-y-2">
        {playersEligibleToPutt.map(p => (
          <div key={p.playerId} className="flex items-center gap-2 rounded-xl border p-2">
            <div className="min-w-24 font-medium">{p.name}</div>

            <div className="ml-auto flex gap-2">
              <button
                className={`rounded-lg border px-3 py-1 hover:opacity-80 active:scale-[0.98] ${localMade[p.playerId] === false ? 'opacity-90' : ''}`}
                onClick={() => savePutt(p.playerId, false)}
              >
                Miss
              </button>
              <button
                className={`rounded-lg border px-3 py-1 hover:opacity-80 active:scale-[0.98] ${localMade[p.playerId] === true ? 'opacity-90' : ''}`}
                onClick={() => savePutt(p.playerId, true)}
              >
                Made (+2)
              </button>
            </div>
          </div>
        ))}

        {holedPlayers.size > 0 && (
          <div className="rounded-xl border p-2 text-xs opacity-70">
            Skipping putts for: {players.filter(pl => holedPlayers.has(pl.playerId)).map(p => p.name).join(', ') || '—'}
          </div>
        )}
      </div>

      <div className="mt-3 flex gap-2">
        <button
          className="rounded-xl border px-4 py-2 hover:opacity-80 active:scale-[0.98]"
          onClick={handleFinalizeRound}
        >
          Finalize Round
        </button>
        <button
          className="rounded-xl border px-4 py-2 hover:opacity-80 active:scale-[0.98]"
          onClick={fakeStartIfNeeded}
        >
          Ensure Match Started
        </button>
      </div>
    </div>
  )
}