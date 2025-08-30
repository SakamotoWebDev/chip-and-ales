//card
import { ReactNode } from 'react'

interface CardProps {
  title?: ReactNode
  subtitle?: ReactNode
  rightSlot?: ReactNode
  children?: ReactNode
  footer?: ReactNode
}

export default function Card({ title, subtitle, rightSlot, children, footer }: CardProps) {
  return (
    <div
      className="rounded-2xl border"
      style={{ padding: 12, background: '#fff' }}
    >
      {(title || rightSlot || subtitle) && (
        <div className="mb-2 flex items-start justify-between gap-3">
          <div>
            {title && <div className="text-lg font-semibold">{title}</div>}
            {subtitle && <div className="text-sm opacity-80">{subtitle}</div>}
          </div>
          {rightSlot}
        </div>
      )}
      <div>{children}</div>
      {footer && <div className="mt-3 border-t pt-2">{footer}</div>}
    </div>
  )
}