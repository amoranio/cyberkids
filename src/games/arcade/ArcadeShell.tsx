import type { ReactNode, PointerEvent as ReactPointerEvent, RefObject } from 'react'
import { ChoiceButton } from '../../components/ChoiceButton'
import type { Dir } from './math'
import './arcade.css'

type Overlay = 'howto' | 'lose' | null

type Props = {
  title: string
  objective: string
  hint: string
  lives: number
  score: number
  status: string
  maxLives?: number
  showFire?: boolean
  fireLabel?: string
  overlay: Overlay
  howTo: ReactNode
  fieldRef?: RefObject<HTMLDivElement | null>
  children: ReactNode
  onStart: () => void
  onRetry: () => void
  onDir: (dir: Dir) => void
  onDirUp?: (dir: Dir) => void
  onFireDown?: () => void
  onFireUp?: () => void
  onFieldPointerDown?: (e: ReactPointerEvent<HTMLDivElement>) => void
  onFieldPointerMove?: (e: ReactPointerEvent<HTMLDivElement>) => void
  onFieldPointerUp?: (e: ReactPointerEvent<HTMLDivElement>) => void
}

export function ArcadeShell({
  title,
  objective,
  hint,
  lives,
  score,
  status,
  maxLives = 3,
  showFire = false,
  fireLabel = 'ZAP',
  overlay,
  howTo,
  fieldRef,
  children,
  onStart,
  onRetry,
  onDir,
  onDirUp,
  onFireDown,
  onFireUp,
  onFieldPointerDown,
  onFieldPointerMove,
  onFieldPointerUp,
}: Props) {
  const hearts = Array.from({ length: maxLives }, (_, i) => (i < lives ? '♥' : '♡'))

  const padDown = (dir: Dir) => (e: ReactPointerEvent<HTMLButtonElement>) => {
    e.preventDefault()
    onDir(dir)
  }
  const padUp = (dir: Dir) => (e: ReactPointerEvent<HTMLButtonElement>) => {
    e.preventDefault()
    onDirUp?.(dir)
  }

  return (
    <div className="arcade">
      <div className="arcade__top">
        <p className="arcade__objective">{objective}</p>
        <p className="arcade__hint">{hint}</p>
      </div>
      <div className="arcade__hud" aria-live="polite">
        <span className="arcade__lives" aria-label={`${lives} lives`}>
          {hearts.join(' ')}
        </span>
        <span className="arcade__score">Score {score}</span>
      </div>
      <p className="arcade__status">{status}</p>
      <div
        className="arcade__field"
        ref={fieldRef}
        onPointerDown={onFieldPointerDown}
        onPointerMove={onFieldPointerMove}
        onPointerUp={onFieldPointerUp}
        onPointerLeave={onFieldPointerUp}
        onContextMenu={(e) => e.preventDefault()}
        role="application"
        aria-label={title}
      >
        {children}
        {overlay && (
          <div className="arcade__overlay">
            {overlay === 'howto' && (
              <div className="arcade__card">
                <h2>{title}</h2>
                {howTo}
                <ChoiceButton onClick={onStart}>Start</ChoiceButton>
                <p className="arcade__enter">Press Enter or tap Start</p>
              </div>
            )}
            {overlay === 'lose' && (
              <div className="arcade__card">
                <h2>Try again!</h2>
                <p>You still have this game. Hop or zap with care.</p>
                <ChoiceButton onClick={onRetry}>Play again</ChoiceButton>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="arcade__controls">
        <div className="arcade__pad" aria-hidden="true">
          <button
            type="button"
            className="arcade__pad-btn arcade__pad-u"
            tabIndex={-1}
            onPointerDown={padDown('up')}
            onPointerUp={padUp('up')}
            onPointerLeave={padUp('up')}
          >
            ▲
          </button>
          <button
            type="button"
            className="arcade__pad-btn arcade__pad-l"
            tabIndex={-1}
            onPointerDown={padDown('left')}
            onPointerUp={padUp('left')}
            onPointerLeave={padUp('left')}
          >
            ◀
          </button>
          <button
            type="button"
            className="arcade__pad-btn arcade__pad-r"
            tabIndex={-1}
            onPointerDown={padDown('right')}
            onPointerUp={padUp('right')}
            onPointerLeave={padUp('right')}
          >
            ▶
          </button>
          <button
            type="button"
            className="arcade__pad-btn arcade__pad-d"
            tabIndex={-1}
            onPointerDown={padDown('down')}
            onPointerUp={padUp('down')}
            onPointerLeave={padUp('down')}
          >
            ▼
          </button>
        </div>
        {showFire ? (
          <button
            type="button"
            className="arcade__fire"
            tabIndex={-1}
            onPointerDown={(e) => {
              e.preventDefault()
              onFireDown?.()
            }}
            onPointerUp={(e) => {
              e.preventDefault()
              onFireUp?.()
            }}
            onPointerLeave={onFireUp}
            onContextMenu={(e) => e.preventDefault()}
          >
            {fireLabel}
          </button>
        ) : (
          <p className="arcade__touch-tip">Tap the map to hop that way</p>
        )}
      </div>
    </div>
  )
}
