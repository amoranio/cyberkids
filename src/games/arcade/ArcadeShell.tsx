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
    e.currentTarget.setPointerCapture(e.pointerId)
    onDir(dir)
  }
  const padUp = (dir: Dir) => (e: ReactPointerEvent<HTMLButtonElement>) => {
    e.preventDefault()
    onDirUp?.(dir)
  }
  const start = () => {
    onStart()
    requestAnimationFrame(() => fieldRef?.current?.focus())
  }
  const retry = () => {
    onRetry()
    requestAnimationFrame(() => fieldRef?.current?.focus())
  }

  return (
    <div className="arcade" data-playing={overlay === null}>
      <div className="arcade__meta">
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
        <p className="arcade__status" title={status}>
          {status}
        </p>
      </div>
      <div className="arcade__play-area">
        <div
          className="arcade__field"
          ref={fieldRef}
          tabIndex={0}
          onPointerDown={onFieldPointerDown}
          onPointerMove={onFieldPointerMove}
          onPointerUp={onFieldPointerUp}
          onPointerCancel={onFieldPointerUp}
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
                  <ChoiceButton onClick={start}>Start</ChoiceButton>
                  <p className="arcade__enter">Press Enter or tap Start</p>
                </div>
              )}
              {overlay === 'lose' && (
                <div className="arcade__card">
                  <h2>Try again!</h2>
                  <p>You still have this game. Hop or zap with care.</p>
                  <ChoiceButton onClick={retry}>Play again</ChoiceButton>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="arcade__controls" aria-label="Game controls">
          <div className="arcade__pad" role="group" aria-label="Direction pad">
            {(
              [
                ['up', '▲', 'Up', 'arcade__pad-u'],
                ['left', '◀', 'Left', 'arcade__pad-l'],
                ['right', '▶', 'Right', 'arcade__pad-r'],
                ['down', '▼', 'Down', 'arcade__pad-d'],
              ] as const
            ).map(([dir, glyph, label, position]) => (
              <button
                key={dir}
                type="button"
                aria-label={label}
                className={`arcade__pad-btn ${position}`}
                onPointerDown={padDown(dir)}
                onPointerUp={padUp(dir)}
                onPointerCancel={padUp(dir)}
                onClick={(e) => {
                  if (e.detail === 0) onDir(dir)
                }}
              >
                {glyph}
              </button>
            ))}
          </div>
          {showFire ? (
            <button
              type="button"
              className="arcade__fire"
              onPointerDown={(e) => {
                e.preventDefault()
                e.currentTarget.setPointerCapture(e.pointerId)
                onFireDown?.()
              }}
              onPointerUp={(e) => {
                e.preventDefault()
                onFireUp?.()
              }}
              onPointerCancel={onFireUp}
              onClick={(e) => {
                if (e.detail === 0) {
                  onFireDown?.()
                  onFireUp?.()
                }
              }}
              onContextMenu={(e) => e.preventDefault()}
            >
              {fireLabel}
            </button>
          ) : (
            <p className="arcade__touch-tip">Tap the map to hop that way</p>
          )}
        </div>
      </div>
    </div>
  )
}
