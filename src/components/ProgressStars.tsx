import './ProgressStars.css'

type Props = {
  total?: number
  filled: number
  label?: string
}

export function ProgressStars({ total = 5, filled, label }: Props) {
  return (
    <div
      className="stars"
      role="img"
      aria-label={label ?? `${filled} of ${total} badges`}
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`stars__dot ${i < filled ? 'stars__dot--on' : ''}`}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </div>
  )
}
