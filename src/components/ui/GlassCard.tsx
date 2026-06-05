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
        bg-white/70 backdrop-blur-md
        border border-white/60
        shadow-card
        ${paddingMap[padding]}
        ${hover ? 'cursor-pointer' : ''}
        ${className}
      `}
      whileHover={hover ? { scale: 1.02, boxShadow: '0 8px 40px rgba(255, 107, 157, 0.2)' } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
