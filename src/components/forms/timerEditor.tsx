import Toggle from '../common/toggle'
import NumberInput from '../common/numberInput'
import Card from '../common/card'

interface TimerEditorProps {
  enabled: boolean
  seconds: number
  min?: number
  max?: number
  step?: number
  onToggle: (enabled: boolean) => void
  onChangeSeconds: (seconds: number) => void
}

export default function TimerEditor({
  enabled,
  seconds,
  min = 5,
  max = 120,
  step = 5,
  onToggle,
  onChangeSeconds,
}: TimerEditorProps) {
  return (
    <Card title="Shot Timer" subtitle="Enable and set the per-shot clock.">
      <div className="flex items-center gap-3">
        <Toggle checked={enabled} onChange={onToggle} />
        <span className="text-sm">Enabled</span>
        {enabled && (
          <div className="flex items-center gap-2 ml-3">
            <span className="text-sm opacity-80">Seconds</span>
            <NumberInput
              value={seconds}
              onChange={(n) => onChangeSeconds(Math.max(min, Math.min(max, n)))}
              min={min}
              max={max}
              step={step}
              style={{ width: 88 }}
            />
          </div>
        )}
      </div>
    </Card>
  )
}