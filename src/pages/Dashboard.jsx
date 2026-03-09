import { useState } from "react"
import AssessmentPreview from "../components/AssessmentPreview"
import ShareLinkCard from "../components/ShareLinkCard"
import { createTest, generateAssessment, parseJD } from "../services/api"

export default function Dashboard() {
  const [jobDescription, setJobDescription] = useState("")
  const [parsed, setParsed] = useState(null)
  const [assessment, setAssessment] = useState(null)
  const [testId, setTestId] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState({ parse: false, generate: false, create: false })

  const onParse = async () => {
    setError("")
    setLoading((s) => ({ ...s, parse: true }))
    try {
      const res = await parseJD(jobDescription)
      setParsed({ ...res, skills: res.skills || res.required_skills || [] })
    } catch {
      setError("Unable to parse job description.")
    } finally {
      setLoading((s) => ({ ...s, parse: false }))
    }
  }

  const onGenerate = async () => {
    if (!parsed?.job_id) return
    setLoading((s) => ({ ...s, generate: true }))
    setError("")
    try {
      setAssessment(await generateAssessment(parsed.job_id))
    } catch {
      setError("Assessment generation failed.")
    } finally {
      setLoading((s) => ({ ...s, generate: false }))
    }
  }

  const onCreate = async () => {
    setLoading((s) => ({ ...s, create: true }))
    try {
      const res = await createTest(assessment)
      setTestId(res.test_id || res.id)
    } catch {
      setError("Could not create test link.")
    } finally {
      setLoading((s) => ({ ...s, create: false }))
    }
  }

  return (
    <main className="container">
      <section className="hero">
        <h1>AI Hiring Companion</h1>
        <p className="muted">Generate role-specific hiring assessments instantly.</p>
      </section>

      <section className="glass card" style={{ marginTop: 14 }}>
        <textarea className="textarea" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste Job Description" />
        <div className="row" style={{ marginTop: 12 }}>
          <button className="btn btn-glow" disabled={loading.parse || !jobDescription.trim()} onClick={onParse}>{loading.parse ? "Parsing..." : "Parse Job Description"}</button>
          <button className="btn btn-outline" disabled={loading.generate || !parsed?.job_id} onClick={onGenerate}>{loading.generate ? "Generating..." : "Generate Assessment"}</button>
          <button className="btn btn-outline" disabled={loading.create || !assessment} onClick={onCreate}>{loading.create ? "Creating..." : "Create Test Link"}</button>
        </div>
        {error && <p className="err">{error}</p>}
      </section>

      {parsed && (
        <section className="grid grid-4" style={{ marginTop: 14 }}>
          {[["Role", parsed.role], ["Seniority", parsed.seniority || parsed.experience_years], ["Domain", parsed.domain], ["Skills", (parsed.skills || []).join(", ")]].map(([label, value]) => (
            <div key={label} className="glass card"><div className="muted" style={{ fontSize: 12 }}>{label}</div><div>{value || "—"}</div></div>
          ))}
        </section>
      )}

      <div style={{ marginTop: 16 }}>{assessment && <AssessmentPreview assessment={assessment} />}</div>
      <div style={{ marginTop: 16 }}><ShareLinkCard testId={testId} /></div>
    </main>
  )
}
