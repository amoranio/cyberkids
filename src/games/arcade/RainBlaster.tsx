import { useCallback, useRef, useState, type ReactNode } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { Character } from '../../components/characters/Character'
import type { CharacterId } from '../../content/types'
import { useProgress } from '../../context/ProgressContext'
import { sfx } from '../../utils/sound'
import { ArcadeShell } from './ArcadeShell'
import { clamp, nextId, overlaps, type Dir } from './math'
import { useArcadeKeys } from './useArcadeKeys'
import { useGameLoop } from './useGameLoop'
import { useLatest } from './useLatest'

export type RainKind = 'blast' | 'pass' | 'catch'

export type RainSpec = {
  label: string
  kind: RainKind
  fill: string
  color?: string
}

export type RainWave = {
  spawnEvery: number
  speed: number
  queue: RainSpec[]
}

type Item = RainSpec & {
  id: number
  x: number
  y: number
  w: number
  h: number
  vy: number
}

type Bullet = { id: number; x: number; y: number; w: number; h: number }

type World = {
  playerX: number
  playerW: number
  items: Item[]
  bullets: Bullet[]
  cooldown: number
  spawnT: number
  lives: number
  score: number
  status: string
  wave: number
  queueIndex: number
  waves: RainWave[]
  blasted: number
  caught: number
  won: boolean
  dead: boolean
  ids: { n: number }
  flash: number
}

function createWorld(waves: RainWave[]): World {
  return {
    playerX: 44,
    playerW: 14,
    items: [],
    bullets: [],
    cooldown: 0,
    spawnT: 0.4,
    lives: 3,
    score: 0,
    status: 'Ready!',
    wave: 0,
    queueIndex: 0,
    waves,
    blasted: 0,
    caught: 0,
    won: false,
    dead: false,
    ids: { n: 0 },
    flash: 0,
  }
}

function hurt(world: World, why: string, soundOn: boolean) {
  if (world.flash > 0 || world.won || world.dead) return
  sfx.wrong(soundOn)
  world.lives -= 1
  world.status = why
  world.flash = 0.65
  if (world.lives <= 0) {
    world.dead = true
    world.status = 'Out of zaps!'
  }
}

function shoot(world: World, soundOn: boolean) {
  if (world.cooldown > 0 || world.won || world.dead) return
  world.cooldown = 0.3
  world.bullets.push({
    id: nextId(world.ids),
    x: world.playerX + world.playerW / 2 - 1.2,
    y: 80,
    w: 2.4,
    h: 7,
  })
  sfx.pew(soundOn)
}

function spawnNext(world: World) {
  const wave = world.waves[world.wave]
  if (!wave || world.queueIndex >= wave.queue.length) return
  const spec = wave.queue[world.queueIndex]
  world.queueIndex += 1
  const w = spec.label.length > 14 ? 30 : spec.label.length > 9 ? 24 : 20
  world.items.push({
    ...spec,
    id: nextId(world.ids),
    x: 6 + Math.random() * (88 - w),
    y: -12,
    w,
    h: 11,
    vy: wave.speed,
  })
}

function maybeAdvance(world: World, soundOn: boolean) {
  const wave = world.waves[world.wave]
  const queueDone = world.queueIndex >= wave.queue.length
  if (!queueDone || world.items.length > 0) return
  if (world.wave >= world.waves.length - 1) {
    world.won = true
    world.status = 'You cleared the sky!'
    sfx.success(soundOn)
    return
  }
  world.wave += 1
  world.queueIndex = 0
  world.spawnT = 0.5
  world.status = `Wave ${world.wave + 1} — keep going!`
  sfx.catch(soundOn)
}

function step(
  world: World,
  dt: number,
  held: Set<Dir>,
  fireHeld: boolean,
  soundOn: boolean,
  lines: { blast: string; pass: string; catch: string; oops: string },
) {
  if (world.won || world.dead) return
  world.cooldown = Math.max(0, world.cooldown - dt)
  world.flash = Math.max(0, world.flash - dt)

  if (held.has('left')) world.playerX -= 58 * dt
  if (held.has('right')) world.playerX += 58 * dt
  world.playerX = clamp(world.playerX, 2, 84)

  if (fireHeld) shoot(world, soundOn)

  const wave = world.waves[world.wave]
  world.spawnT -= dt
  if (world.spawnT <= 0) {
    spawnNext(world)
    world.spawnT = wave.spawnEvery
  }

  for (const bullet of world.bullets) bullet.y -= 100 * dt
  world.bullets = world.bullets.filter((b) => b.y + b.h > -6)

  const player = { x: world.playerX, y: 84, w: world.playerW, h: 14 }

  for (const item of world.items) item.y += item.vy * dt

  for (const bullet of [...world.bullets]) {
    const hit = world.items.find((it) => overlaps(bullet, it))
    if (!hit) continue
    world.bullets = world.bullets.filter((b) => b.id !== bullet.id)
    world.items = world.items.filter((it) => it.id !== hit.id)
    if (hit.kind === 'blast') {
      world.blasted += 1
      world.score += 25
      sfx.success(soundOn)
      world.status = `${lines.blast} “${hit.label}”`
    } else {
      hurt(world, `${lines.oops} “${hit.label}”`, soundOn)
    }
  }

  const leftover: Item[] = []
  for (const item of world.items) {
    if (item.kind === 'catch' && overlaps(player, item, 0.2)) {
      world.caught += 1
      world.score += 30
      sfx.catch(soundOn)
      world.status = `${lines.catch} “${item.label}”`
      continue
    }
    if (item.y < 92) {
      leftover.push(item)
      continue
    }
    if (item.kind === 'blast') {
      hurt(world, `Stop “${item.label}” before it lands!`, soundOn)
    } else if (item.kind === 'pass') {
      world.score += 8
      world.status = `${lines.pass} “${item.label}”`
    }
  }
  world.items = leftover

  maybeAdvance(world, soundOn)
}

