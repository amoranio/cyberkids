import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { ModuleId } from '../content/types'
import { NICKNAMES } from '../content/modules'
import { loadProgress, saveProgress, type StoredProgress } from '../utils/storage'

type ProgressContextValue = {
  nickname: string
  setNickname: (name: string) => void
  pickRandomNickname: () => void
  completedLessons: ModuleId[]
  completedGames: ModuleId[]
  completedQuizzes: ModuleId[]
  badges: ModuleId[]
  soundOn: boolean
  setSoundOn: (on: boolean) => void
  markLessonDone: (id: ModuleId) => void
  markGameDone: (id: ModuleId) => void
  markQuizDone: (id: ModuleId) => void
  resetProgress: () => void
  allComplete: boolean
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

function uniquePush(list: string[], id: string): string[] {
  return list.includes(id) ? list : [...list, id]
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoredProgress>(() => loadProgress())

  useEffect(() => {
    saveProgress(state)
  }, [state])

  const value = useMemo<ProgressContextValue>(() => {
    const setNickname = (name: string) =>
      setState((s) => ({ ...s, nickname: name }))

    const pickRandomNickname = () => {
      const name = NICKNAMES[Math.floor(Math.random() * NICKNAMES.length)]
      setNickname(name)
    }

    const setSoundOn = (on: boolean) =>
      setState((s) => ({ ...s, soundOn: on }))

    const markLessonDone = (id: ModuleId) =>
      setState((s) => ({
        ...s,
        completedLessons: uniquePush(s.completedLessons, id),
      }))

    const markGameDone = (id: ModuleId) =>
      setState((s) => ({
        ...s,
        completedGames: uniquePush(s.completedGames, id),
      }))

    const markQuizDone = (id: ModuleId) =>
      setState((s) => ({
        ...s,
        completedQuizzes: uniquePush(s.completedQuizzes, id),
        badges: uniquePush(s.badges, id),
      }))

    const resetProgress = () =>
      setState((s) => ({
        ...s,
        nickname: '',
        completedLessons: [],
        completedGames: [],
        completedQuizzes: [],
        badges: [],
      }))

    return {
      nickname: state.nickname,
      setNickname,
      pickRandomNickname,
      completedLessons: state.completedLessons as ModuleId[],
      completedGames: state.completedGames as ModuleId[],
      completedQuizzes: state.completedQuizzes as ModuleId[],
      badges: state.badges as ModuleId[],
      soundOn: state.soundOn,
      setSoundOn,
      markLessonDone,
      markGameDone,
      markQuizDone,
      resetProgress,
      allComplete: state.badges.length >= 5,
    }
  }, [state])

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  )
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
