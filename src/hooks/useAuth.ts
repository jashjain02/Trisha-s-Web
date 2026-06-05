import { useState, useEffect } from 'react'
import {
  onAuthStateChanged,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  type User as FirebaseUser,
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider } from '../lib/firebase'
import type { User } from '../types'
import { ADMIN_EMAIL, INITIAL_POINTS, INITIAL_STOCK_VALUE } from '../utils/constants'

interface AuthState {
  user: User | null
  firebaseUser: FirebaseUser | null
  isAdmin: boolean
  isPending: boolean   // signed in but not yet approved
  isRejected: boolean
  isNewUser: boolean   // signed in but hasn't submitted whatsapp yet
  loading: boolean
  error: string | null
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    firebaseUser: null,
    isAdmin: false,
    isPending: false,
    isRejected: false,
    isNewUser: false,
    loading: true,
    error: null,
  })

  useEffect(() => {
    // Handle redirect result from signInWithRedirect
    getRedirectResult(auth).catch((err) => {
      console.error('Redirect sign-in error:', err)
      setState((prev) => ({ ...prev, loading: false, error: err.message || 'Sign in failed.' }))
    })

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setState({ user: null, firebaseUser: null, isAdmin: false, isPending: false, isRejected: false, isNewUser: false, loading: false, error: null })
        return
      }

      try {
        const isAdmin = firebaseUser.email === ADMIN_EMAIL
        const userRef = doc(db, 'users', firebaseUser.uid)
        const userSnap = await getDoc(userRef)

        if (userSnap.exists()) {
          const userData = { id: firebaseUser.uid, ...userSnap.data() } as User
          setState({
            user: userData,
            firebaseUser,
            isAdmin,
            isPending: !isAdmin && userData.status === 'pending',
            isRejected: userData.status === 'rejected',
            isNewUser: false,
            loading: false,
            error: null,
          })
        } else {
          // Brand new user — no doc yet, needs to submit whatsapp
          setState({
            user: null,
            firebaseUser,
            isAdmin,
            isPending: false,
            isRejected: false,
            isNewUser: !isAdmin,
            loading: false,
            error: null,
          })

          // Admin auto-approved
          if (isAdmin) {
            const newUser: Omit<User, 'id'> = {
              name: firebaseUser.displayName || 'Trisha',
              email: firebaseUser.email || '',
              photoURL: firebaseUser.photoURL || '',
              whatsapp: '',
              status: 'approved',
              points: INITIAL_POINTS,
              stockValue: INITIAL_STOCK_VALUE,
              joinedAt: serverTimestamp() as any,
            }
            await setDoc(userRef, newUser)
            setState({
              user: { id: firebaseUser.uid, ...newUser },
              firebaseUser,
              isAdmin: true,
              isPending: false,
              isRejected: false,
              isNewUser: false,
              loading: false,
              error: null,
            })
          }
        }
      } catch {
        setState((prev) => ({ ...prev, loading: false, error: 'Failed to load user data.' }))
      }
    })
    return unsubscribe
  }, [])

  async function signInWithGoogle() {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      await signInWithRedirect(auth, googleProvider)
    } catch {
      setState((prev) => ({ ...prev, loading: false, error: 'Sign in failed. Please try again.' }))
    }
  }

  async function submitJoinRequest(whatsapp: string) {
    if (!state.firebaseUser) return
    const firebaseUser = state.firebaseUser
    const userRef = doc(db, 'users', firebaseUser.uid)

    const newUser: Omit<User, 'id'> = {
      name: firebaseUser.displayName || 'Friend',
      email: firebaseUser.email || '',
      photoURL: firebaseUser.photoURL || '',
      whatsapp,
      status: 'pending',
      points: INITIAL_POINTS,
      stockValue: INITIAL_STOCK_VALUE,
      joinedAt: serverTimestamp() as any,
    }
    await setDoc(userRef, newUser)

    setState((prev) => ({
      ...prev,
      user: { id: firebaseUser.uid, ...newUser },
      isNewUser: false,
      isPending: true,
    }))
  }

  async function signOut() {
    await firebaseSignOut(auth)
  }

  return { ...state, signInWithGoogle, submitJoinRequest, signOut }
}
