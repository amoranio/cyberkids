import { Link, Outlet, useLocation } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext'
import { ProgressStars } from './ProgressStars'
import { sfx } from '../utils/sound'
import './Layout.css'

export function Layout() {
  const { badges, soundOn, setSoundOn, nickname } = useProgress()
  const location = useLocation()
  const isHub = location.pathname === '/' || location.pathname === ''

  return (
    <div className={`shell ${isHub ? 'shell--hub' : 'shell--page'}`}>
      <header className="topbar">
        <Link to="/" className="topbar__brand" onClick={() => sfx.click(soundOn)}>
          <span className="topbar__mark" aria-hidden="true">
            🛡️
          </span>
          <span className="topbar__name">CyberKids</span>
        </Link>
        <div className="topbar__tools">
          {nickname && (
            <span className="topbar__nick" title="Your explorer name">
              {nickname}
            </span>
          )}
          <ProgressStars filled={badges.length} />
          <button
            type="button"
            className="topbar__sound"
            onClick={() => {
              const next = !soundOn
              setSoundOn(next)
              if (next) sfx.click(true)
            }}
            aria-pressed={soundOn}
            aria-label={soundOn ? 'Turn sound off' : 'Turn sound on'}
          >
            {soundOn ? '🔊' : '🔇'}
          </button>
          <Link
            to="/badges"
            className="topbar__link"
            onClick={() => sfx.click(soundOn)}
          >
            Badges
          </Link>
          <Link
            to="/parents"
            className="topbar__link topbar__link--soft"
            onClick={() => sfx.click(soundOn)}
          >
            Grown-ups
          </Link>
        </div>
      </header>
      <main className="shell__main">
        <Outlet />
      </main>
      <footer className="shell__foot">
        <p>No accounts. Progress stays on this device.</p>
      </footer>
    </div>
  )
}
