type QueueItem = { playerId: string; name: string; color?: string }
type Props = {
  queue: QueueItem[]
  activeIndex?: number
  onAdvance?: () => void
}

export default function ShotQueue({ queue, activeIndex = 0, onAdvance }: Props) {
  return (
    <div className="rounded-2xl border p-3 sm:p-4">
      <div className="mb-2 text-sm font-semibold">Shot Queue</div>
      <div className="flex flex-wrap gap-2">
        {queue.map((q, i) => {
          const isActive = i === activeIndex
          return (
            <div
              key={q.playerId}
              className="rounded-xl border px-3 py-1 text-sm"
              style={{
                background: isActive ? 'rgba(0,0,0,0.04)' : undefined,
                boxShadow: isActive ? '0 1px 0 rgba(0,0,0,0.06)' : undefined,
                transition: 'transform 120ms ease, opacity 120ms ease',
                transform: isActive ? 'scale(1.02)' : 'scale(1.0)',
              }}
            >
              <span
                aria-hidden
                style={{
                  display: 'inline-block',
                  width: 10,
                  height: 10,
                  borderRadius: 9999,
                  background: q.color || '#999',
                  marginRight: 8,
                }}
              />
              {q.name}
              {isActive && <span className="ml-2 text-xs opacity-70">(now)</span>}
            </div>
          )
        })}
      </div>

      {onAdvance && (
        <div className="mt-3">
          <button
            className="rounded-xl border px-3 py-1 hover:opacity-80 active:scale-[0.98]"
            onClick={onAdvance}
          >
            Advance
          </button>
        </div>
      )}
    </div>
  )
}