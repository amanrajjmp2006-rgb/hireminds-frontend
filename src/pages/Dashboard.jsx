import { useState } from "react"

export default function Dashboard() {

  const API = "https://ai-hiring-companion-backend-production.up.railway.app"

  const [jd, setJd] = useState("")
  const [parsedData, setParsedData] = useState(null)
  const [assessment, setAssessment] = useState(null)
  const [loading, setLoading] = useState(false)

  // ---------------- PARSE JD ----------------

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
        body: JSON.stringify({
          jd: jd
        })
      })

      const result = await res.json()

      console.log("Parse JD result:", result)

      if(result.ok){
        setParsedData(result.data)
      } else {
        alert("Parsing failed")
      }

    } catch (err) {

      console.error(err)
      alert("Server error while parsing JD")

    }

    setLoading(false)

  }


  // ---------------- GENERATE ASSESSMENT ----------------

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

      const result = await res.json()

      console.log("Assessment result:", result)

      setAssessment(result)

    } catch (err) {

      console.error(err)
      alert("Assessment generation failed")

    }

    setLoading(false)

  }


  return (

    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>

      <h1>HireMinds – AI Hiring Companion</h1>

      {/* JD INPUT */}

      <textarea
        placeholder="Paste Job Description here"
        value={jd}
        onChange={(e) => setJd(e.target.value)}
        style={{
          width: "100%",
          height: "150px",
          marginTop: "20px",
          padding: "10px"
        }}
      />

      {/* BUTTONS */}

      <div style={{ marginTop: "20px" }}>

        <button onClick={parseJD}>
          Parse Job Description
        </button>

        <button
          onClick={generateAssessment}
          style={{ marginLeft: "10px" }}
        >
          Generate Assessment
        </button>

      </div>

      {loading && <p>Loading...</p>}

      {/* PARSED DATA */}

      {parsedData && (

        <div style={{ marginTop: "30px" }}>

          <h2>Parsed Results</h2>

          <p><b>Role:</b> {parsedData.role}</p>

          <p><b>Seniority:</b> {parsedData.seniority}</p>

          <p><b>Domain:</b> {parsedData.domain}</p>

          <p><b>Experience:</b> {parsedData.experience}</p>

          <p><b>Skills:</b> {parsedData.skills?.join(", ")}</p>

        </div>

      )}

      {/* ASSESSMENT */}

      {assessment && (

        <div style={{ marginTop: "40px" }}>

          <h2>{assessment.title}</h2>

          <p>Duration: {assessment.duration_minutes} minutes</p>

          {/* MCQ */}

          <h3>MCQ Questions</h3>

          {assessment.mcq?.map((q, index) => (

            <div key={index} style={{ marginBottom: "20px" }}>

              <p><b>{index + 1}. {q.question}</b></p>

              {q.options.map((opt, i) => (
                <p key={i}>{opt}</p>
              ))}

              <p style={{ color: "green" }}>
                Correct Answer: {q.correct_answer}
              </p>

            </div>

          ))}

          {/* CASE STUDIES */}

          <h3>Case Studies</h3>

          {assessment.case_studies?.map((c, index) => (

            <div key={index} style={{ marginBottom: "20px" }}>

              <p><b>Scenario:</b> {c.scenario}</p>

              <p><b>Question:</b> {c.question}</p>

              <p style={{ color: "green" }}>
                Ideal Answer: {c.ideal_answer}
              </p>

            </div>

          ))}

        </div>

      )}

    </div>

  )

}