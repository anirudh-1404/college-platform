import React from 'react'
import { ArrowRight, ChevronRight, Layers } from 'lucide-react'

const disciplines = [
  {
    code: '01',
    streamId: 'engineering',
    name: 'Engineering & Technology',
    degrees: 'B.Tech, B.E., M.Tech, Dual Degree',
    exams: 'JEE Advanced, JEE Main, BITSAT',
    medianMetric: '₹14.8 LPA',
    metricLabel: 'Tier-1 Median CTC',
    campusesCount: '450+ Audited Campuses',
    description: 'Audited cutoffs for Computer Science, Electrical, Mechanical, and emerging AI/ML specializations.',
  },
  {
    code: '02',
    streamId: 'management',
    name: 'Management & Business',
    degrees: 'MBA, PGDM, Executive Management',
    exams: 'CAT, XAT, GMAT, SNAP',
    medianMetric: '₹18.5 LPA',
    metricLabel: 'Top-30 Median CTC',
    campusesCount: '280+ Audited Campuses',
    description: 'Transparent placement reports distinguishing actual batch median compensation from inflated international offers.',
  },
  {
    code: '03',
    streamId: 'medical',
    name: 'Medical & Healthcare',
    degrees: 'MBBS, BDS, Allied Healthcare',
    exams: 'NEET UG, INI-CET, NEET PG',
    medianMetric: '< ₹50k / yr',
    metricLabel: 'Govt College Annual Fee',
    campusesCount: '190+ Audited Campuses',
    description: 'Government vs private quota fee structures, hospital bed capacity, patient footfall, and bond obligations.',
  },
  {
    code: '04',
    streamId: 'law',
    name: 'Law & Legal Studies',
    degrees: 'BA LLB, BBA LLB, LLM',
    exams: 'CLAT, AILET, LSAT India',
    medianMetric: '₹16.0 LPA',
    metricLabel: 'Top Tier Law Firm CTC',
    campusesCount: '110+ Audited Campuses',
    description: 'National Law Universities (NLUs) cutoff trends, moot court credentials, and tier-1 corporate law hiring.',
  },
]

const ExploreByGoal = ({ onSelectStream, onNavigateListing }) => {
  const handleClick = (streamId) => {
    if (onSelectStream) {
      onSelectStream(streamId)
    } else if (onNavigateListing) {
      onNavigateListing({ stream: streamId })
    }
  }

  return (
    <section className="bg-slate-50/60 border-b border-border-color py-14 sm:py-20 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-[11px] font-mono font-bold tracking-widest text-slate-500 uppercase">
              Academic Disciplines • Architectural Directory
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-950 mt-1">
              Select Your Academic Discipline
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl font-normal">
              Compare regulatory accreditation, verified median salaries, and national cutoff thresholds broken down by branch.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateListing && onNavigateListing()}
            className="text-xs font-bold text-slate-900 hover:text-brand-primary flex items-center gap-1.5 transition-colors cursor-pointer self-start md:self-auto"
          >
            <span>View All 1,280+ Campuses</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* 4-Pillar Swiss Grid (Clean 1px Dividing Borders) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-slate-300 bg-white shadow-xs">
          {disciplines.map((item) => (
            <div
              key={item.code}
              onClick={() => handleClick(item.streamId)}
              className="border-r border-b border-slate-300 p-6 sm:p-7 flex flex-col justify-between hover:bg-slate-50 transition-colors group cursor-pointer"
            >
              <div className="space-y-4">
                {/* Code Index */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-400 group-hover:text-slate-900 transition-colors">
                    {item.code}
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {item.campusesCount}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h3 className="font-serif text-lg font-bold text-slate-950 group-hover:text-brand-primary transition-colors leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">
                    {item.degrees}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>

              {/* Metric Box */}
              <div className="pt-6 mt-6 border-t border-slate-100 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-[10px] uppercase font-mono font-semibold text-slate-400">
                    {item.metricLabel}
                  </span>
                  <span className="font-serif text-base font-bold text-emerald-600">
                    {item.medianMetric}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] font-bold text-slate-900 group-hover:text-brand-primary pt-1">
                  <span>Explore Stream Directory</span>
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default ExploreByGoal
