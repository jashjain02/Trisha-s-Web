import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Plus, Activity, Users, BarChart2, CheckCircle, UserCheck } from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { WishCard } from '../components/wishes/WishCard'
import { WishForm } from '../components/wishes/WishForm'
import { ApplicantPicker } from '../components/wishes/ApplicantPicker'
import { ActivityFeed } from '../components/activity/ActivityFeed'
import { Avatar } from '../components/ui/Avatar'
import { calcMarketStats } from '../utils/helpers'
import type { User, Wish, Activity as ActivityType, WishApplicant, WishCategory } from '../types'

interface AdminPageProps {
  currentUser: User
  users: User[]
  approvedUsers: User[]
  pendingUsers: User[]
  wishes: Wish[]
  activities: ActivityType[]
  onCreateWish: (data: { title: string; description: string; category: WishCategory | string }) => Promise<void>
  onUpdateWish: (id: string, data: Partial<Wish>) => Promise<void>
  onDeleteWish: (id: string) => Promise<void>
  onApply: (wish: Wish) => void
  onSubmit: (wish: Wish) => void
  onSelectApplicant: (wish: Wish, applicant: WishApplicant) => Promise<void>
  onConfirmFulfilled: (wish: Wish) => void
  onApproveUser: (userId: string) => Promise<void>
  onRejectUser: (userId: string) => Promise<void>
}

type AdminTab = 'overview' | 'wishes' | 'requests' | 'users' | 'activity'

