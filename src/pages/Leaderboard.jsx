import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import { downloadVCard, getLeaderboard } from "../services/api"

export default function Leaderboard() {
  const { test_id } = useParams()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLeaderboard(test_id)
      .then((data) => setRows((data.data || data || []).sort((a, b) => (b.score || 0) - (a.score || 0))))
      .finally(() => setLoading(false))
  }, [test_id])

  const handleDownload = async (candidateId) => {
    const blob = await downloadVCard(candidateId)
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `candidate-${candidateId}.vcf`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="app-shell pb-10">
      <Navbar />
      <main className="mx-auto w-[min(900px,92%)]">
        <h1 className="mb-4 text-3xl font-bold">Leaderboard</h1>
        <div className="glass overflow-hidden">
          {loading ? (
            <p className="p-6 text-slate-400">Loading leaderboard...</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-slate-300">
                <tr>
                  <th className="p-3 text-left">Rank</th>
                  <th className="p-3 text-left">Candidate</th>
                  <th className="p-3 text-left">Score</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <motion.tr
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={r.candidate_id || i}
                    className={i < 3 ? "bg-blue-400/5" : ""}
                  >
                    <td className="p-3">#{i + 1}</td>
                    <td className="p-3">{r.candidate_name || r.name}</td>
                    <td className="p-3 font-semibold text-cyan-300">{r.score ?? "-"}</td>
                    <td className="p-3">
                      <button onClick={() => handleDownload(r.candidate_id)} className="rounded-lg border border-white/20 px-3 py-1 hover:bg-white/10">Download Candidate Profile</button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}
