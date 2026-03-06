import { useState, useEffect } from "react"

export default function Timer({ durationMinutes = 60, onExpire }) {
  const [secondsLeft, setSecondsLeft] = useState(durationMinutes * 60)

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) { clearInterval(interval); onExpire && onExpire(); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0")
  const seconds = String(secondsLeft % 60).padStart(2, "0")
  const isWarning = secondsLeft < 600
  const isCritical = secondsLeft < 120

  return (
    <div className={`px-4 py-2 rounded-xl font-mono font-bold text-sm border ${isCritical ? "text-[#EF4444] bg-red-900/30 border-red-500/30 animate-pulse" : isWarning ? "text-[#F59E0B] bg-amber-900/30 border-amber-500/30" : "text-white bg-[#1E293B] border-[#334155]"}`}>
      ⏱ {minutes}:{seconds}
    </div>
  )
}