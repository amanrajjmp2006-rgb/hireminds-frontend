import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import QuestionCard from '../components/QuestionCard'
import Timer from '../components/Timer'
import { getTest, scoreTest, submitTest } from '../services/api'

const normalize = (assessment) => ({
  duration_minutes: assessment?.duration_minutes ?? 60,
  mcq: assessment?.mcq ?? assessment?.mcq_questions ?? [],
  case_studies: assessment?.case_studies ?? [],
})

export default function TestPage() {
  const { test_id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [candidateName, setCandidateName] = useState('')
  const [assessmentId, setAssessmentId] = useState('')
  const [assessment, setAssessment] = useState(null)
  const [answers, setAnswers] = useState(() => JSON.parse(localStorage.getItem(`answers-${test_id}`) || '{}'))
  const [result, setResult] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getTest(test_id)
        setAssessment(normalize(data?.assessment || data))
      } catch (e) {
        setError(e?.response?.data?.message || 'Unable to load test.')
      } finally {
        setLoading(false)
      }
    })()
  }, [test_id])

  useEffect(() => {
    localStorage.setItem(`answers-${test_id}`, JSON.stringify(answers))
  }, [answers, test_id])

  const questions = useMemo(() => {
    if (!assessment) return []
    return [
      ...assessment.mcq.map((q, i) => ({ id: `mcq-${i}`, type: 'MCQ', q })),
      ...assessment.case_studies.map((q, i) => ({ id: `case-${i}`, type: 'Case Study', q })),
    ]
  }, [assessment])

  const progress = questions.length ? ((activeIndex + 1) / questions.length) * 100 : 0

  const handleSubmit = async () => {
    if (!candidateName.trim()) return setError('Please enter your name.')
    if (!assessmentId.trim()) return setError('Please enter assessment ID.')
    setSubmitting(true)
    setError('')
    try {
      const submission = await submitTest({ test_id, candidate_name: candidateName.trim(), answers })
      const scored = await scoreTest({ test_id, candidate_id: submission?.candidate_id, submission_id: submission?.submission_id })
      setResult({ score: scored?.score ?? submission?.score ?? 0, recommendation: scored?.recommendation ?? submission?.recommendation ?? 'Pending' })
      localStorage.removeItem(`answers-${test_id}`)
    } catch (e) {
      setError(e?.response?.data?.message || 'Submission failed, please retry.')
    } finally {
      setSubmitting(false)
    }
  }

  const current = questions[activeIndex]

  return (
    <div className="app-shell">
      <Navbar />
      <main className="container test-layout animate-enter">
        {loading && <div className="skeleton" style={{ height: 180 }} />}
        {error && <p className="error">{error}</p>}

        {!loading && !result && assessment && (
          <section className="glass panel test-card">
            <div className="grid-2">
              <div>
                <label className="muted">Candidate Name</label>
                <input className="field" value={candidateName} onChange={(e) => setCandidateName(e.target.value)} placeholder="Enter full name" />
              </div>
              <div>
                <label className="muted">Assessment ID</label>
                <input className="field" value={assessmentId} onChange={(e) => setAssessmentId(e.target.value)} placeholder="Enter assessment ID" />
              </div>
            </div>

            <div className="test-top">
              <div style={{ flex: 1 }}>
                <p className="muted" style={{ marginBottom: 8 }}>Question {activeIndex + 1} of {questions.length}</p>
                <div className="progress large"><span style={{ width: `${progress}%` }} /></div>
              </div>
              <Timer key={assessment.duration_minutes} durationMinutes={assessment.duration_minutes} active={!submitting} onExpire={handleSubmit} />
            </div>

            {current && (
              <div style={{ marginTop: 16 }} className="animate-lift">
                <QuestionCard
                  question={current.q}
                  index={activeIndex}
                  type={current.type}
                  answer={answers[current.id]}
                  onChange={(value) => setAnswers((prev) => ({ ...prev, [current.id]: value }))}
                />
              </div>
            )}

            <div className="row" style={{ marginTop: 16 }}>
              <button className="btn btn-secondary" onClick={() => setActiveIndex((i) => Math.max(0, i - 1))} disabled={activeIndex === 0}>Previous</button>
              <button className="btn btn-secondary" onClick={() => setActiveIndex((i) => Math.min(questions.length - 1, i + 1))} disabled={activeIndex === questions.length - 1}>Next</button>
              <button onClick={handleSubmit} disabled={submitting} className="btn gradient-btn glow-hover" style={{ marginLeft: 'auto' }}>
                {submitting ? 'Submitting...' : 'Submit Test'}
              </button>
            </div>
          </section>
        )}

        {result && (
          <section className="glass panel center" style={{ maxWidth: 560, margin: '30px auto 0' }}>
            <h2 style={{ marginTop: 0 }}>Assessment Result</h2>
            <p style={{ fontSize: 56, color: '#93c5fd', margin: '8px 0', fontWeight: 700 }}>{result.score}</p>
            <p>Recommendation: {result.recommendation}</p>
            <button onClick={() => navigate(`/leaderboard/${test_id}`)} className="btn gradient-btn glow-hover" style={{ marginTop: 16 }}>Go to Leaderboard</button>
          </section>
        )}
      </main>
    </div>
  )
}
