import { create } from 'zustand'

import api from '../api'
import { formatApiError } from '../utils/formatApiError'

const initialLoading = {
  fetch: false,
  create: false,
  update: false,
  delete: false,
}

const initialState = {
  tasks: [],
  loading: { ...initialLoading },
  error: null,
}

function setLoadingFlag(set, get, key, value) {
  set({ loading: { ...get().loading, [key]: value } })
}

async function fetchTasksFromApi() {
  const { data } = await api.get('/tasks')
  return data
}

export const useTaskStore = create((set, get) => ({
  ...initialState,

  fetchTasks: async ({ silent = false } = {}) => {
    if (!silent) {
      setLoadingFlag(set, get, 'fetch', true)
    }
    set({ error: null })

    try {
      const data = await fetchTasksFromApi()
      set((state) => ({
        tasks: data,
        loading: silent ? state.loading : { ...state.loading, fetch: false },
      }))
      return data
    } catch (error) {
      const message = formatApiError(error)
      set((state) => ({
        error: message,
        loading: silent ? state.loading : { ...state.loading, fetch: false },
      }))
      throw error
    }
  },

  createTask: async (payload) => {
    setLoadingFlag(set, get, 'create', true)
    set({ error: null })

    try {
      const { data } = await api.post('/tasks', payload)
      await get().fetchTasks({ silent: true })
      setLoadingFlag(set, get, 'create', false)
      return data
    } catch (error) {
      const message = formatApiError(error)
      set((state) => ({
        error: message,
        loading: { ...state.loading, create: false },
      }))
      throw error
    }
  },

  updateTask: async (taskId, payload) => {
    setLoadingFlag(set, get, 'update', true)
    set({ error: null })

    try {
      const { data } = await api.patch(`/tasks/${taskId}`, payload)
      await get().fetchTasks({ silent: true })
      setLoadingFlag(set, get, 'update', false)
      return data
    } catch (error) {
      const message = formatApiError(error)
      set((state) => ({
        error: message,
        loading: { ...state.loading, update: false },
      }))
      throw error
    }
  },

  deleteTask: async (taskId) => {
    setLoadingFlag(set, get, 'delete', true)
    set({ error: null })

    try {
      await api.delete(`/tasks/${taskId}`)
      await get().fetchTasks({ silent: true })
      setLoadingFlag(set, get, 'delete', false)
    } catch (error) {
      const message = formatApiError(error)
      set((state) => ({
        error: message,
        loading: { ...state.loading, delete: false },
      }))
      throw error
    }
  },

  getTasksByStatus: (status) => get().tasks.filter((task) => task.status === status),

  getTaskById: (taskId) => get().tasks.find((task) => task.id === taskId),

  clearError: () => set({ error: null }),

  reset: () => set({ ...initialState, loading: { ...initialLoading } }),
}))

export const selectTasks = (state) => state.tasks
export const selectTaskLoading = (state) => state.loading
export const selectTaskError = (state) => state.error
export const selectIsFetchingTasks = (state) => state.loading.fetch
export const selectIsSavingTask = (state) => state.loading.create || state.loading.update
export const selectIsDeletingTask = (state) => state.loading.delete
