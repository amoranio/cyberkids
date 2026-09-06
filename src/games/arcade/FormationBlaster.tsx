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

export type AlienRole = 'weak' | 'strong'

export type WaveSpec = {
  rows: number
  cols: number
  weak: string[]
  strong: string[]
  strongEvery?: number
}

type Alien = {
  id: number
  ox: number
  oy: number
  w: number
  h: number
  label: string
  role: AlienRole
  alive: boolean
}

type Bullet = { id: number; x: number; y: number; w: number; h: number }

type World = {
  playerX: number
  playerW: number
  playerH: number
  originX: number
  originY: number
  dir: 1 | -1
  speed: number
  aliens: Alien[]
  bullets: Bullet[]
  cooldown: number
  lives: number
  score: number
  status: string
  wave: number
  waves: WaveSpec[]
  won: boolean
  dead: boolean
  ids: { n: number }
  flash: number
}

function spawnWave(world: World, spec: WaveSpec) {
  world.aliens = []
  world.originX = 6
  world.originY = 6
  world.dir = 1
  const gapX = 16
  const gapY = 14
  const w = 14
  const h = 10
  const strongEvery = spec.strongEvery ?? 3
  let wi = 0
  let si = 0
  for (let r = 0; r < spec.rows; r++) {
    for (let c = 0; c < spec.cols; c++) {
      const isStrong = (r + c) % strongEvery === 1 && spec.strong.length > 0
      world.aliens.push({
        id: nextId(world.ids),
        ox: c * gapX,
        oy: r * gapY,
        w,
        h,
        label: isStrong
          ? spec.strong[si++ % spec.strong.length]
          : spec.weak[wi++ % spec.weak.length],
        role: isStrong ? 'strong' : 'weak',
        alive: true,
      })
    }
  }
}

function createWorld(waves: WaveSpec[], speed: number): World {
  const world: World = {
    playerX: 44,
    playerW: 12,
    playerH: 12,
    originX: 6,
    originY: 6,
    dir: 1,
    speed,
    aliens: [],
    bullets: [],
    cooldown: 0,
    lives: 3,
    score: 0,
    status: 'Blast weak keys!',
    wave: 0,
    waves,
    won: false,
    dead: false,
    ids: { n: 0 },
    flash: 0,
  }
  spawnWave(world, waves[0])
  return world
}

function alienBox(world: World, a: Alien) {
  return {
    x: world.originX + a.ox,
    y: world.originY + a.oy,
    w: a.w,
    h: a.h,
  }
}

function hurt(world: World, why: string, soundOn: boolean) {
  if (world.flash > 0 || world.won || world.dead) return
  sfx.wrong(soundOn)
  world.lives -= 1
  world.status = why
  world.flash = 0.7
  if (world.lives <= 0) {
    world.dead = true
    world.status = 'Out of zaps!'
  }
}

function shoot(world: World, soundOn: boolean) {
  if (world.cooldown > 0 || world.won || world.dead) return
  world.cooldown = 0.32
  world.bullets.push({
    id: nextId(world.ids),
    x: world.playerX + world.playerW / 2 - 1.1,
    y: 82,
    w: 2.2,
    h: 6,
  })
  sfx.pew(soundOn)
}

