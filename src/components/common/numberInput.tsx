//numberInput
import { InputHTMLAttributes, useEffect, useState } from 'react'

interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: number
  onChange: (next: number) => void
  min?: number
  max?: number
  step?: number
  clamp?: boolean
}

export default function NumberInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  clamp = true,
  ...rest
}: NumberInputProps) {
  const [text, setText] = useState(String(value ?? ''))

  useEffect(() => {
    setText(String(value ?? ''))
  }, [value])

  const commit = (raw: string) => {
    let n = Number(raw)
    if (!isFinite(n)) n = 0
    if (clamp) {
      if (typeof min === 'number') n = Math.max(min, n)
      if (typeof max === 'number') n = Math.min(max, n)
    }
    onChange(n)
  }

  return (
    <input
      {...rest}
      className={`rounded-md border px-3 py-2 ${rest.className ?? ''}`}
      inputMode="decimal"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={(e) => commit(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.currentTarget.blur()
        }
        if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && step) {
          e.preventDefault()
          const next = Number(text || 0) + (e.key === 'ArrowUp' ? step : -step)
          commit(String(next))
        }
      }}
    />
  )
}