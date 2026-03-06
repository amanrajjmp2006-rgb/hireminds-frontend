import { useState } from "react"
import { parseJD, generateAssessment } from "../services/api"

const s = {
  page: { backgroundColor:"#0F172A", minHeight:"100vh" },
  header: { backgroundColor:"#1E293B", borderBottom:"1px solid #334155", padding:"16px 32px", display:"flex", justifyContent:"space-between", alignItems:"center" },
  logo: { color:"white", fontWeight:"bold", fontSize:"20px" },
  muted: { color:"#94A3B8", fontSize:"14px" },
  hero: { textAlign:"center", padding:"64px 16px 32px" },
  h1: { color:"white", fontSize:"48px", fontWeight:"bold", marginBottom:"16px" },
  subtitle: { color:"#94A3B8", fontSize:"20px" },
  container: { maxWidth:"768px", margin:"0 auto", padding:"0 16px 64px" },
  card: { backgroundColor:"#1E293B", borderRadius:"16px", padding:"32px", border:"1px solid #334155", marginBottom:"24px" },
  label: { color:"#94A3B8", fontSize:"14px", display:"block", marginBottom:"8px" },
  textarea: { width:"100%", backgroundColor:"#0F172A", border:"1px solid #334155", color:"white", borderRadius:"12px", padding:"12px", fontSize:"16px", resize:"none", outline:"none", fontFamily:"sans-serif", boxSizing:"border-box" },
  btnRow: { display:"flex", gap:"16px", marginTop:"16px" },
  btn: { flex:1, backgroundColor:"#2563EB", color:"white", border:"none", borderRadius:"12px", padding:"14px 24px", fontSize:"16px", fontWeight:"600", cursor:"pointer" },
  btnDisabled: { flex:1, backgroundColor:"#2563EB", color:"white", border:"none", borderRadius:"12px", padding:"14px 24px", fontSize:"16px", fontWeight:"600", cursor:"not-allowed", opacity:0.5 },
  error: { backgroundColor:"rgba(239,68,68,0.2)", border:"1px solid #EF4444", color:"#FCA5A5", borderRadius:"12px", padding:"16px", marginBottom:"16px" },
  grid: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"16px" },
  gridItem: { backgroundColor:"#0F172A", borderRadius:"12px", padding:"16px" },
  gridLabel: { color:"#94A3B8", fontSize:"12px", marginBottom:"4px" },
  gridValue: { color:"white", fontWeight:"bold" },
  skillRow: { display:"flex", flexWrap:"wrap", gap:"8px", marginTop:"8px" },
  skill: { backgroundColor:"rgba(37,99,235,0.2)", color:"#60A5FA", border:"1px solid rgba(37,99,235,0.3)", borderRadius:"999px", padding:"4px 12px", fontSize:"14px" },
  qCard: { backgroundColor:"#1E293B", borderRadius:"16px", padding:"24px", border:"1px solid #334155", marginBottom:"16px" },
  badge: { backgroundColor:"#2563EB", color:"white", fontSize:"12px", fontWeight:"bold", padding:"4px 12px", borderRadius:"999px", marginRight:"8px" },
  shareCard: { backgroundColor:"#1E293B", borderRadius:"16px", padding:"24px", border:"1px solid #334155", marginTop:"24px" },
  linkBox: { backgroundColor:"#0F172A", border:"1px solid #334155", borderRadius:"12px", padding:"12px 16px", color:"#94A3B8", fontFamily:"monospace", fontSize:"14px", wordBreak:"break-all", marginBottom:"12px" },
  copyBtn: { backgroundColor:"#2563EB", color:"white", border:"none", borderRadius:"12px", padding:"12px 24px", fontSize:"14px", fontWeight:"600", cursor:"pointer" },
}

