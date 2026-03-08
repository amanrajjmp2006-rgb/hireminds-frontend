import axios from 'axios'

const API = 'https://ai-hiring-companion-backend-production.up.railway.app'

const client = axios.create({ baseURL: API, timeout: 30000 })
const unwrap = (response) => response?.data?.data ?? response?.data

export const parseJD = (job_description) => client.post('/parse-jd', { job_description }).then(unwrap)
export const generateAssessment = (job_id) => client.post('/generate-assessment', { job_id }).then(unwrap)
export const createTest = (payload) => client.post('/create-test', payload).then(unwrap)
export const getTest = (test_id) => client.get(`/test/${test_id}`).then(unwrap)
export const submitTest = (payload) => client.post('/submit-test', payload).then(unwrap)
export const scoreTest = (payload) => client.post('/score-test', payload).then(unwrap)
export const getLeaderboard = (test_id) => client.get(`/leaderboard/${test_id}`).then(unwrap)

export const downloadVCard = async (candidate_id) => {
  const response = await client.get(`/candidate-vcard/${candidate_id}`, { responseType: 'blob' })
  const url = URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.download = `candidate-${candidate_id}.vcf`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
