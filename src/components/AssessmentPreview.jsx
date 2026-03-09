import QuestionCard from './QuestionCard'

export default function AssessmentPreview({ assessment, compact = false }) {
  const mcq = assessment?.mcq ?? []
  const caseStudies = assessment?.case_studies ?? []

  return (
    <section className="preview-wrap">
      <div className="section-head">
        <h3 style={{ margin: 0 }}>{assessment?.title || 'Assessment Preview'}</h3>
        <span className="meta">Duration: {assessment?.duration_minutes ?? 60} min</span>
      </div>

      <h4 className="section-label">MCQ ({mcq.length})</h4>
      <div className="question-grid">
        {(compact ? mcq.slice(0, 4) : mcq).map((q, i) => (
          <QuestionCard key={`mcq-${i}`} question={q} index={i} type="MCQ" answer={q?.correct_answer} onChange={() => {}} readOnly showAnswer />
        ))}
      </div>

      <h4 className="section-label">Case Studies ({caseStudies.length})</h4>
      <div className="question-grid">
        {(compact ? caseStudies.slice(0, 2) : caseStudies).map((q, i) => (
          <QuestionCard key={`case-${i}`} question={q} index={i} type="Case Study" answer="" onChange={() => {}} readOnly />
        ))}
      </div>
    </section>
  )
}
