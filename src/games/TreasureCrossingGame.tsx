import { CrossingArcade, type CrossingRow } from './arcade/CrossingArcade'

const ROWS: CrossingRow[] = [
  {
    kind: 'goal',
    fill: '#ffd400',
    caption: 'VAULT',
    slots: 3,
    slotLabel: 'VAULT',
  },
  {
    kind: 'float',
    fill: '#7ad9c9',
    caption: 'RIDE',
    dir: 1,
    speed: 1.35,
    width: 2.2,
    gap: 2.5,
    labels: ['I LIKE CATS', 'PIZZA TIME', 'GO SOCCER'],
    chipFill: '#00B39A',
  },
  {
    kind: 'float',
    fill: '#7ad9c9',
    dir: -1,
    speed: 1.65,
    width: 2.3,
    gap: 2.3,
    labels: ['I DRAW', 'BLUE IS COOL', 'ROBOTS!'],
    chipFill: '#00B39A',
  },
  { kind: 'safe', fill: '#e7e1d4', caption: 'PATH' },
  {
    kind: 'hazard',
    fill: '#fffcf6',
    caption: 'DODGE',
    dir: 1,
    speed: 1.5,
    width: 1.9,
    gap: 2.7,
    labels: ['ADDRESS', 'PASSWORD', 'PHONE'],
    chipFill: '#FF4D3A',
  },
  {
    kind: 'hazard',
    fill: '#fffcf6',
    dir: -1,
    speed: 1.9,
    width: 1.85,
    gap: 2.55,
    labels: ['SCHOOL', 'BIRTHDAY'],
    chipFill: '#FF4D3A',
  },
  {
    kind: 'hazard',
    fill: '#fffcf6',
    dir: 1,
    speed: 1.35,
    width: 2.0,
    gap: 2.9,
    labels: ['STREET #', 'LAST NAME'],
    chipFill: '#FF4D3A',
  },
  { kind: 'safe', fill: '#e7e1d4', caption: 'START' },
]

type Props = { onComplete: () => void }

export function TreasureCrossingGame({ onComplete }: Props) {
  return (
    <CrossingArcade
      title="Treasure Crossing"
      objective="Hop Privy to the yellow vaults. Dodge red private trucks. Ride green logs."
      hint="Arrows or D-pad · tap the map to hop that way"
      character="privy"
      rows={ROWS}
      onComplete={onComplete}
      howTo={
        <ul>
          <li>
            Red trucks (ADDRESS, PASSWORD, SCHOOL) hurt — hop around them.
          </li>
          <li>Green logs (I LIKE CATS, PIZZA TIME) are safe to ride.</li>
          <li>Fill all 3 vault pads to win.</li>
        </ul>
      }
    />
  )
}
