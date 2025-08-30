import { create } from 'zustand';
import { createPlayersSlice, type PlayersSlice } from './players.slice';
import { createElement, Fragment, type ReactNode } from 'react';

// As we add slices, extend this type: `type RootState = PlayersSlice & SettingsSlice & ...`
export type RootState = PlayersSlice;

export const useAppStore = create<RootState>()((...a) => ({
  ...createPlayersSlice(a),
}));

// Compat alias used across controllers
export const useRootStore = useAppStore

// Handy external selectors to keep components crisp
export const selectAllPlayers = (s: RootState) => s.players;
export const selectPlayerById = (id: string) => (s: RootState) => s.players.find(p => p.playerId === id)

export const StoreProvider = ({ children }: { children: ReactNode }) => createElement(Fragment, null, children)