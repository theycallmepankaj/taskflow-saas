import { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import {
  Mail,
  Calendar,
  CheckCircle2,
  ListTodo,
  Shield,
  Clock,
  Target
} from 'lucide-react'
import api from '../../api'

const glassCard =
  'rounded-2xl border border-white/[0.08] bg-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md'

export default function TaskerProfile() {
  const user = useAuthStore((state) => state.user)
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const { data } = await api.get('/analytics')
        setStats(data)
      } catch {
        // Fallback
      } finally {
        setIsLoading(false)
      }
    }
    loadStats()
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <span className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-400" />
      </div>
    )
  }

  const initials = (user?.name || 'Tasker')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="profile-page space-y-6 sm:space-y-8 [&_h1]:m-0 [&_h2]:m-0 [&_h3]:m-0">
      <header>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-400/80">
          Account
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Profile
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Overview of your personal assignment records and stats.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile card */}
        <div className={`${glassCard} relative overflow-hidden p-6 sm:p-8 lg:col-span-1`}>
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-500/15 blur-3xl"
          />

          <div className="relative flex flex-col items-center text-center">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/35 via-violet-500/30 to-fuchsia-500/25 text-2xl font-semibold text-white shadow-[0_0_40px_rgba(34,211,238,0.25)] ring-2 ring-white/10 sm:h-28 sm:w-28 sm:text-3xl">
                {initials}
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-400/20">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              </span>
            </div>

            <h2 className="mt-6 text-xl font-semibold text-white">
              {user?.name}
            </h2>

            <p className="mt-1 text-sm text-cyan-300/90 flex items-center gap-1">
              <Shield className="h-3.5 w-3.5" />
              {user?.role || 'tasker'}
            </p>

            <div className="mt-6 flex w-full flex-col gap-2.5 text-left text-sm text-zinc-500 border-t border-white/[0.06] pt-4">
              <span className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-zinc-600" strokeWidth={1.75} />
                {user?.email}
              </span>

              <span className="flex items-center gap-2.5">
                <Calendar className="h-4 w-4 shrink-0 text-zinc-600" strokeWidth={1.75} />
                Registered Member
              </span>
            </div>
          </div>
        </div>

        {/* Main content - Stats & logs */}
        <div className="space-y-6 lg:col-span-2">
          {/* Activity stats */}
          <div>
            <h3 className="mb-4 text-base font-semibold text-white">
              My performance stats
            </h3>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className={`${glassCard} p-4 sm:p-5`}>
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-400/25 bg-cyan-400/10 text-cyan-300">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <p className="text-xl font-semibold text-white">
                  {stats ? stats.summary.completed_tasks : '0'}
                </p>
                <p className="mt-1 text-xs text-zinc-500">Completed Tasks</p>
              </div>

              <div className={`${glassCard} p-4 sm:p-5`}>
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-violet-400/25 bg-violet-400/10 text-violet-300">
                  <Clock className="h-4 w-4" />
                </div>
                <p className="text-xl font-semibold text-white">
                  {stats ? stats.summary.pending_tasks : '0'}
                </p>
                <p className="mt-1 text-xs text-zinc-500">Pending Tasks</p>
              </div>

              <div className={`${glassCard} p-4 sm:p-5 col-span-2 sm:col-span-1`}>
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-400/25 bg-cyan-400/10 text-cyan-300">
                  <Target className="h-4 w-4" />
                </div>
                <p className="text-xl font-semibold text-white">
                  {stats ? `${stats.productivity.completion_rate}%` : '0%'}
                </p>
                <p className="mt-1 text-xs text-zinc-500">Completion Rate</p>
              </div>
            </div>
          </div>

          {/* Recent activity */}
          <div className={`${glassCard} p-6 sm:p-8`}>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">
                Recent Session Log
              </h3>
              <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                <ListTodo className="h-3.5 w-3.5" strokeWidth={1.75} />
                Current session
              </span>
            </div>

            <ul className="space-y-4">
              <li className="flex gap-3 border-b border-white/[0.04] pb-4 last:border-0 last:pb-0">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gradient-to-r from-cyan-400 to-violet-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-zinc-300">
                    <span className="font-medium text-cyan-300/90">Logged in</span> as <span className="text-white">{user?.email}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-600">Active Session</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
