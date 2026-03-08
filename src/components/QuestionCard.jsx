import { motion } from "framer-motion"

export default function QuestionCard({ index, question, value, onChange, disabled }) {
  const prompt = question.question || question.prompt || `Question ${index + 1}`
  const type = (question.type || "mcq").toLowerCase()

  return (
    <motion.div whileHover={{ y: -3 }} className="glass mb-4 p-5">
      <p className="mb-3 text-sm text-cyan-300">Q{index + 1} · {type.toUpperCase()}</p>
      <h3 className="mb-4 text-base font-medium">{prompt}</h3>

      {type === "mcq" ? (
        <div className="grid gap-2">
          {(question.options || []).map((opt, optIndex) => (
            <label key={optIndex} className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3 hover:border-blue-400/40">
              <input
                type="radio"
                name={`q-${index}`}
                disabled={disabled}
                checked={value === opt}
                onChange={() => onChange(opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      ) : (
        <textarea
          value={value || ""}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          rows={5}
          className="w-full rounded-lg border border-white/10 bg-slate-900/60 p-3 outline-none focus:border-blue-400"
          placeholder="Write your answer..."
        />
      )}
    </motion.div>
  )
}
