import { PlayerId } from '../../types/domain'

type PuttItem = { playerId: PlayerId; name: string }
type Props = {
  playersToPutt: PuttItem[]           // players eligible to putt (skip holed-out)
  skippedNames?: string[]             // display-only list of skipped players
  madeMap: Record<PlayerId, boolean>  // local made/miss map
  onSetMade: (playerId: PlayerId, made: boolean) => void
}

export default function PuttsPanel({ playersToPutt, skippedNames = [], madeMap, onSetMade }: Props) {
  return (
    <div className="rounded-2xl border p-3 sm:p-4">
      <div className="mb-2 text-lg font-semibold">Putting</div>

      <div className="space-y-2">
        {playersToPutt.map((p) => {
          const made = madeMap[p.playerId] ?? false
          return (
            <div key={p.playerId} className="flex items-center justify-between rounded-xl border p-2">
              <div className="font-medium">{p.name}</div>
              <div className="flex gap-2">
                <button
                  className={`rounded-lg border px-3 py-1 hover:opacity-80 active:scale-[0.98] ${made === false ? 'opacity-90' : ''}`}
                  onClick={() => onSetMade(p.playerId, false)}
                >
                  Miss
                </button>
                <button
                  className={`rounded-lg border px-3 py-1 hover:opacity-80 active:scale-[0.98] ${made === true ? 'opacity-90' : ''}`}
                  onClick={() => onSetMade(p.playerId, true)}
                >
                  Made (+2)
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {skippedNames.length > 0 && (
        <div className="mt-3 rounded-xl border p-2 text-xs opacity-70">
          Skipping putts for: {skippedNames.join(', ')}
        </div>
      )}
    </div>
  )
}