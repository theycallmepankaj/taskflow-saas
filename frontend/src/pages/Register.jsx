import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Loader2,
} from 'lucide-react'

import {
  selectAuthError,
  selectAuthHydrated,
  selectAuthLoading,
  selectAuthToken,
  useAuthStore,
} from '../store'
import { validateRegisterForm } from '../utils/validateRegister'

const inputClass =
  'w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.05] focus:border-violet-400/45 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(167,139,250,0.14),0_0_20px_rgba(139,92,246,0.1)] disabled:cursor-not-allowed disabled:opacity-60'

const inputErrorClass = 'border-red-400/40 focus:border-red-400/50'

export default function Register() {
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/dashboard'

  const register = useAuthStore((state) => state.register)
  const clearError = useAuthStore((state) => state.clearError)
  const isLoading = useAuthStore(selectAuthLoading)
  const storeError = useAuthStore(selectAuthError)
  const token = useAuthStore(selectAuthToken)
  const hasHydrated = useAuthStore(selectAuthHydrated)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    if (hasHydrated && token) {
      navigate(redirectTo, { replace: true })
    }
  }, [hasHydrated, token, navigate, redirectTo])

  const clearFieldError = (field) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
    if (storeError) clearError()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errors = validateRegisterForm({ name, email, password, confirmPassword })
    setFieldErrors(errors)

    if (Object.keys(errors).length > 0) {
      const firstMessage =
        errors.name ?? errors.email ?? errors.password ?? errors.confirmPassword
      toast.error(firstMessage)
      return
    }

    clearError()

    try {
      const data = await register({ name, email, password })
      toast.success(`Account created${data.user?.name ? `, ${data.user.name}` : ''}!`)
      navigate(redirectTo, { replace: true })
    } catch {
      const message =
        useAuthStore.getState().error ?? 'Registration failed. Please try again.'
      toast.error(message)
    }
  }

  return (
    <div className="register-page flex min-h-dvh w-full flex-col items-center justify-center bg-[#050508] px-4 py-8 font-['Inter',system-ui,sans-serif] antialiased sm:px-6 sm:py-10 [&_h1]:m-0 [&_h1]:font-semibold [&_h1]:leading-tight [&_h1]:text-white [&_p]:m-0">
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-[12%] h-[480px] w-[480px] rounded-full bg-violet-600/[0.2] blur-[130px]" />
        <div className="absolute -right-32 bottom-[8%] h-[420px] w-[420px] rounded-full bg-fuchsia-600/[0.12] blur-[120px]" />
        <div className="absolute left-1/2 top-[-10%] h-[320px] w-[640px] -translate-x-1/2 rounded-full bg-violet-500/[0.1] blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,rgba(139,92,246,0.16),transparent_55%)]" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
      </div>

      <div className="relative z-10 flex w-full max-w-[480px] flex-col items-center">
        <div className="relative w-full animate-[fadeUp_0.6s_ease-out]">
          <div
            aria-hidden
            className="absolute -inset-px rounded-3xl bg-gradient-to-b from-violet-400/35 via-white/[0.06] to-transparent opacity-80 blur-[1px]"
          />

          <div className="group relative flex w-full min-h-0 flex-col overflow-hidden rounded-3xl border border-white/[0.09] bg-white/[0.045] px-6 py-9 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset,0_24px_80px_rgba(0,0,0,0.55),0_0_60px_rgba(139,92,246,0.08)] backdrop-blur-2xl transition-shadow duration-500 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset,0_28px_90px_rgba(0,0,0,0.6),0_0_80px_rgba(139,92,246,0.14)] sm:px-10 sm:py-11">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-violet-400/[0.14] blur-3xl transition-all duration-700 group-hover:bg-violet-400/22"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-fuchsia-500/[0.1] blur-2xl"
            />

            <header className="relative flex shrink-0 flex-col items-center gap-3 text-center">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-400/30 bg-gradient-to-br from-violet-400/25 to-violet-400/5 shadow-[0_0_32px_rgba(139,92,246,0.28)] transition-transform duration-300 group-hover:scale-[1.04]">
                <Sparkles className="h-[18px] w-[18px] text-violet-300" strokeWidth={1.75} />
              </div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-violet-400/80">
                TaskFlow
              </p>
              <h1 className="text-2xl tracking-[-0.02em] sm:text-[1.75rem]">
                Create your account
              </h1>
              <p className="max-w-[300px] text-sm leading-6 text-zinc-500">
                Start organizing work in minutes
              </p>
            </header>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="relative mt-7 flex w-full flex-col gap-4 sm:mt-9 sm:gap-5"
            >
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="name"
                  className="text-xs font-medium uppercase tracking-wider text-zinc-500"
                >
                  Name
                </label>
                <div className="group/field relative">
                  <User
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 transition-colors duration-200 group-focus-within/field:text-violet-400"
                    strokeWidth={1.75}
                  />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      clearFieldError('name')
                    }}
                    disabled={isLoading}
                    placeholder="Alex Morgan"
                    aria-invalid={Boolean(fieldErrors.name)}
                    aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                    className={`${inputClass} pl-11 pr-4 ${fieldErrors.name ? inputErrorClass : ''}`}
                  />
                </div>
                {fieldErrors.name && (
                  <p id="name-error" role="alert" className="text-xs text-red-400">
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="register-email"
                  className="text-xs font-medium uppercase tracking-wider text-zinc-500"
                >
                  Email
                </label>
                <div className="group/field relative">
                  <Mail
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 transition-colors duration-200 group-focus-within/field:text-violet-400"
                    strokeWidth={1.75}
                  />
                  <input
                    id="register-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      clearFieldError('email')
                    }}
                    disabled={isLoading}
                    placeholder="you@company.com"
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={fieldErrors.email ? 'register-email-error' : undefined}
                    className={`${inputClass} pl-11 pr-4 ${fieldErrors.email ? inputErrorClass : ''}`}
                  />
                </div>
                {fieldErrors.email && (
                  <p id="register-email-error" role="alert" className="text-xs text-red-400">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="register-password"
                  className="text-xs font-medium uppercase tracking-wider text-zinc-500"
                >
                  Password
                </label>
                <div className="group/field relative">
                  <Lock
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 transition-colors duration-200 group-focus-within/field:text-violet-400"
                    strokeWidth={1.75}
                  />
                  <input
                    id="register-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      clearFieldError('password')
                    }}
                    disabled={isLoading}
                    placeholder="Create a password"
                    aria-invalid={Boolean(fieldErrors.password)}
                    aria-describedby={
                      fieldErrors.password ? 'register-password-error' : 'password-hint'
                    }
                    className={`${inputClass} pl-11 pr-11 ${fieldErrors.password ? inputErrorClass : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-zinc-500 transition-colors duration-200 hover:bg-white/[0.06] hover:text-zinc-200 disabled:opacity-50"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" strokeWidth={1.75} />
                    ) : (
                      <Eye className="h-4 w-4" strokeWidth={1.75} />
                    )}
                  </button>
                </div>
                {fieldErrors.password ? (
                  <p id="register-password-error" role="alert" className="text-xs text-red-400">
                    {fieldErrors.password}
                  </p>
                ) : (
                  <p id="password-hint" className="text-xs text-zinc-600">
                    Min 8 characters with uppercase, lowercase, and a number
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="confirm-password"
                  className="text-xs font-medium uppercase tracking-wider text-zinc-500"
                >
                  Confirm password
                </label>
                <div className="group/field relative">
                  <Lock
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 transition-colors duration-200 group-focus-within/field:text-violet-400"
                    strokeWidth={1.75}
                  />
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      clearFieldError('confirmPassword')
                    }}
                    disabled={isLoading}
                    placeholder="Repeat your password"
                    aria-invalid={Boolean(fieldErrors.confirmPassword)}
                    aria-describedby={
                      fieldErrors.confirmPassword ? 'confirm-password-error' : undefined
                    }
                    className={`${inputClass} pl-11 pr-11 ${fieldErrors.confirmPassword ? inputErrorClass : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-zinc-500 transition-colors duration-200 hover:bg-white/[0.06] hover:text-zinc-200 disabled:opacity-50"
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? (
                      <EyeOff className="h-4 w-4" strokeWidth={1.75} />
                    ) : (
                      <Eye className="h-4 w-4" strokeWidth={1.75} />
                    )}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p id="confirm-password-error" role="alert" className="text-xs text-red-400">
                    {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>

              {storeError && !isLoading && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-400/25 bg-red-400/10 px-4 py-3 text-center text-sm text-red-300"
                >
                  {storeError}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="group/btn relative mt-1 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-violet-500 via-violet-400 to-fuchsia-400 px-4 py-3.5 text-sm font-semibold tracking-[-0.01em] text-white shadow-[0_1px_0_rgba(255,255,255,0.2)_inset,0_0_32px_rgba(139,92,246,0.45)] transition-all duration-300 hover:scale-[1.015] hover:shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_0_48px_rgba(139,92,246,0.6)] active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 sm:mt-2"
              >
                <span className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-500 group-hover/btn:translate-x-[100%]" />
                <span className="relative flex items-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} aria-hidden />
                      <span>Creating account…</span>
                    </>
                  ) : (
                    <>
                      Create account
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                        strokeWidth={2}
                      />
                    </>
                  )}
                </span>
              </button>
            </form>

            <p className="relative mt-7 text-center text-sm leading-6 text-zinc-600 sm:mt-9">
              Already have an account?{' '}
              <Link
                to="/"
                className="font-medium text-violet-400/90 transition-colors duration-200 hover:text-violet-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-6 shrink-0 text-center text-xs tracking-wide text-zinc-700">
          © {new Date().getFullYear()} TaskFlow
        </p>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
