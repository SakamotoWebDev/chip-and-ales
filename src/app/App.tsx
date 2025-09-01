import { ThemeProvider } from './providers'
import { AppRoutes } from './routes'
import { BrowserRouter, NavLink } from 'react-router-dom'
import { ReactNode } from 'react'

function NavItem({ to, children }: { to: string; children: ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-lg border px-3 py-1 hover:opacity-80 active:scale-[0.98] ${
          isActive ? 'bg-black text-white dark:bg-white dark:text-black' : ''
        }`
      }
    >
      {children}
    </NavLink>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="p-4 space-y-3">
          <header className="flex items-center justify-between rounded-2xl border p-3">
            <div className="text-lg font-semibold">Chip and Ales</div>
            <nav className="flex items-center gap-2">
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