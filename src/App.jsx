import { BrowserRouter, Routes, Route } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import TestPage from "./pages/TestPage"
import Leaderboard from "./pages/Leaderboard"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/test/:assessmentId" element={<TestPage />} />
        <Route path="/leaderboard/:assessmentId" element={<Leaderboard />} />
      </Routes>
    </BrowserRouter>
  )
}