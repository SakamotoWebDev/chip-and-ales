//button
import { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'solid' | 'outline' | 'ghost'
type ButtonTone = 'neutral' | 'primary' | 'success' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  tone?: ButtonTone
  size?: ButtonSize
  fullWidth?: boolean
  loading?: boolean
  iconLeft?: ReactNode
  iconRight?: ReactNode
}

const toneColors: Record<ButtonTone, { bg: string; fg: string; bd: string }> = {
  neutral: { bg: '#f6f6f7', fg: '#111', bd: '#d7d7db' },
  primary: { bg: '#2563eb', fg: '#fff', bd: '#1e4fd6' },
  success: { bg: '#16a34a', fg: '#fff', bd: '#0f7a37' },
  danger:  { bg: '#dc2626', fg: '#fff', bd: '#b71c1c' },
}

const sizePad: Record<ButtonSize, { px: number; py: number; fs: number; br: number }> = {
  sm: { px: 10, py: 6, fs: 12, br: 10 },
  md: { px: 14, py: 8, fs: 14, br: 12 },
  lg: { px: 18, py: 12, fs: 16, br: 14 },
}

export default function Button({
  variant = 'solid',
  tone = 'neutral',
  size = 'md',
  fullWidth,
  loading,
  iconLeft,
  iconRight,
  disabled,
  children,
  style,
  ...rest
}: ButtonProps) {
  const c = toneColors[tone]
  const s = sizePad[size]

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: `${s.py}px ${s.px}px`,
    fontSize: s.fs,
    borderRadius: s.br,
    borderWidth: 1,
    borderStyle: 'solid',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'transform 120ms ease, opacity 120ms ease, background 120ms ease, border-color 120ms ease',
    width: fullWidth ? '100%' : undefined,
    opacity: disabled ? 0.55 : 1,
    userSelect: 'none',
  }

  const variantStyle: Record<ButtonVariant, React.CSSProperties> = {
    solid:   { background: c.bg, color: c.fg, borderColor: c.bd },
    outline: { background: 'transparent', color: c.bg === '#f6f6f7' ? '#222' : c.bg, borderColor: c.bg },
    ghost:   { background: 'transparent', color: c.fg, borderColor: 'transparent' },
  }

  return (
    <button
      {...rest}
      disabled={disabled || loading}
      style={{ ...baseStyle, ...variantStyle[variant], ...style }}
      onMouseDown={(e) => {
        if (!disabled) (e.currentTarget.style.transform = 'scale(0.98)')
        rest.onMouseDown?.(e)
      }}
      onMouseUp={(e) => {
        (e.currentTarget.style.transform = 'scale(1.0)')
        rest.onMouseUp?.(e)
      }}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
    >
      {iconLeft && <span aria-hidden>{iconLeft}</span>}
      {loading ? 'Loading…' : children}
      {iconRight && <span aria-hidden>{iconRight}</span>}
    </button>
  )
}