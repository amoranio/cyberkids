import { useMemo, useState } from 'react'
import { ChoiceButton } from '../components/ChoiceButton'
import { useProgress } from '../context/ProgressContext'
import { sfx } from '../utils/sound'
import './games.css'

type Props = { onComplete: () => void }

const ROUNDS = [
  { weak: '1234', strong: 'BlueBananaDances!42' },
  { weak: 'password', strong: 'SunnyTigerJumps#9' },
  { weak: 'abc', strong: 'CoralFoxSpins@77' },
  { weak: 'name2024', strong: 'MossTurtleWaves!3' },
]

export function PasswordGame({ onComplete }: Props) {
  const { soundOn } = useProgress()
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [msg, setMsg] = useState('Tap the stronger secret key!')

  const options = useMemo(() => {
    const r = ROUNDS[round]
    return Math.random() > 0.5
      ? [
          { text: r.strong, good: true },
          { text: r.weak, good: false },
        ]
      : [
          { text: r.weak, good: false },
          { text: r.strong, good: true },
        ]
  }, [round])

  const pick = (good: boolean) => {
    if (good) {
      sfx.success(soundOn)
      const nextScore = score + 1
      setScore(nextScore)
      setMsg('Strong key! Long and silly wins.')
      if (round >= ROUNDS.length - 1) {
        onComplete()
      } else {
        setRound((r) => r + 1)
      }
    } else {
      sfx.wrong(soundOn)
      setMsg('Too easy to guess — pick the longer silly one!')
    }
  }

  return (
    <div className="game">
      <p className="game__status">
        Strong key hunt · Round {round + 1}/{ROUNDS.length} · Score {score}
      </p>
      <div className="game__meter" aria-hidden="true">
        <div
          className="game__meter-fill"
          style={{ width: `${((round + (msg.includes('Strong') ? 1 : 0)) / ROUNDS.length) * 100}%` }}
        />
      </div>
      <div className="game__stack">
        {options.map((o) => (
          <ChoiceButton key={o.text} variant="ghost" onClick={() => pick(o.good)}>
            {o.text}
          </ChoiceButton>
        ))}
      </div>
      <p className="game__msg game__msg--ok">{msg}</p>
    </div>
  )
}
