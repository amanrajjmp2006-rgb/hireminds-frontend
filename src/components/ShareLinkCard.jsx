import { useState } from "react"
import { QRCodeSVG } from "qrcode.react"

export default function ShareLinkCard({ testId }) {
  const [copied, setCopied] = useState(false)
  if (!testId) return null
  const link = `${window.location.origin}/test/${testId}`

  const copy = async () => {
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className="glass card">
      <div className="title">Share Candidate Test</div>
      <div className="row" style={{ marginBottom: 12 }}>
        <input readOnly className="input" value={link} />
        <button className="btn btn-glow" onClick={copy}>{copied ? "Copied" : "Copy"}</button>
      </div>
      <QRCodeSVG value={link} size={130} bgColor="#0B1120" fgColor="#F8FAFC" />
    </div>
  )
}
