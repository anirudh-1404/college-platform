import React, { useState } from 'react'
import { X, Scale, ArrowRight, ChevronDown, ChevronUp, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const CompareTray = ({
  selectedColleges = [],
  compareList = [],
  onRemoveCollege,
  onRemoveCompare,
  onClearAll,
  onClearCompare,
  onCompareNow,
  onNavigateCompare,
}) => {
  const [isMinimized, setIsMinimized] = useState(false)

  // Support both prop naming conventions
  const colleges = (selectedColleges && selectedColleges.length > 0) ? selectedColleges : compareList
  const handleRemove = onRemoveCollege || onRemoveCompare
  const handleClear = onClearAll || onClearCompare
  const handleCompare = onCompareNow || onNavigateCompare

  if (!colleges || colleges.length === 0) return null

  // Fixed 4 comparison slots matrix
  const totalSlots = 4

  return (
    <AnimatePresence mode="wait">
      {isMinimized ? (
        /* Minimized Floating Island Capsule */
        <motion.div
          key="compare-dock-minimized"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', stiffness: 450, damping: 28 }}
          className="fixed bottom-5 right-4 sm:right-6 z-50"
        >
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={() => setIsMinimized(false)}
            className="bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_12px_36px_rgba(15,23,42,0.18)] rounded-full px-4 py-2.5 flex items-center gap-3 cursor-pointer hover:border-[#033C8D]/40 transition-all group"
          >
            <div className="w-6 h-6 rounded-full bg-[#033C8D] text-white flex items-center justify-center text-[11px] font-extrabold shadow-2xs">
              {colleges.length}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <span>Compare Colleges</span>
              <span className="text-[10px] text-slate-400 font-medium">({colleges.length}/{totalSlots})</span>
            </div>
            <ChevronUp className="w-4 h-4 text-slate-400 group-hover:text-[#033C8D] transition-colors ml-1" />
          </motion.button>
        </motion.div>
      ) : (
        /* Expanded Floating Comparison Dock */
        <motion.aside
          key="compare-dock-expanded"
          aria-label="College comparison dock"
          initial={{ opacity: 0, y: 40, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed bottom-5 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[480px] max-w-[480px]"
        >
          <div className="bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-[0_20px_50px_-10px_rgba(15,23,42,0.22),0_0_0_1px_rgba(15,23,42,0.05)]">
            
            {/* Dock Header */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-50 text-[#033C8D] flex items-center justify-center border border-blue-100/80">
                  <Scale className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                  Compare Colleges
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200/60">
                  {colleges.length} of {totalSlots}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-[11px] font-semibold text-slate-400 hover:text-rose-600 transition-colors cursor-pointer px-1.5 py-0.5 rounded hover:bg-rose-50"
                >
                  Clear all
                </button>
                <button
                  type="button"
                  onClick={() => setIsMinimized(true)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Minimize"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Close and clear"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 4 Comparison Slots Grid with Layout Transitions */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              {[0, 1, 2, 3].map((index) => {
                const college = colleges[index]

                if (college) {
                  const collegeId = college.id || college._id || college.slug
                  const name = college.shortName || college.name || 'College'
                  const imageSrc = college.image || college.logo
                  const locationText = college.city || college.location || (college.nirfRank ? `NIRF #${college.nirfRank}` : 'India')

                  return (
                    <motion.div
                      layout
                      key={collegeId || index}
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.85, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                      whileHover={{ y: -2 }}
                      className="relative flex flex-col items-center justify-between p-2 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:border-[#033C8D]/40 hover:bg-white transition-all duration-200 shadow-2xs h-[92px] group text-center"
                    >
                      {/* Remove Button Badge */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (handleRemove) handleRemove(collegeId)
                        }}
                        className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-white border border-slate-200 text-slate-400 hover:bg-rose-500 hover:border-rose-500 hover:text-white flex items-center justify-center transition-all duration-150 shadow-xs cursor-pointer z-10"
                        title={`Remove ${name}`}
                      >
                        <X className="w-2.5 h-2.5 stroke-[2.5]" />
                      </button>

                      {/* Thumbnail / Monogram */}
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt={name}
                          className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200/80 shadow-2xs bg-white flex-shrink-0"
                          onError={(e) => {
                            e.target.style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200/60 text-[#033C8D] font-black text-[11px] flex items-center justify-center flex-shrink-0">
                          {name.slice(0, 2).toUpperCase()}
                        </div>
                      )}

                      {/* College Name & Subtitle */}
                      <div className="w-full min-w-0">
                        <p className="text-[11px] font-bold text-slate-800 leading-snug truncate w-full px-0.5">
                          {name}
                        </p>
                        <p className="text-[9px] font-medium text-slate-400 truncate w-full px-0.5">
                          {locationText}
                        </p>
                      </div>
                    </motion.div>
                  )
                }

                // Empty Slot Placeholder
                return (
                  <div
                    key={`empty-slot-${index}`}
                    className="flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-200/80 bg-slate-50/40 h-[92px] text-center select-none transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-slate-100/90 flex items-center justify-center text-slate-400">
                      <Plus className="w-3.5 h-3.5 stroke-[2.2]" />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 tracking-tight">
                      Slot {index + 1}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Action Footer */}
            <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-slate-100">
              {colleges.length < 2 ? (
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></span>
                  <span>Select {2 - colleges.length} more to compare</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>Ready for side-by-side</span>
                </div>
              )}

              {colleges.length >= 2 ? (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={handleCompare}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#033C8D] to-indigo-600 hover:from-[#022B66] hover:to-indigo-700 shadow-md shadow-blue-900/15 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Compare ({colleges.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-400 flex items-center gap-1.5 cursor-not-allowed"
                >
                  <span>Compare</span>
                  <ArrowRight className="w-3 h-3 text-slate-300" />
                </button>
              )}
            </div>

          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

export default CompareTray

