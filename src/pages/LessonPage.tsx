import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { CharacterBubble } from '../components/CharacterBubble'
import { ChoiceButton } from '../components/ChoiceButton'
import {
  DemoHelp,
  DemoKind,
  DemoPassword,
  DemoSort,
  DemoTraffic,
} from '../components/LessonDemos'
import { useProgress } from '../context/ProgressContext'
import { getModule, isModuleUnlocked } from '../content/modules'
import type { ModuleId } from '../content/types'
import { sfx } from '../utils/sound'
import './Learn.css'

const demos = {
  'demo-sort': DemoSort,
  'demo-password': DemoPassword,
  'demo-traffic': DemoTraffic,
  'demo-kind': DemoKind,
  'demo-help': DemoHelp,
} as const

export function LessonPage() {
  const { moduleId } = useParams()
  const navigate = useNavigate()
  const { completedQuizzes, markLessonDone, soundOn } = useProgress()
  const [step, setStep] = useState(0)

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

  const panel = mod.lesson[step]
  const Demo = panel.interactive ? demos[panel.interactive] : null
  const isLast = step >= mod.lesson.length - 1

  return (
    <div className="learn">
      <div className="learn__top">
        <Link to="/" className="learn__back" onClick={() => sfx.click(soundOn)}>
          ← Isle map
        </Link>
        <p className="learn__progress">
          Lesson {step + 1} / {mod.lesson.length}
        </p>
      </div>
      <h1 className="learn__title">{mod.title}</h1>
      <p className="learn__subtitle">{mod.subtitle}</p>

      <CharacterBubble
        character={panel.character}
        title={panel.title}
        tip={panel.tip}
      >
        <p>{panel.text}</p>
      </CharacterBubble>

      {Demo ? <Demo /> : null}

      <div className="learn__nav">
        <ChoiceButton
          variant="ghost"
          disabled={step === 0}
          onClick={() => {
            setStep((s) => Math.max(0, s - 1))
            sfx.click(soundOn)
          }}
        >
          Back
        </ChoiceButton>
        {!isLast ? (
          <ChoiceButton
            onClick={() => {
              setStep((s) => s + 1)
              sfx.click(soundOn)
            }}
          >
            Next
          </ChoiceButton>
        ) : (
          <ChoiceButton
            onClick={() => {
              markLessonDone(mod.id)
              sfx.success(soundOn)
              navigate(`/play/${mod.id}`)
            }}
          >
            Play the game!
          </ChoiceButton>
        )}
      </div>
    </div>
  )
}
