import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  CheckCircle,
  Clock,
  Target,
  ArrowUpRight,
  Calendar,
  AlertCircle,
  Bell
} from 'lucide-react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
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

function formatDueDate(dueDate) {
  if (!dueDate) return 'No date'
  try {
    return new Date(`${dueDate}T00:00:00`).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dueDate
  }
}

export default function TaskerDashboard() {
  const [data, setData] = useState(null)
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [analyticsRes, tasksRes] = await Promise.all([
          api.get('/analytics'),
          api.get('/tasks')
        ])
        setData(analyticsRes.data)
        setTasks(tasksRes.data)
      } catch {
        toast.error('Failed to load dashboard metrics')
      } finally {
        setIsLoading(false)
      }
    }
    loadDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <span className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-400" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center gap-3">
        <AlertCircle className="h-10 w-10 text-red-400" />
        <p className="text-zinc-400">Failed to load statistics.</p>
      </div>
    )
  }

  const { summary, productivity, weekly, status_breakdown } = data

  const stats = [
    {
      label: 'Completed tasks',
      value: summary.completed_tasks,
      change: `${productivity.completed_this_week} this week`,
      icon: CheckCircle,
      accent: 'cyan',
    },
    {
      label: 'Total assigned',
      value: summary.total_tasks,
      change: 'Active board tasks',
      icon: TrendingUp,
      accent: 'violet',
    },
    {
      label: 'Pending tasks',
      value: summary.pending_tasks,
      change: `${productivity.overdue_tasks} overdue`,
      icon: Clock,
      accent: 'cyan',
    },
    {
      label: 'Completion rate',
      value: `${productivity.completion_rate}%`,
      change: 'Personal target',
      icon: Target,
      accent: 'violet',
    },
  ]

  const upcomingTasks = tasks
    .filter(t => t.status !== 'completed')
    .slice(0, 4)

  const mockNotifications = [
    { id: 1, message: 'You have been assigned to a new task', time: '1 hour ago' },
    { id: 2, message: 'Task deadline approaching tomorrow', time: '5 hours ago' }
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
            Tasker panel
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            My productivity board
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Track and complete your assigned tasks.
          </p>
        </div>

        <div className="mt-2 flex items-center gap-2 text-sm text-zinc-500 sm:mt-0">
          <Calendar className="h-4 w-4 text-cyan-400/80" strokeWidth={1.75} />
          <span>Tasker view</span>
        </div>
      </motion.div>

      {/* Stats cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const isCyan = stat.accent === 'cyan'
          return (
            <motion.div
              key={index}
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
                  {stat.change}
                  <ArrowUpRight className="h-3 w-3" strokeWidth={2} />
                </span>
              </div>

              <p className="relative mt-4 text-2xl font-semibold tracking-tight text-white">
                {stat.value}
              </p>
              <p className="relative mt-1 text-sm text-zinc-500">{stat.label}</p>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Charts & Notifications */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        {/* Productivity trend */}
        <div className={`${glassCard} p-5 sm:p-6 lg:col-span-2`}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-semibold text-white">Productivity trend</h2>
              <p className="mt-0.5 text-xs text-zinc-500">Based on recent task progress</p>
            </div>
            <span className="rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-xs font-medium text-cyan-300">
              {productivity.completion_rate}% completed
            </span>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weekly.completion_trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null
                    return (
                      <div className="rounded-lg border border-white/10 bg-[#0c0c12]/95 px-3 py-2 shadow-xl backdrop-blur-md">
                        <p className="text-xs text-zinc-500">{payload[0].payload.label}</p>
                        <p className="text-sm font-semibold text-cyan-300">{payload[0].value}% efficiency</p>
                      </div>
                    )
                  }}
                />
                <Line type="monotone" dataKey="value" stroke="#22d3ee" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Notifications & status breakdown */}
        <div className="space-y-6">
          {/* Notifications */}
          <div className={`${glassCard} p-5 sm:p-6`}>
            <div className="flex items-center gap-2 mb-4">
              <Bell className="h-5 w-5 text-cyan-400" />
              <h2 className="text-base font-semibold text-white">Notifications</h2>
            </div>
            <ul className="space-y-3">
              {mockNotifications.map((notif) => (
                <li key={notif.id} className="border-b border-white/[0.04] pb-2 last:border-0 last:pb-0">
                  <p className="text-xs text-zinc-300">{notif.message}</p>
                  <span className="text-[10px] text-zinc-500 mt-0.5 block">{notif.time}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Allocation */}
          <div className={`${glassCard} p-5 sm:p-6`}>
            <h2 className="text-base font-semibold text-white mb-4">Task distribution</h2>
            <div className="space-y-3">
              {status_breakdown.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400">{item.name}</span>
                  <span className="font-semibold text-white">{item.value} tasks</span>
                </div>
              ))}
              {status_breakdown.length === 0 && (
                <p className="text-zinc-500 text-xs py-2">No active tasks</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Assigned Tasks list */}
      <motion.div
        variants={itemVariants}
        className={`${glassCard} p-5 sm:p-6`}
      >
        <h2 className="text-base font-semibold text-white">Upcoming deadlines</h2>
        <p className="text-xs text-zinc-500 mt-0.5">Assigned tasks requiring attention</p>
        <div className="mt-5 overflow-x-auto">
          {upcomingTasks.length === 0 ? (
            <p className="text-zinc-500 text-sm py-4">No pending assigned tasks found!</p>
          ) : (
            <table className="w-full text-left text-sm text-zinc-300">
              <thead>
                <tr className="border-b border-white/[0.06] text-xs uppercase tracking-wider text-zinc-500 font-semibold">
                  <th className="pb-3 pr-4">Task name</th>
                  <th className="pb-3 px-4">Priority</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 pl-4 text-right">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {upcomingTasks.map((task) => (
                  <tr key={task.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.01]">
                    <td className="py-3 pr-4 font-medium text-white max-w-[250px] truncate">{task.title}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide border ${
                        task.priority === 'High' ? 'border-red-400/30 bg-red-400/10 text-red-300' :
                        task.priority === 'Medium' ? 'border-violet-400/30 bg-violet-400/10 text-violet-300' :
                        'border-zinc-500/30 bg-zinc-500/10 text-zinc-400'
                      }`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide border ${
                        task.status === 'inProgress' ? 'border-violet-400/30 bg-violet-400/10 text-violet-300' :
                        'border-zinc-500/30 bg-zinc-500/10 text-zinc-400'
                      }`}>
                        {task.status === 'inProgress' ? 'In Progress' : 'To Do'}
                      </span>
                    </td>
                    <td className="py-3 pl-4 text-right text-zinc-500">{formatDueDate(task.due_date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
