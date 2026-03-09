import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import QuestionCard from "../components/QuestionCard"
import Timer from "../components/Timer"
import { getTest, scoreTest, submitTest } from "../services/api"

export default function TestPage() {
  const { test_id } = useParams()
  const [candidateName, setCandidateName] = useState("")
  const [test, setTest] = useState(null)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        setTest(await getTest(test_id))
      } catch {
        setError("Unable to load test.")
      } finally {
        setLoading(false)
      }
    })()
  }, [test_id])

  const questions = useMemo(() => test ? [
    ...(test.mcq || []).map((q) => ({ ...q, type: "mcq" })),
    ...(test.case_studies || []).map((q) => ({ ...q, type: "case" })),
    ...(test.behavioral || []).map((q) => ({ ...q, type: "behavioral" })),
  ] : [], [test])

  const onAnswer = (qid, value) => setAnswers((prev) => ({ ...prev, [qid]: value }))

  const onSubmit = async () => {
    if (saving || !candidateName.trim()) return
    setSaving(true)
    try {
      const submitted = await submitTest({ test_id, candidate_name: candidateName, answers })
      setResult(await scoreTest({ test_id, submission_id: submitted.submission_id || submitted.id }))
    } catch {
      setError("Submission failed.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <main className="container"><p>Loading...</p></main>
  if (!test) return <main className="container"><p className="err">{error || "Test not found"}</p></main>

  return (
    <main className="container">
      {result ? (
        <section className="glass card" style={{ textAlign: "center" }}>
          <h2 className="title">Result</h2>
          <div style={{ fontSize: 42, fontWeight: 700, color: "#67e8f9" }}>{result.score ?? "-"}</div>
          <p className="muted">{result.recommendation || "Recommendation pending"}</p>
        </section>
      ) : (
        <>
          <section className="glass card" style={{ marginBottom: 14 }}>
            <input className="input" placeholder="Candidate name" value={candidateName} onChange={(e) => setCandidateName(e.target.value)} />
            <div style={{ marginTop: 10 }}><Timer durationMinutes={test.duration_minutes || 60} onExpire={onSubmit} running={!saving} /></div>
          </section>

          <section className="grid" style={{ gap: 12 }}>
            {questions.map((q, i) => <QuestionCard key={i} question={q} index={i + 1} value={answers[q.id || q.question]} onChange={onAnswer} />)}
          </section>

          {error && <p className="err">{error}</p>}
          <button className="btn btn-glow" onClick={onSubmit} disabled={saving || !candidateName.trim()} style={{ marginTop: 12 }}>{saving ? "Submitting..." : "Submit Test"}</button>
        </>
      )}
    </main>
  )
}
