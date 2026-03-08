import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import AssessmentPreview from "../components/AssessmentPreview"
import Navbar from "../components/Navbar"
import ShareLinkCard from "../components/ShareLinkCard"
import { createTest, generateAssessment, parseJD } from "../services/api"

export default function Dashboard() {
  const [jobDescription, setJobDescription] = useState("")
  const [parsed, setParsed] = useState(null)
  const [assessment, setAssessment] = useState(null)
  const [testLink, setTestLink] = useState("")
  const [loading, setLoading] = useState({ parse: false, generate: false, create: false })
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const parsedView = useMemo(() => {
    if (!parsed) return []
    return [
      ["Role", parsed.role],
      ["Seniority", parsed.seniority || parsed.experience_years],
      ["Domain", parsed.domain],
      ["Skills", (parsed.required_skills || parsed.skills || []).join(", ")]
    ]
  }, [parsed])

  const handleParse = async () => {
    if (!jobDescription.trim()) return
    setError("")
    setLoading((s) => ({ ...s, parse: true }))
    try {
      const data = await parseJD(jobDescription)
      setParsed(data.data || data)
    } catch {
      setError("Could not parse JD. Please try again.")
    } finally {
      setLoading((s) => ({ ...s, parse: false }))
    }
  }

  const handleGenerate = async () => {
    if (!parsed?.job_id) return
    setLoading((s) => ({ ...s, generate: true }))
    setError("")
    try {
      const data = await generateAssessment(parsed.job_id)
      setAssessment(data.data || data)
    } catch {
      setError("Assessment generation failed.")
    } finally {
      setLoading((s) => ({ ...s, generate: false }))
    }
  }

  const handleCreateTest = async () => {
    if (!assessment) return
    setLoading((s) => ({ ...s, create: true }))
    setError("")
    try {
      const payload = {
        assessment_id: assessment.assessment_id,
        job_id: parsed?.job_id,
        assessment
      }
      const response = await createTest(payload)
      const testId = response.test_id || response.id || response.data?.test_id
      const link = `${window.location.origin}/test/${testId}`
      setTestLink(link)
    } catch {
      setError("Failed to create test link.")
    } finally {
      setLoading((s) => ({ ...s, create: false }))
    }
  }

  return (
    <div className="app-shell pb-12">
      <Navbar />
      <main className="mx-auto w-[min(1100px,92%)] space-y-6">
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-4xl font-bold md:text-5xl">AI Hiring Companion</h1>
          <p className="mt-2 text-slate-400">Generate role-specific hiring assessments instantly.</p>
        </motion.section>

        <section className="glass p-6">
          <label className="mb-2 block text-sm text-slate-300">Job Description</label>
          <textarea
            rows={8}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-900/50 p-4 outline-none focus:border-blue-400"
            placeholder="Paste the JD here..."
          />
          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={handleParse} disabled={loading.parse || !jobDescription.trim()} className="glow-btn disabled:cursor-not-allowed disabled:opacity-50">
              {loading.parse ? "Parsing..." : "Parse Job Description"}
            </button>
            <button onClick={handleGenerate} disabled={loading.generate || !parsed?.job_id} className="glow-btn disabled:cursor-not-allowed disabled:opacity-50">
              {loading.generate ? "Generating..." : "Generate Assessment"}
            </button>
          </div>
          {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}
        </section>

        {parsedView.length > 0 && (
          <section className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {parsedView.map(([title, value]) => (
              <div key={title} className="glass p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">{title}</p>
                <p className="mt-1 font-medium">{value || "Not available"}</p>
              </div>
            ))}
          </section>
        )}

        {assessment && (
          <section className="space-y-4">
            <AssessmentPreview assessment={assessment} />
            <div className="glass p-5">
              <button onClick={handleCreateTest} disabled={loading.create} className="glow-btn disabled:opacity-50">
                {loading.create ? "Creating..." : "Create Test Link"}
              </button>
              {testLink && <ShareLinkCard link={testLink} />}
              {testLink && <button className="mt-3 text-sm text-cyan-300 underline" onClick={() => navigate(`/leaderboard/${testLink.split("/").pop()}`)}>Open Leaderboard</button>}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
