import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/40 via-slate-950 to-slate-950">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-emerald-500/10 to-transparent blur-3xl pointer-events-none" />

      <main className="relative z-10 w-full max-w-lg">
        {/* Main Card */}
        <div className="backdrop-blur-xl bg-slate-900/60 border border-emerald-500/20 rounded-3xl p-8 md:p-10 shadow-2xl shadow-emerald-950/20 flex flex-col items-center text-center">
          
          {/* Logo Badge */}
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-6 animate-pulse">
            <span className="text-slate-950 text-2xl font-bold font-mono">K</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent mb-2">
            KisanAI
          </h1>
          <p className="text-emerald-400/80 font-mono text-sm uppercase tracking-wider mb-8">
            Day 1 Setup Verified
          </p>

          {/* Verification Checklist */}
          <div className="w-full space-y-3 mb-8 text-left">
            <div className="flex items-center space-x-3 bg-slate-800/40 border border-slate-700/30 rounded-xl px-4 py-3">
              <span className="text-emerald-400 text-lg">✓</span>
              <span className="text-slate-300 text-sm">React + Vite Scaffolding</span>
            </div>
            <div className="flex items-center space-x-3 bg-slate-800/40 border border-slate-700/30 rounded-xl px-4 py-3">
              <span className="text-emerald-400 text-lg">✓</span>
              <span className="text-slate-300 text-sm">TailwindCSS v4 Integration</span>
            </div>
            <div className="flex items-center space-x-3 bg-slate-800/40 border border-slate-700/30 rounded-xl px-4 py-3">
              <span className="text-emerald-400 text-lg">✓</span>
              <span className="text-slate-300 text-sm">Workspace Monorepo Layout</span>
            </div>
          </div>

          {/* Interactive State Verification Button */}
          <button
            type="button"
            onClick={() => setCount((c) => c + 1)}
            className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 active:scale-[0.98] transition-all text-slate-950 font-bold rounded-2xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 flex justify-between items-center group cursor-pointer"
          >
            <span className="text-slate-950">Verify Interactive State</span>
            <span className="bg-slate-950/10 px-3 py-1 rounded-lg text-sm font-mono text-slate-950 group-hover:scale-105 transition-transform">
              Count: {count}
            </span>
          </button>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-slate-500 text-xs font-mono">
          KisanAI Duo Project • Duo Stack
        </footer>
      </main>
    </div>
  )
}

export default App
