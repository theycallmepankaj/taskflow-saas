import axios from 'axios'

import { API_BASE_URL, API_TIMEOUT_MS, IS_DEV } from './config'
import { attachAuthRequestInterceptor } from './interceptors/request'
import { attachAuthResponseInterceptor } from './interceptors/response'

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

/**
 * Shared Axios instance for the FastAPI backend.
 * @param {import('axios').CreateAxiosDefaults} [overrides]
 */
export function createApiClient(overrides = {}) {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT_MS,
    headers: { ...defaultHeaders, ...overrides.headers },
    ...overrides,
  })

  attachAuthRequestInterceptor(client)
  attachAuthResponseInterceptor(client)

  if (IS_DEV) {
    client.interceptors.request.use((config) => {
      console.debug(`[api] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`)
      return config
    })
  }

  return client
}

/** Default app-wide API client. */
const api = createApiClient()

export default api
