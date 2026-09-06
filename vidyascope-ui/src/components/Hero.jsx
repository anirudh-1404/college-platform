import React from 'react'
import { ArrowRight, GraduationCap, Star, Scale } from 'lucide-react'
import { motion } from 'framer-motion'
import studentImg from '../assets/student-hero.jpg'
import { fadeInUp, staggerContainer, badgeFloat } from '../utils/animations'

const Hero = ({ onNavigateListing, onNavigateCompare }) => {
  return (
    <section className="relative bg-white pt-8 pb-16 lg:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column (Span 7): Title, Subtitle, Direct CTAs */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="lg:col-span-7 space-y-6 text-left"
          >
            
            <div className="space-y-3">
              <motion.h1
                variants={fadeInUp}
                className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-[#111827] leading-[1.12] tracking-tight"
              >
                Find colleges, <br />
                <span className="text-brand-primary">courses, & exams</span>
              </motion.h1>
              
              <motion.p
                variants={fadeInUp}
                className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed"
              >
                Exploring Higher Education: Discovering Colleges, Courses, and Exams to Shape Your Future.
              </motion.p>
            </div>

            {/* Direct Action CTAs */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap items-center gap-3.5 pt-2"
            >
              <motion.button
                type="button"
                whileHover={{ scale: 1.025, y: -2 }}
                whileTap={{ scale: 0.975 }}
                onClick={() => onNavigateListing && onNavigateListing()}
                className="btn btn-primary btn-lg shadow-md cursor-pointer flex items-center gap-2 text-sm font-bold"
              >
                <span>Explore 1,280+ Colleges</span>
                <ArrowRight className="h-4 w-4" />
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigateCompare && onNavigateCompare()}
                className="btn btn-outline btn-lg cursor-pointer flex items-center gap-2 text-sm font-bold bg-white"
              >
                <Scale className="h-4 w-4 text-slate-500" />
                <span>Compare Colleges</span>
              </motion.button>
            </motion.div>

            {/* Quick Metrics */}
            <motion.div
              variants={fadeInUp}
              className="pt-4 border-t border-slate-100 flex items-center gap-8 text-left"
            >
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-slate-900">1,280+</p>
                <p className="text-xs text-slate-500 font-medium">Verified Campuses</p>
              </div>
              <div className="border-l border-slate-200 pl-6">
                <p className="text-xl sm:text-2xl font-extrabold text-brand-primary">450+</p>
                <p className="text-xs text-slate-500 font-medium">Entrance Exams</p>
              </div>
              <div className="border-l border-slate-200 pl-6">
                <p className="text-xl sm:text-2xl font-extrabold text-emerald-600">100%</p>
                <p className="text-xs text-slate-500 font-medium">Audited Cutoffs</p>
              </div>
            </motion.div>

          </motion.div>

          {/* Right Column (Span 5): Student Cutout with Warm Organic Blob */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 flex justify-center relative"
          >
            <div className="relative w-full max-w-[380px] sm:max-w-[420px] aspect-[4/4.5] flex items-center justify-center">
              
              {/* Organic Warm Amber Background Shape */}
              <div
                className="absolute inset-4 sm:inset-2 bg-gradient-to-tr from-[#EAB308] to-[#FBBF24] rounded-[48%_52%_42%_58%_/_55%_45%_55%_45%] transform rotate-3 transition-transform duration-700 hover:rotate-6 opacity-95 shadow-lg"
              />

              {/* Student Portrait Image with rounded frame */}
              <div className="relative z-10 w-[88%] h-[92%] rounded-[40px] overflow-hidden shadow-2xl border-4 border-white bg-white">
                <img
                  src={studentImg}
                  alt="Student exploring higher education on VidyaScope"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Floating Badge 1: Top Right */}
              <motion.div
                initial="initial"
                animate="animate"
                variants={badgeFloat}
                className="absolute top-4 -right-2 z-20 bg-white/95 backdrop-blur-sm px-3.5 py-2 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-brand-accent text-brand-primary flex items-center justify-center">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight">1,280+ Colleges</p>
                  <p className="text-[10px] text-slate-500">Government & Top Private</p>
                </div>
              </motion.div>

              {/* Floating Badge 2: Bottom Left */}
              <motion.div
                initial="initial"
                animate="animate"
                variants={badgeFloat}
                transition={{ delay: 1 }}
                className="absolute bottom-4 -left-2 z-20 bg-white/95 backdrop-blur-sm px-3.5 py-2 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center">
                  <Star className="h-4 w-4 fill-amber-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight">4.9 / 5 Rating</p>
                  <p className="text-[10px] text-slate-500">Verified Student Advice</p>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default Hero
