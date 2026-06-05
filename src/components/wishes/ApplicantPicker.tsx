import { useState } from 'react'
import { motion } from 'framer-motion'
import { Avatar } from '../ui/Avatar'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { formatTimestamp } from '../../utils/helpers'
import { notifySelectedFriend } from '../../utils/whatsapp'
import type { Wish, WishApplicant, User } from '../../types'

interface ApplicantPickerProps {
  wish: Wish | null
  users: User[]          // approved users, to look up WhatsApp numbers
  onClose: () => void
  onSelect: (wish: Wish, applicant: WishApplicant) => Promise<void>
}

export function ApplicantPicker({ wish, users, onClose, onSelect }: ApplicantPickerProps) {
  const [selecting, setSelecting] = useState<string | null>(null)

  if (!wish) return null
  const applicants = wish.applicants ?? []

  async function handleSelect(applicant: WishApplicant) {
    setSelecting(applicant.userId)
    await onSelect(wish!, applicant)

    // Find this user's WhatsApp number and send notification
    const userData = users.find((u) => u.id === applicant.userId)
    if (userData?.whatsapp) {
      notifySelectedFriend(userData.whatsapp, applicant.userName, wish!.title)
    }

    setSelecting(null)
  }

  return (
    <Modal open={!!wish} onClose={onClose} title="Who gets to fulfill this? 💖" size="md">
      <div className="space-y-4">
        <div className="p-3 bg-pink-soft rounded-xl border border-pink-100">
          <p className="text-xs text-gray-500 font-medium">Wish</p>
          <p className="text-sm font-semibold text-gray-800 mt-0.5">{wish.title}</p>
        </div>

        {applicants.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-3xl mb-2">🌸</p>
            <p className="text-sm text-gray-500">No one has applied yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
              {applicants.length} friend{applicants.length !== 1 ? 's' : ''} applied
            </p>
            {applicants.map((applicant, i) => {
              const userData = users.find((u) => u.id === applicant.userId)
              return (
                <motion.div
                  key={applicant.userId}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 hover:border-pink-200 hover:bg-pink-soft/30 transition-all group"
                >
                  <Avatar src={applicant.userPhotoURL} name={applicant.userName} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{applicant.userName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-gray-400">
                        Applied {formatTimestamp(applicant.appliedAt)}
                      </p>
                      {userData?.whatsapp && (
                        <span className="text-xs text-green-600">📱 {userData.whatsapp}</span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    loading={selecting === applicant.userId}
                    onClick={() => handleSelect(applicant)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Choose 💖
                  </Button>
                </motion.div>
              )
            })}
          </div>
        )}

        <p className="text-xs text-gray-400 text-center">
          Choosing someone will open WhatsApp to notify them automatically 📲
        </p>

        <Button variant="ghost" fullWidth onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  )
}
