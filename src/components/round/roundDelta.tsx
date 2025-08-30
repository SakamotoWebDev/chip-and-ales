import { ScoreDelta, PlayerId } from '../../types/domain'

type PlayerLite = { playerId: PlayerId; name: string; color?: string }
type Props = {
  deltas: ScoreDelta[]
  players: PlayerLite[]
}

export default function RoundDeltaStrip({ deltas, players }: Props) {
  const nameFor = (id: PlayerId) => players.find(p => p.playerId === id)?.name ?? id
  const colorFor = (id: PlayerId) => players.find(p => p.playerId === id)?.color ?? '#999'

  const badgeStyle = (delta: number) => {
    // Subtle color cue by delta size
    const bg =
      delta >= 4 ? 'rgba(16,185,129,0.18)' : // 4 = chip hole-out
      delta >= 2 ? 'rgba(59,130,246,0.18)' : // 2 = made putt
      delta >= 1 ? 'rgba(234,179,8,0.18)'  : // 1 = closest
      'rgba(0,0,0,0.06)'
    return {
      background: bg,
      transition: 'transform 140ms ease, opacity 140ms ease',
    } as React.CSSProperties
  }

  return (
    <div className="rounded-2xl border p-3 sm:p-4">
      <div className="mb-2 text-sm font-semibold">Round Deltas</div>
      <div className="flex flex-wrap gap-2">
        {deltas.map((d, idx) => (
          <div
            key={`${d.playerId}:${idx}:${d.delta}`}
            className="flex items-center gap-2 rounded-xl border px-3 py-1"
            style={badgeStyle(d.delta)}
          >
            <span
              aria-hidden
              style={{
                display: 'inline-block',
                width: 10,
                height: 10,
                borderRadius: 9999,
                background: colorFor(d.playerId),
              }}
            />
            <span className="text-sm">{nameFor(d.playerId)}</span>
            <span className="text-sm tabular-nums">{d.delta > 0 ? `+${d.delta}` : d.delta}</span>
          </div>
        ))}
      </div>
    </div>
  )
}