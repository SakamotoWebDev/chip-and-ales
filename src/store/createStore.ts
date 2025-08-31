import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { createElement, Fragment, type ReactNode } from 'react'

import { createPlayersSlice, type PlayersSlice } from './players.slice'
import { createSettingsSlice, type SettingsSlice } from './settings.slice'
import { createMinigameSlice, type MinigameSlice } from './minigame.slice'
import { createRoundsSlice, type RoundsSlice } from './rounds.slice'
import { createChippingSlice, type ChippingSlice } from './chipping.slice'
import { createPuttingSlice, type PuttingSlice } from './putting.slice'
import { createScoreSlice, type ScoreSlice } from './score.slice'
import { createTimerSlice, type TimerSlice } from './timer.slice'
import { createHistorySlice, type HistorySlice } from './history.slice'

export type RootState =
  & PlayersSlice
  & SettingsSlice
  & MinigameSlice
  & RoundsSlice
  & ChippingSlice
  & PuttingSlice
  & ScoreSlice
  & TimerSlice
  & HistorySlice

// Important: include (set, get, api) in the initializer signature to satisfy Zustand's
// StateCreator typing (even if you don't use `api`).
export const useAppStore = create<RootState>()(
  persist(
    immer((set, get, api) => ({
      // Call each slice with only the args it expects.
      // (Passing extra args to a TS-typed function causes "Expected N args" errors.)
      ...createPlayersSlice(set as any),
      ...createSettingsSlice(set as any, get as any, api as any),
      ...createMinigameSlice(set as any, get as any, api as any),
      ...createRoundsSlice(set as any),
      ...createChippingSlice(set as any),
      ...createPuttingSlice(set as any),
      ...createScoreSlice(set as any, get as any),
      ...createTimerSlice(set as any, get as any, api as any),
      ...createHistorySlice(set as any, get as any),
    })),
    { name: 'chipndales-state' }
  )
)

// Compat alias used across controllers
export const useRootStore = useAppStore

// Handy external selectors to keep components crisp
export const selectAllPlayers = (s: RootState) => s.players
export const selectPlayerById = (id: string) => (s: RootState) => s.players.find(p => p.playerId === id)

// Minimal provider (Zustand hook doesn't require a React provider)
export const StoreProvider = ({ children }: { children: ReactNode }) =>
  createElement(Fragment, null, children)
