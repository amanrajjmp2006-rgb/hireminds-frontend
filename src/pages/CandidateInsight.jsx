import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function CandidateInsight() {
  const { candidate_id } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const row = state?.row || {}
  const score = row.score ?? 0

  const dimensions = [
    { label: 'Technical', value: Math.max(0, score - 8) },
    { label: 'Analytical', value: Math.max(0, score - 4) },
    { label: 'Decision', value: score },
    { label: 'Communication', value: Math.min(100, score + 3) },
  ]

  const avg = Math.round(dimensions.reduce((sum, item) => sum + item.value, 0) / dimensions.length)

  return (
    <div className="app-shell">
      <Navbar />
      <main className="container animate-enter" style={{ maxWidth: 980, paddingBottom: 32 }}>
        <section className="glass panel">
          <h1 className="title">{row.name || row.candidate_name || `Candidate ${candidate_id}`}</h1>
          <p className="subtitle">Score breakdown, strengths, weaknesses, and recruiter override controls.</p>

          <div className="insight-grid">
            <div className="kpi">
              <p className="k">Radar Snapshot</p>
              <div className="radar-chart" style={{ '--score': `${avg}%` }}>
                <div className="radar-core" />
              </div>
              <div className="radar-legend">
                {dimensions.map((item) => <span key={item.label}>{item.label}: {item.value}</span>)}
              </div>
            </div>

            <div className="grid-2">
              {dimensions.map((item) => (
                <div className="kpi" key={item.label}>
                  <p className="k">{item.label}</p>
                  <p className="v">{item.value} / 100</p>
                  <div className="progress"><span style={{ width: `${item.value}%` }} /></div>
                </div>
              ))}
            </div>
          </div>

          <div className="kpi" style={{ marginTop: 16 }}>
            <p className="k">Strengths</p>
            <p className="v">Strong prioritization under constraints, practical tradeoff handling, and clear reasoning.</p>
          </div>
          <div className="kpi" style={{ marginTop: 12 }}>
            <p className="k">Weaknesses</p>
            <p className="v">Needs deeper risk quantification and stronger stakeholder communication framing.</p>
          </div>

          <div className="row" style={{ marginTop: 16 }}>
            <button className="btn gradient-btn glow-hover">Override: Advance</button>
            <button className="btn btn-secondary">Override: Review</button>
            <button className="btn btn-ghost">Override: Reject</button>
          </div>

          <button className="btn btn-secondary mt-6" onClick={() => navigate(-1)}>Back to leaderboard</button>
        </section>
      </main>
    </div>
  )
}
