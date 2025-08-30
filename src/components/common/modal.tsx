//modal
import { ReactNode, useEffect } from 'react'
import Button from './button'

interface ModalProps {
  open: boolean
  title?: ReactNode
  children?: ReactNode
  onClose: () => void
  footer?: ReactNode
  dismissText?: string
}

export default function Modal({ open, title, children, onClose, footer, dismissText = 'Close' }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.28)' }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl border shadow-lg"
        style={{ background: '#fff', width: 'min(640px, 92vw)', padding: 16, transform: 'scale(1.0)', transition: 'transform 120ms ease' }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && <div className="mb-2 text-lg font-semibold">{title}</div>}
        <div>{children}</div>
        <div className="mt-3 flex items-center justify-end gap-2">
          {footer}
          <Button onClick={onClose}>{dismissText}</Button>
        </div>
      </div>
    </div>
  )
}