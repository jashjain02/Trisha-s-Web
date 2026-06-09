import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Heart,
  Trophy,
  Settings,
  LogOut,
} from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import { Button } from '../ui/Button'
import type { User } from '../../types'

interface NavbarProps {
  user: User
  isAdmin: boolean
  onSignOut: () => void
}

const NAV_LINKS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/wishes', icon: Heart, label: 'Wishes' },
  { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
]

export function Navbar({ user, isAdmin, onSignOut }: NavbarProps) {
  const location = useLocation()

  return (
    <motion.header
      className="sticky top-0 z-40 w-full"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="mx-auto px-4 md:px-6 py-3">
        <div
          className="bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-glass px-4 py-2.5 flex items-center justify-between"
        >
          <Link to="/dashboard" className="flex items-center gap-2 group" aria-label="Trisha's Exchange Home">
            <motion.span
              className="text-xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            >
              💖
            </motion.span>
            <span className="font-bold text-white text-sm hidden sm:block tracking-tight">
              Trisha's Exchange<span className="text-[#FF2E93] align-super text-[10px]">™</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {NAV_LINKS.map(({ to, icon: Icon, label }) => {
              const active = location.pathname === to
              return (
                <Link
                  key={to}
                  to={to}
                  className={`
                    relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200
                    ${active
                      ? 'text-white bg-white/[0.08]'
                      : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'
                    }
                  `}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon size={14} />
                  {label}
                  {active && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#FF2E93] rounded-full"
                    />
                  )}
                </Link>
              )
            })}
            {isAdmin && (
              <Link
                to="/admin"
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                  location.pathname === '/admin'
                    ? 'text-white bg-white/[0.08]'
                    : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'
                }`}
              >
                {location.pathname === '/admin' && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#FF2E93] rounded-full"
                  />
                )}
                <Settings size={14} />
                Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#FF2E93]/[0.10] rounded-xl border border-[#FF2E93]/20">
              <span className="text-xs font-bold text-[#FF2E93]">⭐ {user.points} pts</span>
            </div>
            <Avatar src={user.photoURL} name={user.name} size="sm" />
            <Button
              variant="ghost"
              size="sm"
              onClick={onSignOut}
              aria-label="Sign out"
              className="!px-2 !text-slate-500 hover:!text-white"
            >
              <LogOut size={14} />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2">
        <div className="bg-[#0A0A0C]/95 backdrop-blur-2xl border border-white/[0.10] rounded-2xl shadow-glass px-2 py-2 flex items-center justify-around">
          {NAV_LINKS.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                  active ? 'text-[#FF2E93]' : 'text-slate-500'
                }`}
                aria-label={label}
              >
                <Icon size={18} />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            )
          })}
          {isAdmin && (
            <Link
              to="/admin"
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                location.pathname === '/admin' ? 'text-[#FF2E93]' : 'text-slate-500'
              }`}
              aria-label="Admin"
            >
              <Settings size={18} />
              <span className="text-[10px] font-medium">Admin</span>
            </Link>
          )}
        </div>
      </div>
    </motion.header>
  )
}
