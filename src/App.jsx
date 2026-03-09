import { Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import Dashboard from "./pages/Dashboard"
import Leaderboard from "./pages/Leaderboard"
import TestPage from "./pages/TestPage"

export default function App() {
  return (
    <div>
      <div className="animated-bg" />
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/test/:test_id" element={<TestPage />} />
        <Route path="/leaderboard/:test_id" element={<Leaderboard />} />
      </Routes>
    </div>
  )
}
