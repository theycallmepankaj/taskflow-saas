import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

import {
  User,
  Mail,
  LogOut,
} from 'lucide-react'

const glassCard =
  'rounded-2xl border border-white/[0.08] bg-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md'

const inputClass =
  'w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none'

export default function Settings() {
  const navigate = useNavigate()

  const logout = useAuthStore((state) => state.logout)
  const user = useAuthStore((state) => state.user)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-400/80">
          Account
        </p>

        <h1 className="mt-1 text-2xl font-semibold text-white">
          Settings
        </h1>

        <p className="mt-1 text-sm text-zinc-500">
          Manage your account information.
        </p>
      </header>

      <div className={`${glassCard} p-6 sm:p-8`}>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-300">
            <User className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-white">
              Profile Information
            </h2>

            <p className="text-sm text-zinc-500">
              Current logged in user details
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
              Full Name
            </label>

            <input
              type="text"
              value={user?.name || ''}
              readOnly
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
              Email Address
            </label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

              <input
                type="email"
                value={user?.email || ''}
                readOnly
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/[0.08] pt-6">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 rounded-xl border border-orange-500/30 bg-orange-500/10 px-5 py-3 text-sm font-medium text-orange-300 transition-all hover:bg-orange-500/20"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}