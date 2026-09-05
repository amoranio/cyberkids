import type { CharacterId } from '../../content/types'
import './characters.css'

const meta: Record<
  CharacterId,
  { name: string; role: string; accent: string }
> = {
  shieldo: { name: 'Shieldo', role: 'Guide', accent: '#2A9D8F' },
  keyora: { name: 'Keyora', role: 'Secret Keys', accent: '#E9C46A' },
  privy: { name: 'Privy', role: 'Privacy', accent: '#2A9D8F' },
  spotter: { name: 'Spotter', role: 'Spot Fakes', accent: '#E76F51' },
  spark: { name: 'Spark', role: 'Kindness', accent: '#F4A261' },
  beacon: { name: 'Beacon', role: 'Ask for Help', accent: '#264653' },
}

export function getCharacterMeta(id: CharacterId) {
  return meta[id]
}

type Props = {
  id: CharacterId
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  className?: string
}

export function Character({
  id,
  size = 'md',
  animated = true,
  className = '',
}: Props) {
  return (
    <div
      className={`character character--${size} ${animated ? 'character--bob' : ''} ${className}`}
      aria-hidden="true"
    >
      {id === 'shieldo' && <ShieldoSvg />}
      {id === 'keyora' && <KeyoraSvg />}
      {id === 'privy' && <PrivySvg />}
      {id === 'spotter' && <SpotterSvg />}
      {id === 'spark' && <SparkSvg />}
      {id === 'beacon' && <BeaconSvg />}
    </div>
  )
}

function ShieldoSvg() {
  return (
    <svg viewBox="0 0 120 120" className="character__svg">
      <ellipse cx="60" cy="108" rx="28" ry="6" fill="rgba(0,0,0,0.12)" />
      <path
        d="M60 12 L96 28 V58 C96 88 60 108 60 108 C60 108 24 88 24 58 V28 Z"
        fill="#F4A261"
        stroke="#0D7377"
        strokeWidth="3"
      />
      <path
        d="M60 28 L82 38 V58 C82 76 60 90 60 90 C60 90 38 76 38 58 V38 Z"
        fill="#2A9D8F"
      />
      <circle cx="48" cy="52" r="7" fill="#FFE8C8" />
      <circle cx="72" cy="52" r="7" fill="#FFE8C8" />
      <circle cx="48" cy="52" r="3.5" fill="#1A3A3A" />
      <circle cx="72" cy="52" r="3.5" fill="#1A3A3A" />
      <path
        d="M50 68 Q60 76 70 68"
        fill="none"
        stroke="#FFE8C8"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="30" cy="40" r="8" fill="#E9C46A" />
      <circle cx="90" cy="40" r="8" fill="#E9C46A" />
    </svg>
  )
}

function KeyoraSvg() {
  return (
    <svg viewBox="0 0 120 120" className="character__svg">
      <ellipse cx="60" cy="108" rx="24" ry="5" fill="rgba(0,0,0,0.12)" />
      <circle cx="60" cy="42" r="26" fill="#E9C46A" stroke="#D4A84B" strokeWidth="3" />
      <circle cx="60" cy="42" r="12" fill="#FFE8C8" />
      <circle cx="60" cy="42" r="6" fill="#0D7377" />
      <rect x="54" y="64" width="12" height="36" rx="4" fill="#E9C46A" />
      <rect x="54" y="84" width="22" height="8" rx="3" fill="#F4A261" />
      <rect x="54" y="94" width="16" height="8" rx="3" fill="#F4A261" />
      <circle cx="48" cy="36" r="4" fill="#1A3A3A" />
      <circle cx="72" cy="36" r="4" fill="#1A3A3A" />
      <path d="M20 30 Q30 10 45 22" fill="none" stroke="#F4A261" strokeWidth="3" />
      <path d="M100 28 Q88 8 74 20" fill="none" stroke="#F4A261" strokeWidth="3" />
      <circle cx="22" cy="28" r="5" fill="#FFE8C8" opacity="0.9" />
      <circle cx="98" cy="26" r="5" fill="#FFE8C8" opacity="0.9" />
    </svg>
  )
}

