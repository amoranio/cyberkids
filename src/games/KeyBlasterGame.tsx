import { FormationBlaster, type WaveSpec } from './arcade/FormationBlaster'

const WAVES: WaveSpec[] = [
  {
    rows: 1,
    cols: 4,
    weak: ['1234', 'abc', 'password', '1111'],
    strong: ['PizzaMoon7'],
    strongEvery: 4,
  },
  {
    rows: 2,
    cols: 4,
    weak: ['qwerty', 'name', '0000', 'pass'],
    strong: ['CoralFoxSpin', 'ToastWiggle4'],
    strongEvery: 3,
  },
  {
    rows: 2,
    cols: 5,
    weak: ['abc123', 'admin', '12345', 'letmein'],
    strong: ['MapleRocket!', 'SunnyOtter9'],
    strongEvery: 4,
  },
]

type Props = { onComplete: (score?: number) => void }

export function KeyBlasterGame({ onComplete }: Props) {
  return (
    <FormationBlaster
      title="Key Blaster"
      objective="Zap weak keys (1234, password). Do NOT shoot long silly keys."
      hint="Slide or arrows to move · Space / ZAP to shoot"
      character="keyora"
      fireLabel="ZAP"
      waves={WAVES}
      speed={8}
      onComplete={onComplete}
      howTo={
        <ul>
          <li>Coral chips like 1234 and abc are weak — blast them.</li>
          <li>Yellow chips like PizzaMoon7 are strong — let them pass or catch them.</li>
          <li>Clear 3 waves of weak keys to win.</li>
        </ul>
      }
    />
  )
}
