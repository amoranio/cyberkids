import { RainBlaster, type RainWave } from './arcade/RainBlaster'

const fake = (label: string) =>
  ({ label, kind: 'blast' as const, fill: '#FF4D3A', color: '#fff' })
const safe = (label: string) =>
  ({ label, kind: 'pass' as const, fill: '#00B39A' })

const WAVES: RainWave[] = [
  {
    spawnEvery: 1.35,
    speed: 18,
    queue: [
      fake('FREE TABLET!!'),
      safe('Mom: snack time'),
      fake('YOU WON!!!'),
      safe('Class: art at 2'),
      fake('SEND PIN'),
    ],
  },
  {
    spawnEvery: 1.2,
    speed: 22,
    queue: [
      fake('CLICK n0w'),
      safe('Dad: on my way'),
      fake('WEIRD LINK'),
      safe('Homework is posted'),
      fake('FREE GEMS'),
      fake('CALL US NOW'),
    ],
  },
  {
    spawnEvery: 1.05,
    speed: 26,
    queue: [
      fake('TAP OR LOSE'),
      safe('Grandpa: garden pic'),
      fake('PRIZE NOW!!!'),
      safe('Coach: practice 4'),
      fake('ODD LINK'),
    ],
  },
]

type Props = { onComplete: (score?: number) => void }

export function TrickInvadersGame({ onComplete }: Props) {
  return (
    <RainBlaster
      title="Trick Invaders"
      objective="Zap fake prize pop-ups. Let real family and class notes land."
      hint="Slide or arrows to move · Space / ZAP to shoot"
      character="spotter"
      fireLabel="ZAP"
      waves={WAVES}
      lines={{
        blast: 'Trick spotted!',
        pass: 'Safe note landed.',
        catch: 'Caught',
        oops: 'That one was real — don’t zap',
      }}
      onComplete={onComplete}
      howTo={
        <ul>
          <li>Coral pop-ups (FREE TABLET, YOU WON) are tricks — zap them.</li>
          <li>Teal notes (Mom, class, coach) are known — let them land.</li>
          <li>Clear 3 waves without letting a trick hit the ground.</li>
        </ul>
      }
    />
  )
}
