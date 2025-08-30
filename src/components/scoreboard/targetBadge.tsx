type Props = {
  topScore: number
  runnerUpScore?: number
  targetScore?: number // default 7
  requireTwoPointLead?: boolean // default true
}

/** Compact helper to display “X to win” or “needs +2 lead” hints. */
export default function TargetBadge({
  topScore,
  runnerUpScore,
  targetScore = 7,
  requireTwoPointLead = true,
}: Props) {
  const lead = topScore - (runnerUpScore ?? 0)
  const hasTarget = topScore >= targetScore
  const hasLead = !requireTwoPointLead || lead >= 2

  let text = ''
  if (hasTarget && hasLead) {
    text = 'Win condition met'
  } else if (hasTarget && !hasLead) {
    text = `Need ${Math.max(0, 2 - lead)} more lead`
  } else {
    text = `${targetScore - topScore} to target`
  }

  return (
    <div
      className="rounded-xl border px-3 py-1 text-xs"
      style={{ background: 'rgba(0,0,0,0.04)' }}
      title={`Top: ${topScore} · Runner-up: ${runnerUpScore ?? 0} · Lead: ${lead}`}
    >
      {text}
    </div>
  )
}