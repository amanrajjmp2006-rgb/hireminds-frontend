import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getLeaderboard } from '../services/api'

const rankRecommendation = (score = 0) => {
  if (score >= 80) return 'Advance'
  if (score >= 60) return 'Review'
  return 'Reject'
}

export default function Leaderboard() {
  const { test_id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [rows, setRows] = useState([])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getLeaderboard(test_id)
        const list = Array.isArray(data) ? data : data?.leaderboard ?? []
        setRows(list.sort((a, b) => (b.score ?? 0) - (a.score ?? 0)))
      } catch (e) {
        setError(e?.response?.data?.message || 'Unable to load leaderboard.')
      } finally {
        setLoading(false)
      }
    })()
  }, [test_id])

  return (
    <div className="app-shell">
      <Navbar />
      <main className="container animate-enter" style={{ paddingBottom: 32 }}>
        <h1 className="title" style={{ marginBottom: 16 }}>Candidate Leaderboard</h1>
        {error && <p className="error">{error}</p>}
        {loading && <div className="skeleton" style={{ height: 170 }} />}

        {!loading && (
          <div className="glass panel table-wrap">
            <table className="table premium-table">
              <thead>
                <tr><th>Rank</th><th>Candidate</th><th>Score</th><th>Recommendation</th><th>Insight</th></tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={`${row.candidate_id || row.name}-${idx}`} className="row-anim">
                    <td><span className="rank">#{idx + 1}</span></td>
                    <td>{row.name || row.candidate_name || 'Unknown'}</td>
                    <td className="score-pill">{row.score ?? 0}</td>
                    <td>{row.recommendation || rankRecommendation(row.score)}</td>
                    <td><button className="btn btn-secondary" onClick={() => navigate(`/candidate/${test_id}/${row.candidate_id || idx}`, { state: { row } })}>View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
