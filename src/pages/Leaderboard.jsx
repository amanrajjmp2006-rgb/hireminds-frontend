import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { downloadVCard, getLeaderboard } from '../services/api'

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
      <main className="container" style={{ paddingBottom: 28 }}>
        <h1 style={{ marginBottom: 14 }}>Leaderboard</h1>
        {error && <p className="error">{error}</p>}
        {loading && <div className="skeleton" style={{ height: 170 }} />}

        {!loading && (
          <div className="glass round-2xl table-wrap">
            <table className="table">
              <thead>
                <tr><th>Rank</th><th>Candidate</th><th>Score</th><th>Profile</th></tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={`${row.candidate_id || row.name}-${idx}`} className="row-anim" style={{ background: idx < 3 ? 'rgba(37,99,235,.12)' : 'transparent' }}>
                    <td style={{ color: '#67e8f9', fontWeight: 600 }}>#{idx + 1}</td>
                    <td>{row.name || row.candidate_name || 'Unknown'}</td>
                    <td style={{ color: '#93c5fd', fontWeight: 600 }}>{row.score ?? 0}</td>
                    <td>{row.candidate_id ? <button onClick={() => downloadVCard(row.candidate_id)} className="btn btn-secondary">Download Candidate Profile</button> : <span style={{ color: '#64748b' }}>N/A</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button onClick={() => navigate('/')} className="btn gradient-btn glow-hover mt-6">Back to Dashboard</button>
      </main>
    </div>
  )
}
