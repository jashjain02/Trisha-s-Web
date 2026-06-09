import { Joyride, STATUS } from 'react-joyride'
import type { EventData, Step } from 'react-joyride'

interface AppTourProps {
  isAdmin: boolean
  userId: string
}

const ADMIN_STEPS: Step[] = [
  {
    target: 'body',
    placement: 'center',
    title: 'Welcome to your Exchange 💖',
    content: "This is Trisha's Exchange — your personal wish fulfillment platform. Your friends will compete to make your wishes come true. Let's take a quick tour!",
  },
  {
    target: '[data-tour="nav-wishes"]',
    title: 'Your Wish Board 🌸',
    content: 'Post anything you want — experiences, gifts, activities. Your friends will see these and compete to fulfill them for you.',
  },
  {
    target: '[data-tour="nav-leaderboard"]',
    title: 'Leaderboard 🏆',
    content: 'Your friends earn points every time they fulfill one of your wishes. See who your best friend really is!',
  },
  {
    target: '[data-tour="nav-admin"]',
    title: 'Your Control Center ⚙️',
    content: 'Approve friend requests, confirm fulfillments, and view all activity. You are in charge here.',
  },
  {
    target: '[data-tour="points-badge"]',
    title: 'Points System ⭐',
    content: "Friends earn points for every wish they fulfill. The more they do, the higher they rank. You can track it all here!",
  },
]

const FRIEND_STEPS: Step[] = [
  {
    target: 'body',
    placement: 'center',
    title: "Welcome to Trisha's Exchange 💖",
    content: "You've been approved! This is where you fulfill Trisha's wishes and earn friendship points. Let's show you around.",
  },
  {
    target: '[data-tour="nav-wishes"]',
    title: 'Wish Board 🌸',
    content: "Browse all of Trisha's wishes here. Claim any open wish to fulfill it and earn points.",
  },
  {
    target: '[data-tour="nav-leaderboard"]',
    title: 'Leaderboard 🏆',
    content: 'Compete with other friends to be at the top. The more wishes you fulfill, the higher you rank.',
  },
  {
    target: '[data-tour="points-badge"]',
    title: 'Your Points ⭐',
    content: 'Your friendship points live here. Fulfill wishes to earn more. First fulfillment of each day gets bonus points!',
  },
]

const tourKey = (userId: string) => `tour_seen_${userId}`

export function AppTour({ isAdmin, userId }: AppTourProps) {
  const alreadySeen = localStorage.getItem(tourKey(userId)) === 'true'
  const steps = isAdmin ? ADMIN_STEPS : FRIEND_STEPS

  function handleEvent(data: EventData) {
    if (data.status === STATUS.FINISHED || data.status === STATUS.SKIPPED) {
      localStorage.setItem(tourKey(userId), 'true')
    }
  }

  return (
    <Joyride
      steps={steps}
      run={!alreadySeen}
      continuous
      scrollToFirstStep
      onEvent={handleEvent}
      options={{
        primaryColor: '#FF2E93',
        overlayColor: 'rgba(0,0,0,0.75)',
        zIndex: 10000,
        skipBeacon: true,
        showProgress: true,
        buttons: ['back', 'primary', 'skip'],
      }}
      styles={{
        tooltip: {
          borderRadius: '16px',
          padding: '20px 24px',
          backgroundColor: '#111115',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: '0 16px 56px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)',
        },
        tooltipTitle: {
          fontSize: '15px',
          fontWeight: '700',
          color: '#ffffff',
          marginBottom: '8px',
        },
        tooltipContent: {
          fontSize: '13px',
          lineHeight: '1.6',
          color: '#94a3b8',
          padding: '0',
        },
        buttonPrimary: {
          backgroundColor: '#FF2E93',
          borderRadius: '10px',
          fontSize: '13px',
          fontWeight: '600',
          padding: '8px 16px',
          boxShadow: '0 0 12px rgba(255,46,147,0.25)',
        },
        buttonBack: {
          color: '#64748b',
          fontSize: '13px',
          marginRight: '8px',
        },
        buttonSkip: {
          color: '#475569',
          fontSize: '12px',
        },
        buttonClose: {
          color: '#64748b',
        },
      }}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Done 🎉',
        next: 'Next →',
        skip: 'Skip tour',
      }}
    />
  )
}
