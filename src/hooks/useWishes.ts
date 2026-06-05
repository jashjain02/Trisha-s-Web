import { useState, useEffect } from 'react'
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  arrayUnion,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Wish, WishApplicant, WishCategory } from '../types'

export function useWishes() {
  const [wishes, setWishes] = useState<Wish[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'wishes'), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => {
        const raw = d.data() as Omit<Wish, 'id'>
        if (!raw.applicants) raw.applicants = []
        return { ...raw, id: d.id } as Wish
      })
      setWishes(data)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function createWish(data: {
    title: string
    description: string
    category: WishCategory | string
  }) {
    await addDoc(collection(db, 'wishes'), {
      ...data,
      status: 'open',
      createdBy: 'trisha',
      applicants: [],
      claimedBy: null,
      claimedByName: null,
      claimedByPhotoURL: null,
      fulfilledBy: null,
      fulfilledByName: null,
      createdAt: serverTimestamp(),
    })
  }

  async function applyToWish(wishId: string, applicant: Omit<WishApplicant, 'appliedAt'>) {
    await updateDoc(doc(db, 'wishes', wishId), {
      applicants: arrayUnion({
        ...applicant,
        appliedAt: new Date(),
      }),
    })
  }

  async function updateWish(id: string, data: Partial<Wish>) {
    await updateDoc(doc(db, 'wishes', id), data as Record<string, unknown>)
  }

  async function deleteWish(id: string) {
    await deleteDoc(doc(db, 'wishes', id))
  }

  return { wishes, loading, createWish, applyToWish, updateWish, deleteWish }
}
