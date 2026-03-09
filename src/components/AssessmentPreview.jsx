import QuestionCard from "./QuestionCard"

export default function AssessmentPreview({ assessment }) {
  if (!assessment) return null
  return (
    <section className="grid" style={{ gap: 18 }}>
      <div><h3 className="title">MCQ</h3><div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))" }}>{(assessment.mcq || []).map((q, i) => <QuestionCard key={i} question={{ ...q, type: "mcq" }} index={i + 1} preview />)}</div></div>
      <div><h3 className="title">Case Studies</h3><div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))" }}>{(assessment.case_studies || []).map((q, i) => <QuestionCard key={i} question={{ ...q, type: "case" }} index={i + 1} preview />)}</div></div>
      <div><h3 className="title">Behavioral</h3><div className="grid">{(assessment.behavioral || []).map((q, i) => <QuestionCard key={i} question={{ ...q, type: "behavioral" }} index={i + 1} preview />)}</div></div>
    </section>
  )
}
