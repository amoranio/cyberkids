import { useState } from 'react'
import { ChoiceButton } from '../components/ChoiceButton'
import { useProgress } from '../context/ProgressContext'
import { sfx } from '../utils/sound'
import './games.css'

type Props = { onComplete: () => void }

const ROUNDS = [
  {
    mean: 'You are bad at this game.',
    options: [
      { text: 'Say something meaner back', ok: false },
      { text: 'Be kind, stop, and tell a grown-up', ok: true },
      { text: 'Share your password to prove you are cool', ok: false },
    ],
  },
  {
    mean: 'Nobody likes your drawing.',
    options: [
      { text: 'Support a friend and get adult help', ok: true },
      { text: 'Leave mean comments on their page', ok: false },
      { text: 'Ignore forever and never tell anyone', ok: false },
    ],
  },
  {
    mean: 'Haha weird face!',
    options: [
      { text: 'Write “Nice try — want to play again?”', ok: true },
      { text: 'Post their address online', ok: false },
      { text: 'Threaten them', ok: false },
    ],
  },
  {
    mean: 'You should not be in this chat.',
    options: [
      { text: 'Keep chatting alone with strangers', ok: false },
      { text: 'Leave, block if you can, tell a trusted adult', ok: true },
      { text: 'Give them your school name', ok: false },
    ],
  },
]

export function KindnessGame({ onComplete }: Props) {
  const { soundOn } = useProgress()
  const [round, setRound] = useState(0)
  const [msg, setMsg] = useState('Choose the kind, brave response.')

  const current = ROUNDS[round]

  const pick = (ok: boolean) => {
    if (ok) {
      sfx.success(soundOn)
      setMsg('Kind and brave!')
      if (round >= ROUNDS.length - 1) onComplete()
      else setRound((r) => r + 1)
    } else {
      sfx.wrong(soundOn)
      setMsg('Try a kinder choice — and tell a grown-up when needed.')
    }
  }

  return (
    <div className="game">
      <p className="game__status">
        Kindness launcher · {round + 1}/{ROUNDS.length}
      </p>
      <div className="game__card">Someone said: “{current.mean}”</div>
      <div className="game__stack">
        {current.options.map((o) => (
          <ChoiceButton key={o.text} variant="ghost" onClick={() => pick(o.ok)}>
            {o.text}
          </ChoiceButton>
        ))}
      </div>
      <p className="game__msg">{msg}</p>
    </div>
  )
}
