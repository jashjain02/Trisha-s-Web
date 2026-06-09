import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import { getRankEmoji } from '../../utils/helpers'
import type { User } from '../../types'

interface LeaderboardCardProps {
  user: User
  rank: number
  isCurrentUser: boolean
  delay?: number
}

const RANK_STYLES: Record<number, string> = {
  1: 'border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.12)]',
  2: 'border-slate-400/20',
  3: 'border-orange-500/20',
}

export function LeaderboardCard({ user, rank, isCurrentUser, delay = 0 }: LeaderboardCardProps) {
  const rankEmoji = getRankEmoji(rank)
  const borderStyle = RANK_STYLES[rank] ?? 'border-white/[0.06]'
  const barWidth = Math.min(100, (user.points / 300) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      layout
    >
      <div
        className={`
          relative rounded-2xl p-4 bg-white/[0.03] backdrop-blur-sm border
          ${borderStyle}
          ${isCurrentUser ? 'ring-1 ring-[#FF2E93]/30 bg-[#FF2E93]/[0.03]' : ''}
        `}
      >
        {rank === 1 && (
          <motion.div
            className="absolute -top-2 -right-2 text-xl"
            animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            👑
          </motion.div>
        )}

        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-8 text-center">
            <span className={`font-bold ${rank <= 3 ? 'text-xl' : 'text-sm text-slate-500'}`}>
              {rankEmoji}
            </span>
          </div>

          <Avatar src={user.photoURL} name={user.name} size="md" />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className={`font-semibold truncate ${isCurrentUser ? 'text-[#FF2E93]' : 'text-white'}`}>
                {user.name}
                {isCurrentUser && <span className="ml-1 text-xs text-[#FF2E93]/70">· you</span>}
              </p>
            </div>
            <div className="mt-1.5 h-1 w-full bg-white/[0.06] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#FF2E93] to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${barWidth}%` }}
                transition={{ delay: delay + 0.3, duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>

          <div className="flex-shrink-0 text-right">
            <div className="flex items-center gap-1 justify-end text-sm font-bold text-white">
              <TrendingUp size={12} className="text-emerald-400" />
              {user.points} pts
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
