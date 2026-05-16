import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import DashboardLayout from './components/layout/DashboardLayout'
import ProtectedRoute from './routes/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Analytics from './pages/Analytics'
import Profile from './pages/Profile'
import Settings from './pages/Settings'

const protectedRoutes = [
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/tasks', element: <Tasks /> },
  { path: '/analytics', element: <Analytics /> },
  { path: '/profile', element: <Profile /> },
  { path: '/settings', element: <Settings /> },
]

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected — Dashboard, Tasks, Analytics, Profile, Settings */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            {protectedRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Route>
        </Route>
      </Routes>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#0f0f14',
            color: '#fafafa',
            border: '1px solid rgba(255,255,255,0.08)',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#22d3ee', secondary: '#030a0c' },
          },
          error: {
            iconTheme: { primary: '#f87171', secondary: '#0f0f14' },
          },
        }}
      />
    </BrowserRouter>
  )
}
