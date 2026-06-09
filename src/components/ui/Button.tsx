import { motion, type HTMLMotionProps } from 'framer-motion'
import { type ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: ReactNode
  fullWidth?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#FF2E93] text-white shadow-glow-sm hover:shadow-glow hover:brightness-110',
  secondary:
    'bg-white/[0.06] text-slate-200 border border-white/[0.12] hover:bg-white/[0.10] hover:border-white/[0.18]',
  ghost: 'bg-transparent text-slate-400 hover:bg-white/[0.06] hover:text-white',
  danger: 'bg-rose-500/80 text-white border border-rose-500/40 hover:bg-rose-500 hover:shadow-[0_0_16px_rgba(244,63,94,0.3)]',
  success: 'bg-emerald-500/80 text-white border border-emerald-500/40 hover:bg-emerald-500 hover:shadow-[0_0_16px_rgba(52,211,153,0.3)]',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-xl gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-7 py-3.5 text-base rounded-2xl gap-2.5',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <motion.button
      className={`
        inline-flex items-center justify-center font-medium
        transition-all duration-200
        disabled:opacity-40 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-[#FF2E93]/40 focus:ring-offset-2 focus:ring-offset-obsidian
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      whileHover={disabled || loading ? undefined : { scale: 1.02 }}
      whileTap={disabled || loading ? undefined : { scale: 0.97 }}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon
      )}
      {children}
    </motion.button>
  )
}
