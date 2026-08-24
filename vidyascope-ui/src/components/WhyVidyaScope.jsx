import React from 'react'
import { ShieldCheck, Calculator, BarChart3, UserCheck, ArrowRight } from 'lucide-react'

const WhyVidyaScope = ({ onOpenCounseling }) => {
  const pillars = [
    {
      icon: ShieldCheck,
      title: '100% Unbiased & Verified',
      description: 'Zero sponsored ranking boosts. Every placement stat, NIRF rank, and cutoff metric is cross-referenced with institutional NIRF & AICTE disclosures.',
    },
    {
      icon: Calculator,
      title: 'Hidden Cost & ROI Breakdown',
      description: 'Calculate real total expenditures including hostel, mess, examination fees, and caution deposits balanced against verified starting salaries.',
    },
    {
      icon: BarChart3,
      title: 'Objective Cutoff Trends',
      description: 'Analyze multi-year opening and closing ranks across JoSAA, JAC Delhi, NEET, CAT, and BITSAT rounds to estimate realistic admission chances.',
    },
    {
      icon: UserCheck,
      title: '1-on-1 Alumni Guidance',
      description: 'Connect directly with verified graduates and student mentors from top IITs, IIMs, and AIIMS for authentic branch and campus perspectives.',
    },
  ]

  return (
    <section className="py-16 bg-navy-dark text-white border-b border-border-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full border border-brand-primary/20">
            Why Students & Parents Trust VidyaScope
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-3">
            Empowering Informed Education Choices
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-3 leading-relaxed">
            Selecting a college shapes your future. VidyaScope cuts through marketing noise to provide transparent data and genuine placement intelligence.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon
            return (
              <div
                key={pillar.title}
                className="bg-navy-panel border border-border-dark rounded-xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-brand-primary/10 text-brand-primary border border-brand-primary/20 flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Counseling Strip */}
        <div className="mt-12 bg-navy-panel border border-border-dark rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-1">
            <h3 className="font-serif text-xl font-bold text-white">
              Unsure Which College Fits Your Score & Budget?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Talk to our admission counselors for customized choice-filling guidance and scholarship advice.
            </p>
          </div>
          <button
            onClick={onOpenCounseling}
            className="btn btn-primary btn-md flex-shrink-0 group"
          >
            <span>Book Free 1-on-1 Session</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  )
}

export default WhyVidyaScope
