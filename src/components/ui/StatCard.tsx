import { motion } from 'framer-motion'
import { type ReactNode } from 'react'
import { GlassCard } from './GlassCard'

interface StatCardProps {
  label: string
  value: string | number
  icon: ReactNode
  trend?: string
  color?: string
  delay?: number
}

export function StatCard({ label, value, icon, trend, color = 'from-pink-100 to-pink-soft', delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <GlassCard hover className="relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-30 rounded-2xl`} />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
            <motion.p
              className="mt-1 text-2xl font-bold text-gray-900"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.1, type: 'spring', stiffness: 400 }}
            >
              {value}
            </motion.p>
            {trend && <p className="mt-1 text-xs text-gray-500">{trend}</p>}
          </div>
          <div className="text-2xl">{icon}</div>
        </div>
      </GlassCard>
    </motion.div>
  )
}
