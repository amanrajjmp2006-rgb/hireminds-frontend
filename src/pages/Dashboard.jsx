import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import Groq from "groq-sdk"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8080

app.use(cors())
app.use(express.json())

console.log("AI Hiring Companion backend starting...")

/* ---------------- GROQ SETUP ---------------- */

const GROQ_API_KEY = process.env.GROQ_API_KEY

if (!GROQ_API_KEY) {
  console.error("ERROR: GROQ_API_KEY missing in environment variables")
}

const groq = new Groq({
  apiKey: GROQ_API_KEY
})

/* ---------------- HEALTH CHECK ---------------- */

app.get("/", (req, res) => {
  res.send("Backend running")
})

/* ---------------- SAFE JSON EXTRACTOR ---------------- */

function extractJSON(text) {
  if (!text || typeof text !== "string") {
    throw new Error("Empty model response")
  }

  try {
    return JSON.parse(text)
  } catch {}

  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
  const candidate = fenced?.[1] || text

  const start = candidate.indexOf("{")
  const end = candidate.lastIndexOf("}")

  if (start === -1 || end === -1) {
    throw new Error("No JSON found in AI response")
  }

  const jsonString = candidate.slice(start, end + 1)

  return JSON.parse(jsonString)
}

/* ---------------- PARSE JOB DESCRIPTION ---------------- */

app.post("/parse-jd", async (req, res) => {
  try {

    console.log("Incoming /parse-jd body:", req.body)

    // Accept MANY field names so frontend never breaks
    const jd =
      req.body.jd ||
      req.body.jobDescription ||
      req.body.description ||
      req.body.text ||
      req.body.job_description ||
      req.body.jdText ||
      req.body.prompt ||
      req.body.content

    if (!jd || typeof jd !== "string") {
      return res.status(400).json({
        error: "Job description missing"
      })
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      max_tokens: 500,
      messages: [
        {
          role: "system",
          content: "Extract structured info from job descriptions. Return JSON only."
        },
        {
          role: "user",
          content: `
Extract these fields from the job description:

role
seniority
domain
skills
experience

Return JSON like:

{
 "role":"",
 "seniority":"",
 "domain":"",
 "skills":[],
 "experience":""
}

Job description:
${jd}
`
        }
      ]
    })

    const raw = completion.choices?.[0]?.message?.content
    const parsed = extractJSON(raw)

    const result = {
      role: parsed.role || "Not specified",
      seniority: parsed.seniority || "Not specified",
      domain: parsed.domain || "Not specified",
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      experience: parsed.experience || "Not specified"
    }

    console.log("Parsed JD:", result)

    res.json(result)

  } catch (err) {
    console.error("Parse JD error:", err)

    res.status(500).json({
      error: "JD parsing failed"
    })
  }
})

/* ---------------- GENERATE ASSESSMENT ---------------- */

app.post("/generate-assessment", async (req, res) => {
  try {

    const role = req.body.role || "General Role"
    const domain = req.body.domain || "General"
    const skills = req.body.skills || []
    const seniority = req.body.seniority || "Mid"

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.4,
      max_tokens: 2000,
      messages: [
        {
          role: "system",
          content: "You generate hiring assessments. Return JSON only."
        },
        {
          role: "user",
          content: `
Create a hiring assessment.

Rules:
- 10 MCQ questions (2 marks each)
- 3 case study questions (5 marks each)

MCQ must contain:
question
options
correct_answer
marks

Case study must contain:
scenario
question
ideal_answer
marks

Return JSON exactly like:

{
 "title":"",
 "duration_minutes":45,
 "mcq":[
  {
   "question":"",
   "options":["","","",""],
   "correct_answer":"",
   "marks":2
  }
 ],
 "case_studies":[
  {
   "scenario":"",
   "question":"",
   "ideal_answer":"",
   "marks":5
  }
 ]
}

Role: ${role}
Domain: ${domain}
Skills: ${skills}
Seniority: ${seniority}
`
        }
      ]
    })

    const raw = completion.choices?.[0]?.message?.content
    const parsed = extractJSON(raw)

    console.log("Generated assessment")

    res.json(parsed)

  } catch (err) {
    console.error("Assessment generation error:", err)

    res.status(500).json({
      error: "Assessment generation failed"
    })
  }
})

/* ---------------- START SERVER ---------------- */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})