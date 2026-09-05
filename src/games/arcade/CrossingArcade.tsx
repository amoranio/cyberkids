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

export type CrossingRow =
  | { kind: 'safe'; fill: string; caption?: string }
  | {
      kind: 'hazard'
      fill: string
      caption?: string
      dir: 1 | -1
      speed: number
      width: number
      gap: number
      labels: string[]
      chipFill: string
    }
  | {
      kind: 'float'
      fill: string
      caption?: string
      dir: 1 | -1
      speed: number
      width: number
      gap: number
      labels: string[]
      chipFill: string
    }
  | { kind: 'goal'; fill: string; caption?: string; slots: number; slotLabel: string }
  | {
      kind: 'collect'
      fill: string
      caption?: string
      items: { col: number; label: string }[]
    }

type Mover = {
  id: number
  row: number
  x: number
  w: number
  vx: number
  label: string
  fill: string
  kind: 'hazard' | 'float'
}

type Token = { id: number; row: number; col: number; label: string; taken: boolean }

type World = {
  cols: number
  rows: CrossingRow[]
  movers: Mover[]
  tokens: Token[]
  filled: boolean[]
  fx: number
  row: number
  hopLock: number
  stun: number
  lives: number
  score: number
  status: string
  collectCount: number
  won: boolean
  dead: boolean
  ids: { n: number }
  hitLine: (label: string) => string
  splashLine: string
}

type Props = {
  title: string
  objective: string
  hint: string
  howTo: ReactNode
  character: CharacterId
  cols?: number
  rows: CrossingRow[]
  collectNeeded?: number
  hitLine?: (label: string) => string
  splashLine?: string
  onComplete: () => void
}

function fillLane(
  world: World,
  row: number,
  spec: Extract<CrossingRow, { kind: 'hazard' | 'float' }>,
) {
  const period = spec.width + spec.gap
  let i = 0
  for (let x = -spec.width; x < world.cols + period; x += period) {
    world.movers.push({
      id: nextId(world.ids),
      row,
      x,
      w: spec.width,
      vx: spec.dir * spec.speed,
      label: spec.labels[i % spec.labels.length],
      fill: spec.chipFill,
      kind: spec.kind,
    })
    i += 1
  }
}

function createWorld(
  cols: number,
  rows: CrossingRow[],
  hitLine: (label: string) => string,
  splashLine: string,
): World {
  const world: World = {
    cols,
    rows,
    movers: [],
    tokens: [],
    filled: [],
    fx: (cols - 1) / 2,
    row: rows.length - 1,
    hopLock: 0,
    stun: 0,
    lives: 3,
    score: 0,
    status: 'Hop!',
    collectCount: 0,
    won: false,
    dead: false,
    ids: { n: 0 },
    hitLine,
    splashLine,
  }

  rows.forEach((spec, row) => {
    if (spec.kind === 'hazard' || spec.kind === 'float') {
      fillLane(world, row, spec)
    }
    if (spec.kind === 'goal') {
      world.filled = Array.from({ length: spec.slots }, () => false)
    }
    if (spec.kind === 'collect') {
      for (const item of spec.items) {
        world.tokens.push({
          id: nextId(world.ids),
          row,
          col: item.col,
          label: item.label,
          taken: false,
        })
      }
    }
  })

  return world
}

function startCell(world: World) {
  world.fx = (world.cols - 1) / 2
  world.row = world.rows.length - 1
  world.hopLock = 0.12
  world.stun = 0.7
}

function slotCols(cols: number, slots: number) {
  if (slots <= 1) return [Math.floor(cols / 2)]
  const out: number[] = []
  for (let i = 0; i < slots; i++) {
    out.push(Math.round(((i + 1) * (cols + 1)) / (slots + 1) - 1))
  }
  return out
}

function playerBox(world: World) {
  return { x: world.fx, y: world.row + 0.12, w: 0.76, h: 0.76 }
}

function die(world: World, why: string, soundOn: boolean) {
  if (world.stun > 0 || world.won || world.dead) return
  sfx.wrong(soundOn)
  world.lives -= 1
  world.status = why
  if (world.lives <= 0) {
    world.dead = true
    world.status = 'Out of hops!'
    return
  }
  startCell(world)
}

