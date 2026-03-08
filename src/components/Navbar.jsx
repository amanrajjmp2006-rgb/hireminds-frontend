import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="nav">
      <Link to="/" style={{ fontWeight: 700 }}>HireMinds AI</Link>
      <div className="nav-links">
        <Link className="nav-pill" to="/">Dashboard</Link>
        <Link className="nav-pill" to="/leaderboard/demo">Leaderboard</Link>
      </div>
    </nav>
  )
}
