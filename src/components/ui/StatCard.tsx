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

export function StatCard({ label, value, trend, color = 'from-white/[0.02] to-transparent', delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <GlassCard hover className="relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${color} rounded-2xl`} />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
            <motion.p
              className="mt-1.5 text-2xl font-bold text-white"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.1, type: 'spring', stiffness: 400 }}
            >
              {value}
            </motion.p>
            {trend && <p className="mt-1 text-xs text-slate-500">{trend}</p>}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}
