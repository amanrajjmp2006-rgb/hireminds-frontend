import { useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import AssessmentPreview from '../components/AssessmentPreview'
import ShareLinkCard from '../components/ShareLinkCard'
import { createTest, generateAssessment, parseJD } from '../services/api'

const normalizeAssessment = (data) => ({
  title: data?.title || 'Role Assessment',
  duration_minutes: data?.duration_minutes ?? 60,
  mcq: data?.mcq ?? [],
  case_studies: data?.case_studies ?? [],
})

export default function Dashboard() {
  const [jobDescription, setJobDescription] = useState('')
  const [parsed, setParsed] = useState(null)
  const [assessment, setAssessment] = useState(null)
  const [testId, setTestId] = useState('')
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState({ parse: false, assess: false, create: false })

  const parseInfo = useMemo(() => {
    if (!parsed) return []
    return [
      ['Role', parsed.role || 'N/A'],
      ['Seniority', parsed.seniority || 'N/A'],
      ['Domain', parsed.domain || 'N/A'],
      ['Skills', (parsed.skills || []).join(', ') || 'N/A'],
    ]
  }, [parsed])

  const onParse = async () => {
    if (!jobDescription.trim()) return setError('Please paste a job description first.')
    setError('')
    setLoading((s) => ({ ...s, parse: true }))
    try {
      const result = await parseJD(jobDescription)
      setParsed(result)
    } catch {
      setError('Could not parse job description.')
    } finally {
      setLoading((s) => ({ ...s, parse: false }))
    }
  }

  const onGenerate = async () => {
    if (!parsed) return
    setError('')
    setLoading((s) => ({ ...s, assess: true }))
    try {
      const result = await generateAssessment(parsed)
      const normalized = normalizeAssessment(result)
      setAssessment(normalized)
      setHistory((prev) => [
        {
          id: crypto.randomUUID(),
          role: parsed.role,
          skillCount: parsed.skills?.length || 0,
          summary: `Generated ${normalized.mcq.length} MCQ + ${normalized.case_studies.length} case studies`,
        },
        ...prev,
      ])
    } catch {
      setError('Assessment generation failed.')
    } finally {
      setLoading((s) => ({ ...s, assess: false }))
    }
  }

  const onCreateTest = async () => {
    if (!assessment) return
    setError('')
    setLoading((s) => ({ ...s, create: true }))
    try {
      const response = await createTest({ assessment })
      setTestId(response.test_id)
    } catch {
      setError('Could not create test link.')
    } finally {
      setLoading((s) => ({ ...s, create: false }))
    }
  }

  const mcqProgress = Math.min(100, ((assessment?.mcq?.length || 0) / 17) * 100)
  const caseProgress = Math.min(100, ((assessment?.case_studies?.length || 0) / 3) * 100)

  return (
    <div className="app-shell">
      <Navbar />
      <main className="container dashboard-grid animate-enter">
        <aside className="glass panel col-left">
          <div className="panel-head"><h3>Assessment Conversations</h3><span className="muted">{history.length} total</span></div>
          <p className="muted">Quick context from previous JDs and assessment runs.</p>
          <div className="chat-list">
            {history.length === 0 && <p className="muted">No conversation snapshots yet.</p>}
            {history.map((item) => (
              <article className="chat-card" key={item.id}>
                <p className="chat-role">{item.role || 'Unknown role'}</p>
                <p className="chat-line">{item.summary}</p>
                <p className="chat-line">Skills mapped: {item.skillCount}</p>
              </article>
            ))}
          </div>
        </aside>

        <section className="glass panel col-center">
          <h1 className="title">HireMinds — AI Hiring Companion</h1>
          <p className="subtitle">Separate signal from noise with judgment-first assessments.</p>
          <textarea className="textarea" placeholder="Paste job description" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />

          <div className="row cta-row">
            <button className="btn gradient-btn glow-hover" onClick={onParse} disabled={loading.parse}>{loading.parse ? 'Parsing...' : 'Parse JD'}</button>
            <button className="btn gradient-btn glow-hover" onClick={onGenerate} disabled={!parsed || loading.assess}>{loading.assess ? 'Generating...' : 'Generate Assessment'}</button>
            <button className="btn gradient-btn glow-hover" onClick={onCreateTest} disabled={!assessment || loading.create}>{loading.create ? 'Creating...' : 'Create Test Link'}</button>
          </div>

          {error && <p className="error">{error}</p>}
          {assessment && <AssessmentPreview assessment={assessment} compact />}
          {testId && <ShareLinkCard testId={testId} />}
        </section>

        <aside className="glass panel col-right">
          <h3>Analytics Summary</h3>
          <div className="grid-2">
            {parseInfo.map(([label, value]) => (
              <article className="kpi" key={label}><p className="k">{label}</p><p className="v">{value}</p></article>
            ))}
          </div>

          <div className="kpi" style={{ marginTop: 16 }}>
            <p className="k">MCQ Progress ({assessment?.mcq?.length || 0}/17)</p>
            <div className="progress large"><span style={{ width: `${mcqProgress}%` }} /></div>
            <p className="k" style={{ marginTop: 12 }}>Case Studies ({assessment?.case_studies?.length || 0}/3)</p>
            <div className="progress large"><span style={{ width: `${caseProgress}%` }} /></div>
            <p className="v" style={{ marginTop: 12 }}>Total time: {assessment?.duration_minutes || 60} minutes</p>
          </div>
        </aside>
      </main>
    </div>
  )
}
