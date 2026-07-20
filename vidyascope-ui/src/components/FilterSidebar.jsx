import React, { useState } from 'react'
import { Filter, X, Search, RotateCcw, ChevronDown, ChevronUp, Star } from 'lucide-react'
import {
  locationOptions,
  ownershipOptions,
  examOptions,
  facilityOptions,
  packageOptions,
} from '../data/collegesData'

const FilterSidebar = ({
  filters,
  onFilterChange,
  onResetFilters,
  isOpen,
  onCloseMobile,
  totalResults,
}) => {
  const [locationQuery, setLocationQuery] = useState('')
  const [collapsedSections, setCollapsedSections] = useState({})

  const toggleSection = (sectionKey) => {
    setCollapsedSections((prev) => ({
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

  const filteredLocations = locationOptions.filter((loc) =>
    loc.toLowerCase().includes(locationQuery.toLowerCase())
  )

  const filterContent = (
    <div className="space-y-6">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border-color">
        <div className="flex items-center gap-2">
          <Filter className="h-4.5 w-4.5 text-brand-primary" />
          <h3 className="font-serif text-lg font-bold text-text-primary">Filters</h3>
        </div>
        <button
          onClick={onResetFilters}
          className="flex items-center gap-1 text-xs font-bold text-brand-primary hover:text-brand-primary-hover hover:underline transition-all cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Clear All</span>
        </button>
      </div>

      {/* 1. Location Filter */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('location')}
          className="w-full flex items-center justify-between text-sm font-bold text-text-primary text-left cursor-pointer"
        >
          <span>Location</span>
          {collapsedSections.location ? (
            <ChevronDown className="h-4 w-4 text-text-light" />
          ) : (
            <ChevronUp className="h-4 w-4 text-text-light" />
          )}
        </button>

        {!collapsedSections.location && (
          <div className="space-y-2.5 pt-1">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-text-light" />
              <input
                type="text"
                placeholder="Search city..."
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-border-color rounded-xl text-xs font-medium text-text-primary outline-none focus:border-brand-primary transition-colors"
              />
            </div>
            {/* Checkbox List */}
            <div className="max-h-40 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
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
                    <span>{loc}</span>
                  </label>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <div className="h-[1px] bg-slate-100" />

      {/* 2. Fees Range Slider & Tiers */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('fees')}
          className="w-full flex items-center justify-between text-sm font-bold text-text-primary text-left cursor-pointer"
        >
          <span>Max Fees (Per Year)</span>
          {collapsedSections.fees ? (
            <ChevronDown className="h-4 w-4 text-text-light" />
          ) : (
            <ChevronUp className="h-4 w-4 text-text-light" />
          )}
        </button>

        {!collapsedSections.fees && (
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between text-xs font-bold text-brand-primary">
              <span>Up to ₹{filters.maxFees || 25} Lakhs</span>
            </div>
            <input
              type="range"
              min="2"
              max="25"
              step="1"
              value={filters.maxFees || 25}
              onChange={(e) => onFilterChange('maxFees', Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
            />
            <div className="flex justify-between text-[10px] font-semibold text-text-light">
              <span>₹2L</span>
              <span>₹25L+</span>
            </div>
          </div>
        )}
      </div>

      <div className="h-[1px] bg-slate-100" />

      {/* 3. Average Package */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('package')}
          className="w-full flex items-center justify-between text-sm font-bold text-text-primary text-left cursor-pointer"
        >
          <span>Average Package</span>
          {collapsedSections.package ? (
            <ChevronDown className="h-4 w-4 text-text-light" />
          ) : (
            <ChevronUp className="h-4 w-4 text-text-light" />
          )}
        </button>

        {!collapsedSections.package && (
          <div className="space-y-2 pt-1">
            {packageOptions.map((pkg) => {
              const checked = (filters.minPackage || 0) === pkg.value
              return (
                <label
                  key={pkg.label}
                  className="flex items-center gap-2.5 text-xs font-semibold text-text-secondary cursor-pointer hover:text-text-primary transition-colors"
                >
                  <input
                    type="radio"
                    name="minPackage"
                    checked={checked}
                    onChange={() => onFilterChange('minPackage', pkg.value)}
                    className="w-4 h-4 text-brand-primary border-border-color focus:ring-brand-primary cursor-pointer accent-brand-primary"
                  />
                  <span>{pkg.label}</span>
                </label>
              )
            })}
          </div>
        )}
      </div>

      <div className="h-[1px] bg-slate-100" />

      {/* 4. Ownership */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('ownership')}
          className="w-full flex items-center justify-between text-sm font-bold text-text-primary text-left cursor-pointer"
        >
          <span>Institute Type</span>
          {collapsedSections.ownership ? (
            <ChevronDown className="h-4 w-4 text-text-light" />
          ) : (
            <ChevronUp className="h-4 w-4 text-text-light" />
          )}
        </button>

        {!collapsedSections.ownership && (
          <div className="space-y-2 pt-1">
            {ownershipOptions.map((type) => {
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
                  <span>{type}</span>
                </label>
              )
            })}
          </div>
        )}
      </div>

      <div className="h-[1px] bg-slate-100" />

      {/* 5. Minimum Rating */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('rating')}
          className="w-full flex items-center justify-between text-sm font-bold text-text-primary text-left cursor-pointer"
        >
          <span>User Rating</span>
          {collapsedSections.rating ? (
            <ChevronDown className="h-4 w-4 text-text-light" />
          ) : (
            <ChevronUp className="h-4 w-4 text-text-light" />
          )}
        </button>

        {!collapsedSections.rating && (
          <div className="space-y-2 pt-1">
            {[4.5, 4.0, 3.5].map((rate) => {
              const checked = (filters.minRating || 0) === rate
              return (
                <label
                  key={rate}
                  className="flex items-center justify-between text-xs font-semibold text-text-secondary cursor-pointer hover:text-text-primary transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="minRating"
                      checked={checked}
                      onChange={() =>
                        onFilterChange('minRating', checked ? 0 : rate)
                      }
                      className="w-4 h-4 text-brand-primary border-border-color focus:ring-brand-primary cursor-pointer accent-brand-primary"
                    />
                    <div className="flex items-center gap-1">
                      <span>{rate} & above</span>
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    </div>
                  </div>
                </label>
              )
            })}
          </div>
        )}
      </div>

      <div className="h-[1px] bg-slate-100" />

      {/* 6. Exams Accepted */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('exam')}
          className="w-full flex items-center justify-between text-sm font-bold text-text-primary text-left cursor-pointer"
        >
          <span>Exams Accepted</span>
          {collapsedSections.exam ? (
            <ChevronDown className="h-4 w-4 text-text-light" />
          ) : (
            <ChevronUp className="h-4 w-4 text-text-light" />
          )}
        </button>

        {!collapsedSections.exam && (
          <div className="space-y-2 pt-1">
            {examOptions.map((exam) => {
              const checked = (filters.exams || []).includes(exam)
              return (
                <label
                  key={exam}
                  className="flex items-center gap-2.5 text-xs font-semibold text-text-secondary cursor-pointer hover:text-text-primary transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleCheckboxToggle('exams', exam)}
                    className="w-4 h-4 rounded text-brand-primary border-border-color focus:ring-brand-primary cursor-pointer accent-brand-primary"
                  />
                  <span>{exam}</span>
                </label>
              )
            })}
          </div>
        )}
      </div>

      <div className="h-[1px] bg-slate-100" />

      {/* 7. Facilities */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('facilities')}
          className="w-full flex items-center justify-between text-sm font-bold text-text-primary text-left cursor-pointer"
        >
          <span>Facilities</span>
          {collapsedSections.facilities ? (
            <ChevronDown className="h-4 w-4 text-text-light" />
          ) : (
            <ChevronUp className="h-4 w-4 text-text-light" />
          )}
        </button>

        {!collapsedSections.facilities && (
          <div className="space-y-2 pt-1">
            {facilityOptions.map((fac) => {
              const checked = (filters.facilities || []).includes(fac)
              return (
                <label
                  key={fac}
                  className="flex items-center gap-2.5 text-xs font-semibold text-text-secondary cursor-pointer hover:text-text-primary transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleCheckboxToggle('facilities', fac)}
                    className="w-4 h-4 rounded text-brand-primary border-border-color focus:ring-brand-primary cursor-pointer accent-brand-primary"
                  />
                  <span>{fac}</span>
                </label>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sticky Container */}
      <aside className="hidden lg:block w-72 flex-shrink-0">
        <div className="bg-white rounded-2xl border border-border-color shadow-card p-5 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto custom-scrollbar">
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
                className="p-1.5 rounded-xl text-text-secondary hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {filterContent}

            <div className="pt-6 border-t border-border-color mt-6">
              <button
                onClick={onCloseMobile}
                className="w-full py-3 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-text-on-dark font-bold text-sm shadow-premium"
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
