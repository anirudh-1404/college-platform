import React from 'react'
import { ArrowRight, Scale, ShieldCheck, Award, TrendingUp } from 'lucide-react'

const Hero = ({ onNavigateListing, onNavigateCompare }) => {
  return (
    <section className="relative overflow-hidden bg-white border-b border-border-color py-16 sm:py-24 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        {/* Hero Title & Value Proposition (No Pill Tags) */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.15]">
            Find the right college. <br />
            <span className="text-brand-primary">Backed by verified data.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Transparent admissions intelligence, audited placement packages, entrance cutoff matrices, and true return-on-investment calculations for top colleges across India.
          </p>
        </div>

        {/* Clear Action CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <button
            type="button"
            onClick={onNavigateListing}
            className="btn btn-primary btn-lg text-sm font-bold shadow-md w-full sm:w-auto"
          >
            <span>Explore All Colleges</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onNavigateCompare}
            className="btn btn-secondary btn-lg text-sm font-semibold w-full sm:w-auto"
          >
            <Scale className="h-4 w-4 text-brand-primary" />
            <span>Compare Institutions</span>
          </button>
        </div>

        {/* Clean Trust Pillars (Minimal & Factual) */}
        <div className="pt-10 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200/80 text-brand-primary flex items-center justify-center flex-shrink-0">
              <Award className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Audited NIRF & Cutoffs</p>
              <p className="text-xs text-slate-500 mt-0.5 font-normal">Directly validated against official government gazettes.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200/80 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Real Placement Proof</p>
              <p className="text-xs text-slate-500 mt-0.5 font-normal">Audited median salaries and top recruiting firms.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200/80 text-blue-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Hidden Fee Calculator</p>
              <p className="text-xs text-slate-500 mt-0.5 font-normal">Accurate 4-year expenditure including hostel and food.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default Hero
