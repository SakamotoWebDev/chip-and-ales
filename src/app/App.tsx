import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from './providers'
import { AppRoutes } from './routes'

export default function App() {
  return (
    <ThemeProvider>
      <div className="p-4">
        <header className="rounded-2xl border p-3 mb-3">
          <div className="text-lg font-semibold">Chip N Dales (App Shell)</div>
          <div className="text-sm opacity-70">If you can see this, React mounted. If nothing appears below, check routes.</div>
        </header>
        <AppRoutes />
      </div>
    </ThemeProvider>
  )
}