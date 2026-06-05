import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, Heart, Trophy } from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'
import { StatCard } from '../components/ui/StatCard'
import { Avatar } from '../components/ui/Avatar'
import { WishCard } from '../components/wishes/WishCard'
import { ApplicantPicker } from '../components/wishes/ApplicantPicker'
import { MarketSentimentCard } from '../components/market/MarketSentimentCard'
import { ADMIN_EMAIL } from '../utils/constants'
import { calcMarketStats } from '../utils/helpers'
import type { Wish, WishApplicant, User } from '../types'

interface DashboardPageProps {
  currentUser: User
  isAdmin: boolean
  wishes: Wish[]
  users: User[]
  approvedUsers: User[]
  onApply: (wish: Wish) => void
  onSubmit: (wish: Wish) => void
  onSelectApplicant: (wish: Wish, applicant: WishApplicant) => Promise<void>
  onConfirmFulfilled: (wish: Wish) => void
}

export function DashboardPage({
  currentUser,
  isAdmin,
  wishes,
  users,
  approvedUsers,
  onApply,
  onSubmit,
  onSelectApplicant,
  onConfirmFulfilled,
}: DashboardPageProps) {
  const [pickerWish, setPickerWish] = useState<Wish | null>(null)

  const stats = useMemo(() => calcMarketStats(wishes, users), [wishes, users])
  const isTrisha = currentUser.email === ADMIN_EMAIL
  const greeting = isTrisha ? `Hi Trisha 💖` : `Welcome back, ${currentUser.name.split(' ')[0]} ✨`

  const featuredWish = useMemo(
    () => wishes.find((w) => w.status === 'open') ?? wishes[0] ?? null,
    [wishes]
  )

  const pendingReview = useMemo(
    () => wishes.filter((w) => w.status === 'pending_review'),
    [wishes]
  )

  const myRank = useMemo(() => {
    const sorted = [...users].sort((a, b) => b.points - a.points)
    return sorted.findIndex((u) => u.id === currentUser.id) + 1
  }, [users, currentUser.id])

  async function handleSelectApplicant(wish: Wish, applicant: WishApplicant) {
    await onSelectApplicant(wish, applicant)
    setPickerWish(null)
  }

  const sharedCardProps = {
    currentUser,
    isAdmin,
    onApply,
    onSubmit,
    onSelectApplicant: setPickerWish,
    onConfirmFulfilled,
  }

  return (
    <div className="pt-4 pb-8 space-y-6">
      {/* Welcome */}
      <GlassCard className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-baby/40 to-lavender-soft/30 rounded-2xl" />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: 'spring', stiffness: 400 }}>
              <Avatar src={currentUser.photoURL} name={currentUser.name} size="xl" />
            </motion.div>
            <div>
              <motion.h1
                className="text-2xl font-black text-gray-900"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {greeting}
              </motion.h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {isTrisha
                  ? 'Your friends are ready to make your day special 🌸'
                  : 'Ready to fulfill some wishes today?'}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-center px-4 py-2 bg-white/60 rounded-xl border border-pink-100">
              <p className="text-xs text-gray-500">Your Stock</p>
              <p className="text-xl font-black text-pink-dark">₹{currentUser.stockValue}</p>
            </div>
            <div className="text-center px-4 py-2 bg-white/60 rounded-xl border border-pink-100">
              <p className="text-xs text-gray-500">Points</p>
              <p className="text-xl font-black text-gray-900">{currentUser.points}</p>
            </div>
            {!isTrisha && myRank > 0 && (
              <div className="text-center px-4 py-2 bg-white/60 rounded-xl border border-pink-100">
                <p className="text-xs text-gray-500">Rank</p>
                <p className="text-xl font-black text-gray-900">#{myRank}</p>
              </div>
            )}
          </div>
        </div>
      </GlassCard>

      {/* Pending Review Alert (admin only) */}
      {isAdmin && pendingReview.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border-2 border-amber-300 bg-amber-50/80 backdrop-blur-sm p-4"
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔔</span>
              <div>
                <p className="font-bold text-amber-800 text-sm">
                  {pendingReview.length} wish{pendingReview.length !== 1 ? 'es' : ''} waiting for your approval
                </p>
                <p className="text-xs text-amber-600">A friend says they've fulfilled a wish. Confirm to award their points!</p>
              </div>
            </div>
            <Link to="/wishes?filter=pending_review" className="text-xs font-semibold text-amber-700 bg-amber-200 px-3 py-1.5 rounded-xl hover:bg-amber-300 transition-colors">
              Review Now →
            </Link>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Market Cap" value={`₹${stats.marketCap}`} icon={<TrendingUp />} color="from-pink-100 to-pink-soft" delay={0.05} />
        <StatCard label="Total Wishes" value={stats.totalWishes} icon={<Heart />} color="from-rose-100 to-pink-100" delay={0.1} />
        <StatCard label="Fulfilled" value={stats.fulfilledWishes} icon={<span>✅</span>} color="from-emerald-100 to-green-50" delay={0.15} />
        <StatCard label="Top Friend" value={stats.topFriend?.name.split(' ')[0] ?? '—'} icon={<Trophy />} color="from-amber-100 to-yellow-50" delay={0.2} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">Current Wish 💖</h2>
            <Link to="/wishes" className="text-xs text-pink-dark hover:underline font-medium">View all →</Link>
          </div>
          {featuredWish ? (
            <WishCard wish={featuredWish} {...sharedCardProps} featured />
          ) : (
            <GlassCard className="text-center py-10">
              <p className="text-3xl mb-2">🌸</p>
              <p className="text-gray-500 text-sm">No wishes yet. Check back soon!</p>
            </GlassCard>
          )}

          {wishes.filter((w) => w.status === 'open').length > 1 && (
            <>
              <h2 className="text-base font-bold text-gray-900 mt-2">Open Wishes</h2>
              {wishes
                .filter((w) => w.status === 'open' && w.id !== featuredWish?.id)
                .slice(0, 3)
                .map((wish, i) => (
                  <WishCard key={wish.id} wish={wish} {...sharedCardProps} index={i + 1} />
                ))}
            </>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-base font-bold text-gray-900">Market Sentiment</h2>
          <MarketSentimentCard
            sentiment={stats.sentiment}
            fulfilledCount={stats.fulfilledWishes}
            totalCount={stats.totalWishes}
          />

          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-gray-900">Top Friends</h2>
              <Link to="/leaderboard" className="text-xs text-pink-dark hover:underline font-medium">Full board →</Link>
            </div>
            <GlassCard padding="sm" className="space-y-2">
              {users.slice(0, 5).map((u, i) => (
                <motion.div
                  key={u.id}
                  className={`flex items-center gap-3 p-2 rounded-xl ${u.id === currentUser.id ? 'bg-pink-soft/60' : 'hover:bg-gray-50'} transition-colors`}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <span className="text-sm w-5 text-center font-bold">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                  </span>
                  <Avatar src={u.photoURL} name={u.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{u.name}</p>
                  </div>
                  <p className="text-xs font-bold text-pink-dark">₹{u.stockValue}</p>
                </motion.div>
              ))}
            </GlassCard>
          </div>

          {isAdmin && (
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-3">Quick Stats</h2>
              <GlassCard padding="sm">
                <div className="space-y-2">
                  {[
                    { label: 'Open', val: stats.openWishes, color: 'text-blue-600' },
                    { label: 'Claimed', val: stats.claimedWishes, color: 'text-amber-600' },
                    { label: 'Pending Review', val: pendingReview.length, color: 'text-orange-600' },
                    { label: 'Fulfilled', val: stats.fulfilledWishes, color: 'text-emerald-600' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-1 border-b border-gray-50 last:border-0">
                      <span className="text-xs text-gray-500">{item.label}</span>
                      <span className={`text-sm font-bold ${item.color}`}>{item.val}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}
        </div>
      </div>

      <ApplicantPicker wish={pickerWish} users={approvedUsers} onClose={() => setPickerWish(null)} onSelect={handleSelectApplicant} />
    </div>
  )
}
