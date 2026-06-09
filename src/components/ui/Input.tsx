import { type InputHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const baseClass = `
  w-full px-4 py-2.5 rounded-xl border text-sm text-white
  bg-white/[0.04] backdrop-blur-sm
  border-white/[0.10] placeholder:text-slate-600
  focus:outline-none focus:ring-2 focus:ring-[#FF2E93]/30 focus:border-[#FF2E93]/50
  transition-all duration-200
  disabled:opacity-40 disabled:cursor-not-allowed
`

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className = '', ...props },
  ref
) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-slate-300">{label}</label>
      )}
      <input ref={ref} className={`${baseClass} ${error ? 'border-rose-500/50 focus:ring-rose-500/30' : ''} ${className}`} {...props} />
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  )
})

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, className = '', ...props },
  ref
) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-slate-300">{label}</label>
      )}
      <textarea
        ref={ref}
        rows={3}
        className={`${baseClass} resize-none ${error ? 'border-rose-500/50 focus:ring-rose-500/30' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  )
})

interface SelectProps {
  label?: string
  error?: string
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function Select({ label, error, options, value, onChange, placeholder }: SelectProps) {
  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-slate-300">{label}</label>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${baseClass} ${error ? 'border-rose-500/50 focus:ring-rose-500/30' : ''}`}
        style={{ colorScheme: 'dark' }}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  )
}
