import { useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import { useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import QuestionCard from "../components/QuestionCard"
import Timer from "../components/Timer"
import { getTest, scoreTest, submitTest } from "../services/api"

export default function TestPage() {
  const { test_id } = useParams()
  const [test, setTest] = useState(null)
  const [name, setName] = useState("")
  const [answers, setAnswers] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")
  const submittedRef = useRef(false)

  useEffect(() => {
    getTest(test_id)
      .then((data) => setTest(data.data || data))
      .catch(() => setError("Unable to load test."))
  }, [test_id])

  const questions = useMemo(() => {
    if (!test) return []
    if (Array.isArray(test.questions)) return test.questions
    const mcq = (test.assessment?.mcq_questions || test.assessment?.mcq || []).map((q) => ({ ...q, type: "mcq" }))
    const cases = (test.assessment?.case_studies || []).map((q) => ({ ...q, type: "case_study" }))
    const behavioral = (test.assessment?.behavioral_questions || test.assessment?.behavioral || []).map((q) => ({ ...q, type: "behavioral" }))
    return [...mcq, ...cases, ...behavioral]
  }, [test])

  const duration = test?.assessment?.duration_minutes || test?.duration_minutes || 30

  const onSubmit = async () => {
    if (submittedRef.current) return
    submittedRef.current = true
    setSubmitting(true)
    setError("")
    try {
      const submitPayload = { test_id, candidate_name: name, answers }
      const submitRes = await submitTest(submitPayload)
      const scorePayload = {
        test_id,
        submission_id: submitRes.submission_id,
        candidate_id: submitRes.candidate_id
      }
      const scoreRes = await scoreTest(scorePayload)
      setResult(scoreRes.data || scoreRes)
    } catch {
      setError("Submission failed. Please retry.")
      submittedRef.current = false
    } finally {
      setSubmitting(false)
    }
  }

  if (result) {
    return (
      <div className="app-shell pb-10">
        <Navbar />
        <div className="mx-auto mt-8 w-[min(700px,92%)] glass p-8 text-center">
          <h2 className="text-2xl font-bold">Assessment Complete</h2>
          <p className="mt-3 text-lg">Score: <span className="text-cyan-300">{result.score ?? "-"}</span></p>
          <p className="mt-2 text-slate-300">Recommendation: {result.recommendation || "Pending"}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell pb-10">
      <Navbar />
      <main className="mx-auto w-[min(900px,92%)] space-y-4">
        {error && <p className="text-rose-300">{error}</p>}
        {!test ? (
          <div className="glass p-6">Loading test...</div>
        ) : (
          <>
            <div className="glass p-5">
              <label className="mb-2 block text-sm text-slate-300">Candidate name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-white/10 bg-slate-900/50 p-3" />
            </div>
            <Timer minutes={duration} onExpire={onSubmit} active={!submitting} />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {questions.map((q, i) => (
                <QuestionCard
                  key={i}
                  index={i}
                  question={q}
                  disabled={submitting}
                  value={answers[i]}
                  onChange={(val) => setAnswers((prev) => ({ ...prev, [i]: val }))}
                />
              ))}
            </motion.div>
            <button onClick={onSubmit} disabled={!name.trim() || submitting} className="glow-btn disabled:opacity-50">
              {submitting ? "Submitting..." : "Submit Test"}
            </button>
          </>
        )}
      </main>
    </div>
  )
}
