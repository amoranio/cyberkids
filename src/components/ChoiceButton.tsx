import type { ReactNode } from 'react'
import './ChoiceButton.css'

type Props = {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'danger'
  selected?: boolean
  disabled?: boolean
  type?: 'button' | 'submit'
  className?: string
  ariaLabel?: string
}

export function ChoiceButton({
  children,
  onClick,
  variant = 'primary',
  selected,
  disabled,
  type = 'button',
  className = '',
  ariaLabel,
}: Props) {
  return (
    <button
      type={type}
      className={`choice choice--${variant} ${selected ? 'choice--selected' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={selected}
    >
      {children}
    </button>
  )
}
