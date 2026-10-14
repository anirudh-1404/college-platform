import React from 'react'
import { GraduationCap, Briefcase, Stethoscope, FlaskConical, Scale, Palette, Home, ChevronRight, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer, cardVariant } from '../utils/animations'

const CollegeCategoryPage = ({ onSelectCategory, onNavigateHome }) => {
  const categories = [
    {
      id: 'engineering',
      title: 'Engineering & Technology',
      degrees: 'B.Tech, M.Tech, MCA, Diplomas',
      collegesCount: '4,120+ Colleges Available',
      icon: GraduationCap,
      color: 'from-[#7C3AED] to-[#9333EA]',
      bgAccent: 'bg-[#F5F3FF] text-[#7C3AED] border-[#7C3AED]/20',
      isActive: true,
      description: 'Explore verified NIRF rankings, JEE/BITSAT cutoffs, average packages, and total fees for top engineering institutes.',
    },
    {
      id: 'management',
      title: 'Management & MBA',
      degrees: 'MBA, BBA, PGDM, Executive MBA',
      collegesCount: '2,850+ Colleges Available',
      icon: Briefcase,
      color: 'from-[#2563EB] to-[#3B82F6]',
      bgAccent: 'bg-[#EFF6FF] text-[#2563EB] border-[#2563EB]/20',
      isActive: true,
      description: 'Compare premium business schools (IIMs, XLRI) by placements ROI, CAT cutoffs, corporate networks, and global rankings.',
    },
    {
      id: 'medical',
      title: 'Medical & Healthcare',
      degrees: 'MBBS, BDS, MD, MS, Nursing',
      collegesCount: '1,450+ Colleges Available',
      icon: Stethoscope,
      color: 'from-[#10B981] to-[#059669]',
      bgAccent: 'bg-[#ECFDF5] text-[#10B981] border-[#10B981]/20',
      isActive: true,
      description: 'Find top-tier medical colleges (AIIMS) using NEET scores, including infrastructure, residency programs, and hospital ratings.',
    },
    {
      id: 'science',
      title: 'Applied Sciences & Humanities',
      degrees: 'B.Sc, M.Sc, BA, MA, PhD',
      collegesCount: '5,600+ Colleges',
      icon: FlaskConical,
      color: 'from-[#F59E0B] to-[#D97706]',
      bgAccent: 'bg-[#FFFBEB] text-[#F59E0B] border-[#F59E0B]/20',
      isActive: false,
      description: 'Find institutions specializing in basic sciences, liberal arts, literature, research facilities, and doctoral grants.',
    },
    {
      id: 'law',
      title: 'Legal Studies & Law',
      degrees: 'LLB, LLM, Integrated BA-LLB',
      collegesCount: '950+ Colleges',
      icon: Scale,
      color: 'from-[#EF4444] to-[#DC2626]',
      bgAccent: 'bg-[#FEF2F2] text-[#EF4444] border-[#EF4444]/20',
      isActive: false,
      description: 'Explore top national law universities (NLUs) based on CLAT scores, moot court ratings, and corporate placement records.',
    },
    {
      id: 'design',
      title: 'Design, Fine Arts & Media',
      degrees: 'B.Des, M.Des, BFA, Journalism',
      collegesCount: '1,800+ Colleges',
      icon: Palette,
      color: 'from-[#EC4899] to-[#DB2777]',
      bgAccent: 'bg-[#FDF2F8] text-[#EC4899] border-[#EC4899]/20',
      isActive: false,
      description: 'Find leading design labs, fashion institutes (NIFTs), visual arts universities, and journalism academies.',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Container Wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-text-light mb-6">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-1.5 hover:text-brand-primary transition-colors cursor-pointer"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </button>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-text-primary font-bold">Explore Domains</span>
        </nav>

        {/* Page Heading & Header Details */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-10 text-center sm:text-left"
        >
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary tracking-tight">
            Explore Colleges by Stream
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary font-medium mt-2 leading-relaxed max-w-3xl">
            Choose a professional domain to check verified NIRF rankings, exam cutoff scores, placement statistics, course details, and total fees.
          </p>
        </motion.div>

        {/* Category Cards Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <motion.div
                key={category.id}
                variants={cardVariant}
                whileHover={category.isActive ? { y: -6, transition: { duration: 0.2 } } : {}}
                whileTap={category.isActive ? { scale: 0.98 } : {}}
                onClick={() => category.isActive && onSelectCategory(category.id)}
                className={`relative group bg-white border border-border-color rounded-2xl p-6 sm:p-7 shadow-sm transition-all duration-300 flex flex-col justify-between h-[340px] ${
                  category.isActive
                    ? 'hover:shadow-card-hover hover:border-brand-primary/40 cursor-pointer'
                    : 'opacity-75 cursor-not-allowed select-none'
                }`}
              >
                {/* Upper Details Block */}
                <div>
                  <div className="flex items-center justify-between gap-4 mb-5">
                    {/* Icon Card wrapper */}
                    <div className={`p-3 rounded-xl border ${category.bgAccent} flex items-center justify-center transition-transform group-hover:scale-105`}>
                      <IconComponent className="h-6 w-6" />
                    </div>

                    {/* Status Badge */}
                    {category.isActive ? (
                      <span className="px-2.5 py-1 text-[9px] font-extrabold tracking-wide uppercase bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100">
                        Active Stream
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 text-[9px] font-extrabold tracking-wide uppercase bg-slate-100 text-text-secondary rounded-md border border-slate-200">
                        Coming Soon
                      </span>
                    )}
                  </div>

                  {/* Title & Degrees */}
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-text-primary group-hover:text-brand-primary transition-colors duration-200">
                    {category.title}
                  </h3>
                  <p className="text-[11px] font-bold text-brand-primary/80 tracking-wide uppercase mt-1">
                    {category.degrees}
                  </p>

                  {/* Description Paragraph */}
                  <p className="text-xs sm:text-sm font-medium leading-relaxed text-text-secondary mt-3 line-clamp-3">
                    {category.description}
                  </p>
                </div>

                {/* Footer Action Strip */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                  <span className="text-xs font-bold text-text-light">
                    {category.collegesCount}
                  </span>
                  
                  {category.isActive && (
                    <button className="flex items-center gap-1 text-xs font-extrabold text-brand-primary group-hover:text-brand-primary-hover transition-colors">
                      <span>Explore</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </motion.div>

      </div>
    </div>
  )
}

export default CollegeCategoryPage
