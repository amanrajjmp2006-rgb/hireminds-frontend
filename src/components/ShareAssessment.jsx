import { useState } from "react"
import { QRCodeSVG } from "qrcode.react"

export default function ShareAssessment({ assessmentId }) {
  const [copied, setCopied] = useState(false)
  const testLink = `${window.location.origin}/test/${assessmentId}`

  const handleCopy = () => {
    navigator.clipboard.writeText(testLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-[#1E293B] rounded-2xl p-6 border border-[#334155] shadow-xl mt-6">
      <h3 className="text-white font-bold text-lg mb-4">🔗 Share With Candidates</h3>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 bg-[#0F172A] border border-[#334155] rounded-xl px-4 py-3 text-[#94A3B8] font-mono text-sm truncate">{testLink}</div>
        <button onClick={handleCopy} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold px-4 py-3 rounded-xl transition-all whitespace-nowrap">
          {copied ? "Copied! ✓" : "Copy Link"}
        </button>
      </div>
      <div className="border-t border-[#334155] pt-4 flex flex-col items-center">
        <p className="text-[#94A3B8] text-sm mb-4">Or scan this QR code</p>
        <QRCodeSVG value={testLink} size={180} bgColor="#1E293B" fgColor="#F8FAFC" />
      </div>
    </div>
  )
}