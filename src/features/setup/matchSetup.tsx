// /src/features/setup/matchSetup.tsx
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRootStore } from '../../store/createStore'
import Card from '../../components/common/card'
import Button from '../../components/common/button'
import PlayerSetup from './playerSetup'
import RuleSetup from './ruleSetup'

type Props = {
  onStartMatch?: () => void
}

export default function MatchSetup({ onStartMatch }: Props) {
  const players = useRootStore(s => s.players)
  const initializeScores = useRootStore(s => s.initializeScores)
  const startMatch = useRootStore(s => s.startMatch)

  const navigate = useNavigate()
  const canStart = useMemo(() => players.length >= 2 && players.length <= 6, [players.length])

  const handleStart = () => {
    if (!canStart) {
      alert('Add 2–6 players to start a match.')
      return
    }
    initializeScores(players.map(p => p.playerId))
    startMatch()
    if (onStartMatch) onStartMatch()
    else navigate('/game')
  }

  return (
    <div className="space-y-4">
      <PlayerSetup showHandicap={true} />
      <RuleSetup />

      <Card rightSlot={
        <Button tone="primary" onClick={handleStart} disabled={!canStart}>
          Start Match
        </Button>
      }>
        <div className="text-sm opacity-80">
          Players added: <b>{players.length}</b> · {canStart ? 'Ready to play.' : 'Need 2–6 players.'}
        </div>
      </Card>
    </div>
  )
}