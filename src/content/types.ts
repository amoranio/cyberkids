export type CharacterId =
  | 'shieldo'
  | 'keyora'
  | 'privy'
  | 'spotter'
  | 'spark'
  | 'beacon'

export type ModuleId =
  | 'share'
  | 'passwords'
  | 'fakes'
  | 'kindness'
  | 'help'

export type LessonPanel = {
  id: string
  character: CharacterId
  title?: string
  text: string
  tip?: string
  interactive?:
    | 'demo-sort'
    | 'demo-password'
    | 'demo-traffic'
    | 'demo-kind'
    | 'demo-help'
}

export type QuizQuestion = {
  id: string
  prompt: string
  choices: string[]
  correctIndex: number
  feedbackCorrect: string
  feedbackWrong: string
}

export type ModuleContent = {
  id: ModuleId
  title: string
  shortTitle: string
  subtitle: string
  host: CharacterId
  badgeName: string
  badgeEmoji: string
  mapLabel: string
  color: string
  gameName: string
  gameBlurb: string
  lesson: LessonPanel[]
  quiz: QuizQuestion[]
}
