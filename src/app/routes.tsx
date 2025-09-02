// /src/app/routes.tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from '../pages/homePage'
import GamePage from '../pages/gamePage'
import MatchSummaryPage from '../pages/matchSummaryPage'

function DebugPage() {
  return (
    <div className="rounded-2xl border p-3">
      <div className="text-sm">Router OK. Try going to 
        <a className="emphasis" href="/">/</a>, 
        <a className="emphasis" href="/game">/game</a>,
        <a className="emphasis" href="/summary">/summary</a>,
         </div>
    </div>
  )
}

export function AppRoutes() {
  return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/summary" element={<MatchSummaryPage />} />
        <Route path="/__debug" element={<DebugPage />} />
        <Route path="*" element={<Navigate to="/__debug" replace />} />
      </Routes>
  )
}

