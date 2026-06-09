import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect } from 'react'

interface ImageLightboxProps {
  src: string | null
  alt?: string
  onClose: () => void
}

export function ImageLightbox({ src, alt = '', onClose }: ImageLightboxProps) {
  useEffect(() => {
    if (!src) return
    document.body.style.overflow = 'hidden'
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKey)
    }
  }, [src, onClose])

  return (
    <AnimatePresence>
      {src && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.img
            src={src}
            alt={alt}
            className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 bg-white/[0.08] hover:bg-white/[0.15] text-white rounded-full flex items-center justify-center backdrop-blur-md border border-white/[0.12] transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
