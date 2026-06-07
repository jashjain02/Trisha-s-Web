export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || ''

export const POINTS = {
  CLAIM_WISH: 5,
  FULFILL_WISH: 20,
  FIRST_FULFILL_OF_DAY: 10,
  BIRTHDAY_GIFT: 50,
} as const

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
