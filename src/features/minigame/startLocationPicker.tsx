// /src/features/minigame/startLocationPicker.tsx
import { useState } from 'react'
import Button from '@/components/common/button'

type Props = {
  previousWinnerName?: string
  onConfirm: (location: string) => void
}

export default function StartLocationPicker({ previousWinnerName, onConfirm }: Props) {
  const [value, setValue] = useState('')

  return (
    <div className="rounded-2xl border p-3 sm:p-4">
      <div className="mb-2 text-lg font-semibold">Choose Starting Location</div>
      {previousWinnerName && (
        <div className="mb-2 text-sm opacity-80">
          Previous round winner <b>{previousWinnerName}</b> selects the start.
        </div>
      )}
      <input
        className="w-full rounded-md border px-3 py-2"
        placeholder="e.g., 25 yards, behind bunker, left pin"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="mt-3 flex gap-2"
            style={{ display: 'flex' , justifyContent: 'flex-end' }}>
        <Button
          variant='solid'
          tone='success'
          size='md'
          weight='md'
          onClick={() => onConfirm(value.trim() || 'unspecified')}
        >
          Confirm & Continue
        </Button>
      </div>
    </div>
  )
}