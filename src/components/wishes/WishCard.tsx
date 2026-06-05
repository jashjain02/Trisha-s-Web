import { motion } from 'framer-motion'
import { Clock, User, CheckCircle, Trash2, Edit2, Send } from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Avatar } from '../ui/Avatar'
import { formatTimestamp } from '../../utils/helpers'
import { CATEGORY_EMOJI } from '../../utils/constants'
import { shareWishToWhatsApp } from '../../utils/whatsapp'
import type { Wish, User as UserType } from '../../types'

interface WishCardProps {
  wish: Wish
  currentUser: UserType
  isAdmin: boolean
  onApply?: (wish: Wish) => void
  onSubmit?: (wish: Wish) => void
  onSelectApplicant?: (wish: Wish) => void
  onConfirmFulfilled?: (wish: Wish) => void
  onEdit?: (wish: Wish) => void
  onDelete?: (wish: Wish) => void
  featured?: boolean
  index?: number
}

export function WishCard({
  wish,
  currentUser,
  isAdmin,
  onApply,
  onSubmit,
  onSelectApplicant,
  onConfirmFulfilled,
  onEdit,
  onDelete,
  featured = false,
  index = 0,
}: WishCardProps) {
  const emoji = CATEGORY_EMOJI[wish.category] ?? '✨'
  const applicants = wish.applicants ?? []
  const hasApplied = applicants.some((a) => a.userId === currentUser.id)
  const isChosen = wish.claimedBy === currentUser.id
  const canApply = wish.status === 'open' && !isAdmin && !hasApplied
  const canSubmit = wish.status === 'claimed' && isChosen

  const STATUS_LABEL: Record<string, string> = {
    open: 'open',
    claimed: 'in progress',
    pending_review: 'pending review',
    fulfilled: 'fulfilled',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      layout
    >
      <GlassCard
        hover
        className={`
          relative overflow-hidden
          ${featured ? 'ring-2 ring-pink-300/50' : ''}
          ${wish.status === 'fulfilled' ? 'opacity-75' : ''}
        `}
      >
        {featured && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 to-lavender" />
        )}

        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-100 to-lavender-soft flex items-center justify-center text-2xl">
            {emoji}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <Badge label={STATUS_LABEL[wish.status] ?? wish.status} variant="status" />
                  <Badge label={wish.category} variant="category" />
                </div>
                <h3 className={`font-semibold text-gray-900 ${featured ? 'text-lg' : 'text-base'} leading-tight`}>
                  {wish.title}
                </h3>
                {wish.description && (
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{wish.description}</p>
                )}
              </div>

              {isAdmin && (
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => onEdit?.(wish)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Edit wish"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => onDelete?.(wish)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Delete wish"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Applicants preview (admin only) */}
            {isAdmin && applicants.length > 0 && wish.status === 'open' && (
              <div className="mt-3 flex items-center gap-2">
                <div className="flex -space-x-2">
                  {applicants.slice(0, 4).map((a) => (
                    <Avatar key={a.userId} src={a.userPhotoURL} name={a.userName} size="xs" />
                  ))}
                </div>
                <span className="text-xs text-gray-500">
                  {applicants.length} friend{applicants.length !== 1 ? 's' : ''} want{applicants.length === 1 ? 's' : ''} this
                </span>
              </div>
            )}

            {/* Chosen friend info */}
            {wish.claimedByName && (
              <div className="mt-2 flex items-center gap-2">
                {wish.claimedByPhotoURL && (
                  <Avatar src={wish.claimedByPhotoURL} name={wish.claimedByName} size="xs" />
                )}
                <span className="text-xs text-gray-500">
                  {wish.status === 'fulfilled'
                    ? `Fulfilled by ${wish.fulfilledByName}`
                    : wish.status === 'pending_review'
                    ? `${wish.claimedByName} says it's done — waiting for your approval`
                    : `Chosen: ${wish.claimedByName}`}
                </span>
              </div>
            )}

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Clock size={11} />
                {formatTimestamp(wish.createdAt)}
              </span>

              <div className="flex gap-2 flex-wrap">
                {/* Friend: apply to open wish */}
                {canApply && (
                  <Button variant="secondary" size="sm" onClick={() => onApply?.(wish)} icon={<span>✋</span>}>
                    I'm Interested
                  </Button>
                )}

                {/* Friend: already applied */}
                {!isAdmin && hasApplied && wish.status === 'open' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium bg-lavender-soft text-lavender border border-lavender/30">
                    ✓ Applied
                  </span>
                )}

                {/* Friend: chosen, can mark as submitted */}
                {canSubmit && (
                  <Button variant="primary" size="sm" onClick={() => onSubmit?.(wish)} icon={<Send size={13} />}>
                    I Did It!
                  </Button>
                )}

                {/* Admin: share new wish to WhatsApp */}
                {isAdmin && wish.status === 'open' && (
                  <button
                    onClick={() => shareWishToWhatsApp(wish)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors"
                    title="Share to WhatsApp"
                  >
                    <span>📲</span> Notify Friends
                  </button>
                )}

                {/* Admin: pick from applicants */}
                {isAdmin && wish.status === 'open' && applicants.length > 0 && (
                  <Button variant="secondary" size="sm" onClick={() => onSelectApplicant?.(wish)} icon={<User size={13} />}>
                    Pick Someone
                  </Button>
                )}

                {/* Admin: confirm fulfilled */}
                {isAdmin && wish.status === 'pending_review' && (
                  <Button variant="success" size="sm" onClick={() => onConfirmFulfilled?.(wish)} icon={<CheckCircle size={13} />}>
                    Confirm ✓
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {wish.status === 'fulfilled' && (
          <motion.div
            className="absolute top-3 right-10 text-xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
            transition={{ delay: 0.2 }}
          >
            ✅
          </motion.div>
        )}

        {/* Fulfillment proof photo */}
        {wish.fulfillmentPhotoURL && (
          <motion.div
            className="mt-4 rounded-xl overflow-hidden border border-pink-100"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ delay: 0.3 }}
          >
            <div className="px-2 pt-2 pb-1 bg-pink-soft flex items-center gap-1.5">
              <span className="text-xs">📸</span>
              <span className="text-xs font-medium text-pink-dark">Proof of fulfillment</span>
            </div>
            <img
              src={wish.fulfillmentPhotoURL}
              alt="Fulfillment proof"
              className="w-full max-h-64 object-cover cursor-pointer"
              onClick={() => window.open(wish.fulfillmentPhotoURL, '_blank')}
            />
          </motion.div>
        )}
      </GlassCard>
    </motion.div>
  )
}
