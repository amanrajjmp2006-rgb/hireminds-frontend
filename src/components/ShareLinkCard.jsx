import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

export default function ShareLinkCard({ testId }) {
  const [copied, setCopied] = useState(false)
  const link = `${window.location.origin}/test/${testId}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }

  return (
    <section className="glass share">
      <h3 style={{ marginTop: 0, marginBottom: 8 }}>Share Candidate Test</h3>
      <div className="share-link">{link}</div>
      <div className="row">
        <button onClick={handleCopy} className="btn gradient-btn glow-hover">{copied ? 'Copied' : 'Copy link'}</button>
      </div>
      <div className="center mt-6">
        <div style={{ borderRadius: 12, background: '#fff', display: 'inline-block', padding: 8 }}><QRCodeSVG value={link} size={130} /></div>
      </div>
    </section>
  )
}
