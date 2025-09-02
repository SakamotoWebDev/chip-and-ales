import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useMemo, useState } from 'react'
import { useRootStore } from '../../store/createStore'
import StartLocationPicker from './startLocationPicker'
import PlayerOrderConfirm from './playerOrderConfirm'
import ChippingController from '../chipping/chippingController'
import PuttingController from '../putting/puttingController'
import EndRoundSummary from './endRoundSummary'
import GameResult from './gameResult'
import { PlayerId, RoundRecord } from '../../types/domain'
import { NavLink, useNavigate } from 'react-router-dom'
import Button from '@/components/common/button'

 type Phase =
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

  const [phase, setPhase] = useState<Phase>('startLocation')
  const [startLocation, setStartLocation] = useState('')
  const [closestWinnerId, setClosestWinnerId] = useState<PlayerId | undefined>(undefined)
  const [pendingRoundId, setPendingRoundId] = useState<string>('')
  const [lastRound, setLastRound] = useState<RoundRecord | null>(null)
  const [matchWinnerId, setMatchWinnerId] = useState<PlayerId | undefined>(undefined)

  const navigate = useNavigate()
  const matchWinnerName = useMemo(() => {
    if (!matchWinnerId) return undefined
    const p = players.find(pp => pp.playerId === matchWinnerId)
    return p?.name
  }, [matchWinnerId, players])

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
    setPhase('startLocation')
  }

  const handleCancelMatch = () => {
    endMatch()
    resetScores()
    resetRounds()
    setPhase('startLocation')
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
        <></>
      </div>

      <div style={{ paddingBottom: 120 }}>

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
          <div className="max-w-3xl mx-auto p-3">
            {scoringUI}
          </div>
        </div>
      )}

   
      {/* Phase router */}
      <div>
        {phase === 'startLocation' && (
        <StartLocationPicker
          previousWinnerName={lastRoundWinnerName}
          onConfirm={(loc) => {
            setStartLocation(loc)
            setPhase('orderConfirm')
          }}
        />
      )}

      {phase === 'orderConfirm' && (
        <PlayerOrderConfirm 
        onConfirm={() => {startMatch(), setPhase('chipping') }} />
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

      { phase === 'result' && matchWinnerId && (
        <div className="rounded-2xl border p-3 sm:p-4">
          <div className="w-full max-w-2xl rounded-2xl border bg-white dark:bg-neutral-900 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Match Complete</h2>
              <span className="text-xs opacity-60">Rounds played: {currentRound}</span>
            </div>

            <div className="rounded-xl border p-3">
              <div className="text-sm font-semibold">Winner</div>
              <div className="mt-1 text-2xl font-bold">{matchWinnerName ?? '—'}</div>
            </div>

            <div className="rounded-xl border p-3">
              <div className="text-sm font-semibold mb-2">Final Scores</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[...scores].sort((a, b) => b.total - a.total).map((s) => {
                  const p = players.find(pl => pl.playerId === s.playerId)
                  return (
                    <div key={s.playerId as string} className="flex items-center justify-between rounded-lg border p-2">
                      <span className="font-medium">{p?.name ?? 'Unknown'}</span>
                      <span className="text-lg tabular-nums">{s.total}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                className="rounded-xl border px-4 py-2 hover:opacity-80 active:scale-[0.98]"
                onClick={() => navigate('/summary')}
              >
                View Summary
              </Button>
              <Button
                className="rounded-xl border px-4 py-2 hover:opacity-80 active:scale-[0.98]"
                onClick={() => {
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
              >
                Start New Match
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
      <footer className="max-w-4xl mx-auto space-y-10 p-4">
        {matchInProgress && (
          <Button
            className="rounded-xl border px-4 py-2 hover:opacity-80 active:scale-[0.98] w-full"
            variant='outline'
            tone='danger'
            weight='md'
            onClick={handleCancelMatch}
          >
            End Match
          </Button>
        )}
      </footer>
    </div>
  )
}