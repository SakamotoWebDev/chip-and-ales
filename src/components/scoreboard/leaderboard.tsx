type Row = { playerId: string; name: string; total: number; lastDelta?: number }
type Props = {
  rows: Row[]
  highlightLeader?: boolean
  targetScore?: number // e.g., 7
}

export default function Leaderboard({ rows, highlightLeader = true, targetScore = 7 }: Props) {
  const sorted = [...rows].sort((a, b) => b.total - a.total)

  return (
    <div className="rounded-2xl border p-3 sm:p-4">
      <div className="mb-2 text-sm font-semibold">Leaderboard</div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((r, i) => {
          const leader = i === 0
          return (
            <div
              key={r.playerId}
              className="flex items-center justify-between rounded-xl border p-2"
              style={{
                background: highlightLeader && leader ? 'rgba(0,0,0,0.04)' : undefined,
                transition: 'transform 120ms ease',
                transform: leader ? 'scale(1.01)' : 'scale(1)',
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs opacity-70 w-6 text-right tabular-nums">{i + 1}.</span>
                <span className="font-medium">{r.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {typeof r.lastDelta === 'number' && (
                  <span className="rounded-md border px-2 py-0.5 text-xs">
                    {r.lastDelta > 0 ? `+${r.lastDelta}` : r.lastDelta}
                  </span>
                )}
                <span className="text-lg tabular-nums">{r.total}</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-2 text-xs opacity-70">Target: {targetScore} (win by 2)</div>
    </div>
  )
}