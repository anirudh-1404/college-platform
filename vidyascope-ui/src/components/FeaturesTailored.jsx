import React, { useState } from 'react'
import { ArrowRight, Building2, Scale, Award, Headphones } from 'lucide-react'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer, cardVariant } from '../utils/animations'

const featuresData = {
  consultancy: [
    {
      id: 'c1',
      title: 'Find Colleges',
      description: 'Discover premier institutions with verified cutoffs, NAAC grades, and audited placement benchmarks.',
      icon: Building2,
      iconColor: 'bg-brand-accent text-brand-primary',
      action: 'listing',
    },
    {
      id: 'c2',
      title: 'Compare Colleges',
      description: 'Evaluate up to 4 colleges side-by-side across real median salaries, tuition fees, and campus amenities.',
      icon: Scale,
      iconColor: 'bg-amber-50 text-amber-600',
      action: 'compare',
    },
    {
      id: 'c3',
      title: 'Fee Transparency',
      description: 'Accurate 4-year gross cost calculation uncovering mandatory hostel dues, mess charges, and scholarship waivers.',
      icon: Award,
      iconColor: 'bg-emerald-50 text-emerald-600',
      action: 'listing',
    },
    {
      id: 'c4',
      title: 'Get Expert Help',
      description: 'Book a free 1-on-1 counseling session with our certified education experts for choice filling and cutoff analysis.',
      icon: Headphones,
      iconColor: 'bg-purple-50 text-purple-600',
      action: 'counseling',
    },
  ],
  college: [
    {
      id: 'cl1',
      title: 'Verified NIRF Accreditations',
      description: 'Direct integration with official regulatory gazettes ensures 100% authenticity in national institutional rankings.',
      icon: Building2,
      iconColor: 'bg-brand-accent text-brand-primary',
      action: 'listing',
    },
    {
      id: 'cl2',
      title: 'Audited Median CTC',
      description: 'We publish actual batch medians vetted by recruiter letters rather than inflated individual international offers.',
      icon: Scale,
      iconColor: 'bg-amber-50 text-amber-600',
      action: 'compare',
    },
    {
      id: 'cl3',
      title: 'Hostel & Living Costs',
      description: 'Full breakdown of room types, mess meal plans, security deposits, and annual laundry expenses.',
      icon: Award,
      iconColor: 'bg-emerald-50 text-emerald-600',
      action: 'listing',
    },
    {
      id: 'cl4',
      title: 'Admissions Advisory',
      description: 'Dedicated guidance for state quota, all-India counseling rounds, and direct management allocation protocols.',
      icon: Headphones,
      iconColor: 'bg-purple-50 text-purple-600',
      action: 'counseling',
    },
  ],
}

const FeaturesTailored = ({ onNavigateListing, onNavigateCompare, onOpenCounseling }) => {
  const [activeTab, setActiveTab] = useState('consultancy')

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

        {/* Segmented Switcher Tab */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="inline-flex p-1 bg-slate-100 rounded-full border border-slate-200/80 mb-12"
        >
          <button
            type="button"
            onClick={() => setActiveTab('consultancy')}
            className={`px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'consultancy'
                ? 'bg-brand-primary text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Consultancy
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('college')}
            className={`px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'college'
                ? 'bg-brand-primary text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            College
          </button>
        </motion.div>

        {/* 4 Clean Columns Grid */}
        <motion.div
          key={activeTab}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center"
        >
          {items.map((feat) => {
            const Icon = feat.icon
            return (
              <motion.div
                key={feat.id}
                variants={cardVariant}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="flex flex-col items-center p-6 rounded-2xl bg-white border border-transparent hover:border-slate-200 hover:bg-slate-50/80 transition-colors shadow-2xs hover:shadow-md group cursor-pointer"
                onClick={() => handleAction(feat.action)}
              >
                {/* Clean Feature Icon */}
                <div className={`w-14 h-14 rounded-2xl ${feat.iconColor} flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-xs`}>
                  <Icon className="h-7 w-7" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {feat.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-4 flex-grow">
                  {feat.description}
                </p>

                {/* Read More Link */}
                <div
                  className="text-xs font-bold text-[#3B82F6] hover:text-[#2563EB] inline-flex items-center gap-1 transition-colors mt-auto"
                >
                  <span>Read More</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            )
          })}
        </motion.div>

      </div>
    </section>
  )
}

export default FeaturesTailored
