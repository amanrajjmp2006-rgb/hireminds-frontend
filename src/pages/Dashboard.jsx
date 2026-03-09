import { useMemo, useState } from "react"
import AssessmentPreview from "../components/AssessmentPreview"
import Navbar from "../components/Navbar"
import ShareLinkCard from "../components/ShareLinkCard"
import { createTest, generateAssessment, parseJD } from "../services/api"

const normalizeAssessment = (data) => ({
title: data?.title || "Role Assessment",
duration_minutes: data?.duration_minutes ?? 60,
mcq: data?.mcq ?? [],
case_studies: data?.case_studies ?? [],
})

export default function Dashboard() {
const [jobDescription, setJobDescription] = useState("")
const [parsed, setParsed] = useState(null)
const [assessment, setAssessment] = useState(null)
const [testId, setTestId] = useState("")
const [loading, setLoading] = useState({ parse: false, assess: false, create: false })
const [error, setError] = useState("")

// ✅ FIXED
const canGenerate = Boolean(parsed)
const canCreate = Boolean(assessment)

const parseInfo = useMemo(() => {
if (!parsed) return []
return [
["Role", parsed.role || "N/A"],
["Seniority", parsed.seniority || "N/A"],
["Domain", parsed.domain || "N/A"],
["Skills", (parsed.skills || []).join(", ") || "N/A"],
]
}, [parsed])

const onParse = async () => {
if (!jobDescription.trim()) {
setError("Please enter a job description.")
return
}

```
setError("")
setLoading((s) => ({ ...s, parse: true }))

try {
  const result = await parseJD(jobDescription.trim())

  // backend returns { ok:true,data:{} }
  setParsed(result.data || result)

} catch (e) {
  setError("Could not parse job description.")
} finally {
  setLoading((s) => ({ ...s, parse: false }))
}
```

}

const onGenerate = async () => {
if (!parsed) return

```
setError("")
setLoading((s) => ({ ...s, assess: true }))

try {
  const generated = await generateAssessment(parsed)

  setAssessment(normalizeAssessment(generated))
  setTestId("")

} catch (e) {
  setError("Assessment generation failed.")
} finally {
  setLoading((s) => ({ ...s, assess: false }))
}
```

}

const onCreateTest = async () => {
if (!assessment) return

```
setError("")
setLoading((s) => ({ ...s, create: true }))

try {
  const response = await createTest({ assessment })

  setTestId(response.test_id)

} catch (e) {
  setError("Could not create test link.")
} finally {
  setLoading((s) => ({ ...s, create: false }))
}
```

}

return ( <div className="app-shell"> <Navbar />

```
  <main className="container" style={{ paddingBottom: 28 }}>
    <section className="glass round-3xl hero">
      <h1 className="title">AI Hiring Companion</h1>
      <p className="subtitle">
        Generate role-specific hiring assessments instantly
      </p>

      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        className="textarea"
        placeholder="Paste job description"
      />

      <div className="row">

        <button
          onClick={onParse}
          disabled={loading.parse}
          className="btn gradient-btn glow-hover"
        >
          {loading.parse ? "Parsing..." : "Parse JD"}
        </button>

        <button
          onClick={onGenerate}
          disabled={!canGenerate || loading.assess}
          className="btn btn-secondary"
        >
          {loading.assess ? "Generating..." : "Generate Assessment"}
        </button>

        <button
          onClick={onCreateTest}
          disabled={!canCreate || loading.create}
          className="btn btn-ghost"
        >
          {loading.create ? "Creating..." : "Create Test Link"}
        </button>

      </div>

      {error && <p className="error">{error}</p>}

      {testId && <ShareLinkCard testId={testId} />}
    </section>

    <section className="grid-4">
      {parseInfo.map(([label, value]) => (
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
          <p className="subtitle">
            Duration: {assessment.duration_minutes} minutes
          </p>
        </div>

        <AssessmentPreview assessment={assessment} />
      </section>
    )}
  </main>
</div>
```

)
}
