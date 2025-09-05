import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRootStore } from '@/store/createStore'
import type { RootState } from '@/store/createStore'
import { generateId } from '@/lib/id'
import { Player } from '@/types/domain'
import PlayerSetup from '@/features/setup/playerSetup'
import Button from '@/components/common/button'

export default function HomePage() {
  const navigate = useNavigate()

  // players
  const players = useRootStore(s => s.players)
  const addPlayer = useRootStore(s => s.addPlayer)
  const removePlayer = useRootStore(s => s.removePlayer)
  const resetPlayers = useRootStore(s => s.resetPlayers)

  // settings
  const useHandicap = useRootStore((s: RootState) => s.useHandicap)
  const useShotTimer = useRootStore((s: RootState) => s.useShotTimer)
  const toggleHandicap = useRootStore((s: RootState) => s.toggleHandicap)
  const toggleShotTimer = useRootStore((s: RootState) => s.toggleShotTimer)
  // timer
  const shotClock = useRootStore((s: RootState) => s.shotClock)
  const setShotClock = useRootStore((s: RootState) => s.setShotClock)
  // scoring / rounds
  const initializeScores = useRootStore(s => s.initializeScores)
  const resetScores = useRootStore(s => s.resetScores)
  const resetRounds = useRootStore(s => s.resetRounds)
  // local new player
  const [name, setName] = useState('')
  const [color, setColor] = useState('#3b82f6') // default blue

  const canStart = players.length >= 2 && players.length <= 6

  const onAddPlayer = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    const player: Player = {
      playerId: generateId('p_'),
      name: trimmed,
      color,
    }
    addPlayer(player)
    setName('')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 p-4">
      <header className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border p-3">
  <div className="flex-1 pr-6 min-w-[260px]">
    <div className="text-sm opacity-90">Score tracker for a two-part golf minigame.</div>
    <div className="text-sm opacity-80">Complete Player and Rule setup here before starting the match.</div>
  </div>
  <div className="shrink-0" />
</header>

      {/* ideal Start Button location */}
      <section className="rounded-2xl border p-3">
        <Button
          className="w-full"
          disabled={!canStart}
          tone="success"
          onClick={() => {
            if (!canStart) {
              alert('Need 2–6 players before starting.')
              return
            }
            // Prepare a fresh match session
            resetScores()
            resetRounds()
            initializeScores(players.map(p => p.playerId))
            navigate('/game')
          }}
        >
          Start Match
        </Button>
      </section>

      <PlayerSetup showHandicap={useHandicap} />

      {/* Rules / Options */}
      <section className="rounded-2xl border p-3 space-y-4">
        <div className="text-lg font-semibold">Rules and Options</div>

        <details className="rounded-xl border p-3">
          <summary className="cursor-pointer font-medium">How the game works</summary>
          <div className="mt-2 list-disc pl-5 text-md"
              style={{ display: 'flex', flexDirection: 'column', gap: 36 }}
              >
            <div>
              <li>Each Round has two parts: Chipping then Putting.</li>
              <li>First to 7 with a 2-point lead wins the match. /OR/ First to a 2-point lead after 7 wins the match.</li>
              <li>Single Ball Sudden Death rounds begin at 11 points if still tied or within 1 pt.</li>
              </div>
            <div>
              <li>Closest chip gets +1 (only if nobody holes out).</li>
              <li>Each made putt is +2 (All players putt their closest ball).</li>
              <li>Chip hole-out is +4  (and that player skips putting).</li>
              </div>
            <div>
              <li>2–4 players; 3 balls per player.</li>
              <li>Chipping Order is always highest score → lowest score.</li>
              <li>Putting Order is Farthest → Closest.</li>
              </div>
          </div>
        </details>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={useHandicap} onChange={toggleHandicap} />Use handicap</label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={useShotTimer} onChange={toggleShotTimer} />Shot timer</label>
          {useShotTimer && (
            <div className="flex items-center gap-2">
              <span className="text-sm opacity-80">Seconds:</span>
              <input
                className="w-24 rounded-md border px-2 py-1"
                type="number"
                min={5}
                max={120}
                step={5}
                value={shotClock}
                onChange={e => setShotClock(Math.max(5, Math.min(120, Number(e.target.value) || 0)))}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}