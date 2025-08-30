import { ReactNode } from 'react'

type OrderItem = { playerId: string; name: string }
type Props = {
  startLocation: string
  order: OrderItem[]
  rightSlot?: ReactNode
  onEditStartLocation?: () => void
}

export default function RoundBanner({ startLocation, order, rightSlot, onEditStartLocation }: Props) {
  return (
    <div className="rounded-2xl border p-3 sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-semibold">Round</div>
          <div className="text-sm opacity-80">
            Start location: <b>{startLocation || 'unspecified'}</b>
            {onEditStartLocation && (
              <button
                className="ml-2 rounded-lg border px-2 py-0.5 text-xs hover:opacity-80 active:scale-[0.98]"
                onClick={onEditStartLocation}
              >
                edit
              </button>
            )}
          </div>
          <div className="mt-2 text-sm">
            Order:&nbsp;
            {order.map((o, i) => (
              <span key={o.playerId}>
                <b>{o.name}</b>
                {i < order.length - 1 ? ' → ' : ''}
              </span>
            ))}
          </div>
        </div>
        {rightSlot}
      </div>
    </div>
  )
}