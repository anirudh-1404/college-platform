import React, { useState, useMemo } from 'react'
import { ChevronRight, Home, GraduationCap, Search, SlidersHorizontal } from 'lucide-react'
import { collegesData } from '../data/collegesData'
import FilterSidebar from '../components/FilterSidebar'
import SortBar from '../components/SortBar'
import CollegeCard from '../components/CollegeCard'
import CompareTray from '../components/CompareTray'

const CollegeListingPage = ({ onNavigateHome }) => {
  // Page State
  const [viewMode, setViewMode] = useState('list')
  const [sortBy, setSortBy] = useState('popularity')
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [selectedColleges, setSelectedColleges] = useState([])

  // Filter State
  const [filters, setFilters] = useState({
    locations: [],
    maxFees: 25,
    minPackage: 0,
    ownerships: [],
    minRating: 0,
    exams: [],
    facilities: [],
  })

  // Handlers
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleResetFilters = () => {
    setFilters({
      locations: [],
      maxFees: 25,
      minPackage: 0,
      ownerships: [],
      minRating: 0,
      exams: [],
      facilities: [],
    })
  }

  const handleRemoveChip = (type, value) => {
    if (type === 'locations' || type === 'ownerships' || type === 'exams' || type === 'facilities') {
      setFilters((prev) => ({
        ...prev,
        [type]: (prev[type] || []).filter((item) => item !== value),
      }))
    } else if (type === 'maxFees') {
      setFilters((prev) => ({ ...prev, maxFees: 25 }))
    } else if (type === 'minPackage') {
      setFilters((prev) => ({ ...prev, minPackage: 0 }))
    } else if (type === 'minRating') {
      setFilters((prev) => ({ ...prev, minRating: 0 }))
    }
  }

  const handleToggleCompare = (college) => {
    setSelectedColleges((prev) => {
      const exists = prev.some((item) => item.id === college.id)
      if (exists) {
        return prev.filter((item) => item.id !== college.id)
      } else {
        if (prev.length >= 4) {
          alert('You can compare a maximum of 4 colleges at a time.')
          return prev
        }
        return [...prev, college]
      }
    })
  }

  // Compute Filtered and Sorted Colleges
  const filteredColleges = useMemo(() => {
    return collegesData.filter((college) => {
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

      // Max Fees Filter
      if (college.totalFeesVal > filters.maxFees) return false

      // Min Package Filter
      if (college.avgPackageVal < filters.minPackage) return false

      // Ownership Filter
      if (filters.ownerships.length > 0 && !filters.ownerships.includes(college.ownership)) {
        return false
      }

      // Min Rating Filter
      if (college.rating < filters.minRating) return false

      // Exam Filter
      if (filters.exams.length > 0) {
        const matchesExam = filters.exams.some((ex) => college.examAccepted.includes(ex))
        if (!matchesExam) return false
      }

      // Facility Filter
      if (filters.facilities.length > 0) {
        const matchesFac = filters.facilities.every((fac) => college.facilities.includes(fac))
        if (!matchesFac) return false
      }

      return true
    })
  }, [filters])

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
    filters.locations.forEach((loc) => chips.push({ label: loc, type: 'locations', value: loc }))
    filters.ownerships.forEach((own) => chips.push({ label: own, type: 'ownerships', value: own }))
    filters.exams.forEach((ex) => chips.push({ label: ex, type: 'exams', value: ex }))
    filters.facilities.forEach((fac) => chips.push({ label: fac, type: 'facilities', value: fac }))
    if (filters.maxFees < 25) chips.push({ label: `Max Fees: ₹${filters.maxFees}L`, type: 'maxFees', value: filters.maxFees })
    if (filters.minPackage > 0) chips.push({ label: `Min Pkg: ₹${filters.minPackage}LPA`, type: 'minPackage', value: filters.minPackage })
    if (filters.minRating > 0) chips.push({ label: `${filters.minRating}+ Rating`, type: 'minRating', value: filters.minRating })
    return chips
  }, [filters])

  return (
    <div className="min-h-screen bg-slate-50/60 pb-28">
      {/* Container Wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-text-light mb-6">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-1.5 hover:text-brand-primary transition-colors cursor-pointer"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </button>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-text-primary font-bold">Engineering Colleges</span>
        </nav>

        {/* Page Heading & Header Details */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary tracking-tight">
              Engineering Colleges in India
            </h1>
            <span className="text-xs sm:text-sm font-bold text-brand-primary bg-brand-accent px-3 py-1 rounded-full border border-brand-primary/10 self-start sm:self-auto">
              1,248 Colleges Available
            </span>
          </div>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary font-medium mt-2 leading-relaxed max-w-3xl">
            Explore and compare top B.Tech & Engineering institutes across India by NIRF rankings, placement records, entrance exams, and fee structures.
          </p>
        </div>

        {/* Main Two-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
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
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
                    : 'flex flex-col gap-6'
                }
              >
                {sortedColleges.map((college) => (
                  <CollegeCard
                    key={college.id}
                    college={college}
                    viewMode={viewMode}
                    isCompared={selectedColleges.some((item) => item.id === college.id)}
                    onToggleCompare={handleToggleCompare}
                  />
                ))}
              </div>
            ) : (
              /* No Results State */
              <div className="bg-white border border-border-color rounded-2xl p-12 text-center shadow-sm flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-brand-accent text-brand-primary flex items-center justify-center">
                  <Search className="h-8 w-8" />
                </div>
                <h3 className="font-serif text-xl font-bold text-text-primary">
                  No Colleges Found Matching Your Filters
                </h3>
                <p className="text-sm text-text-secondary font-medium max-w-md">
                  Try broadening your search by clearing location, package, or exam filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-sm shadow-premium transition-all cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Sticky Bottom Compare Tray */}
      <CompareTray
        selectedColleges={selectedColleges}
        onRemoveCollege={(id) =>
          setSelectedColleges((prev) => prev.filter((item) => item.id !== id))
        }
        onClearAll={() => setSelectedColleges([])}
        onCompareNow={() => {
          alert(`Comparing ${selectedColleges.map((c) => c.shortName).join(' vs ')}`)
        }}
      />
    </div>
  )
}

export default CollegeListingPage
