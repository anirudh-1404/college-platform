import React from 'react'
import { Sparkles, ArrowRight } from 'lucide-react'

const alerts = [
  'LIVE AUDIT: IIT Bombay 2025-26 Median CTC Audited & Verified at ₹21.8 LPA',
  'GATEWAY UPDATE: JEE Advanced 2026 Examination Schedule & Eligibility Released',
  'COST OF LIVING: Updated 4-Year Hostel & Mess Expense Breakdown for 85 Premier Campuses',
  'MANAGEMENT INTELLIGENCE: CAT 2025 Composite Cutoffs & IIM Interview Predictor Live',
  'CONSUMER ADVISORY: 14 Unaccredited Private Deemed Universities Flagged by Regulatory Audit',
]

const LiveAlertTicker = ({ onNavigateExams, onNavigateColleges }) => {
  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 text-xs py-2 px-4 overflow-hidden relative select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left Badge */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold uppercase tracking-wider border border-rose-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            Live Intel
          </span>
        </div>

        {/* Scrolling Ticker Text */}
        <div className="flex-1 overflow-hidden whitespace-nowrap mask-gradient">
          <div className="inline-flex items-center gap-8 animate-ticker">
            {alerts.concat(alerts).map((alert, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-3 text-[11px] font-medium text-slate-300 hover:text-white transition-colors cursor-default"
              >
                <span>{alert}</span>
                <span className="text-slate-600 font-serif">•</span>
              </span>
            ))}
          </div>
        </div>

        {/* Right CTA */}
        <button
          type="button"
          onClick={onNavigateExams}
          className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-slate-300 hover:text-white transition-colors flex-shrink-0 cursor-pointer"
        >
          <span>Exams Bulletin</span>
          <ArrowRight className="h-3 w-3" />
        </button>

      </div>
    </div>
  )
}

export default LiveAlertTicker
