import React from 'react'
import { MapPin, Star, Award, TrendingUp, Check, ArrowRight, Heart } from 'lucide-react'

const CollegeCard = ({ college, viewMode = 'list', isCompared, onToggleCompare, onSelectCollege, isShortlisted = false, onToggleShortlist }) => {
  const isGrid = viewMode === 'grid'

  return (
    <div
      className={`group bg-white border border-border-color rounded-2xl shadow-sm hover:shadow-premium hover:border-brand-primary/20 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex ${
        isGrid ? 'flex-col' : 'flex-col md:flex-row'
      }`}
    >
      {/* Image Container */}
      <div
        className={`relative overflow-hidden bg-slate-100 flex-shrink-0 cursor-pointer ${
          isGrid ? 'w-full h-48' : 'w-full md:w-64 h-48 md:h-auto'
        }`}
        onClick={() => onSelectCollege && onSelectCollege(college.id)}
      >
        <img
          src={college.image}
          alt={college.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold tracking-wide uppercase">
            NIRF #{college.nirfRank}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-brand-primary/90 backdrop-blur-md text-white text-[10px] font-bold tracking-wide uppercase">
            {college.ownership}
          </span>
        </div>

        {/* Shortlist Bookmark Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleShortlist && onToggleShortlist(college.id)
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer z-10 ${
            isShortlisted
              ? 'bg-rose-500 text-white'
              : 'bg-slate-900/40 text-white hover:bg-rose-500 hover:text-white'
          }`}
          title="Shortlist College"
        >
          <Heart className={`h-4 w-4 ${isShortlisted ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Main Details Body */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between gap-4">
        <div>
          {/* Header Row: Title & Rating */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3
                onClick={() => onSelectCollege && onSelectCollege(college.id)}
                className="font-serif text-lg sm:text-xl font-bold text-text-primary group-hover:text-brand-primary transition-colors duration-200 cursor-pointer"
              >
                {college.name}
              </h3>
              <p className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-text-light mt-1">
                <MapPin className="h-3.5 w-3.5 text-brand-primary" />
                <span>{college.location}</span>
              </p>
            </div>

            {/* Rating Pill */}
            <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200/60 rounded-xl flex-shrink-0">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-extrabold text-amber-700">
                {college.rating}
              </span>
              <span className="text-[10px] font-medium text-text-light">
                ({college.reviewsCount})
              </span>
            </div>
          </div>

          {/* Tags & Exams Badges */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3">
            {college.examAccepted && college.examAccepted.map((exam) => (
              <span
                key={exam}
                className="px-2.5 py-0.5 rounded-md bg-slate-100 text-text-secondary text-[11px] font-semibold"
              >
                {exam}
              </span>
            ))}
            {college.placementPercent && (
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span>{college.placementPercent}% Placed</span>
              </span>
            )}
          </div>
        </div>

        {/* Middle Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
          <div>
            <span className="text-[10px] font-bold text-text-light uppercase tracking-wider block">
              Avg. Package
            </span>
            <span className="text-sm sm:text-base font-extrabold text-text-primary">
              {college.avgPackage}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-text-light uppercase tracking-wider block">
              Total Fees ({college.feesPeriod})
            </span>
            <span className="text-sm sm:text-base font-extrabold text-text-primary">
              {college.totalFees}
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold text-text-light uppercase tracking-wider block">
              Placement Rate
            </span>
            <span className="text-sm sm:text-base font-extrabold text-emerald-600">
              {college.placementPercent}%
            </span>
          </div>
        </div>

        {/* Footer Actions Row */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100 mt-1">
          {/* Add to Compare Checkbox */}
          <label className="flex items-center gap-2 text-xs font-bold text-text-secondary cursor-pointer select-none hover:text-brand-primary transition-colors">
            <input
              type="checkbox"
              checked={isCompared}
              onChange={() => onToggleCompare && onToggleCompare(college)}
              className="w-4 h-4 rounded text-brand-primary border-border-color focus:ring-brand-primary accent-brand-primary cursor-pointer"
            />
            <span>Add to Compare</span>
          </label>

          {/* View Details CTA Button */}
          <button
            onClick={() => onSelectCollege && onSelectCollege(college.id)}
            className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-text-on-dark font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-card hover:shadow-premium transition-all duration-300 group/btn cursor-pointer"
          >
            <span>View Details</span>
            <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default CollegeCard
