import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <div className="container">
      <nav className="nav glass">
        <div className="logo">
          <div className="logo-mark">✦</div>
          <div>
            <div style={{ fontSize: 11, color: "#67e8f9", letterSpacing: "0.15em", textTransform: "uppercase" }}>HireMinds AI</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>AI Hiring Companion</div>
          </div>
        </div>
        <div className="links">
          <Link className="link" to="/">Dashboard</Link>
          <Link className="link" to="/leaderboard/demo">Leaderboard</Link>
        </div>
      </nav>
    </div>
  )
}
