import { PlayerId } from '../../types/domain'
import NumberInput from '../common/numberInput'
import Button from '../common/button'
import Card from '../common/card'

type Item = { playerId: PlayerId; name: string; handicap?: number }

interface HandicapEditorProps {
  items: Item[]
  min?: number
  max?: number
  step?: number
  onChange: (playerId: PlayerId, handicap: number) => void
  onResetAll?: () => void
}

export default function HandicapEditor({
  items,
  min = -10,
  max = 10,
  step = 1,
  onChange,
  onResetAll,
}: HandicapEditorProps) {
  return (
    <Card
      title="Handicap Editor"
      subtitle="Set per-player handicaps (optional)."
      rightSlot={
        onResetAll ? (
          <Button variant="outline" onClick={onResetAll}>Reset All</Button>
        ) : null
      }
    >
      <div className="space-y-2">
        {items.map((it) => (
          <div key={it.playerId} className="flex items-center justify-between rounded-xl border p-2">
            <div className="font-medium">{it.name}</div>
            <NumberInput
              aria-label={`Handicap for ${it.name}`}
              value={it.handicap ?? 0}
              onChange={(n) => onChange(it.playerId, n)}
              min={min}
              max={max}
              step={step}
              style={{ width: 96 }}
            />
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-sm opacity-70">No players yet.</div>
        )}
      </div>
    </Card>
  )
}