import { useEffect, useMemo, useState } from "react"

export default function Timer({ durationMinutes = 60, onExpire, running = true }) {
  const total = Math.max(1, Number(durationMinutes || 60) * 60)
  const [secondsLeft, setSecondsLeft] = useState(total)

  useEffect(() => {
    if (!running) return
    const t = setInterval(() => {
      setSecondsLeft((p) => {
        if (p <= 1) {
          clearInterval(t)
          onExpire?.()
          return 0
        }
        return p - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [running, onExpire])

  const width = useMemo(() => `${(secondsLeft / total) * 100}%`, [secondsLeft, total])
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0")
  const ss = String(secondsLeft % 60).padStart(2, "0")

  return (
    <div className="glass timer">
      <div className="timer-big">{mm}:{ss}</div>
      <div className="bar"><div style={{ width }} /></div>
    </div>
  )
}
