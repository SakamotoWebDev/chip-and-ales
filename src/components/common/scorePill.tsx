//score Pill
interface ScorePillProps {
  value: number // e.g., +2, +1, +4
  emphasized?: boolean
  title?: string
}

export default function ScorePill({ value, emphasized = false, title }: ScorePillProps) {
  const bg =
    value >= 4 ? 'rgba(16,185,129,0.18)' :
    value >= 2 ? 'rgba(59,130,246,0.18)' :
    value >= 1 ? 'rgba(234,179,8,0.18)' :
    'rgba(0,0,0,0.06)'

  return (
    <span
      className="inline-flex items-center rounded-xl border px-3 py-1 tabular-nums"
      style={{
        background: bg,
        borderColor: 'rgba(0,0,0,0.15)',
        fontWeight: 600,
        transform: emphasized ? 'scale(1.04)' : 'scale(1.0)',
        transition: 'transform 140ms ease',
      }}
      title={title}
    >
      {value > 0 ? `+${value}` : value}
    </span>
  )
}