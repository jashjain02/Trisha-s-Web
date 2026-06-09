import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Button } from '../components/ui/Button'
import { Sparkles } from 'lucide-react'

interface LandingPageProps {
  onEnter: () => void
  loading: boolean
  error?: string | null
}

function FloatingElement({
  children,
  x,
  y,
  delay = 0,
  duration = 6,
  size = 'text-2xl',
}: {
  children: string
  x: string
  y: string
  delay?: number
  duration?: number
  size?: string
}) {
  return (
    <motion.div
      className={`absolute ${size} select-none pointer-events-none opacity-30`}
      style={{ left: x, top: y }}
      animate={{
        y: [0, -24, 0, -12, 0],
        rotate: [0, 8, -8, 4, 0],
        scale: [1, 1.1, 0.95, 1.05, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  )
}

export function LandingPage({ onEnter, loading, error }: LandingPageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ container: containerRef })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -80])

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center bg-obsidian"
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(255,46,147,0.10) 0px, transparent 55%), radial-gradient(ellipse at 20% 80%, rgba(168,85,247,0.06) 0px, transparent 50%), radial-gradient(ellipse at 80% 60%, rgba(255,46,147,0.04) 0px, transparent 50%)',
        }}
      />

      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <FloatingElement x="5%" y="10%" delay={0} duration={7} size="text-4xl">💖</FloatingElement>
        <FloatingElement x="15%" y="75%" delay={1.5} duration={8} size="text-2xl">🌸</FloatingElement>
        <FloatingElement x="85%" y="15%" delay={0.8} duration={6} size="text-3xl">⭐</FloatingElement>
        <FloatingElement x="90%" y="70%" delay={2} duration={9} size="text-2xl">✨</FloatingElement>
        <FloatingElement x="50%" y="5%" delay={3} duration={7} size="text-2xl">💫</FloatingElement>
        <FloatingElement x="3%" y="45%" delay={1} duration={8} size="text-xl">🌟</FloatingElement>
        <FloatingElement x="92%" y="40%" delay={2.5} duration={6} size="text-2xl">💕</FloatingElement>
        <FloatingElement x="40%" y="88%" delay={1.2} duration={8} size="text-xl">🎀</FloatingElement>
        <FloatingElement x="70%" y="80%" delay={0.5} duration={7} size="text-2xl">💝</FloatingElement>
        <FloatingElement x="25%" y="5%" delay={3.5} duration={9} size="text-xl">🌈</FloatingElement>

        {/* Deep ambient blobs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#FF2E93]/[0.04] blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-600/[0.04] blur-3xl" />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 rounded-full bg-[#FF2E93]/[0.03] blur-3xl" />
      </div>

      {/* Hero Content */}
      <motion.div
        style={{ y: heroY }}
        className="relative z-10 text-center px-6 max-w-3xl mx-auto"
      >
        {/* Logo badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] backdrop-blur-sm border border-white/[0.10] shadow-glass mb-8"
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            animate={{ rotate: [0, 20, -20, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          >
            💖
          </motion.span>
          <span className="text-sm font-semibold text-slate-300 tracking-wide">
            Trisha's Exchange™ · Birthday Edition
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </motion.div>

        {/* Main heading */}
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-none tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
        >
          Welcome to{' '}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-[#FF2E93] via-[#FF2E93] to-purple-400 bg-clip-text text-transparent">
              Trisha's Exchange
            </span>
            <span className="text-[#FF2E93] align-super text-xl font-black">™</span>
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          className="mt-6 text-xl sm:text-2xl text-slate-400 font-light leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Make a wish, fulfill a wish,{' '}
          <span className="font-semibold text-white">earn friendship points</span>.
        </motion.p>

        {/* Feature pills */}
        <motion.div
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {[
            '🎯 Post Wishes',
            '⚡ Claim & Fulfill',
            '⭐ Earn Points',
            '🏆 Top the Leaderboard',
          ].map((pill) => (
            <span
              key={pill}
              className="px-3 py-1.5 text-xs font-medium bg-white/[0.05] backdrop-blur-sm border border-white/[0.08] rounded-full text-slate-400"
            >
              {pill}
            </span>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5, type: 'spring', stiffness: 300 }}
        >
          <Button
            variant="primary"
            size="lg"
            onClick={onEnter}
            loading={loading}
            icon={<Sparkles size={18} />}
            className="!rounded-2xl !px-10 !py-4 !text-base font-bold shadow-glow"
          >
            Enter The Exchange
          </Button>
          {error && (
            <p className="mt-3 text-xs font-medium text-rose-400 max-w-sm mx-auto">{error}</p>
          )}
        </motion.div>

        {/* Social proof */}
        <motion.p
          className="mt-6 text-xs text-slate-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          Sign in with Google · No registration required
        </motion.p>
      </motion.div>

      {/* Glassmorphic feature cards */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 px-4 w-full max-w-2xl overflow-x-auto pb-2 scrollbar-hide"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        aria-hidden="true"
      >
        {[
          { emoji: '💖', title: 'Post Wishes', desc: 'Trisha posts anything she wants' },
          { emoji: '⭐', title: 'Earn Points', desc: 'Friends compete to fulfill them' },
          { emoji: '🏆', title: 'Leaderboard', desc: "See who's topping the charts" },
        ].map((card) => (
          <div
            key={card.title}
            className="flex-shrink-0 bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl px-4 py-3 shadow-card min-w-[160px]"
          >
            <div className="text-2xl">{card.emoji}</div>
            <p className="mt-1 text-xs font-semibold text-slate-200">{card.title}</p>
            <p className="text-[10px] text-slate-500">{card.desc}</p>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
