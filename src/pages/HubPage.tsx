import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Character } from '../components/characters/Character'
import { ChoiceButton } from '../components/ChoiceButton'
import { useProgress } from '../context/ProgressContext'
import { MODULE_ORDER, getModule, isModuleUnlocked } from '../content/modules'
import type { ModuleId } from '../content/types'
import { sfx } from '../utils/sound'
import './Hub.css'

const positions: Record<ModuleId, { top: string; left: string }> = {
  share: { top: '58%', left: '12%' },
  passwords: { top: '28%', left: '32%' },
  fakes: { top: '48%', left: '55%' },
  kindness: { top: '22%', left: '72%' },
  help: { top: '62%', left: '78%' },
}

export function HubPage() {
  const {
    nickname,
    pickRandomNickname,
    completedLessons,
    completedGames,
    completedQuizzes,
    badges,
    soundOn,
    allComplete,
  } = useProgress()

  return (
    <div className="hub">
      <section className="hub__hero" aria-label="CyberKids home">
        <div className="hub__hero-copy">
          <p className="hub__eyebrow">Ages 6–10</p>
          <h1 className="hub__brand">CyberKids</h1>
          <p className="hub__tagline">
            Explore Cyber Isle. Learn to stay safe, kind, and brave online.
          </p>
          <div className="hub__cta">
            {!nickname ? (
              <ChoiceButton
                onClick={() => {
                  pickRandomNickname()
                  sfx.success(soundOn)
                }}
              >
                Pick my explorer name
              </ChoiceButton>
            ) : (
              <p className="hub__hello">
                Hi, {nickname}! Tap an island zone to begin.
              </p>
            )}
            <Link
              to="/badges"
              className="hub__ghost-link"
              onClick={() => sfx.click(soundOn)}
            >
              Badge wall
            </Link>
          </div>
        </div>
        <motion.div
          className="hub__mascot"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Character id="shieldo" size="lg" />
        </motion.div>
      </section>

      <section className="hub__map" aria-label="Cyber Isle map">
        <h2 className="hub__map-title">Cyber Isle</h2>
        <div className="hub__terrain" role="list">
          {MODULE_ORDER.map((id, index) => {
            const mod = getModule(id)
            const unlocked = isModuleUnlocked(id, completedQuizzes)
            const done = badges.includes(id)
            const pos = positions[id]
            const lessonDone = completedLessons.includes(id)
            const gameDone = completedGames.includes(id)
            const quizDone = completedQuizzes.includes(id)

            return (
              <motion.div
                key={id}
                className={`hub__zone ${unlocked ? '' : 'hub__zone--locked'} ${done ? 'hub__zone--done' : ''}`}
                style={{ top: pos.top, left: pos.left }}
                role="listitem"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.08 * index }}
              >
                {unlocked ? (
                  <Link
                    to={`/learn/${id}`}
                    className="hub__zone-btn"
                    style={{ borderColor: mod.color }}
                    onClick={() => sfx.click(soundOn)}
                  >
                    <Character id={mod.host} size="sm" />
                    <span className="hub__zone-label">{mod.mapLabel}</span>
                    <span className="hub__zone-title">{mod.shortTitle}</span>
                    <span className="hub__zone-progress" aria-hidden="true">
                      {lessonDone ? '★' : '☆'}
                      {gameDone ? '★' : '☆'}
                      {quizDone ? '★' : '☆'}
                    </span>
                  </Link>
                ) : (
                  <div
                    className="hub__zone-btn hub__zone-btn--locked"
                    aria-disabled="true"
                  >
                    <span className="hub__lock" aria-hidden="true">
                      🔒
                    </span>
                    <span className="hub__zone-label">{mod.mapLabel}</span>
                    <span className="hub__zone-title">Finish previous zone</span>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </section>

      {allComplete && (
        <p className="hub__complete">
          You earned every badge! You are a Cyber Defender. 🛡️
        </p>
      )}

      <p className="hub__parents">
        <Link to="/parents" onClick={() => sfx.click(soundOn)}>
          Grown-ups: tips & what kids learn
        </Link>
      </p>
    </div>
  )
}
