export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || ''

export const POINTS = {
  CLAIM_WISH: 5,
  FULFILL_WISH: 20,
  FIRST_FULFILL_OF_DAY: 10,
  BIRTHDAY_GIFT: 50,
} as const

export const INITIAL_STOCK_VALUE = 100
export const INITIAL_POINTS = 100

export const CATEGORIES = [
  { label: 'Food', emoji: '🍕', color: 'from-orange-200 to-amber-200' },
  { label: 'Coffee', emoji: '☕', color: 'from-amber-200 to-yellow-200' },
  { label: 'Flowers', emoji: '🌸', color: 'from-pink-200 to-rose-200' },
  { label: 'Shopping', emoji: '🛍️', color: 'from-purple-200 to-violet-200' },
  { label: 'Travel', emoji: '✈️', color: 'from-sky-200 to-blue-200' },
  { label: 'Emotional Support', emoji: '🥹', color: 'from-teal-200 to-cyan-200' },
  { label: 'Custom', emoji: '✨', color: 'from-pink-200 to-lavender-200' },
] as const

export const CATEGORY_EMOJI: Record<string, string> = {
  Food: '🍕',
  Coffee: '☕',
  Flowers: '🌸',
  Shopping: '🛍️',
  Travel: '✈️',
  'Emotional Support': '🥹',
  Custom: '✨',
}

export const SENTIMENT_CONFIG = {
  bullish: {
    label: 'Bullish',
    emoji: '📈',
    color: 'text-green-600',
    bg: 'from-green-50 to-emerald-50',
    border: 'border-green-200',
    description: 'Friends are delivering! The market is thriving.',
  },
  neutral: {
    label: 'Neutral',
    emoji: '😐',
    color: 'text-amber-600',
    bg: 'from-amber-50 to-yellow-50',
    border: 'border-amber-200',
    description: 'Things are steady. Time to make some moves.',
  },
  bearish: {
    label: 'Bearish',
    emoji: '📉',
    color: 'text-rose-600',
    bg: 'from-rose-50 to-pink-50',
    border: 'border-rose-200',
    description: 'Wishes are piling up. Friends, step up!',
  },
} as const
