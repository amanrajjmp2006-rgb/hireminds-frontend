import { useState } from "react"

export default function Dashboard() {

  const API = "https://ai-hiring-companion-backend-production.up.railway.app"

  const [jd, setJd] = useState("")
  const [parsedData, setParsedData] = useState(null)
  const [assessment, setAssessment] = useState(null)
  const [loading, setLoading] = useState(false)

  const parseJD = async () => {

    if (!jd) {
      alert("Paste a Job Description first")
      return
    }

    try {

      setLoading(true)

      const res = await fetch(`${API}/parse-jd`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ jd })
      })

      const data = await res.json()

      console.log("Parse JD result:", data)

      if (!res.ok || !data.ok) {
        alert(data?.error?.message || "Parsing failed")
        return
      }

      setParsedData(data.data)

    } catch (err) {

      console.error(err)
      alert("Server error")

    }

    setLoading(false)

  }


  const generateAssessment = async () => {

    if (!parsedData) {
      alert("Parse JD first")
      return
    }

    try {

      setLoading(true)

      const res = await fetch(`${API}/generate-assessment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(parsedData)
      })

      const data = await res.json()

      console.log("Assessment result:", data)

      setAssessment(data)

    } catch (err) {

      console.error(err)
      alert("Assessment generation failed")

    }

    setLoading(false)

  }


  return (

    <div style={{ padding: 40, fontFamily: "sans-serif" }}>

      <h1>HireMinds – AI Hiring Companion</h1>

      <textarea
        placeholder="Paste Job Description"
        value={jd}
        onChange={(e) => setJd(e.target.value)}
        style={{ width: "100%", height: 150, marginTop: 20 }}
      />

      <div style={{ marginTop: 20 }}>

        <button onClick={parseJD}>
          Parse Job Description
        </button>

        <button
          onClick={generateAssessment}
          style={{ marginLeft: 10 }}
        >
          Generate Assessment
        </button>

      </div>

      {loading && <p>Loading...</p>}

      {parsedData && (

        <div style={{ marginTop: 30 }}>

          <h2>Parsed Results</h2>

          <p><b>Role:</b> {parsedData.role || "Not specified"}</p>

          <p><b>Seniority:</b> {parsedData.seniority || "Not specified"}</p>

          <p><b>Domain:</b> {parsedData.domain || "Not specified"}</p>

          <p>
            <b>Skills:</b>{" "}
            {Array.isArray(parsedData.skills)
              ? parsedData.skills.join(", ")
              : "Not specified"}
          </p>

        </div>

      )}

      {assessment && (

        <div style={{ marginTop: 40 }}>

          <h2>{assessment.title}</h2>

          <p>Duration: {assessment.duration_minutes} minutes</p>

          <h3>MCQ Questions</h3>

          {Array.isArray(assessment.mcq) &&
            assessment.mcq.map((q, i) => (

              <div key={i} style={{ marginBottom: 20 }}>

                <p><b>{i + 1}. {q.question}</b></p>

                {Array.isArray(q.options) &&
                  q.options.map((opt, idx) => (
                    <p key={idx}>{opt}</p>
                  ))}

                <p style={{ color: "green" }}>
                  Answer: {q.correct_answer}
                </p>

              </div>

            ))}

        </div>

      )}

    </div>

  )

}