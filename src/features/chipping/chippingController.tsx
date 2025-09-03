import { useMemo, useState } from 'react'
import { useRootStore } from '@/store/createStore'
import { ChipResult, PlayerId, RoundRecord } from '@/types/domain'
import { GameEventType } from '@/types/events'
import { getTurnOrder } from '@/lib/orderEngine'
import { generateId } from '@/lib/id'
import Button from '@/components/common/button'

type Props = {
  startLocation: string
  onComplete: (args: { roundId: string; closestWinnerId?: PlayerId }) => void
}

/**
 * ChippingController:
 * - Collects one or more chip attempts per player (2–4 typical; not enforced here).
 * - Supports “judge mode” (no distances) by letting you pick a single closest player.
 * - If any chip is holed, that player auto-gets +4 and DOES NOT putt later.
 * - Exactly one closest winner must be selected *iff* no one holed out.
 *
 * Round winner semantics for next-start-location:
 * - If someone holed out on a chip: that player is the round winner.
 * - Otherwise: the closest chip winner is the round winner.
 */
export default function ChippingController({ startLocation, onComplete }: Props) {
  const players = useRootStore(s => s.players)
  const scores = useRootStore(s => s.scores)
  const chipResults = useRootStore(s => s.chipResults)
  const holedByPlayer = useMemo(() => {
    return new Set(
      chipResults.filter((c: { holed: any }) => c.holed).map((c: { playerId: any }) => c.playerId)
    )
  }, [chipResults])
  const addChipResult = useRootStore(s => s.addChipResult)
  const resetChipResults = useRootStore(s => s.resetChipResults)

  const recordEvent = useRootStore(s => s.recordEvent)
  const rounds = useRootStore(s => s.rounds)

  const [closestWinnerId, setClosestWinnerId] = useState<PlayerId | undefined>(undefined)
  const [distanceByPlayer, setDistanceByPlayer] = useState<Record<PlayerId, string>>({})

  // Highest score goes first; last round winner is a tiebreaker.
  const lastRoundWinnerId = useMemo(() => rounds.at(-1)?.winnerId, [rounds])
  const turnOrder = useMemo(
    () => getTurnOrder(scores, lastRoundWinnerId),
    [scores, lastRoundWinnerId]
  )

  const roundId = useMemo(() => generateId('rnd_'), [])

  const onAddChip = (playerId: PlayerId) => {
    const raw = distanceByPlayer[playerId]
    const dist = raw && raw.trim() !== '' ? Number(raw) : 0
    const chip: ChipResult = { playerId, distance: isFinite(dist) ? dist : 0, holed: false }
    const isClosest = 
    addChipResult(chip)
    recordEvent({ type: GameEventType.CHIP_COMPLETE, payload: { playerId, distance: chip.distance, holed: false }, timestamp: Date.now() })
  }

  const onHoleOut = (playerId: PlayerId) => {
    const chip: ChipResult = { playerId, distance: 0, holed: true }
    addChipResult(chip)
    recordEvent({ type: GameEventType.CHIP_COMPLETE, payload: { playerId, distance: 0, holed: true }, timestamp: Date.now() })
    // If someone holed out, closest selection no longer required or relevant.
    setClosestWinnerId(undefined)
  }

  const someoneHoled = useMemo(
    () => chipResults.some((c: { holed: any }) => c.holed),
    [chipResults]
  )

  const validateBeforeComplete = (): { ok: boolean; msg?: string } => {
    if (!players.length) return { ok: false, msg: 'Add players first.' }
    if (!turnOrder.length) return { ok: false, msg: 'No turn order available.' }

    // If no one holed out, enforce a single closest winner
    if (!someoneHoled && !closestWinnerId) {
      return { ok: false, msg: 'Pick exactly one closest winner.' }
    }
    return { ok: true }
  }

  const handleCompleteChipping = () => {
    const { ok, msg } = validateBeforeComplete()
    if (!ok) {
      // Light inline guard — replace with toast/modal in UI layer if you prefer
      alert(msg)
      return
    }

    recordEvent({
      type: GameEventType.START_ROUND,
      payload: { roundId },
      timestamp: Date.now(),
    })

    // Persist a minimal placeholder RoundRecord; full deltas + winner set in PuttingController.
    // Keeping chipResults in slice; PuttingController will read them to compute round.
    const placeholderRound: Pick<RoundRecord, 'roundId' | 'chipResults' | 'puttResults' | 'deltas' | 'startLocation'> = {
      roundId,
      chipResults: [...chipResults],
      puttResults: [],
      deltas: [],
      startLocation,
    }

    // We DO NOT push the round yet; final write happens after putting is finished.
    // Advance to putting phase via parent callback.
    onComplete({ roundId, closestWinnerId })
  }

  const resetAllChips = () => {
    resetChipResults()
    setClosestWinnerId(undefined)
    setDistanceByPlayer({})
  }

  return (
    <div className="rounded-2xl border p-3 sm:p-4">
      <div className="mb-2 text-lg font-semibold">Chipping — Shot Entry</div>
      <div className="text-sm opacity-80 mb-3" style={{ overflowWrap: 'anywhere' }}>
        Turn order: {turnOrder.map(id => players.find(p => p.playerId === id)?.name).filter(Boolean).join(' → ')}
      </div>

      <div className="space-y-2">
        {turnOrder.map(pid => {
          const p = players.find(pp => pp.playerId === pid)
          if (!p) return null
          const isHoled = holedByPlayer.has(pid)
          const isClosest = !someoneHoled && closestWinnerId === pid
          return (
            <div key={pid} className="flex flex-wrap items-center gap-2 rounded-xl border p-2">
              <div className="font-medium" style={{ minWidth: 96, flexShrink: 1 }}>{p.name}</div>
              

              {/* Optional numeric distance if not using judge mode */}
              <input
                className="flex-1 rounded-md border px-2 py-2"
                style={{ minWidth: 140 }}
                inputMode="decimal"
                placeholder="distance (optional)"
                value={distanceByPlayer[pid] ?? ''}
                onChange={(e) =>
                  setDistanceByPlayer(prev => ({ ...prev, [pid]: e.target.value }))
                }
              />

              <Button
                className="rounded-lg border px-3 py-2 hover:opacity-80 active:scale-[0.98]"
                style={{ flexShrink: 0 }}
                onClick={() => onAddChip(pid)}
              >
                Add chip
              </Button>

              <Button
                className={`
                  rounded-lg border 
                  px-3 
                  py-2 
                  hover:opacity-80 
                  active:scale-[0.98] 
                  ${isHoled ? 'btn-selected' : ''
                  }`}
                style={{
                  flexShrink: 0 }}
                aria-pressed={isHoled}
                data-selected={isHoled ? 'true' : 'false'}
                onClick={() => onHoleOut(pid)}
              >
                {isHoled ? 'Holed!' : 'Hole-out'}
              </Button>

              <Button 
                className={`
                  ml-2 
                  rounded-lg border 
                  px-3 
                  py-2 
                  hover:opacity-80 
                  active:scale-[0.98] 
                  ${isClosest ? 'btn-selected' : ''}
                  `} 
                style={{ flexShrink: 0 }}
                aria-pressed={isClosest}
                data-selected={isClosest || undefined}
                disabled={someoneHoled}
                onClick={() => setClosestWinnerId(pid)}
              >  
                {isClosest ? 'Closest!' : 'Closer?'}
              </Button>
            </div>
          )
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <Button
          className="rounded-xl border px-4 py-2 hover:opacity-80 active:scale-[0.98]"
          style={{ flexShrink: 0 }}
          onClick={resetAllChips} >
          Reset Shot Entry
          </Button>
        
          <Button
            className="rounded-xl border px-4 py-2 hover:opacity-80 active:scale-[0.98]"
            style={{ flexShrink: 0 }}
            onClick={handleCompleteChipping} >
            Continue to Putting
          </Button>   
      </div>

      <div className="mt-2 text-sm opacity-70">
        Tip: If anyone holed out, you don’t need to select a closest winner (they’ll auto-score +4 and skip the putt).
      </div>
    </div>
  )
}