import { Link, Outlet } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext'
import { ProgressStars } from './ProgressStars'
import { sfx } from '../utils/sound'
import './Layout.css'

export function Layout() {
  const { badges, soundOn, setSoundOn, nickname } = useProgress()

  return (
    <div className="shell">
      <header className="topbar">
        <Link to="/" className="topbar__brand" onClick={() => sfx.click(soundOn)}>
          <span className="topbar__mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" width="22" height="22">
              <path
                d="M16 4 L26 8 V16 C26 23 16 28 16 28 C16 28 6 23 6 16 V8 Z"
                fill="#00B39A"
                stroke="#111"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
            </svg>
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
            {soundOn ? (
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <path d="M4 9h4l5-4v14l-5-4H4z" fill="#111" />
                <path
                  d="M16 9c1.2 1 1.8 2 1.8 3s-.6 2-1.8 3"
                  fill="none"
                  stroke="#111"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <path d="M4 9h4l5-4v14l-5-4H4z" fill="#111" />
                <path
                  d="M17 9 L21 15 M21 9 L17 15"
                  fill="none"
                  stroke="#111"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
          <Link
            to="/badges"
            className="topbar__link"
            onClick={() => sfx.click(soundOn)}
            aria-label="Badge wall"
          >
            <span className="topbar__label-full">Badges</span>
            <span className="topbar__label-short" aria-hidden="true">★</span>
          </Link>
          <Link
            to="/parents"
            className="topbar__link topbar__link--soft"
            onClick={() => sfx.click(soundOn)}
            aria-label="Grown-ups guide"
          >
            <span className="topbar__label-full">Grown-ups</span>
            <span className="topbar__label-short" aria-hidden="true">Adults</span>
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
