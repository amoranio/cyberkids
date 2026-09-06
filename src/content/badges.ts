import type { CharacterId } from './types'

export type PointBadgeId =
  | 'spark-starter'
  | 'key-cadet'
  | 'sharp-eyes'
  | 'kind-glow'
  | 'cyber-defender'

export type PointBadge = {
  id: PointBadgeId
  name: string
  emoji: string
  threshold: number
  character: CharacterId
  cheer: string
}

export const LESSON_POINTS = 10
export const GAME_BASE_POINTS = 25
export const GAME_SCORE_STEP = 10
export const GAME_SCORE_BONUS_MAX = 15
export const QUIZ_BASE_POINTS = 15
export const QUIZ_CORRECT_POINTS = 5

export const POINT_BADGES: PointBadge[] = [
  {
    id: 'spark-starter',
    name: 'Spark Starter',
    emoji: '✨',
    threshold: 25,
    character: 'spark',
    cheer: 'Your first spark of star points!',
  },
  {
    id: 'key-cadet',
    name: 'Key Cadet',
    emoji: '🔑',
    threshold: 60,
    character: 'keyora',
    cheer: 'You are unlocking bigger adventures!',
  },
  {
    id: 'sharp-eyes',
    name: 'Sharp Eyes',
    emoji: '🔎',
    threshold: 100,
    character: 'spotter',
    cheer: 'One hundred points — super spotter!',
  },
  {
    id: 'kind-glow',
    name: 'Kind Glow',
    emoji: '💛',
    threshold: 150,
    character: 'spark',
    cheer: 'Your kind glow is lighting up Cyber Isle!',
  },
  {
    id: 'cyber-defender',
    name: 'Cyber Defender',
    emoji: '🛡️',
    threshold: 220,
    character: 'shieldo',
    cheer: 'Every badge! You are a Cyber Defender!',
  },
]

const BADGE_IDS = new Set<string>(POINT_BADGES.map((b) => b.id))

export function isPointBadgeId(id: string): id is PointBadgeId {
  return BADGE_IDS.has(id)
}

export function getPointBadge(id: string): PointBadge | undefined {
  return POINT_BADGES.find((b) => b.id === id)
}

export function pointsForGame(score = 0): number {
  const bonus = Math.min(
    GAME_SCORE_BONUS_MAX,
    Math.floor(Math.max(0, score) / GAME_SCORE_STEP),
  )
  return GAME_BASE_POINTS + bonus
}

export function pointsForQuiz(correct = 0): number {
  return QUIZ_BASE_POINTS + QUIZ_CORRECT_POINTS * Math.max(0, correct)
}

export function badgesUnlockedByPoints(points: number): PointBadge[] {
  return POINT_BADGES.filter((badge) => points >= badge.threshold)
}

export function newlyEarnedBadges(
  points: number,
  already: string[],
): PointBadge[] {
  return badgesUnlockedByPoints(points).filter((badge) => !already.includes(badge.id))
}
