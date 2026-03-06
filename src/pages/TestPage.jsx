import { useParams } from "react-router-dom"
import { useState } from "react"
import axios from "axios"

const BASE = "https://ai-hiring-companion-backend-production.up.railway.app"

export default function TestPage() {

  const { assessmentId } = useParams()

  const [name, setName] = useState("")
  const [started, setStarted] = useState(false)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})

  const handleStart = async () => {

    if (!name) {
      alert("Please enter your name")
      return
    }

    try {

      const res = await axios.get(`${BASE}/assessment/${assessmentId}`)

      setQuestions(res.data.questions)

      setStarted(true)

    } catch (err) {

      alert("Assessment not found")

    }

  }

  const handleAnswer = (index, value) => {
    setAnswers({
      ...answers,
      [index]: value
    })
  }

  const handleSubmit = async () => {

    try {

      await axios.post(`${BASE}/submit-test`, {
        assessment_id: assessmentId,
        name: name,
        answers: answers
      })

      alert("Test submitted successfully")

      window.location.href = `/leaderboard/${assessmentId}`

    } catch (err) {

      alert("Submission failed")

    }

  }

  if (!started) {
    return (
      <div style={{
        background:"#0F172A",
        minHeight:"100vh",
        color:"white",
        padding:"40px"
      }}>

        <h1>Candidate Assessment</h1>

        <p style={{color:"#94A3B8"}}>
          Assessment ID: {assessmentId}
        </p>

        <div style={{marginTop:"30px"}}>

          <input
            placeholder="Enter your name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            style={{
              padding:"10px",
              width:"300px",
              marginRight:"10px"
            }}
          />

          <button
            onClick={handleStart}
            style={{
              padding:"10px 20px",
              background:"#2563EB",
              border:"none",
              color:"white",
              cursor:"pointer"
            }}
          >
            Start Test
          </button>

        </div>

      </div>
    )
  }

  return (
    <div style={{
      background:"#0F172A",
      minHeight:"100vh",
      color:"white",
      padding:"40px"
    }}>

      <h1>Assessment Questions</h1>

      {questions.map((q,i)=>(
        <div key={i} style={{
          marginBottom:"25px",
          padding:"20px",
          background:"#1E293B",
          borderRadius:"10px"
        }}>

          <h3>Question {i+1}</h3>
          <p>{q.question}</p>

          {/* MCQ Options */}

          {q.options && (
            <div style={{marginTop:"15px"}}>

              {q.options.map((opt,idx)=>(
                <label key={idx} style={{
                  display:"block",
                  marginBottom:"8px"
                }}>
                  <input
                    type="radio"
                    name={`q-${i}`}
                    value={opt}
                    onChange={(e)=>handleAnswer(i,e.target.value)}
                    style={{marginRight:"8px"}}
                  />
                  {opt}
                </label>
              ))}

            </div>
          )}

          {/* Case Study */}

          {!q.options && (
            <textarea
              placeholder="Write your answer here..."
              onChange={(e)=>handleAnswer(i,e.target.value)}
              style={{
                width:"100%",
                marginTop:"15px",
                padding:"10px",
                minHeight:"120px",
                borderRadius:"6px"
              }}
            />
          )}

        </div>
      ))}

      <button
        onClick={handleSubmit}
        style={{
          marginTop:"20px",
          padding:"12px 25px",
          background:"#2563EB",
          border:"none",
          color:"white",
          borderRadius:"6px",
          cursor:"pointer"
        }}
      >
        Submit Test
      </button>

    </div>
  )
}