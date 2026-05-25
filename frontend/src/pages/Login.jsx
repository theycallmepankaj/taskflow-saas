import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Check,
  Loader2,
  Activity,
  CheckCircle2,
  Clock,
  TrendingUp,
  Users,
} from 'lucide-react'

import {
  selectAuthError,
  selectAuthHydrated,
  selectAuthLoading,
  selectAuthToken,
  selectAuthUser,
  useAuthStore,
} from '../store'
import { validateLoginForm } from '../utils/validateLogin'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()

  const login = useAuthStore((state) => state.login)
  const clearError = useAuthStore((state) => state.clearError)
  const isLoading = useAuthStore(selectAuthLoading)
  const storeError = useAuthStore(selectAuthError)
  const token = useAuthStore(selectAuthToken)
  const user = useAuthStore(selectAuthUser)
  const hasHydrated = useAuthStore(selectAuthHydrated)

  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  
  // Showcase dashboard state loop for task completion animation
  const [showcaseStep, setShowcaseStep] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setShowcaseStep((prev) => (prev + 1) % 3)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (hasHydrated && token && user) {
      const dest = location.state?.from || (user.role === 'admin' ? '/admin/dashboard' : '/tasker/dashboard')
      navigate(dest, { replace: true })
    }
  }, [hasHydrated, token, user, navigate, location])

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
      const dest = location.state?.from || (data.user?.role === 'admin' ? '/admin/dashboard' : '/tasker/dashboard')
      navigate(dest, { replace: true })
    } catch {
      const message = useAuthStore.getState().error ?? 'Login failed. Check your credentials.'
      toast.error(message)
    }
  }

  // Animation variants
  const formContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const formItemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 260, damping: 25 },
    },
  }

  return (
    <div className="min-h-screen w-full bg-[#030305] text-zinc-100 selection:bg-cyan-500/30 selection:text-cyan-200 overflow-hidden font-['Inter',system-ui,sans-serif] lg:grid lg:grid-cols-12">
      {/* Background decoration elements for Mobile/Tablet overlay, and left pane container */}
      <div className="absolute inset-0 pointer-events-none z-0 lg:hidden">
        <div className="absolute -left-20 top-[15%] h-[350px] w-[350px] rounded-full bg-cyan-500/[0.12] blur-[100px]" />
        <div className="absolute -right-20 bottom-[10%] h-[300px] w-[300px] rounded-full bg-indigo-600/[0.08] blur-[90px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.06),transparent_50%)]" />
      </div>

      {/* Left Column: Form Section */}
      <div className="relative col-span-12 lg:col-span-5 flex flex-col justify-between min-h-screen p-6 sm:p-10 z-10 bg-[#040407]/40 backdrop-blur-xl border-r border-white/[0.03]">
        {/* Floating gradient orbs inside the form panel (only visible on desktop for subtle effect) */}
        <div className="hidden lg:block absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <motion.div
            animate={{
              x: [0, 20, -15, 0],
              y: [0, -30, 15, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -left-32 top-1/4 h-[350px] w-[350px] rounded-full bg-cyan-500/[0.06] blur-[90px]"
          />
          <motion.div
            animate={{
              x: [0, -25, 20, 0],
              y: [0, 35, -20, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -right-24 bottom-1/4 h-[300px] w-[300px] rounded-full bg-violet-600/[0.05] blur-[80px]"
          />
        </div>

        {/* Logo/Header */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/25 bg-gradient-to-br from-cyan-400/20 to-cyan-400/5 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
            <Sparkles className="h-4.5 w-4.5 text-cyan-300 animate-pulse" />
          </div>
          <span className="font-semibold text-lg tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            TaskFlow
          </span>
        </div>

        {/* Center: Form Container */}
        <div className="my-auto w-full max-w-[400px] mx-auto py-8">
          <motion.div
            variants={formContainerVariants}
            initial="hidden"
            animate="visible"
            className="w-full"
          >
            <header className="flex flex-col gap-2.5 text-left mb-8">
              <motion.p
                variants={formItemVariants}
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400/90"
              >
                Welcome back
              </motion.p>
              <motion.h1
                variants={formItemVariants}
                className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
              >
                Sign In
              </motion.h1>
              <motion.p variants={formItemVariants} className="text-sm text-zinc-400">
                Access your dashboard and manage your tasks.
              </motion.p>
            </header>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
              <motion.div variants={formItemVariants} className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-xs font-semibold uppercase tracking-wider text-zinc-400"
                >
                  Email Address
                </label>
                <div className="relative group">
                  <Mail
                    className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 transition-colors duration-200 group-focus-within:text-cyan-400"
                    strokeWidth={2}
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
                    placeholder="name@example.com"
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                    className={`w-full rounded-xl border border-white/[0.08] bg-white/[0.02] py-3 pl-11 pr-4 text-sm text-white placeholder:text-zinc-600 outline-none transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.04] focus:border-cyan-400/40 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(34,211,238,0.1),0_0_20px_rgba(34,211,238,0.05)] disabled:cursor-not-allowed disabled:opacity-60 ${
                      fieldErrors.email ? 'border-red-400/30 focus:border-red-400/40' : ''
                    }`}
                  />
                </div>
                {fieldErrors.email && (
                  <p id="email-error" role="alert" className="text-xs text-red-400 mt-1">
                    {fieldErrors.email}
                  </p>
                )}
              </motion.div>

              <motion.div variants={formItemVariants} className="flex flex-col gap-2">
                <label
                  htmlFor="password"
                  className="text-xs font-semibold uppercase tracking-wider text-zinc-400"
                >
                  Password
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 transition-colors duration-200 group-focus-within:text-cyan-400"
                    strokeWidth={2}
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
                    placeholder="••••••••"
                    aria-invalid={Boolean(fieldErrors.password)}
                    aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                    className={`w-full rounded-xl border border-white/[0.08] bg-white/[0.02] py-3 pl-11 pr-11 text-sm text-white placeholder:text-zinc-600 outline-none transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.04] focus:border-cyan-400/40 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(34,211,238,0.1),0_0_20px_rgba(34,211,238,0.05)] disabled:cursor-not-allowed disabled:opacity-60 ${
                      fieldErrors.password ? 'border-red-400/30 focus:border-red-400/40' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    disabled={isLoading}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-zinc-500 transition-colors duration-200 hover:bg-white/[0.06] hover:text-zinc-200 disabled:opacity-50"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" strokeWidth={2} />
                    ) : (
                      <Eye className="h-4 w-4" strokeWidth={2} />
                    )}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p id="password-error" role="alert" className="text-xs text-red-400 mt-1">
                    {fieldErrors.password}
                  </p>
                )}
              </motion.div>

              <motion.div
                variants={formItemVariants}
                className="flex items-center justify-between mt-1"
              >
                <label className="flex cursor-pointer select-none items-center gap-2.5 group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                    className="peer sr-only"
                  />
                  <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.02] transition-all duration-200 peer-checked:border-cyan-400/50 peer-checked:bg-cyan-400/10 peer-focus-visible:ring-2 peer-focus-visible:ring-cyan-400/20 group-hover:border-white/15">
                    <Check
                      className={`h-3 w-3 text-cyan-300 transition-all duration-200 ${
                        rememberMe ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                      }`}
                      strokeWidth={3}
                    />
                  </span>
                  <span className="text-xs text-zinc-400 transition-colors duration-200 group-hover:text-zinc-300">
                    Keep me signed in
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-zinc-400 transition-colors duration-200 hover:text-cyan-300"
                >
                  Forgot password?
                </Link>
              </motion.div>

              {storeError && !isLoading && (
                <motion.p
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  role="alert"
                  className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-center text-xs text-red-300"
                >
                  {storeError}
                </motion.p>
              )}

              <motion.button
                variants={formItemVariants}
                whileHover={{ scale: 1.012 }}
                whileTap={{ scale: 0.988 }}
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-emerald-400 px-4 py-3.5 text-sm font-semibold text-[#01080b] shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_0_30px_rgba(34,211,238,0.25)] transition-all duration-300 hover:shadow-[0_1px_0_rgba(255,255,255,0.3)_inset,0_0_40px_rgba(34,211,238,0.35)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
              >
                {/* Glow effect on hover */}
                <span className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-[100%]" />
                <span className="relative flex items-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.5} />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign in to account</span>
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                        strokeWidth={2.5}
                      />
                    </>
                  )}
                </span>
              </motion.button>
            </form>

            <motion.p
              variants={formItemVariants}
              className="mt-8 text-center text-xs text-zinc-500"
            >
              Don't have an account yet?{' '}
              <Link
                to="/register"
                className="font-medium text-cyan-400 transition-colors duration-200 hover:text-cyan-300"
              >
                Create an account
              </Link>
            </motion.p>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-[11px] text-zinc-600 mt-6 border-t border-white/[0.03] pt-4">
          <span>&copy; {new Date().getFullYear()} TaskFlow Corp.</span>
          <span className="hover:text-zinc-400 cursor-pointer transition-colors duration-200">
            Privacy Policy
          </span>
        </div>
      </div>

      {/* Right Column: Visual Product Showcase */}
      <div className="hidden lg:flex lg:col-span-7 relative flex-col justify-center items-center px-16 overflow-hidden bg-[#020204]">
        {/* Background glow structures */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(34,211,238,0.12),transparent_65%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(99,102,241,0.08),transparent_55%)] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.02] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)] pointer-events-none" />

        {/* Floating background glowing items */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute right-12 top-16 bg-white/[0.01] border border-white/[0.04] p-4 rounded-2xl backdrop-blur-xl shadow-2xl flex items-center gap-3 z-10"
        >
          <div className="h-9 w-9 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
            <Activity className="h-4.5 w-4.5 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-semibold tracking-wider">
              Project Velocity
            </p>
            <p className="text-sm font-bold text-white flex items-center gap-1.5">
              +38% <span className="text-[10px] text-emerald-400 font-normal">this week</span>
            </p>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute left-10 bottom-16 bg-white/[0.01] border border-white/[0.04] p-4 rounded-2xl backdrop-blur-xl shadow-2xl flex items-center gap-3 z-10"
        >
          <div className="h-9 w-9 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
            <Users className="h-4.5 w-4.5 text-indigo-400" />
          </div>
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-semibold tracking-wider">
              Active Team
            </p>
            <div className="flex -space-x-1.5 mt-0.5">
              {['A', 'B', 'C', 'D'].map((char, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-full border border-[#020204] bg-zinc-800 text-[8px] font-bold flex items-center justify-center text-zinc-300"
                >
                  {char}
                </div>
              ))}
              <div className="w-5 h-5 rounded-full border border-[#020204] bg-cyan-950 text-[7px] font-bold flex items-center justify-center text-cyan-300">
                +12
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Browser Frame */}
        <div className="relative w-full max-w-[560px] aspect-[1.4] bg-white/[0.015] border border-white/[0.05] rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.8),0_0_80px_rgba(34,211,238,0.03)_inset] backdrop-blur-2xl overflow-hidden p-4 flex flex-col">
          {/* Header dots */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.04] shrink-0">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
            </div>
            <div className="h-4 px-6 rounded-md bg-white/[0.02] border border-white/[0.04] text-[9px] text-zinc-500 flex items-center justify-center font-mono tracking-wide">
              taskflow.app/workspace/board
            </div>
            <div className="w-10" /> {/* Spacer */}
          </div>

          {/* Kanban Board Mockup */}
          <div className="flex-1 grid grid-cols-2 gap-4 text-left select-none relative">
            {/* Column 1: In Progress */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  In Progress
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/[0.03] text-zinc-500 font-semibold">
                  {showcaseStep === 0 ? '2' : '1'}
                </span>
              </div>

              <div className="flex flex-col gap-3 overflow-hidden">
                <div className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl flex flex-col gap-2 hover:bg-white/[0.03] transition-colors duration-200">
                  <span className="text-[8px] font-bold text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded self-start border border-cyan-500/20">
                    Feature
                  </span>
                  <p className="text-xs font-semibold text-white">OAuth Integration</p>
                  <p className="text-[10px] text-zinc-500">Connect Google & Github auth</p>
                  <div className="flex items-center justify-between mt-1 pt-2 border-t border-white/[0.03]">
                    <div className="flex items-center gap-1.5 text-zinc-500">
                      <Clock className="h-3 w-3 text-cyan-400" />
                      <span className="text-[9px]">2 days left</span>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-zinc-800 text-[8px] font-bold flex items-center justify-center text-zinc-300">
                      M
                    </div>
                  </div>
                </div>

                {/* Animated Card: Moves from Column 1 (In Progress) to Column 2 (Done) */}
                <AnimatePresence mode="wait">
                  {showcaseStep === 0 && (
                    <motion.div
                      layoutId="animated-task-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 200, scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                      className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl flex flex-col gap-2"
                    >
                      <span className="text-[8px] font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded self-start border border-indigo-500/20">
                        Design
                      </span>
                      <p className="text-xs font-semibold text-white">Interactive Dashboard</p>
                      <p className="text-[10px] text-zinc-500">Figma mockup components</p>
                      <div className="flex items-center justify-between mt-1 pt-2 border-t border-white/[0.03]">
                        <div className="flex items-center gap-1.5 text-zinc-500">
                          <Clock className="h-3 w-3 text-indigo-400" />
                          <span className="text-[9px]">1 day left</span>
                        </div>
                        <div className="w-5 h-5 rounded-full bg-zinc-800 text-[8px] font-bold flex items-center justify-center text-zinc-300">
                          S
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Column 2: Done */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Completed
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/[0.03] text-zinc-500 font-semibold">
                  {showcaseStep === 0 ? '1' : '2'}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <div className="p-3 bg-white/[0.01] border border-white/[0.03]/50 rounded-xl flex flex-col gap-2 opacity-65">
                  <span className="text-[8px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded self-start border border-emerald-500/20">
                    Backend
                  </span>
                  <p className="text-xs font-semibold text-white line-through decoration-zinc-600">
                    Database Migrations
                  </p>
                  <div className="flex items-center justify-between mt-1 pt-2 border-t border-white/[0.02]">
                    <div className="flex items-center gap-1 text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" />
                      <span className="text-[9px] font-semibold">Done</span>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-zinc-800 text-[8px] font-bold flex items-center justify-center text-zinc-300">
                      A
                    </div>
                  </div>
                </div>

                {/* Animated Card lands here in Done column */}
                <AnimatePresence>
                  {showcaseStep >= 1 && (
                    <motion.div
                      layoutId="animated-task-card"
                      initial={{ opacity: 0, x: -200, scale: 0.95 }}
                      animate={{
                        opacity: showcaseStep === 1 ? 1 : 0.6,
                        x: 0,
                        scale: 1,
                        y: 0,
                      }}
                      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                      className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl flex flex-col gap-2 transition-all duration-300"
                    >
                      <span className="text-[8px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded self-start border border-emerald-500/20">
                        Design
                      </span>
                      <p
                        className={`text-xs font-semibold text-white transition-all duration-300 ${
                          showcaseStep === 2 ? 'line-through decoration-zinc-600' : ''
                        }`}
                      >
                        Interactive Dashboard
                      </p>
                      <div className="flex items-center justify-between mt-1 pt-2 border-t border-white/[0.03]">
                        {showcaseStep === 1 ? (
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex items-center gap-1.5 text-cyan-400"
                          >
                            <Loader2 className="h-3 w-3 animate-spin" />
                            <span className="text-[9px]">Completing...</span>
                          </motion.div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" />
                            <span className="text-[9px] font-semibold">Done</span>
                          </div>
                        )}
                        <div className="w-5 h-5 rounded-full bg-zinc-800 text-[8px] font-bold flex items-center justify-center text-zinc-300">
                          S
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Showcase Text Carousel */}
        <div className="mt-12 text-center max-w-[420px] select-none min-h-[70px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={showcaseStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-2"
            >
              <h3 className="text-base font-bold text-white tracking-tight flex items-center justify-center gap-2">
                {showcaseStep === 0 && (
                  <>
                    <Activity className="h-4.5 w-4.5 text-cyan-400" /> Real-time Progress Tracking
                  </>
                )}
                {showcaseStep === 1 && (
                  <>
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" /> Collaborative Task Flow
                  </>
                )}
                {showcaseStep === 2 && (
                  <>
                    <TrendingUp className="h-4.5 w-4.5 text-indigo-400" /> Smart Analytics & Insights
                  </>
                )}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed px-4">
                {showcaseStep === 0 &&
                  'Watch project states update live. Stay in sync with your development lifecycle effortlessly.'}
                {showcaseStep === 1 &&
                  'Complete assignments, collaborate with team members, and get notified in milliseconds.'}
                {showcaseStep === 2 &&
                  'Track metrics, task completion velocities, and sprint achievements with high-fidelity analytics.'}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Dots Indicator */}
          <div className="flex gap-2 justify-center mt-4">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                onClick={() => setShowcaseStep(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  showcaseStep === idx ? 'w-4 bg-cyan-400' : 'w-1.5 bg-zinc-800'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
