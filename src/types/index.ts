import type { Timestamp } from 'firebase/firestore'

export type UserStatus = 'pending' | 'approved' | 'rejected'

export interface User {
  id: string
  name: string
  email: string
  photoURL: string
  whatsapp: string
  status: UserStatus
  points: number
  joinedAt: Timestamp
}

export type WishStatus = 'open' | 'claimed' | 'pending_review' | 'fulfilled'

export type WishCategory =
  | 'Food'
  | 'Coffee'
  | 'Flowers'
  | 'Shopping'
  | 'Travel'
  | 'Emotional Support'
  | 'Custom'

export interface WishApplicant {
  userId: string
  userName: string
  userPhotoURL: string
  appliedAt: Timestamp
}

export interface Wish {
  id: string
  title: string
  description: string
  category: WishCategory | string
  status: WishStatus
  createdBy: string
  applicants: WishApplicant[]
  claimedBy: string | null
  claimedByName: string | null
  claimedByPhotoURL: string | null
  fulfilledBy: string | null
  fulfilledByName: string | null
  createdAt: Timestamp
  claimedAt?: Timestamp
  submittedAt?: Timestamp
  fulfilledAt?: Timestamp
  fulfillmentPhotoURL?: string
}

export type ActivityType =
  | 'wish_applied'
  | 'wish_claimed'
  | 'wish_submitted'
  | 'wish_fulfilled'
  | 'wish_created'
  | 'points_earned'
  | 'joined'

export interface Activity {
  id: string
  type: ActivityType
  userId: string
  userName: string
  userPhotoURL: string
  wishId: string | null
  wishTitle: string | null
  points: number | null
  timestamp: Timestamp
}
