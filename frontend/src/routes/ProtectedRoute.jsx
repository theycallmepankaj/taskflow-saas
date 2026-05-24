import { Navigate, Outlet, useLocation } from 'react-router-dom'

import {
  selectAuthHydrated,
  selectAuthToken,
  selectAuthUser,
  useAuthStore,
} from '../store/authStore'

export default function ProtectedRoute({ allowedRoles }) {
  const token = useAuthStore(selectAuthToken)
  const user = useAuthStore(selectAuthUser)
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

  console.debug('[ProtectedRoute] check:', { path: location.pathname, hasToken: !!token, hasUser: !!user, role: user?.role })

  if (!token || !user) {
    console.debug('[ProtectedRoute] Redirecting to login: token or user is missing')
    return <Navigate to="/" replace state={{ from: location.pathname }} />
  }

  const role = user.role || 'tasker'
  if (allowedRoles && !allowedRoles.includes(role)) {
    const defaultRedirect = role === 'admin' ? '/admin/dashboard' : '/tasker/dashboard'
    console.debug(`[ProtectedRoute] Access denied. Redirecting to ${defaultRedirect}`)
    return <Navigate to={defaultRedirect} replace />
  }

  return <Outlet />
}
