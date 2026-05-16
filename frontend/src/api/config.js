/** Backend origin (no trailing slash). Set `VITE_API_URL` in `.env` for production. */
export const API_ROOT = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000').replace(
  /\/$/,
  '',
)

/** FastAPI routes are mounted under `/api`. */
export const API_BASE_URL = `${API_ROOT}/api`

export const API_TIMEOUT_MS = 30_000

export const IS_DEV = import.meta.env.DEV

/** Paths that must not send a stored JWT (login/register). */
export const PUBLIC_API_PATHS = ['/auth/login', '/auth/register']