function step(world: World, dt: number, held: Set<Dir>, fireHeld: boolean, soundOn: boolean) {
  if (world.won || world.dead) return
  world.cooldown = Math.max(0, world.cooldown - dt)
  world.flash = Math.max(0, world.flash - dt)

  if (held.has('left')) world.playerX -= 55 * dt
  if (held.has('right')) world.playerX += 55 * dt
  world.playerX = clamp(world.playerX, 2, 86)

  if (fireHeld) shoot(world, soundOn)

  const live = world.aliens.filter((a) => a.alive)
  let minX = 100
  let maxX = 0
  for (const a of live) {
    const b = alienBox(world, a)
    minX = Math.min(minX, b.x)
    maxX = Math.max(maxX, b.x + b.w)
  }
  world.originX += world.dir * world.speed * dt
  if (live.length && (minX < 2 || maxX > 98)) {
    world.dir = world.dir === 1 ? -1 : 1
    world.originY += 4.5
    world.originX += world.dir * 2
  }

  for (const bullet of world.bullets) {
    bullet.y -= 95 * dt
  }
  world.bullets = world.bullets.filter((b) => b.y + b.h > -4)

  for (const bullet of [...world.bullets]) {
    for (const alien of world.aliens) {
      if (!alien.alive) continue
      if (!overlaps(bullet, alienBox(world, alien), 0)) continue
      world.bullets = world.bullets.filter((b) => b.id !== bullet.id)
      if (alien.role === 'weak') {
        alien.alive = false
        world.score += 20
        sfx.success(soundOn)
        world.status = `Zapped weak key “${alien.label}”!`
      } else {
        hurt(world, `Don’t blast a strong key like “${alien.label}”!`, soundOn)
      }
      break
    }
  }

  for (const alien of world.aliens) {
    if (!alien.alive) continue
    const box = alienBox(world, alien)
    if (box.y + box.h < 84) continue
    alien.alive = false
    if (alien.role === 'weak') {
      hurt(world, `A weak key reached you! Blast “${alien.label}” sooner.`, soundOn)
    } else {
      world.score += 15
      sfx.catch(soundOn)
      world.status = `Caught strong key “${alien.label}”!`
    }
  }

  const weakLeft = world.aliens.some((a) => a.alive && a.role === 'weak')
  if (!weakLeft) {
    for (const a of world.aliens) {
      if (a.alive && a.role === 'strong') {
        a.alive = false
        world.score += 10
      }
    }
    if (world.wave >= world.waves.length - 1) {
      world.won = true
      world.status = 'All weak keys cleared!'
      sfx.success(soundOn)
      return
    }
    world.wave += 1
    world.speed += 3
    spawnWave(world, world.waves[world.wave])
    world.status = `Wave ${world.wave + 1} — blast the tiny keys!`
    sfx.catch(soundOn)
  }
}

function snap(world: World) {
  return {
    playerX: world.playerX,
    originX: world.originX,
    originY: world.originY,
    aliens: world.aliens.map((a) => ({ ...a })),
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
  waves: WaveSpec[]
  speed?: number
  onComplete: () => void
}

export function FormationBlaster({
  title,
  objective,
  hint,
  howTo,
  character,
  fireLabel = 'ZAP',
  waves,
  speed = 11,
  onComplete,
}: Props) {
  const { soundOn } = useProgress()
  const worldRef = useRef<World>(createWorld(waves, speed))
  const [started, setStarted] = useState(false)
  const [view, setView] = useState(() => snap(worldRef.current))
  const done = useRef(false)
  const completeRef = useLatest(onComplete)
  const soundRef = useLatest(soundOn)
  const fieldRef = useRef<HTMLDivElement>(null)
  const fireHeld = useRef(false)
  const dragging = useRef(false)
  const overlay = !started ? 'howto' : view.dead ? 'lose' : null

  const reset = useCallback(
    (play: boolean) => {
      done.current = false
      fireHeld.current = false
      worldRef.current = createWorld(waves, speed)
      setView(snap(worldRef.current))
      setStarted(play)
    },
    [waves, speed],
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
    step(worldRef.current, dt, held.current, fireHeld.current, soundRef.current)
    const next = snap(worldRef.current)
    setView(next)
    if (next.won && !done.current) {
      done.current = true
      completeRef.current()
    }
  })

  const moveToPointer = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!started || view.dead || view.won) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    worldRef.current.playerX = clamp(x - worldRef.current.playerW / 2, 2, 86)
    setView(snap(worldRef.current))
  }

  const padDir = (dir: Dir) => {
    if (dir === 'left' || dir === 'right') held.current.add(dir)
  }
  const padUp = (dir: Dir) => {
    held.current.delete(dir)
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
      onDirUp={padUp}
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
      {view.aliens
        .filter((a) => a.alive)
        .map((a) => (
          <div
            key={a.id}
            className="arcade__chip"
            style={{
              left: `${view.originX + a.ox}%`,
              top: `${view.originY + a.oy}%`,
              width: `${a.w}%`,
              height: `${a.h}%`,
              background: a.role === 'weak' ? 'var(--coral)' : 'var(--yellow)',
              color: a.role === 'weak' ? '#fff' : 'var(--ink)',
            }}
          >
            {a.label}
          </div>
        ))}
      {view.bullets.map((b) => (
        <div
          key={b.id}
          className="arcade__bullet"
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
