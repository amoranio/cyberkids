import { RainBlaster, type RainWave } from './arcade/RainBlaster'

const mean = (label: string) =>
  ({ label, kind: 'blast' as const, fill: '#FF4D3A', color: '#fff' })
const kind = (label: string) =>
  ({ label, kind: 'catch' as const, fill: '#FF5A8A' })
const help = (label: string) =>
  ({ label, kind: 'catch' as const, fill: '#FFD400' })

const WAVES: RainWave[] = [
  {
    spawnEvery: 1.3,
    speed: 17,
    queue: [
      mean("You're bad at this"),
      kind('Nice try!'),
      mean('Go away'),
      help('HELP A FRIEND'),
      mean('Weird drawing'),
    ],
  },
  {
    spawnEvery: 1.15,
    speed: 21,
    queue: [
      mean("Don't play with them"),
      kind('Want to play?'),
      mean('You ruined it'),
      mean('Haha lose more'),
      kind('Cool idea!'),
      help('HELP A FRIEND'),
    ],
  },
  {
    spawnEvery: 1.05,
    speed: 24,
    queue: [
      mean('Get out of chat'),
      kind('You okay?'),
      mean('Nobody likes that'),
      help('HELP A FRIEND'),
      mean('Sit out forever'),
      kind('Team up next?'),
    ],
  },
]

type Props = { onComplete: () => void }

export function KindnessInvadersGame({ onComplete }: Props) {
  return (
    <RainBlaster
      title="Kindness Invaders"
      objective="Blast mean meteors with KIND stars. Catch pink/yellow kind notes — don’t shoot them."
      hint="Slide or arrows to move · Space / KIND to shoot"
      character="spark"
      fireLabel="KIND"
      bulletClass="arcade__bullet arcade__bullet--kind"
      waves={WAVES}
      lines={{
        blast: 'Kind reply landed on',
        pass: 'Flew by',
        catch: 'Caught',
        oops: 'Don’t shoot kind words like',
      }}
      onComplete={onComplete}
      howTo={
        <ul>
          <li>Coral mean notes — zap them with KIND.</li>
          <li>Pink kind notes and yellow HELP A FRIEND tokens — move under them to catch.</li>
          <li>Do not shoot kind words. Clear 3 waves to win.</li>
        </ul>
      }
    />
  )
}
