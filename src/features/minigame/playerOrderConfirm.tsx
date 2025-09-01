// /src/features/minigame/playerOrderConfirm.tsx
import { useMemo } from 'react'
import { useRootStore } from '../../store/createStore'
import { getTurnOrder } from '../../lib/orderEngine'

export default function PlayerOrderConfirm({ onConfirm }: { onConfirm: () => void }) {
  const players = useRootStore(s => s.players)
  const scores = useRootStore(s => s.scores)
  const rounds = useRootStore(s => s.rounds)

  const lastRoundWinnerId = useMemo(() => rounds.at(-1)?.winnerId, [rounds])
  const order = useMemo(() => getTurnOrder(scores, lastRoundWinnerId), [scores, lastRoundWinnerId])

  return (
    <div className="rounded-2xl border p-3 sm:p-4">
      <div className="mb-2 text-lg font-semibold">Turn Order (highest → lowest)</div>
      <ol className="list-decimal pl-5 space-y-1">
        {order.map(pid => {
          const p = players.find(pp => pp.playerId === pid)
          return <li key={pid}>{p?.name ?? pid}</li>
        })}
      </ol>
      <div className="mt-3"
            style={{ display: 'flex' , justifyContent: 'flex-end' }}>
        <button
          className="rounded-xl border px-4 py-2 hover:opacity-80 active:scale-[0.98]"
          onClick={onConfirm}
        >
          Looks good — Start Chipping
        </button>
      </div>
    </div>
  )
}