import { useEffect, useMemo, useState } from 'react'

export default function Timer({ durationMinutes = 30, onExpire, active = true }) {
  const initialSeconds = Math.max(1, durationMinutes * 60)
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds)


  useEffect(() => {
    if (!active || secondsLeft <= 0) return undefined
    const id = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          onExpire?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [secondsLeft, onExpire, active])

  const progress = useMemo(() => (secondsLeft / initialSeconds) * 100, [secondsLeft, initialSeconds])
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const ss = String(secondsLeft % 60).padStart(2, '0')

  return (
    <div className="glass timer-wrap">
      <div className="timer">{mm}:{ss}</div>
      <div className="progress"><span style={{ width: `${progress}%` }} /></div>
    </div>
  )
}
