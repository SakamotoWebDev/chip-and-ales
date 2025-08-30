import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRootStore } from '../store/createStore'
import type { RootState } from '../store/createStore'
import { generateId } from '../lib/id'
import { Player } from '../types/domain'

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
      <header className="flex items-center justify-between rounded-2xl border p-3">
        <div>
          <div className="text-xl font-semibold">Chip N Dales</div>
          <div className="text-sm opacity-80">Score tracker for your two-part mini game</div>
        </div>
        <button
          className="rounded-xl border px-4 py-2 hover:opacity-80 active:scale-[0.98]"
          disabled={!canStart}
          onClick={() => navigate('/game')}
        >
          Start Match
        </button>
      </header>

      {/* Players */}
      <section className="rounded-2xl border p-3 space-y-3">
        <div className="text-lg font-semibold">Players (2–6)</div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            className="flex-1 rounded-md border px-3 py-2"
            placeholder="Player name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <input
            className="rounded-md border px-2 py-2 w-28"
            type="color"
            value={color}
            onChange={e => setColor(e.target.value)}
            title="Player color"
          />
          <button
            className="rounded-xl border px-4 py-2 hover:opacity-80 active:scale-[0.98]"
            onClick={onAddPlayer}
          >
            Add
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {players.map(p => (
            <div key={p.playerId} className="flex items-center justify-between rounded-xl border p-2">
              <div className="flex items-center gap-2">
                <span
                  aria-label="color"
                  style={{ backgroundColor: p.color, width: 14, height: 14, borderRadius: 9999 }}
                />
                <span className="font-medium">{p.name}</span>
              </div>
              <button
                className="rounded-lg border px-3 py-1 hover:opacity-80 active:scale-[0.98]"
                onClick={() => removePlayer(p.playerId)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {players.length > 0 && (
          <div className="pt-2">
            <button
              className="rounded-xl border px-4 py-2 hover:opacity-80 active:scale-[0.98]"
              onClick={resetPlayers}
            >
              Clear Players
            </button>
          </div>
        )}
      </section>

      {/* Rules / Options */}
      <section className="rounded-2xl border p-3 space-y-4">
        <div className="text-lg font-semibold">Options</div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={useHandicap} onChange={toggleHandicap} />
            Use handicap
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={useShotTimer} onChange={toggleShotTimer} />
            Shot timer
          </label>
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

        <details className="rounded-xl border p-3">
          <summary className="cursor-pointer font-medium">How the game works</summary>
          <ul className="mt-2 list-disc pl-5 text-sm space-y-1">
            <li>Two-part round: Chipping then Putting.</li>
            <li>Closest chip gets +1 (only if nobody holes out).</li>
            <li>Each made putt is +2 (players who holed out skip putt).</li>
            <li>Chip hole-out is +4 and skips putting.</li>
            <li>First to 7 with a 2-point lead wins the match.</li>
            <li>2–6 players; turn order is highest score → lowest score.</li>
          </ul>
        </details>
      </section>

      <footer className="flex justify-end">
        <button
          className="rounded-xl border px-4 py-2 hover:opacity-80 active:scale-[0.98]"
          disabled={!canStart}
          onClick={() => navigate('/game')}
        >
          Start Match
        </button>
      </footer>
    </div>
  )
}