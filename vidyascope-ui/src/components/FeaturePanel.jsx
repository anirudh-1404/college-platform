import React from 'react'
import { Target, GitCompare, Briefcase, Calculator, Bookmark } from 'lucide-react'

const FeaturePanel = () => {
  const features = [
    {
      id: 'goal',
      title: 'Explore by Goal',
      description: 'Find colleges aligned with your career goals.',
      icon: Target,
      iconColor: 'text-[#C084FC]', // Light purple
      glowColor: 'group-hover:shadow-[0_0_20px_0_rgba(192,132,252,0.15)]',
    },
    {
      id: 'compare',
      title: 'Compare Colleges',
      description: 'Compare fees, placement, rankings & infrastructure.',
      icon: GitCompare,
      iconColor: 'text-[#60A5FA]', // Light blue
      glowColor: 'group-hover:shadow-[0_0_20px_0_rgba(96,165,250,0.15)]',
    },
    {
      id: 'placement',
      title: 'Check Placement',
      description: 'Browse authentic package reports and recruiters.',
      icon: Briefcase,
      iconColor: 'text-[#34D399]', // Light green
      glowColor: 'group-hover:shadow-[0_0_20px_0_rgba(52,211,153,0.15)]',
    },
    {
      id: 'roi',
      title: 'ROI Calculator',
      description: 'Estimate returns on your academic investments.',
      icon: Calculator,
      iconColor: 'text-[#FBBF24]', // Amber
      glowColor: 'group-hover:shadow-[0_0_20px_0_rgba(251,191,36,0.15)]',
    },
    {
      id: 'save',
      title: 'Save & Shortlist',
      description: 'Bookmark courses & colleges to apply in future.',
      icon: Bookmark,
      iconColor: 'text-[#F87171]', // Light red
      glowColor: 'group-hover:shadow-[0_0_20px_0_rgba(248,113,113,0.15)]',
    },
  ]

  return (
    <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-[-32px] mb-12 sm:mb-20">
      <div className="bg-navy-panel border border-border-dark shadow-dark-panel rounded-3xl overflow-hidden p-6 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4 divide-y lg:divide-y-0 lg:divide-x divide-border-dark/60">
          {features.map((feat, idx) => {
            const Icon = feat.icon
            return (
              <div
                key={feat.id}
                className={`group flex flex-col items-start p-4 sm:p-6 lg:px-6 lg:py-4 transition-all duration-300 hover:bg-navy-card rounded-2xl cursor-pointer ${
                  idx !== 0 ? 'pt-6 lg:pt-4' : ''
                }`}
              >
                {/* Glowing Icon Container */}
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 border border-border-dark group-hover:border-brand-primary/20 ${feat.glowColor} group-hover:scale-110 transition-all duration-300`}
                >
                  <Icon className={`h-6 w-6 ${feat.iconColor}`} />
                </div>
                
                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold text-text-on-dark mt-4 group-hover:text-brand-primary transition-colors duration-200">
                  {feat.title}
                </h3>
                
                {/* Description */}
                <p className="text-xs sm:text-sm text-text-on-dark-muted font-medium mt-2 leading-relaxed">
                  {feat.description}
                </p>
                
                {/* Micro Action Indicator */}
                <span className="text-[10px] sm:text-xs font-bold text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-4 flex items-center gap-1">
                  Explore now <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FeaturePanel
