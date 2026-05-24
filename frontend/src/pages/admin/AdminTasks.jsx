/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import toast from 'react-hot-toast'
import {
  Plus,
  GripVertical,
  Calendar,
  Flag,
  X,
  Pencil,
  Trash2,
  ListTodo,
  Loader2,
  UserCheck
} from 'lucide-react'
import api from '../../api'

const glassCard =
  'rounded-2xl border border-white/[0.08] bg-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md'

const inputClass =
  'w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none transition-all hover:border-white/[0.12] focus:border-cyan-400/40 focus:shadow-[0_0_0_3px_rgba(34,211,238,0.1)]'

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

export default function AdminTasks() {
  const [tasks, setTasks] = useState([])
  const [taskers, setTaskers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [modal, setModal] = useState({ open: false, mode: 'create', status: 'todo', task: null })
  const [deletingId, setDeletingId] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  // Load functions
  const loadData = async () => {
    try {
      const [tasksRes, usersRes] = await Promise.all([
        api.get('/admin/tasks'),
        api.get('/admin/users')
      ])
      setTasks(tasksRes.data)
      setTaskers(usersRes.data.filter(u => u.role === 'tasker'))
    } catch {
      toast.error('Failed to load board details')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const openCreateModal = useCallback((status = 'todo') => {
    setModal({ open: true, mode: 'create', status, task: null })
  }, [])

  const openEditModal = useCallback((task) => {
    setModal({ open: true, mode: 'edit', status: task.status, task })
  }, [])

  const closeModal = useCallback(() => {
    setModal((prev) => ({ ...prev, open: false }))
  }, [])

  const handleModalSubmit = async (payload) => {
    setIsSaving(true)
    try {
      if (modal.mode === 'edit' && modal.task) {
        await api.patch(`/admin/tasks/${modal.task.id}`, payload)
        toast.success('Task updated')
      } else {
        await api.post('/admin/tasks', payload)
        toast.success('Task created')
      }
      await loadData()
      closeModal()
    } catch {
      toast.error('Something went wrong saving the task')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return
    setDeletingId(task.id)
    try {
      await api.delete(`/admin/tasks/${task.id}`)
      toast.success('Task deleted')
      await loadData()
    } catch {
      toast.error('Failed to delete task')
    } finally {
      setDeletingId(null)
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
      await api.patch(`/admin/tasks/${draggableId}`, { status: newStatus })
    } catch {
      toast.error('Failed to move task')
      loadData()
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
            System workspace
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Task board (all tasks)
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Drag cards between columns to update status, or assign them to taskers.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm text-zinc-500">
            <span className="font-medium text-white">{tasks.length}</span> tasks total
          </p>
          <button
            type="button"
            onClick={() => openCreateModal('todo')}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 px-4 py-2.5 text-sm font-semibold text-[#041014] shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-transform hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            New task
          </button>
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
            <ListTodo className="h-7 w-7 text-cyan-300" strokeWidth={1.5} />
          </div>
          <h2 className="mt-5 text-lg font-semibold text-white">No tasks yet</h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-500">
            Create your first task to start organizing work on the system board.
          </p>
          <button
            type="button"
            onClick={() => openCreateModal('todo')}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 px-5 py-2.5 text-sm font-semibold text-[#041014] shadow-[0_0_24px_rgba(34,211,238,0.35)] transition-transform hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Create task
          </button>
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
                        <p className="py-6 text-center text-xs text-zinc-600">Drop tasks here</p>
                      )}
                      {board[column.id].map((task, index) => {
                        const assignee = taskers.find(t => t.id === task.assigned_to)
                        return (
                          <Draggable key={task.id} draggableId={task.id} index={index} isDragDisabled={deletingId === task.id}>
                            {(providedDrag, snapshotDrag) => (
                              <div
                                ref={providedDrag.innerRef}
                                {...providedDrag.draggableProps}
                                className={`group rounded-xl border bg-white/[0.03] p-3.5 transition-all duration-200 sm:p-4 ${
                                  snapshotDrag.isDragging
                                    ? 'border-cyan-400/40 shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_24px_rgba(34,211,238,0.15)] rotate-[1deg] scale-[1.02]'
                                    : 'border-white/[0.08] hover:border-white/[0.14] hover:bg-white/[0.06] hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)]'
                                } ${column.id === 'completed' ? 'opacity-80' : ''} ${deletingId === task.id ? 'opacity-50' : ''}`}
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
                                    {assignee && (
                                      <div className="mt-3 border-t border-white/[0.04] pt-2 flex items-center gap-1.5 text-xs text-cyan-300">
                                        <UserCheck className="h-3 w-3" />
                                        <span>Assigned: <span className="font-semibold text-white">{assignee.name}</span></span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex shrink-0 gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                                    <button
                                      type="button"
                                      onClick={() => openEditModal(task)}
                                      className="rounded-lg p-1.5 text-zinc-500 hover:bg-white/[0.06] hover:text-cyan-300"
                                      aria-label="Edit task"
                                    >
                                      <Pencil className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDelete(task)}
                                      disabled={deletingId === task.id}
                                      className="rounded-lg p-1.5 text-zinc-500 hover:bg-red-400/10 hover:text-red-300 disabled:opacity-50"
                                      aria-label="Delete task"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        )
                      })}
                      {provided.placeholder}

                      <button
                        type="button"
                        onClick={() => openCreateModal(column.id)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/[0.1] py-2.5 text-sm text-zinc-500 transition-all duration-200 hover:border-cyan-400/30 hover:bg-cyan-400/[0.04] hover:text-cyan-300"
                      >
                        <Plus className="h-4 w-4" />
                        Add task
                      </button>
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}

      {/* Task Modal Overlay */}
      {modal.open && (
        <TaskFormModal
          open={modal.open}
          mode={modal.mode}
          initialStatus={modal.status}
          task={modal.task}
          taskers={taskers}
          onClose={closeModal}
          onSubmit={handleModalSubmit}
          isSaving={isSaving}
        />
      )}
    </div>
  )
}

function TaskFormModal({ open, mode, initialStatus, task, taskers, onClose, onSubmit, isSaving }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('todo')
  const [priority, setPriority] = useState('Medium')
  const [dueDate, setDueDate] = useState('')
  const [assignedTo, setAssignedTo] = useState('')

  useEffect(() => {
    if (!open) return
    if (mode === 'edit' && task) {
      setTitle(task.title ?? '')
      setDescription(task.description ?? '')
      setStatus(task.status ?? 'todo')
      setPriority(task.priority ?? 'Medium')
      setDueDate(task.due_date ?? '')
      setAssignedTo(task.assigned_to ?? '')
    } else {
      setTitle('')
      setDescription('')
      setStatus(initialStatus ?? 'todo')
      setPriority('Medium')
      setDueDate('')
      setAssignedTo('')
    }
  }, [open, mode, task, initialStatus])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit({
      title: title.trim(),
      description: description.trim() || null,
      status,
      priority,
      due_date: dueDate || null,
      assigned_to: assignedTo || null
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close modal"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full max-w-md ${glassCard} p-6 shadow-[0_24px_80px_rgba(0,0,0,0.6)]`}
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-cyan-400/80">
              {mode === 'edit' ? 'Edit task' : 'New task'}
            </p>
            <h2 className="mt-1 text-lg font-semibold text-white">
              {mode === 'edit' ? 'Update details' : 'Add to board'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
              Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className={inputClass}
              disabled={isSaving}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Optional details…"
              className={`${inputClass} resize-none`}
              disabled={isSaving}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={inputClass}
                disabled={isSaving}
              >
                <option value="todo">To Do</option>
                <option value="inProgress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={inputClass}
                disabled={isSaving}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                Due date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={inputClass}
                disabled={isSaving}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                Assign to
              </label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className={`${inputClass} bg-[#09090e]`}
                disabled={isSaving}
              >
                <option value="">Unassigned</option>
                {taskers.map((tasker) => (
                  <option key={tasker.id} value={tasker.id}>
                    {tasker.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={isSaving || !title.trim()}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 py-2.5 text-sm font-semibold text-[#041014] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : mode === 'edit' ? (
                'Save changes'
              ) : (
                'Create task'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-xl border border-white/[0.08] px-4 py-2.5 text-sm text-zinc-400 hover:bg-white/[0.04]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
