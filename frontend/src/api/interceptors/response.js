import { removeToken } from '../token'

async function handleUnauthorized() {
  removeToken()
  const { useAuthStore } = await import('../../store/authStore')
  useAuthStore.getState().logout()
}

/**
 * Global response handling (e.g. expired JWT).
 */
export function attachAuthResponseInterceptor(client) {
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error.response?.status
      const requestUrl = error.config?.url ?? ''

      if (status === 401 && !requestUrl.includes('/auth/login')) {
        await handleUnauthorized()
      }

      return Promise.reject(error)
    },
  )
}
