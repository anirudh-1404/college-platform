import React from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  GraduationCap,
  Briefcase,
  Stethoscope,
  Building,
  BadgePercent,
  ArrowRight,
} from 'lucide-react'

const ExploreByGoal = ({ onSelectCategory, onNavigateListing }) => {
  const goals = [
    {
      id: 'high-placements',
      icon: TrendingUp,
      title: 'High Placement Colleges',
      badge: '₹15L+ Avg Package',
      description: 'Top institutes offering the highest starting salaries, quantitative roles, and verified campus placement records.',
      action: () => onNavigateListing && onNavigateListing({ query: '', stream: 'engineering' }),
    },
    {
      id: 'engineering-iits',
      icon: GraduationCap,
      title: 'Engineering & Technology',
      badge: 'JEE / BITSAT',
      description: 'Explore IITs, NITs, IIITs, and premier universities for B.Tech specializations in AI, CSE, and VLSI.',
      action: () => onSelectCategory && onSelectCategory('engineering'),
    },
    {
      id: 'top-mba',
      icon: Briefcase,
      title: 'Management & Business',
      badge: 'CAT / XAT / GMAT',
      description: 'Compare IIMs, XLRI, FMS, and leading business schools for MBA and executive management programs.',
      action: () => onSelectCategory && onSelectCategory('management'),
    },
    {
      id: 'medical-aiims',
      icon: Stethoscope,
      title: 'Medical & Healthcare',
      badge: 'NEET UG',
      description: 'Compare AIIMS, CMC, and premier government medical institutions for MBBS & BDS admissions.',
      action: () => onSelectCategory && onSelectCategory('medical'),
    },
    {
      id: 'govt-colleges',
      icon: Building,
      title: 'Premier Government Institutes',
      badge: 'High ROI',
      description: 'Central and state government universities offering subsidized tuition, high reputation, and strong alumni backing.',
      action: () => onNavigateListing && onNavigateListing({ query: 'Government', stream: 'all' }),
    },
    {
      id: 'budget-friendly',
      icon: BadgePercent,
      title: 'High ROI & Affordable',
      badge: 'Under ₹5 Lakhs',
      description: 'Colleges delivering high starting salaries relative to low 4-year total tuition and hostel expenditures.',
      action: () => onNavigateListing && onNavigateListing({ query: '', stream: 'all' }),
    },
  ]

  return (
    <section className="py-14 sm:py-18 bg-white border-b border-border-color">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-3">
          <div>
            <span className="text-xs font-bold text-brand-primary uppercase tracking-wider bg-brand-accent px-2.5 py-0.5 rounded-md">
              Goal-Based Discovery
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary mt-2">
              Explore Colleges by Your Career Target
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-xl">
              Filter institutions by placement packages, accepted entrance exams, regulatory rankings, and fee ranges.
            </p>
          </div>
          <button
            onClick={() => onNavigateListing && onNavigateListing({ stream: 'all' })}
            className="text-xs sm:text-sm font-bold text-brand-primary hover:text-brand-primary-hover flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>View all streams</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* 6 Goals Clean Minimal Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {goals.map((goal) => {
            const Icon = goal.icon
            return (
              <motion.div
                key={goal.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                onClick={goal.action}
                className="p-5 bg-white border border-slate-200/90 rounded-2xl hover:border-brand-primary/40 hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-brand-primary group-hover:bg-brand-accent group-hover:text-brand-primary transition-colors flex items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-text-secondary">
                      {goal.badge}
                    </span>
                  </div>

                  <h3 className="font-serif text-base font-bold text-text-primary group-hover:text-brand-primary transition-colors">
                    {goal.title}
                  </h3>

                  <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                    {goal.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-text-light group-hover:text-brand-primary transition-colors">
                  <span>Explore colleges</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

export default ExploreByGoal
