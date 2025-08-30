import { RoundRecord } from '../types/domain'

export interface RoundsSlice {
  rounds: RoundRecord[]
  addRound: (round: RoundRecord) => void
  resetRounds: () => void
}

export const createRoundsSlice = (set: any): RoundsSlice => ({
  rounds: [],
  addRound: (round) => set((state: { rounds: RoundRecord[] }) => { state.rounds.push(round) }),
  resetRounds: () => set({ rounds: [] })
})
