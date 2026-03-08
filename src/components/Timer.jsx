import { useEffect, useState } from "react"

export default function Timer({ minutes = 30, onExpire, active = true }) {
  const total = minutes * 60
  const [remaining, setRemaining] = useState(() => minutes * 60)


  useEffect(() => {
    if (!active || remaining <= 0) return
    const id = setInterval(() => setRemaining((prev) => prev - 1), 1000)
    return () => clearInterval(id)
  }, [active, remaining])

  useEffect(() => {
    if (remaining === 0) onExpire?.()
  }, [remaining, onExpire])

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0")
  const ss = String(remaining % 60).padStart(2, "0")
  const progress = ((total - remaining) / total) * 100

  return (
    <div className="glass p-4">
      <div className="mb-2 flex justify-between text-sm text-slate-400">
        <span>Assessment Timer</span>
        <span className="font-semibold text-cyan-300">{mm}:{ss}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-700">
        <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
