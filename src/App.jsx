import { BrowserRouter, Routes, Route } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import TestPage from "./pages/TestPage"
import Leaderboard from "./pages/Leaderboard"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/test/:id" element={<TestPage />} />
        <Route path="/leaderboard/:id" element={<Leaderboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App