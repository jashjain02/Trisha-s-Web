import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, ImageIcon } from 'lucide-react'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '../../lib/firebase'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Avatar } from '../ui/Avatar'
import type { Wish } from '../../types'

interface FulfillmentModalProps {
  wish: Wish | null
  onClose: () => void
  onConfirm: (wish: Wish, photoURL: string) => Promise<void>
}

export function FulfillmentModal({ wish, onClose, onConfirm }: FulfillmentModalProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  if (!wish) return null

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    if (!f.type.startsWith('image/')) {
      setError('Please select an image file.')
      return
    }
    if (f.size > 10 * 1024 * 1024) {
      setError('Image must be under 10MB.')
      return
    }
    setError('')
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]
    if (!f) return
    const input = inputRef.current
    if (input) {
      const dt = new DataTransfer()
      dt.items.add(f)
      input.files = dt.files
      input.dispatchEvent(new Event('change', { bubbles: true }))
    }
    setError('')
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function handleConfirm() {
    if (!file || !wish) {
      setError('Please upload a photo as confirmation.')
      return
    }
    setUploading(true)
    setError('')
    try {
      const storageRef = ref(storage, `fulfillments/${wish.id}_${Date.now()}`)
      const task = uploadBytesResumable(storageRef, file)

      const photoURL = await new Promise<string>((resolve, reject) => {
        task.on(
          'state_changed',
          (snap) => setProgress((snap.bytesTransferred / snap.totalBytes) * 100),
          reject,
          async () => resolve(await getDownloadURL(task.snapshot.ref))
        )
      })

      await onConfirm(wish, photoURL)
      setPreview(null)
      setFile(null)
      setProgress(0)
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  function handleClose() {
    if (uploading) return
    setPreview(null)
    setFile(null)
    setProgress(0)
    setError('')
    onClose()
  }

  return (
    <Modal open={!!wish} onClose={handleClose} title="Confirm Wish Fulfilled 💖" size="md">
      <div className="space-y-4">
        {/* Wish info */}
        <div className="p-3 bg-pink-soft rounded-xl border border-pink-100 flex items-center gap-3">
          {wish.claimedByPhotoURL && (
            <Avatar src={wish.claimedByPhotoURL} name={wish.claimedByName ?? ''} size="sm" />
          )}
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Fulfilled by</p>
            <p className="text-sm font-semibold text-gray-800">{wish.claimedByName}</p>
            <p className="text-xs text-gray-600 mt-0.5 truncate">"{wish.title}"</p>
          </div>
        </div>

        {/* Upload area */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">
            Upload a photo as proof 📸
          </p>

          <AnimatePresence mode="wait">
            {preview ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="relative rounded-2xl overflow-hidden border-2 border-pink-200"
              >
                <img src={preview} alt="Fulfillment proof" className="w-full h-52 object-cover" />
                <button
                  onClick={() => { setPreview(null); setFile(null) }}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                  aria-label="Remove photo"
                >
                  <X size={14} />
                </button>
                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-lg">
                  {file?.name}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="border-2 border-dashed border-pink-200 rounded-2xl p-8 text-center cursor-pointer hover:border-pink-400 hover:bg-pink-soft/30 transition-all"
                onClick={() => inputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                <ImageIcon size={32} className="mx-auto text-pink-300 mb-2" />
                <p className="text-sm font-medium text-gray-700">Drop a photo here</p>
                <p className="text-xs text-gray-400 mt-1">or click to browse · max 10MB</p>
              </motion.div>
            )}
          </AnimatePresence>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Upload progress */}
        {uploading && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Uploading…</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-pink-400 to-lavender rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {error && <p className="text-xs text-red-500">{error}</p>}

        <div className="flex gap-3">
          <Button variant="ghost" fullWidth onClick={handleClose} disabled={uploading}>
            Cancel
          </Button>
          <Button
            variant="success"
            fullWidth
            loading={uploading}
            onClick={handleConfirm}
            icon={<CheckCircle size={15} />}
          >
            Confirm & Award Points
          </Button>
        </div>
      </div>
    </Modal>
  )
}
