import { useState } from 'react'
import { ChoiceButton } from '../components/ChoiceButton'
import { useProgress } from '../context/ProgressContext'
import { sfx } from '../utils/sound'
import './games.css'

type Bin = 'private' | 'share' | 'ask'

type Item = { id: string; label: string; bin: Bin }

const ITEMS: Item[] = [
  { id: '1', label: 'Home address', bin: 'private' },
  { id: '2', label: 'Favorite animal', bin: 'share' },
  { id: '3', label: 'School name', bin: 'ask' },
  { id: '4', label: 'Password', bin: 'private' },
  { id: '5', label: 'That you like soccer', bin: 'share' },
  { id: '6', label: 'Phone number', bin: 'private' },
]

const BINS: { id: Bin; label: string }[] = [
  { id: 'private', label: 'Keep Private' },
  { id: 'share', label: 'OK to Share' },
  { id: 'ask', label: 'Ask First' },
]

type Props = { onComplete: () => void }

export function SortGame({ onComplete }: Props) {
  const { soundOn } = useProgress()
  const [remaining, setRemaining] = useState(ITEMS)
  const [selected, setSelected] = useState<string | null>(ITEMS[0].id)
  const [msg, setMsg] = useState('Pick a treasure, then choose a chest!')
  const [ok, setOk] = useState(true)

  const selectedItem = remaining.find((i) => i.id === selected) ?? remaining[0]

  const place = (bin: Bin) => {
    if (!selectedItem) return
    if (bin === selectedItem.bin) {
      sfx.success(soundOn)
      setOk(true)
      setMsg(`Yes! “${selectedItem.label}” goes in ${BINS.find((b) => b.id === bin)!.label}.`)
      const next = remaining.filter((i) => i.id !== selectedItem.id)
      setRemaining(next)
      if (next.length === 0) {
        onComplete()
      } else {
        setSelected(next[0].id)
      }
    } else {
      sfx.wrong(soundOn)
      setOk(false)
      setMsg('Not that chest — try again!')
    }
  }

  return (
    <div className="game">
      <p className="game__status">Sort the treasures ({ITEMS.length - remaining.length}/{ITEMS.length})</p>
      <div className="game__row">
        {remaining.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`game__item ${selected === item.id ? 'game__bin--active' : ''}`}
            onClick={() => {
              setSelected(item.id)
              sfx.click(soundOn)
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="game__bins">
        {BINS.map((bin) => (
          <ChoiceButton key={bin.id} variant="ghost" onClick={() => place(bin.id)}>
            {bin.label}
          </ChoiceButton>
        ))}
      </div>
      <p className={`game__msg ${ok ? 'game__msg--ok' : 'game__msg--bad'}`}>{msg}</p>
    </div>
  )
}
