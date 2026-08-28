import React from 'react'
import {
  ShieldCheck,
  CheckCircle2,
  Scale,
  FileSpreadsheet,
  Eye,
  Lock,
} from 'lucide-react'

const WhyVidyaScope = ({ onNavigateCompare, onOpenCounseling }) => {
  const points = [
    {
      title: 'Audited Placement Records',
      description:
        'We do not accept self-claimed highest packages without verified recruiter letters and audited median compensation reports.',
      icon: ShieldCheck,
    },
    {
      title: '4-Year True Cost of Education',
      description:
        'Tuition fee, mandatory hostel charges, mess deposits, examination dues, and hidden miscellaneous fees calculated upfront.',
      icon: FileSpreadsheet,
    },
    {
      title: 'Direct Institution Governance',
      description:
        'All college data is authored directly by authorized college representatives and vetted by central editorial verification officers.',
      icon: Lock,
    },
  ]

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-border-color">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold text-brand-primary uppercase tracking-wider bg-purple-50 px-2.5 py-0.5 rounded-md">
            Transparency Standards
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
            Why Students & Parents Rely on VidyaScope
          </h2>
          <p className="text-sm text-slate-500 mt-1.5 font-normal">
            College admissions are a life-defining investment. We replace promotional marketing claims with verified regulatory data.
          </p>
        </div>

        {/* 3-Column Clean Factual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {points.map((pt, i) => {
            const Icon = pt.icon
            return (
              <div
                key={i}
                className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-brand-primary/40 hover:shadow-card transition-all space-y-3"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-50 text-brand-primary flex items-center justify-center">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {pt.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {pt.description}
                </p>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

export default WhyVidyaScope
