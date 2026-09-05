import { useState } from 'react'
import { ChoiceButton } from '../components/ChoiceButton'
import { useProgress } from '../context/ProgressContext'
import { sfx } from '../utils/sound'
import './games.css'

type Props = { onComplete: () => void }

const MESSAGES = [
  { text: 'FREE bike!!! Click this weird link NOW!!!', fake: true },
  { text: 'Mom: soccer practice is at 4. Love you!', fake: false },
  { text: 'You won a prize! Send your password to claim.', fake: true },
  { text: 'Teacher posted homework on the class site.', fake: false },
  { text: 'Download this mystery app for free gems!', fake: true },
  { text: 'Grandpa shared a photo of the garden.', fake: false },
]

export function SpotFakeGame({ onComplete }: Props) {
  const { soundOn } = useProgress()
  const [index, setIndex] = useState(0)
  const [caught, setCaught] = useState(0)
  const [msg, setMsg] = useState('Is this message safe or a trick?')

  const current = MESSAGES[index]

  const answer = (sayFake: boolean) => {
    const correct = sayFake === current.fake
    if (correct) {
      sfx.success(soundOn)
      const nextCaught = caught + 1
      setCaught(nextCaught)
      setMsg(current.fake ? 'Trick spotted! Ask a grown-up.' : 'Looks safe — nice catch.')
      if (index >= MESSAGES.length - 1) {
        onComplete()
      } else {
        setIndex((i) => i + 1)
      }
    } else {
      sfx.wrong(soundOn)
      setMsg(
        current.fake
          ? 'That one was fishy — watch for prizes and password asks.'
          : 'That one was from someone known — usually safer.',
      )
    }
  }

  return (
    <div className="game">
      <p className="game__status">
        Spot the trick · {index + 1}/{MESSAGES.length} · Spotted {caught}
      </p>
      <div className={`game__card ${current.fake ? 'game__fake' : ''}`}>{current.text}</div>
      <div className="game__row">
        <ChoiceButton variant="success" onClick={() => answer(false)}>
          Looks OK
        </ChoiceButton>
        <ChoiceButton variant="danger" onClick={() => answer(true)}>
          It&apos;s a trick!
        </ChoiceButton>
      </div>
      <p className="game__msg">{msg}</p>
    </div>
  )
}
