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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
}

const ExploreByGoal = ({ onSelectCategory, onNavigateListing }) => {
  const goals = [
    {
      id: 'high-placements',
      icon: TrendingUp,
      title: 'High Placement Colleges',
      badge: '₹15L+ Avg Package',
      description: 'Colleges with the highest average salary packages and verified placement percentages.',
      action: () => onNavigateListing && onNavigateListing({ query: '', stream: 'engineering' }),
      iconBg: 'bg-purple-100 text-brand-primary',
    },
    {
      id: 'engineering-iits',
      icon: GraduationCap,
      title: 'Engineering & Tech',
      badge: 'JEE / BITSAT',
      description: 'Explore IITs, NITs, IIITs and top private universities for B.Tech & M.Tech programs.',
      action: () => onSelectCategory && onSelectCategory('engineering'),
      iconBg: 'bg-blue-100 text-blue-700',
    },
    {
      id: 'top-mba',
      icon: Briefcase,
      title: 'Management & MBA',
      badge: 'CAT / XAT',
      description: 'Compare IIMs, XLRI, FMS and leading business schools for MBA and executive programs.',
      action: () => onSelectCategory && onSelectCategory('management'),
      iconBg: 'bg-amber-100 text-amber-700',
    },
    {
      id: 'medical-aiims',
      icon: Stethoscope,
      title: 'Medical & Healthcare',
      badge: 'NEET UG',
      description: 'Explore AIIMS, CMC, and premier government medical colleges for MBBS & BDS admissions.',
      action: () => onSelectCategory && onSelectCategory('medical'),
      iconBg: 'bg-emerald-100 text-emerald-700',
    },
    {
      id: 'govt-colleges',
      icon: Building,
      title: 'Top Government Institutes',
      badge: 'High ROI',
      description: 'Central and state government universities with low tuition fees and high institutional prestige.',
      action: () => onNavigateListing && onNavigateListing({ query: 'Government', stream: 'all' }),
      iconBg: 'bg-slate-100 text-slate-700',
    },
    {
      id: 'budget-friendly',
      icon: BadgePercent,
      title: 'Affordable & High ROI',
      badge: 'Under ₹5 Lakhs',
      description: 'Colleges offering quality education and strong returns within reasonable total fee budgets.',
      action: () => onNavigateListing && onNavigateListing({ query: '', stream: 'all' }),
      iconBg: 'bg-rose-100 text-rose-700',
    },
  ]

  return (
    <section className="py-14 bg-white border-b border-border-color">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3"
        >
          <div>
            <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
              Goal-Based Discovery
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary mt-1">
              Explore Colleges by Your Target
            </h2>
          </div>
          <motion.button
            whileHover={{ x: 3 }}
            onClick={() => onNavigateListing && onNavigateListing({ stream: 'all' })}
            className="text-xs sm:text-sm font-bold text-brand-primary hover:text-brand-primary-hover flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>View all streams</span>
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </motion.div>

        {/* 6 Goals Grid with Stagger & Spring Lift */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
        >
          {goals.map((goal) => {
            const Icon = goal.icon
            return (
              <motion.button
                key={goal.id}
                variants={cardVariants}
                whileHover={{ y: -5, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                onClick={goal.action}
                className="text-left p-4 sm:p-5 bg-white border border-border-color rounded-xl hover:border-brand-primary/40 hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between group h-full"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg ${goal.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
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
              </motion.button>
            )
          })}
        </motion.div>

      </div>
    </section>
  )
}

export default ExploreByGoal
