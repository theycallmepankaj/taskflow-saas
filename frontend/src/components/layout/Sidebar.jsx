import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ListTodo,
  BarChart3,
  User,
  Settings,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tasks', label: 'Tasks', icon: ListTodo },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
]

const linkBase =
  'group relative flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium transition-all duration-200'

function navLinkClass({ isActive }, collapsed) {
  const collapsedStyles = collapsed ? 'lg:justify-center lg:px-0' : ''
  if (isActive) {
    return `${linkBase} border-cyan-400/25 bg-cyan-400/10 text-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.12),inset_0_1px_0_rgba(255,255,255,0.06)] ${collapsedStyles}`
  }
  return `${linkBase} text-zinc-500 hover:border-white/[0.06] hover:bg-white/[0.05] hover:text-zinc-200 ${collapsedStyles}`
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const closeMobile = () => setMobileOpen(false)

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.05] text-zinc-300 shadow-lg backdrop-blur-xl transition-all duration-200 hover:border-cyan-400/30 hover:bg-white/[0.08] hover:text-cyan-300 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" strokeWidth={1.75} />
      </button>

      {/* Mobile overlay */}
      <div
        role="presentation"
        onClick={closeMobile}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        className={`sidebar-panel fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/[0.06] bg-[#0a0a0f]/80 shadow-[4px_0_40px_rgba(0,0,0,0.4)] backdrop-blur-2xl transition-[width,transform] duration-300 ease-in-out lg:sticky lg:top-0 lg:z-30 lg:h-dvh ${
          collapsed ? 'lg:w-[72px]' : 'lg:w-64'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 top-0 h-32 bg-gradient-to-b from-cyan-500/[0.08] to-transparent"
        />

        {/* Header */}
        <div
          className={`relative flex shrink-0 items-center border-b border-white/[0.06] px-4 py-5 ${
            collapsed ? 'gap-3 lg:justify-center lg:px-3' : 'gap-3'
          }`}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cyan-400/25 bg-cyan-400/10 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
            <Sparkles className="h-4 w-4 text-cyan-300" strokeWidth={1.75} />
          </div>
          <div
            className={`flex min-w-0 flex-col overflow-hidden transition-all duration-300 ${
              collapsed ? 'w-auto opacity-100 lg:w-0 lg:opacity-0' : 'w-auto opacity-100'
            }`}
          >
            <span className="truncate text-sm font-semibold tracking-tight text-white">
              TaskFlow
            </span>
            <span className="truncate text-[11px] text-zinc-500">Workspace</span>
          </div>
          <button
            type="button"
            onClick={closeMobile}
            className="ml-auto rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-zinc-200 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="relative flex flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden px-3 py-4">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={closeMobile}
              title={collapsed ? label : undefined}
              className={(state) => navLinkClass(state, collapsed)}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span
                      aria-hidden
                      className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                    />
                  )}
                  <Icon
                    className={`h-[18px] w-[18px] shrink-0 transition-colors duration-200 ${
                      isActive ? 'text-cyan-300' : 'text-zinc-500 group-hover:text-zinc-300'
                    }`}
                    strokeWidth={1.75}
                  />
                  <span
                    className={`truncate transition-all duration-300 ${
                      collapsed ? 'w-auto opacity-100 lg:w-0 lg:opacity-0' : 'w-auto opacity-100'
                    }`}
                  >
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Collapse toggle — desktop */}
        <div className="hidden shrink-0 border-t border-white/[0.06] p-3 lg:block">
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className={`flex w-full items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 text-sm font-medium text-zinc-500 transition-all duration-200 hover:border-white/[0.1] hover:bg-white/[0.06] hover:text-zinc-300 ${
              collapsed ? 'lg:justify-center lg:px-0' : ''
            }`}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
            ) : (
              <>
                <PanelLeftClose className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
                <span
                  className={`truncate transition-all duration-300 ${
                    collapsed ? 'w-auto opacity-100 lg:w-0 lg:opacity-0' : 'w-auto opacity-100'
                  }`}
                >
                  Collapse
                </span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  )
}
