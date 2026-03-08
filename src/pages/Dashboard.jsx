import { useMemo, useState } from 'react'
import AssessmentPreview from '../components/AssessmentPreview'
import Navbar from '../components/Navbar'
import ShareLinkCard from '../components/ShareLinkCard'
import { createTest, generateAssessment, parseJD } from '../services/api'

const normalizeAssessment = (data) => ({
  title: data?.title || 'Role Assessment',
  duration_minutes: data?.duration_minutes ?? 45,
  mcq: data?.mcq ?? data?.mcq_questions ?? [],
  case_studies: data?.case_studies ?? [],
  behavioral: data?.behavioral ?? data?.behavioral_questions ?? [],
  assessment_id: data?.assessment_id,
})

export default function Dashboard() {
  const [jobDescription, setJobDescription] = useState('')
  const [parsed, setParsed] = useState(null)
  const [assessment, setAssessment] = useState(null)
  const [testId, setTestId] = useState('')
  const [loading, setLoading] = useState({ parse: false, assess: false, create: false })
  const [error, setError] = useState('')

  const canGenerate = Boolean(parsed?.job_id)
  const canCreate = Boolean(assessment)

  const parseInfo = useMemo(() => {
    if (!parsed) return []
    return [
      ['Role', parsed.role || parsed.job_role || 'N/A'],
      ['Seniority', parsed.seniority || parsed.experience_years || 'N/A'],
      ['Domain', parsed.domain || 'N/A'],
      ['Skills', (parsed.skills || parsed.required_skills || []).join?.(', ') || 'N/A'],
    ]
  }, [parsed])

  const onParse = async () => {
    if (!jobDescription.trim()) return setError('Please enter a job description.')
    setError('')
    setLoading((s) => ({ ...s, parse: true }))
    try {
      setParsed(await parseJD(jobDescription.trim()))
    } catch (e) {
      setError(e?.response?.data?.message || 'Could not parse job description.')
    } finally {
      setLoading((s) => ({ ...s, parse: false }))
    }
  }

  const onGenerate = async () => {
    if (!parsed?.job_id) return
    setError('')
    setLoading((s) => ({ ...s, assess: true }))
    try {
      const generated = await generateAssessment(parsed.job_id)
      setAssessment(normalizeAssessment(generated))
      setTestId('')
    } catch (e) {
      setError(e?.response?.data?.message || 'Assessment generation failed.')
    } finally {
      setLoading((s) => ({ ...s, assess: false }))
    }
  }

  const onCreateTest = async () => {
    setError('')
    setLoading((s) => ({ ...s, create: true }))
    try {
      const payload = assessment?.assessment_id ? { assessment_id: assessment.assessment_id } : { assessment }
      const response = await createTest(payload)
      setTestId(response?.test_id || response?.assessment_id || response?.id || '')
    } catch (e) {
      setError(e?.response?.data?.message || 'Could not create test link.')
    } finally {
      setLoading((s) => ({ ...s, create: false }))
    }
  }

  return (
    <div className="app-shell">
      <Navbar />
      <main className="container" style={{ paddingBottom: 28 }}>
        <section className="glass round-3xl hero">
          <h1 className="title">AI Hiring Companion</h1>
          <p className="subtitle">Generate role-specific hiring assessments instantly.</p>

          <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} className="textarea" placeholder="Paste job description" />

          <div className="row">
            <button onClick={onParse} disabled={loading.parse || loading.assess || loading.create} className="btn gradient-btn glow-hover">{loading.parse ? 'Parsing...' : 'Parse JD'}</button>
            <button onClick={onGenerate} disabled={!canGenerate || loading.parse || loading.assess || loading.create} className="btn btn-secondary">{loading.assess ? 'Generating...' : 'Generate Assessment'}</button>
            <button onClick={onCreateTest} disabled={!canCreate || loading.parse || loading.assess || loading.create} className="btn btn-ghost">{loading.create ? 'Creating...' : 'Create Test Link'}</button>
          </div>

          {error && <p className="error">{error}</p>}
          {testId && <ShareLinkCard testId={testId} />}
        </section>

        <section className="grid-4">
          {!parsed && loading.parse
            ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton" />)
            : parseInfo.map(([label, value]) => (
                <div key={label} className="glass kpi">
                  <p className="k">{label}</p>
                  <p className="v">{value}</p>
                </div>
              ))}
        </section>

        {assessment && (
          <section>
            <div className="section-head">
              <h2 style={{ margin: 0 }}>{assessment.title}</h2>
              <p className="subtitle">Duration: {assessment.duration_minutes} min</p>
            </div>
            <AssessmentPreview assessment={assessment} />
          </section>
        )}
      </main>
    </div>
  )
}
