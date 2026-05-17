import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import api, { removeToken, setToken } from '../api'
import { formatApiError } from '../utils/formatApiError'

const AUTH_STORAGE_KEY = 'taskflow-auth'

const initialState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  hasHydrated: false,
}

async function requestAuth(set, endpoint, payload) {
  set({ isLoading: true, error: null })

  try {
    const { data } = await api.post(endpoint, payload, { skipAuth: true })
    setToken(data.access_token)
    set({
      user: data.user,
      token: data.access_token,
      isLoading: false,
      error: null,
    })
    return data
  } catch (error) {
    set({
      error: formatApiError(error),
      isLoading: false,
    })
    throw error
  }
}

export const useAuthStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      login: async ({ email, password }) =>
        requestAuth(set, '/auth/login', {
          email: email.trim(),
          password,
        }),

      register: async ({ name, email, password }) =>
        requestAuth(set, '/auth/register', {
          name: name.trim(),
          email: email.trim(),
          password,
        }),

     logout: () => {
  removeToken()

  localStorage.removeItem('taskflow_access_token')
  localStorage.removeItem('taskflow-auth')

  set({
    user: null,
    token: null,
    error: null,
    isLoading: false,
  })

  import('./taskStore').then(({ useTaskStore }) => {
    useTaskStore.getState().reset()
  })
},

      clearError: () => set({ error: null }),

      setUser: (user) => set({ user }),

      isAuthenticated: () => Boolean(get().token),
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('[auth] Failed to restore session', error)
          removeToken()
          return
        }
        if (state?.token) {
          setToken(state.token)
        }
      },
    },
  ),
)

function markHydrated() {
  useAuthStore.setState({ hasHydrated: true })
}

if (useAuthStore.persist.hasHydrated()) {
  markHydrated()
} else {
  useAuthStore.persist.onFinishHydration(markHydrated)
}

export const selectAuthUser = (state) => state.user
export const selectAuthToken = (state) => state.token
export const selectAuthLoading = (state) => state.isLoading
export const selectAuthError = (state) => state.error
export const selectAuthHydrated = (state) => state.hasHydrated
export const selectIsAuthenticated = (state) => Boolean(state.token)
