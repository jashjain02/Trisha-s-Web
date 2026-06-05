import { motion } from 'framer-motion'
import { GlassCard } from '../ui/GlassCard'
import { SENTIMENT_CONFIG } from '../../utils/constants'
import type { MarketSentiment } from '../../types'

interface MarketSentimentCardProps {
  sentiment: MarketSentiment
  fulfilledCount: number
  totalCount: number
}

export function MarketSentimentCard({
  sentiment,
  fulfilledCount,
  totalCount,
}: MarketSentimentCardProps) {
  const config = SENTIMENT_CONFIG[sentiment]
  const ratio = totalCount > 0 ? (fulfilledCount / totalCount) * 100 : 0

  return (
    <GlassCard className={`relative overflow-hidden bg-gradient-to-br ${config.bg} border ${config.border}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Market Sentiment</p>
          <div className="mt-1 flex items-center gap-2">
            <motion.span
              className="text-3xl"
              animate={
                sentiment === 'bullish'
                  ? { y: [0, -6, 0] }
                  : sentiment === 'bearish'
                  ? { y: [0, 4, 0] }
                  : { rotate: [0, 5, -5, 0] }
              }
              transition={{ repeat: Infinity, duration: 2 }}
            >
              {config.emoji}
            </motion.span>
            <span className={`text-xl font-bold ${config.color}`}>{config.label}</span>
          </div>
          <p className="mt-1.5 text-xs text-gray-600 max-w-xs">{config.description}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Fulfillment Rate</p>
          <motion.p
            className={`text-2xl font-bold ${config.color}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            {ratio.toFixed(0)}%
          </motion.p>
          <p className="text-xs text-gray-400">{fulfilledCount}/{totalCount} wishes</p>
        </div>
      </div>

      <div className="mt-4 h-2 bg-white/50 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${
            sentiment === 'bullish'
              ? 'bg-gradient-to-r from-emerald-400 to-green-500'
              : sentiment === 'bearish'
              ? 'bg-gradient-to-r from-rose-400 to-red-400'
              : 'bg-gradient-to-r from-amber-300 to-yellow-400'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${ratio}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </GlassCard>
  )
}
