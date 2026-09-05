import { CrossingArcade, type CrossingRow } from './arcade/CrossingArcade'

const ROWS: CrossingRow[] = [
  {
    kind: 'goal',
    fill: '#2f6fed',
    caption: 'LOOKOUT',
    slots: 1,
    slotLabel: 'BEACON',
  },
  {
    kind: 'hazard',
    fill: '#fffcf6',
    caption: 'DODGE',
    dir: 1,
    speed: 1.45,
    width: 2.15,
    gap: 2.55,
    labels: ["DON'T TELL", 'KEEP SECRET'],
    chipFill: '#FF4D3A',
  },
  {
    kind: 'collect',
    fill: '#e7e1d4',
    caption: 'GRAB',
    items: [
      { col: 1, label: 'TELL MOM' },
      { col: 4, label: 'ASK DAD' },
    ],
  },
  {
    kind: 'hazard',
    fill: '#fffcf6',
    dir: -1,
    speed: 1.8,
    width: 2.05,
    gap: 2.45,
    labels: ["IT'S FINE", "DON'T BOTHER"],
    chipFill: '#FF4D3A',
  },
  {
    kind: 'collect',
    fill: '#e7e1d4',
    items: [
      { col: 2, label: 'TEACHER' },
      { col: 5, label: 'GROWN-UP' },
    ],
  },
  {
    kind: 'hazard',
    fill: '#fffcf6',
    dir: 1,
    speed: 1.3,
    width: 1.95,
    gap: 2.8,
    labels: ['HIDE IT', 'NO ONE CARES'],
    chipFill: '#FF4D3A',
  },
  { kind: 'safe', fill: '#e7e1d4', caption: 'START' },
]

function hitLine(label: string) {
  return `“${label}” is a trap — tell a grown-up instead!`
}

type Props = { onComplete: () => void }

export function BeaconRunGame({ onComplete }: Props) {
  return (
    <CrossingArcade
      title="Beacon Run"
      objective="Grab 3 tell-a-grown-up lanterns, then hop into Beacon’s lookout."
      hint="Arrows or D-pad · tap the map to hop that way"
      character="spark"
      rows={ROWS}
      collectNeeded={3}
      hitLine={hitLine}
      splashLine="Stay off the red trucks!"
      onComplete={onComplete}
      howTo={
        <ul>
          <li>Yellow lanterns (TELL MOM, TEACHER) — hop onto them.</li>
          <li>Red trucks (DON’T TELL, KEEP SECRET) — dodge them.</li>
          <li>After 3 lanterns, land on the blue BEACON pad.</li>
        </ul>
      }
    />
  )
}
