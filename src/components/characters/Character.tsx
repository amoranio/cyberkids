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
  strokeWidth: 6,
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
      className={`character character--${size} ${animated ? 'character--idle' : ''} ${className}`}
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
    <svg viewBox="0 0 180 180" className="character__svg">
      <path d="M56 150 H124 L132 162 H48 Z" fill="#1E3A5F" {...ink} />
      <path
        d="M90 16 L146 38 V88 C146 128 90 160 90 160 C90 160 34 128 34 88 V38 Z"
        fill="#FFD400"
        {...ink}
      />
      <path
        d="M90 44 L124 58 V90 C124 116 90 138 90 138 C90 138 56 116 56 90 V58 Z"
        fill="#00B39A"
        {...ink}
      />
      <rect x="64" y="70" width="52" height="16" rx="3" fill="#111111" {...ink} strokeWidth={5} />
      <rect x="72" y="74" width="12" height="8" fill="#FFD400" />
      <rect x="96" y="74" width="12" height="8" fill="#FFD400" />
      <path d="M78 100 H102" fill="none" {...ink} strokeWidth={5} />
      <path d="M50 32 L38 14" fill="none" {...ink} />
      <path d="M130 32 L142 14" fill="none" {...ink} />
      <rect x="32" y="8" width="12" height="12" fill="#00B39A" {...ink} strokeWidth={5} />
      <rect x="136" y="8" width="12" height="12" fill="#00B39A" {...ink} strokeWidth={5} />
    </svg>
  )
}

function KeyoraSvg() {
  return (
    <svg viewBox="0 0 180 180" className="character__svg">
      <path d="M40 70 Q22 36 54 32 Q70 52 62 78 Z" fill="#FFFcf6" {...ink} />
      <path d="M140 70 Q158 36 126 32 Q110 52 118 78 Z" fill="#FFFcf6" {...ink} />
      <ellipse cx="90" cy="74" rx="40" ry="36" fill="#FFD400" {...ink} />
      <path d="M68 60 L84 66 L68 70" fill="none" {...ink} strokeWidth={5} />
      <path d="M112 60 L96 66 L112 70" fill="none" {...ink} strokeWidth={5} />
      <rect x="66" y="62" width="16" height="10" rx="2" fill="#111111" />
      <rect x="98" y="62" width="16" height="10" rx="2" fill="#111111" />
      <path d="M80 84 H102" fill="none" {...ink} strokeWidth={5} />
      <circle cx="90" cy="102" r="10" fill="#111111" {...ink} strokeWidth={5} />
      <circle cx="90" cy="102" r="4" fill="#FFD400" />
      <rect x="82" y="110" width="16" height="38" rx="4" fill="#FFD400" {...ink} />
      <path d="M98 132 H128 V144 H98 Z" fill="#FFD400" {...ink} />
      <path d="M98 148 H118 V160 H98 Z" fill="#FFD400" {...ink} />
    </svg>
  )
}

function PrivySvg() {
  return (
    <svg viewBox="0 0 180 180" className="character__svg">
      <ellipse cx="50" cy="140" rx="16" ry="9" fill="#1E3A5F" {...ink} />
      <ellipse cx="130" cy="140" rx="16" ry="9" fill="#1E3A5F" {...ink} />
      <path
        d="M34 108 Q38 62 90 54 Q142 62 146 108 Q142 146 90 154 Q38 146 34 108 Z"
        fill="#00B39A"
        {...ink}
      />
      <path d="M62 86 L90 68 L118 86 L104 122 H76 Z" fill="#1E3A5F" {...ink} strokeWidth={5} />
      <rect x="78" y="90" width="24" height="22" rx="3" fill="#FFD400" {...ink} strokeWidth={5} />
      <circle cx="90" cy="98" r="5" fill="#111111" />
      <rect x="88" y="102" width="4" height="7" fill="#111111" />
      <path
        d="M70 54 Q78 28 102 32 Q118 36 116 58 Q108 70 88 66 Q70 62 70 54 Z"
        fill="#00B39A"
        {...ink}
      />
      <path d="M86 42 L104 44" fill="none" {...ink} strokeWidth={5} />
      <ellipse cx="98" cy="48" rx="7" ry="5" fill="#FFFcf6" {...ink} strokeWidth={4.5} />
      <ellipse cx="100" cy="48" rx="2.8" ry="3.2" fill="#111111" />
      <path d="M108 56 Q114 58 110 62" fill="none" {...ink} strokeWidth={4.5} />
    </svg>
  )
}

