import { useState } from 'react'
import { ChoiceButton } from './ChoiceButton'
import { useProgress } from '../context/ProgressContext'
import { sfx } from '../utils/sound'
import './LessonDemos.css'

type SortBucket = 'private' | 'share' | 'ask'

const sortItems: { id: string; label: string; bucket: SortBucket }[] = [
  { id: '1', label: 'Home address', bucket: 'private' },
  { id: '2', label: 'Favorite animal', bucket: 'share' },
  { id: '3', label: 'School name', bucket: 'ask' },
  { id: '4', label: 'Password', bucket: 'private' },
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
      <p className="demo__prompt">Where does this go?</p>
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

const tiles = ['Blue', 'Banana', 'Dances', 'Sun', '42', '!']

export function DemoPassword() {
  const { soundOn } = useProgress()
  const [selected, setSelected] = useState<string[]>([])
  const phrase = selected.join('')
  const strength =
    selected.length >= 4 ? 'strong' : selected.length >= 2 ? 'okay' : 'weak'

  return (
    <div className="demo">
      <p className="demo__prompt">Tap tiles to build a silly strong key:</p>
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
            ? 'Getting better'
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
      <p className="demo__prompt">“FREE bike if you click this weird link!!!”</p>
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
            ? 'Yes! Too-good prizes are usually tricks.'
            : 'Think again — free prize pop-ups are red flags.'}
        </p>
      )}
    </div>
  )
}

export function DemoKind() {
  const { soundOn } = useProgress()
  const [pick, setPick] = useState<number | null>(null)
  const options = [
    { text: 'Write something meaner back', ok: false },
    { text: 'Be kind, stop, and tell a grown-up', ok: true },
    { text: 'Share your password to prove you are cool', ok: false },
  ]

  return (
    <div className="demo">
      <p className="demo__prompt">Someone was unkind in chat. What do you do?</p>
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
    { text: 'A stranger asks where you live', tell: true },
    { text: 'Choosing a game avatar color', tell: false },
    { text: 'A pop-up asks for your password', tell: true },
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
                ? 'Yes — tell a trusted adult!'
                : 'This one is usually fine on your own.',
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
                ? 'Right — this is a small choice.'
                : 'This needs a grown-up’s help.',
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
