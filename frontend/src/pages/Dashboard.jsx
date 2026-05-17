import { motion } from 'framer-motion'
import { useTaskStore } from '../store/taskStore'

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

import {
  TrendingUp,
  CheckCircle2,
  Clock,
  Target,
  ArrowUpRight,
  Calendar,
  Circle,
} from 'lucide-react'

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

function ChartTooltip({ active, payload, label }) {
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

function BarTooltip({ active, payload }) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-white/10 bg-[#0c0c12]/95 px-3 py-2 shadow-xl backdrop-blur-md">
      <p className="text-sm font-medium text-white">
        {payload[0].payload.name}
      </p>

      <p className="text-xs text-violet-300">
        {payload[0].value}
      </p>
    </div>
  )
}

export default function Dashboard() {
  const tasks = useTaskStore((state) => state.tasks || [])

  const completedTasks = tasks.filter(
    (task) => task.status === 'completed'
  )

  const pendingTasks = tasks.filter(
    (task) => task.status !== 'completed'
  )

  const completionRate = tasks.length
    ? Math.round(
        (completedTasks.length / tasks.length) * 100
      )
    : 0

  const stats = [
    {
      label: 'Tasks completed',
      value: completedTasks.length,
      change: `${completionRate}%`,
      icon: CheckCircle2,
      accent: 'cyan',
    },
    {
      label: 'Total tasks',
      value: tasks.length,
      change: '+0%',
      icon: TrendingUp,
      accent: 'violet',
    },
    {
      label: 'Pending tasks',
      value: pendingTasks.length,
      change: '+0%',
      icon: Clock,
      accent: 'cyan',
    },
    {
      label: 'Completion rate',
      value: `${completionRate}%`,
      change: '+0%',
      icon: Target,
      accent: 'violet',
    },
  ]

  const productivityData = tasks
    .slice(0, 7)
    .map((task, index) => ({
      day: `T${index + 1}`,
      score:
        task.status === 'completed'
          ? 95
          : 55,
    }))

  const completionData = [
    {
      name: 'Done',
      value: completedTasks.length,
      fill: '#22d3ee',
    },
    {
      name: 'Pending',
      value: pendingTasks.length,
      fill: '#a78bfa',
    },
  ]

  const recentActivity = tasks
    .slice(0, 4)
    .map((task, index) => ({
      id: index + 1,
      action:
        task.status === 'completed'
          ? 'Completed'
          : 'Working on',
      task: task.title || 'Untitled Task',
      time: 'Recently',
      color:
        task.status === 'completed'
          ? 'text-cyan-400'
          : 'text-violet-400',
    }))

  const upcomingTasks = pendingTasks
    .slice(0, 4)
    .map((task, index) => ({
      id: index + 1,
      title: task.title || 'Untitled Task',
      due: task.dueDate || 'No due date',
      priority: task.priority || 'Medium',
      priorityClass:
        task.priority === 'High'
          ? 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300'
          : task.priority === 'Low'
          ? 'border-white/10 bg-white/[0.04] text-zinc-400'
          : 'border-violet-400/30 bg-violet-400/10 text-violet-300',
    }))

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="dashboard-page space-y-6 sm:space-y-8 [&_h1]:m-0 [&_h2]:m-0 [&_h3]:m-0"
    >
      <motion.div
        variants={itemVariants}
        className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-400/80">
            Overview
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Productivity dashboard
          </h1>

          <p className="mt-1 text-sm text-zinc-500">
            Track performance and stay ahead of your
            week.
          </p>
        </div>

        <div className="mt-2 flex items-center gap-2 text-sm text-zinc-500 sm:mt-0">
          <Calendar
            className="h-4 w-4 text-cyan-400/80"
            strokeWidth={1.75}
          />

          <span>Current task overview</span>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((stat) => {
          const Icon = stat.icon

          const isCyan = stat.accent === 'cyan'

          return (
            <motion.div
              key={stat.label}
              whileHover={{
                y: -4,
                transition: { duration: 0.2 },
              }}
              className={`${glassCard} group relative overflow-hidden p-5 sm:p-6`}
            >
              <div
                aria-hidden
                className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl transition-opacity duration-300 group-hover:opacity-100 ${
                  isCyan
                    ? 'bg-cyan-500/15 opacity-60'
                    : 'bg-violet-500/15 opacity-60'
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
                  <Icon
                    className="h-[18px] w-[18px]"
                    strokeWidth={1.75}
                  />
                </div>

                <span
                  className={`flex items-center gap-0.5 text-xs font-medium ${
                    isCyan
                      ? 'text-cyan-400'
                      : 'text-violet-400'
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
            </motion.div>
          )
        })}
      </motion.div>

      {/* Charts */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        {/* Productivity */}
        <div
          className={`${glassCard} p-5 sm:p-6 lg:col-span-2`}
        >
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-semibold text-white">
                Productivity trend
              </h2>

              <p className="mt-0.5 text-xs text-zinc-500">
                Based on current task progress
              </p>
            </div>

            <span className="rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-xs font-medium text-cyan-300">
              {completionRate}% completed
            </span>
          </div>

          <div className="h-[260px] w-full sm:h-[280px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart
                data={productivityData}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />

                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#71717a',
                    fontSize: 12,
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#71717a',
                    fontSize: 12,
                  }}
                />

                <Tooltip
                  content={<ChartTooltip />}
                />

                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#22d3ee"
                  strokeWidth={2.5}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Completion */}
        <div className={`${glassCard} p-5 sm:p-6`}>
          <div className="mb-6">
            <h2 className="text-base font-semibold text-white">
              Task completion
            </h2>

            <p className="mt-0.5 text-xs text-zinc-500">
              Status breakdown
            </p>
          </div>

          <div className="h-[220px] w-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={completionData}
                layout="vertical"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  horizontal={false}
                />

                <XAxis
                  type="number"
                  hide
                />

                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#a1a1aa',
                    fontSize: 12,
                  }}
                />

                <Tooltip
                  content={<BarTooltip />}
                />

                <Bar
                  dataKey="value"
                  radius={[0, 6, 6, 0]}
                  barSize={18}
                >
                  {completionData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={entry.fill}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Activity + Upcoming */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 gap-6 lg:grid-cols-2"
      >
        {/* Recent Activity */}
        <div className={`${glassCard} p-5 sm:p-6`}>
          <h2 className="text-base font-semibold text-white">
            Recent activity
          </h2>

          <p className="mt-0.5 text-xs text-zinc-500">
            Latest updates
          </p>

          <ul className="mt-5 space-y-4">
            {recentActivity.map((item, i) => (
              <motion.li
                key={item.id}
                initial={{
                  opacity: 0,
                  x: -8,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: 0.3 + i * 0.06,
                }}
                className="flex gap-3 border-b border-white/[0.04] pb-4 last:border-0 last:pb-0"
              >
                <span className="mt-1.5 flex h-2 w-2 shrink-0 rounded-full bg-gradient-to-r from-cyan-400 to-violet-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />

                <div className="min-w-0 flex-1">
                  <p className="text-sm text-zinc-300">
                    <span
                      className={`font-medium ${item.color}`}
                    >
                      {item.action}
                    </span>{' '}

                    <span className="text-white">
                      {item.task}
                    </span>
                  </p>

                  <p className="mt-0.5 text-xs text-zinc-600">
                    {item.time}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Upcoming */}
        <div className={`${glassCard} p-5 sm:p-6`}>
          <h2 className="text-base font-semibold text-white">
            Upcoming tasks
          </h2>

          <p className="mt-0.5 text-xs text-zinc-500">
            Pending task schedule
          </p>

          <ul className="mt-5 space-y-3">
            {upcomingTasks.map((task, i) => (
              <motion.li
                key={task.id}
                initial={{
                  opacity: 0,
                  x: 8,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: 0.3 + i * 0.06,
                }}
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition-colors duration-200 hover:border-white/[0.1] hover:bg-white/[0.04]"
              >
                <button
                  type="button"
                  className="shrink-0 text-zinc-600 transition-colors hover:text-cyan-400"
                >
                  <Circle
                    className="h-4 w-4"
                    strokeWidth={1.75}
                  />
                </button>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">
                    {task.title}
                  </p>

                  <p className="mt-0.5 text-xs text-zinc-500">
                    {task.due}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${task.priorityClass}`}
                >
                  {task.priority}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
    </motion.div>
  )
}