function tryHop(world: World, dir: Dir, soundOn: boolean, collectNeeded: number) {
  if (world.hopLock > 0 || world.won || world.dead) return
  let nr = world.row
  let nfx = world.fx
  if (dir === 'up') nr -= 1
  if (dir === 'down') nr += 1
  if (dir === 'left') nfx -= 1
  if (dir === 'right') nfx += 1
  if (nr < 0 || nr >= world.rows.length) return
  nfx = clamp(nfx, 0, world.cols - 0.85)
  const spec = world.rows[nr]

  if (spec.kind === 'goal') {
    const slots = slotCols(world.cols, spec.slots)
    const col = Math.round(nfx)
    const idx = slots.findIndex((c) => Math.abs(c - col) <= 0.51)
    if (idx < 0) {
      world.status = 'Land on a marked pad!'
      return
    }
    if (world.collectCount < collectNeeded) {
      world.status = `Grab ${collectNeeded - world.collectCount} more lanterns first!`
      sfx.wrong(soundOn)
      return
    }
    if (world.filled[idx]) {
      world.status = 'That pad is full — try another!'
      return
    }
    world.row = nr
    world.fx = slots[idx]
    world.filled[idx] = true
    world.score += 80
    sfx.success(soundOn)
    const have = world.filled.filter(Boolean).length
    if (have >= world.filled.length) {
      world.won = true
      world.status = 'You made it!'
      return
    }
    world.status = `Safe! ${have}/${world.filled.length}`
    startCell(world)
    world.stun = 0.25
    return
  }

  if (spec.kind === 'float') {
    const dummy = { x: nfx, y: nr + 0.15, w: 0.76, h: 0.7 }
    const log = world.movers.find(
      (m) =>
        m.kind === 'float' &&
        m.row === nr &&
        overlaps(dummy, { x: m.x, y: m.row, w: m.w, h: 1 }, 0.08),
    )
    if (!log) {
      world.row = nr
      world.fx = nfx
      die(world, world.splashLine, soundOn)
      return
    }
  }

  world.row = nr
  world.fx = nfx
  world.hopLock = 0.14
  sfx.hop(soundOn)

  if (spec.kind === 'collect') {
    for (const token of world.tokens) {
      if (token.taken || token.row !== nr) continue
      if (Math.abs(token.col - world.fx) < 0.7) {
        token.taken = true
        world.collectCount += 1
        world.score += 30
        sfx.catch(soundOn)
        world.status = `Got “${token.label}”! (${world.collectCount})`
      }
    }
  }
}

function step(world: World, dt: number, soundOn: boolean) {
  if (world.won || world.dead) return
  world.hopLock = Math.max(0, world.hopLock - dt)
  world.stun = Math.max(0, world.stun - dt)

  for (const m of world.movers) {
    m.x += m.vx * dt
    if (m.vx > 0 && m.x > world.cols + 0.4) m.x = -m.w - 0.2
    if (m.vx < 0 && m.x + m.w < -0.4) m.x = world.cols + 0.2
  }

  const spec = world.rows[world.row]
  const pb = playerBox(world)

  if (spec.kind === 'float') {
    const log = world.movers.find(
      (m) =>
        m.kind === 'float' &&
        m.row === world.row &&
        overlaps(pb, { x: m.x, y: m.row, w: m.w, h: 1 }, 0.12),
    )
    if (!log) {
      die(world, world.splashLine, soundOn)
      return
    }
    world.fx += log.vx * dt
    if (world.fx < -0.2 || world.fx > world.cols - 0.55) {
      die(world, 'Don’t drift off the log!', soundOn)
      return
    }
  }

  if (spec.kind === 'hazard' && world.stun <= 0) {
    const hit = world.movers.find(
      (m) =>
        m.kind === 'hazard' &&
        m.row === world.row &&
        overlaps(pb, { x: m.x, y: m.row, w: m.w, h: 1 }, 0.22),
    )
    if (hit) {
      die(world, world.hitLine(hit.label), soundOn)
    }
  }
}

function snap(world: World) {
  return {
    movers: world.movers.map((m) => ({ ...m })),
    tokens: world.tokens.map((t) => ({ ...t })),
    filled: [...world.filled],
    collectCount: world.collectCount,
    fx: world.fx,
    row: world.row,
    lives: world.lives,
    score: world.score,
    status: world.status,
    won: world.won,
    dead: world.dead,
  }
}

