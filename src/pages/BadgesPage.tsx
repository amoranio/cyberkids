import { Link } from 'react-router-dom'
import { ChoiceButton } from '../components/ChoiceButton'
import { useProgress } from '../context/ProgressContext'
import { MODULE_ORDER, getModule } from '../content/modules'
import { sfx } from '../utils/sound'
import './Learn.css'

export function BadgesPage() {
  const { badges, nickname, allComplete, soundOn, resetProgress } = useProgress()

  return (
    <div className="badges">
      <div className="badges__top">
        <Link to="/" className="badges__back" onClick={() => sfx.click(soundOn)}>
          ← Isle map
        </Link>
      </div>
      <h1 className="badges__title">Badge Wall</h1>
      <div className="badges__grid">
        {MODULE_ORDER.map((id) => {
          const mod = getModule(id)
          const earned = badges.includes(id)
          return (
            <div
              key={id}
              className={`badges__item ${earned ? 'badges__item--earned' : 'badges__item--locked'}`}
            >
              <div className="badges__emoji" aria-hidden="true">
                {earned ? mod.badgeEmoji : '🔒'}
              </div>
              <p className="badges__name">{mod.badgeName}</p>
              <p>{mod.shortTitle}</p>
            </div>
          )
        })}
      </div>

      {allComplete && (
        <div className="badges__card badges__cert">
          <h2>Cyber Defender Certificate</h2>
          <p>
            This certifies that <strong>{nickname || 'a brave explorer'}</strong>{' '}
            learned to share with care, use secret keys, spot fakes, be kind
            online, and ask for help.
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
