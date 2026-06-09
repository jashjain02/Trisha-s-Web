import { motion } from 'framer-motion'
import { LogOut } from 'lucide-react'
import { Avatar } from '../components/ui/Avatar'
import type { User } from '../types'

interface PendingPageProps {
  user: User
  onSignOut: () => void
}

export function PendingPage({ user, onSignOut }: PendingPageProps) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-obsidian"
      style={{
        background:
          'radial-gradient(ellipse at 50% 0%, rgba(255,46,147,0.10) 0px, transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(168,85,247,0.06) 0px, transparent 50%), #0A0A0C',
      }}
    >
      {/* Floating elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {['💖', '🌸', '✨', '⭐', '💫'].map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl"
            style={{ left: `${15 + i * 18}%`, top: `${10 + (i % 3) * 25}%` }}
            animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.8 }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-[#111115]/95 backdrop-blur-2xl rounded-3xl border border-white/[0.10] shadow-glass-lg p-8 text-center space-y-6">
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="text-5xl"
          >
            ⏳
          </motion.div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-white">Request Sent! 🌸</h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Your join request is with Trisha. She'll approve you once she's ready.
              <br />
              <span className="text-[#FF2E93] font-medium">Sit tight — good things take time 💖</span>
            </p>
          </div>

          <div className="p-4 bg-[#FF2E93]/[0.06] rounded-2xl border border-[#FF2E93]/20 space-y-3">
            <div className="flex items-center gap-3 justify-center">
              <Avatar src={user.photoURL} name={user.name} size="md" />
              <div className="text-left">
                <p className="text-sm font-semibold text-white">{user.name}</p>
                <p className="text-xs text-slate-400">{user.email}</p>
              </div>
            </div>
            {user.whatsapp && (
              <p className="text-xs text-slate-400 text-center">
                📱 WhatsApp: <span className="font-medium text-white">{user.whatsapp}</span>
              </p>
            )}
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-medium text-amber-600">Pending Trisha's approval</span>
            </div>
          </div>

          <button
            onClick={onSignOut}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            <LogOut size={12} />
            Sign out
          </button>
        </div>
      </motion.div>
    </div>
  )
}