function snap(world: World) {
  return {
    playerX: world.playerX,
    items: world.items.map((i) => ({ ...i })),
    bullets: world.bullets.map((b) => ({ ...b })),
    lives: world.lives,
    score: world.score,
    status: world.status,
    wave: world.wave,
    playerW: world.playerW,
    won: world.won,
    dead: world.dead,
  }
}

type Props = {
  title: string
  objective: string
  hint: string
  howTo: ReactNode
  character: CharacterId
  fireLabel?: string
  bulletClass?: string
  waves: RainWave[]
  lines: { blast: string; pass: string; catch: string; oops: string }
  onComplete: (score?: number) => void
}

export function RainBlaster({
  title,
  objective,
  hint,
  howTo,
  character,
  fireLabel = 'ZAP',
  bulletClass = 'arcade__bullet',
  waves,
  lines,
  onComplete,
}: Props) {
  const { soundOn } = useProgress()
  const worldRef = useRef<World>(createWorld(waves))
  const [started, setStarted] = useState(false)
  const [view, setView] = useState(() => snap(worldRef.current))
  const done = useRef(false)
  const completeRef = useLatest(onComplete)
  const soundRef = useLatest(soundOn)
  const fieldRef = useRef<HTMLDivElement>(null)
  const fireHeld = useRef(false)
  const dragging = useRef(false)
  const linesRef = useLatest(lines)
  const overlay = !started ? 'howto' : view.dead ? 'lose' : null

  const reset = useCallback(
    (play: boolean) => {
      done.current = false
      fireHeld.current = false
      worldRef.current = createWorld(waves)
      setView(snap(worldRef.current))
      setStarted(play)
    },
    [waves],
  )

  const held = useArcadeKeys({
    enabled: true,
    mode: 'hold',
    onDir: () => {},
    onFire: () => {
      if (!started || view.dead) {
        reset(true)
        return
      }
      shoot(worldRef.current, soundRef.current)
    },
    onStart: () => {
      if (!started || view.dead) reset(true)
    },
  })

  useGameLoop(started && !view.won && !view.dead, (dt) => {
    step(
      worldRef.current,
      dt,
      held.current,
      fireHeld.current,
      soundRef.current,
      linesRef.current,
    )
    const next = snap(worldRef.current)
    setView(next)
    if (next.won && !done.current) {
      done.current = true
      completeRef.current(next.score)
    }
  })

  const moveToPointer = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!started || view.dead || view.won) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    worldRef.current.playerX = clamp(x - worldRef.current.playerW / 2, 2, 84)
    setView(snap(worldRef.current))
  }

  const padDir = (dir: Dir) => {
    if (dir === 'left' || dir === 'right') held.current.add(dir)
  }

  return (
    <ArcadeShell
      title={title}
      objective={objective}
      hint={hint}
      lives={view.lives}
      score={view.score}
      status={`Wave ${view.wave + 1}/${waves.length} · ${view.status}`}
      overlay={overlay}
      howTo={howTo}
      showFire
      fireLabel={fireLabel}
      fieldRef={fieldRef}
      onStart={() => reset(true)}
      onRetry={() => reset(true)}
      onDir={padDir}
      onDirUp={(dir) => held.current.delete(dir)}
      onFireDown={() => {
        fireHeld.current = true
        if (started && !view.dead) shoot(worldRef.current, soundRef.current)
      }}
      onFireUp={() => {
        fireHeld.current = false
      }}
      onFieldPointerDown={(e) => {
        dragging.current = true
        moveToPointer(e)
      }}
      onFieldPointerMove={(e) => {
        if (dragging.current) moveToPointer(e)
      }}
      onFieldPointerUp={() => {
        dragging.current = false
      }}
    >
      {view.items.map((it) => (
        <div
          key={it.id}
          className="arcade__chip"
          style={{
            left: `${it.x}%`,
            top: `${it.y}%`,
            width: `${it.w}%`,
            height: `${it.h}%`,
            background: it.fill,
            color: it.color ?? 'var(--ink)',
          }}
        >
          {it.label}
        </div>
      ))}
      {view.bullets.map((b) => (
        <div
          key={b.id}
          className={bulletClass}
          style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%` }}
        />
      ))}
      <div
        className="arcade__hero"
        style={{
          left: `${view.playerX}%`,
          top: '84%',
          width: `${view.playerW}%`,
          height: '14%',
        }}
      >
        <Character id={character} size="xs" animated={false} />
      </div>
    </ArcadeShell>
  )
}
