import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Loader2,
  Shield,
  Plus,
  Play,
  CheckCircle2,
  Users,
  LineChart,
} from 'lucide-react'

import {
  selectAuthError,
  selectAuthHydrated,
  selectAuthLoading,
  selectAuthToken,
  selectAuthUser,
  useAuthStore,
} from '../store'
import { validateRegisterForm } from '../utils/validateRegister'

export default function Register() {
  const navigate = useNavigate()
  const location = useLocation()

  const register = useAuthStore((state) => state.register)
  const clearError = useAuthStore((state) => state.clearError)
  const isLoading = useAuthStore(selectAuthLoading)
  const storeError = useAuthStore(selectAuthError)
  const token = useAuthStore(selectAuthToken)
  const user = useAuthStore(selectAuthUser)
  const hasHydrated = useAuthStore(selectAuthHydrated)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('tasker')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  // Showcase state loop: Activity Feed simulation
  const [feedItems, setFeedItems] = useState([
    { id: 1, user: 'Alex Morgan', action: 'completed', task: 'Setup API Gateway', time: 'Just now' },
    { id: 2, user: 'Sarah Chen', action: 'started', task: 'UI Theme Refactor', time: '2m ago' },
    { id: 3, user: 'Michael Brown', action: 'created', task: 'Deploy backend server', time: '10m ago' },
  ])

  useEffect(() => {
    const timer = setInterval(() => {
      setFeedItems((prev) => {
        // Rotate items: take the last item and put it in front, updating its time
        const next = [...prev]
        const popped = next.pop()
        
        // Randomize task/user for variation in loop
        const users = ['Alex Morgan', 'Sarah Chen', 'Michael Brown', 'Emma Watson', 'James Smith']
        const tasks = [
          'Setup API Gateway',
          'UI Theme Refactor',
          'Deploy backend server',
          'Write integration tests',
          'Fix session validation bug',
          'Optimize image loading assets',
        ]
        const actions = ['completed', 'started', 'created']
        
        const randomUser = users[Math.floor(Math.random() * users.length)]
        const randomTask = tasks[Math.floor(Math.random() * tasks.length)]
        const randomAction = actions[Math.floor(Math.random() * actions.length)]

        const newItem = {
          id: Date.now(),
          user: randomUser,
          action: randomAction,
          task: randomTask,
          time: 'Just now',
        }

        // Update the time of other items
        const updatedPrev = next.map((item, idx) => ({
          ...item,
          time: idx === 0 ? '1m ago' : '5m ago',
        }))

        return [newItem, popped, ...updatedPrev].slice(0, 3)
      })
    }, 4500)
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
      const data = await register({ name, email, password, role })
      toast.success(`Account created${data.user?.name ? `, ${data.user.name}` : ''}!`)
      const dest = location.state?.from || (data.user?.role === 'admin' ? '/admin/dashboard' : '/tasker/dashboard')
      navigate(dest, { replace: true })
    } catch {
      const message =
        useAuthStore.getState().error ?? 'Registration failed. Please try again.'
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
    <div className="min-h-screen w-full bg-[#030305] text-zinc-100 selection:bg-violet-500/30 selection:text-violet-200 overflow-hidden font-['Inter',system-ui,sans-serif] lg:grid lg:grid-cols-12">
      {/* Background decoration elements for Mobile/Tablet overlay, and left pane container */}
      <div className="absolute inset-0 pointer-events-none z-0 lg:hidden">
        <div className="absolute -left-20 top-[12%] h-[350px] w-[350px] rounded-full bg-violet-600/[0.12] blur-[100px]" />
        <div className="absolute -right-20 bottom-[8%] h-[300px] w-[300px] rounded-full bg-fuchsia-600/[0.08] blur-[90px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.06),transparent_50%)]" />
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
              duration: 16,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -left-32 top-1/4 h-[350px] w-[350px] rounded-full bg-violet-500/[0.06] blur-[90px]"
          />
          <motion.div
            animate={{
              x: [0, -25, 20, 0],
              y: [0, 35, -20, 0],
            }}
            transition={{
              duration: 19,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -right-24 bottom-1/4 h-[300px] w-[300px] rounded-full bg-fuchsia-600/[0.05] blur-[80px]"
          />
        </div>

        {/* Logo/Header */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-400/25 bg-gradient-to-br from-violet-400/20 to-violet-400/5 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
            <Sparkles className="h-4.5 w-4.5 text-violet-300 animate-pulse" />
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
            <header className="flex flex-col gap-2.5 text-left mb-6">
              <motion.p
                variants={formItemVariants}
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400/90"
              >
                Get started
              </motion.p>
              <motion.h1
                variants={formItemVariants}
                className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
              >
                Create Account
              </motion.h1>
              <motion.p variants={formItemVariants} className="text-sm text-zinc-400">
                Setup your credentials and start organizing today.
              </motion.p>
            </header>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              {/* Full Name */}
              <motion.div variants={formItemVariants} className="flex flex-col gap-1.5">
                <label
                  htmlFor="name"
                  className="text-xs font-semibold uppercase tracking-wider text-zinc-400"
                >
                  Full Name
                </label>
                <div className="relative group">
                  <User
                    className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 transition-colors duration-200 group-focus-within:text-violet-400"
                    strokeWidth={2}
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
                    placeholder="John Doe"
                    aria-invalid={Boolean(fieldErrors.name)}
                    aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                    className={`w-full rounded-xl border border-white/[0.08] bg-white/[0.02] py-3 pl-11 pr-4 text-sm text-white placeholder:text-zinc-600 outline-none transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.04] focus:border-violet-400/40 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1),0_0_20px_rgba(139,92,246,0.05)] disabled:cursor-not-allowed disabled:opacity-60 ${
                      fieldErrors.name ? 'border-red-400/30 focus:border-red-400/40' : ''
                    }`}
                  />
                </div>
                {fieldErrors.name && (
                  <p id="name-error" role="alert" className="text-xs text-red-400 mt-1">
                    {fieldErrors.name}
                  </p>
                )}
              </motion.div>

              {/* Email Address */}
              <motion.div variants={formItemVariants} className="flex flex-col gap-1.5">
                <label
                  htmlFor="register-email"
                  className="text-xs font-semibold uppercase tracking-wider text-zinc-400"
                >
                  Email Address
                </label>
                <div className="relative group">
                  <Mail
                    className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 transition-colors duration-200 group-focus-within:text-violet-400"
                    strokeWidth={2}
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
                    placeholder="name@example.com"
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={fieldErrors.email ? 'register-email-error' : undefined}
                    className={`w-full rounded-xl border border-white/[0.08] bg-white/[0.02] py-3 pl-11 pr-4 text-sm text-white placeholder:text-zinc-600 outline-none transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.04] focus:border-violet-400/40 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1),0_0_20px_rgba(139,92,246,0.05)] disabled:cursor-not-allowed disabled:opacity-60 ${
                      fieldErrors.email ? 'border-red-400/30 focus:border-red-400/40' : ''
                    }`}
                  />
                </div>
                {fieldErrors.email && (
                  <p id="register-email-error" role="alert" className="text-xs text-red-400 mt-1">
                    {fieldErrors.email}
                  </p>
                )}
              </motion.div>

              {/* Custom Segmented Role Selector */}
              <motion.div variants={formItemVariants} className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Select Role
                </label>
                <div className="grid grid-cols-2 gap-3 relative mt-1">
                  {/* Tasker Button */}
                  <button
                    type="button"
                    onClick={() => setRole('tasker')}
                    disabled={isLoading}
                    className={`relative flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-300 outline-none cursor-pointer ${
                      role === 'tasker'
                        ? 'border-violet-500/40 text-white font-medium'
                        : 'border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.025] text-zinc-500'
                    }`}
                  >
                    {role === 'tasker' && (
                      <motion.div
                        layoutId="activeRoleBG"
                        className="absolute inset-0 bg-violet-500/[0.06] rounded-xl border border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.05)] pointer-events-none"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <User className={`h-4.5 w-4.5 shrink-0 z-10 ${role === 'tasker' ? 'text-violet-300' : 'text-zinc-500'}`} />
                    <div className="z-10">
                      <p className="text-xs font-bold leading-none">Tasker</p>
                      <p className="text-[9px] text-zinc-500 mt-1 leading-tight">Complete assignments</p>
                    </div>
                  </button>

                  {/* Admin Button */}
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    disabled={isLoading}
                    className={`relative flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-300 outline-none cursor-pointer ${
                      role === 'admin'
                        ? 'border-violet-500/40 text-white font-medium'
                        : 'border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.025] text-zinc-500'
                    }`}
                  >
                    {role === 'admin' && (
                      <motion.div
                        layoutId="activeRoleBG"
                        className="absolute inset-0 bg-violet-500/[0.06] rounded-xl border border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.05)] pointer-events-none"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <Shield className={`h-4.5 w-4.5 shrink-0 z-10 ${role === 'admin' ? 'text-violet-300' : 'text-zinc-500'}`} />
                    <div className="z-10">
                      <p className="text-xs font-bold leading-none">Admin</p>
                      <p className="text-[9px] text-zinc-500 mt-1 leading-tight">Manage workspaces</p>
                    </div>
                  </button>
                </div>
              </motion.div>

              {/* Password */}
              <motion.div variants={formItemVariants} className="flex flex-col gap-1.5">
                <label
                  htmlFor="register-password"
                  className="text-xs font-semibold uppercase tracking-wider text-zinc-400"
                >
                  Password
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 transition-colors duration-200 group-focus-within:text-violet-400"
                    strokeWidth={2}
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
                    placeholder="••••••••"
                    aria-invalid={Boolean(fieldErrors.password)}
                    aria-describedby={
                      fieldErrors.password ? 'register-password-error' : 'password-hint'
                    }
                    className={`w-full rounded-xl border border-white/[0.08] bg-white/[0.02] py-3 pl-11 pr-11 text-sm text-white placeholder:text-zinc-600 outline-none transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.04] focus:border-violet-400/40 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1),0_0_20px_rgba(139,92,246,0.05)] disabled:cursor-not-allowed disabled:opacity-60 ${
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
                {fieldErrors.password ? (
                  <p id="register-password-error" role="alert" className="text-xs text-red-400 mt-1">
                    {fieldErrors.password}
                  </p>
                ) : (
                  <p id="password-hint" className="text-[10px] text-zinc-600 mt-1">
                    Min 8 chars, uppercase, lowercase, and a number.
                  </p>
                )}
              </motion.div>

              {/* Confirm Password */}
              <motion.div variants={formItemVariants} className="flex flex-col gap-1.5">
                <label
                  htmlFor="confirm-password"
                  className="text-xs font-semibold uppercase tracking-wider text-zinc-400"
                >
                  Confirm Password
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 transition-colors duration-200 group-focus-within:text-violet-400"
                    strokeWidth={2}
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
                    placeholder="••••••••"
                    aria-invalid={Boolean(fieldErrors.confirmPassword)}
                    aria-describedby={
                      fieldErrors.confirmPassword ? 'confirm-password-error' : undefined
                    }
                    className={`w-full rounded-xl border border-white/[0.08] bg-white/[0.02] py-3 pl-11 pr-11 text-sm text-white placeholder:text-zinc-600 outline-none transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.04] focus:border-violet-400/40 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1),0_0_20px_rgba(139,92,246,0.05)] disabled:cursor-not-allowed disabled:opacity-60 ${
                      fieldErrors.confirmPassword ? 'border-red-400/30 focus:border-red-400/40' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    disabled={isLoading}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-zinc-500 transition-colors duration-200 hover:bg-white/[0.06] hover:text-zinc-200 disabled:opacity-50"
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? (
                      <EyeOff className="h-4 w-4" strokeWidth={2} />
                    ) : (
                      <Eye className="h-4 w-4" strokeWidth={2} />
                    )}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p id="confirm-password-error" role="alert" className="text-xs text-red-400 mt-1">
                    {fieldErrors.confirmPassword}
                  </p>
                )}
              </motion.div>

              {storeError && !isLoading && (
                <motion.p
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  role="alert"
                  className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-center text-xs text-red-300 mt-1"
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
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 via-violet-500 to-fuchsia-400 px-4 py-3.5 text-sm font-semibold text-white shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_0_30px_rgba(139,92,246,0.3)] transition-all duration-300 hover:shadow-[0_1px_0_rgba(255,255,255,0.3)_inset,0_0_40px_rgba(139,92,246,0.4)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 mt-3"
              >
                {/* Glow effect on hover */}
                <span className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-[100%]" />
                <span className="relative flex items-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.5} />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create free account</span>
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
              className="mt-6 text-center text-xs text-zinc-500"
            >
              Already have an account?{' '}
              <Link
                to="/"
                className="font-medium text-violet-400 transition-colors duration-200 hover:text-violet-300"
              >
                Sign in instead
              </Link>
            </motion.p>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-[11px] text-zinc-600 mt-6 border-t border-white/[0.03] pt-4">
          <span>&copy; {new Date().getFullYear()} TaskFlow Corp.</span>
          <span className="hover:text-zinc-400 cursor-pointer transition-colors duration-200">
            Terms of Service
          </span>
        </div>
      </div>

      {/* Right Column: Visual Product Showcase */}
      <div className="hidden lg:flex lg:col-span-7 relative flex-col justify-center items-center px-16 overflow-hidden bg-[#020204]">
        {/* Background glow structures */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(139,92,246,0.12),transparent_65%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(217,70,239,0.06),transparent_55%)] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.02] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)] pointer-events-none" />

        {/* Floating background metrics card */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-12 top-16 bg-white/[0.015] border border-white/[0.04] p-4 rounded-2xl backdrop-blur-xl shadow-2xl flex items-center gap-3.5 z-10"
        >
          <div className="h-9 w-9 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
            <LineChart className="h-4.5 w-4.5 text-violet-400" />
          </div>
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-semibold tracking-wider">
              Completion Rate
            </p>
            <p className="text-sm font-bold text-white flex items-center gap-1.5">
              98.4% <span className="text-[9px] text-emerald-400 font-normal">+1.2%</span>
            </p>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          className="absolute right-12 bottom-16 bg-white/[0.015] border border-white/[0.04] p-4 rounded-2xl backdrop-blur-xl shadow-2xl flex items-center gap-3.5 z-10"
        >
          <div className="h-9 w-9 rounded-xl bg-fuchsia-500/10 flex items-center justify-center border border-fuchsia-500/20">
            <Users className="h-4.5 w-4.5 text-fuchsia-400" />
          </div>
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-semibold tracking-wider">
              Workspaces Active
            </p>
            <p className="text-sm font-bold text-white">4 Teams Live</p>
          </div>
        </motion.div>

        {/* Dashboard Browser Frame: Collaborative Team activity feed */}
        <div className="relative w-full max-w-[500px] aspect-[1.25] bg-white/[0.015] border border-white/[0.05] rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.8),0_0_80px_rgba(139,92,246,0.03)_inset] backdrop-blur-2xl overflow-hidden p-5 flex flex-col gap-4">
          {/* Header dots */}
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.04] shrink-0">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
            </div>
            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
              Live Team Stream
            </div>
            <div className="w-10" />
          </div>

          {/* Collaborative Live Stream Feed with Animations */}
          <div className="flex-1 flex flex-col gap-3 justify-center">
            <AnimatePresence mode="popLayout">
              {feedItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 25 }}
                  className="flex items-start justify-between p-3.5 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.025] hover:border-white/[0.06] transition-colors duration-300"
                >
                  <div className="flex gap-3 items-center">
                    {/* User profile avatar placeholder */}
                    <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-500 text-[10px] font-bold text-white flex items-center justify-center">
                      {item.user.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-xs text-white">
                        <span className="font-semibold">{item.user}</span>
                        <span className="text-zinc-500 text-[11px] ml-1.5">
                          {item.action === 'completed' && 'completed task'}
                          {item.action === 'started' && 'started working on'}
                          {item.action === 'created' && 'assigned task'}
                        </span>
                      </p>
                      <p className="text-[11px] font-semibold text-violet-300 mt-0.5">
                        {item.task}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    {item.action === 'completed' ? (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" />
                      </span>
                    ) : item.action === 'started' ? (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                        <Play className="h-2.5 w-2.5 translate-x-[0.5px]" />
                      </span>
                    ) : (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400">
                        <Plus className="h-3 w-3" />
                      </span>
                    )}
                    <span className="text-[9px] text-zinc-600 font-medium">{item.time}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Small subtitle text */}
        <div className="mt-8 text-center max-w-[360px] select-none">
          <h4 className="text-sm font-bold text-white">Built for high-performing teams</h4>
          <p className="text-xs text-zinc-400 leading-relaxed mt-1.5">
            Create workflows, assign responsibilities, and analyze product release speeds collectively.
          </p>
        </div>
      </div>
    </div>
  )
}
