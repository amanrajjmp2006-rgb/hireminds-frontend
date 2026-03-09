import axios from "axios"

const API = "https://ai-hiring-companion-backend-production.up.railway.app"

const client = axios.create({ baseURL: API })

export const parseJD = async (job_description) => {
  const { data } = await client.post("/parse-jd", { job_description })
  return data
}

export const generateAssessment = async (job_id) => {
  const { data } = await client.post("/generate-assessment", { job_id })
  return data
}

export const createTest = async (assessmentPayload) => {
  const { data } = await client.post("/create-test", assessmentPayload)
  return data
}

export const getTest = async (test_id) => {
  const { data } = await client.get(`/test/${test_id}`)
  return data
}

export const submitTest = async (payload) => {
  const { data } = await client.post("/submit-test", payload)
  return data
}

export const scoreTest = async (payload) => {
  const { data } = await client.post("/score-test", payload)
  return data
}

export const getLeaderboard = async (test_id) => {
  const { data } = await client.get(`/leaderboard/${test_id}`)
  return data
}

export const downloadVCard = async (candidate_id) => {
  const { data } = await client.get(`/candidate-vcard/${candidate_id}`, {
    responseType: "blob",
  })
  return data
}

export default API
