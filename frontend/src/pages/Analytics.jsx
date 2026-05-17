import { useState } from 'react'
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
} from 'lucide-react'

const glassCard =
  'rounded-2xl border border-white/[0.08] bg-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md'

const productivityStats = [
  { label: 'Avg. productivity', value: '91%', change: '+6.2%', icon: TrendingUp, accent: 'cyan' },
  { label: 'Tasks completed', value: '342', change: '+28', icon: Target, accent: 'violet' },
  { label: 'Focus score', value: '8.4', change: '+0.6', icon: Zap, accent: 'cyan' },
  { label: 'Completion rate', value: '87%', change: '+4%', icon: BarChart3, accent: 'violet' },
]

const weeklyLineData = [
  { label: 'Mon', value: 72 },
  { label: 'Tue', value: 85 },
  { label: 'Wed', value: 78 },
  { label: 'Thu', value: 91 },
  { label: 'Fri', value: 88 },
  { label: 'Sat', value: 65 },
  { label: 'Sun', value: 94 },
]

const monthlyLineData = [
  { label: 'Jan', value: 68 },
  { label: 'Feb', value: 74 },
  { label: 'Mar', value: 82 },
  { label: 'Apr', value: 79 },
  { label: 'May', value: 91 },
  { label: 'Jun', value: 88 },
  { label: 'Jul', value: 85 },
  { label: 'Aug', value: 90 },
  { label: 'Sep', value: 87 },
  { label: 'Oct', value: 93 },
  { label: 'Nov', value: 89 },
  { label: 'Dec', value: 95 },
]

const weeklyBarData = [
  { label: 'Mon', tasks: 12 },
  { label: 'Tue', tasks: 18 },
  { label: 'Wed', tasks: 14 },
  { label: 'Thu', tasks: 22 },
  { label: 'Fri', tasks: 19 },
  { label: 'Sat', tasks: 8 },
  { label: 'Sun', tasks: 6 },
]

const monthlyBarData = [
  { label: 'W1', tasks: 48 },
  { label: 'W2', tasks: 62 },
  { label: 'W3', tasks: 55 },
  { label: 'W4', tasks: 71 },
]

const pieData = [
  { name: 'Completed', value: 62, fill: '#22d3ee' },
  { name: 'In progress', value: 24, fill: '#a78bfa' },
  { name: 'Overdue', value: 14, fill: '#f472b6' },
]

const PIE_COLORS = ['#22d3ee', '#a78bfa', '#f472b6']

function LineTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-white/10 bg-[#0c0c12]/95 px-3 py-2 shadow-xl backdrop-blur-md">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="text-sm font-semibold text-cyan-300">{payload[0].value}%</p>
    </div>
  )
}

function BarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-white/10 bg-[#0c0c12]/95 px-3 py-2 shadow-xl backdrop-blur-md">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="text-sm font-semibold text-violet-300">{payload[0].value} tasks</p>
    </div>
  )
}

function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-white/10 bg-[#0c0c12]/95 px-3 py-2 shadow-xl backdrop-blur-md">
      <p className="text-sm font-medium text-white">{payload[0].name}</p>
      <p className="text-xs text-cyan-300">{payload[0].value}%</p>
    </div>
  )
}

function StatCard({ stat }) {
  const Icon = stat.icon
  const isCyan = stat.accent === 'cyan'
  return (
    <div
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
        <span
          className={`flex items-center gap-0.5 text-xs font-medium ${
            isCyan ? 'text-cyan-400' : 'text-violet-400'
          }`}
        >
          {stat.change}
          <ArrowUpRight className="h-3 w-3" strokeWidth={2} />
        </span>
      </div>
      <p className="relative mt-4 text-2xl font-semibold tracking-tight text-white">{stat.value}</p>
      <p className="relative mt-1 text-sm text-zinc-500">{stat.label}</p>
    </div>
  )
}

