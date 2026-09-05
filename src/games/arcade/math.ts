export type Dir = 'up' | 'down' | 'left' | 'right'

export type Rect = { x: number; y: number; w: number; h: number }

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

export function overlaps(a: Rect, b: Rect, pad = 0) {
  return (
    a.x + pad < b.x + b.w - pad &&
    a.x + a.w - pad > b.x + pad &&
    a.y + pad < b.y + b.h - pad &&
    a.y + a.h - pad > b.y + pad
  )
}

export function nextId(counter: { n: number }) {
  counter.n += 1
  return counter.n
}