export function AdminPage({
  currentUser,
  users,
  approvedUsers,
  pendingUsers,
  wishes,
  activities,
  onCreateWish,
  onUpdateWish,
  onDeleteWish,
  onApply,
  onSubmit,
  onSelectApplicant,
  onConfirmFulfilled,
  onApproveUser,
  onRejectUser,
}: AdminPageProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')
  const [createOpen, setCreateOpen] = useState(false)
  const [editingWish, setEditingWish] = useState<Wish | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<Wish | null>(null)
  const [pickerWish, setPickerWish] = useState<Wish | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const stats = useMemo(() => calcMarketStats(wishes, users), [wishes, users])
  const pendingReview = wishes.filter((w) => w.status === 'pending_review')

  const TABS: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: <BarChart2 size={14} /> },
    { id: 'wishes', label: 'Wishes', icon: <CheckCircle size={14} />, badge: pendingReview.length || undefined },
    { id: 'requests', label: 'Requests', icon: <UserCheck size={14} />, badge: pendingUsers.length || undefined },
    { id: 'users', label: 'Friends', icon: <Users size={14} /> },
    { id: 'activity', label: 'Activity', icon: <Activity size={14} /> },
  ]

  async function handleCreate(data: { title: string; description: string; category: WishCategory | string }) {
    await onCreateWish(data)
    setCreateOpen(false)
  }

  async function handleEdit(data: { title: string; description: string; category: WishCategory | string }) {
    if (!editingWish) return
    await onUpdateWish(editingWish.id, data)
    setEditingWish(null)
  }

  async function handleDelete() {
    if (!deleteConfirm) return
    setDeleteLoading(true)
    await onDeleteWish(deleteConfirm.id)
    setDeleteLoading(false)
    setDeleteConfirm(null)
  }

  async function handleSelectApplicant(wish: Wish, applicant: WishApplicant) {
    await onSelectApplicant(wish, applicant)
    setPickerWish(null)
  }

  const wishCardProps = {
    currentUser,
    isAdmin: true,
    onApply,
    onSubmit,
    onSelectApplicant: (w: Wish) => setPickerWish(w),
    onConfirmFulfilled,
    onEdit: setEditingWish,
    onDelete: setDeleteConfirm,
  }

  return (
    <div className="pt-4 pb-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="text-3xl">
            ⚙️
          </motion.div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">Trisha's control center ✨</p>
          </div>
        </div>
        <Button variant="primary" size="md" onClick={() => setCreateOpen(true)} icon={<Plus size={16} />}>
          New Wish
        </Button>
      </div>

      {/* Pending Review Alert */}
      {pendingReview.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border-2 border-amber-300 bg-amber-50/80 p-4"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔔</span>
            <div>
              <p className="font-bold text-amber-800 text-sm">
                {pendingReview.length} wish{pendingReview.length !== 1 ? 'es' : ''} need your confirmation
              </p>
              <p className="text-xs text-amber-600 mt-0.5">Friends say they've done it — you decide if they get the points.</p>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            {pendingReview.map((wish, i) => (
              <WishCard key={wish.id} wish={wish} {...wishCardProps} index={i} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-100 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === tab.id ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.icon}
            {tab.label}
            {tab.badge ? (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {tab.badge}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Total Wishes', value: stats.totalWishes, emoji: '💖' },
              { label: 'Open Wishes', value: stats.openWishes, emoji: '○' },
              { label: 'Pending Review', value: pendingReview.length, emoji: '🔔' },
              { label: 'Fulfilled', value: stats.fulfilledWishes, emoji: '✅' },
            ].map((item, i) => (
              <motion.div key={item.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}>
                <GlassCard hover className="text-center py-5">
                  <p className="text-2xl">{item.emoji}</p>
                  <p className="text-2xl font-black text-gray-900 mt-1">{item.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
          <GlassCard>
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Recent Wishes</h2>
            <div className="space-y-3">
              {wishes.slice(0, 5).map((wish, i) => (
                <WishCard key={wish.id} wish={wish} {...wishCardProps} index={i} />
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {activeTab === 'wishes' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          {wishes.length === 0 ? (
            <GlassCard className="text-center py-16">
              <p className="text-4xl mb-3">🌸</p>
              <p className="text-gray-500 mb-4">No wishes yet.</p>
              <Button variant="primary" size="sm" onClick={() => setCreateOpen(true)} icon={<Plus size={14} />}>Create First Wish</Button>
            </GlassCard>
          ) : (
            <div className="grid md:grid-cols-2 gap-3">
              {wishes.map((wish, i) => (
                <WishCard key={wish.id} wish={wish} {...wishCardProps} index={i} />
              ))}
            </div>
          )}
        </motion.div>
      )}

      {activeTab === 'requests' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          {pendingUsers.length === 0 ? (
            <GlassCard className="text-center py-16">
              <p className="text-4xl mb-3">🌸</p>
              <p className="text-gray-500">No pending requests right now.</p>
            </GlassCard>
          ) : (
            pendingUsers.map((user, i) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard className="flex items-center gap-4">
                  <Avatar src={user.photoURL} name={user.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    {user.whatsapp && (
                      <p className="text-xs text-gray-400 mt-0.5">📱 {user.whatsapp}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => onApproveUser(user.id)}
                      icon={<span>✓</span>}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onRejectUser(user.id)}
                    >
                      Reject
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            ))
          )}
        </motion.div>
      )}

      {activeTab === 'users' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          {users.map((user, i) => (
            <motion.div key={user.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <GlassCard className="flex items-center gap-4">
                <Avatar src={user.photoURL} name={user.name} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <div className="flex gap-3 text-right">
                  <div>
                    <p className="text-xs text-gray-400">Points</p>
                    <p className="text-sm font-bold text-gray-800">{user.points}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Stock</p>
                    <p className="text-sm font-bold text-pink-dark">₹{user.stockValue}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      )}

      {activeTab === 'activity' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard>
            <ActivityFeed activities={activities} loading={false} />
          </GlassCard>
        </motion.div>
      )}

      <ApplicantPicker wish={pickerWish} users={approvedUsers} onClose={() => setPickerWish(null)} onSelect={handleSelectApplicant} />

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Post a New Wish ✨">
        <WishForm onSubmit={handleCreate} onCancel={() => setCreateOpen(false)} />
      </Modal>

      <Modal open={!!editingWish} onClose={() => setEditingWish(null)} title="Edit Wish">
        {editingWish && (
          <WishForm initial={editingWish} onSubmit={handleEdit} onCancel={() => setEditingWish(null)} />
        )}
      </Modal>

      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Wish" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Delete <span className="font-semibold">"{deleteConfirm?.title}"</span>? This cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button variant="ghost" fullWidth onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="danger" fullWidth loading={deleteLoading} onClick={handleDelete}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
