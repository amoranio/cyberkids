import { useEffect } from 'react'
import { useLatest } from './useLatest'

export function useGameLoop(running: boolean, onFrame: (dt: number) => void) {
  const cb = useLatest(onFrame)

  useEffect(() => {
    if (!running) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      cb.current(dt)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [running, cb])
}
