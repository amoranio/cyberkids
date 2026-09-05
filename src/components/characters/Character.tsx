import type { CharacterId } from '../../content/types'
import './characters.css'

const meta: Record<
  CharacterId,
  { name: string; role: string; accent: string }
> = {
  shieldo: { name: 'Shieldo', role: 'Guide', accent: '#00B39A' },
  keyora: { name: 'Keyora', role: 'Secret Keys', accent: '#FFD400' },
  privy: { name: 'Privy', role: 'Privacy', accent: '#00B39A' },
  spotter: { name: 'Spotter', role: 'Spot Fakes', accent: '#FF4D3A' },
  spark: { name: 'Spark', role: 'Kindness', accent: '#FF5A8A' },
  beacon: { name: 'Beacon', role: 'Ask for Help', accent: '#2F6FED' },
}

export function getCharacterMeta(id: CharacterId) {
  return meta[id]
}

const ink = {
  stroke: '#111111',
  strokeWidth: 8,
  strokeLinejoin: 'round' as const,
  strokeLinecap: 'round' as const,
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
    <svg viewBox="0 0 160 160" className="character__svg">
      <path
        d="M80 18 L128 38 V78 C128 118 80 142 80 142 C80 142 32 118 32 78 V38 Z"
        fill="#FFD400"
        {...ink}
      />
      <path
        d="M80 44 L108 56 V78 C108 102 80 120 80 120 C80 120 52 102 52 78 V56 Z"
        fill="#00B39A"
        {...ink}
      />
      <circle cx="66" cy="74" r="12" fill="#FFFcf6" {...ink} />
      <circle cx="94" cy="74" r="12" fill="#FFFcf6" {...ink} />
      <circle cx="66" cy="75" r="5.5" fill="#111111" />
      <circle cx="94" cy="75" r="5.5" fill="#111111" />
      <path d="M68 96 Q80 108 92 96" fill="none" {...ink} />
      <circle cx="38" cy="50" r="11" fill="#FF4D3A" {...ink} />
      <circle cx="122" cy="50" r="11" fill="#FF4D3A" {...ink} />
    </svg>
  )
}

function KeyoraSvg() {
  return (
    <svg viewBox="0 0 160 160" className="character__svg">
      <ellipse cx="42" cy="54" rx="18" ry="26" fill="#FFFcf6" {...ink} />
      <ellipse cx="118" cy="54" rx="18" ry="26" fill="#FFFcf6" {...ink} />
      <circle cx="80" cy="58" r="34" fill="#FFD400" {...ink} />
      <circle cx="80" cy="58" r="14" fill="#FFFcf6" {...ink} />
      <circle cx="80" cy="58" r="6" fill="#111111" />
      <rect x="72" y="88" width="16" height="40" rx="8" fill="#FFD400" {...ink} />
      <rect x="72" y="110" width="30" height="12" rx="6" fill="#FFD400" {...ink} />
      <rect x="72" y="124" width="22" height="12" rx="6" fill="#FFD400" {...ink} />
      <circle cx="68" cy="50" r="6" fill="#111111" />
      <circle cx="92" cy="50" r="6" fill="#111111" />
      <path d="M28 32 Q46 10 62 30" fill="none" {...ink} />
      <path d="M132 32 Q114 10 98 30" fill="none" {...ink} />
      <circle cx="26" cy="30" r="8" fill="#FF4D3A" {...ink} />
      <circle cx="134" cy="30" r="8" fill="#FF4D3A" {...ink} />
    </svg>
  )
}

