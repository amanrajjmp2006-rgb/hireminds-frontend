export default function QuestionCard({ question, index, answer, onChange, readOnly }) {
    const questionText = question.question || question.text || "Question not available"
    const type = question.type || "mcq"
  
    return (
      <div className="bg-[#1E293B] rounded-2xl p-6 border border-[#334155] shadow-xl mb-4">
        <div className="flex gap-2 mb-4">
          <span className="bg-[#2563EB] text-white text-xs font-bold px-3 py-1 rounded-full">Q{index}</span>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${type === "mcq" ? "bg-blue-900/40 text-blue-400 border border-blue-500/30" : type === "case" ? "bg-purple-900/40 text-purple-400 border border-purple-500/30" : "bg-green-900/40 text-green-400 border border-green-500/30"}`}>
            {type === "mcq" ? "MCQ" : type === "case" ? "Case Study" : "Behavioral"}
          </span>
        </div>
        <p className="text-white text-base leading-relaxed mb-4">{questionText}</p>
        {type === "mcq" && (
          <div className="space-y-3">
            {(question.options || []).map((option, i) => (
              <div key={i} onClick={() => !readOnly && onChange && onChange(question.id, option)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${answer === option ? "bg-[#2563EB]/20 border-[#2563EB] text-white" : "border-[#334155] text-[#CBD5E1] hover:border-[#2563EB]/50"}`}>
                {option}
              </div>
            ))}
          </div>
        )}
        {(type === "case" || type === "behavioral") && (
          <div>
            {(question.sub_questions || []).length > 0 && (
              <div className="mb-4">
                <p className="text-[#94A3B8] text-sm font-semibold mb-2">Answer these points:</p>
                <ol className="list-decimal list-inside space-y-1">
                  {question.sub_questions.map((sq, i) => <li key={i} className="text-[#94A3B8] text-sm">{sq}</li>)}
                </ol>
              </div>
            )}
            {readOnly ? (
              <div className="bg-[#0F172A] border border-[#334155] rounded-xl p-4 text-[#94A3B8] text-sm">Long answer — candidates will type here</div>
            ) : (
              <textarea rows={6} value={answer || ""} onChange={e => onChange && onChange(question.id, e.target.value)}
                placeholder="Type your detailed answer here..."
                className="w-full bg-[#0F172A] border border-[#334155] text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#2563EB] resize-none"/>
            )}
          </div>
        )}
      </div>
    )
  }