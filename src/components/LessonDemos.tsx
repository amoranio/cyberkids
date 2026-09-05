import { useState } from 'react'
import { ChoiceButton } from './ChoiceButton'
import { useProgress } from '../context/ProgressContext'
import { sfx } from '../utils/sound'
import './LessonDemos.css'

type SortBucket = 'private' | 'share' | 'ask'

const sortItems: { id: string; label: string; bucket: SortBucket }[] = [
  { id: '1', label: 'Photo of your front door', bucket: 'private' },
  { id: '2', label: '“I like pancakes”', bucket: 'share' },
  { id: '3', label: 'Class photo with the school logo', bucket: 'ask' },
  { id: '4', label: 'Your last name', bucket: 'private' },
]

export function DemoSort() {
  const { soundOn } = useProgress()
  const [picks, setPicks] = useState<Record<string, SortBucket | null>>({})
  const [active, setActive] = useState(sortItems[0].id)

  const item = sortItems.find((i) => i.id === active)!
  const pick = picks[active]

  const choose = (bucket: SortBucket) => {
    const correct = bucket === item.bucket
    sfx[correct ? 'success' : 'wrong'](soundOn)
    setPicks((p) => ({ ...p, [active]: bucket }))
  }

  return (
    <div className="demo">
      <p className="demo__prompt">Where does this treasure go?</p>
      <p className="demo__item">{item.label}</p>
      <div className="demo__row">
        {(
          [
            ['private', 'Keep Private'],
            ['share', 'OK to Share'],
            ['ask', 'Ask First'],
          ] as const
        ).map(([key, label]) => (
          <ChoiceButton
            key={key}
            variant={
              pick === key
                ? key === item.bucket
                  ? 'success'
                  : 'danger'
                : 'ghost'
            }
            onClick={() => choose(key)}
          >
            {label}
          </ChoiceButton>
        ))}
      </div>
      <div className="demo__nav">
        {sortItems.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`demo__dot ${active === s.id ? 'demo__dot--on' : ''} ${picks[s.id] ? 'demo__dot--done' : ''}`}
            onClick={() => {
              setActive(s.id)
              sfx.click(soundOn)
            }}
            aria-label={`Item ${s.id}`}
          />
        ))}
      </div>
    </div>
  )
}

const tiles = ['Pizza', 'Moon', 'Rocket', 'Seven', 'Wave', '!']

export function DemoPassword() {
  const { soundOn } = useProgress()
  const [selected, setSelected] = useState<string[]>([])
  const phrase = selected.join('')
  const strength =
    selected.length >= 4 ? 'strong' : selected.length >= 2 ? 'okay' : 'weak'

  return (
    <div className="demo">
      <p className="demo__prompt">Tap tiles to stack a long silly key:</p>
      <div className="demo__tiles">
        {tiles.map((t) => (
          <ChoiceButton
            key={t}
            variant={selected.includes(t) ? 'secondary' : 'ghost'}
            onClick={() => {
              sfx.click(soundOn)
              setSelected((prev) =>
                prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
              )
            }}
          >
            {t}
          </ChoiceButton>
        ))}
      </div>
      <p className="demo__phrase">{phrase || '…'}</p>
      <div className={`demo__meter demo__meter--${strength}`}>
        Strength:{' '}
        {strength === 'strong'
          ? 'Strong!'
          : strength === 'okay'
            ? 'Getting longer'
            : 'Too short'}
      </div>
    </div>
  )
}

export function DemoTraffic() {
  const { soundOn } = useProgress()
  const [answer, setAnswer] = useState<'green' | 'yellow' | 'red' | null>(null)
  const correct = 'red'

  return (
    <div className="demo">
      <p className="demo__prompt">
        “Your account closes in 10 seconds! Tap this odd link to keep it!!!”
      </p>
      <div className="demo__lights">
        {(
          [
            ['green', 'Green — safe'],
            ['yellow', 'Yellow — ask'],
            ['red', 'Red — stop'],
          ] as const
        ).map(([key, label]) => (
          <ChoiceButton
            key={key}
            className={`light light--${key}`}
            variant={
              answer === key
                ? key === correct
                  ? 'success'
                  : 'danger'
                : 'ghost'
            }
            onClick={() => {
              setAnswer(key)
              sfx[key === correct ? 'success' : 'wrong'](soundOn)
            }}
          >
            {label}
          </ChoiceButton>
        ))}
      </div>
      {answer && (
        <p className="demo__feedback">
          {answer === correct
            ? 'Yes! Panic timers + odd links are red. Freeze.'
            : 'Think again — a countdown plus a messy link is a trap.'}
        </p>
      )}
    </div>
  )
}

export function DemoKind() {
  const { soundOn } = useProgress()
  const [pick, setPick] = useState<number | null>(null)
  const options = [
    { text: 'Jump in the group roast so you look cool', ok: false },
    { text: 'Send a private “You okay? Want to play a different game?”', ok: true },
    { text: 'Repost their drawing so more people laugh', ok: false },
  ]

  return (
    <div className="demo">
      <p className="demo__prompt">
        A friend missed a shot and the group chat started roasting them. You…
      </p>
      <div className="demo__stack">
        {options.map((o, i) => (
          <ChoiceButton
            key={o.text}
            variant={pick === i ? (o.ok ? 'success' : 'danger') : 'ghost'}
            onClick={() => {
              setPick(i)
              sfx[o.ok ? 'success' : 'wrong'](soundOn)
            }}
          >
            {o.text}
          </ChoiceButton>
        ))}
      </div>
    </div>
  )
}

export function DemoHelp() {
  const { soundOn } = useProgress()
  const scenarios = [
    {
      text: 'A game buddy wants a video call after bedtime',
      tell: true,
    },
    {
      text: 'Picking a hat for your avatar',
      tell: false,
    },
    {
      text: 'Ads keep popping after you tapped a sparkly star',
      tell: true,
    },
  ]
  const [i, setI] = useState(0)
  const [msg, setMsg] = useState('')
  const s = scenarios[i]

  return (
    <div className="demo">
      <p className="demo__prompt">{s.text}</p>
      <div className="demo__row">
        <ChoiceButton
          variant="secondary"
          onClick={() => {
            const ok = s.tell
            sfx[ok ? 'success' : 'wrong'](soundOn)
            setMsg(
              ok
                ? 'Yes — that needs a trusted adult.'
                : 'Hats are a small choice you can make.',
            )
          }}
        >
          Tell a grown-up
        </ChoiceButton>
        <ChoiceButton
          variant="ghost"
          onClick={() => {
            const ok = !s.tell
            sfx[ok ? 'success' : 'wrong'](soundOn)
            setMsg(
              ok
                ? 'Right — this one is a small choice.'
                : 'This one needs a grown-up’s help.',
            )
          }}
        >
          I can handle it
        </ChoiceButton>
      </div>
      {msg && <p className="demo__feedback">{msg}</p>}
      <ChoiceButton
        variant="ghost"
        onClick={() => {
          setI((x) => (x + 1) % scenarios.length)
          setMsg('')
          sfx.click(soundOn)
        }}
      >
        Next scenario
      </ChoiceButton>
    </div>
  )
}
