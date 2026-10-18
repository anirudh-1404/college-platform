import React, { useState } from 'react'
import { Filter, RotateCcw, ChevronDown, Search, X, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export const streamList = [
  { id: 'all', label: 'All Disciplines' },
  { id: 'engineering', label: 'Engineering (B.Tech/M.Tech)' },
  { id: 'commerce', label: 'Commerce & Finance (B.Com/M.Com)' },
  { id: 'management', label: 'Management (MBA/BBA)' },
  { id: 'medical', label: 'Medical (MBBS/MD)' },
  { id: 'law', label: 'Law (LLB/LLM)' },
  { id: 'science', label: 'Pure Sciences (B.Sc)' },
  { id: 'arts', label: 'Humanities & Arts' },
]

export const ownershipList = [
  'Government',
  'Private',
  'Autonomous',
  'Deemed',
]

export const defaultLocations = [
  'Delhi NCR',
  'Maharashtra',
  'Karnataka',
  'Tamil Nadu',
  'Uttar Pradesh',
  'West Bengal',
  'Telangana',
  'Gujarat',
]

const FilterSidebar = ({
  filters,
  activeStream = 'all',
  onStreamChange,
  onFilterChange,
  onResetFilters,
  isOpen,
  onCloseMobile,
  totalResults,
  availableStreams,
  availableOwnerships,
  availableLocations,
}) => {
  const [locationQuery, setLocationQuery] = useState('')
  
  // All sections CLOSED by default as requested!
  const [openSections, setOpenSections] = useState({
    stream: false,
    ownership: false,
    location: false,
    fees: false,
  })

  const toggleSection = (sectionKey) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }))
  }

  const handleCheckboxToggle = (category, value) => {
    const currentList = filters[category] || []
    const updated = currentList.includes(value)
      ? currentList.filter((item) => item !== value)
      : [...currentList, value]
    onFilterChange(category, updated)
  }

  const streamsToRender = availableStreams && availableStreams.length > 0 ? availableStreams : streamList
  const ownershipsToRender = availableOwnerships && availableOwnerships.length > 0 ? availableOwnerships : ownershipList
  const locationsToRender = availableLocations && availableLocations.length > 0 ? availableLocations : defaultLocations

  const filteredLocations = locationsToRender.filter((loc) =>
    loc.toLowerCase().includes(locationQuery.toLowerCase())
  )

  const isStreamActive = activeStream && activeStream !== 'all'
  const isOwnershipActive = filters.ownerships && filters.ownerships.length > 0
  const isLocationActive = filters.locations && filters.locations.length > 0
  const isFeesActive = filters.maxFees && filters.maxFees < 30

  const filterContent = (
    <div className="space-y-4 select-none">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border-color">
        <div className="flex items-center gap-2">
          <Filter className="h-4.5 w-4.5 text-brand-primary" />
          <h3 className="font-serif text-base font-bold text-text-primary">Filters</h3>
        </div>
        <button
          onClick={onResetFilters}
          className="flex items-center gap-1 text-xs font-bold text-brand-primary hover:text-brand-primary-hover hover:underline transition-all cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset All</span>
        </button>
      </div>

      {/* 1. Academic Discipline / Stream Filter */}
      {onStreamChange && (
        <div className="border-b border-slate-100 pb-3">
          <button
            type="button"
            onClick={() => toggleSection('stream')}
            className="w-full flex items-center justify-between py-1.5 text-xs font-bold text-text-primary hover:text-brand-primary text-left cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-2">
              <span>Academic Discipline</span>
              {isStreamActive && (
                <span className="w-2 h-2 rounded-full bg-brand-primary" />
              )}
            </div>
            <ChevronDown
              className={`h-4 w-4 text-text-light transition-transform duration-200 ${
                openSections.stream ? 'rotate-180 text-brand-primary' : 'group-hover:text-text-primary'
              }`}
            />
          </button>

          <AnimatePresence initial={false}>
            {openSections.stream && (
              <motion.div
                key="stream-content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="space-y-2 pt-2 pb-1">
                  {streamsToRender.map((st) => {
                    const checked = activeStream === st.id
                    return (
                      <label
                        key={st.id}
                        className="flex items-center justify-between text-xs font-semibold text-text-secondary cursor-pointer hover:text-text-primary transition-colors py-0.5"
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="streamFilter"
                            checked={checked}
                            onChange={() => onStreamChange(st.id)}
                            className="w-4 h-4 text-brand-primary border-border-color focus:ring-brand-primary cursor-pointer accent-brand-primary"
                          />
                          <span className={checked ? 'text-brand-primary font-bold' : ''}>
                            {st.label}
                          </span>
                        </div>
                        {typeof st.count === 'number' && (
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full">
                            {st.count}
                          </span>
                        )}
                      </label>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* 2. Institute Type / Ownership */}
      <div className="border-b border-slate-100 pb-3">
        <button
          type="button"
          onClick={() => toggleSection('ownership')}
          className="w-full flex items-center justify-between py-1.5 text-xs font-bold text-text-primary hover:text-brand-primary text-left cursor-pointer transition-colors group"
        >
          <div className="flex items-center gap-2">
            <span>Institute Type</span>
            {isOwnershipActive && (
              <span className="px-1.5 py-0.2 rounded-full bg-brand-accent text-brand-primary text-[10px] font-bold">
                {filters.ownerships.length}
              </span>
            )}
          </div>
          <ChevronDown
            className={`h-4 w-4 text-text-light transition-transform duration-200 ${
              openSections.ownership ? 'rotate-180 text-brand-primary' : 'group-hover:text-text-primary'
            }`}
          />
        </button>

        <AnimatePresence initial={false}>
          {openSections.ownership && (
            <motion.div
              key="ownership-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="space-y-2 pt-2 pb-1">
                {ownershipsToRender.map((type) => {
                  const checked = (filters.ownerships || []).includes(type)
                  return (
                    <label
                      key={type}
                      className="flex items-center gap-2.5 text-xs font-semibold text-text-secondary cursor-pointer hover:text-text-primary transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleCheckboxToggle('ownerships', type)}
                        className="w-4 h-4 rounded text-brand-primary border-border-color focus:ring-brand-primary cursor-pointer accent-brand-primary"
                      />
                      <span className={checked ? 'text-brand-primary font-bold' : ''}>
                        {type}
                      </span>
                    </label>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Location / State */}
      <div className="border-b border-slate-100 pb-3">
        <button
          type="button"
          onClick={() => toggleSection('location')}
          className="w-full flex items-center justify-between py-1.5 text-xs font-bold text-text-primary hover:text-brand-primary text-left cursor-pointer transition-colors group"
        >
          <div className="flex items-center gap-2">
            <span>State / Region</span>
            {isLocationActive && (
              <span className="px-1.5 py-0.2 rounded-full bg-brand-accent text-brand-primary text-[10px] font-bold">
                {filters.locations.length}
              </span>
            )}
          </div>
          <ChevronDown
            className={`h-4 w-4 text-text-light transition-transform duration-200 ${
              openSections.location ? 'rotate-180 text-brand-primary' : 'group-hover:text-text-primary'
            }`}
          />
        </button>

        <AnimatePresence initial={false}>
          {openSections.location && (
            <motion.div
              key="location-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="space-y-2.5 pt-2 pb-1">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-3 w-3 text-text-light" />
                  <input
                    type="text"
                    placeholder="Search state..."
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    className="w-full pl-7 pr-3 py-1.5 bg-slate-50 border border-border-color rounded-xl text-xs font-medium text-text-primary outline-none focus:border-brand-primary transition-colors"
                  />
                </div>
                {/* State Checkbox List */}
                <div className="space-y-1.5 pt-1">
                  {filteredLocations.map((loc) => {
                    const checked = (filters.locations || []).includes(loc)
                    return (
                      <label
                        key={loc}
                        className="flex items-center gap-2.5 text-xs font-semibold text-text-secondary cursor-pointer hover:text-text-primary transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleCheckboxToggle('locations', loc)}
                          className="w-4 h-4 rounded text-brand-primary border-border-color focus:ring-brand-primary cursor-pointer accent-brand-primary"
                        />
                        <span className={checked ? 'text-brand-primary font-bold' : ''}>
                          {loc}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. Maximum Fees Slider */}
      <div>
        <button
          type="button"
          onClick={() => toggleSection('fees')}
          className="w-full flex items-center justify-between py-1.5 text-xs font-bold text-text-primary hover:text-brand-primary text-left cursor-pointer transition-colors group"
        >
          <div className="flex items-center gap-2">
            <span>Maximum Fees</span>
            {isFeesActive && (
              <span className="w-2 h-2 rounded-full bg-brand-primary" />
            )}
          </div>
          <ChevronDown
            className={`h-4 w-4 text-text-light transition-transform duration-200 ${
              openSections.fees ? 'rotate-180 text-brand-primary' : 'group-hover:text-text-primary'
            }`}
          />
        </button>

        <AnimatePresence initial={false}>
          {openSections.fees && (
            <motion.div
              key="fees-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="space-y-2.5 pt-2 pb-1">
                <div className="flex items-center justify-between text-xs font-bold text-brand-primary">
                  <span>
                    {filters.maxFees && filters.maxFees < 30
                      ? `Up to ₹${filters.maxFees} Lakhs`
                      : 'Any Fee (No Limit)'}
                  </span>
                  {filters.maxFees && filters.maxFees < 30 && (
                    <button
                      type="button"
                      onClick={() => onFilterChange('maxFees', 30)}
                      className="text-[10px] text-slate-400 hover:text-brand-primary font-semibold cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <input
                  type="range"
                  min="2"
                  max="30"
                  step="1"
                  value={filters.maxFees || 30}
                  onChange={(e) => onFilterChange('maxFees', Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                />
                <div className="flex justify-between text-[10px] font-semibold text-text-light">
                  <span>₹2L</span>
                  <span>₹15L</span>
                  <span>₹30L+</span>
                </div>

                {/* Quick Fee Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    { label: 'Under ₹5L', val: 5 },
                    { label: 'Under ₹10L', val: 10 },
                    { label: 'Under ₹20L', val: 20 },
                  ].map((preset) => (
                    <button
                      key={preset.val}
                      type="button"
                      onClick={() => onFilterChange('maxFees', preset.val)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-colors cursor-pointer ${
                        filters.maxFees === preset.val
                          ? 'bg-brand-primary text-white border-brand-primary'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  )

  return (
    <>
      {/* Desktop Sticky Container with Ultra-Smooth Native Scrolling */}
      <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-20 self-start">
        <div className="bg-white rounded-2xl border border-border-color shadow-sm p-5 max-h-[calc(100vh-6rem)] overflow-y-auto overscroll-contain custom-scrollbar">
          {filterContent}
        </div>
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-xs bg-white h-full shadow-premium flex flex-col justify-between py-6 px-5 z-50 overflow-y-auto custom-scrollbar animate-slide-in">
            <div className="flex items-center justify-between pb-4 border-b border-border-color mb-4">
              <span className="font-serif text-lg font-bold text-text-primary">
                Filter Colleges ({totalResults})
              </span>
              <button
                onClick={onCloseMobile}
                className="p-1.5 rounded-xl text-text-secondary hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
              {filterContent}
            </div>

            <div className="pt-4 border-t border-border-color mt-4">
              <button
                onClick={onCloseMobile}
                className="w-full py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-text-on-dark font-bold text-sm shadow-sm cursor-pointer"
              >
                Show {totalResults} Colleges
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default FilterSidebar
