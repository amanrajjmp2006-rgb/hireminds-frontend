import axios from "axios"

const API = "https://ai-hiring-companion-backend-production.up.railway.app"

const client = axios.create({
baseURL: API,
timeout: 30000,
})

// ---------------------
// PARSE JD
// ---------------------

export const parseJD = async (jd) => {
const res = await client.post("/parse-jd", {
jd: jd,
})

// backend returns { ok:true,data:{} }
return res.data?.data || res.data
}

// ---------------------
// GENERATE ASSESSMENT
// ---------------------

export const generateAssessment = async (parsedJD) => {
const res = await client.post("/generate-assessment", parsedJD)

return res.data
}

// ---------------------
// CREATE TEST
// ---------------------

export const createTest = async (payload) => {
const res = await client.post("/create-test", payload)

return res.data
}

// ---------------------
// GET TEST
// ---------------------

export const getTest = async (test_id) => {
const res = await client.get(`/test/${test_id}`)

return res.data
}

// ---------------------
// SUBMIT TEST
// ---------------------

export const submitTest = async (payload) => {
const res = await client.post("/submit-test", payload)

return res.data
}

// ---------------------
// SCORE TEST
// ---------------------

export const scoreTest = async (payload) => {
const res = await client.post("/score-test", payload)

return res.data
}

// ---------------------
// LEADERBOARD
// ---------------------

export const getLeaderboard = async (test_id) => {
const res = await client.get(`/leaderboard/${test_id}`)

return res.data
}

// ---------------------
// DOWNLOAD VCARD
// ---------------------

export const downloadVCard = async (candidate_id) => {
const res = await client.get(`/candidate-vcard/${candidate_id}`, {
responseType: "blob",
})

const url = URL.createObjectURL(new Blob([res.data]))

const link = document.createElement("a")
link.href = url
link.download = `candidate-${candidate_id}.vcf`

document.body.appendChild(link)
link.click()
link.remove()

URL.revokeObjectURL(url)
}
