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
      whileHover={{ y: -10, scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={`group relative isolate bg-gradient-to-b from-white/90 via-white/70 to-white/80 backdrop-blur-2xl border border-white/90 hover:border-white rounded-2xl sm:rounded-3xl shadow-[0_20px_45px_-12px_rgba(3,60,141,0.14),0_10px_22px_-6px_rgba(0,0,0,0.06),inset_0_2px_2.5px_rgba(255,255,255,1),inset_0_-1.5px_2px_rgba(3,60,141,0.03)] hover:shadow-[0_36px_75px_-12px_rgba(3,60,141,0.30),0_20px_35px_-8px_rgba(0,0,0,0.14),inset_0_2px_2.5px_rgba(255,255,255,1)] transition-all duration-300 overflow-hidden flex ${
        isGrid ? 'flex-col' : 'flex-col sm:flex-row'
      }`}
    >
      {/* Ambient 3D Pop Glow */}
      <div className="absolute -inset-1 bg-gradient-to-br from-[#033C8D]/25 via-[#00A3FF]/20 to-[#6366F1]/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10" />

      {/* Top Specular Sheen (Gloss Reflection) */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/80 via-white/20 to-transparent pointer-events-none rounded-t-2xl sm:rounded-t-3xl z-0" />

      {/* Thumbnail Section */}
      <div
        className={`relative overflow-hidden bg-slate-100 flex-shrink-0 cursor-pointer shadow-[inset_0_2px_6px_rgba(0,0,0,0.1)] ${
          isGrid
            ? 'w-full h-48 border-b border-white/80'
            : 'w-full sm:w-64 h-48 sm:h-auto border-b sm:border-b-0 sm:border-r border-white/80'
        }`}
        onClick={() => onSelectCollege && onSelectCollege(college.id)}
      >
        <img
          src={college.image}
          alt={college.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
        />

        {/* 3D Floating Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <span className="px-2.5 py-0.5 rounded-lg bg-slate-900/85 text-white text-[10px] font-bold uppercase shadow-md shadow-black/15 backdrop-blur-md border border-white/20">
            NIRF #{college.nirfRank}
          </span>
          <span className="px-2.5 py-0.5 rounded-lg bg-white/90 text-text-primary text-[10px] font-bold uppercase shadow-md shadow-black/10 backdrop-blur-md border border-white/95">
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
          className={`absolute top-3 right-3 p-2 rounded-xl transition-all z-10 cursor-pointer shadow-md backdrop-blur-md ${
            isShortlisted
              ? 'bg-rose-500 text-white shadow-rose-500/30'
              : 'bg-slate-900/60 text-white hover:bg-rose-500 hover:text-white border border-white/20'
          }`}
          title={isShortlisted ? 'Remove from Saved' : 'Save College'}
        >
          <Heart className={`h-4 w-4 ${isShortlisted ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Content Body */}
      <div className="flex-1 p-5 flex flex-col justify-between gap-3.5 relative z-10">
        <div>
          {/* Header Row */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3
                onClick={() => onSelectCollege && onSelectCollege(college.id)}
                className="font-serif text-base sm:text-lg font-bold text-text-primary hover:text-[#033C8D] transition-colors cursor-pointer line-clamp-1"
              >
                {college.name}
              </h3>
              <p className="flex items-center gap-1.5 text-xs text-text-light font-medium mt-0.5">
                <MapPin className="h-3.5 w-3.5 text-[#033C8D] flex-shrink-0" />
                <span>{college.location}</span>
                <span>•</span>
                <span>Est. {college.establishmentYear}</span>
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-50/95 border border-amber-200/80 rounded-xl flex-shrink-0 text-xs font-bold text-amber-900 shadow-2xs">
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
                  className="px-2.5 py-0.5 rounded-lg bg-white/85 border border-slate-200/80 text-text-secondary text-[11px] font-medium shadow-2xs"
                >
                  {exam}
                </span>
              ))}
            {college.placementPercent && (
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50/95 border border-emerald-200/80 text-emerald-700 text-[11px] font-semibold flex items-center gap-1 shadow-2xs">
                <TrendingUp className="h-3 w-3" />
                <span>{college.placementPercent}% Placement</span>
              </span>
            )}
          </div>
        </div>

        {/* Stats Grid - 3D Floating Pod */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-white/70 backdrop-blur-xl p-3 sm:p-3.5 rounded-xl border border-white/95 shadow-[0_6px_18px_rgba(3,60,141,0.06),inset_0_1.5px_2px_rgba(255,255,255,1)] text-xs">
          <div>
            <span className="text-[10px] text-text-light font-bold uppercase tracking-wider block">
              Avg Package
            </span>
            <span className="font-extrabold text-emerald-600">
              {college.avgPackage}
            </span>
          </div>

          <div className="border-l border-slate-200/70 pl-2 sm:pl-3">
            <span className="text-[10px] text-text-light font-bold uppercase tracking-wider block">
              Total Fees ({college.feesPeriod})
            </span>
            <span className="font-extrabold text-text-primary">
              {college.totalFees}
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1 border-t sm:border-t-0 sm:border-l border-slate-200/70 pt-1.5 sm:pt-0 pl-0 sm:pl-3">
            <span className="text-[10px] text-text-light font-bold uppercase tracking-wider block">
              Highest Offer
            </span>
            <span className="font-extrabold text-[#033C8D]">
              {college.highestPackage || '₹45 LPA'}
            </span>
          </div>
        </div>

        {/* Bottom Actions Row */}
        <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-slate-100/90 text-xs">
          {/* Compare Checkbox */}
          <label className="flex items-center gap-1.5 font-medium text-text-secondary cursor-pointer hover:text-text-primary select-none">
            <input
              type="checkbox"
              checked={isCompared}
              onChange={() => onToggleCompare && onToggleCompare(college)}
              className="w-3.5 h-3.5 rounded text-[#033C8D] border-slate-300 focus:ring-[#033C8D] accent-[#033C8D] cursor-pointer"
            />
            <span>Compare</span>
          </label>

          {/* View Details CTA */}
          <button
            type="button"
            onClick={() => onSelectCollege && onSelectCollege(college.id)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#033C8D] to-[#022B66] hover:from-[#022B66] hover:to-[#011B40] text-white text-xs font-bold flex items-center gap-1.5 shadow-[0_6px_18px_rgba(3,60,141,0.25)] hover:shadow-[0_10px_24px_rgba(3,60,141,0.4)] active:scale-95 transition-all cursor-pointer"
          >
            <span>View Details</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default CollegeCard
