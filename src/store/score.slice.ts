import { PlayerScore, ScoreDelta } from '../types/domain'

export interface ScoreSlice {
  scores: PlayerScore[]
  applyDeltas: (deltas: ScoreDelta[]) => void
  resetScores: () => void
  initializeScores: (playerIds: string[]) => void
}

export const createScoreSlice = (set: any, get: any): ScoreSlice => ({
  scores: [],
  applyDeltas: (deltas) =>
    set((state: any) => {
      for (const delta of deltas) {
        const player = state.scores.find((p: PlayerScore) => p.playerId === delta.playerId)
        if (player) {
          player.total += delta.delta
          player.history.push(delta.delta)
        }
      }
    }),
  resetScores: () => set({ scores: [] }),
  initializeScores: (playerIds) =>
    set(() => {
      const players = (get().players ?? []) as Array<{ playerId: string; name: string }>
      const scores: PlayerScore[] = playerIds.map((id) => {
        const p = players.find(pp => pp.playerId === id)
        return { playerId: id, name: p?.name ?? id, total: 0, history: [] }
      })
      return { scores }
    }),
})