import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import QuestionCard from '../components/QuestionCard'
import Timer from '../components/Timer'
import { getTest, scoreTest, submitTest } from '../services/api'

const normalize = (assessment) => ({
  duration_minutes: assessment?.duration_minutes ?? 45,
  mcq: assessment?.mcq ?? assessment?.mcq_questions ?? [],
  case_studies: assessment?.case_studies ?? [],
  behavioral: assessment?.behavioral ?? assessment?.behavioral_questions ?? [],
})

export default function TestPage() {
  const { test_id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [candidateName, setCandidateName] = useState('')
  const [assessment, setAssessment] = useState(null)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)

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

  const questions = useMemo(() => {
    if (!assessment) return []
    return [
      ...assessment.mcq.map((q, i) => ({ id: `mcq-${i}`, type: 'MCQ', q })),
      ...assessment.case_studies.map((q, i) => ({ id: `case-${i}`, type: 'Case Study', q })),
      ...assessment.behavioral.map((q, i) => ({ id: `beh-${i}`, type: 'Behavioral', q })),
    ]
  }, [assessment])

  const handleSubmit = async () => {
    if (!candidateName.trim()) return setError('Please enter your name.')
    setSubmitting(true)
    setError('')
    try {
      const submission = await submitTest({ test_id, candidate_name: candidateName.trim(), answers })
      const scored = await scoreTest({ test_id, candidate_id: submission?.candidate_id, submission_id: submission?.submission_id })
      setResult({ score: scored?.score ?? submission?.score ?? 0, recommendation: scored?.recommendation ?? submission?.recommendation ?? 'Pending' })
    } catch (e) {
      setError(e?.response?.data?.message || 'Submission failed, please retry.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="app-shell">
      <Navbar />
      <main className="container" style={{ maxWidth: 960, paddingBottom: 28 }}>
        {loading && <div className="skeleton" style={{ height: 180 }} />}
        {error && <p className="error">{error}</p>}

        {!loading && !result && assessment && (
          <section className="glass round-3xl hero">
            <div style={{ display: 'grid', gap: 14, alignItems: 'end', gridTemplateColumns: '1fr auto' }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, color: '#94a3b8' }}>Candidate Name</label>
                <input className="field" value={candidateName} onChange={(e) => setCandidateName(e.target.value)} placeholder="Enter full name" />
              </div>
              <Timer key={assessment.duration_minutes} durationMinutes={assessment.duration_minutes} active={!submitting} onExpire={handleSubmit} />
            </div>

            <div style={{ marginTop: 16 }}>
              {questions.map((item, i) => (
                <QuestionCard
                  key={item.id}
                  question={item.q}
                  index={i}
                  type={item.type}
                  answer={answers[item.id]}
                  onChange={(value) => setAnswers((prev) => ({ ...prev, [item.id]: value }))}
                />
              ))}
            </div>

            <button onClick={handleSubmit} disabled={submitting} className="btn gradient-btn glow-hover" style={{ width: '100%', marginTop: 14 }}>
              {submitting ? 'Submitting...' : 'Submit Test'}
            </button>
          </section>
        )}

        {result && (
          <section className="glass round-3xl hero center" style={{ maxWidth: 560, margin: '30px auto 0' }}>
            <h2 style={{ marginTop: 0 }}>Assessment Result</h2>
            <p style={{ fontSize: 54, color: '#67e8f9', margin: '8px 0', fontWeight: 700 }}>{result.score}</p>
            <p>Recommendation: {result.recommendation}</p>
            <button onClick={() => navigate(`/leaderboard/${test_id}`)} className="btn btn-ghost" style={{ marginTop: 14 }}>Go to Leaderboard</button>
          </section>
        )}
      </main>
    </div>
  )
}
