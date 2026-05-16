import { Navigate, Outlet, useLocation } from 'react-router-dom'

import {
  selectAuthHydrated,
  selectAuthToken,
  useAuthStore,
} from '../store/authStore'

export default function ProtectedRoute() {
  const token = useAuthStore(selectAuthToken)
  const hasHydrated = useAuthStore(selectAuthHydrated)
  const location = useLocation()

  if (!hasHydrated) {
    return (
      <div
        className="flex min-h-dvh items-center justify-center bg-[#050508]"
        aria-label="Loading session"
      >
        <span className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-400" />
      </div>
    )
  }

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
