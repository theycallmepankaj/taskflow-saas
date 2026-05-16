import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
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
  const [searchQuery, setSearchQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const menuRef = useRef(null)

  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  useEffect(() => {
    if (!menuOpen) return
    const handleClickOutside = (e) => {
      if (!menuRef.current?.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-20 w-full border-b border-white/[0.06] bg-[#0a0a0f]/75 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 sm:gap-4 sm:px-6 lg:h-[4.25rem]">
        {/* Welcome — tablet+ */}
        <div className="hidden min-w-0 shrink-0 sm:block">
          <p className="truncate text-sm font-medium text-white">
            Welcome back,{' '}
            <span className="text-cyan-300/90">{userName}</span>
          </p>
          <p className="truncate text-xs text-zinc-500">
            Here&apos;s what&apos;s happening today
          </p>
        </div>

        {/* Mobile welcome */}
        {!mobileSearchOpen && (
          <p className="min-w-0 flex-1 truncate text-sm font-medium text-white sm:hidden">
            Hi, <span className="text-cyan-300/90">{userName}</span>
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
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, projects..."
            className={searchInputClass}
          />
        </div>

        <div className="hidden flex-1 sm:block" />

        {/* Right actions */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setMobileSearchOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-zinc-400 transition-all duration-200 hover:border-cyan-400/25 hover:bg-white/[0.06] hover:text-cyan-300 sm:hidden"
            aria-label={mobileSearchOpen ? 'Close search' : 'Open search'}
          >
            {mobileSearchOpen ? (
              <X className="h-4 w-4" strokeWidth={1.75} />
            ) : (
              <Search className="h-4 w-4" strokeWidth={1.75} />
            )}
          </button>

          <button
            type="button"
            className="group relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-zinc-400 transition-all duration-200 hover:border-cyan-400/25 hover:bg-white/[0.06] hover:text-cyan-300"
            aria-label="Notifications"
          >
            <Bell
              className="h-[18px] w-[18px] transition-transform duration-300 group-hover:scale-110"
              strokeWidth={1.75}
            />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          </button>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className={`flex items-center gap-2 rounded-xl border bg-white/[0.04] py-1.5 pl-1.5 pr-2.5 transition-all duration-200 sm:pr-3 ${
                menuOpen
                  ? 'border-cyan-400/30 shadow-[0_0_20px_rgba(34,211,238,0.1)]'
                  : 'border-white/[0.08] hover:border-white/[0.12] hover:bg-white/[0.06]'
              }`}
              aria-expanded={menuOpen}
              aria-haspopup="true"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400/30 to-violet-500/30 text-xs font-semibold text-white ring-1 ring-white/10">
                {initials}
              </span>
              <span className="hidden max-w-[100px] truncate text-sm font-medium text-zinc-200 md:block">
                {userName}
              </span>
              <ChevronDown
                className={`hidden h-4 w-4 text-zinc-500 transition-transform duration-200 md:block ${
                  menuOpen ? 'rotate-180' : ''
                }`}
                strokeWidth={1.75}
              />
            </button>

            <div
              className={`absolute right-0 top-[calc(100%+0.5rem)] z-50 min-w-[200px] origin-top-right overflow-hidden rounded-xl border border-white/[0.08] bg-[#0c0c12]/95 p-1.5 shadow-[0_16px_48px_rgba(0,0,0,0.5),0_0_24px_rgba(34,211,238,0.06)] backdrop-blur-xl transition-all duration-200 ${
                menuOpen
                  ? 'pointer-events-auto scale-100 opacity-100'
                  : 'pointer-events-none scale-95 opacity-0'
              }`}
              role="menu"
            >
              <div className="border-b border-white/[0.06] px-3 py-2.5">
                <p className="text-sm font-medium text-white">{userName}</p>
                <p className="text-xs text-zinc-500">alex@taskflow.app</p>
              </div>
              <Link
                to="/profile"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors duration-150 hover:bg-white/[0.06] hover:text-zinc-200"
              >
                <User className="h-4 w-4" strokeWidth={1.75} />
                Profile
              </Link>
              <Link
                to="/settings"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors duration-150 hover:bg-white/[0.06] hover:text-zinc-200"
              >
                <Settings className="h-4 w-4" strokeWidth={1.75} />
                Settings
              </Link>
              <div className="my-1 border-t border-white/[0.06]" />
              <Link
                to="/"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors duration-150 hover:bg-red-500/10 hover:text-red-300"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.75} />
                Sign out
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      <div
        className={`overflow-hidden border-t border-white/[0.06] bg-[#0a0a0f]/90 px-4 transition-all duration-300 sm:hidden ${
          mobileSearchOpen ? 'max-h-16 py-3 opacity-100' : 'max-h-0 py-0 opacity-0'
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
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, projects..."
            className={searchInputClass}
            autoFocus={mobileSearchOpen}
          />
        </div>
      </div>
    </header>
  )
}
