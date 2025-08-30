// Primitive types
export type PlayerId = string
export type MatchId = string
export type RoundId = string

// Player setup
export interface Player {
  playerId: PlayerId
  name: string
  color: string // UI preference
  handicap?: number
}

// Real-time game score
export interface PlayerScore {
  name: any
  playerId: PlayerId
  total: number
  history: number[] // per round deltas
}

// Individual chip per player (per ball)
export interface ChipResult {
  playerId: PlayerId
  distance: number // in meters or points of proximity
  holed?: boolean  // 4 pt condition
}

// One putt per player per round
export interface PuttResult {
  playerId: PlayerId
  made: boolean
}

// Round delta result (who earned what that round)
export interface ScoreDelta {
  playerId: PlayerId
  delta: number
}

// Round data
export interface RoundRecord {
  roundId: RoundId
  chipResults: ChipResult[]
  puttResults: PuttResult[]
  deltas: ScoreDelta[]
  winnerId?: PlayerId
  startLocation: string // user input or location label
}

// Final match score summary
export interface MatchRecord {
  matchId: MatchId
  players: PlayerScore[]
  rounds: RoundRecord[]
  matchWinnerId?: PlayerId
  timestamp: number
}