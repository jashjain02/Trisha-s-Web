import { motion, AnimatePresence } from 'framer-motion'
import { Avatar } from '../ui/Avatar'
import { formatTimestamp } from '../../utils/helpers'
import type { Activity } from '../../types'

interface ActivityFeedProps {
  activities: Activity[]
  loading: boolean
}

const ACTIVITY_MESSAGES: Record<string, (a: Activity) => string> = {
  wish_claimed: (a) => `claimed "${a.wishTitle}" ✋`,
  wish_fulfilled: (a) => `fulfilled "${a.wishTitle}" ✅`,
  wish_created: (a) => `posted a new wish: "${a.wishTitle}" 💖`,
  points_earned: (a) => `earned ${a.points} friendship points ⭐`,
  joined: () => `joined Trisha's Exchange 🎉`,
}

const ACTIVITY_COLORS: Record<string, string> = {
  wish_claimed: 'bg-sky-500/10 text-sky-400',
  wish_fulfilled: 'bg-emerald-500/10 text-emerald-400',
  wish_created: 'bg-[#FF2E93]/10 text-[#FF2E93]',
  points_earned: 'bg-amber-500/10 text-amber-400',
  joined: 'bg-purple-500/10 text-purple-400',
}

export function ActivityFeed({ activities, loading }: ActivityFeedProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] animate-pulse">
            <div className="w-8 h-8 rounded-full bg-white/[0.08]" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 bg-white/[0.06] rounded w-3/4" />
              <div className="h-2 bg-white/[0.04] rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-3xl mb-2">🌸</p>
        <p className="text-sm text-slate-500">No activity yet. Be the first!</p>
      </div>
    )
  }

  return (
    <div className="space-y-2" role="feed" aria-label="Activity feed">
      <AnimatePresence initial={false}>
        {activities.map((activity, i) => {
          const getMessage = ACTIVITY_MESSAGES[activity.type]
          const message = getMessage ? getMessage(activity) : activity.type
          const colorClass = ACTIVITY_COLORS[activity.type] ?? 'bg-white/[0.06] text-slate-400'

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -16, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: 16, height: 0 }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-colors"
            >
              <Avatar src={activity.userPhotoURL} name={activity.userName} size="xs" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-300 leading-relaxed">
                  <span className="font-semibold text-white">{activity.userName}</span>{' '}
                  {message}
                </p>
                <p className="text-[10px] text-slate-600 mt-0.5">
                  {formatTimestamp(activity.timestamp)}
                </p>
              </div>
              <span className={`flex-shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full ${colorClass}`}>
                {activity.type.replace('_', ' ')}
              </span>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