function PrivySvg() {
  return (
    <svg viewBox="0 0 160 160" className="character__svg">
      <ellipse cx="80" cy="104" rx="54" ry="34" fill="#00B39A" {...ink} />
      <ellipse cx="80" cy="104" rx="30" ry="16" fill="#FFD400" {...ink} />
      <circle cx="80" cy="58" r="30" fill="#00B39A" {...ink} />
      <rect x="62" y="44" width="36" height="28" rx="8" fill="#FFD400" {...ink} />
      <circle cx="80" cy="52" r="8" fill="#FFFcf6" {...ink} />
      <rect x="76" y="58" width="8" height="10" rx="2" fill="#111111" />
      <circle cx="68" cy="56" r="5.5" fill="#111111" />
      <circle cx="92" cy="56" r="5.5" fill="#111111" />
      <ellipse cx="32" cy="104" rx="14" ry="10" fill="#1E3A5F" {...ink} />
      <ellipse cx="128" cy="104" rx="14" ry="10" fill="#1E3A5F" {...ink} />
      <path d="M68 76 Q80 88 92 76" fill="none" {...ink} />
    </svg>
  )
}

function SpotterSvg() {
  return (
    <svg viewBox="0 0 160 160" className="character__svg">
      <ellipse cx="80" cy="88" rx="46" ry="40" fill="#FF4D3A" {...ink} />
      <circle cx="62" cy="82" r="20" fill="#FFFcf6" {...ink} />
      <circle cx="98" cy="82" r="20" fill="#FFFcf6" {...ink} />
      <circle cx="62" cy="84" r="9" fill="#111111" />
      <circle cx="98" cy="84" r="9" fill="#111111" />
      <circle cx="58" cy="80" r="3.5" fill="#FFFcf6" />
      <circle cx="94" cy="80" r="3.5" fill="#FFFcf6" />
      <path d="M72 110 L80 124 L88 110" fill="#FFD400" {...ink} />
      <path d="M38 56 Q54 24 72 48" fill="none" {...ink} />
      <path d="M122 56 Q106 24 88 48" fill="none" {...ink} />
      <circle cx="122" cy="118" r="20" fill="#FFD400" {...ink} />
      <circle cx="122" cy="118" r="10" fill="none" stroke="#111111" strokeWidth={8} />
      <line
        x1="136"
        y1="132"
        x2="150"
        y2="146"
        stroke="#111111"
        strokeWidth={10}
        strokeLinecap="round"
      />
    </svg>
  )
}

function SparkSvg() {
  return (
    <svg viewBox="0 0 160 160" className="character__svg">
      <ellipse cx="80" cy="90" rx="52" ry="36" fill="#FFFcf6" {...ink} />
      <path
        d="M80 20 L90 58 L130 58 L98 82 L110 120 L80 96 L50 120 L62 82 L30 58 L70 58 Z"
        fill="#FF5A8A"
        {...ink}
      />
      <circle cx="66" cy="86" r="6.5" fill="#111111" />
      <circle cx="94" cy="86" r="6.5" fill="#111111" />
      <path d="M66 104 Q80 116 94 104" fill="none" {...ink} />
      <circle cx="28" cy="50" r="10" fill="#FFD400" {...ink} />
      <circle cx="132" cy="54" r="9" fill="#FFD400" {...ink} />
    </svg>
  )
}

function BeaconSvg() {
  return (
    <svg viewBox="0 0 160 160" className="character__svg">
      <ellipse cx="42" cy="90" rx="20" ry="32" fill="#2F6FED" {...ink} />
      <ellipse cx="118" cy="90" rx="20" ry="32" fill="#2F6FED" {...ink} />
      <ellipse cx="80" cy="100" rx="34" ry="30" fill="#1E3A5F" {...ink} />
      <circle cx="80" cy="58" r="28" fill="#2F6FED" {...ink} />
      <circle cx="70" cy="56" r="6.5" fill="#111111" />
      <circle cx="90" cy="56" r="6.5" fill="#111111" />
      <path d="M68 74 Q80 84 92 74" fill="none" {...ink} />
      <circle cx="80" cy="106" r="18" fill="#FFD400" {...ink} />
      <polygon points="80,92 88,106 80,120 72,106" fill="#FF4D3A" {...ink} />
      <circle cx="80" cy="106" r="5" fill="#111111" />
      <path d="M50 32 Q36 14 22 30" fill="none" {...ink} />
      <path d="M110 32 Q124 14 138 30" fill="none" {...ink} />
    </svg>
  )
}
