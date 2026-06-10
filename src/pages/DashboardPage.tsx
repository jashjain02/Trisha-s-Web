import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, Heart, Trophy } from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'
import { StatCard } from '../components/ui/StatCard'
import { Avatar } from '../components/ui/Avatar'
import { WishCard } from '../components/wishes/WishCard'
import { ApplicantPicker } from '../components/wishes/ApplicantPicker'
import { ADMIN_EMAILS } from '../utils/constants'
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

  const stats = useMemo(() => {
    const totalWishes = wishes.length
    const fulfilledWishes = wishes.filter((w) => w.status === 'fulfilled').length
    const openWishes = wishes.filter((w) => w.status === 'open').length
    const claimedWishes = wishes.filter((w) => w.status === 'claimed' || w.status === 'pending_review').length
    const topFriend =
      users.length > 0 ? users.reduce((best, u) => (u.points > best.points ? u : best), users[0]) : null
    return { totalWishes, fulfilledWishes, openWishes, claimedWishes, topFriend }
  }, [wishes, users])
  const isTrisha = ADMIN_EMAILS.includes(currentUser.email.toLowerCase())
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
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF2E93]/[0.06] to-purple-500/[0.03] rounded-2xl" />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: 'spring', stiffness: 400 }}>
              <Avatar src={currentUser.photoURL} name={currentUser.name} size="xl" />
            </motion.div>
            <div>
              <motion.h1
                className="text-2xl font-black text-white tracking-tight"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {greeting}
              </motion.h1>
              <p className="text-sm text-slate-400 mt-0.5">
                {isTrisha
                  ? 'Your friends are ready to make your day special 🌸'
                  : 'Ready to fulfill some wishes today?'}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-center px-4 py-2 bg-white/[0.05] rounded-xl border border-white/[0.08]">
              <p className="text-xs text-slate-500">Points</p>
              <p className="text-xl font-black text-[#FF2E93]">{currentUser.points}</p>
            </div>
            {!isTrisha && myRank > 0 && (
              <div className="text-center px-4 py-2 bg-white/[0.05] rounded-xl border border-white/[0.08]">
                <p className="text-xs text-slate-500">Rank</p>
                <p className="text-xl font-black text-white">#{myRank}</p>
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
          className="rounded-2xl border border-amber-500/30 bg-amber-900/10 backdrop-blur-sm p-4"
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔔</span>
              <div>
                <p className="font-bold text-amber-300 text-sm">
                  {pendingReview.length} wish{pendingReview.length !== 1 ? 'es' : ''} waiting for your approval
                </p>
                <p className="text-xs text-amber-500/80">A friend says they've fulfilled a wish. Confirm to award their points!</p>
              </div>
            </div>
            <Link to="/wishes?filter=pending_review" className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 hover:bg-amber-500/20 transition-colors">
              Review Now →
            </Link>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Points" value={users.reduce((s, u) => s + u.points, 0)} icon={<TrendingUp />} delay={0.05} />
        <StatCard label="Total Wishes" value={stats.totalWishes} icon={<Heart />} delay={0.1} />
        <StatCard label="Fulfilled" value={stats.fulfilledWishes} icon={<span>✅</span>} delay={0.15} />
        <StatCard label="Top Friend" value={stats.topFriend?.name.split(' ')[0] ?? '—'} icon={<Trophy />} delay={0.2} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Current Wish 💖</h2>
            <Link to="/wishes" className="text-xs text-[#FF2E93] hover:underline font-medium">View all →</Link>
          </div>
          {featuredWish ? (
            <WishCard wish={featuredWish} {...sharedCardProps} featured />
          ) : (
            <GlassCard className="text-center py-10">
              <p className="text-3xl mb-2">🌸</p>
              <p className="text-slate-500 text-sm">No wishes yet. Check back soon!</p>
            </GlassCard>
          )}

          {wishes.filter((w) => w.status === 'open').length > 1 && (
            <>
              <h2 className="text-base font-bold text-white mt-2">Open Wishes</h2>
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
          <div>
            <h2 className="text-base font-bold text-white mb-3">Wishes Progress</h2>
            <GlassCard>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Fulfilled</span>
                <span className="text-sm font-bold text-[#FF2E93]">
                  {stats.fulfilledWishes}/{stats.totalWishes}
                </span>
              </div>
              <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#FF2E93] to-purple-500"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${stats.totalWishes > 0 ? (stats.fulfilledWishes / stats.totalWishes) * 100 : 0}%`,
                  }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </GlassCard>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-white">Top Friends</h2>
              <Link to="/leaderboard" className="text-xs text-[#FF2E93] hover:underline font-medium">Full board →</Link>
            </div>
            <GlassCard padding="sm" className="space-y-2">
              {users.slice(0, 5).map((u, i) => (
                <motion.div
                  key={u.id}
                  className={`flex items-center gap-3 p-2 rounded-xl ${u.id === currentUser.id ? 'bg-[#FF2E93]/[0.08]' : 'hover:bg-white/[0.04]'} transition-colors`}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <span className="text-sm w-5 text-center font-bold">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                  </span>
                  <Avatar src={u.photoURL} name={u.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-200 truncate">{u.name}</p>
                  </div>
                  <p className="text-xs font-bold text-[#FF2E93]">{u.points} pts</p>
                </motion.div>
              ))}
            </GlassCard>
          </div>

          {isAdmin && (
            <div>
              <h2 className="text-base font-bold text-white mb-3">Quick Stats</h2>
              <GlassCard padding="sm">
                <div className="space-y-2">
                  {[
                    { label: 'Open', val: stats.openWishes, color: 'text-sky-400' },
                    { label: 'Claimed', val: stats.claimedWishes, color: 'text-amber-400' },
                    { label: 'Pending Review', val: pendingReview.length, color: 'text-orange-400' },
                    { label: 'Fulfilled', val: stats.fulfilledWishes, color: 'text-emerald-400' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-1 border-b border-white/[0.05] last:border-0">
                      <span className="text-xs text-slate-500">{item.label}</span>
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
