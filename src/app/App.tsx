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
    >
      {children}
    </Button>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="p-4 space-y-3">
          <header className="font-semibold flex items-center justify-between rounded-2xl border p-3">
            {/* Make the title itself the Home link */}
            <NavItem
              to="/"
              aria-label="Go to Home"
            >
              Chip and Ales
            </NavItem>

            <nav className="flex items-center gap-3">
              {/* Removed separate 'Home' item; the title now handles Home */}
              <NavItem to="/">Home</NavItem>
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