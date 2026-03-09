import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { downloadVCard, getLeaderboard } from "../services/api"

export default function Leaderboard() {
  const { test_id } = useParams()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        const data = await getLeaderboard(test_id)
        setRows(Array.isArray(data) ? data : data.leaderboard || [])
      } catch {
        setError("Could not load leaderboard.")
      } finally {
        setLoading(false)
      }
    })()
  }, [test_id])

  const handleVCard = async (candidateId) => {
    const blob = await downloadVCard(candidateId)
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${candidateId}.vcf`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="container">
      <section className="glass card">
        <h1 className="title">Leaderboard</h1>
        {loading ? <p className="muted">Loading...</p> : error ? <p className="err">{error}</p> : (
          <table className="table">
            <thead><tr><th>Rank</th><th>Candidate</th><th>Score</th><th>Action</th></tr></thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.candidate_id || i} style={i < 3 ? { background: "rgba(34,211,238,0.06)" } : undefined}>
                  <td>{i + 1}</td>
                  <td>{row.candidate_name || row.name || "Unknown"}</td>
                  <td>{row.score ?? "-"}</td>
                  <td>{row.candidate_id && <button className="btn btn-outline" onClick={() => handleVCard(row.candidate_id)}>Download Candidate Profile</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  )
}
