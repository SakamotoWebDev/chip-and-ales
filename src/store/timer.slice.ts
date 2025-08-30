// /src/store/timer.slice.ts
import { StateCreator } from 'zustand'

export interface TimerSlice {
  shotClock: number
  setShotClock: (value: number) => void
  resetShotClock: () => void
}

export const createTimerSlice: StateCreator<TimerSlice> = (set) => ({
  shotClock: 30,
  setShotClock: (value) => set({ shotClock: value }),
  resetShotClock: () => set({ shotClock: 30 })
})