import { PlayerId } from '../../types/domain'

type Item = { playerId: PlayerId; name: string; color?: string }
type Props = {
  players: Item[]
  disabled?: boolean
  selectedPlayerId?: PlayerId
  onSelect: (playerId: PlayerId) => void
}

/** Rank-only UI: pick exactly one closest winner (no distances). */
export default function JudgeGrid({ players, disabled, selectedPlayerId, onSelect }: Props) {
  return (
    <div className="rounded-2xl border p-3 sm:p-4">
      <div className="mb-2 text-lg font-semibold">Judge: Closest Chip</div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {players.map((p) => {
          const isSelected = p.playerId === selectedPlayerId
          return (
            <label
              key={p.playerId}
              className="flex cursor-pointer items-center justify-between rounded-xl border p-2"
              style={{
                background: isSelected ? 'rgba(0,0,0,0.04)' : undefined,
                transition: 'transform 120ms ease, opacity 120ms ease',
                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  style={{
                    display: 'inline-block',
                    width: 12,
                    height: 12,
                    borderRadius: 9999,
                    background: p.color || '#999',
                  }}
                />
                <span className="font-medium">{p.name}</span>
              </div>
              <input
                type="radio"
                name="closest"
                disabled={disabled}
                checked={isSelected}
                onChange={() => onSelect(p.playerId)}
              />
            </label>
          )
        })}
      </div>
      {disabled && (
        <div className="mt-2 text-xs opacity-70">
          Closest pick disabled (a chip was holed-out this round).
        </div>
      )}
    </div>
  )
}