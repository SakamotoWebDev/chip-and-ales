import { StateCreator } from 'zustand'

export interface MinigameSlice {
  currentRound: number
  matchInProgress: boolean
  startMatch: () => void
  endMatch: () => void
  incrementRound: () => void
}

export const createMinigameSlice: StateCreator<MinigameSlice> = (set) => ({
  currentRound: 1,
  matchInProgress: false,
  startMatch: () => set({ matchInProgress: true, currentRound: 1 }),
  endMatch: () => set({ matchInProgress: false }),
  incrementRound: () => set(state => ({ currentRound: state.currentRound + 1 }))
})