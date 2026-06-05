import { CATEGORY_EMOJI } from '../../utils/constants'

interface BadgeProps {
  label: string
  variant?: 'category' | 'status' | 'points'
  className?: string
}

const STATUS_STYLES: Record<string, string> = {
  open: 'bg-blue-100 text-blue-700 border border-blue-200',
  claimed: 'bg-amber-100 text-amber-700 border border-amber-200',
  fulfilled: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
}

export function Badge({ label, variant = 'category', className = '' }: BadgeProps) {
  if (variant === 'status') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[label] ?? 'bg-gray-100 text-gray-600'} ${className}`}
      >
        {label === 'open' && '○'}
        {label === 'claimed' && '◐'}
        {label === 'fulfilled' && '●'}
        {label}
      </span>
    )
  }

  if (variant === 'points') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-pink-100 to-lavender-soft text-pink-dark border border-pink-200 ${className}`}
      >
        ⭐ {label}
      </span>
    )
  }

  const emoji = CATEGORY_EMOJI[label] ?? '✨'
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/80 border border-pink-100 text-gray-600 ${className}`}
    >
      {emoji} {label}
    </span>
  )
}
