import { CATEGORY_EMOJI } from '../../utils/constants'

interface BadgeProps {
  label: string
  variant?: 'category' | 'status' | 'points'
  className?: string
}

const STATUS_STYLES: Record<string, string> = {
  open: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
  'in progress': 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  claimed: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  fulfilled: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  pending_review: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
}

export function Badge({ label, variant = 'category', className = '' }: BadgeProps) {
  if (variant === 'status') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[label] ?? 'bg-white/[0.06] text-slate-400 border border-white/[0.10]'} ${className}`}
      >
        {label === 'open' && '○'}
        {(label === 'claimed' || label === 'in progress') && '◐'}
        {label === 'fulfilled' && '●'}
        {label}
      </span>
    )
  }

  if (variant === 'points') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FF2E93]/10 text-[#FF2E93] border border-[#FF2E93]/20 ${className}`}
      >
        ⭐ {label}
      </span>
    )
  }

  const emoji = CATEGORY_EMOJI[label] ?? '✨'
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/[0.04] border border-white/[0.08] text-slate-400 ${className}`}
    >
      {emoji} {label}
    </span>
  )
}
