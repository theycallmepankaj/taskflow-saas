import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'

import DashboardLayout from './components/layout/DashboardLayout'
import ProtectedRoute from './routes/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminTasks from './pages/admin/AdminTasks'
import AdminAnalytics from './pages/admin/AdminAnalytics'
import AdminSettings from './pages/admin/AdminSettings'

// Tasker Pages
import TaskerDashboard from './pages/tasker/TaskerDashboard'
import TaskerTasks from './pages/tasker/TaskerTasks'
import TaskerProfile from './pages/tasker/TaskerProfile'
import TaskerSettings from './pages/tasker/TaskerSettings'

function NavigateToDashboard() {
  const user = useAuthStore((state) => state.user)
  if (!user) return <Navigate to="/" replace />
  return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/tasker/dashboard'} replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Redirect for old dashboard links */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<NavigateToDashboard />} />
          <Route path="/tasks" element={<NavigateToDashboard />} />
          <Route path="/analytics" element={<NavigateToDashboard />} />
          <Route path="/profile" element={<NavigateToDashboard />} />
          <Route path="/settings" element={<NavigateToDashboard />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/tasks" element={<AdminTasks />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
        </Route>

        {/* Tasker Routes */}
        <Route element={<ProtectedRoute allowedRoles={['tasker']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/tasker/dashboard" element={<TaskerDashboard />} />
            <Route path="/tasker/tasks" element={<TaskerTasks />} />
            <Route path="/tasker/profile" element={<TaskerProfile />} />
            <Route path="/tasker/settings" element={<TaskerSettings />} />
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
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
