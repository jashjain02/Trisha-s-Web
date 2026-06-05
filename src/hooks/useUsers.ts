import { useState, useEffect } from 'react'
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { User } from '../types'

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('joinedAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as User))
      setUsers(data)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const approvedUsers = users.filter((u) => u.status === 'approved')
  const pendingUsers = users.filter((u) => u.status === 'pending')

  async function approveUser(userId: string) {
    await updateDoc(doc(db, 'users', userId), { status: 'approved' })
  }

  async function rejectUser(userId: string) {
    await updateDoc(doc(db, 'users', userId), { status: 'rejected' })
  }

  return { users, approvedUsers, pendingUsers, loading, approveUser, rejectUser }
}
