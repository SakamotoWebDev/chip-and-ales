//chip Badge
type ChipBadgeKind = 'closest' | 'holeOut' | 'generic'

interface ChipBadgeProps {
  kind?: ChipBadgeKind
  label?: string
  delta?: number // e.g., +1, +4
}

const kindStyle: Record<ChipBadgeKind, { bg: string; bd: string }> = {
  closest: { bg: 'rgba(234,179,8,0.18)', bd: '#eab308' },  // amber-ish
  holeOut: { bg: 'rgba(16,185,129,0.18)', bd: '#10b981' }, // emerald-ish
  generic: { bg: 'rgba(0,0,0,0.06)', bd: '#d7d7db' },
}

export default function ChipBadge({ kind = 'generic', label, delta }: ChipBadgeProps) {
  const s = kindStyle[kind]
  const text = label ?? (kind === 'closest' ? 'Closest' : kind === 'holeOut' ? 'Chip-In' : 'Badge')
  return (
    <span
      className="inline-flex items-center gap-2 rounded-xl border px-3 py-1 text-sm"
      style={{ background: s.bg, borderColor: s.bd, transition: 'transform 120ms ease' }}
    >
      <span>{text}</span>
      {typeof delta === 'number' && <b className="tabular-nums">{delta > 0 ? `+${delta}` : delta}</b>}
    </span>
  )
}