import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getLeaderboard } from "../services/api"

const s = {
  page: { backgroundColor:"#0F172A", minHeight:"100vh" },
  header: { backgroundColor:"#1E293B", borderBottom:"1px solid #334155", padding:"16px 32px", display:"flex", justifyContent:"space-between", alignItems:"center" },
  logo: { color:"white", fontWeight:"bold", fontSize:"20px" },
  muted: { color:"#94A3B8", fontSize:"14px" },
  hero: { textAlign:"center", padding:"48px 16px 32px" },
  container: { maxWidth:"768px", margin:"0 auto", padding:"0 16px 64px" },
  table: { width:"100%", borderCollapse:"collapse", backgroundColor:"#1E293B", borderRadius:"16px", overflow:"hidden", border:"1px solid #334155" },
  th: { textAlign:"left", color:"#94A3B8", fontSize:"14px", fontWeight:"600", padding:"16px 24px", borderBottom:"1px solid #334155" },
  td: { padding:"16px 24px", borderBottom:"1px solid #334155", color:"white" },
  backBtn: { marginTop:"32px", width:"100%", backgroundColor:"#1E293B", color:"white", border:"1px solid #334155", borderRadius:"12px", padding:"14px", fontSize:"16px", fontWeight:"600", cursor:"pointer" },
}

const getBadge = (status) => {
  if(status==="Advance") return {backgroundColor:"rgba(22,163,74,0.2)", color:"#4ADE80", border:"1px solid rgba(22,163,74,0.3)", borderRadius:"999px", padding:"4px 12px", fontSize:"12px", fontWeight:"600"}
  if(status==="Reject") return {backgroundColor:"rgba(239,68,68,0.2)", color:"#F87171", border:"1px solid rgba(239,68,68,0.3)", borderRadius:"999px", padding:"4px 12px", fontSize:"12px", fontWeight:"600"}
  return {backgroundColor:"rgba(148,163,184,0.2)", color:"#94A3B8", border:"1px solid rgba(148,163,184,0.3)", borderRadius:"999px", padding:"4px 12px", fontSize:"12px", fontWeight:"600"}
}

export default function Leaderboard() {
  const { assessmentId } = useParams()
  const navigate = useNavigate()
  const [rankings, setRankings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLeaderboard(assessmentId)
      .then(data => setRankings(data.sort((a,b)=>b.score-a.score)))
      .catch(console.log)
      .finally(() => setLoading(false))
  }, [assessmentId])

  const getRank = (i) => i===0?"🥇":i===1?"🥈":i===2?"🥉":`#${i+1}`
  const getRankColor = (i) => i===0?"#F59E0B":i===1?"#94A3B8":i===2?"#CD7F32":"white"

  return (
    <div style={s.page}>
      <header style={s.header}>
        <span style={s.logo}>⚡ HireMinds AI</span>
        <span style={s.muted}>Powered by AI</span>
      </header>
      <div style={s.hero}>
        <h1 style={{color:"white", fontSize:"40px", fontWeight:"bold"}}>🏆 Candidate Leaderboard</h1>
        <p style={{color:"#94A3B8", marginTop:"8px"}}>Live rankings for this assessment</p>
      </div>
      <div style={s.container}>
        {loading ? (
          <p style={{color:"#94A3B8", textAlign:"center", padding:"64px"}}>Loading rankings...</p>
        ) : rankings.length === 0 ? (
          <div style={{backgroundColor:"#1E293B", borderRadius:"16px", padding:"32px", border:"1px solid #334155", textAlign:"center"}}>
            <p style={{color:"white", fontWeight:"bold", fontSize:"18px"}}>No candidates yet</p>
            <p style={{color:"#94A3B8", marginTop:"8px"}}>Share the test link to get started.</p>
          </div>
        ) : (
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Rank</th>
                <th style={s.th}>Candidate</th>
                <th style={s.th}>Score</th>
                <th style={s.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((c,i) => (
                <tr key={i} style={{backgroundColor:i===0?"rgba(245,158,11,0.1)":"transparent"}}>
                  <td style={{...s.td, color:getRankColor(i), fontWeight:"bold", fontSize:"20px"}}>{getRank(i)}</td>
                  <td style={{...s.td, fontWeight:"600"}}>{c.name}</td>
                  <td style={{...s.td, fontWeight:"bold"}}>{c.score} / 100</td>
                  <td style={s.td}><span style={getBadge(c.recommendation)}>{c.recommendation||"Pending"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button onClick={()=>navigate("/")} style={s.backBtn}>← Back to Dashboard</button>
      </div>
    </div>
  )
}