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
    <div className="min-h-screen bg-gradient-mesh">
      <div
        className="fixed inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(at 20% 20%, #FFD6E7 0px, transparent 40%), radial-gradient(at 80% 10%, #F2E7FF 0px, transparent 40%), radial-gradient(at 10% 80%, #D9F2FF 0px, transparent 40%), radial-gradient(at 90% 80%, #FFECF4 0px, transparent 40%)',
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