function SpotterSvg() {
  return (
    <svg viewBox="0 0 180 180" className="character__svg">
      <path d="M54 22 L68 54 L90 40 Z" fill="#1E3A5F" {...ink} />
      <path d="M126 22 L112 54 L90 40 Z" fill="#1E3A5F" {...ink} />
      <path
        d="M44 78 Q48 38 90 34 Q132 38 136 78 Q142 122 90 152 Q38 122 44 78 Z"
        fill="#FF4D3A"
        {...ink}
      />
      <rect x="58" y="68" width="28" height="18" rx="3" fill="#FFFcf6" {...ink} strokeWidth={5} />
      <rect x="94" y="68" width="28" height="18" rx="3" fill="#FFFcf6" {...ink} strokeWidth={5} />
      <rect x="66" y="72" width="12" height="10" fill="#111111" />
      <rect x="102" y="72" width="12" height="10" fill="#111111" />
      <path d="M86 90 L90 102 L94 90" fill="#FFD400" {...ink} strokeWidth={5} />
      <circle cx="140" cy="130" r="22" fill="#FFD400" {...ink} />
      <circle cx="140" cy="130" r="9" fill="none" stroke="#111111" strokeWidth={6} />
      <path d="M156 146 L170 160" fill="none" {...ink} strokeWidth={8} />
    </svg>
  )
}

function SparkSvg() {
  return (
    <svg viewBox="0 0 180 180" className="character__svg">
      <path
        d="M90 18 L102 70 L156 58 L114 96 L168 128 L102 114 L90 168 L78 114 L12 128 L66 96 L24 58 L78 70 Z"
        fill="#FF5A8A"
        {...ink}
      />
      <path d="M72 78 H86" fill="none" {...ink} strokeWidth={5} />
      <path d="M108 78 H94" fill="none" {...ink} strokeWidth={5} />
      <circle cx="80" cy="86" r="4.5" fill="#111111" />
      <circle cx="100" cy="86" r="4.5" fill="#111111" />
      <path d="M80 104 H102" fill="none" {...ink} strokeWidth={5} />
    </svg>
  )
}

function BeaconSvg() {
  return (
    <svg viewBox="0 0 180 180" className="character__svg">
      <path d="M22 86 Q16 44 58 56 Q68 92 50 120 Q20 116 22 86 Z" fill="#2F6FED" {...ink} />
      <path d="M158 86 Q164 44 122 56 Q112 92 130 120 Q160 116 158 86 Z" fill="#2F6FED" {...ink} />
      <ellipse cx="90" cy="112" rx="36" ry="34" fill="#1E3A5F" {...ink} />
      <ellipse cx="90" cy="66" rx="32" ry="28" fill="#2F6FED" {...ink} />
      <circle cx="78" cy="64" r="6" fill="#111111" />
      <circle cx="102" cy="64" r="6" fill="#111111" />
      <path d="M78 80 H104" fill="none" {...ink} strokeWidth={5} />
      <circle cx="90" cy="120" r="18" fill="#FFD400" {...ink} strokeWidth={5} />
      <path d="M90 104 L95 120 L90 136 L85 120 Z" fill="#FF4D3A" {...ink} strokeWidth={4} />
      <circle cx="90" cy="120" r="4" fill="#111111" />
      <path d="M64 38 L48 14" fill="none" {...ink} />
      <path d="M116 38 L132 14" fill="none" {...ink} />
    </svg>
  )
}
