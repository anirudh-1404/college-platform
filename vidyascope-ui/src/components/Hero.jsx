import React from 'react'
import { motion } from 'framer-motion'
import heroRightImage from '../assets/college-student-homepage.png'
import { CheckCircle2, ArrowRight } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
}

const Hero = ({ onNavigateListing, onOpenCounseling }) => {
  return (
    <section className="relative overflow-hidden bg-slate-50/50 border-b border-border-color py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

          {/* Left Column: Headline & Action CTAs */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            <motion.h1
              variants={itemVariants}
              className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-text-primary leading-[1.15] mb-5"
            >
              Discover the Right College.{' '}
              <span className="text-brand-primary">
                Make Confident Career Decisions.
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-sm sm:text-base text-text-secondary font-medium leading-relaxed mb-8 max-w-2xl"
            >
              Explore authentic placement records, verified cutoff trends, hidden fee calculators, and 1-on-1 alumni counseling across top Indian universities.
            </motion.p>

            {/* Action Buttons with standardized .btn classes */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-3.5 mb-8 w-full"
            >
              <button
                onClick={() => onNavigateListing && onNavigateListing()}
                className="btn btn-primary btn-lg group"
              >
                <span>Explore Top Colleges</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => onOpenCounseling && onOpenCounseling()}
                className="btn btn-secondary btn-lg"
              >
                <span>Book Free Counseling</span>
              </button>
            </motion.div>

            {/* Core Trust Indicators */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-6 border-t border-border-color w-full"
            >
              {[
                '100% Unbiased Data',
                'Official Institutional Disclosures',
                'Zero Sponsored Rankings',
              ].map((benefit) => (
                <div key={benefit} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span className="text-xs font-semibold text-text-secondary">
                    {benefit}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column: Hero Visual Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[380px] lg:max-w-[420px] rounded-2xl overflow-hidden border border-border-color shadow-sm bg-white p-2">
              <img
                src={heroRightImage}
                alt="Student researching colleges on VidyaScope"
                className="w-full h-auto object-cover aspect-[4/5] rounded-xl"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default Hero
