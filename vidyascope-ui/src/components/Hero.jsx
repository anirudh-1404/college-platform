import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Star,
  MapPin,
  TrendingUp,
  Sparkles,
  Award,
} from 'lucide-react'

const Hero = ({ onNavigateListing, onOpenCounseling }) => {
  const [stream, setStream] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (onNavigateListing) {
      onNavigateListing({ query: searchQuery, stream: stream === 'all' ? '' : stream })
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-slate-50/40 border-b border-border-color py-12 lg:py-20">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[360px] bg-brand-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

          {/* Left Column: Headline, Search & Value Prop (Span 7) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Announcement Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent border border-brand-primary/20 text-brand-primary text-xs font-bold mb-5 shadow-2xs"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>100% Unbiased Indian College Intelligence</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-text-primary leading-[1.15] mb-4"
            >
              Discover the Right College.{' '}
              <span className="text-brand-primary block sm:inline">
                Backed by Real Numbers.
              </span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-xs sm:text-sm lg:text-base text-text-secondary font-medium leading-relaxed mb-8 max-w-2xl"
            >
              Explore verified placement packages, opening & closing cutoff matrices, itemized hidden fee breakdowns, and 1-on-1 alumni counseling.
            </motion.p>

            {/* Integrated Minimal Search Box */}
            <motion.form
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              onSubmit={handleSearchSubmit}
              className="w-full max-w-2xl p-2 bg-white rounded-2xl border border-slate-200/90 shadow-card flex flex-col sm:flex-row items-center gap-2 mb-6"
            >
              {/* Stream Selector */}
              <select
                value={stream}
                onChange={(e) => setStream(e.target.value)}
                className="w-full sm:w-auto px-3.5 py-2.5 text-xs font-bold text-text-primary bg-slate-50 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary cursor-pointer"
              >
                <option value="all">All Streams</option>
                <option value="engineering">Engineering</option>
                <option value="management">Management</option>
                <option value="medical">Medical</option>
                <option value="law">Law</option>
                <option value="science">Sciences</option>
              </select>

              {/* Text Input */}
              <div className="relative flex-1 w-full flex items-center">
                <Search className="absolute left-3 h-4 w-4 text-text-light pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by college name, city, or entrance exam..."
                  className="w-full pl-9 pr-3 py-2 text-xs font-medium text-text-primary placeholder:text-text-light focus:outline-none"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="btn btn-primary btn-md w-full sm:w-auto text-xs font-bold px-5 flex-shrink-0 cursor-pointer"
              >
                <span>Search</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </motion.form>

            {/* Minimalist Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-text-secondary font-medium"
            >
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>Zero Sponsored Rankings</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="h-4 w-4 text-brand-primary flex-shrink-0" />
                <span>Official NIRF & JoSAA Data</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>Verified Placement Disclosures</span>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Interactive College Intel Showcase Card (Span 5) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <div className="w-full max-w-[400px] bg-white rounded-2xl border border-slate-200 shadow-card p-5 space-y-4 relative">
              
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=200&h=200&q=80"
                      alt="IIT Bombay"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="px-2 py-0.2 rounded bg-brand-primary text-white text-[9px] font-bold uppercase">
                        NIRF #3
                      </span>
                      <span className="text-[10px] text-text-light font-semibold">Government</span>
                    </div>
                    <h3 className="font-serif text-sm font-bold text-text-primary leading-tight">
                      IIT Bombay, Mumbai
                    </h3>
                    <p className="flex items-center gap-1 text-[11px] text-text-light mt-0.5">
                      <MapPin className="h-3 w-3 text-brand-primary" />
                      <span>Powai, Maharashtra</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-lg text-xs font-bold text-amber-900">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span>4.9</span>
                </div>
              </div>

              {/* Highlight Metrics */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                <div>
                  <span className="text-[9px] font-bold text-text-light uppercase tracking-wider block">
                    Avg Package
                  </span>
                  <span className="text-xs font-extrabold text-emerald-600">
                    ₹24.5 LPA
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-text-light uppercase tracking-wider block">
                    Highest CTC
                  </span>
                  <span className="text-xs font-bold text-brand-primary">
                    ₹1.50 Cr
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-text-light uppercase tracking-wider block">
                    Placement
                  </span>
                  <span className="text-xs font-bold text-text-primary">
                    98%
                  </span>
                </div>
              </div>

              {/* Verified Cutoffs Snippet */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-text-secondary font-semibold">Computer Science Cutoff:</span>
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">AIR 1 - 67</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-text-secondary font-semibold">4-Year Total Investment:</span>
                  <span className="font-bold text-text-primary">₹8.94 Lakhs</span>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onNavigateListing && onNavigateListing({ stream: 'engineering' })}
                  className="text-xs font-bold text-brand-primary hover:underline cursor-pointer"
                >
                  Explore 280+ Engineering Colleges →
                </button>
                <button
                  type="button"
                  onClick={onOpenCounseling}
                  className="btn btn-secondary btn-sm text-[11px] font-bold cursor-pointer"
                >
                  Get Guidance
                </button>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default Hero
