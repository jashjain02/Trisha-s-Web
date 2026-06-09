import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Filter } from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { WishCard } from '../components/wishes/WishCard'
import { WishForm } from '../components/wishes/WishForm'
import { ApplicantPicker } from '../components/wishes/ApplicantPicker'
import type { Wish, WishApplicant, User, WishCategory, WishStatus } from '../types'

interface WishesPageProps {
  currentUser: User
  isAdmin: boolean
  wishes: Wish[]
  approvedUsers: User[]
  onApply: (wish: Wish) => void
  onSubmit: (wish: Wish) => void
  onSelectApplicant: (wish: Wish, applicant: WishApplicant) => Promise<void>
  onConfirmFulfilled: (wish: Wish) => void
  onCreateWish: (data: { title: string; description: string; category: WishCategory | string }) => Promise<void>
  onUpdateWish: (id: string, data: Partial<Wish>) => Promise<void>
  onDeleteWish: (id: string) => Promise<void>
}

const STATUS_FILTERS: { label: string; value: WishStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'Claimed', value: 'claimed' },
  { label: 'Pending Review', value: 'pending_review' },
  { label: 'Fulfilled', value: 'fulfilled' },
]

export function WishesPage({
  currentUser,
  isAdmin,
  wishes,
  approvedUsers,
  onApply,
  onSubmit,
  onSelectApplicant,
  onConfirmFulfilled,
  onCreateWish,
  onUpdateWish,
  onDeleteWish,
}: WishesPageProps) {
  const [statusFilter, setStatusFilter] = useState<WishStatus | 'all'>('all')
  const [createOpen, setCreateOpen] = useState(false)
  const [editingWish, setEditingWish] = useState<Wish | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<Wish | null>(null)
  const [pickerWish, setPickerWish] = useState<Wish | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return wishes
    return wishes.filter((w) => w.status === statusFilter)
  }, [wishes, statusFilter])

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

  const pendingCount = wishes.filter((w) => w.status === 'pending_review').length

  return (
    <div className="pt-4 pb-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Wish Board 💖</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {wishes.length} wishes · {wishes.filter((w) => w.status === 'open').length} open
            {pendingCount > 0 && isAdmin && (
              <span className="ml-2 px-2 py-0.5 bg-amber-500/10 text-amber-400 text-xs font-semibold rounded-full">
                {pendingCount} pending review
              </span>
            )}
          </p>
        </div>
        {isAdmin && (
          <Button variant="primary" size="md" onClick={() => setCreateOpen(true)} icon={<Plus size={16} />} data-tour="new-wish-btn">
            New Wish
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap" role="group" aria-label="Filter wishes">
        <span className="flex items-center gap-1 text-xs text-slate-500"><Filter size={12} /> Filter:</span>
        {STATUS_FILTERS.map(({ label, value }) => {
          const count = value === 'all' ? wishes.length : wishes.filter((w) => w.status === value).length
          return (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                statusFilter === value
                  ? 'bg-[#FF2E93] text-white shadow-glow-sm'
                  : 'bg-white/[0.04] text-slate-400 border border-white/[0.08] hover:bg-white/[0.08] hover:text-white'
              }`}
              aria-pressed={statusFilter === value}
            >
              {label} <span className="opacity-60">({count})</span>
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <GlassCard className="text-center py-16">
              <p className="text-4xl mb-3">🌸</p>
              <p className="text-slate-500">
                {statusFilter === 'all' ? 'No wishes yet.' : `No ${statusFilter.replace('_', ' ')} wishes.`}
              </p>
              {isAdmin && statusFilter === 'all' && (
                <Button variant="primary" size="sm" className="mt-4" onClick={() => setCreateOpen(true)} icon={<Plus size={14} />}>
                  Create First Wish
                </Button>
              )}
            </GlassCard>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((wish, i) => (
              <WishCard
                key={wish.id}
                wish={wish}
                currentUser={currentUser}
                isAdmin={isAdmin}
                onApply={onApply}
                onSubmit={onSubmit}
                onSelectApplicant={(w) => setPickerWish(w)}
                onConfirmFulfilled={onConfirmFulfilled}
                onEdit={(w) => setEditingWish(w)}
                onDelete={(w) => setDeleteConfirm(w)}
                index={i}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Applicant Picker */}
      <ApplicantPicker
        wish={pickerWish}
        users={approvedUsers}
        onClose={() => setPickerWish(null)}
        onSelect={handleSelectApplicant}
      />

      {/* Create Modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Post a New Wish ✨">
        <WishForm onSubmit={handleCreate} onCancel={() => setCreateOpen(false)} />
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editingWish} onClose={() => setEditingWish(null)} title="Edit Wish">
        {editingWish && (
          <WishForm initial={editingWish} onSubmit={handleEdit} onCancel={() => setEditingWish(null)} />
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Wish" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-slate-400">
            Delete <span className="font-semibold text-white">"{deleteConfirm?.title}"</span>? This cannot be undone.
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
