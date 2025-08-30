// /src/features/setup/ruleSetup.tsx
import Toggle from '../../components/common/toggle'
import NumberInput from '../../components/common/numberInput'
import Card from '../../components/common/card'
import { useRootStore } from '../../store/createStore'

export default function RuleSetup() {
  const useHandicap = useRootStore(s => s.useHandicap)
  const useShotTimer = useRootStore(s => s.useShotTimer)
  const toggleHandicap = useRootStore(s => s.toggleHandicap)
  const toggleShotTimer = useRootStore(s => s.toggleShotTimer)

  const shotClock = useRootStore(s => s.shotClock)
  const setShotClock = useRootStore(s => s.setShotClock)

  return (
    <Card title="Rules & Options" subtitle="Tweak match behavior.">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="text-sm">Use handicap</span>
          <Toggle checked={useHandicap} onChange={toggleHandicap} />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm">Shot timer</span>
          <Toggle checked={useShotTimer} onChange={toggleShotTimer} />
          {useShotTimer && (
            <div className="flex items-center gap-2">
              <span className="text-sm opacity-80">Seconds</span>
              <NumberInput
                value={shotClock}
                onChange={(n) => setShotClock(Math.max(5, Math.min(120, n)))}
                min={5}
                max={120}
                step={5}
                style={{ width: 88 }}
              />
            </div>
          )}
        </div>

        <details className="rounded-xl border p-2">
          <summary className="cursor-pointer text-sm">Rules recap</summary>
          <ul className="mt-2 list-disc pl-5 text-sm space-y-1">
            <li>Round has two halves: Chipping then Putting.</li>
            <li>Closest chip +1 (only if nobody holes out).</li>
            <li>Made putt +2; players who holed out skip putting.</li>
            <li>Chip hole-out +4 and skip putt.</li>
            <li>First to 7 with a 2-point lead wins the match.</li>
            <li>Turn order: highest score → lowest score; previous round winner breaks ties.</li>
          </ul>
        </details>
      </div>
    </Card>
  )
}