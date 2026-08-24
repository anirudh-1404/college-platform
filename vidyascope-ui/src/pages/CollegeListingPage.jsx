import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Home, Search, GraduationCap, Briefcase, Stethoscope, Layers } from 'lucide-react'
import { collegesData } from '../data/collegesData'
import FilterSidebar from '../components/FilterSidebar'
import SortBar from '../components/SortBar'
import CollegeCard from '../components/CollegeCard'
import CompareTray from '../components/CompareTray'

const CollegeListingPage = ({
  onNavigateHome,
  selectedStream = 'all',
  onSelectStream,
  onNavigateBack,
  onSelectCollege,
  compareList = [],
  onToggleCompare,
  onClearCompare,
  onNavigateCompare,
  shortlistedIds = [],
  onToggleShortlist,
  initialSearchQuery = '',
}) => {
  // Page State
  const [viewMode, setViewMode] = useState('list')
  const [sortBy, setSortBy] = useState('popularity')
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  const [activeStream, setActiveStream] = useState(selectedStream || 'all')

  // Filter State
  const [filters, setFilters] = useState({
    locations: [],
    maxFees: 30,
    minPackage: 0,
    ownerships: [],
    minRating: 0,
    exams: [],
    facilities: [],
  })

  // Stream options
  const streamOptions = [
    { id: 'all', label: 'All Disciplines', icon: Layers },
    { id: 'engineering', label: 'Engineering (B.Tech)', icon: GraduationCap },
    { id: 'management', label: 'Management (MBA)', icon: Briefcase },
    { id: 'medical', label: 'Medical (MBBS)', icon: Stethoscope },
  ]

  // Handlers
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleResetFilters = () => {
    setSearchQuery('')
    setActiveStream('all')
    setFilters({
      locations: [],
      maxFees: 30,
      minPackage: 0,
      ownerships: [],
      minRating: 0,
      exams: [],
      facilities: [],
    })
  }

  const handleRemoveChip = (type, value) => {
    if (type === 'searchQuery') {
      setSearchQuery('')
    } else if (
      type === 'locations' ||
      type === 'ownerships' ||
      type === 'exams' ||
      type === 'facilities'
    ) {
      setFilters((prev) => ({
        ...prev,
        [type]: (prev[type] || []).filter((item) => item !== value),
      }))
    } else if (type === 'maxFees') {
      setFilters((prev) => ({ ...prev, maxFees: 30 }))
    } else if (type === 'minPackage') {
      setFilters((prev) => ({ ...prev, minPackage: 0 }))
    } else if (type === 'minRating') {
      setFilters((prev) => ({ ...prev, minRating: 0 }))
    }
  }

  // Compute Filtered and Sorted Colleges
  const filteredColleges = useMemo(() => {
    return collegesData.filter((college) => {
      // Search Query Filter
      if (searchQuery.trim() !== '') {
        const queryLower = searchQuery.toLowerCase()
        const matchesName =
          college.name.toLowerCase().includes(queryLower) ||
          college.shortName.toLowerCase().includes(queryLower)
        const matchesCity =
          college.city.toLowerCase().includes(queryLower) ||
          college.state.toLowerCase().includes(queryLower)
        if (!matchesName && !matchesCity) return false
      }

      // Stream Filter
      if (activeStream !== 'all' && college.stream !== activeStream) {
        return false
      }

      // Location Filter
      if (filters.locations.length > 0) {
        const matchesLoc = filters.locations.some(
          (loc) =>
            college.state.toLowerCase().includes(loc.toLowerCase()) ||
            college.city.toLowerCase().includes(loc.toLowerCase()) ||
            college.location.toLowerCase().includes(loc.toLowerCase())
        )
        if (!matchesLoc) return false
      }

      // Max Fees Filter (annualized or total)
      if (college.totalFeesVal > filters.maxFees) return false

      // Min Package Filter
      if (college.avgPackageVal < filters.minPackage) return false

      // Ownership Filter
      if (
        filters.ownerships.length > 0 &&
        !filters.ownerships.includes(college.ownership)
      ) {
        return false
      }

      // Min Rating Filter
      if (college.rating < filters.minRating) return false

      // Exam Filter
      if (filters.exams.length > 0) {
        const matchesExam = filters.exams.some((ex) =>
          college.examAccepted.includes(ex)
        )
        if (!matchesExam) return false
      }

      // Facility Filter
      if (filters.facilities.length > 0) {
        const matchesFac = filters.facilities.every((fac) =>
          college.facilities.includes(fac)
        )
        if (!matchesFac) return false
      }

      return true
    })
  }, [filters, activeStream, searchQuery])

  // Sorting
  const sortedColleges = useMemo(() => {
    const copy = [...filteredColleges]
    if (sortBy === 'rating') {
      return copy.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === 'nirf') {
      return copy.sort((a, b) => a.nirfRank - b.nirfRank)
    } else if (sortBy === 'fees-low') {
      return copy.sort((a, b) => a.totalFeesVal - b.totalFeesVal)
    } else if (sortBy === 'fees-high') {
      return copy.sort((a, b) => b.totalFeesVal - a.totalFeesVal)
    } else if (sortBy === 'package-high') {
      return copy.sort((a, b) => b.avgPackageVal - a.avgPackageVal)
    }
    return copy
  }, [filteredColleges, sortBy])

  // Active Filter Chips
  const activeFilterChips = useMemo(() => {
    const chips = []
    if (searchQuery.trim() !== '') {
      chips.push({
        label: `Search: "${searchQuery}"`,
        type: 'searchQuery',
        value: searchQuery,
      })
    }
    filters.locations.forEach((loc) =>
      chips.push({ label: loc, type: 'locations', value: loc })
    )
    filters.ownerships.forEach((own) =>
      chips.push({ label: own, type: 'ownerships', value: own })
    )
    filters.exams.forEach((ex) =>
      chips.push({ label: ex, type: 'exams', value: ex })
    )
    filters.facilities.forEach((fac) =>
      chips.push({ label: fac, type: 'facilities', value: fac })
    )
    if (filters.maxFees < 30) {
      chips.push({
        label: `Max Fees: ₹${filters.maxFees}L`,
        type: 'maxFees',
        value: filters.maxFees,
      })
    }
    if (filters.minPackage > 0) {
      chips.push({
        label: `Min Pkg: ₹${filters.minPackage}LPA`,
        type: 'minPackage',
        value: filters.minPackage,
      })
    }
    if (filters.minRating > 0) {
      chips.push({
        label: `${filters.minRating}+ Rating`,
        type: 'minRating',
        value: filters.minRating,
      })
    }
    return chips
  }, [filters, searchQuery])

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      {/* Container Wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-text-light mb-5">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-1 hover:text-brand-primary transition-colors cursor-pointer"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
          </button>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <button
            onClick={onNavigateBack}
            className="hover:text-brand-primary transition-colors cursor-pointer"
          >
            Domains
          </button>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <span className="text-text-primary font-bold">Colleges Discovery</span>
        </nav>

        {/* Page Heading & Search */}
        <div className="mb-6 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary">
                Explore Top Colleges in India
              </h1>
              <p className="text-xs sm:text-sm text-text-secondary mt-1">
                Filter by entrance exam, verified placement records, location, and fee structures.
              </p>
            </div>

            {/* Direct Search Bar */}
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Search college or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white border border-border-color focus:border-brand-primary outline-none text-xs font-medium shadow-xs"
              />
              <Search className="h-4 w-4 text-text-light absolute left-3 top-3" />
            </div>
          </div>

          {/* Stream Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pt-2">
            {streamOptions.map((stream) => {
              const Icon = stream.icon
              const isSelected = activeStream === stream.id
              return (
                <button
                  key={stream.id}
                  onClick={() => {
                    setActiveStream(stream.id)
                    if (onSelectStream) onSelectStream(stream.id)
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-brand-primary text-white font-bold'
                      : 'bg-white border border-border-color text-text-secondary hover:text-brand-primary hover:bg-brand-accent'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{stream.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Main Two-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* Left Column: Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            isOpen={isMobileFilterOpen}
            onCloseMobile={() => setIsMobileFilterOpen(false)}
            totalResults={sortedColleges.length}
          />

          {/* Right Column: Listing Toolbar & College Cards */}
          <div className="flex-1 w-full">

            {/* Toolbar */}
            <SortBar
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              activeFilterChips={activeFilterChips}
              onRemoveChip={handleRemoveChip}
              onOpenMobileFilters={() => setIsMobileFilterOpen(true)}
              totalCount={sortedColleges.length}
            />

            {/* Cards Grid / List View */}
            {sortedColleges.length > 0 ? (
              <motion.div
                layout
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
                    : 'flex flex-col gap-4'
                }
              >
                <AnimatePresence>
                  {sortedColleges.map((college) => (
                    <CollegeCard
                      key={college.id}
                      college={college}
                      viewMode={viewMode}
                      isCompared={compareList.some(
                        (item) => item.id === college.id
                      )}
                      onToggleCompare={onToggleCompare}
                      onSelectCollege={onSelectCollege}
                      isShortlisted={shortlistedIds.includes(college.id)}
                      onToggleShortlist={onToggleShortlist}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              /* No Results State */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-border-color rounded-xl p-10 text-center shadow-xs flex flex-col items-center justify-center space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-accent text-brand-primary flex items-center justify-center">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-text-primary">
                  No Colleges Found Matching Your Filters
                </h3>
                <p className="text-xs text-text-secondary max-w-sm">
                  Try clearing specific location, fee, or exam criteria to expand your results.
                </p>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleResetFilters}
                  className="px-4 py-2 rounded-lg bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Reset All Filters
                </motion.button>
              </motion.div>
            )}

          </div>

        </div>

      </div>

      {/* Sticky Bottom Compare Tray */}
      <CompareTray
        selectedColleges={compareList}
        onRemoveCollege={(id) =>
          onToggleCompare &&
          onToggleCompare(collegesData.find((c) => c.id === id))
        }
        onClearAll={onClearCompare}
        onCompareNow={onNavigateCompare}
      />
    </div>
  )
}

export default CollegeListingPage