export default function Analytics() {
  const [period, setPeriod] = useState('weekly')

  const lineData = period === 'weekly' ? weeklyLineData : monthlyLineData
  const barData = period === 'weekly' ? weeklyBarData : monthlyBarData
  const lineTitle = period === 'weekly' ? 'Weekly productivity' : 'Monthly productivity'
  const barTitle = period === 'weekly' ? 'Tasks per day' : 'Tasks per week (May)'

  return (
    <div className="analytics-page space-y-6 sm:space-y-8 [&_h1]:m-0 [&_h2]:m-0 [&_h3]:m-0">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-400/80">
            Insights
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Analytics
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Track productivity trends and task distribution.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] p-1">
          <button
            type="button"
            onClick={() => setPeriod('weekly')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
              period === 'weekly'
                ? 'bg-gradient-to-r from-cyan-400/90 to-violet-400/90 text-[#041014] shadow-[0_0_20px_rgba(34,211,238,0.25)]'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Weekly
          </button>
          <button
            type="button"
            onClick={() => setPeriod('monthly')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
              period === 'monthly'
                ? 'bg-gradient-to-r from-cyan-400/90 to-violet-400/90 text-[#041014] shadow-[0_0_20px_rgba(34,211,238,0.25)]'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Monthly
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {productivityStats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className={`${glassCard} p-5 sm:p-6 lg:col-span-2`}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-semibold text-white">{lineTitle}</h2>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-500">
                <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.75} />
                {period === 'weekly' ? 'Last 7 days' : 'Year to date'}
              </p>
            </div>
            <span className="rounded-lg border border-cyan-400/20 bg-gradient-to-r from-cyan-400/10 to-violet-400/10 px-2.5 py-1 text-xs font-medium text-cyan-300">
              Peak {period === 'weekly' ? 'Sun' : 'Dec'} · 94%
            </span>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="lineNeon" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#a78bfa" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#71717a', fontSize: 11 }}
                  interval={period === 'monthly' ? 1 : 0}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#71717a', fontSize: 11 }}
                  domain={[50, 100]}
                />
                <Tooltip content={<LineTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="url(#lineNeon)"
                  strokeWidth={2.5}
                  dot={{ fill: '#050508', stroke: '#22d3ee', strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, fill: '#a78bfa', stroke: '#050508', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`${glassCard} p-5 sm:p-6`}>
          <div className="mb-4">
            <h2 className="text-base font-semibold text-white">Task distribution</h2>
            <p className="mt-0.5 text-xs text-zinc-500">By status</p>
          </div>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={82}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span className="text-xs text-zinc-400">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            {pieData.map((item, i) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs text-zinc-500">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: PIE_COLORS[i], boxShadow: `0 0 8px ${PIE_COLORS[i]}66` }}
                />
                {item.name} ({item.value}%)
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`${glassCard} p-5 sm:p-6`}>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-white">{barTitle}</h2>
            <p className="mt-0.5 text-xs text-zinc-500">
              {period === 'weekly' ? 'Weekly task volume' : 'Monthly task volume'}
            </p>
          </div>
          <span className="rounded-lg border border-violet-400/20 bg-violet-400/10 px-2.5 py-1 text-xs font-medium text-violet-300">
            Total {barData.reduce((s, d) => s + d.tasks, 0)} tasks
          </span>
        </div>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="barNeon" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#71717a', fontSize: 11 }}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 11 }} />
              <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(34,211,238,0.06)' }} />
              <Bar dataKey="tasks" fill="url(#barNeon)" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 to-transparent p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-cyan-400/80">
            {period === 'weekly' ? 'Best day' : 'Best month'}
          </p>
          <p className="mt-2 text-lg font-semibold text-white">
            {period === 'weekly' ? 'Thursday' : 'December'}
          </p>
          <p className="mt-1 text-xs text-zinc-500">91% avg. productivity</p>
        </div>
        <div className="rounded-xl border border-violet-400/20 bg-gradient-to-br from-violet-400/10 to-transparent p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-violet-400/80">
            Focus time
          </p>
          <p className="mt-2 text-lg font-semibold text-white">
            {period === 'weekly' ? '32.5 hrs' : '128 hrs'}
          </p>
          <p className="mt-1 text-xs text-zinc-500">Deep work logged</p>
        </div>
        <div className="rounded-xl border border-fuchsia-400/20 bg-gradient-to-br from-fuchsia-400/10 to-transparent p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-fuchsia-400/80">
            Streak
          </p>
          <p className="mt-2 text-lg font-semibold text-white">
            {period === 'weekly' ? '5 days' : '12 weeks'}
          </p>
          <p className="mt-1 text-xs text-zinc-500">Above target</p>
        </div>
      </div>
    </div>
  )
}
