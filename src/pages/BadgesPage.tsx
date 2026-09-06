import { Link } from 'react-router-dom'
import { ChoiceButton } from '../components/ChoiceButton'
import { useProgress } from '../context/ProgressContext'
import { POINT_BADGES } from '../content/badges'
import { sfx } from '../utils/sound'
import './Learn.css'

export function BadgesPage() {
  const { badges, points, nickname, allComplete, soundOn, resetProgress } =
    useProgress()

  return (
    <div className="badges">
      <div className="badges__top">
        <Link to="/" className="badges__back" onClick={() => sfx.click(soundOn)}>
          ← Isle map
        </Link>
        <p className="badges__points" aria-label={`${points} star points`}>
          ★ Star points: {points}
        </p>
      </div>
      <h1 className="badges__title">Badge Wall</h1>
      <div className="badges__grid">
        {POINT_BADGES.map((badge) => {
          const earned = badges.includes(badge.id)
          return (
            <div
              key={badge.id}
              className={`badges__item ${earned ? 'badges__item--earned' : 'badges__item--locked'}`}
            >
              <div className="badges__emoji" aria-hidden="true">
                {earned ? badge.emoji : '🔒'}
              </div>
              <p className="badges__name">{badge.name}</p>
              <p>
                {earned
                  ? 'You earned this!'
                  : `Earn ${badge.threshold} points`}
              </p>
            </div>
          )
        })}
      </div>

      {allComplete && (
        <div className="badges__card badges__cert">
          <h2>Cyber Defender Certificate</h2>
          <p>
            This certifies that <strong>{nickname || 'a brave explorer'}</strong>{' '}
            earned every star-point badge — Spark Starter through Cyber
            Defender.
          </p>
          <p>🛡️ CyberKids · Cyber Isle</p>
        </div>
      )}

      <div className="parents__actions">
        <ChoiceButton
          variant="ghost"
          onClick={() => {
            if (window.confirm('Reset all progress on this device?')) {
              resetProgress()
              sfx.click(soundOn)
            }
          }}
        >
          Reset progress
        </ChoiceButton>
      </div>
    </div>
  )
}
