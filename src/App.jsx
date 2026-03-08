import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Leaderboard from './pages/Leaderboard'
import TestPage from './pages/TestPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/test/:test_id" element={<TestPage />} />
        <Route path="/leaderboard/:test_id" element={<Leaderboard />} />
      </Routes>
    </BrowserRouter>
  )
}
