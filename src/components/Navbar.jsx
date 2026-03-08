import { Link } from "react-router-dom"
import { motion } from "framer-motion"

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass sticky top-4 z-20 mx-auto mb-8 flex w-[min(1100px,92%)] items-center justify-between px-6 py-4"
    >
      <div className="flex items-center gap-3">
        <div className="relative h-9 w-9 rounded-full bg-gradient-to-tr from-cyan-300 via-blue-500 to-indigo-600 shadow-glow">
          <div className="absolute inset-1 animate-pulse rounded-full border border-white/40" />
        </div>
        <div>
          <p className="font-semibold">HireMinds AI</p>
          <p className="text-xs text-slate-400">AI Hiring Companion</p>
        </div>
      </div>
      <div className="flex gap-2 text-sm">
        <Link className="rounded-lg px-3 py-2 text-slate-300 hover:bg-white/10" to="/">Dashboard</Link>
      </div>
    </motion.nav>
  )
}
