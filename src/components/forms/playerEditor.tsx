import { ChangeEvent } from 'react'
import { Player, PlayerId } from '../../types/domain'
import NumberInput from '../common/numberInput'
import Button from '../common/button'

interface PlayerEditorProps {
  player: Player
  showHandicap?: boolean
  onChange: (next: Player) => void
  onRemove?: (playerId: PlayerId) => void
}

export default function PlayerEditor({
  player,
  showHandicap = false,
  onChange,
  onRemove,
}: PlayerEditorProps) {
  const onName = (e: ChangeEvent<HTMLInputElement>) =>
    onChange({ ...player, name: e.target.value })

  const onColor = (e: ChangeEvent<HTMLInputElement>) =>
    onChange({ ...player, color: e.target.value })

  const onHcp = (n: number) =>
    onChange({ ...player, handicap: n })

  return (
    <div className="flex items-center justify-between rounded-xl border p-2">
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          style={{ width: 12, height: 12, borderRadius: 9999, background: player.color }}
        />
        <input
          className="rounded-md border px-2 py-1"
          value={player.name}
          onChange={onName}
          placeholder="Player name"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          className="rounded-md border px-2 py-1 w-24"
          type="color"
          value={player.color}
          onChange={onColor}
          title="Color"
        />
        {showHandicap && (
          <div className="flex items-center gap-1">
            <span className="text-xs opacity-70">HCP</span>
            <NumberInput
              aria-label="Handicap"
              value={player.handicap ?? 0}
              onChange={onHcp}
              min={-10}
              max={10}
              step={1}
              style={{ width: 72 }}
            />
          </div>
        )}
        {onRemove && (
          <Button variant="outline" onClick={() => onRemove(player.playerId)}>
            Remove
          </Button>
        )}
      </div>
    </div>
  )
}