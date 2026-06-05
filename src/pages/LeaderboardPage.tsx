import { motion } from 'framer-motion'
import { Trophy, TrendingUp } from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'
import { LeaderboardCard } from '../components/leaderboard/LeaderboardCard'
import { Avatar } from '../components/ui/Avatar'
import type { User } from '../types'

interface LeaderboardPageProps {
  users: User[]
  currentUser: User
}

export function LeaderboardPage({ users, currentUser }: LeaderboardPageProps) {
  const sorted = [...users].sort((a, b) => b.points - a.points)
  const top3 = sorted.slice(0, 3)
  const myRank = sorted.findIndex((u) => u.id === currentUser.id) + 1

  return (
    <div className="pt-4 pb-8 space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="text-5xl mb-2"
        >
          🏆
        </motion.div>
        <h1 className="text-2xl font-black text-gray-900">Friendship Leaderboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Who is Trisha's best friend? Let the market decide.
        </p>
        {myRank > 0 && (
          <motion.div
            className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-pink-soft border border-pink-200 rounded-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-xs font-semibold text-pink-dark">
              You are ranked #{myRank}
            </span>
            <TrendingUp size={12} className="text-pink" />
          </motion.div>
        )}
      </div>

      {/* Top 3 Podium */}
      {top3.length >= 1 && (
        <GlassCard className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/40 to-yellow-50/30 rounded-2xl" />
          <div className="relative">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide text-center mb-6">
              ✨ Hall of Fame
            </h2>
            <div className="flex items-end justify-center gap-4">
              {/* 2nd place */}
              {top3[1] && (
                <motion.div
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Avatar src={top3[1].photoURL} name={top3[1].name} size="lg" />
                  <p className="mt-2 text-sm font-semibold text-gray-700 max-w-[80px] text-center truncate">
                    {top3[1].name.split(' ')[0]}
                  </p>
                  <p className="text-xs text-gray-500">₹{top3[1].stockValue}</p>
                  <div className="mt-2 h-16 w-20 bg-gradient-to-t from-gray-200 to-gray-100 rounded-t-xl flex items-end justify-center pb-2">
                    <span className="text-2xl">🥈</span>
                  </div>
                </motion.div>
              )}

              {/* 1st place */}
              {top3[0] && (
                <motion.div
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5 }}
                  >
                    <Avatar src={top3[0].photoURL} name={top3[0].name} size="xl" className="ring-4 ring-amber-300" />
                  </motion.div>
                  <p className="mt-2 text-sm font-bold text-gray-900 max-w-[90px] text-center truncate">
                    {top3[0].name.split(' ')[0]}
                  </p>
                  <p className="text-xs text-pink-dark font-semibold">₹{top3[0].stockValue}</p>
                  <div className="mt-2 h-24 w-24 bg-gradient-to-t from-amber-300 to-yellow-200 rounded-t-xl flex items-end justify-center pb-2 shadow-md">
                    <span className="text-2xl">🥇</span>
                  </div>
                </motion.div>
              )}

              {/* 3rd place */}
              {top3[2] && (
                <motion.div
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Avatar src={top3[2].photoURL} name={top3[2].name} size="lg" />
                  <p className="mt-2 text-sm font-semibold text-gray-700 max-w-[80px] text-center truncate">
                    {top3[2].name.split(' ')[0]}
                  </p>
                  <p className="text-xs text-gray-500">₹{top3[2].stockValue}</p>
                  <div className="mt-2 h-12 w-20 bg-gradient-to-t from-orange-200 to-amber-100 rounded-t-xl flex items-end justify-center pb-2">
                    <span className="text-2xl">🥉</span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </GlassCard>
      )}

      {/* Full Rankings */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Full Rankings</h2>
        {sorted.length === 0 ? (
          <GlassCard className="text-center py-10">
            <p className="text-3xl mb-2">🌸</p>
            <p className="text-sm text-gray-500">No friends yet. Be the first!</p>
          </GlassCard>
        ) : (
          sorted.map((user, i) => (
            <LeaderboardCard
              key={user.id}
              user={user}
              rank={i + 1}
              isCurrentUser={user.id === currentUser.id}
              delay={i * 0.04}
            />
          ))
        )}
      </div>

      {/* Market Cap */}
      <GlassCard className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-baby/30 to-lavender-soft/20 rounded-2xl" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Total Friendship Market Cap</p>
            <p className="text-3xl font-black text-gray-900 mt-1">
              ₹{users.reduce((s, u) => s + u.stockValue, 0)}
            </p>
            <p className="text-xs text-gray-500 mt-1">{users.length} friends in the market</p>
          </div>
          <Trophy size={40} className="text-amber-400 opacity-60" />
        </div>
      </GlassCard>
    </div>
  )
}
