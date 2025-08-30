// /src/store/chipping.slice.ts
import { ChipResult } from '../types/domain'

export type ChippingSlice = {
  chipResults: ChipResult[]
  addChipResult: (chip: ChipResult) => void
  resetChipResults: () => void
}

export const createChippingSlice = (set: any): ChippingSlice => ({
  chipResults: [],

  // ✅ draft-style mutation; do NOT annotate as (state: ChippingSlice)
  addChipResult: (chip) =>
    set((draft: any) => {
      draft.chipResults.push(chip)
    }),

  resetChipResults: () => set({ chipResults: [] }),
})