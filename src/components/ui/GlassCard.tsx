import { motion, type HTMLMotionProps } from 'framer-motion'
import { type ReactNode } from 'react'

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode
  hover?: boolean
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export function GlassCard({
  children,
  hover = false,
  className = '',
  padding = 'md',
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      className={`
        relative rounded-2xl
        bg-white/[0.03] backdrop-blur-2xl
        border border-white/[0.08]
        shadow-card
        ${paddingMap[padding]}
        ${hover ? 'cursor-pointer' : ''}
        ${className}
      `}
      whileHover={hover ? { scale: 1.01, boxShadow: '0 8px 40px rgba(255,46,147,0.18), 0 0 0 1px rgba(255,46,147,0.12)' } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
