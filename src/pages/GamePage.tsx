import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { CelebrateOverlay } from '../components/CelebrateOverlay'
import { useProgress } from '../context/ProgressContext'
import { getModule } from '../content/modules'
import type { ModuleId } from '../content/types'
import { TreasureCrossingGame } from '../games/TreasureCrossingGame'
import { KeyBlasterGame } from '../games/KeyBlasterGame'
import { TrickInvadersGame } from '../games/TrickInvadersGame'
import { KindnessInvadersGame } from '../games/KindnessInvadersGame'
import { BeaconRunGame } from '../games/BeaconRunGame'
import { sfx } from '../utils/sound'
import './Learn.css'

export function GamePage() {
  const { moduleId } = useParams()
  const navigate = useNavigate()
  const { markGameDone, soundOn, setHoldCelebrations } = useProgress()
  const [won, setWon] = useState(false)
  const [awarded, setAwarded] = useState(0)

  const mod = useMemo(() => {
    try {
      return getModule(moduleId as ModuleId)
    } catch {
      return null
    }
  }, [moduleId])

  useEffect(() => {
    setHoldCelebrations(won)
    return () => setHoldCelebrations(false)
  }, [won, setHoldCelebrations])

  if (!mod) return <Navigate to="/" replace />

  const onComplete = (score?: number) => {
    if (won) return
    const result = markGameDone(mod.id, score)
    setAwarded(result.awarded)
    sfx.celebrate(soundOn)
    setWon(true)
  }

  const pointsLine =
    awarded > 0
      ? `You earned ${awarded} star points. Ready for a quick quiz?`
      : 'Nice replay! Ready for a quick quiz?'

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
      <h1 className="play__title">{mod.gameName}</h1>
      <p className="play__subtitle">{mod.gameBlurb}</p>
      <div className="play__frame play__frame--arcade">
        {mod.id === 'share' && <TreasureCrossingGame onComplete={onComplete} />}
        {mod.id === 'passwords' && <KeyBlasterGame onComplete={onComplete} />}
        {mod.id === 'fakes' && <TrickInvadersGame onComplete={onComplete} />}
        {mod.id === 'kindness' && <KindnessInvadersGame onComplete={onComplete} />}
        {mod.id === 'help' && <BeaconRunGame onComplete={onComplete} />}
      </div>

      <CelebrateOverlay
        open={won}
        title="Great practice!"
        message={pointsLine}
        badgeEmoji="★"
        primaryLabel="Take the quiz"
        onPrimary={() => navigate(`/quiz/${mod.id}`)}
        secondaryLabel="Back to map"
        onSecondary={() => navigate('/')}
      />
    </div>
  )
}
