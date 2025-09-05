// /src/features/minigame/gameResult.tsx
import { useMemo } from 'react'
import { useRootStore } from '../../store/createStore'
import { PlayerId } from '../../types/domain'
import Button from '@/components/common/button';

export default function GameResult({ winnerId, onStartNewMatch }: { winnerId: PlayerId; onStartNewMatch: () => void }) {
  const players = useRootStore(s => s.players)
  const scores = useRootStore(s => s.scores)

  const winnerName = useMemo(() => players.find(p => p.playerId === winnerId)?.name, [players, winnerId])

  const sorted = useMemo(() => {
    return [...scores].sort((a, b) => b.total - a.total)
  }, [scores])

  return (
    <div className="rounded-2xl border p-3 sm:p-4">
      <div className="mb-2 text-lg font-semibold">Match Result</div>
      <div className="mb-3 text-sm">Winner: <b>{winnerName ?? winnerId}</b></div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map(s => {
          const p = players.find(pp => pp.playerId === s.playerId)
          return (
            <div key={s.playerId} className="flex items-center justify-between rounded-xl border p-2">
              <div>{p?.name ?? s.playerId}</div>
              <div className="text-lg tabular-nums">{s.total}</div>
            </div>
          )
        })}
      </div>

      <div className="mt-4">
        <Button
          className="rounded-xl border px-4 py-2 hover:opacity-80 active:scale-[0.98]"
          tone= "secondary"
          onClick={onStartNewMatch}
        >
          Start New Match
        </Button>
      </div>
    </div>
  )
}