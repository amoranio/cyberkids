const STORAGE_KEY = 'cyberkids-progress-v1'

export type StoredProgress = {
  nickname: string
  completedLessons: string[]
  completedGames: string[]
  completedQuizzes: string[]
  badges: string[]
  soundOn: boolean
}

const defaults: StoredProgress = {
  nickname: '',
  completedLessons: [],
  completedGames: [],
  completedQuizzes: [],
  badges: [],
  soundOn: false,
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
      badges: parsed.badges ?? [],
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