export default function Dashboard() {
  const [jdText, setJdText] = useState("")
  const [parsedData, setParsedData] = useState(null)
  const [jobId, setJobId] = useState("")
  const [assessmentData, setAssessmentData] = useState(null)
  const [assessmentId, setAssessmentId] = useState("")
  const [loadingParse, setLoadingParse] = useState(false)
  const [loadingAssess, setLoadingAssess] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [copied, setCopied] = useState(false)

  const handleParse = async () => {
    try { setLoadingParse(true); setErrorMsg(""); const data = await parseJD(jdText); setParsedData(data); setJobId(data.job_id) }
    catch (err) { setErrorMsg(err.message) }
    finally { setLoadingParse(false) }
  }

  const handleGenerate = async () => {
    try { setLoadingAssess(true); setErrorMsg(""); const data = await generateAssessment(jobId); setAssessmentData(data); setAssessmentId(data.assessment_id) }
    catch (err) { setErrorMsg(err.message) }
    finally { setLoadingAssess(false) }
  }

  const testLink = `${window.location.origin}/test/${assessmentId}`

  const handleCopy = () => {
    navigator.clipboard.writeText(testLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={s.page}>
      <header style={s.header}>
        <span style={s.logo}>⚡ HireMinds AI</span>
        <span style={s.muted}>Powered by AI</span>
      </header>

      <div style={s.hero}>
        <h1 style={s.h1}>Smarter Hiring Starts Here.</h1>
        <p style={s.subtitle}>Paste any job description. Get a custom AI assessment in seconds.</p>
      </div>

      <div style={s.container}>
        <div style={s.card}>
          <label style={s.label}>Job Description</label>
          <textarea rows={10} value={jdText} onChange={e => setJdText(e.target.value)}
            placeholder="Paste the full job description here..." style={s.textarea} />
          <div style={s.btnRow}>
            <button onClick={handleParse} disabled={loadingParse || !jdText}
              style={loadingParse || !jdText ? s.btnDisabled : s.btn}>
              {loadingParse ? "⏳ Parsing..." : "🔍 Parse Job Description"}
            </button>
            <button onClick={handleGenerate} disabled={loadingAssess || !jobId}
              style={loadingAssess || !jobId ? s.btnDisabled : s.btn}>
              {loadingAssess ? "⏳ Generating..." : "⚡ Generate Assessment"}
            </button>
          </div>
        </div>

        {errorMsg && <div style={s.error}>❌ {errorMsg}</div>}

        {parsedData && (
          <div style={s.card}>
            <h2 style={{color:"white", fontWeight:"bold", fontSize:"18px", marginBottom:"16px"}}>Parsed Results ⚡</h2>
            <div style={s.grid}>
              {[{label:"Role",value:parsedData.role},{label:"Seniority",value:parsedData.seniority},{label:"Domain",value:parsedData.domain},{label:"Experience",value:parsedData.experience_years}].map(item => (
                <div key={item.label} style={s.gridItem}>
                  <div style={s.gridLabel}>{item.label}</div>
                  <div style={s.gridValue}>{item.value || "Not specified"}</div>
                </div>
              ))}
            </div>
            <div style={s.muted}>Skills</div>
            <div style={s.skillRow}>
              {(parsedData.required_skills || []).map((skill, i) => (
                <span key={i} style={s.skill}>{skill}</span>
              ))}
            </div>
          </div>
        )}

        {assessmentData && (
          <div>
            <div style={s.card}>
              <h2 style={{color:"white", fontWeight:"bold", fontSize:"18px"}}>Assessment Generated ✅</h2>
              <p style={{color:"#94A3B8", fontSize:"14px", marginTop:"4px"}}>{assessmentData.total_questions} questions · 60 minutes</p>
            </div>

            {(assessmentData.questions || []).map((q, i) => (
              <div key={q.id} style={s.qCard}>
                <div style={{marginBottom:"12px"}}>
                  <span style={s.badge}>Q{i+1}</span>
                  <span style={{color:"#94A3B8", fontSize:"12px"}}>{q.type === "mcq" ? "MCQ" : q.type === "case" ? "Case Study" : "Behavioral"}</span>
                </div>
                <p style={{color:"white", lineHeight:"1.6", marginBottom:"12px"}}>{q.question || q.text}</p>
                {q.type === "mcq" && (
                  <div>
                    {(q.options || []).map((opt, j) => (
                      <div key={j} style={{border:"1px solid #334155", borderRadius:"10px", padding:"10px 14px", color:"#CBD5E1", marginBottom:"8px"}}>{opt}</div>
                    ))}
                  </div>
                )}
                {(q.type === "case" || q.type === "behavioral") && (
                  <div style={{backgroundColor:"#0F172A", border:"1px solid #334155", borderRadius:"10px", padding:"14px", color:"#94A3B8", fontSize:"14px"}}>
                    Long answer — candidates will type here
                  </div>
                )}
              </div>
            ))}

            <div style={s.shareCard}>
              <h3 style={{color:"white", fontWeight:"bold", fontSize:"18px", marginBottom:"16px"}}>🔗 Share With Candidates</h3>
              <div style={s.linkBox}>{testLink}</div>
              <button onClick={handleCopy} style={s.copyBtn}>{copied ? "Copied! ✓" : "Copy Link"}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}