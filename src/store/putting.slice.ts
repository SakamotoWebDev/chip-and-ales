import { PuttResult } from '../types/domain'

export interface PuttingSlice {
  puttResults: PuttResult[]
  addPuttResult: (putt: PuttResult) => void
  resetPuttResults: () => void
}

export const createPuttingSlice = (set: any): PuttingSlice => ({
  puttResults: [],
  addPuttResult: (putt) => set((state: { puttResults: PuttResult[] }) => { state.puttResults.push(putt) }),
  resetPuttResults: () => set({ puttResults: [] })
})