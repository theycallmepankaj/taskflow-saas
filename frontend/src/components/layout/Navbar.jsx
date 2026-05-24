import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

import {
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  X,
} from 'lucide-react'

const searchInputClass =
  'w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 outline-none transition-all duration-200 hover:border-white/[0.12] hover:bg-white/[0.06] focus:border-cyan-400/40 focus:shadow-[0_0_0_3px_rgba(34,211,238,0.1)]'

export default function Navbar({ userName = 'Alex' }) {
  const navigate = useNavigate()

  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  // FIXED STATES
  const [searchQuery, setSearchQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] =
    useState(false)

  // FIXED REFS
  const menuRef = useRef(null)
  const notifRef = useRef(null)

  const dynamicUserName =
    user?.name || userName

  const dynamicUserEmail =
    user?.email || 'No email'

  const initials = dynamicUserName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    if (user) {
      setNotifications(
        user.role === 'admin'
          ? [
              { id: 1, text: 'New tasker registered: Sarah Connor', time: '10m ago', read: false },
              { id: 2, text: 'System backup completed successfully', time: '1h ago', read: false },
              { id: 3, text: 'Task "Database setup" completed by Tasker John', time: '2h ago', read: true },
            ]
          : [
              { id: 1, text: 'New task assigned: "Update API documentation"', time: '30m ago', read: false },
              { id: 2, text: 'Deadline approaching: "Refactor auth middleware"', time: '4h ago', read: false },
              { id: 3, text: 'Welcome to your TaskFlow workspace!', time: '1d ago', read: true },
            ]
      )
    }
  }, [user])

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    toast.success('Marked all notifications as read')
  }

  const handleClearAll = () => {
    setNotifications([])
    toast.success('Cleared all notifications')
  }

  const toggleNotif = () => setNotifOpen((o) => !o)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuOpen && !menuRef.current?.contains(e.target)) {
        setMenuOpen(false)
      }
      if (notifOpen && !notifRef.current?.contains(e.target)) {
        setNotifOpen(false)
      }
    }

    document.addEventListener(
      'mousedown',
      handleClickOutside
    )

    return () =>
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      )
  }, [menuOpen, notifOpen])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-20 w-full border-b border-white/[0.06] bg-[#0a0a0f]/75 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 sm:gap-4 sm:px-6 lg:h-[4.25rem]">
        {/* Welcome */}
        <div className="hidden min-w-0 shrink-0 sm:block">
          <p className="truncate text-sm font-medium text-white">
            Welcome back,{' '}
            <span className="text-cyan-300/90">
              {dynamicUserName}
            </span>
            <span className="ml-2 rounded-md bg-cyan-400/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-300">
              {user?.role || 'tasker'}
            </span>
          </p>

          <p className="truncate text-xs text-zinc-500">
            Here&apos;s what&apos;s happening today
          </p>
        </div>

        {/* Mobile welcome */}
        {!mobileSearchOpen && (
          <p className="min-w-0 flex-1 truncate text-sm font-medium text-white sm:hidden">
            Hi,{' '}
            <span className="text-cyan-300/90">
              {dynamicUserName}
            </span>
            <span className="ml-2 rounded-md bg-cyan-400/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-300">
              {user?.role || 'tasker'}
            </span>
          </p>
        )}

        {/* Desktop search */}
        <div className="relative hidden w-64 shrink-0 sm:block lg:w-72">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
            strokeWidth={1.75}
          />

          <input
            type="search"
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            placeholder="Search tasks, projects..."
            className={searchInputClass}
          />
        </div>

        <div className="hidden flex-1 sm:block" />

        {/* Right actions */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* Mobile search */}
          <button
            type="button"
            onClick={() =>
              setMobileSearchOpen((o) => !o)
            }
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-zinc-400 transition-all duration-200 hover:border-cyan-400/25 hover:bg-white/[0.06] hover:text-cyan-300 sm:hidden"
          >
            {mobileSearchOpen ? (
              <X
                className="h-4 w-4"
                strokeWidth={1.75}
              />
            ) : (
              <Search
                className="h-4 w-4"
                strokeWidth={1.75}
              />
            )}
          </button>

          {/* Notification */}
          <div ref={notifRef} className="relative">
            <button
              type="button"
              onClick={toggleNotif}
              className={`group relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border bg-white/[0.04] text-zinc-400 transition-all duration-200 hover:border-cyan-400/25 hover:bg-white/[0.06] hover:text-cyan-300 ${
                notifOpen ? 'border-cyan-400/30 text-cyan-300' : 'border-white/[0.08]'
              }`}
            >
              <Bell
                className="h-[18px] w-[18px]"
                strokeWidth={1.75}
              />
              {unreadCount > 0 && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              )}
            </button>

            {/* Dropdown */}
            <div
              className={`absolute right-0 top-[calc(100%+0.5rem)] z-50 w-80 origin-top-right overflow-hidden rounded-xl border border-white/[0.08] bg-[#0c0c12]/95 p-1.5 backdrop-blur-xl transition-all duration-200 ${
                notifOpen
                  ? 'pointer-events-auto scale-100 opacity-100'
                  : 'pointer-events-none scale-95 opacity-0'
              }`}
            >
              <div className="flex items-center justify-between border-b border-white/[0.06] px-3 py-2">
                <span className="text-xs font-semibold text-white uppercase tracking-wider">
                  Notifications ({unreadCount})
                </span>
                {notifications.length > 0 && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      className="text-[10px] text-cyan-400 hover:underline"
                    >
                      Mark read
                    </button>
                    <span className="text-zinc-700 text-[10px]">|</span>
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="text-[10px] text-zinc-500 hover:text-red-400 hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto py-1">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-zinc-500">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        setNotifications((prev) =>
                          prev.map((notif) =>
                            notif.id === n.id ? { ...notif, read: true } : notif
                          )
                        )
                      }}
                      className={`cursor-pointer rounded-lg px-3 py-2.5 transition-colors hover:bg-white/[0.04] text-left ${
                        n.read ? 'opacity-60' : 'bg-cyan-500/[0.02]'
                      }`}
                    >
                      <p className="text-xs text-zinc-200 leading-snug">
                        {n.text}
                      </p>
                      <span className="mt-1 block text-[9px] text-zinc-500">
                        {n.time}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* User menu */}
          <div
            ref={menuRef}
            className="relative"
          >
            <button
              type="button"
              onClick={() =>
                setMenuOpen((o) => !o)
              }
              className={`flex items-center gap-2 rounded-xl border bg-white/[0.04] py-1.5 pl-1.5 pr-2.5 transition-all duration-200 sm:pr-3 ${
                menuOpen
                  ? 'border-cyan-400/30'
                  : 'border-white/[0.08]'
              }`}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400/30 to-violet-500/30 text-xs font-semibold text-white">
                {initials}
              </span>

              <span className="hidden max-w-[100px] truncate text-sm font-medium text-zinc-200 md:block">
                {dynamicUserName}
              </span>

              <ChevronDown
                className={`hidden h-4 w-4 text-zinc-500 transition-transform duration-200 md:block ${
                  menuOpen ? 'rotate-180' : ''
                }`}
                strokeWidth={1.75}
              />
            </button>

            {/* Dropdown */}
            <div
              className={`absolute right-0 top-[calc(100%+0.5rem)] z-50 min-w-[200px] origin-top-right overflow-hidden rounded-xl border border-white/[0.08] bg-[#0c0c12]/95 p-1.5 backdrop-blur-xl transition-all duration-200 ${
                menuOpen
                  ? 'pointer-events-auto scale-100 opacity-100'
                  : 'pointer-events-none scale-95 opacity-0'
              }`}
            >
              <div className="border-b border-white/[0.06] px-3 py-2.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-white truncate max-w-[120px]">
                    {dynamicUserName}
                  </p>
                  <span className="rounded bg-cyan-500/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-cyan-300 shrink-0">
                    {user?.role || 'tasker'}
                  </span>
                </div>

                <p className="text-xs text-zinc-500 truncate">
                  {dynamicUserEmail}
                </p>
              </div>

              {user?.role !== 'admin' && (
                <Link
                  to="/tasker/profile"
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-white/[0.06]"
                >
                  <User
                    className="h-4 w-4"
                    strokeWidth={1.75}
                  />

                  Profile
                </Link>
              )}

              <Link
                to={user?.role === 'admin' ? '/admin/settings' : '/tasker/settings'}
                onClick={() =>
                  setMenuOpen(false)
                }
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-white/[0.06]"
              >
                <Settings
                  className="h-4 w-4"
                  strokeWidth={1.75}
                />

                Settings
              </Link>

              <div className="my-1 border-t border-white/[0.06]" />

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  handleLogout()
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-red-500/10 hover:text-red-300"
              >
                <LogOut
                  className="h-4 w-4"
                  strokeWidth={1.75}
                />

                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile search */}
      <div
        className={`overflow-hidden border-t border-white/[0.06] bg-[#0a0a0f]/90 px-4 transition-all duration-300 sm:hidden ${
          mobileSearchOpen
            ? 'max-h-16 py-3 opacity-100'
            : 'max-h-0 py-0 opacity-0'
        }`}
      >
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-400"
            strokeWidth={1.75}
          />

          <input
            type="search"
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            placeholder="Search tasks..."
            className={searchInputClass}
          />
        </div>
      </div>
    </header>
  )
}