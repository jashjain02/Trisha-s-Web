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
  1: 'from-amber-50 to-yellow-50 border-amber-200 ring-1 ring-amber-300/50',
  2: 'from-gray-50 to-slate-50 border-gray-200 ring-1 ring-gray-300/50',
  3: 'from-orange-50 to-amber-50 border-orange-200 ring-1 ring-orange-200/50',
}

export function LeaderboardCard({ user, rank, isCurrentUser, delay = 0 }: LeaderboardCardProps) {
  const rankEmoji = getRankEmoji(rank)
  const styles = RANK_STYLES[rank] ?? 'from-white to-gray-50 border-gray-100'
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
          relative rounded-2xl p-4 bg-gradient-to-r border backdrop-blur-sm
          ${styles}
          ${isCurrentUser ? 'ring-2 ring-pink-300/70' : ''}
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
            <span className={`font-bold ${rank <= 3 ? 'text-xl' : 'text-sm text-gray-500'}`}>
              {rankEmoji}
            </span>
          </div>

          <Avatar src={user.photoURL} name={user.name} size="md" />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className={`font-semibold text-gray-900 truncate ${isCurrentUser ? 'text-pink-dark' : ''}`}>
                {user.name}
                {isCurrentUser && <span className="ml-1 text-xs text-pink">· you</span>}
              </p>
            </div>
            <div className="mt-1.5 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-pink-400 to-lavender"
                initial={{ width: 0 }}
                animate={{ width: `${barWidth}%` }}
                transition={{ delay: delay + 0.3, duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>

          <div className="flex-shrink-0 text-right">
            <p className="text-sm font-bold text-gray-900">₹{user.stockValue}</p>
            <div className="flex items-center gap-1 justify-end text-xs text-gray-500">
              <TrendingUp size={10} className="text-emerald-500" />
              {user.points} pts
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
