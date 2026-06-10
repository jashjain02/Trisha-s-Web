import { Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import {
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
  type Timestamp,
} from 'firebase/firestore'
import { db } from './lib/firebase'
import { useAuth } from './hooks/useAuth'
import { useWishes } from './hooks/useWishes'
import { useUsers } from './hooks/useUsers'
import { useActivities } from './hooks/useActivities'
import { useConfetti } from './hooks/useConfetti'
import { FulfillmentModal } from './components/wishes/FulfillmentModal'
import { AppLayout } from './components/layout/AppLayout'
import { AppTour } from './components/ui/AppTour'
import { LandingPage } from './pages/LandingPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { PendingPage } from './pages/PendingPage'
import { DashboardPage } from './pages/DashboardPage'
import { WishesPage } from './pages/WishesPage'
import { LeaderboardPage } from './pages/LeaderboardPage'
import { AdminPage } from './pages/AdminPage'
import { POINTS } from './utils/constants'
import { isSameDay } from './utils/helpers'
import type { Wish, WishApplicant, WishCategory } from './types'

function LoadingScreen() {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{
        background:
          'radial-gradient(at 30% 20%, #FFD6E7 0px, transparent 50%), radial-gradient(at 70% 10%, #F2E7FF 0px, transparent 50%), #FAFAFA',
      }}
    >
      <div className="text-5xl animate-bounce-slow">💖</div>
      <p className="mt-4 text-sm text-gray-500 font-medium animate-pulse">
        Loading Trishtrashh's Main Character Era™…
      </p>
    </div>
  )
}

