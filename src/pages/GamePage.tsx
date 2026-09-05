import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { CelebrateOverlay } from '../components/CelebrateOverlay'
import { useProgress } from '../context/ProgressContext'
import { getModule, isModuleUnlocked } from '../content/modules'
import type { ModuleId } from '../content/types'
import { SortGame } from '../games/SortGame'
import { PasswordGame } from '../games/PasswordGame'
import { SpotFakeGame } from '../games/SpotFakeGame'
import { KindnessGame } from '../games/KindnessGame'
import { HelpGame } from '../games/HelpGame'
import { sfx } from '../utils/sound'
import './Learn.css'

export function GamePage() {
  const { moduleId } = useParams()
  const navigate = useNavigate()
  const { completedQuizzes, markGameDone, soundOn } = useProgress()
  const [won, setWon] = useState(false)

  const mod = useMemo(() => {
    try {
      return getModule(moduleId as ModuleId)
    } catch {
      return null
    }
  }, [moduleId])

  if (!mod) return <Navigate to="/" replace />
  if (!isModuleUnlocked(mod.id, completedQuizzes)) {
    return <Navigate to="/" replace />
  }

  const onComplete = () => {
    if (won) return
    markGameDone(mod.id)
    sfx.celebrate(soundOn)
    setWon(true)
  }

  return (
    <div className="play">
      <div className="play__top">
        <Link
          to={`/learn/${mod.id}`}
          className="play__back"
          onClick={() => sfx.click(soundOn)}
        >
          ← Lesson
        </Link>
      </div>
      <h1 className="play__title">{mod.shortTitle} Game</h1>
      <p className="play__subtitle">Practice time with your guide!</p>
      <div className="play__frame">
        {mod.id === 'share' && <SortGame onComplete={onComplete} />}
        {mod.id === 'passwords' && <PasswordGame onComplete={onComplete} />}
        {mod.id === 'fakes' && <SpotFakeGame onComplete={onComplete} />}
        {mod.id === 'kindness' && <KindnessGame onComplete={onComplete} />}
        {mod.id === 'help' && <HelpGame onComplete={onComplete} />}
      </div>

      <CelebrateOverlay
        open={won}
        title="Great practice!"
        message="You finished the game. Ready for a quick quiz?"
        badgeEmoji={mod.badgeEmoji}
        primaryLabel="Take the quiz"
        onPrimary={() => navigate(`/quiz/${mod.id}`)}
        secondaryLabel="Back to map"
        onSecondary={() => navigate('/')}
      />
    </div>
  )
}
