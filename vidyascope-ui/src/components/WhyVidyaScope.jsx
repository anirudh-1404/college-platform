import React from 'react'
import { ShieldCheck, BarChart3, Calculator, UserCheck, CheckCircle } from 'lucide-react'

const WhyVidyaScope = ({ onOpenCounseling }) => {
  const pillars = [
    {
      icon: ShieldCheck,
      title: '100% Unbiased & Verified',
      description: 'Zero sponsored rank boosts. Every placement stat, NIRF rank, and cutoff list is cross-verified against official institutional disclosures.',
    },
    {
      icon: Calculator,
      title: 'Hidden Cost & ROI Estimator',
      description: 'Calculate real total expenditure (tuition, hostel, mess, deposits) balanced against median starting packages to see your true return.',
    },
    {
      icon: BarChart3,
      title: 'AI Fit-Score Matching',
      description: 'Match your entrance score, preferred branch, budget, and location preferences with target colleges using intelligent historical cutoffs.',
    },
    {
      icon: UserCheck,
      title: '1-on-1 Certified Counselors',
      description: 'Connect directly with alumni from top IITs, IIMs, and AIIMS for personalized counseling without high agency commissions.',
    },
  ]

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Subtle Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl -z-0 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -z-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-primary bg-brand-primary/20 px-3.5 py-1.5 rounded-full border border-brand-primary/30">
            Why Students Trust VidyaScope
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mt-4 tracking-tight">
            Empowering Smart Education Decisions
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-4 leading-relaxed">
            Selecting a college shape your future. VidyaScope cuts through marketing noise to provide transparent data, real student reviews, and genuine placement intelligence.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar) => {
            const Icon = pillar.icon
            return (
              <div
                key={pillar.title}
                className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-7 hover:border-brand-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-dark-panel flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-brand-primary/20 text-brand-primary flex items-center justify-center mb-6">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-white mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA Banner Strip inside Dark Section */}
        <div className="mt-16 bg-gradient-to-r from-brand-primary to-purple-800 rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-glow">
          <div className="text-center md:text-left space-y-2">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Still Confused About Your Right College Match?
            </h3>
            <p className="text-purple-100 text-sm max-w-xl">
              Talk to our expert admission counselors today for personalized choice-filling guidance and scholarship advice.
            </p>
          </div>
          <button
            onClick={onOpenCounseling}
            className="px-8 py-3.5 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-slate-100 transition-all duration-200 shadow-lg cursor-pointer whitespace-nowrap"
          >
            Book Free Counseling Session
          </button>
        </div>

      </div>
    </section>
  )
}

export default WhyVidyaScope
