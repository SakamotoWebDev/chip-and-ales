import { MatchRecord } from '../types/domain'

export function exportToJSON(data: MatchRecord): string {
  return JSON.stringify(data, null, 2)
}

export function exportToCSV(records: MatchRecord[]): string {
  const headers = ['Match ID', 'Player', 'Score']
  const rows = records.flatMap(record =>
    record.players.map(p => [record.matchId, p.name, p.total].join(','))
  )
  return [headers.join(','), ...rows].join('\n')
}