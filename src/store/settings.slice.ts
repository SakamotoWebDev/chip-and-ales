import { StateCreator } from 'zustand'

export interface SettingsSlice {
  useHandicap: boolean
  useShotTimer: boolean
  toggleHandicap: () => void
  toggleShotTimer: () => void
}

export const createSettingsSlice: StateCreator<SettingsSlice> = (set) => ({
  useHandicap: false,
  useShotTimer: false,
  toggleHandicap: () => set(state => ({ useHandicap: !state.useHandicap })),
  toggleShotTimer: () => set(state => ({ useShotTimer: !state.useShotTimer }))
})