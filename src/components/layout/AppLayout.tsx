import { motion } from 'framer-motion'
import { type ReactNode } from 'react'
import { Navbar } from './Navbar'
import type { User } from '../../types'

interface AppLayoutProps {
  children: ReactNode
  user: User
  isAdmin: boolean
  onSignOut: () => void
}

export function AppLayout({ children, user, isAdmin, onSignOut }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-obsidian">
      {/* Ambient background glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse at 20% 10%, rgba(255,46,147,0.05) 0px, transparent 55%), radial-gradient(ellipse at 80% 5%, rgba(168,85,247,0.04) 0px, transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(255,46,147,0.03) 0px, transparent 60%)',
        }}
      />
      <Navbar user={user} isAdmin={isAdmin} onSignOut={onSignOut} />
      <main className="relative mx-auto max-w-7xl px-4 md:px-6 pb-24 md:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
}
