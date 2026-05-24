import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import {
  User,
  Mail,
  Lock,
  LogOut,
  Save,
  Loader2
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api'

const glassCard =
  'rounded-2xl border border-white/[0.08] bg-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md'

const inputClass =
  'w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-400/40 transition-colors'

export default function AdminSettings() {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)

  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [password, setPassword] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return

    setIsSaving(true)
    try {
      const { data } = await api.patch(`/admin/users/${user.id}`, {
        name: name.trim(),
        email: email.trim(),
        password: password || undefined
      })
      setUser(data)
      setPassword('')
      toast.success('Admin profile updated')
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to update profile'
      toast.error(errorMsg)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6 [&_h1]:m-0 [&_h2]:m-0">
      <header>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-400/80">
          Admin settings
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-white">
          System settings
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage your administrator profile details.
        </p>
      </header>

      <div className={`${glassCard} p-6 sm:p-8 max-w-xl`}>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-300">
            <User className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-white">
              Profile details
            </h2>
            <p className="text-sm text-zinc-500">
              Update credentials and account attributes.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              disabled={isSaving}
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${inputClass} pl-10`}
                disabled={isSaving}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
              New Password (leave blank to keep current)
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`${inputClass} pl-10`}
                disabled={isSaving}
              />
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              disabled={isSaving || !name.trim() || !email.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 px-5 py-2.5 text-sm font-semibold text-[#041014] disabled:opacity-60 transition-all hover:scale-[1.02]"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save updates
            </button>
          </div>
        </form>

        <div className="mt-8 border-t border-white/[0.08] pt-6">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-sm font-medium text-red-300 transition-all hover:bg-red-500/20"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
