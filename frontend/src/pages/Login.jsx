import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Check,
  Loader2,
} from 'lucide-react'

import {
  selectAuthError,
  selectAuthHydrated,
  selectAuthLoading,
  selectAuthToken,
  useAuthStore,
} from '../store'
import { validateLoginForm } from '../utils/validateLogin'

const inputClass =
  'w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.05] focus:border-cyan-400/45 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(34,211,238,0.14),0_0_20px_rgba(34,211,238,0.08)] disabled:cursor-not-allowed disabled:opacity-60'

const inputErrorClass = 'border-red-400/40 focus:border-red-400/50'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/dashboard'

  const login = useAuthStore((state) => state.login)
  const clearError = useAuthStore((state) => state.clearError)
  const isLoading = useAuthStore(selectAuthLoading)
  const storeError = useAuthStore(selectAuthError)
  const token = useAuthStore(selectAuthToken)
  const hasHydrated = useAuthStore(selectAuthHydrated)

  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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

    const errors = validateLoginForm({ email, password })
    setFieldErrors(errors)

    if (Object.keys(errors).length > 0) {
      const firstMessage = errors.email ?? errors.password
      toast.error(firstMessage)
      return
    }

    clearError()

    try {
      const data = await login({ email, password })
      toast.success(`Welcome back${data.user?.name ? `, ${data.user.name}` : ''}!`)
      navigate(redirectTo, { replace: true })
    } catch {
      const message = useAuthStore.getState().error ?? 'Login failed. Check your credentials.'
      toast.error(message)
    }
  }

  return (
    <div
      className="login-page flex min-h-dvh w-full flex-col items-center justify-center bg-[#050508] px-4 py-8 font-['Inter',system-ui,sans-serif] antialiased sm:px-6 sm:py-10 [&_h1]:m-0 [&_h1]:font-semibold [&_h1]:leading-tight [&_h1]:text-white [&_p]:m-0"
    >
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-[15%] h-[480px] w-[480px] rounded-full bg-cyan-500/[0.18] blur-[130px]" />
        <div className="absolute -right-32 bottom-[10%] h-[420px] w-[420px] rounded-full bg-indigo-600/[0.14] blur-[120px]" />
        <div className="absolute left-1/2 top-[-10%] h-[320px] w-[640px] -translate-x-1/2 rounded-full bg-cyan-400/[0.08] blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,rgba(34,211,238,0.14),transparent_55%)]" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
      </div>

      <div className="relative z-10 flex w-full max-w-[480px] flex-col items-center">
        <div className="relative w-full animate-[fadeUp_0.6s_ease-out]">
          <div
            aria-hidden
            className="absolute -inset-px rounded-3xl bg-gradient-to-b from-cyan-400/30 via-white/[0.06] to-transparent opacity-80 blur-[1px]"
          />

          <div className="group relative flex w-full flex-col overflow-hidden rounded-3xl border border-white/[0.09] bg-white/[0.045] px-6 py-8 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset,0_24px_80px_rgba(0,0,0,0.55),0_0_60px_rgba(34,211,238,0.06)] backdrop-blur-2xl transition-shadow duration-500 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset,0_28px_90px_rgba(0,0,0,0.6),0_0_80px_rgba(34,211,238,0.1)] sm:px-10 sm:py-10">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-cyan-400/[0.12] blur-3xl transition-all duration-700 group-hover:bg-cyan-400/20"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-violet-500/[0.08] blur-2xl"
            />

            <header className="relative flex flex-col items-center gap-3 text-center">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/25 bg-gradient-to-br from-cyan-400/20 to-cyan-400/5 shadow-[0_0_32px_rgba(34,211,238,0.22)] transition-transform duration-300 group-hover:scale-[1.04]">
                <Sparkles className="h-[18px] w-[18px] text-cyan-300" strokeWidth={1.75} />
              </div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-400/80">
                TaskFlow
              </p>
              <h1 className="text-2xl tracking-[-0.02em] sm:text-[1.75rem]">Welcome back</h1>
              <p className="max-w-[280px] text-sm leading-6 text-zinc-500">
                Sign in to your workspace
              </p>
            </header>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="relative mt-8 flex w-full flex-col gap-5 sm:mt-10 sm:gap-6"
            >
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-xs font-medium uppercase tracking-wider text-zinc-500"
                >
                  Email
                </label>
                <div className="group/field relative">
                  <Mail
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 transition-colors duration-200 group-focus-within/field:text-cyan-400"
                    strokeWidth={1.75}
                  />
                  <input
                    id="email"
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
                    aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                    className={`${inputClass} pl-11 pr-4 ${fieldErrors.email ? inputErrorClass : ''}`}
                  />
                </div>
                {fieldErrors.email && (
                  <p id="email-error" role="alert" className="text-xs text-red-400">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="password"
                  className="text-xs font-medium uppercase tracking-wider text-zinc-500"
                >
                  Password
                </label>
                <div className="group/field relative">
                  <Lock
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 transition-colors duration-200 group-focus-within/field:text-cyan-400"
                    strokeWidth={1.75}
                  />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      clearFieldError('password')
                    }}
                    disabled={isLoading}
                    placeholder="Enter your password"
                    aria-invalid={Boolean(fieldErrors.password)}
                    aria-describedby={fieldErrors.password ? 'password-error' : undefined}
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
                {fieldErrors.password && (
                  <p id="password-error" role="alert" className="text-xs text-red-400">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <label className="group/check flex cursor-pointer select-none items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                    className="peer sr-only"
                  />
                  <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border border-white/10 bg-white/[0.03] transition-all duration-200 peer-checked:border-cyan-400/55 peer-checked:bg-cyan-400/15 peer-focus-visible:ring-2 peer-focus-visible:ring-cyan-400/25 group-hover/check:border-white/18">
                    <Check
                      className={`h-3 w-3 text-cyan-300 transition-all duration-200 ${
                        rememberMe ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                      }`}
                      strokeWidth={2.5}
                    />
                  </span>
                  <span className="text-sm leading-none text-zinc-500 transition-colors duration-200 group-hover/check:text-zinc-400">
                    Remember me
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="shrink-0 text-sm leading-none text-zinc-500 transition-colors duration-200 hover:text-cyan-300 sm:text-right"
                >
                  Forgot password?
                </Link>
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
                className="group/btn relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-300 to-emerald-300 px-4 py-3.5 text-sm font-semibold tracking-[-0.01em] text-[#030a0c] shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_0_32px_rgba(34,211,238,0.38)] transition-all duration-300 hover:scale-[1.015] hover:shadow-[0_1px_0_rgba(255,255,255,0.3)_inset,0_0_48px_rgba(34,211,238,0.55)] active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
              >
                <span className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 group-hover/btn:translate-x-[100%]" />
                <span className="relative flex items-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} aria-hidden />
                      <span>Signing in…</span>
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                        strokeWidth={2}
                      />
                    </>
                  )}
                </span>
              </button>
            </form>

            <p className="relative mt-8 text-center text-sm leading-6 text-zinc-600 sm:mt-10">
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-cyan-400/90 transition-colors duration-200 hover:text-cyan-300"
              >
                Create one
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
