// (no StateCreator typing needed)
import { Player, PlayerId } from '../types/domain'
import React from 'react'
import { useRootStore } from '../store/createStore'
import type { RootState } from '../store/createStore'

export interface PlayersSlice {
  applyDeltas: any
  addRound: any
  incrementRound: any
  resetPuttResults: any
  addPuttResult: any
  puttResults: any
  clearHistory: any
  redo: any
  undo: any
  history: any
  redoStack: any
  undoStack: any
  currentRound: any
  matchInProgress: any
  endMatch: any
  resetRounds: any
  resetScores: any
  initializeScores: any
  startMatch: any
  scores: any
  chipResults: any
  addChipResult: any
  resetChipResults: any
  recordEvent: any
  rounds: any
  useShotTimer: any
  toggleHandicap: any
  toggleShotTimer: any
  shotClock: any
  setShotClock: any
  useHandicap: any
  players: Player[]
  addPlayer: (player: Player) => void
  removePlayer: (playerId: PlayerId) => void
  updatePlayer: (player: Player) => void
  resetPlayers: () => void
}

export const createPlayersSlice = (set: any): PlayersSlice => ({
  players: [],
  addPlayer: (player) => set((state: { players: Player[]} ) => {
    state.players.push(player)
  }),
  removePlayer: (playerId) => set((state: { players: any[]} ) => {
    state.players = state.players.filter((p: { playerId: string} ) => p.playerId !== playerId)
  }),
  updatePlayer: (player) => set((state: { players: any[]} ) => {
    const idx = state.players.findIndex((p: { playerId: string} ) => p.playerId === player.playerId)
    if (idx !== -1) state.players[idx] = player
  }),
  resetPlayers: () => set({ players: [] }),
  useShotTimer: undefined,
  toggleHandicap: undefined,
  toggleShotTimer: undefined,
  shotClock: undefined,
  setShotClock: undefined,
  useHandicap: undefined,
  scores: undefined,
  chipResults: undefined,
  addChipResult: undefined,
  resetChipResults: undefined,
  recordEvent: undefined,
  rounds: undefined,
  clearHistory: undefined,
  redo: undefined,
  undo: undefined,
  history: undefined,
  redoStack: undefined,
  undoStack: undefined,
  currentRound: undefined,
  matchInProgress: undefined,
  endMatch: undefined,
  resetRounds: undefined,
  resetScores: undefined,
  initializeScores: undefined,
  startMatch: undefined,
  applyDeltas: undefined,
  addRound: undefined,
  incrementRound: undefined,
  resetPuttResults: undefined,
  addPuttResult: undefined,
  puttResults: undefined
})