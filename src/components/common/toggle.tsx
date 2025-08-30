//toggle
import { HTMLAttributes } from 'react'

interface ToggleProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked: boolean
  onChange: (next: boolean) => void
  label?: string
  disabled?: boolean
}

export default function Toggle({ checked, onChange, label, disabled, ...rest }: ToggleProps) {
  return (
    <button
      {...rest}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`inline-flex items-center rounded-full border ${rest.className ?? ''}`}
      style={{
        padding: 2,
        width: 48,
        height: 28,
        background: checked ? 'rgba(59,130,246,0.20)' : '#f6f6f7',
        borderColor: checked ? '#2563eb' : '#d7d7db',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background 120ms ease, border-color 120ms ease',
      }}
    >
      <span
        aria-hidden
        style={{
          display: 'inline-block',
          width: 22,
          height: 22,
          borderRadius: 9999,
          background: checked ? '#2563eb' : '#999',
          transform: `translateX(${checked ? 20 : 0}px)`,
          transition: 'transform 120ms ease, background 120ms ease',
        }}
      />
    </button>
  )
}