import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'
import { ActivityFeed } from '../components/activity/ActivityFeed'
import type { Activity as ActivityType } from '../types'

interface FeedPageProps {
  activities: ActivityType[]
  loading: boolean
}

export function FeedPage({ activities, loading }: FeedPageProps) {
  return (
    <div className="pt-4 pb-8 space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="text-3xl"
        >
          📡
        </motion.div>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Live Activity Feed</h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-xs text-gray-500">Real-time updates from Trisha's Exchange</p>
          </div>
        </div>
      </div>

      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-pink" />
            <h2 className="text-sm font-semibold text-gray-700">Recent Activity</h2>
          </div>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {activities.length} events
          </span>
        </div>
        <ActivityFeed activities={activities} loading={loading} />
      </GlassCard>

      {/* Activity Legend */}
      <GlassCard padding="sm">
        <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Activity Legend</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { type: 'wish_claimed', label: 'Wish Claimed', color: 'bg-blue-100 text-blue-600', emoji: '✋' },
            { type: 'wish_fulfilled', label: 'Wish Fulfilled', color: 'bg-emerald-100 text-emerald-600', emoji: '✅' },
            { type: 'wish_created', label: 'Wish Posted', color: 'bg-pink-100 text-pink-dark', emoji: '💖' },
            { type: 'points_earned', label: 'Points Earned', color: 'bg-amber-100 text-amber-600', emoji: '⭐' },
            { type: 'joined', label: 'New Friend', color: 'bg-purple-100 text-purple-600', emoji: '🎉' },
          ].map((item) => (
            <div key={item.type} className="flex items-center gap-2">
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${item.color}`}>
                {item.emoji} {item.label}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
