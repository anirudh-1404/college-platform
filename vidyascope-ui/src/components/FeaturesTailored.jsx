import React, { useState } from 'react'
import {
  Compass,
  GitCompareArrows,
  ShieldCheck,
  Headphones,
  Award,
  TrendingUp,
  Building2,
  UserCheck,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeInUp } from '../utils/animations'

const featuresData = {
  consultancy: [
    {
      id: 'c1',
      title: 'Find Colleges',
      description: 'Discover premier institutions with verified cutoffs, NAAC grades, and audited placement benchmarks.',
      icon: Compass,
      iconColor: 'bg-blue-50 text-[#033C8D] border border-blue-100',
      action: 'listing',
    },
    {
      id: 'c2',
      title: 'Compare Colleges',
      description: 'Evaluate up to 4 colleges side-by-side across real median salaries, tuition fees, and campus amenities.',
      icon: GitCompareArrows,
      iconColor: 'bg-amber-50 text-amber-600 border border-amber-100',
      action: 'compare',
    },
    {
      id: 'c3',
      title: 'Fee Transparency',
      description: 'Accurate 4-year gross cost calculation uncovering mandatory hostel dues, mess charges, and scholarship waivers.',
      icon: ShieldCheck,
      iconColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      action: 'listing',
    },
    {
      id: 'c4',
      title: 'Get Expert Help',
      description: 'Book a free 1-on-1 counseling session with our certified education experts for choice filling and cutoff analysis.',
      icon: Headphones,
      iconColor: 'bg-purple-50 text-purple-600 border border-purple-100',
      action: 'counseling',
    },
  ],
  college: [
    {
      id: 'cl1',
      title: 'Verified NIRF Accreditations',
      description: 'Direct integration with official regulatory gazettes ensures 100% authenticity in national institutional rankings.',
      icon: Award,
      iconColor: 'bg-blue-50 text-[#033C8D] border border-blue-100',
      action: 'listing',
    },
    {
      id: 'cl2',
      title: 'Audited Median CTC',
      description: 'We publish actual batch medians vetted by recruiter letters rather than inflated individual international offers.',
      icon: TrendingUp,
      iconColor: 'bg-amber-50 text-amber-600 border border-amber-100',
      action: 'compare',
    },
    {
      id: 'cl3',
      title: 'Hostel & Living Costs',
      description: 'Full breakdown of room types, mess meal plans, security deposits, and annual laundry expenses.',
      icon: Building2,
      iconColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      action: 'listing',
    },
    {
      id: 'cl4',
      title: 'Admissions Advisory',
      description: 'Dedicated guidance for state quota, all-India counseling rounds, and direct management allocation protocols.',
      icon: UserCheck,
      iconColor: 'bg-purple-50 text-purple-600 border border-purple-100',
      action: 'counseling',
    },
  ],
}

// Smooth horizontal directional slide animation variants
const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 90 : -90,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: (direction) => ({
    x: direction > 0 ? -90 : 90,
    opacity: 0,
    transition: {
      duration: 0.25,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

const FeaturesTailored = ({ onNavigateListing, onNavigateCompare, onOpenCounseling }) => {
  // Track active tab and transition direction: 1 for right, -1 for left
  const [[activeTab, direction], setActiveTabState] = useState(['consultancy', 0])

  const setTab = (newTab) => {
    if (newTab === activeTab) return
    const dir = newTab === 'college' ? 1 : -1
    setActiveTabState([newTab, dir])
  }

  const handleAction = (action) => {
    if (action === 'listing' && onNavigateListing) onNavigateListing()
    if (action === 'compare' && onNavigateCompare) onNavigateCompare()
    if (action === 'counseling' && onOpenCounseling) onOpenCounseling()
  }

  const items = featuresData[activeTab]

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-100 text-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeInUp}
          className="space-y-2 mb-8"
        >
          <span className="text-brand-primary text-xs font-bold tracking-wider uppercase inline-flex items-center gap-1">
            <span>&gt;&gt;</span>
            <span>Features</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#111827]">
            Features Tailored for Your Success
          </h2>
        </motion.div>

        {/* Segmented Switcher Tab with Smooth Floating Pill */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="inline-flex p-1 bg-slate-100 rounded-full border border-slate-200/80 mb-12 relative shadow-2xs"
        >
          <button
            type="button"
            onClick={() => setTab('consultancy')}
            className={`relative z-10 px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
              activeTab === 'consultancy'
                ? 'text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {activeTab === 'consultancy' && (
              <motion.div
                layoutId="activeFeatureTabPill"
                className="absolute inset-0 bg-brand-primary rounded-full shadow-sm -z-10"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            Consultancy
          </button>
          <button
            type="button"
            onClick={() => setTab('college')}
            className={`relative z-10 px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
              activeTab === 'college'
                ? 'text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {activeTab === 'college' && (
              <motion.div
                layoutId="activeFeatureTabPill"
                className="absolute inset-0 bg-brand-primary rounded-full shadow-sm -z-10"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            College
          </button>
        </motion.div>

        {/* 4 Clean Columns Grid with Horizontal Directional Slide (No Read More buttons) */}
        <div className="relative overflow-hidden min-h-[220px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeTab}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center"
            >
              {items.map((feat) => {
                const Icon = feat.icon
                return (
                  <motion.div
                    key={feat.id}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    className="flex flex-col items-center p-6 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 hover:bg-slate-50/80 transition-all shadow-2xs hover:shadow-md group cursor-pointer"
                    onClick={() => handleAction(feat.action)}
                  >
                    {/* Clean Feature Icon */}
                    <div className={`w-14 h-14 rounded-2xl ${feat.iconColor} flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-xs`}>
                      <Icon className="h-7 w-7" />
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 group-hover:text-brand-primary transition-colors">
                      {feat.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                      {feat.description}
                    </p>
                  </motion.div>
                )
              })}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  )
}

export default FeaturesTailored
