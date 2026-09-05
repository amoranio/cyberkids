import { motion, AnimatePresence } from 'framer-motion'
import { ChoiceButton } from './ChoiceButton'
import './CelebrateOverlay.css'

type Props = {
  open: boolean
  title: string
  message: string
  badgeEmoji?: string
  primaryLabel: string
  onPrimary: () => void
  secondaryLabel?: string
  onSecondary?: () => void
}

export function CelebrateOverlay({
  open,
  title,
  message,
  badgeEmoji,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="celebrate"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="celebrate-title"
        >
          <motion.div
            className="celebrate__card"
            initial={{ scale: 0.85, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {badgeEmoji && (
              <div className="celebrate__emoji" aria-hidden="true">
                {badgeEmoji}
              </div>
            )}
            <h2 id="celebrate-title">{title}</h2>
            <p>{message}</p>
            <div className="celebrate__actions">
              <ChoiceButton onClick={onPrimary}>{primaryLabel}</ChoiceButton>
              {secondaryLabel && onSecondary && (
                <ChoiceButton variant="ghost" onClick={onSecondary}>
                  {secondaryLabel}
                </ChoiceButton>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
