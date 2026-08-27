import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Star, TrendingUp, Heart, ArrowRight } from 'lucide-react'

const CollegeCard = ({
  college,
  viewMode = 'list',
  isCompared,
  onToggleCompare,
  onSelectCollege,
  isShortlisted = false,
  onToggleShortlist,
}) => {
  const isGrid = viewMode === 'grid'

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:border-brand-primary/40 hover:shadow-card-hover transition-all flex ${
        isGrid ? 'flex-col' : 'flex-col sm:flex-row'
      }`}
    >
      {/* Thumbnail Section */}
      <div
        className={`relative overflow-hidden bg-slate-100 flex-shrink-0 cursor-pointer group ${
          isGrid ? 'w-full h-48' : 'w-full sm:w-64 h-48 sm:h-auto'
        }`}
        onClick={() => onSelectCollege && onSelectCollege(college.id)}
      >
        <img
          src={college.image}
          alt={college.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <span className="px-2 py-0.5 rounded-md bg-slate-900/85 text-white text-[10px] font-bold uppercase backdrop-blur-xs">
            NIRF #{college.nirfRank}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-white/95 text-text-primary text-[10px] font-bold uppercase shadow-2xs">
            {college.ownership}
          </span>
        </div>

        {/* Shortlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onToggleShortlist && onToggleShortlist(college.id)
          }}
          className={`absolute top-3 right-3 p-2 rounded-xl transition-all z-10 cursor-pointer ${
            isShortlisted
              ? 'bg-rose-500 text-white shadow-sm'
              : 'bg-slate-900/40 text-white hover:bg-rose-500 hover:text-white backdrop-blur-xs'
          }`}
          title={isShortlisted ? 'Remove from Saved' : 'Save College'}
        >
          <Heart className={`h-4 w-4 ${isShortlisted ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Content Body */}
      <div className="flex-1 p-5 flex flex-col justify-between gap-3.5">
        <div>
          {/* Header Row */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3
                onClick={() => onSelectCollege && onSelectCollege(college.id)}
                className="font-serif text-base sm:text-lg font-bold text-text-primary hover:text-brand-primary transition-colors cursor-pointer line-clamp-1"
              >
                {college.name}
              </h3>
              <p className="flex items-center gap-1.5 text-xs text-text-light font-medium mt-0.5">
                <MapPin className="h-3.5 w-3.5 text-brand-primary flex-shrink-0" />
                <span>{college.location}</span>
                <span>•</span>
                <span>Est. {college.establishmentYear}</span>
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-200/60 rounded-lg flex-shrink-0 text-xs font-bold text-amber-900">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>{college.rating}</span>
            </div>
          </div>

          {/* Exam Badges */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            {college.examAccepted &&
              college.examAccepted.slice(0, 3).map((exam) => (
                <span
                  key={exam}
                  className="px-2 py-0.5 rounded bg-slate-100 text-text-secondary text-[11px] font-medium"
                >
                  {exam}
                </span>
              ))}
            {college.placementPercent && (
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[11px] font-semibold flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span>{college.placementPercent}% Placement</span>
              </span>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
          <div>
            <span className="text-[10px] text-text-light font-semibold uppercase tracking-wider block">
              Avg Package
            </span>
            <span className="font-bold text-emerald-600">
              {college.avgPackage}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-text-light font-semibold uppercase tracking-wider block">
              Total Fees ({college.feesPeriod})
            </span>
            <span className="font-bold text-text-primary">
              {college.totalFees}
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <span className="text-[10px] text-text-light font-semibold uppercase tracking-wider block">
              Highest Offer
            </span>
            <span className="font-bold text-brand-primary">
              {college.highestPackage || '₹45 LPA'}
            </span>
          </div>
        </div>

        {/* Bottom Actions Row */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* Compare Checkbox */}
          <label className="flex items-center gap-1.5 font-medium text-text-secondary cursor-pointer hover:text-text-primary select-none">
            <input
              type="checkbox"
              checked={isCompared}
              onChange={() => onToggleCompare && onToggleCompare(college)}
              className="w-3.5 h-3.5 rounded text-brand-primary border-slate-300 focus:ring-brand-primary accent-brand-primary cursor-pointer"
            />
            <span>Compare</span>
          </label>

          {/* View Details CTA */}
          <button
            type="button"
            onClick={() => onSelectCollege && onSelectCollege(college.id)}
            className="btn btn-primary btn-sm text-xs font-bold cursor-pointer"
          >
            <span>View Details</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default CollegeCard
