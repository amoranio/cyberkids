import { useState } from 'react'
import { ChoiceButton } from '../components/ChoiceButton'
import { useProgress } from '../context/ProgressContext'
import { sfx } from '../utils/sound'
import './games.css'

type Props = { onComplete: () => void }

const SCENARIOS = [
  { text: 'A stranger asks where you live', tell: true },
  { text: 'Choosing a game avatar color', tell: false },
  { text: 'A pop-up asks for your password', tell: true },
  { text: 'Someone is mean in chat', tell: true },
  { text: 'Picking a sticker for your profile', tell: false },
  { text: 'A link looks weird and misspelled', tell: true },
]

export function HelpGame({ onComplete }: Props) {
  const { soundOn } = useProgress()
  const [index, setIndex] = useState(0)
  const [msg, setMsg] = useState('Should you tell a trusted adult?')

  const current = SCENARIOS[index]

  const answer = (tell: boolean) => {
    const ok = tell === current.tell
    if (ok) {
      sfx.success(soundOn)
      setMsg(tell ? 'Yes — Beacon is proud!' : 'Right — this is a small choice.')
      if (index >= SCENARIOS.length - 1) onComplete()
      else setIndex((i) => i + 1)
    } else {
      sfx.wrong(soundOn)
      setMsg(
        current.tell
          ? 'This one needs a grown-up’s help.'
          : 'You can usually handle this small choice.',
      )
    }
  }

  return (
    <div className="game">
      <p className="game__status">
        Ask for help · {index + 1}/{SCENARIOS.length}
      </p>
      <div className="game__card">{current.text}</div>
      <div className="game__row">
        <ChoiceButton variant="secondary" onClick={() => answer(true)}>
          Tell a grown-up
        </ChoiceButton>
        <ChoiceButton variant="ghost" onClick={() => answer(false)}>
          I can handle it
        </ChoiceButton>
      </div>
      <p className="game__msg">{msg}</p>
    </div>
  )
}
