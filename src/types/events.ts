// Game-level event types for debugging, devtools, and undo/redo

export enum GameEventType {
  START_MATCH = 'START_MATCH',
  START_ROUND = 'START_ROUND',
  CHIP_COMPLETE = 'CHIP_COMPLETE',
  PUTT_COMPLETE = 'PUTT_COMPLETE',
  SCORE_UPDATED = 'SCORE_UPDATED',
  MATCH_COMPLETE = 'MATCH_COMPLETE',
  UNDO = 'UNDO',
  REDO = 'REDO',
}

export interface GameEventPayloads {
  [GameEventType.START_MATCH]: { matchId: string }
  [GameEventType.START_ROUND]: { roundId: string }
  [GameEventType.CHIP_COMPLETE]: { playerId: string; distance: number; holed: boolean }
  [GameEventType.PUTT_COMPLETE]: { playerId: string; made: boolean }
  [GameEventType.SCORE_UPDATED]: { playerId: string; newTotal: number }
  [GameEventType.MATCH_COMPLETE]: { winnerId: string }
  [GameEventType.UNDO]: {}
  [GameEventType.REDO]: {}
}

export interface GameEvent<T extends GameEventType = GameEventType> {
  type: T
  payload: GameEventPayloads[T]
  timestamp: number
}