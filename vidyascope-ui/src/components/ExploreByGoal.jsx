import React from 'react'
import {
  GraduationCap,
  Briefcase,
  Stethoscope,
  Scale,
  Palette,
  FlaskConical,
  ArrowRight,
} from 'lucide-react'

const ExploreByGoal = ({ onSelectCategory }) => {
  const disciplines = [
    {
      id: 'engineering',
      name: 'Engineering (B.Tech / M.Tech)',
      subtitle: 'Computer Science, AI/ML, Electronics, Mechanical',
      icon: GraduationCap,
      exams: 'JEE Main, JEE Advanced, BITSAT',
    },
    {
      id: 'management',
      name: 'Management (MBA / PGDM)',
      subtitle: 'Finance, Marketing, Analytics, Operations',
      icon: Briefcase,
      exams: 'CAT, XAT, GMAT, MAT',
    },
    {
      id: 'medical',
      name: 'Medical & Healthcare (MBBS / MD)',
      subtitle: 'Clinical Medicine, Surgery, Dental, Pharmacy',
      icon: Stethoscope,
      exams: 'NEET UG, NEET PG, INI CET',
    },
    {
      id: 'law',
      name: 'Law & Legal Studies (BA LLB / LLM)',
      subtitle: 'Corporate Law, Litigation, Intellectual Property',
      icon: Scale,
      exams: 'CLAT, AILET, LSAT India',
    },
    {
      id: 'design',
      name: 'Design & Architecture (B.Des / B.Arch)',
      subtitle: 'UI/UX, Industrial Design, Spatial Planning',
      icon: Palette,
      exams: 'UCEED, NID DAT, NATA',
    },
    {
      id: 'science',
      name: 'Applied Sciences & Research',
      subtitle: 'Data Science, Biotechnology, Physics, Chemistry',
      icon: FlaskConical,
      exams: 'CUET, IISER IAT, GATE',
    },
  ]

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-border-color">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading (No Pill Tags) */}
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Explore Colleges by Academic Field
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-xl font-normal">
            Direct access to cutoff rankings, entrance exam requirements, and verified placement outcomes.
          </p>
        </div>

        {/* Disciplines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {disciplines.map((item) => {
            const Icon = item.icon

            return (
              <div
                key={item.id}
                onClick={() => onSelectCategory && onSelectCategory(item.id)}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-brand-primary/50 hover:shadow-card transition-all cursor-pointer flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 text-brand-primary flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-primary transition-colors">
                    {item.name}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    {item.subtitle}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 font-medium">Exams: {item.exams}</span>
                  <ArrowRight className="h-4 w-4 text-brand-primary group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

export default ExploreByGoal
