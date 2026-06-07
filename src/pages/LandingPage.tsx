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
      className={`absolute ${size} select-none pointer-events-none`}
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
      className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center"
      style={{
        background:
          'radial-gradient(at 30% 20%, #FFD6E7 0px, transparent 50%), radial-gradient(at 70% 10%, #F2E7FF 0px, transparent 50%), radial-gradient(at 10% 70%, #D9F2FF 0px, transparent 50%), radial-gradient(at 90% 80%, #FFECF4 0px, transparent 50%), #FAFAFA',
      }}
    >
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

        {/* Glassmorphic blobs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-pink-200/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-lavender/20 blur-3xl" />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 rounded-full bg-blue-powder/20 blur-3xl" />
      </div>

      {/* Hero Content */}
      <motion.div
        style={{ y: heroY }}
        className="relative z-10 text-center px-6 max-w-3xl mx-auto"
      >
        {/* Logo badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-pink-200 shadow-card mb-8"
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
          <span className="text-sm font-semibold text-gray-700">
            Trisha's Exchange™ · Birthday Edition
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </motion.div>

        {/* Main heading */}
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl font-black text-gray-900 leading-none tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
        >
          Welcome to{' '}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-pink-dark via-pink to-lavender bg-clip-text text-transparent">
              Trisha's Exchange
            </span>
            <span className="text-pink align-super text-xl font-black">™</span>
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          className="mt-6 text-xl sm:text-2xl text-gray-600 font-light leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          The only stock market where{' '}
          <span className="font-semibold text-pink-dark">friendship</span> is the currency.
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
            '📈 Earn Stock Value',
            '🏆 Top the Leaderboard',
          ].map((pill) => (
            <span
              key={pill}
              className="px-3 py-1.5 text-xs font-medium bg-white/80 backdrop-blur-sm border border-gray-100 rounded-full text-gray-600 shadow-sm"
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
            className="!rounded-2xl !px-10 !py-4 !text-base font-bold shadow-glass-lg"
          >
            Enter The Exchange
          </Button>
          {error && (
            <p className="mt-3 text-xs font-medium text-red-500 max-w-sm mx-auto">{error}</p>
          )}
        </motion.div>

        {/* Social proof */}
        <motion.p
          className="mt-6 text-xs text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          Sign in with Google · No registration required
        </motion.p>
      </motion.div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0V40Z"
            fill="white"
            fillOpacity="0.4"
          />
        </svg>
      </div>

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
          { emoji: '📈', title: 'Stock Market', desc: 'Your friendship has real value' },
        ].map((card) => (
          <div
            key={card.title}
            className="flex-shrink-0 bg-white/60 backdrop-blur-md border border-white/70 rounded-2xl px-4 py-3 shadow-card min-w-[160px]"
          >
            <div className="text-2xl">{card.emoji}</div>
            <p className="mt-1 text-xs font-semibold text-gray-800">{card.title}</p>
            <p className="text-[10px] text-gray-500">{card.desc}</p>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
