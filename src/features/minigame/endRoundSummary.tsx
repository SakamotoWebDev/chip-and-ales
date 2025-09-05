// /src/features/minigame/endRoundSummary.tsx
import { useMemo } from 'react'
import { useRootStore } from '../../store/createStore'
import { RoundRecord } from '../../types/domain'
import Button from '@/components/common/button';

export default function EndRoundSummary({ round, onNextRound }: { round: RoundRecord; onNextRound: () => void }) {
  const players = useRootStore(s => s.players)

  const winnerName = useMemo(() => players.find(p => p.playerId === round.winnerId)?.name, [players, round.winnerId])

  return (
    <div className="rounded-2xl border p-3 sm:p-4 ">
      <div className="mb-2 text-lg font-semibold">Round Complete</div>

      <div className="mb-2 text-sm opacity-80">Start: {round.startLocation}</div>

      <div className="mb-3">
        <div className="text-sm font-semibold">Deltas</div>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {round.deltas.map((d) => {
            const p = players.find(pp => pp.playerId === d.playerId)
            return (
              <div key={d.playerId + ':' + d.delta} className="flex items-center justify-between rounded-xl border p-2">
                <div>{p?.name ?? d.playerId}</div>
                <div className="text-lg tabular-nums">{d.delta > 0 ? `+${d.delta}` : d.delta}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mb-3 text-sm">
        Round winner: <b>{winnerName ?? '—'}</b>
      </div>
      <div style={{ display: 'flex' , justifyContent: 'flex-end' }}>
        <Button
          className="rounded-xl border px-4 py-2 hover:opacity-80 active:scale-[0.98]"
          tone= "success"
          onClick={onNextRound} >
          Next Round
          </Button>
      </div>
    </div>
  )
}
