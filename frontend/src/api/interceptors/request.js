import { PUBLIC_API_PATHS } from '../config'
import { getToken } from '../token'

function isPublicPath(url = '') {
  const path = url.startsWith('http') ? new URL(url).pathname : url
  return PUBLIC_API_PATHS.some((publicPath) => path.includes(publicPath))
}

/**
 * Attach JSON defaults and Bearer token when available.
 */
export function attachAuthRequestInterceptor(client) {
  client.interceptors.request.use(
    (config) => {
      const token = getToken()
      const skipAuth = config.skipAuth === true || isPublicPath(config.url)

      if (token && !skipAuth) {
        config.headers.Authorization = `Bearer ${token}`
      }

      if (config.data instanceof FormData) {
        delete config.headers['Content-Type']
      }

      return config
    },
    (error) => Promise.reject(error),
  )
}
