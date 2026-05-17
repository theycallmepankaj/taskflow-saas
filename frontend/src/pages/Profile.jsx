import { useState } from 'react'
import { useAuthStore } from '../store/authStore'

import {
  Mail,
  MapPin,
  Calendar,
  Pencil,
  Check,
  X,
  CheckCircle2,
  ListTodo,
} from 'lucide-react'

const glassCard =
  'rounded-2xl border border-white/[0.08] bg-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md'

export default function Profile() {
  const user = useAuthStore((state) => state.user)

  const [isEditing, setIsEditing] = useState(false)

  const [profile, setProfile] = useState({
    name: user?.name || '',
    role: 'TaskFlow User',
    email: user?.email || '',
    location: '',
    joined: 'Recently joined',
    bio: 'TaskFlow user account',
  })

  const [draft, setDraft] = useState(profile)

  const initials = profile.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const startEdit = () => {
    setDraft(profile)
    setIsEditing(true)
  }

  const cancelEdit = () => {
    setDraft(profile)
    setIsEditing(false)
  }

  const saveEdit = () => {
    setProfile(draft)
    setIsEditing(false)
  }

  const display = isEditing ? draft : profile

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
          Manage your personal information and activity.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile card */}
        <div
          className={`${glassCard} relative overflow-hidden p-6 sm:p-8 lg:col-span-1`}
        >
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

            {isEditing ? (
              <div className="mt-6 w-full space-y-3">
                <input
                  type="text"
                  value={draft.name}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      name: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-center text-sm font-semibold text-white outline-none focus:border-cyan-400/40"
                />

                <input
                  type="text"
                  value={draft.role}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      role: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-center text-sm text-zinc-400 outline-none focus:border-cyan-400/40"
                />
              </div>
            ) : (
              <>
                <h2 className="mt-6 text-xl font-semibold text-white">
                  {display.name}
                </h2>

                <p className="mt-1 text-sm text-cyan-300/90">
                  {display.role}
                </p>
              </>
            )}

            <div className="mt-6 flex w-full flex-col gap-2.5 text-left text-sm text-zinc-500">
              <span className="flex items-center gap-2.5">
                <Mail
                  className="h-4 w-4 shrink-0 text-zinc-600"
                  strokeWidth={1.75}
                />

                {display.email}
              </span>

              <span className="flex items-center gap-2.5">
                <MapPin
                  className="h-4 w-4 shrink-0 text-zinc-600"
                  strokeWidth={1.75}
                />

                {isEditing ? (
                  <input
                    type="text"
                    value={draft.location}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        location: e.target.value,
                      })
                    }
                    className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2 py-1 text-sm text-white outline-none focus:border-cyan-400/40"
                  />
                ) : (
                  display.location || 'No location added'
                )}
              </span>

              <span className="flex items-center gap-2.5">
                <Calendar
                  className="h-4 w-4 shrink-0 text-zinc-600"
                  strokeWidth={1.75}
                />

                Joined {display.joined}
              </span>
            </div>

            <div className="mt-8 flex w-full gap-2">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={saveEdit}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 py-2.5 text-sm font-semibold text-[#041014] transition-all hover:shadow-[0_0_24px_rgba(34,211,238,0.35)]"
                  >
                    <Check
                      className="h-4 w-4"
                      strokeWidth={2}
                    />

                    Save
                  </button>

                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="flex items-center justify-center rounded-xl border border-white/[0.08] px-4 py-2.5 text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-white"
                    aria-label="Cancel editing"
                  >
                    <X
                      className="h-4 w-4"
                      strokeWidth={1.75}
                    />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={startEdit}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] py-2.5 text-sm font-medium text-white transition-all duration-200 hover:border-cyan-400/30 hover:bg-cyan-400/[0.06] hover:shadow-[0_0_20px_rgba(34,211,238,0.12)]"
                >
                  <Pencil
                    className="h-4 w-4 text-cyan-400"
                    strokeWidth={1.75}
                  />

                  Edit profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">
          {/* About */}
          <div className={`${glassCard} p-6 sm:p-8`}>
            <h3 className="text-base font-semibold text-white">
              About
            </h3>

            {isEditing ? (
              <textarea
                value={draft.bio}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    bio: e.target.value,
                  })
                }
                rows={4}
                className="mt-4 w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm leading-relaxed text-white outline-none focus:border-cyan-400/40 focus:shadow-[0_0_0_3px_rgba(34,211,238,0.1)]"
              />
            ) : (
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                {display.bio}
              </p>
            )}
          </div>

          {/* Activity stats */}
          <div>
            <h3 className="mb-4 text-base font-semibold text-white">
              Activity stats
            </h3>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[
                {
                  label: 'Account Status',
                  value: 'Active',
                  icon: CheckCircle2,
                  accent: 'cyan',
                },
              ].map((stat) => {
                const Icon = stat.icon
                const isCyan = stat.accent === 'cyan'

                return (
                  <div
                    key={stat.label}
                    className={`${glassCard} group p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.12] sm:p-5`}
                  >
                    <div
                      className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg border ${
                        isCyan
                          ? 'border-cyan-400/25 bg-cyan-400/10 text-cyan-300'
                          : 'border-violet-400/25 bg-violet-400/10 text-violet-300'
                      }`}
                    >
                      <Icon
                        className="h-4 w-4"
                        strokeWidth={1.75}
                      />
                    </div>

                    <p className="text-xl font-semibold text-white">
                      {stat.value}
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      {stat.label}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent activity */}
          <div className={`${glassCard} p-6 sm:p-8`}>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">
                Recent activity
              </h3>

              <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                <ListTodo
                  className="h-3.5 w-3.5"
                  strokeWidth={1.75}
                />

                Current session
              </span>
            </div>

            <ul className="space-y-4">
              {[
                {
                  action: 'Logged in',
                  item: user?.email || 'Current account',
                  time: 'Current session',
                },
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex gap-3 border-b border-white/[0.04] pb-4 last:border-0 last:pb-0"
                >
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gradient-to-r from-cyan-400 to-violet-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />

                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-zinc-300">
                      <span className="font-medium text-cyan-300/90">
                        {item.action}
                      </span>{' '}

                      <span className="text-white">
                        {item.item}
                      </span>
                    </p>

                    <p className="mt-0.5 text-xs text-zinc-600">
                      {item.time}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}