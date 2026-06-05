import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { TrendingUp, BarChart2, Zap } from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'
import { StatCard } from '../components/ui/StatCard'
import { MarketSentimentCard } from '../components/market/MarketSentimentCard'
import { Avatar } from '../components/ui/Avatar'
import { calcMarketStats } from '../utils/helpers'
import { CATEGORIES } from '../utils/constants'
import type { User, Wish } from '../types'

interface MarketPageProps {
  users: User[]
  wishes: Wish[]
}

export function MarketPage({ users, wishes }: MarketPageProps) {
  const stats = useMemo(() => calcMarketStats(wishes, users), [wishes, users])

  const categoryStats = useMemo(() =>
    CATEGORIES.map((cat) => {
      const catWishes = wishes.filter((w) => w.category === cat.label)
      const fulfilled = catWishes.filter((w) => w.status === 'fulfilled').length
      return {
        ...cat,
        total: catWishes.length,
        fulfilled,
        rate: catWishes.length > 0 ? (fulfilled / catWishes.length) * 100 : 0,
      }
    }).filter((c) => c.total > 0),
    [wishes]
  )

  const sortedUsers = useMemo(
    () => [...users].sort((a, b) => b.stockValue - a.stockValue),
    [users]
  )

  return (
    <div className="pt-4 pb-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
          className="text-3xl"
        >
          📈
        </motion.div>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Friendship Market</h1>
          <p className="text-sm text-gray-500 mt-0.5">Real-time market data from Trisha's Exchange™</p>
        </div>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Market Cap" value={`₹${stats.marketCap}`} icon={<BarChart2 />} color="from-pink-100 to-pink-soft" delay={0} />
        <StatCard label="Total Wishes" value={stats.totalWishes} icon={<span>💖</span>} color="from-rose-100 to-pink-100" delay={0.05} />
        <StatCard label="Fulfilled" value={stats.fulfilledWishes} icon={<span>✅</span>} color="from-emerald-100 to-green-50" delay={0.1} />
        <StatCard label="Friends Trading" value={users.length} icon={<span>👥</span>} color="from-blue-100 to-sky-50" delay={0.15} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Market Sentiment */}
        <div>
          <h2 className="text-base font-bold text-gray-900 mb-3">Market Sentiment</h2>
          <MarketSentimentCard
            sentiment={stats.sentiment}
            fulfilledCount={stats.fulfilledWishes}
            totalCount={stats.totalWishes}
          />
        </div>

        {/* Category Performance */}
        <div>
          <h2 className="text-base font-bold text-gray-900 mb-3">Category Performance</h2>
          <GlassCard padding="sm">
            {categoryStats.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No category data yet.</p>
            ) : (
              <div className="space-y-3">
                {categoryStats.map((cat, i) => (
                  <motion.div
                    key={cat.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">
                        {cat.emoji} {cat.label}
                      </span>
                      <span className="text-xs text-gray-500">
                        {cat.fulfilled}/{cat.total} · {cat.rate.toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full bg-gradient-to-r ${cat.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${cat.rate}%` }}
                        transition={{ delay: i * 0.06 + 0.3, duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      </div>

      {/* Stock Table */}
      <div>
        <h2 className="text-base font-bold text-gray-900 mb-3">Friendship Stock Prices</h2>
        <GlassCard padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full" role="table" aria-label="Friendship stock prices">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3 uppercase tracking-wide">
                    Friend
                  </th>
                  <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3 uppercase tracking-wide">
                    Stock Value
                  </th>
                  <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3 uppercase tracking-wide">
                    Points
                  </th>
                  <th className="text-right text-xs font-semibold text-gray-500 px-5 py-3 uppercase tracking-wide">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map((user, i) => (
                  <motion.tr
                    key={user.id}
                    className="border-b border-gray-50 last:border-0 hover:bg-pink-soft/30 transition-colors"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>
                        <Avatar src={user.photoURL} name={user.name} size="xs" />
                        <span className="text-sm font-medium text-gray-800">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-bold text-gray-900">₹{user.stockValue}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm text-gray-600">{user.points}</span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      {user.points > 100 ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                          <TrendingUp size={12} />
                          +{user.points - 100}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400">
                          <Zap size={12} />
                          New
                        </span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
