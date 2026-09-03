import React, { useState } from 'react'
import { Building2, ChevronLeft, ChevronRight, Landmark } from 'lucide-react'

const cities = [
  { name: 'New Delhi', count: '180+ Colleges', iconBg: 'bg-amber-100 text-amber-700' },
  { name: 'Mumbai', count: '120+ Colleges', iconBg: 'bg-blue-100 text-blue-700' },
  { name: 'Bengaluru', count: '150+ Colleges', iconBg: 'bg-emerald-100 text-emerald-700' },
  { name: 'Pune', count: '95+ Colleges', iconBg: 'bg-purple-100 text-purple-700' },
  { name: 'Hyderabad', count: '85+ Colleges', iconBg: 'bg-rose-100 text-rose-700' },
  { name: 'Chennai', count: '75+ Colleges', iconBg: 'bg-indigo-100 text-indigo-700' },
  { name: 'Kolkata', count: '60+ Colleges', iconBg: 'bg-amber-100 text-amber-700' },
]

const ExploreCities = ({ onSelectCity }) => {
  const [startIndex, setStartIndex] = useState(0)
  const visibleCount = 5

  const handleNext = () => {
    if (startIndex + visibleCount < cities.length) {
      setStartIndex((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => prev - 1)
    }
  }

  const visibleCities = cities.slice(startIndex, startIndex + visibleCount)

  return (
    <section className="py-16 bg-slate-50/60 border-b border-slate-100 text-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="space-y-2 mb-10">
          <span className="text-[#3B82F6] text-xs font-bold tracking-wider uppercase inline-flex items-center gap-1">
            <span>&gt;&gt;</span>
            <span>Explore</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#111827]">
            Explore Colleges By Cities
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            Discover premier universities, hostels, and job placements in India's leading educational hubs.
          </p>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 mb-8">
          {visibleCities.map((city) => (
            <button
              key={city.name}
              type="button"
              onClick={() => onSelectCity && onSelectCity(city.name)}
              className="bg-white border border-slate-200/90 rounded-2xl p-6 flex flex-col items-center justify-center gap-3.5 hover:border-[#3B82F6] hover:shadow-md transition-all group cursor-pointer"
            >
              {/* City Icon in round tinted badge */}
              <div className={`w-14 h-14 rounded-2xl ${city.iconBg} flex items-center justify-center transition-transform group-hover:scale-110 shadow-2xs`}>
                <Landmark className="h-6 w-6" />
              </div>

              {/* City Name */}
              <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#3B82F6] transition-colors">
                {city.name}
              </h3>

              {/* College Count */}
              <span className="text-[11px] text-slate-400 font-medium -mt-2">
                {city.count}
              </span>
            </button>
          ))}
        </div>

        {/* Carousel Pagination Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={handlePrev}
            disabled={startIndex === 0}
            className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
            title="Previous cities"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: cities.length - visibleCount + 1 }).map((_, idx) => (
              <span
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${
                  startIndex === idx ? 'w-5 bg-[#3B82F6]' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            disabled={startIndex + visibleCount >= cities.length}
            className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
            title="Next cities"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </section>
  )
}

export default ExploreCities
