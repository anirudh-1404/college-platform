import React from 'react'
import { X, Scale, ArrowRight } from 'lucide-react'

const CompareTray = ({ selectedColleges, onRemoveCollege, onClearAll, onCompareNow }) => {
  if (!selectedColleges || selectedColleges.length === 0) return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-4xl bg-slate-950/90 backdrop-blur-md border border-slate-800 text-white rounded-2xl p-3 sm:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300 animate-slide-in">
      
      {/* Left Info & Selected Thumbnails */}
      <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 custom-scrollbar">
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand-primary/20 text-brand-primary border border-brand-primary/30">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              College Compare
            </p>
            <p className="text-xs sm:text-sm font-extrabold text-white">
              {selectedColleges.length} / 4 Selected
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-8 w-[1px] bg-slate-800 flex-shrink-0 hidden sm:block" />

        {/* Thumbnails Row */}
        <div className="flex items-center gap-2">
          {selectedColleges.map((college) => (
            <div
              key={college.id}
              className="relative flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1.5 pr-2.5 flex-shrink-0 group hover:border-brand-primary/40 transition-colors"
            >
              <img
                src={college.image}
                alt={college.name}
                className="w-8 h-8 rounded-lg object-cover"
              />
              <span className="text-xs font-bold truncate max-w-[90px] sm:max-w-[120px]">
                {college.shortName || college.name}
              </span>
              <button
                onClick={() => onRemoveCollege(college.id)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Remove"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-end flex-shrink-0">
        <button
          onClick={onClearAll}
          className="text-xs font-bold text-slate-400 hover:text-white transition-colors px-2 cursor-pointer"
        >
          Clear All
        </button>

        <button
          onClick={onCompareNow}
          className="px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-card hover:shadow-premium transition-all cursor-pointer transform hover:-translate-y-0.5"
        >
          <span>Compare Now</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

    </div>
  )
}

export default CompareTray
