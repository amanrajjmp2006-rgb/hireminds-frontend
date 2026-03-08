import QuestionCard from './QuestionCard'

export default function AssessmentPreview({ assessment }) {
  const mcq = assessment?.mcq ?? []
  const caseStudies = assessment?.case_studies ?? []
  const behavioral = assessment?.behavioral ?? []

  return (
    <section>
      <h3 style={{ marginTop: 16 }}>MCQ</h3>
      <div className="question-grid">
        {mcq.map((q, i) => (
          <QuestionCard key={`mcq-${i}`} question={q} index={i} type="MCQ" answer={q?.correct_answer} onChange={() => {}} readOnly showAnswer />
        ))}
      </div>

      <h3 style={{ marginTop: 18 }}>Case Studies</h3>
      <div className="question-grid">
        {caseStudies.map((q, i) => (
          <QuestionCard key={`case-${i}`} question={q} index={i} type="Case Study" answer="" onChange={() => {}} readOnly />
        ))}
      </div>

      <h3 style={{ marginTop: 18 }}>Behavioral</h3>
      {behavioral.map((q, i) => (
        <QuestionCard key={`beh-${i}`} question={q} index={i} type="Behavioral" answer="" onChange={() => {}} readOnly />
      ))}
    </section>
  )
}
