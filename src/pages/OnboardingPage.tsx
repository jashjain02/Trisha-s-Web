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
      className="min-h-screen flex items-center justify-center p-4 bg-obsidian"
      style={{
        background:
          'radial-gradient(ellipse at 50% 0%, rgba(255,46,147,0.10) 0px, transparent 55%), radial-gradient(ellipse at 20% 80%, rgba(168,85,247,0.06) 0px, transparent 50%), #0A0A0C',
      }}
    >
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-[#111115]/95 backdrop-blur-2xl rounded-3xl border border-white/[0.10] shadow-glass-lg p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="text-4xl"
            >
              💖
            </motion.div>
            <h1 className="text-2xl font-black text-white">Almost there!</h1>
            <p className="text-sm text-slate-400">
              Add your WhatsApp number so Trisha knows who you are. She'll approve your request before you can access the Exchange.
            </p>
          </div>

          {/* User info */}
          <div className="flex items-center gap-3 p-3 bg-[#FF2E93]/[0.06] rounded-2xl border border-[#FF2E93]/20">
            <Avatar
              src={firebaseUser.photoURL ?? ''}
              name={firebaseUser.displayName ?? 'Friend'}
              size="md"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {firebaseUser.displayName}
              </p>
              <p className="text-xs text-slate-400 truncate">{firebaseUser.email}</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-300">
                WhatsApp Number
              </label>
              <div className="relative">
                <Phone
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => {
                    setWhatsapp(e.target.value)
                    setError('')
                  }}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/[0.10] bg-white/[0.04] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#FF2E93]/30 focus:border-[#FF2E93]/50 transition-all"
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
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
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