export default function App() {
  const {
    user,
    firebaseUser,
    isAdmin,
    isPending,
    isNewUser,
    loading,
    error,
    signInWithGoogle,
    submitJoinRequest,
    signOut,
  } = useAuth()

  const { wishes, createWish, applyToWish, updateWish, deleteWish } = useWishes()
  const { approvedUsers, pendingUsers, approveUser, rejectUser } = useUsers()
  const { activities, logActivity } = useActivities()
  const { triggerConfetti } = useConfetti()
  const [fulfillmentWish, setFulfillmentWish] = useState<import('./types').Wish | null>(null)

  if (loading) return <LoadingScreen />

  // Not signed in
  if (!firebaseUser) {
    return <LandingPage onEnter={signInWithGoogle} loading={loading} error={error} />
  }

  // Signed in but hasn't submitted whatsapp yet
  if (isNewUser) {
    return (
      <OnboardingPage
        firebaseUser={firebaseUser}
        onSubmit={submitJoinRequest}
        onSignOut={signOut}
      />
    )
  }

  // Submitted but waiting for Trisha's approval
  if (isPending && user) {
    return <PendingPage user={user} onSignOut={signOut} />
  }

  // Rejected
  if (user?.status === 'rejected') {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'radial-gradient(at 30% 20%, #FFD6E7 0px, transparent 50%), #FAFAFA' }}
      >
        <div className="text-center p-8 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-glass-lg max-w-sm">
          <p className="text-4xl mb-3">😢</p>
          <h2 className="text-lg font-bold text-gray-900">Request Not Approved</h2>
          <p className="text-sm text-gray-500 mt-2">Trisha hasn't approved your request. Contact her on WhatsApp!</p>
          <button onClick={signOut} className="mt-4 text-xs text-gray-400 hover:text-gray-600 underline">
            Sign out
          </button>
        </div>
      </div>
    )
  }

  if (!user) return <LoadingScreen />

  // --- Approved user handlers ---

  async function handleApply(wish: Wish) {
    if (!user || isAdmin) return
    await applyToWish(wish.id, {
      userId: user.id,
      userName: user.name,
      userPhotoURL: user.photoURL,
    })
    await logActivity({
      type: 'wish_applied',
      userId: user.id,
      userName: user.name,
      userPhotoURL: user.photoURL,
      wishId: wish.id,
      wishTitle: wish.title,
      points: null,
    })
  }

  async function handleSelectApplicant(wish: Wish, applicant: WishApplicant) {
    await updateWish(wish.id, {
      status: 'claimed',
      claimedBy: applicant.userId,
      claimedByName: applicant.userName,
      claimedByPhotoURL: applicant.userPhotoURL,
      claimedAt: serverTimestamp() as unknown as Timestamp,
    })
    await logActivity({
      type: 'wish_claimed',
      userId: applicant.userId,
      userName: applicant.userName,
      userPhotoURL: applicant.userPhotoURL,
      wishId: wish.id,
      wishTitle: wish.title,
      points: null,
    })
  }

  async function handleSubmit(wish: Wish) {
    if (!user) return
    await updateWish(wish.id, {
      status: 'pending_review',
      submittedAt: serverTimestamp() as unknown as Timestamp,
    })
    await logActivity({
      type: 'wish_submitted',
      userId: user.id,
      userName: user.name,
      userPhotoURL: user.photoURL,
      wishId: wish.id,
      wishTitle: wish.title,
      points: null,
    })
  }

  // Opens the photo-upload fulfillment modal
  function handleConfirmFulfilled(wish: Wish) {
    setFulfillmentWish(wish)
  }

  // Called after photo is uploaded — awards points and closes modal
  async function handleFulfillmentConfirmed(wish: Wish, photoURL: string) {
    if (!wish.claimedBy) return

    await updateWish(wish.id, {
      status: 'fulfilled',
      fulfilledBy: wish.claimedBy,
      fulfilledByName: wish.claimedByName,
      fulfilledAt: serverTimestamp() as unknown as Timestamp,
      fulfillmentPhotoURL: photoURL,
    })

    const friendRef = doc(db, 'users', wish.claimedBy)
    const friendSnap = await getDoc(friendRef)
    const friendData = friendSnap.data()
    if (!friendData) return

    let bonusPoints = POINTS.FULFILL_WISH
    const lastFulfillDate = friendData.lastFulfillDate?.toDate?.()
    const isFirstToday = !lastFulfillDate || !isSameDay(lastFulfillDate, new Date())
    if (isFirstToday) bonusPoints += POINTS.FIRST_FULFILL_OF_DAY

    const newPoints = (friendData.points ?? 0) + bonusPoints
    await updateDoc(friendRef, {
      points: newPoints,
      lastFulfillDate: serverTimestamp(),
    })

    await logActivity({
      type: 'wish_fulfilled',
      userId: wish.claimedBy,
      userName: wish.claimedByName ?? '',
      userPhotoURL: wish.claimedByPhotoURL ?? '',
      wishId: wish.id,
      wishTitle: wish.title,
      points: bonusPoints,
    })

    setFulfillmentWish(null)
    triggerConfetti()
  }

  async function handleCreateWish(data: {
    title: string
    description: string
    category: WishCategory | string
  }) {
    await createWish(data)
    if (user) {
      await logActivity({
        type: 'wish_created',
        userId: user.id,
        userName: user.name,
        userPhotoURL: user.photoURL,
        wishId: null,
        wishTitle: data.title,
        points: null,
      })
    }
  }

  const currentUserData = approvedUsers.find((u) => u.id === user.id) ?? user

  const wishHandlers = {
    onApply: handleApply,
    onSubmit: handleSubmit,
    onSelectApplicant: handleSelectApplicant,
    onConfirmFulfilled: handleConfirmFulfilled,
  }

  return (
    <AppLayout user={currentUserData} isAdmin={isAdmin} onSignOut={signOut}>
      <AppTour isAdmin={isAdmin} userId={user.id} />
      <FulfillmentModal
        wish={fulfillmentWish}
        onClose={() => setFulfillmentWish(null)}
        onConfirm={handleFulfillmentConfirmed}
      />
      <AnimatePresence mode="wait">
        <Routes>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <DashboardPage
                currentUser={currentUserData}
                isAdmin={isAdmin}
                wishes={wishes}
                users={approvedUsers}
                approvedUsers={approvedUsers}
                {...wishHandlers}
              />
            }
          />
          <Route
            path="/wishes"
            element={
              <WishesPage
                currentUser={currentUserData}
                isAdmin={isAdmin}
                wishes={wishes}
                approvedUsers={approvedUsers}
                {...wishHandlers}
                onCreateWish={handleCreateWish}
                onUpdateWish={updateWish}
                onDeleteWish={deleteWish}
              />
            }
          />
          <Route
            path="/leaderboard"
            element={<LeaderboardPage users={approvedUsers} currentUser={currentUserData} />}
          />
          {isAdmin && (
            <Route
              path="/admin"
              element={
                <AdminPage
                  currentUser={currentUserData}
                  users={approvedUsers}
                  approvedUsers={approvedUsers}
                  pendingUsers={pendingUsers}
                  wishes={wishes}
                  activities={activities}
                  onCreateWish={handleCreateWish}
                  onUpdateWish={updateWish}
                  onDeleteWish={deleteWish}
                  {...wishHandlers}
                  onApproveUser={approveUser}
                  onRejectUser={rejectUser}
                />
              }
            />
          )}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AnimatePresence>
    </AppLayout>
  )
}
