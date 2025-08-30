//holding place for the Undo/Redo feature
import { useMemo } from 'react'
import { useRootStore } from '../../store/createStore'
import { GameEvent, GameEventType } from '../../types/events'

type Props = {
  className?: string
  compact?: boolean
  /** Optional hooks so the parent can actually reverse/apply domain effects */
  onApplyUndo?: (evt: GameEvent) => void
  onApplyRedo?: (evt: GameEvent) => void
}

/**
 * UndoRedoBar
 * UI for history controls wired to history.slice.ts stacks.
 * NOTE: The provided history slice moves events between stacks but does not
 *       mutate other slices (scores/rounds/etc.). If you want true undo/redo,
 *       pass onApplyUndo/onApplyRedo that perform the inverse/apply of `evt`.
 */
export default function UndoRedoBar({
  className,
  compact = false,
  onApplyUndo,
  onApplyRedo,
}: Props) {
  const undoStack = useRootStore(s => s.undoStack)
  const redoStack = useRootStore(s => s.redoStack)
  const history = useRootStore(s => s.history)

  const undo = useRootStore(s => s.undo)
  const redo = useRootStore(s => s.redo)
  const clearHistory = useRootStore(s => s.clearHistory)

  const lastEvent = useMemo(() => history.at(-1), [history])
  const canUndo = undoStack.length > 0
  const canRedo = redoStack.length > 0

  const nextUndo = canUndo ? undoStack[undoStack.length - 1] : undefined
  const nextRedo = canRedo ? redoStack[redoStack.length - 1] : undefined

  const payloadString = (evt: GameEvent, key: 'playerId' | 'winnerId' | 'roundId' | 'matchId') => {
    const p: any = (evt as any).payload
    return typeof p?.[key] === 'string' ? (p[key] as string) : undefined
  }

  const labelFor = (evt?: GameEvent) => {
    if (!evt) return '—'
    switch (evt.type) {
      case GameEventType.START_MATCH:   return 'Start match'
      case GameEventType.START_ROUND:   return 'Start round'
      case GameEventType.CHIP_COMPLETE: {
        const id = payloadString(evt, 'playerId')
        return `Chip (${id ?? '—'})`
      }
      case GameEventType.PUTT_COMPLETE: {
        const id = payloadString(evt, 'playerId')
        return `Putt (${id ?? '—'})`
      }
      case GameEventType.SCORE_UPDATED: return 'Scores updated'
      case GameEventType.MATCH_COMPLETE: {
        const w = payloadString(evt, 'winnerId')
        return w ? `Match complete (${w})` : 'Match complete'
      }
      case GameEventType.UNDO:          return 'Undo'
      case GameEventType.REDO:          return 'Redo'
      default:                          return evt.type
    }
  }

  const handleUndo = () => {
    if (!canUndo) return
    if (nextUndo && onApplyUndo) onApplyUndo(nextUndo) // parent reverses domain effects
    undo() // move event from undoStack -> redoStack
  }

  const handleRedo = () => {
    if (!canRedo) return
    if (nextRedo && onApplyRedo) onApplyRedo(nextRedo) // parent reapplies domain effects
    redo() // move event from redoStack -> undoStack
  }

  return (
    <div className={`rounded-2xl border p-3 ${className ?? ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">History</div>
          {!compact && (
            <div className="text-xs opacity-80">
              Last: <b>{labelFor(lastEvent)}</b>
              {lastEvent && (
                <> · <span>{new Date(lastEvent.timestamp).toLocaleTimeString()}</span></>
              )}
            </div>
          )}
          {!compact && (
            <div className="mt-1 text-xs opacity-80">
              Undo & Redo here only move events between stacks. To affect scores/rounds, pass handlers that
              apply the inverse/apply of the selected event.
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs rounded-md border px-2 py-0.5">
            undo: {undoStack.length}
          </span>
          <span className="text-xs rounded-md border px-2 py-0.5">
            redo: {redoStack.length}
          </span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          className="rounded-xl border px-3 py-1 hover:opacity-80 active:scale-[0.98]"
          disabled={!canUndo}
          onClick={handleUndo}
          title={nextUndo ? `Undo ${labelFor(nextUndo)}` : 'Nothing to undo'}
        >
          Undo
        </button>
        <button
          className="rounded-xl border px-3 py-1 hover:opacity-80 active:scale-[0.98]"
          disabled={!canRedo}
          onClick={handleRedo}
          title={nextRedo ? `Redo ${labelFor(nextRedo)}` : 'Nothing to redo'}
        >
          Redo
        </button>
        <button
          className="ml-auto rounded-xl border px-3 py-1 hover:opacity-80 active:scale-[0.98]"
          onClick={clearHistory}
          title="Clear history stacks"
        >
          Clear
        </button>
      </div>
    </div>
  )
}