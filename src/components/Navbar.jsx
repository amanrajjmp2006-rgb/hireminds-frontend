import { Link } from 'react-router-dom'

function HireMindsLogo() {
  return (
    <div className="logo-wrap" aria-hidden>
      <svg viewBox="0 0 64 64" className="logo-brain">
        <path d="M20 19c-5 0-9 4-9 9 0 4 2 7 5 8-1 5 2 10 8 10 1 5 5 8 10 8V10c-5 0-9 3-10 9-2 0-3 0-4 0Z" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.65" />
        <path d="M44 19c5 0 9 4 9 9 0 4-2 7-5 8 1 5-2 10-8 10-1 5-5 8-10 8V10c5 0 9 3 10 9h4Z" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.65" />
        {[ [21,22], [30,19], [42,22], [19,33], [32,31], [45,34], [24,44], [32,46], [40,43] ].map(([x,y], i) => (
          <circle key={i} cx={x} cy={y} r="2.4" className="logo-node" style={{ animationDelay: `${i * 0.18}s` }} />
        ))}
      </svg>
    </div>
  )
}

export default function Navbar() {
  return (
    <nav className="nav glass">
      <Link to="/" className="brand-row">
        <HireMindsLogo />
        <div>
          <p className="brand">HireMinds</p>
          <p className="brand-sub">AI Hiring Companion</p>
        </div>
      </Link>
      <div className="nav-links">
        <Link className="nav-pill" to="/">Dashboard</Link>
        <Link className="nav-pill" to="/leaderboard/demo">Leaderboard</Link>
        <Link className="nav-pill" to="/">HR Console</Link>
      </div>
    </nav>
  )
}
