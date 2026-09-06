import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { CelebrateOverlay } from '../components/CelebrateOverlay'
import { ChoiceButton } from '../components/ChoiceButton'
import { useProgress } from '../context/ProgressContext'
import { getModule } from '../content/modules'
import type { ModuleId } from '../content/types'
import { sfx } from '../utils/sound'
import './Learn.css'

export function QuizPage() {
  const { moduleId } = useParams()
  const navigate = useNavigate()
  const { markQuizDone, soundOn, setHoldCelebrations } = useProgress()
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [awarded, setAwarded] = useState(0)

  const mod = useMemo(() => {
    try {
      return getModule(moduleId as ModuleId)
    } catch {
      return null
    }
  }, [moduleId])

  useEffect(() => {
    setHoldCelebrations(done)
    return () => setHoldCelebrations(false)
  }, [done, setHoldCelebrations])

  if (!mod) return <Navigate to="/" replace />

  const q = mod.quiz[index]
  const isCorrect = picked !== null && picked === q.correctIndex

  const choose = (choiceIndex: number) => {
    if (picked !== null) return
    setPicked(choiceIndex)
    const ok = choiceIndex === q.correctIndex
    sfx[ok ? 'success' : 'wrong'](soundOn)
    if (ok) setScore((s) => s + 1)
  }

  const next = () => {
    if (index >= mod.quiz.length - 1) {
      const result = markQuizDone(mod.id, score)
      setAwarded(result.awarded)
      sfx.celebrate(soundOn)
      setDone(true)
      return
    }
    setIndex((i) => i + 1)
    setPicked(null)
    sfx.click(soundOn)
  }

  const pointsLine =
    awarded > 0 ? ` +${awarded} star points!` : ' Nice replay!'

  return (
    <div className="quiz">
      <div className="quiz__top">
        <Link to="/" className="quiz__back" onClick={() => sfx.click(soundOn)}>
          ← Isle map
        </Link>
        <p className="quiz__progress">
          Question {index + 1} / {mod.quiz.length}
        </p>
      </div>
      <h1 className="quiz__title">{mod.shortTitle} Quiz</h1>
      <div className="quiz__frame">
        <h2>{q.prompt}</h2>
        <div className="quiz__choices">
          {q.choices.map((choice, i) => (
            <ChoiceButton
              key={choice}
              variant={
                picked === null
                  ? 'ghost'
                  : i === q.correctIndex
                    ? 'success'
                    : picked === i
                      ? 'danger'
                      : 'ghost'
              }
              disabled={picked !== null}
              onClick={() => choose(i)}
            >
              {choice}
            </ChoiceButton>
          ))}
        </div>
        {picked !== null && (
          <p
            className={`quiz__feedback ${isCorrect ? 'quiz__feedback--ok' : 'quiz__feedback--bad'}`}
          >
            {isCorrect ? q.feedbackCorrect : q.feedbackWrong}
          </p>
        )}
      </div>
      <div className="quiz__nav">
        <ChoiceButton disabled={picked === null} onClick={next}>
          {index >= mod.quiz.length - 1 ? 'Finish' : 'Next question'}
        </ChoiceButton>
      </div>

      <CelebrateOverlay
        open={done}
        title="Quiz complete!"
        message={`Score: ${score} / ${mod.quiz.length}.${pointsLine}`}
        badgeEmoji="★"
        primaryLabel="Back to map"
        onPrimary={() => navigate('/')}
        secondaryLabel="See badges"
        onSecondary={() => navigate('/badges')}
      />
    </div>
  )
}
