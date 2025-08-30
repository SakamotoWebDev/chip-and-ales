// /src/store/history.slice.ts

import { GameEvent, GameEventType } from '../types/events'

export interface HistorySlice {
  history: GameEvent[]
  undoStack: GameEvent[]
  redoStack: GameEvent[]
  recordEvent: (event: GameEvent) => void
  undo: () => void
  redo: () => void
  clearHistory: () => void
}

export const createHistorySlice = (set: any, get: any): HistorySlice => ({
  history: [],
  undoStack: [],
  redoStack: [],

  recordEvent: (event) =>
    set((state: { history: GameEvent<GameEventType>[]; undoStack: GameEvent<GameEventType>[]; redoStack: never[] }) => {
      state.history.push(event)
      state.undoStack.push(event)
      state.redoStack = [] // Clear redo on new action
    }),

  undo: () => {
    const stack = get().undoStack
    if (stack.length === 0) return
    const last = stack[stack.length - 1]
    set((state: { undoStack: void[]; redoStack: any[] }) => {
      state.undoStack.pop()
      state.redoStack.push(last)
    })
  },

  redo: () => {
    const stack = get().redoStack
    if (stack.length === 0) return
    const last = stack[stack.length - 1]
    set((state: { redoStack: void[]; undoStack: any[] }) => {
      state.redoStack.pop()
      state.undoStack.push(last)
    })
  },

  clearHistory: () => set({ history: [], undoStack: [], redoStack: [] })
})