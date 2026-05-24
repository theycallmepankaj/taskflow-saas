import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts'
import {
  TrendingUp,
  Zap,
  Target,
  BarChart3,
  ArrowUpRight,
  CalendarDays,
  AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api'

const glassCard =
  'rounded-2xl border border-white/[0.08] bg-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md'

const PIE_COLORS = ['#22d3ee', '#a78bfa', '#fb7185']

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const { data } = await api.get('/admin/stats')
        setStats(data)
      } catch {
        toast.error('Failed to load admin metrics')
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
        <p className="text-zinc-400">Failed to load analytics details.</p>
      </div>
    )
  }

  const productivityStats = [
    {
      label: 'Total users',
      value: stats.total_users,
      change: 'Workspace members',
      icon: TrendingUp,
      accent: 'cyan',
    },
    {
      label: 'System tasks',
      value: stats.total_tasks,
      change: 'Assignments',
      icon: Zap,
      accent: 'violet',
    },
    {
      label: 'Completed tasks',
      value: stats.completed_tasks,
      change: 'Finished work',
      icon: Target,
      accent: 'cyan',
    },
    {
      label: 'Task completion rate',
      value: `${stats.total_tasks ? Math.round((stats.completed_tasks / stats.total_tasks) * 100) : 0}%`,
      change: 'Efficiency rate',
      icon: BarChart3,
      accent: 'violet',
    },
  ]

  const pieData = stats.status_breakdown.map((item, idx) => ({
    name: item.name,
    value: item.value,
    fill: PIE_COLORS[idx % PIE_COLORS.length]
  }))

  return (
    <div className="analytics-page space-y-6 sm:space-y-8 [&_h1]:m-0 [&_h2]:m-0 [&_h3]:m-0">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-400/80">
            Insights
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            System Analytics
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Track user activities, status distributions, and productivity trends.
          </p>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {productivityStats.map((stat, index) => {
          const Icon = stat.icon
          const isCyan = stat.accent === 'cyan'
          return (
            <div
              key={index}
              className={`${glassCard} group relative overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.45)] sm:p-6`}
            >
              <div
                aria-hidden
                className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full blur-3xl transition-opacity duration-300 group-hover:opacity-100 ${
                  isCyan ? 'bg-cyan-500/20 opacity-70' : 'bg-violet-500/20 opacity-70'
                }`}
              />

              <div className="relative flex items-start justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                    isCyan
                      ? 'border-cyan-400/25 bg-gradient-to-br from-cyan-400/25 to-cyan-400/5 text-cyan-300'
                      : 'border-violet-400/25 bg-gradient-to-br from-violet-400/25 to-violet-400/5 text-violet-300'
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-medium ${isCyan ? 'text-cyan-400' : 'text-violet-400'}`}>
                  {stat.change}
                  <ArrowUpRight className="h-3 w-3" strokeWidth={2} />
                </span>
              </div>

              <p className="relative mt-4 text-2xl font-semibold tracking-tight text-white">
                {stat.value}
              </p>
              <p className="relative mt-1 text-sm text-zinc-500">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Line Chart - Activity Trend */}
        <div className={`${glassCard} p-5 sm:p-6 lg:col-span-2`}>
          <div className="mb-6">
            <h2 className="text-base font-semibold text-white">Task Completion Trend</h2>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-500">
              <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.75} />
              Activity in the last 7 days
            </p>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.task_activity}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null
                    return (
                      <div className="rounded-lg border border-white/10 bg-[#0c0c12]/95 px-3 py-2 shadow-xl backdrop-blur-md text-xs space-y-1">
                        <p className="text-zinc-500">{payload[0].payload.label}</p>
                        <p className="text-violet-300 font-medium">Created: {payload[0].value}</p>
                        <p className="text-cyan-300 font-medium">Completed: {payload[1].value}</p>
                      </div>
                    )
                  }}
                />
                <Line type="monotone" dataKey="created" stroke="#a78bfa" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="completed" stroke="#22d3ee" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - Task Distribution */}
        <div className={`${glassCard} p-5 sm:p-6 flex flex-col justify-between`}>
          <div>
            <h2 className="text-base font-semibold text-white">Status Breakdown</h2>
            <p className="mt-0.5 text-xs text-zinc-500">Total task allocation</p>
          </div>

          <div className="h-[200px] w-full flex items-center justify-center my-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData.filter(item => item.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.filter(item => item.value > 0).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
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
                <Legend
                  verticalAlign="bottom"
                  height={32}
                  formatter={(value) => <span className="text-xs text-zinc-400">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bar Chart - Task Counts */}
      <div className={`${glassCard} p-5 sm:p-6`}>
        <div className="mb-6">
          <h2 className="text-base font-semibold text-white">Daily Creation Load</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Tasks created per day</p>
        </div>

        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.task_activity}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 11 }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  return (
                    <div className="rounded-lg border border-white/10 bg-[#0c0c12]/95 px-3 py-2 shadow-xl backdrop-blur-md">
                      <p className="text-xs text-zinc-500">{payload[0].payload.label}</p>
                      <p className="text-sm font-semibold text-violet-300">{payload[0].value} tasks created</p>
                    </div>
                  )
                }}
              />
              <Bar dataKey="created" fill="#a78bfa" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
