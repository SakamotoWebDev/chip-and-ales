//timer Display
interface TimerDisplayProps {
  seconds: number
  running?: boolean
  warnAt?: number // e.g., 5 to add subtle urgency
}

export default function TimerDisplay({ seconds, running = false, warnAt = 5 }: TimerDisplayProps) {
  const min = Math.floor(Math.max(0, seconds) / 60)
  const sec = Math.max(0, seconds) % 60
  const text = `${min}:${sec.toString().padStart(2, '0')}`

  const urgent = seconds <= warnAt

  return (
    <div
      className="rounded-xl border px-3 py-1 tabular-nums"
      style={{
        background: urgent ? 'rgba(220,38,38,0.08)' : 'rgba(0,0,0,0.04)',
        borderColor: urgent ? '#dc2626' : '#d7d7db',
        transition: 'transform 120ms ease, background 120ms ease, border-color 120ms ease',
        transform: running ? 'scale(1.02)' : 'scale(1.0)',
        fontVariantNumeric: 'tabular-nums',
        fontWeight: 600,
      }}
      aria-live="polite"
    >
      {text}
    </div>
  )
}