import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  Briefcase,
  CheckCircle,
  ArrowUpRight,
  Calendar,
  AlertCircle
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import toast from 'react-hot-toast'
import api from '../../api'

const glassCard =
  'rounded-2xl border border-white/[0.08] bg-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const COLORS = ['#a78bfa', '#fb7185', '#22d3ee'] // Purple, Rose, Cyan

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const { data } = await api.get('/admin/stats')
        setStats(data)
      } catch {
        toast.error('Failed to load admin stats')
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

  if (!stats) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center gap-3">
        <AlertCircle className="h-10 w-10 text-red-400" />
        <p className="text-zinc-400">Failed to load statistics.</p>
      </div>
    )
  }

  const statCards = [
    {
      label: 'Total users',
      value: stats.total_users,
      change: 'Active users',
      icon: Users,
      accent: 'cyan',
    },
    {
      label: 'Active taskers',
      value: stats.total_taskers,
      change: 'Role: tasker',
      icon: Users,
      accent: 'violet',
    },
    {
      label: 'System tasks',
      value: stats.total_tasks,
      change: 'All assignments',
      icon: Briefcase,
      accent: 'cyan',
    },
    {
      label: 'Completed tasks',
      value: stats.completed_tasks,
      change: `${stats.total_tasks ? Math.round((stats.completed_tasks / stats.total_tasks) * 100) : 0}% rate`,
      icon: CheckCircle,
      accent: 'violet',
    },
  ]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 sm:space-y-8"
    >
      <motion.div
        variants={itemVariants}
        className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-400/80">
            Admin space
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Admin console
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            System health, user base activity, and task trends.
          </p>
        </div>

        <div className="mt-2 flex items-center gap-2 text-sm text-zinc-500 sm:mt-0">
          <Calendar className="h-4 w-4 text-cyan-400/80" strokeWidth={1.75} />
          <span>Real-time admin metrics</span>
        </div>
      </motion.div>

      {/* Stats grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {statCards.map((card, idx) => {
          const Icon = card.icon
          const isCyan = card.accent === 'cyan'
          return (
            <motion.div
              key={idx}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`${glassCard} group relative overflow-hidden p-5 sm:p-6`}
            >
              <div
                aria-hidden
                className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl transition-opacity duration-300 group-hover:opacity-100 ${
                  isCyan ? 'bg-cyan-500/15 opacity-60' : 'bg-violet-500/15 opacity-60'
                }`}
              />

              <div className="relative flex items-start justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                    isCyan
                      ? 'border-cyan-400/25 bg-cyan-400/10 text-cyan-300'
                      : 'border-violet-400/25 bg-violet-400/10 text-violet-300'
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-medium ${isCyan ? 'text-cyan-400' : 'text-violet-400'}`}>
                  {card.change}
                  <ArrowUpRight className="h-3 w-3" strokeWidth={2} />
                </span>
              </div>

              <p className="relative mt-4 text-2xl font-semibold tracking-tight text-white">
                {card.value}
              </p>
              <p className="relative mt-1 text-sm text-zinc-500">{card.label}</p>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Charts grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        {/* Activity trend */}
        <div className={`${glassCard} p-5 sm:p-6 lg:col-span-2`}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-semibold text-white">Task creation vs completion</h2>
              <p className="mt-0.5 text-xs text-zinc-500">Last 7 days overview</p>
            </div>
            <span className="rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-xs font-medium text-cyan-300">
              Active assignments
            </span>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.task_activity}>
                <defs>
                  <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#a78bfa" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#71717a', fontSize: 12 }}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null
                    return (
                      <div className="rounded-lg border border-white/10 bg-[#0c0c12]/95 px-3 py-2 shadow-xl backdrop-blur-md space-y-1">
                        <p className="text-xs text-zinc-500">{payload[0].payload.label}</p>
                        <p className="text-xs text-violet-300">Created: <span className="font-semibold">{payload[0].value}</span></p>
                        <p className="text-xs text-cyan-300">Completed: <span className="font-semibold">{payload[1].value}</span></p>
                      </div>
                    )
                  }}
                />
                <Area type="monotone" dataKey="created" stroke="#a78bfa" strokeWidth={2} fillOpacity={1} fill="url(#colorCreated)" />
                <Area type="monotone" dataKey="completed" stroke="#22d3ee" strokeWidth={2} fillOpacity={1} fill="url(#colorCompleted)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task status breakdown */}
        <div className={`${glassCard} p-5 sm:p-6 flex flex-col justify-between`}>
          <div>
            <h2 className="text-base font-semibold text-white">Task statuses</h2>
            <p className="mt-0.5 text-xs text-zinc-500">Distribution breakdown</p>
          </div>

          <div className="h-[220px] w-full flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.status_breakdown.filter(item => item.value > 0)}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.status_breakdown.filter(item => item.value > 0).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null
                    return (
                      <div className="rounded-lg border border-white/10 bg-[#0c0c12]/95 px-3 py-2 shadow-xl backdrop-blur-md">
                        <p className="text-xs text-white font-medium">{payload[0].name}</p>
                        <p className="text-sm font-semibold text-cyan-300">{payload[0].value} tasks</p>
                      </div>
                    )
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            {stats.status_breakdown.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  {item.name}
                </span>
                <span className="mt-1 font-semibold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
