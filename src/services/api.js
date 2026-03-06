import axios from "axios"

const BASE = "https://ai-hiring-companion-backend-production.up.railway.app"

export const parseJD = (job_description) =>
  axios.post(`${BASE}/parse-jd`, { job_description }).then(r => r.data)

export const generateAssessment = (job_id) =>
  axios.post(`${BASE}/generate-assessment`, { job_id }).then(r => r.data)

export const submitTest = (assessment_id, name, answers) =>
  axios.post(`${BASE}/submit-test`, { assessment_id, name, answers }).then(r => r.data)

export const getLeaderboard = (assessment_id) =>
  axios.get(`${BASE}/leaderboard/${assessment_id}`).then(r => r.data)