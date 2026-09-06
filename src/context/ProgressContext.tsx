import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  LESSON_POINTS,
  newlyEarnedBadges,
  pointsForGame,
  pointsForQuiz,
  type PointBadge,
} from '../content/badges'
import type { ModuleId } from '../content/types'
import { NICKNAMES } from '../content/modules'
import { loadProgress, saveProgress, type StoredProgress } from '../utils/storage'

export type AwardResult = {
  awarded: number
  newBadges: PointBadge[]
}

type ProgressContextValue = {
  nickname: string
  setNickname: (name: string) => void
  pickRandomNickname: () => void
  completedLessons: ModuleId[]
  completedGames: ModuleId[]
  completedQuizzes: ModuleId[]
  badges: string[]
  points: number
  soundOn: boolean
  setSoundOn: (on: boolean) => void
  markLessonDone: (id: ModuleId) => AwardResult
  markGameDone: (id: ModuleId, score?: number) => AwardResult
  markQuizDone: (id: ModuleId, correct?: number) => AwardResult
  resetProgress: () => void
  allComplete: boolean
  pendingBadges: PointBadge[]
  dismissBadgeUnlock: () => void
  holdCelebrations: boolean
  setHoldCelebrations: (hold: boolean) => void
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

function uniquePush(list: string[], id: string): string[] {
  return list.includes(id) ? list : [...list, id]
}

const emptyAward: AwardResult = { awarded: 0, newBadges: [] }

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoredProgress>(() => loadProgress())
  const [pendingBadges, setPendingBadges] = useState<PointBadge[]>([])
  const [holdCelebrations, setHoldCelebrations] = useState(false)

  useEffect(() => {
    saveProgress(state)
  }, [state])

  const awardFirstTime = useCallback(
    (
      already: (s: StoredProgress) => boolean,
      mutate: (s: StoredProgress) => StoredProgress,
      awarded: number,
    ): AwardResult => {
      let result = emptyAward
      setState((s) => {
        if (already(s) || awarded <= 0) return mutate(s)
        const nextPoints = s.points + awarded
        const newBadges = newlyEarnedBadges(nextPoints, s.badges)
        result = { awarded, newBadges }
        return {
          ...mutate(s),
          points: nextPoints,
          badges: [
            ...s.badges,
            ...newBadges.map((b) => b.id).filter((id) => !s.badges.includes(id)),
          ],
        }
      })
      if (result.newBadges.length) {
        setPendingBadges((q) => [...q, ...result.newBadges])
      }
      return result
    },
    [],
  )

  const markLessonDone = useCallback(
    (id: ModuleId): AwardResult =>
      awardFirstTime(
        (s) => s.completedLessons.includes(id),
        (s) => ({ ...s, completedLessons: uniquePush(s.completedLessons, id) }),
        LESSON_POINTS,
      ),
    [awardFirstTime],
  )

  const markGameDone = useCallback(
    (id: ModuleId, score = 0): AwardResult =>
      awardFirstTime(
        (s) => s.completedGames.includes(id),
        (s) => ({ ...s, completedGames: uniquePush(s.completedGames, id) }),
        pointsForGame(score),
      ),
    [awardFirstTime],
  )

  const markQuizDone = useCallback(
    (id: ModuleId, correct = 0): AwardResult =>
      awardFirstTime(
        (s) => s.completedQuizzes.includes(id),
        (s) => ({ ...s, completedQuizzes: uniquePush(s.completedQuizzes, id) }),
        pointsForQuiz(correct),
      ),
    [awardFirstTime],
  )

  const resetProgress = useCallback(() => {
    setPendingBadges([])
    setHoldCelebrations(false)
    setState((s) => ({
      ...s,
      nickname: '',
      completedLessons: [],
      completedGames: [],
      completedQuizzes: [],
      badges: [],
      points: 0,
    }))
  }, [])

  const dismissBadgeUnlock = useCallback(() => {
    setPendingBadges((q) => q.slice(1))
  }, [])

  const value = useMemo<ProgressContextValue>(() => {
    const setNickname = (name: string) =>
      setState((s) => ({ ...s, nickname: name }))

    const pickRandomNickname = () => {
      const name = NICKNAMES[Math.floor(Math.random() * NICKNAMES.length)]
      setNickname(name)
    }

    const setSoundOn = (on: boolean) =>
      setState((s) => ({ ...s, soundOn: on }))

    return {
      nickname: state.nickname,
      setNickname,
      pickRandomNickname,
      completedLessons: state.completedLessons as ModuleId[],
      completedGames: state.completedGames as ModuleId[],
      completedQuizzes: state.completedQuizzes as ModuleId[],
      badges: state.badges,
      points: state.points,
      soundOn: state.soundOn,
      setSoundOn,
      markLessonDone,
      markGameDone,
      markQuizDone,
      resetProgress,
      allComplete: state.badges.length >= 5,
      pendingBadges,
      dismissBadgeUnlock,
      holdCelebrations,
      setHoldCelebrations,
    }
  }, [
    state,
    markLessonDone,
    markGameDone,
    markQuizDone,
    resetProgress,
    pendingBadges,
    dismissBadgeUnlock,
    holdCelebrations,
  ])

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  )
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
