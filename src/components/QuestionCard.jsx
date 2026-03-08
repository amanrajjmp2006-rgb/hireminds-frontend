export default function QuestionCard({ question, index, type, answer, onChange, readOnly = false, showAnswer = false }) {
  const options = Array.isArray(question?.options) ? question.options : []

  return (
    <article className="glass question-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
        <span className="badge">{type} #{index + 1}</span>
        <span className="meta">Weight {question?.weight ?? '-'} • {question?.time_minutes ?? '-'}m</span>
      </div>
      <p style={{ marginTop: 0 }}>{question?.question || question?.text || 'Question unavailable'}</p>

      {options.length > 0 ? (
        <div>
          {options.map((option) => (
            <label key={option} className={`option ${answer === option ? 'active' : ''}`}>
              <input type="radio" disabled={readOnly} checked={answer === option} onChange={() => onChange(option)} style={{ marginRight: 8 }} />
              {option}
            </label>
          ))}
          {showAnswer && <p className="meta" style={{ color: '#67e8f9' }}>Correct answer: {question?.correct_answer || '-'}</p>}
        </div>
      ) : (
        <textarea
          rows={5}
          disabled={readOnly}
          value={answer || ''}
          onChange={(event) => onChange(event.target.value)}
          className="textarea"
          placeholder="Write your answer"
        />
      )}

      {Array.isArray(question?.expected_points) && question.expected_points.length > 0 && (
        <ul className="meta">
          {question.expected_points.map((point) => <li key={point}>{point}</li>)}
        </ul>
      )}
    </article>
  )
}
