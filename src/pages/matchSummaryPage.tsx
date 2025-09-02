import { useMemo } from 'react'
import { useRootStore } from '@/store/createStore'
import type { MatchRecord, Player, PlayerScore, RoundRecord, ScoreDelta } from '@/types/domain'
import { exportToJSON, exportToCSV } from '@/lib/export'
import { generateId } from '@/lib/id'
import Card from '@/components/common/card'
import Button from '@/components/common/button'
import ScorePill from '@/components/common/scorePill'
import ChipBadge from '@/components/common/chipBadge'

export default function MatchSummaryPage() {
  const players = useRootStore(s => s.players)
  const scores = useRootStore(s => s.scores)
  const rounds = useRootStore(s => s.rounds)

  const playerName = (id?: string) => (id ? (players.find(p => p.playerId === id)?.name ?? id) : '—')

  const matchRecord: MatchRecord = useMemo(() => {
    const matchId = generateId('m_')
    return {
      matchId,
      players: scores,
      rounds,
      matchWinnerId: computeWinner(scores),
      timestamp: Date.now(),
    }
  }, [scores, rounds])

  const jsonStr = useMemo(() => exportToJSON(matchRecord), [matchRecord])
  const csvStr = useMemo(() => exportToCSV([matchRecord]), [matchRecord])

  const download = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const sortedScores: PlayerScore[] = [...scores].sort((a, b) => b.total - a.total)

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <Card title="Match Summary" subtitle="Complete recap: chipping + putting per round, final scores, and exports." />

      {/* Final Scores */}
      <Card title="Final Scores">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {sortedScores.map(s => (
            <div key={s.playerId} className="flex items-center justify-between rounded-xl border p-2">
              <div className="font-medium">{playerName(s.playerId)}</div>
              <div className="text-lg tabular-nums">{s.total}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Rounds Timeline */}
      <Card title="Rounds Timeline" subtitle={rounds.length ? undefined : 'No rounds played yet.'}>
        <div className="space-y-3">
          {rounds.map((r: RoundRecord, idx: number) => {
            const deltas = r.deltas ?? []
            const holedOutIds = (r as any).chips?.filter((c: any) => c.holed)?.map((c: any) => c.playerId)
              ?? (r as any).chipping?.filter((c: any) => c.holed)?.map((c: any) => c.playerId)
              ?? []

            // Closest winner: prefer explicit field, else infer from a +1 delta (rules guarantee only one +1 and only when no hole-out)
            const closestId: string | undefined = (r as any).closestWinnerId
              ?? deltas.find(d => Number(d.delta) === 1)?.playerId
            const closestName = closestId ? playerName(closestId) : undefined

            const putts: Array<{ playerId: string; made: boolean }> = (r as any).putts
              ?? (r as any).putting
              ?? []

            return (
              <div key={r.roundId} className="rounded-2xl border p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm opacity-70">Round {idx + 1}</div>
                    <div className="text-base">Start location: <b>{r.startLocation || '—'}</b></div>
                    <div className="text-sm">Winner: <b>{playerName(r.winnerId)}</b></div>
                  </div>
                  <div className="flex items-center gap-2">
                    {closestName && <ChipBadge kind="closest" delta={1} label={`Closest • ${closestName}`} />}
                    {holedOutIds.length > 0 && <ChipBadge kind="holeOut" delta={4} label={`Chip-In • ${holedOutIds.map(playerName).join(', ')}`} />}
                  </div>
                </div>

                {/* Putts */}
                {putts.length > 0 && (
                  <div className="mt-2 rounded-xl border p-2">
                    <div className="text-sm font-semibold mb-1">Putting</div>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {putts.map((p: any, i: number) => (
                        <div key={r.roundId + p.playerId} className="flex items-center justify-between rounded-lg border p-2">
                          <span className="font-medium">{playerName(p.playerId)}</span>
                          <span className="text-sm">
                            {p.made ? <span className="rounded-md border px-2 py-0.5"> Made (+2)</span> : 'Missed'}
                            </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Deltas */}
                {deltas.length > 0 && (
                  <div className="mt-2 rounded-xl border p-2">
                    <div className="text-sm font-semibold mb-1">Score Deltas</div>
                    <div className="flex flex-wrap gap-2">
                      {deltas.map((d: ScoreDelta, i: number) => (
                        <div key={`${r.roundId}:${d.playerId}:${i}`} className="flex items-center gap-2 rounded-xl border px-3 py-1">
                          <span>{playerName(d.playerId)}</span>
                          <ScorePill value={Number(d.delta)} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Card>

      {/* Export */}
      <Card title="Export">
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => download(jsonStr, `match_${matchRecord.matchId}.json`, 'application/json')}>
            Download JSON
          </Button>
          <Button onClick={() => download(csvStr, `match_${matchRecord.matchId}.csv`, 'text/csv')}>
            Download CSV
          </Button>
        </div>
        <details className="rounded-xl border p-2 mt-3">
          <summary className="cursor-pointer text-sm">Preview JSON</summary>
          <pre className="overflow-auto text-xs p-2">{jsonStr}</pre>
        </details>
      </Card>
    </div>
  )
}

function computeWinner(scores: PlayerScore[]) {
  if (!scores.length) return undefined
  const sorted = [...scores].sort((a, b) => b.total - a.total)
  const top = sorted[0]
  const runnerUp = sorted[1]
  const lead = top.total - (runnerUp?.total ?? 0)
  if (top.total >= 7 && lead >= 2) return top.playerId
  return undefined
}