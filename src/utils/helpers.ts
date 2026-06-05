import type { Timestamp } from 'firebase/firestore'
import type { MarketSentiment, MarketStats, Wish, User } from '../types'
import { INITIAL_STOCK_VALUE } from './constants'

export function calcStockValue(points: number): number {
  return INITIAL_STOCK_VALUE + points
}

export function calcMarketSentiment(
  totalWishes: number,
  fulfilledWishes: number
): MarketSentiment {
  if (totalWishes === 0) return 'neutral'
  const ratio = fulfilledWishes / totalWishes
  if (ratio >= 0.6) return 'bullish'
  if (ratio >= 0.3) return 'neutral'
  return 'bearish'
}

export function calcMarketStats(wishes: Wish[], users: User[]): MarketStats {
  const total = wishes.length
  const fulfilled = wishes.filter((w) => w.status === 'fulfilled').length
  const open = wishes.filter((w) => w.status === 'open').length
  const claimed = wishes.filter((w) => w.status === 'claimed' || w.status === 'pending_review').length
  const marketCap = users.reduce((sum, u) => sum + u.stockValue, 0)
  const sentiment = calcMarketSentiment(total, fulfilled)
  const topFriend =
    users.length > 0
      ? users.reduce((best, u) => (u.points > best.points ? u : best), users[0])
      : null

  return {
    totalWishes: total,
    fulfilledWishes: fulfilled,
    openWishes: open,
    claimedWishes: claimed,
    marketCap,
    sentiment,
    topFriend,
  }
}

export function formatTimestamp(ts: Timestamp | undefined): string {
  if (!ts) return ''
  const date = ts.toDate()
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

export function getRankEmoji(rank: number): string {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return `#${rank}`
}
