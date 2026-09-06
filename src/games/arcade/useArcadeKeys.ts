import { useEffect, useRef } from 'react'
import type { Dir } from './math'
import { useLatest } from './useLatest'

const KEY_DIR: Record<string, Dir> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  Up: 'up',
  Down: 'down',
  Left: 'left',
  Right: 'right',
  w: 'up',
  a: 'left',
  s: 'down',
  d: 'right',
  W: 'up',
  A: 'left',
  S: 'down',
  D: 'right',
}

type Opts = {
  enabled: boolean
  mode: 'pulse' | 'hold'
  onDir: (dir: Dir) => void
  onFire?: () => void
  onStart?: () => void
}

export function useArcadeKeys({
  enabled,
  mode,
  onDir,
  onFire,
  onStart,
}: Opts) {
  const held = useRef(new Set<Dir>())
  const dirRef = useLatest(onDir)
  const fireRef = useLatest(onFire)
  const startRef = useLatest(onStart)

  useEffect(() => {
    if (!enabled) {
      held.current.clear()
      return
    }

    const keys = held.current

    const down = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        startRef.current?.()
        return
      }
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault()
        if (!e.repeat) fireRef.current?.()
        return
      }
      const dir = KEY_DIR[e.key]
      if (!dir) return
      e.preventDefault()
      if (mode === 'pulse') {
        if (e.repeat) return
        dirRef.current(dir)
        return
      }
      keys.add(dir)
    }

    const up = (e: KeyboardEvent) => {
      const dir = KEY_DIR[e.key]
      if (dir) keys.delete(dir)
    }

    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      keys.clear()
    }
  }, [enabled, mode, dirRef, fireRef, startRef])

  return held
}
