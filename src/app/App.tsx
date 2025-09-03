import { ThemeProvider } from './providers'
import { AppRoutes } from './routes'
import { BrowserRouter, useNavigate, NavLink, useLocation } from 'react-router-dom'
import { ReactNode } from 'react'
import Button from '@/components/common/button'

function NavItem({ to, children }: { to: string; children: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to))

  return (
    <Button
      onClick={() => navigate(to)}
      aria-current={isActive ? 'page' : undefined}
      className={`rounded-lg border px-3 py-1 hover:opacity-80 active:scale-[0.98] ${
        isActive ? 'bg-black text-white dark:bg-white dark:text-black' : ''
      }`}
      style={{ width: 'auto', flexShrink: 0, minHeight: 40 }}
    >
      {children}
    </Button>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <div className="p-4 space-y-3">
          <header className="font-semibold flex-row items-center justify-between gap-3 rounded-2xl border p-2">
            <div
              className="px-2 mx-auto text-lg font-semibold items-center"
              >
              Chip and Ales
            </div>

            <nav className="flex-rrvs items-center gap-3">
              <NavItem to="/home">Setup</NavItem>
              <NavItem to="/game">Game</NavItem>
              <NavItem to="/summary">Summary</NavItem>
            </nav>
          </header>

          <main>
            <AppRoutes />
          </main>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  )
}