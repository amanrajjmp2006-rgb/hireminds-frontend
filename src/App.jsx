import { Route, Routes } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import TestPage from "./pages/TestPage"
import Leaderboard from "./pages/Leaderboard"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/test/:test_id" element={<TestPage />} />
      <Route path="/leaderboard/:test_id" element={<Leaderboard />} />
    </Routes>
  )
}