export function CrossingArcade({
  title,
  objective,
  hint,
  howTo,
  character,
  cols = 7,
  rows,
  collectNeeded = 0,
  hitLine = (label) => `Dodge “${label}” — that stays private!`,
  splashLine = 'Hop on a green log!',
  onComplete,
}: Props) {
  const { soundOn } = useProgress()
  const worldRef = useRef<World>(createWorld(cols, rows, hitLine, splashLine))
  const [started, setStarted] = useState(false)
  const [view, setView] = useState(() => snap(worldRef.current))
  const done = useRef(false)
  const completeRef = useLatest(onComplete)
  const soundRef = useLatest(soundOn)
  const fieldRef = useRef<HTMLDivElement>(null)
  const playingRef = useRef(false)
  const overlay = !started ? 'howto' : view.dead ? 'lose' : null

  const reset = useCallback(
    (play: boolean) => {
      done.current = false
      playingRef.current = play
      worldRef.current = createWorld(cols, rows, hitLine, splashLine)
      setView(snap(worldRef.current))
      setStarted(play)
    },
    [cols, rows, hitLine, splashLine],
  )

  const hop = useCallback(
    (dir: Dir) => {
      if (!playingRef.current) return
      const w = worldRef.current
      if (w.dead || w.won) return
      tryHop(w, dir, soundRef.current, collectNeeded)
      setView(snap(w))
    },
    [collectNeeded, soundRef],
  )

  useArcadeKeys({
    enabled: true,
    mode: 'pulse',
    onDir: hop,
    onStart: () => {
      if (!started || view.dead) reset(true)
    },
  })

  useGameLoop(started && !view.won && !view.dead, (dt) => {
    step(worldRef.current, dt, soundRef.current)
    const next = snap(worldRef.current)
    setView(next)
    if (next.won && !done.current) {
      done.current = true
      completeRef.current()
    }
  })

  const onFieldPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!started || view.dead || view.won) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * cols
    const y = ((e.clientY - rect.top) / rect.height) * rows.length
    const dx = x - (worldRef.current.fx + 0.4)
    const dy = y - (worldRef.current.row + 0.4)
    if (Math.abs(dx) < 0.2 && Math.abs(dy) < 0.2) return
    hop(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up')
  }

  const rowCount = rows.length
  const cellW = 100 / cols
  const cellH = 100 / rowCount
  return (
    <ArcadeShell
      title={title}
      objective={objective}
      hint={hint}
      lives={view.lives}
      score={view.score}
      status={view.status}
      overlay={overlay}
      howTo={howTo}
      fieldRef={fieldRef}
      onStart={() => reset(true)}
      onRetry={() => reset(true)}
      onDir={hop}
      onFieldPointerDown={onFieldPointerDown}
    >
      {rows.map((spec, i) => (
        <div
          key={i}
          className="arcade__lane"
          style={{ top: `${i * cellH}%`, height: `${cellH}%`, background: spec.fill }}
        >
          {spec.caption ? <span className="arcade__lane-tag">{spec.caption}</span> : null}
        </div>
      ))}
      {rows.map((spec, i) => {
        if (spec.kind !== 'goal') return null
        const slots = slotCols(cols, spec.slots)
        return slots.map((col, idx) => (
          <div
            key={`g-${idx}`}
            className={`arcade__slot ${view.filled[idx] ? 'arcade__slot--full' : ''}`}
            style={{
              left: `${col * cellW + 2}%`,
              top: `${i * cellH + 6}%`,
              width: `${cellW - 4}%`,
              height: `${cellH - 12}%`,
            }}
          >
            {view.filled[idx] ? 'SAFE' : spec.slotLabel}
          </div>
        ))
      })}
      {view.tokens
        .filter((t) => !t.taken)
        .map((t) => (
          <div
            key={t.id}
            className="arcade__token"
            style={{
              left: `${t.col * cellW + 8}%`,
              top: `${t.row * cellH + 10}%`,
              width: `${cellW - 16}%`,
              height: `${cellH - 20}%`,
            }}
          >
            {t.label}
          </div>
        ))}
      {view.movers.map((m) => (
        <div
          key={m.id}
          className="arcade__chip"
          style={{
            left: `${m.x * cellW}%`,
            top: `${m.row * cellH + 8}%`,
            width: `${m.w * cellW}%`,
            height: `${cellH - 16}%`,
            background: m.fill,
          }}
        >
          {m.label}
        </div>
      ))}
      <div
        className="arcade__hero"
        style={{
          left: `${view.fx * cellW}%`,
          top: `${view.row * cellH + 4}%`,
          width: `${cellW}%`,
          height: `${cellH - 8}%`,
        }}
      >
        <Character id={character} size="xs" animated={false} />
      </div>
      {collectNeeded > 0 && overlay === null ? (
        <div
          className="arcade__lane-tag"
          style={{ right: 8, left: 'auto', top: 8, transform: 'none', opacity: 1 }}
        >
          Lanterns {view.collectCount}/{collectNeeded}
        </div>
      ) : null}
    </ArcadeShell>
  )
}
