export default function QuestionCard({ question, index, value, onChange, preview = false }) {
  const type = (question.type || "mcq").toLowerCase()

  return (
    <div className="glass question">
      <div className="q-meta">Question {index} · {type}</div>
      <p>{question.question || question.prompt}</p>
      {type === "mcq" ? (
        <div>
          {(question.options || []).map((opt) => (
            <label key={opt} className={`opt ${value === opt ? "active" : ""}`}>
              <input type="radio" disabled={preview} checked={value === opt} onChange={() => onChange?.(question.id || question.question, opt)} /> {opt}
            </label>
          ))}
        </div>
      ) : (
        <textarea
          disabled={preview}
          className="textarea"
          value={value || ""}
          onChange={(e) => onChange?.(question.id || question.question, e.target.value)}
          placeholder="Type answer..."
        />
      )}
      <div className="muted" style={{ fontSize: 12 }}>Weight: {question.weight || "-"} · Time: {question.time_minutes || "-"} min</div>
    </div>
  )
}
