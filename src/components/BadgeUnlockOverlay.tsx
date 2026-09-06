import { useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Character } from './characters/Character'
import { ChoiceButton } from './ChoiceButton'
import { useProgress } from '../context/ProgressContext'
import { sfx } from '../utils/sound'
import './BadgeUnlockOverlay.css'

const BURST = ['★', '✦', '●', '▲', '★', '✦'] as const

export function BadgeUnlockOverlay() {
  const {
    pendingBadges,
    holdCelebrations,
    dismissBadgeUnlock,
    soundOn,
  } = useProgress()
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const badge = !holdCelebrations ? pendingBadges[0] : undefined

  useEffect(() => {
    if (!badge) return
    sfx.celebrate(soundOn)
  }, [badge, soundOn])

  return (
    <AnimatePresence>
      {badge && (
        <motion.div
          key={badge.id}
          className="badge-unlock"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="badge-unlock-title"
        >
          {!reduceMotion && (
            <div className="badge-unlock__burst" aria-hidden="true">
              {Array.from({ length: 18 }, (_, i) => {
                const angle = (i / 18) * Math.PI * 2
                const dist = 42 + (i % 3) * 10
                return (
                  <motion.span
                    key={i}
                    className="badge-unlock__spark"
                    initial={{ opacity: 0, x: '-50%', y: '-50%', scale: 0.3 }}
                    animate={{
                      opacity: [0, 1, 1, 0],
                      x: `calc(-50% + ${Math.cos(angle) * dist}vw)`,
                      y: `calc(-50% + ${Math.sin(angle) * dist}vh)`,
                      scale: [0.3, 1.2, 1],
                      rotate: 180 + i * 20,
                    }}
                    transition={{ duration: 1.35, ease: 'easeOut' }}
                  >
                    {BURST[i % BURST.length]}
                  </motion.span>
                )
              })}
            </div>
          )}

          <motion.div
            className="badge-unlock__card"
            initial={reduceMotion ? { opacity: 0 } : { scale: 0.72, y: 36 }}
            animate={reduceMotion ? { opacity: 1 } : { scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          >
            <motion.div
              className="badge-unlock__char"
              animate={
                reduceMotion
                  ? undefined
                  : { y: [0, -8, 0], rotate: [0, -3, 3, 0] }
              }
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Character id={badge.character} size="md" />
            </motion.div>
            <p className="badge-unlock__kicker">New badge!</p>
            <motion.div
              className="badge-unlock__emoji"
              aria-hidden="true"
              initial={reduceMotion ? undefined : { scale: 0.4, rotate: -20 }}
              animate={reduceMotion ? undefined : { scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 12, delay: 0.05 }}
            >
              {badge.emoji}
            </motion.div>
            <h2 id="badge-unlock-title">You earned {badge.name}!</h2>
            <p className="badge-unlock__cheer">{badge.cheer}</p>
            <p className="badge-unlock__need">{badge.threshold} star points</p>
            <div className="badge-unlock__actions">
              <ChoiceButton onClick={dismissBadgeUnlock}>Awesome!</ChoiceButton>
              <ChoiceButton
                variant="ghost"
                onClick={() => {
                  dismissBadgeUnlock()
                  navigate('/')
                }}
              >
                Keep exploring
              </ChoiceButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
