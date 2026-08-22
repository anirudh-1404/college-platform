import React from 'react'
import { Star } from 'lucide-react'
import { collegesData } from '../data/collegesData'

const TopColleges = ({ onSelectCollege, onNavigateListing }) => {
  const topCollegesList = collegesData.slice(0, 4)

  return (
    <section className="py-12 bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
          Top Colleges in India
        </h2>
        <button
          onClick={onNavigateListing}
          className="text-sm sm:text-base font-bold text-brand-primary hover:text-brand-primary-hover hover:underline transition-colors duration-200 cursor-pointer"
        >
          View all colleges
        </button>
      </div>

      {/* Grid of College Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {topCollegesList.map((college) => (
          <div
            key={college.id}
            onClick={() => onSelectCollege && onSelectCollege(college.id)}
            className="group flex flex-col bg-white border border-border-color rounded-2xl shadow-sm hover:shadow-premium hover:border-brand-primary/20 hover:scale-[1.02] transition-all duration-300 overflow-hidden cursor-pointer"
          >
            {/* College Image */}
            <div className="relative h-44 overflow-hidden bg-slate-100">
              <img
                src={college.image}
                alt={college.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>

            {/* Content Body */}
            <div className="flex-1 p-5 flex flex-col justify-between">
              <div>
                {/* College Title */}
                <h3 className="text-base sm:text-lg font-extrabold text-text-primary group-hover:text-brand-primary transition-colors duration-200 line-clamp-1">
                  {college.name}
                </h3>
                
                {/* Location */}
                <p className="text-xs sm:text-sm text-text-light font-medium mt-1">
                  {college.location}
                </p>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-1.5 mt-2.5">
                  <Star className="h-4.5 w-4.5 fill-amber-400 text-amber-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-extrabold text-text-primary mt-0.5">
                    {college.rating}
                  </span>
                  <span className="text-xs text-text-light font-semibold mt-0.5">
                    ({college.reviewsCount})
                  </span>
                </div>
              </div>

              {/* Detail Footer */}
              <div className="border-t border-slate-100 pt-4 mt-5 grid grid-cols-2 gap-4">
                {/* Avg Package */}
                <div>
                  <p className="text-[10px] font-bold text-text-light uppercase tracking-wider">
                    Avg. Package
                  </p>
                  <p className="text-xs sm:text-sm font-extrabold text-text-primary mt-0.5">
                    {college.avgPackage}
                  </p>
                </div>

                {/* Tuition Fees */}
                <div>
                  <p className="text-[10px] font-bold text-text-light uppercase tracking-wider">
                    Fees ({college.feesPeriod})
                  </p>
                  <p className="text-xs sm:text-sm font-extrabold text-text-primary mt-0.5">
                    {college.totalFees}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TopColleges
