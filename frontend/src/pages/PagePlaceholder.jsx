import { useLocation } from 'react-router-dom'

const titles = {
  '/tasks': 'Tasks',
  '/analytics': 'Analytics',
  '/profile': 'Profile',
  '/settings': 'Settings',
}

export default function PagePlaceholder() {
  const { pathname } = useLocation()
  const title = titles[pathname] ?? 'Page'

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-sm sm:p-8">
      <h1 className="m-0 text-xl font-semibold text-white sm:text-2xl">{title}</h1>
      <p className="mt-2 text-sm text-zinc-500">Content coming soon.</p>
    </div>
  )
}
