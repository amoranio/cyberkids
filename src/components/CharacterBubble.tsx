import type { ReactNode } from 'react'
import { Character, getCharacterMeta } from './characters/Character'
import type { CharacterId } from '../content/types'
import './CharacterBubble.css'

type Props = {
  character: CharacterId
  title?: string
  children: ReactNode
  tip?: string
}

export function CharacterBubble({ character, title, children, tip }: Props) {
  const meta = getCharacterMeta(character)
  return (
    <div className="bubble">
      <Character id={character} size="md" />
      <div className="bubble__panel">
        <p className="bubble__who">
          <span className="bubble__name">{meta.name}</span>
          <span className="bubble__role">{meta.role}</span>
        </p>
        {title && <h2 className="bubble__title">{title}</h2>}
        <div className="bubble__text">{children}</div>
        {tip && <p className="bubble__tip">{tip}</p>}
      </div>
    </div>
  )
}
