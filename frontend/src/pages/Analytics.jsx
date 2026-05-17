import { useState } from 'react'
import { useTaskStore } from '../store/taskStore'

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

const PIE_COLORS = ['#22d3ee', '#a78bfa']

function LineTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-white/10 bg-[#0c0c12]/95 px-3 py-2 shadow-xl backdrop-blur-md">
      <p className="text-xs text-zinc-500">{label}</p>

      <p className="text-sm font-semibold text-cyan-300">
        {payload[0].value}%
      </p>
    </div>
  )
}

function BarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-white/10 bg-[#0c0c12]/95 px-3 py-2 shadow-xl backdrop-blur-md">
      <p className="text-xs text-zinc-500">{label}</p>

      <p className="text-sm font-semibold text-violet-300">
        {payload[0].value} tasks
      </p>
    </div>
  )
}

function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-white/10 bg-[#0c0c12]/95 px-3 py-2 shadow-xl backdrop-blur-md">
      <p className="text-sm font-medium text-white">
        {payload[0].name}
      </p>

      <p className="text-xs text-cyan-300">
        {payload[0].value}
      </p>
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
          isCyan
            ? 'bg-cyan-500/20 opacity-70'
            : 'bg-violet-500/20 opacity-70'
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
          <Icon
            className="h-[18px] w-[18px]"
            strokeWidth={1.75}
          />
        </div>

        <span
          className={`flex items-center gap-0.5 text-xs font-medium ${
            isCyan ? 'text-cyan-400' : 'text-violet-400'
          }`}
        >
          {stat.change}

          <ArrowUpRight
            className="h-3 w-3"
            strokeWidth={2}
          />
        </span>
      </div>

      <p className="relative mt-4 text-2xl font-semibold tracking-tight text-white">
        {stat.value}
      </p>

      <p className="relative mt-1 text-sm text-zinc-500">
        {stat.label}
      </p>
    </div>
  )
}

export default function Analytics() {
  const [period, setPeriod] = useState('weekly')

  const tasks = useTaskStore((state) => state.tasks || [])

  const completedTasks = tasks.filter(
    (task) => task.status === 'completed'
  ).length

  const pendingTasks = tasks.filter(
    (task) => task.status !== 'completed'
  ).length

  const totalTasks = tasks.length

  const completionRate = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0

  const productivityStats = [
    {
      label: 'Total tasks',
      value: totalTasks,
      change: '+0%',
      icon: TrendingUp,
      accent: 'cyan',
    },
    {
      label: 'Completed',
      value: completedTasks,
      change: '+0%',
      icon: Target,
      accent: 'violet',
    },
    {
      label: 'Pending',
      value: pendingTasks,
      change: '+0%',
      icon: Zap,
      accent: 'cyan',
    },
    {
      label: 'Completion rate',
      value: `${completionRate}%`,
      change: '+0%',
      icon: BarChart3,
      accent: 'violet',
    },
  ]

  const weeklyLineData = tasks.slice(0, 7).map((task, index) => ({
    label: `T${index + 1}`,
    value: task.status === 'completed' ? 100 : 40,
  }))

  const monthlyLineData = weeklyLineData

  const weeklyBarData = tasks.slice(0, 7).map((task, index) => ({
    label: `T${index + 1}`,
    tasks: 1,
  }))

  const monthlyBarData = weeklyBarData

  const pieData = [
    {
      name: 'Completed',
      value: completedTasks || 0,
      fill: '#22d3ee',
    },
    {
      name: 'Pending',
      value: pendingTasks || 0,
      fill: '#a78bfa',
    },
  ]

  const lineData =
    period === 'weekly'
      ? weeklyLineData
      : monthlyLineData

  const barData =
    period === 'weekly'
      ? weeklyBarData
      : monthlyBarData

  const lineTitle =
    period === 'weekly'
      ? 'Weekly productivity'
      : 'Monthly productivity'

  const barTitle =
    period === 'weekly'
      ? 'Tasks per day'
      : 'Tasks per week'

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
                ? 'bg-gradient-to-r from-cyan-400/90 to-violet-400/90 text-[#041014]'
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
                ? 'bg-gradient-to-r from-cyan-400/90 to-violet-400/90 text-[#041014]'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Monthly
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {productivityStats.map((stat) => (
          <StatCard
            key={stat.label}
            stat={stat}
          />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Line Chart */}
        <div className={`${glassCard} p-5 sm:p-6 lg:col-span-2`}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-semibold text-white">
                {lineTitle}
              </h2>

              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-500">
                <CalendarDays
                  className="h-3.5 w-3.5"
                  strokeWidth={1.75}
                />

                {period === 'weekly'
                  ? 'Last 7 tasks'
                  : 'Monthly overview'}
              </p>
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart data={lineData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />

                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#71717a',
                    fontSize: 11,
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#71717a',
                    fontSize: 11,
                  }}
                />

                <Tooltip content={<LineTooltip />} />

                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#22d3ee"
                  strokeWidth={2.5}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className={`${glassCard} p-5 sm:p-6`}>
          <div className="mb-4">
            <h2 className="text-base font-semibold text-white">
              Task distribution
            </h2>

            <p className="mt-0.5 text-xs text-zinc-500">
              By status
            </p>
          </div>

          <div className="h-[220px] w-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
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
                    <Cell
                      key={entry.name}
                      fill={
                        PIE_COLORS[
                          index % PIE_COLORS.length
                        ]
                      }
                    />
                  ))}
                </Pie>

                <Tooltip content={<PieTooltip />} />

                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span className="text-xs text-zinc-400">
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className={`${glassCard} p-5 sm:p-6`}>
        <div className="mb-6">
          <h2 className="text-base font-semibold text-white">
            {barTitle}
          </h2>
        </div>

        <div className="h-[240px] w-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart data={barData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />

              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: '#71717a',
                  fontSize: 11,
                }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: '#71717a',
                  fontSize: 11,
                }}
              />

              <Tooltip
                content={<BarTooltip />}
              />

              <Bar
                dataKey="tasks"
                fill="#22d3ee"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}