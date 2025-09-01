// /src/features/minigame/gameDashboard.tsx
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useMemo, useState } from 'react'
import { useRootStore } from '../../store/createStore'
import StartLocationPicker from './startLocationPicker'
import PlayerOrderConfirm from './playerOrderConfirm'
import ChippingController from '../chipping/chippingController'
import PuttingController from '../putting/puttingController'
import EndRoundSummary from './endRoundSummary'
import GameResult from './gameResult'
import { PlayerId, RoundRecord } from '../../types/domain'
import { NavLink } from 'react-router-dom'

 type Phase =
  | 'idle'
  | 'startLocation'
  | 'orderConfirm'
  | 'chipping'
  | 'putting'
  | 'endRound'
  | 'result'

export default function GameDashboard() {
  const players = useRootStore(s => s.players)
  const scores = useRootStore(s => s.scores)
  const currentRound = useRootStore(s => s.currentRound)
  const matchInProgress = useRootStore(s => s.matchInProgress)

  const startMatch = useRootStore(s => s.startMatch)
  const endMatch = useRootStore(s => s.endMatch)
  const initializeScores = useRootStore(s => s.initializeScores)
  const resetScores = useRootStore(s => s.resetScores)
  const resetRounds = useRootStore(s => s.resetRounds)

  const [phase, setPhase] = useState<Phase>('idle')
  const [startLocation, setStartLocation] = useState('')
  const [closestWinnerId, setClosestWinnerId] = useState<PlayerId | undefined>(undefined)
  const [pendingRoundId, setPendingRoundId] = useState<string>('')
  const [lastRound, setLastRound] = useState<RoundRecord | null>(null)
  const [matchWinnerId, setMatchWinnerId] = useState<PlayerId | undefined>(undefined)

    // From ChippingController → proceed to Putting
  const handleChippingComplete = (args: { roundId: string; closestWinnerId?: PlayerId }) => {
    setPendingRoundId(args.roundId)
    setClosestWinnerId(args.closestWinnerId)
    setPhase('putting')
  }

  // From PuttingController → finalize round; maybe end match
  const handleRoundComplete = (args: { round: RoundRecord; matchWinnerId?: PlayerId }) => {
    setLastRound(args.round)
    if (args.matchWinnerId) {
      setMatchWinnerId(args.matchWinnerId)
      setPhase('result')
      return
    }
    setPhase('endRound')
  }

  // Active scoring UI (shown in sticky bottom panel during chipping/putting)
  const scoringUI = matchInProgress && (phase === 'chipping' || phase === 'putting')
    ? (
        phase === 'putting' ? (
          <PuttingController
            roundId={pendingRoundId}
            closestWinnerId={closestWinnerId}
            onRoundComplete={handleRoundComplete}
          />
        ) : (
          <ChippingController
            startLocation={startLocation}
            onComplete={({ roundId, closestWinnerId }) => handleChippingComplete({ roundId, closestWinnerId })}
          />
        )
      )
    : null

  const lastRoundWinnerName = useMemo(() => {
    if (!lastRound?.winnerId) return undefined
    const p = players.find(pp => pp.playerId === lastRound.winnerId)
    return p?.name
  }, [lastRound, players])

  const canStart = players.length >= 2 && players.length <= 6

  const handleStartMatch = () => {
    if (!canStart) {
      alert('Need 2–4 players before starting.')
      return
    }
    initializeScores(players.map(p => p.playerId))
    startMatch()
    setPhase('startLocation')
  }

  const handleCancelMatch = () => {
    endMatch()
    resetScores()
    resetRounds()
    setPhase('idle')
    setStartLocation('')
    setClosestWinnerId(undefined)
    setPendingRoundId('')
    setLastRound(null)
    setMatchWinnerId(undefined)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-2xl border p-3">
        <div>
          <div className="text-lg font-semibold">Match Dashboard</div>
          <div className="text-sm opacity-80">
            {matchInProgress ? `Round ${currentRound}` : 'No active match'} · Players: {players.length}
          </div>
        </div>
        <div className="flex gap-2">
          {!matchInProgress ? (
            <button className="rounded-xl border px-4 py-2 hover:opacity-80 active:scale-[0.98]" onClick={handleStartMatch}>
              Start Match
            </button>
          ) : (
            <button className="rounded-xl border px-4 py-2 hover:opacity-80 active:scale-[0.98]" onClick={handleCancelMatch}>
              End Match
            </button>
          )}
        </div>
      </div>

      <div style={{ paddingBottom: 168 }}>

      {/* Quick scoreboard */}
      {matchInProgress && (
        <div className="rounded-2xl border p-3 max-w-3xl mx-auto">
          <div className="mb-2 text-sm font-semibold">Scoreboard</div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {scores.map((s: { playerId: Key | null | undefined; total: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }) => {
              const p = players.find(pl => pl.playerId === s.playerId)
              return (
                <div key={s.playerId} className="flex items-center justify-between rounded-xl border p-2">
                  <div className="font-medium">{p?.name ?? 'Unknown'}</div>
                  <div className="text-lg tabular-nums">{s.total}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}
      </div>
      {matchInProgress && scoringUI && (
        <div className="bottom_panel">
          <div className="max-w-5xl mx-auto p-3">
            {scoringUI}
          </div>
        </div>
      )}

   
      {/* Phase router */}
      <div className="bottom_panel">
        {!matchInProgress && (
        <div className="rounded-2xl border p-3 text-sm opacity-80">
          Add players (2–4) in setup, then click <em>Start Match</em>.
        </div>
      )}

      {matchInProgress && phase === 'startLocation' && (
        <StartLocationPicker
          previousWinnerName={lastRoundWinnerName}
          onConfirm={(loc) => {
            setStartLocation(loc)
            setPhase('orderConfirm')
          }}
        />
      )}

      {matchInProgress && phase === 'orderConfirm' && (
        <PlayerOrderConfirm onConfirm={() => setPhase('chipping')} />
      )}

      {matchInProgress && phase === 'endRound' && lastRound && (
        <EndRoundSummary
          round={lastRound}
          onNextRound={() => {
            setStartLocation('')
            setClosestWinnerId(undefined)
            setPendingRoundId('')
            setPhase('startLocation')
          }}
        />
      )}

      {matchInProgress && phase === 'result' && matchWinnerId && (
        <GameResult
          winnerId={matchWinnerId}
          onStartNewMatch={() => {
            // Keep players; clear scores/rounds and start again
            resetScores()
            resetRounds()
            initializeScores(players.map(p => p.playerId))
            setMatchWinnerId(undefined)
            setLastRound(null)
            setStartLocation('')
            setClosestWinnerId(undefined)
            setPendingRoundId('')
            setPhase('startLocation')
          }}
        />
      )}
    </div>
    </div>
  )
}