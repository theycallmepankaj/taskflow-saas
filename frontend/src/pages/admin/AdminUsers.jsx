/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Mail,
  Shield,
  Clock,
  Search
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api'

const glassCard =
  'rounded-2xl border border-white/[0.08] bg-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md'

const inputClass =
  'w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none transition-all duration-200 hover:border-white/[0.12] focus:border-cyan-400/40 focus:shadow-[0_0_0_3px_rgba(34,211,238,0.1)]'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [modal, setModal] = useState({ open: false, mode: 'create', user: null })
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  // Form states
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('tasker')

  async function loadUsers() {
    try {
      const { data } = await api.get('/admin/users')
      setUsers(data)
    } catch {
      toast.error('Failed to load users list')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const openCreateModal = () => {
    setName('')
    setEmail('')
    setPassword('')
    setRole('tasker')
    setModal({ open: true, mode: 'create', user: null })
  }

  const openEditModal = (user) => {
    setName(user.name)
    setEmail(user.email)
    setPassword('')
    setRole(user.role)
    setModal({ open: true, mode: 'edit', user })
  }

  const closeModal = () => {
    setModal({ open: false, mode: 'create', user: null })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return

    setIsSaving(true)
    try {
      if (modal.mode === 'create') {
        if (!password) {
          toast.error('Password is required for new users')
          setIsSaving(false)
          return
        }
        await api.post('/admin/users', {
          name: name.trim(),
          email: email.trim(),
          password,
          role
        })
        toast.success('User created successfully')
      } else {
        await api.patch(`/admin/users/${modal.user.id}`, {
          name: name.trim(),
          email: email.trim(),
          password: password || undefined,
          role
        })
        toast.success('User details updated')
      }
      loadUsers()
      closeModal()
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to save user'
      toast.error(errorMsg)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (user) => {
    if (!window.confirm(`Are you sure you want to delete user "${user.name}"? All tasks assigned to this user will be unassigned.`)) {
      return
    }

    setDeletingId(user.id)
    try {
      await api.delete(`/admin/users/${user.id}`)
      toast.success('User deleted')
      loadUsers()
    } catch {
      toast.error('Failed to delete user')
    } finally {
      setDeletingId(null)
    }
  }

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6 [&_h1]:m-0 [&_h2]:m-0">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-400/80">
            System administration
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            User management
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Create, update, and manage access roles for workspace users.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 px-4 py-2.5 text-sm font-semibold text-[#041014] shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-transform hover:scale-[1.02]"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Create user
        </button>
      </header>

      {/* Filter and Search */}
      <div className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" strokeWidth={1.75} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, email or role..."
          className={`${inputClass} pl-11`}
        />
      </div>

      {isLoading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <span className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-400" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className={`${glassCard} flex flex-col items-center justify-center p-12 text-center text-zinc-500`}>
          <Users className="h-12 w-12 text-zinc-600 mb-4" />
          <p className="font-medium text-white">No users found</p>
          <p className="text-xs mt-1">Try a different search query or create a new user profile.</p>
        </div>
      ) : (
        <div className="overflow-x-auto pb-4">
          <table className="w-full min-w-[700px] border-collapse text-left">
            <thead>
              <tr className="border-b border-white/[0.06] text-xs font-semibold uppercase tracking-wider text-zinc-500">
                <th className="py-4 px-4">User name</th>
                <th className="py-4 px-4">Email</th>
                <th className="py-4 px-4">Role</th>
                <th className="py-4 px-4">Registered at</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-white/[0.04] text-sm text-zinc-300 hover:bg-white/[0.01] transition-colors"
                >
                  <td className="py-4 px-4 font-medium text-white flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400/30 to-violet-500/30 text-xs font-semibold text-white">
                      {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </span>
                    {user.name}
                  </td>
                  <td className="py-4 px-4">
                    <span className="flex items-center gap-2 text-zinc-400">
                      <Mail className="h-3.5 w-3.5" />
                      {user.email}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium uppercase tracking-wide ${
                      user.role === 'admin'
                        ? 'border-violet-400/30 bg-violet-400/10 text-violet-300'
                        : 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300'
                    }`}>
                      <Shield className="h-3 w-3" />
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="flex items-center gap-2 text-zinc-500 text-xs">
                      <Clock className="h-3.5 w-3.5" />
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditModal(user)}
                        className="rounded-lg p-2 text-zinc-500 hover:bg-white/[0.06] hover:text-cyan-300 transition-colors"
                        title="Edit user details"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(user)}
                        disabled={deletingId === user.id}
                        className="rounded-lg p-2 text-zinc-500 hover:bg-red-400/10 hover:text-red-300 disabled:opacity-50 transition-colors"
                        title="Delete user"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal overlay */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
            aria-label="Close modal"
          />
          <div
            role="dialog"
            aria-modal="true"
            className={`relative w-full max-w-md ${glassCard} p-6 shadow-[0_24px_80px_rgba(0,0,0,0.6)] animate-fade-in`}
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-cyan-400/80">
                  {modal.mode === 'edit' ? 'Edit User Profile' : 'New User Account'}
                </p>
                <h2 className="mt-1 text-lg font-semibold text-white">
                  {modal.mode === 'edit' ? 'Update Details' : 'Add System Member'}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Full name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className={inputClass}
                  disabled={isSaving}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. alex@taskflow.app"
                  className={inputClass}
                  disabled={isSaving}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                  {modal.mode === 'edit' ? 'Password (leave blank to keep current)' : 'Password'}
                </label>
                <input
                  type="password"
                  required={modal.mode === 'create'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputClass}
                  disabled={isSaving}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={`${inputClass} bg-[#09090e]`}
                  disabled={isSaving}
                >
                  <option value="tasker">Tasker</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSaving || !name.trim() || !email.trim()}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 py-2.5 text-sm font-semibold text-[#041014] disabled:cursor-not-allowed disabled:opacity-60 shadow-lg"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving…
                    </>
                  ) : modal.mode === 'edit' ? (
                    'Save changes'
                  ) : (
                    'Create user'
                  )}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSaving}
                  className="rounded-xl border border-white/[0.08] px-4 py-2.5 text-sm text-zinc-400 hover:bg-white/[0.04] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
