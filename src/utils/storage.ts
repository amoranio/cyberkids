import { isPointBadgeId } from '../content/badges'

const STORAGE_KEY = 'cyberkids-progress-v1'

export type StoredProgress = {
  nickname: string
  completedLessons: string[]
  completedGames: string[]
  completedQuizzes: string[]
  badges: string[]
  points: number
  soundOn: boolean
}

const defaults: StoredProgress = {
  nickname: '',
  completedLessons: [],
  completedGames: [],
  completedQuizzes: [],
  badges: [],
  points: 0,
  soundOn: false,
}

function sanitizePoints(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : 0
}

export function loadProgress(): StoredProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...defaults }
    const parsed = JSON.parse(raw) as Partial<StoredProgress>
    return {
      ...defaults,
      ...parsed,
      completedLessons: parsed.completedLessons ?? [],
      completedGames: parsed.completedGames ?? [],
      completedQuizzes: parsed.completedQuizzes ?? [],
      badges: (parsed.badges ?? []).filter(isPointBadgeId),
      points: sanitizePoints(parsed.points),
    }
  } catch {
    return { ...defaults }
  }
}

export function saveProgress(data: StoredProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // ignore quota / private mode
  }
}
