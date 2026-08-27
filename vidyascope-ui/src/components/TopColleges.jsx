import React from 'react'
import { motion } from 'framer-motion'
import { Star, MapPin, ArrowRight } from 'lucide-react'
import { collegesData } from '../data/collegesData'

const TopColleges = ({ onSelectCollege, onNavigateListing }) => {
  const featuredColleges = collegesData.slice(0, 4)

  return (
    <section className="py-14 sm:py-18 bg-slate-50/50 border-b border-border-color">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-3">
          <div>
            <span className="text-xs font-bold text-brand-primary uppercase tracking-wider bg-brand-accent px-2.5 py-0.5 rounded-md">
              Premier Institutions
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary mt-2">
              Top Ranked Colleges in India
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-xl">
              Institutions with verified national rankings, highest placement packages, and strong research output.
            </p>
          </div>
          <button
            onClick={onNavigateListing}
            className="text-xs sm:text-sm font-bold text-brand-primary hover:text-brand-primary-hover flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>View all colleges</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Grid of 4 College Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredColleges.map((college) => (
            <motion.div
              key={college.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              onClick={() => onSelectCollege && onSelectCollege(college.id)}
              className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:border-brand-primary/40 hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between group"
            >
              {/* Image & Floating Badges */}
              <div>
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={college.image}
                    alt={college.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-slate-900/85 text-white text-[10px] font-bold uppercase backdrop-blur-xs">
                      NIRF #{college.nirfRank}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white/95 text-text-primary text-[10px] font-bold uppercase shadow-2xs">
                      {college.ownership}
                    </span>
                  </div>
                </div>

                {/* Info Content */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs text-text-light flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-brand-primary flex-shrink-0" />
                      <span className="truncate">{college.location}</span>
                    </p>
                    <div className="flex items-center gap-1 flex-shrink-0 text-xs font-bold text-text-primary">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>{college.rating}</span>
                    </div>
                  </div>

                  <h3 className="font-serif text-base font-bold text-text-primary group-hover:text-brand-primary transition-colors line-clamp-1">
                    {college.name}
                  </h3>

                  <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                    {college.description}
                  </p>
                </div>
              </div>

              {/* Stats Footer */}
              <div className="p-4 pt-3 border-t border-slate-100 bg-slate-50/60 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] font-semibold text-text-light uppercase tracking-wider block">
                    Avg Package
                  </span>
                  <span className="font-bold text-emerald-600">
                    {college.avgPackage}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-text-light uppercase tracking-wider block">
                    Total Fees
                  </span>
                  <span className="font-bold text-text-primary">
                    {college.totalFees}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default TopColleges
