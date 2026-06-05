import { useState, useEffect } from 'react'
import {
  collection,
  onSnapshot,
  addDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Activity, ActivityType } from '../types'

export function useActivities(maxCount = 30) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(
      collection(db, 'activities'),
      orderBy('timestamp', 'desc'),
      limit(maxCount)
    )
    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Activity))
      setActivities(data)
      setLoading(false)
    })
    return unsubscribe
  }, [maxCount])

  async function logActivity(data: {
    type: ActivityType
    userId: string
    userName: string
    userPhotoURL: string
    wishId: string | null
    wishTitle: string | null
    points: number | null
  }) {
    await addDoc(collection(db, 'activities'), {
      ...data,
      timestamp: serverTimestamp(),
    })
  }

  return { activities, loading, logActivity }
}
