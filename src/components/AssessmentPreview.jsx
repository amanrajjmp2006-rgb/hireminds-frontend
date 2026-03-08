import { motion } from "framer-motion"

function Block({ title, children }) {
  return (
    <div className="glass p-5">
      <h3 className="mb-4 text-lg font-semibold">{title}</h3>
      {children}
    </div>
  )
}

export default function AssessmentPreview({ assessment }) {
  if (!assessment) return null

  const mcq = assessment.mcq_questions || assessment.mcq || []
  const cases = assessment.case_studies || []
  const behavioral = assessment.behavioral_questions || assessment.behavioral || []

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <Block title="MCQ Questions">
        <div className="space-y-3">
          {mcq.map((q, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-slate-900/40 p-4">
              <p className="font-medium">{i + 1}. {q.question}</p>
              <p className="mt-2 text-xs text-slate-400">Weight: {q.weight ?? "-"} · Time: {q.time_minutes ?? "-"} min</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-300">{(q.options || []).map((o, idx) => <li key={idx}>{o}</li>)}</ul>
              <p className="mt-1 text-sm text-cyan-300">Correct: {q.correct_answer ?? "-"}</p>
            </div>
          ))}
        </div>
      </Block>
      <Block title="Case Studies">
        <div className="grid gap-3 md:grid-cols-2">
          {cases.map((c, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-slate-900/40 p-4">
              <p className="font-medium">{c.scenario || c.question}</p>
              <p className="mt-2 text-sm text-slate-300">{c.question}</p>
              <p className="mt-2 text-xs text-slate-400">Expected: {(c.expected_points || []).join(", ")}</p>
            </div>
          ))}
        </div>
      </Block>
      <Block title="Behavioral Question">
        {(behavioral || []).map((b, i) => <p key={i} className="rounded-xl border border-white/10 bg-slate-900/40 p-4">{b.question || b}</p>)}
      </Block>
    </motion.div>
  )
}
