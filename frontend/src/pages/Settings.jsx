import { useState } from 'react'
import {
  User,
  Bell,
  Shield,
  Moon,
  Globe,
  Mail,
  Smartphone,
  Lock,
  KeyRound,
  Trash2,
  ChevronRight,
} from 'lucide-react'

const glassCard =
  'rounded-2xl border border-white/[0.08] bg-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md'

const inputClass =
  'w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none transition-all duration-200 hover:border-white/[0.12] focus:border-cyan-400/40 focus:shadow-[0_0_0_3px_rgba(34,211,238,0.1)]'

function Toggle({ enabled, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/[0.04] py-4 last:border-0 last:pb-0">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white">{label}</p>
        {description && <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-all duration-200 ${
          enabled
            ? 'bg-gradient-to-r from-cyan-400 to-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.4)]'
            : 'bg-zinc-700/80'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}

function SectionHeader({ icon: Icon, title, description, accent = 'cyan' }) {
  const iconClass =
    accent === 'cyan'
      ? 'border-cyan-400/25 bg-cyan-400/10 text-cyan-300'
      : accent === 'violet'
        ? 'border-violet-400/25 bg-violet-400/10 text-violet-300'
        : 'border-fuchsia-400/25 bg-fuchsia-400/10 text-fuchsia-300'

  return (
    <div className="mb-6 flex items-start gap-4">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${iconClass}`}>
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
      </div>
      <div>
        <h2 className="m-0 text-base font-semibold text-white">{title}</h2>
        {description && <p className="mt-1 text-sm text-zinc-500">{description}</p>}
      </div>
    </div>
  )
}

function SettingsCard({ children, className = '' }) {
  return <div className={`${glassCard} p-6 sm:p-8 ${className}`}>{children}</div>
}

export default function Settings() {
  const [darkMode, setDarkMode] = useState(true)
  const [account, setAccount] = useState({
    displayName: 'Alex Morgan',
    email: 'alex@taskflow.app',
    language: 'en',
  })
  const [notifications, setNotifications] = useState({
    emailDigest: true,
    pushTasks: true,
    pushMentions: true,
    weeklyReport: false,
    marketing: false,
  })
  const [security, setSecurity] = useState({
    twoFactor: false,
    loginAlerts: true,
  })

  const updateNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="settings-page space-y-6 sm:space-y-8 [&_h1]:m-0 [&_h2]:m-0">
      <header>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-400/80">
          Preferences
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage your account, notifications, and security preferences.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Appearance / Dark mode */}
        <SettingsCard className="lg:col-span-2">
          <SectionHeader
            icon={Moon}
            title="Appearance"
            description="Customize how TaskFlow looks on your device."
            accent="violet"
          />
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 sm:p-5">
            <Toggle
              enabled={darkMode}
              onChange={setDarkMode}
              label="Dark mode"
              description="Use a dark theme optimized for low-light environments. (UI preview — app uses dark theme by default.)"
            />
            <div className="mt-4 flex gap-3">
              <div
                className={`flex flex-1 flex-col items-center rounded-xl border p-4 transition-all duration-200 ${
                  darkMode
                    ? 'border-cyan-400/40 bg-cyan-400/10 shadow-[0_0_20px_rgba(34,211,238,0.1)]'
                    : 'border-white/[0.08] bg-white/[0.03] opacity-60'
                }`}
              >
                <div className="h-16 w-full rounded-lg bg-[#050508] ring-1 ring-white/10" />
                <p className="mt-2 text-xs font-medium text-white">Dark</p>
              </div>
              <div
                className={`flex flex-1 flex-col items-center rounded-xl border p-4 transition-all duration-200 ${
                  !darkMode
                    ? 'border-cyan-400/40 bg-cyan-400/10'
                    : 'border-white/[0.08] bg-white/[0.03] opacity-60'
                }`}
              >
                <div className="h-16 w-full rounded-lg bg-zinc-100 ring-1 ring-zinc-300" />
                <p className="mt-2 text-xs font-medium text-white">Light</p>
              </div>
            </div>
          </div>
        </SettingsCard>

        {/* Account */}
        <SettingsCard>
          <SectionHeader
            icon={User}
            title="Account"
            description="Update your personal account details."
          />
          <div className="space-y-4">
            <div>
              <label htmlFor="displayName" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                Display name
              </label>
              <input
                id="displayName"
                type="text"
                value={account.displayName}
                onChange={(e) => setAccount({ ...account, displayName: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" strokeWidth={1.75} />
                <input
                  id="email"
                  type="email"
                  value={account.email}
                  onChange={(e) => setAccount({ ...account, email: e.target.value })}
                  className={`${inputClass} pl-11`}
                />
              </div>
            </div>
            <div>
              <label htmlFor="language" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                Language
              </label>
              <div className="relative">
                <Globe className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" strokeWidth={1.75} />
                <select
                  id="language"
                  value={account.language}
                  onChange={(e) => setAccount({ ...account, language: e.target.value })}
                  className={`${inputClass} cursor-pointer appearance-none pl-11`}
                >
                  <option value="en" className="bg-[#0c0c12]">English (US)</option>
                  <option value="es" className="bg-[#0c0c12]">Español</option>
                  <option value="fr" className="bg-[#0c0c12]">Français</option>
                  <option value="de" className="bg-[#0c0c12]">Deutsch</option>
                </select>
              </div>
            </div>
            <button
              type="button"
              className="mt-2 w-full rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 py-2.5 text-sm font-semibold text-[#041014] transition-all hover:shadow-[0_0_24px_rgba(34,211,238,0.35)]"
            >
              Save changes
            </button>
          </div>
        </SettingsCard>

        {/* Notifications */}
        <SettingsCard>
          <SectionHeader
            icon={Bell}
            title="Notifications"
            description="Choose what you want to be notified about."
            accent="violet"
          />
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 sm:px-5">
            <Toggle
              enabled={notifications.pushTasks}
              onChange={() => updateNotification('pushTasks')}
              label="Task reminders"
              description="Get notified when tasks are due or assigned to you."
            />
            <Toggle
              enabled={notifications.pushMentions}
              onChange={() => updateNotification('pushMentions')}
              label="Mentions & comments"
              description="Alerts when someone mentions you or replies."
            />
            <Toggle
              enabled={notifications.emailDigest}
              onChange={() => updateNotification('emailDigest')}
              label="Email notifications"
              description="Receive important updates via email."
            />
            <Toggle
              enabled={notifications.weeklyReport}
              onChange={() => updateNotification('weeklyReport')}
              label="Weekly productivity report"
              description="Summary of your stats every Monday morning."
            />
            <Toggle
              enabled={notifications.marketing}
              onChange={() => updateNotification('marketing')}
              label="Product updates"
              description="News about new features and tips."
            />
          </div>
        </SettingsCard>

        {/* Security */}
        <SettingsCard className="lg:col-span-2">
          <SectionHeader
            icon={Shield}
            title="Security"
            description="Keep your account safe and secure."
            accent="cyan"
          />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 sm:px-5">
              <Toggle
                enabled={security.twoFactor}
                onChange={() => setSecurity((s) => ({ ...s, twoFactor: !s.twoFactor }))}
                label="Two-factor authentication"
                description="Add an extra layer of security with an authenticator app."
              />
              <Toggle
                enabled={security.loginAlerts}
                onChange={() => setSecurity((s) => ({ ...s, loginAlerts: !s.loginAlerts }))}
                label="Login alerts"
                description="Email me when a new device signs in."
              />
            </div>
            <div className="space-y-3">
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 text-left transition-all duration-200 hover:border-white/[0.12] hover:bg-white/[0.06]"
              >
                <div className="flex items-center gap-3">
                  <Lock className="h-4 w-4 text-cyan-400" strokeWidth={1.75} />
                  <div>
                    <p className="text-sm font-medium text-white">Change password</p>
                    <p className="text-xs text-zinc-500">Last updated 30 days ago</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-600" strokeWidth={1.75} />
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 text-left transition-all duration-200 hover:border-white/[0.12] hover:bg-white/[0.06]"
              >
                <div className="flex items-center gap-3">
                  <KeyRound className="h-4 w-4 text-violet-400" strokeWidth={1.75} />
                  <div>
                    <p className="text-sm font-medium text-white">Active sessions</p>
                    <p className="text-xs text-zinc-500">2 devices signed in</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-600" strokeWidth={1.75} />
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 text-left transition-all duration-200 hover:border-white/[0.12] hover:bg-white/[0.06]"
              >
                <div className="flex items-center gap-3">
                  <Smartphone className="h-4 w-4 text-violet-400" strokeWidth={1.75} />
                  <div>
                    <p className="text-sm font-medium text-white">Connected apps</p>
                    <p className="text-xs text-zinc-500">Manage third-party access</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-600" strokeWidth={1.75} />
              </button>
            </div>
          </div>
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/[0.06] p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-red-300">Delete account</p>
                <p className="mt-1 text-xs text-zinc-500">
                  Permanently remove your account and all associated data.
                </p>
              </div>
              <button
                type="button"
                className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/20"
              >
                <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                Delete account
              </button>
            </div>
          </div>
        </SettingsCard>
      </div>
    </div>
  )
}
