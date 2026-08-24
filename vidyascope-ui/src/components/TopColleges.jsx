import React from 'react'
import { motion } from 'framer-motion'
import { Star, MapPin, ArrowRight } from 'lucide-react'
import { collegesData } from '../data/collegesData'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
}

const TopColleges = ({ onSelectCollege, onNavigateListing }) => {
  const featuredColleges = collegesData.slice(0, 4)

  return (
    <section className="py-14 bg-slate-50/40 border-b border-border-color">
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
              Premier Institutions
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary mt-1">
              Top Ranked Colleges in India
            </h2>
          </div>
          <motion.button
            whileHover={{ x: 3 }}
            onClick={onNavigateListing}
            className="text-xs sm:text-sm font-bold text-brand-primary hover:text-brand-primary-hover flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>View all colleges</span>
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </motion.div>

        {/* Grid of 4 College Cards with Stagger & Spring Lift */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {featuredColleges.map((college) => (
            <motion.div
              key={college.id}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              onClick={() => onSelectCollege && onSelectCollege(college.id)}
              className="bg-white border border-border-color rounded-xl overflow-hidden hover:border-brand-primary/40 hover:shadow-lg transition-shadow cursor-pointer flex flex-col justify-between group"
            >
              {/* Image & Badges */}
              <div>
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={college.image}
                    alt={college.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-bold uppercase">
                      NIRF #{college.nirfRank}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white/90 text-text-primary text-[10px] font-bold uppercase">
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
              <div className="p-4 pt-3 border-t border-border-color bg-slate-50/50 grid grid-cols-2 gap-2 text-xs">
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
        </motion.div>

      </div>
    </section>
  )
}

export default TopColleges
