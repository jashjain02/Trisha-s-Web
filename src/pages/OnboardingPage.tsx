import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, LogOut } from 'lucide-react'
import { Avatar } from '../components/ui/Avatar'
import { Button } from '../components/ui/Button'
import type { User as FirebaseUser } from 'firebase/auth'

interface OnboardingPageProps {
  firebaseUser: FirebaseUser
  onSubmit: (whatsapp: string) => Promise<void>
  onSignOut: () => void
}

export function OnboardingPage({ firebaseUser, onSubmit, onSignOut }: OnboardingPageProps) {
  const [whatsapp, setWhatsapp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const cleaned = whatsapp.replace(/\s/g, '')
    if (cleaned.length < 10) {
      setError('Please enter a valid WhatsApp number.')
      return
    }
    setLoading(true)
    await onSubmit(cleaned)
    setLoading(false)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          'radial-gradient(at 30% 20%, #FFD6E7 0px, transparent 50%), radial-gradient(at 70% 10%, #F2E7FF 0px, transparent 50%), radial-gradient(at 10% 70%, #D9F2FF 0px, transparent 50%), #FAFAFA',
      }}
    >
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-glass-lg p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="text-4xl"
            >
              💖
            </motion.div>
            <h1 className="text-2xl font-black text-gray-900">Almost there!</h1>
            <p className="text-sm text-gray-500">
              Add your WhatsApp number so Trisha knows who you are. She'll approve your request before you can access the Exchange.
            </p>
          </div>

          {/* User info */}
          <div className="flex items-center gap-3 p-3 bg-pink-soft rounded-2xl border border-pink-100">
            <Avatar
              src={firebaseUser.photoURL ?? ''}
              name={firebaseUser.displayName ?? 'Friend'}
              size="md"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {firebaseUser.displayName}
              </p>
              <p className="text-xs text-gray-500 truncate">{firebaseUser.email}</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                WhatsApp Number
              </label>
              <div className="relative">
                <Phone
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => {
                    setWhatsapp(e.target.value)
                    setError('')
                  }}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white/80 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all"
                  autoFocus
                />
              </div>
              {error && <p className="text-xs text-red-500">{error}</p>}
            </div>

            <Button type="submit" variant="primary" fullWidth size="lg" loading={loading} icon={<span>✨</span>}>
              Send Join Request
            </Button>
          </form>

          <div className="text-center">
            <button
              onClick={onSignOut}
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              <LogOut size={12} />
              Sign out and use a different account
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
