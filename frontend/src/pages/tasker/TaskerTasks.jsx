/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import toast from 'react-hot-toast'
import {
  Calendar,
  Flag,
  GripVertical,
  CheckCircle2,
  Briefcase
} from 'lucide-react'
import api from '../../api'

const glassCard =
  'rounded-2xl border border-white/[0.08] bg-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md'

const columns = [
  {
    id: 'todo',
    title: 'To Do',
    accent: 'border-zinc-500/30 bg-zinc-500/10 text-zinc-400',
    dot: 'bg-zinc-500',
    glow: 'from-zinc-500/10',
  },
  {
    id: 'inProgress',
    title: 'In Progress',
    accent: 'border-violet-400/30 bg-violet-400/10 text-violet-300',
    dot: 'bg-violet-400',
    glow: 'from-violet-500/15',
  },
  {
    id: 'completed',
    title: 'Completed',
    accent: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300',
    dot: 'bg-cyan-400',
    glow: 'from-cyan-500/15',
  },
]

const priorityStyles = {
  High: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300',
  Medium: 'border-violet-400/30 bg-violet-400/10 text-violet-300',
  Low: 'border-white/10 bg-white/[0.04] text-zinc-500',
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

export default function TaskerTasks() {
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const loadTasks = async () => {
    try {
      const { data } = await api.get('/tasks')
      setTasks(data)
    } catch {
      toast.error('Failed to load assigned tasks')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  const handleMarkComplete = async (taskId) => {
    // Optimistic UI update
    const updatedTasks = tasks.map(t => t.id === taskId ? { ...t, status: 'completed' } : t)
    setTasks(updatedTasks)

    try {
      await api.patch(`/tasks/${taskId}`, { status: 'completed' })
      toast.success('Task marked as complete!')
    } catch {
      toast.error('Failed to update task')
      loadTasks()
    }
  }

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result
    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return
    }

    const task = tasks.find((t) => t.id === draggableId)
    const newStatus = destination.droppableId
    if (!task || task.status === newStatus) return

    // Optimistic UI update
    const updatedTasks = tasks.map(t => t.id === draggableId ? { ...t, status: newStatus } : t)
    setTasks(updatedTasks)

    try {
      await api.patch(`/tasks/${draggableId}`, { status: newStatus })
    } catch {
      toast.error('Failed to update task status')
      loadTasks()
    }
  }

  const board = useMemo(() => {
    return {
      todo: tasks.filter((t) => t.status === 'todo'),
      inProgress: tasks.filter((t) => t.status === 'inProgress'),
      completed: tasks.filter((t) => t.status === 'completed'),
    }
  }, [tasks])

  return (
    <div className="tasks-page space-y-6 [&_h1]:m-0 [&_h2]:m-0">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-400/80">
            Work space
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            My assigned tasks
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Drag cards between columns to update status, or mark them completed.
          </p>
        </div>
        <div>
          <p className="text-sm text-zinc-500">
            <span className="font-medium text-white">{tasks.length}</span> assigned tasks
          </p>
        </div>
      </header>

      {isLoading ? (
        <div className="flex gap-4 overflow-x-auto pb-4 lg:gap-5">
          {[0, 1, 2].map((col) => (
            <div key={col} className={`min-h-[420px] min-w-[280px] flex-1 ${glassCard} overflow-hidden`}>
              <div className="border-b border-white/[0.06] px-4 py-4">
                <div className="h-5 w-28 animate-pulse rounded-lg bg-white/10" />
              </div>
              <div className="space-y-3 p-4">
                {[0, 1, 2].map((card) => (
                  <div key={card} className="h-[88px] animate-pulse rounded-xl bg-white/[0.06]" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div
          className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.1] ${glassCard} px-6 py-16 text-center`}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10">
            <Briefcase className="h-7 w-7 text-cyan-300" strokeWidth={1.5} />
          </div>
          <h2 className="mt-5 text-lg font-semibold text-white">No assignments</h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-500">
            You do not have any tasks assigned to you right now. Take a rest!
          </p>
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4 lg:gap-5">
            {columns.map((column) => (
              <div key={column.id} className={`flex min-h-[420px] min-w-[280px] flex-1 flex-col ${glassCard} overflow-hidden`}>
                <div className={`relative border-b border-white/[0.06] bg-gradient-to-b ${column.glow} to-transparent px-4 py-4`}>
                  <div className="flex items-center gap-2.5">
                    <span className={`h-2 w-2 rounded-full ${column.dot} shadow-[0_0_8px_currentColor]`} />
                    <h2 className="m-0 text-sm font-semibold text-white">{column.title}</h2>
                    <span className={`rounded-md border px-2 py-0.5 text-xs font-medium ${column.accent}`}>
                      {board[column.id].length}
                    </span>
                  </div>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex flex-1 flex-col gap-3 overflow-y-auto p-3 transition-colors duration-200 sm:p-4 ${
                        snapshot.isDraggingOver ? 'bg-cyan-400/[0.04]' : ''
                      }`}
                    >
                      {board[column.id].length === 0 && !snapshot.isDraggingOver && (
                        <p className="py-6 text-center text-xs text-zinc-600">No tasks here</p>
                      )}
                      {board[column.id].map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(providedDrag, snapshotDrag) => (
                            <div
                              ref={providedDrag.innerRef}
                              {...providedDrag.draggableProps}
                              className={`group rounded-xl border bg-white/[0.03] p-3.5 transition-all duration-200 sm:p-4 ${
                                snapshotDrag.isDragging
                                  ? 'border-cyan-400/40 shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_24px_rgba(34,211,238,0.15)] rotate-[1deg] scale-[1.02]'
                                  : 'border-white/[0.08] hover:border-white/[0.14] hover:bg-white/[0.06] hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)]'
                              } ${column.id === 'completed' ? 'opacity-80' : ''}`}
                            >
                              <div className="flex items-start gap-2">
                                <button
                                  type="button"
                                  {...providedDrag.dragHandleProps}
                                  className="mt-0.5 shrink-0 cursor-grab rounded p-0.5 text-zinc-600 transition-colors hover:text-zinc-400 active:cursor-grabbing"
                                  aria-label="Drag task"
                                >
                                  <GripVertical className="h-4 w-4" />
                                </button>
                                <div className="min-w-0 flex-1">
                                  <p className={`text-sm font-medium leading-snug text-white ${column.id === 'completed' ? 'line-through text-zinc-500' : ''}`}>
                                    {task.title}
                                  </p>
                                  {task.description && (
                                    <p className="mt-1 line-clamp-2 text-xs text-zinc-500">{task.description}</p>
                                  )}
                                  <div className="mt-3 flex flex-wrap items-center gap-2">
                                    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${priorityStyles[task.priority]}`}>
                                      <Flag className="h-2.5 w-2.5" />
                                      {task.priority}
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500">
                                      <Calendar className="h-3 w-3" />
                                      {formatDueDate(task.due_date)}
                                    </span>
                                  </div>
                                </div>
                                {column.id !== 'completed' && (
                                  <button
                                    type="button"
                                    onClick={() => handleMarkComplete(task.id)}
                                    className="rounded-lg p-1.5 text-zinc-500 hover:bg-cyan-400/10 hover:text-cyan-300 transition-colors"
                                    title="Mark complete"
                                  >
                                    <CheckCircle2 className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}
    </div>
  )
}