function PrivySvg() {
  return (
    <svg viewBox="0 0 120 120" className="character__svg">
      <ellipse cx="60" cy="110" rx="36" ry="6" fill="rgba(0,0,0,0.12)" />
      <ellipse cx="60" cy="78" rx="40" ry="28" fill="#2A9D8F" />
      <ellipse cx="60" cy="78" rx="28" ry="18" fill="#7EC8C3" />
      <circle cx="60" cy="48" r="22" fill="#3D9B8F" />
      <rect x="48" y="38" width="24" height="20" rx="4" fill="#E9C46A" />
      <circle cx="60" cy="44" r="5" fill="#FFE8C8" />
      <rect x="57" y="48" width="6" height="8" fill="#FFE8C8" />
      <circle cx="52" cy="46" r="3.5" fill="#1A3A3A" />
      <circle cx="68" cy="46" r="3.5" fill="#1A3A3A" />
      <ellipse cx="28" cy="78" rx="10" ry="6" fill="#264653" />
      <ellipse cx="92" cy="78" rx="10" ry="6" fill="#264653" />
      <path
        d="M52 56 Q60 62 68 56"
        fill="none"
        stroke="#FFE8C8"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SpotterSvg() {
  return (
    <svg viewBox="0 0 120 120" className="character__svg">
      <ellipse cx="60" cy="110" rx="30" ry="5" fill="rgba(0,0,0,0.12)" />
      <ellipse cx="60" cy="70" rx="34" ry="30" fill="#E76F51" />
      <circle cx="48" cy="62" r="16" fill="#FFE8C8" />
      <circle cx="72" cy="62" r="16" fill="#FFE8C8" />
      <circle cx="48" cy="62" r="8" fill="#1A3A3A" />
      <circle cx="72" cy="62" r="8" fill="#1A3A3A" />
      <circle cx="45" cy="59" r="2.5" fill="#fff" />
      <circle cx="69" cy="59" r="2.5" fill="#fff" />
      <path d="M56 78 L60 86 L64 78" fill="#F4A261" />
      <path d="M30 48 Q40 28 55 40" fill="none" stroke="#264653" strokeWidth="4" />
      <path d="M90 48 Q80 28 65 40" fill="none" stroke="#264653" strokeWidth="4" />
      <circle cx="88" cy="88" r="16" fill="none" stroke="#E9C46A" strokeWidth="5" />
      <line x1="98" y1="98" x2="110" y2="110" stroke="#E9C46A" strokeWidth="5" strokeLinecap="round" />
    </svg>
  )
}

function SparkSvg() {
  return (
    <svg viewBox="0 0 120 120" className="character__svg">
      <ellipse cx="60" cy="110" rx="28" ry="5" fill="rgba(0,0,0,0.12)" />
      <ellipse cx="60" cy="62" rx="38" ry="28" fill="#FFE8C8" />
      <ellipse cx="60" cy="62" rx="28" ry="20" fill="#F4A261" opacity="0.85" />
      <path
        d="M60 18 L66 42 L90 42 L70 56 L78 80 L60 66 L42 80 L50 56 L30 42 L54 42 Z"
        fill="#E9C46A"
      />
      <circle cx="50" cy="58" r="4" fill="#1A3A3A" />
      <circle cx="70" cy="58" r="4" fill="#1A3A3A" />
      <path
        d="M52 70 Q60 76 68 70"
        fill="none"
        stroke="#1A3A3A"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="24" cy="40" r="6" fill="#FFE8C8" opacity="0.8" />
      <circle cx="96" cy="44" r="5" fill="#FFE8C8" opacity="0.8" />
    </svg>
  )
}

function BeaconSvg() {
  return (
    <svg viewBox="0 0 120 120" className="character__svg">
      <ellipse cx="60" cy="110" rx="26" ry="5" fill="rgba(0,0,0,0.12)" />
      <ellipse cx="60" cy="72" rx="26" ry="22" fill="#264653" />
      <circle cx="60" cy="48" r="20" fill="#2A9D8F" />
      <circle cx="52" cy="46" r="4" fill="#FFE8C8" />
      <circle cx="68" cy="46" r="4" fill="#FFE8C8" />
      <path
        d="M52 56 Q60 62 68 56"
        fill="none"
        stroke="#FFE8C8"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M40 30 Q30 18 22 28" fill="none" stroke="#E9C46A" strokeWidth="3" />
      <path d="M80 30 Q90 16 100 28" fill="none" stroke="#E9C46A" strokeWidth="3" />
      <circle cx="60" cy="78" r="14" fill="#E76F51" />
      <polygon points="60,68 66,78 60,88 54,78" fill="#FFE8C8" />
      <circle cx="60" cy="78" r="3" fill="#264653" />
    </svg>
  )
}
