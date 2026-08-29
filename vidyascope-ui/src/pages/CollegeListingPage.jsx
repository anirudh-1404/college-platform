import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Home, Search, GraduationCap, Briefcase, Stethoscope, Layers, Building } from 'lucide-react'
import { publicApi } from '../api/publicApi'
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

  // Dynamic Colleges State from Backend
  const [colleges, setColleges] = useState([])
  const [loading, setLoading] = useState(true)

  // Filter State
  const [filters, setFilters] = useState({
    locations: [],
    maxFees: 50,
    minPackage: 0,
    ownerships: [],
    minRating: 0,
    exams: [],
    facilities: [],
  })

  // Fetch Live Published Colleges from Backend
  useEffect(() => {
    const fetchLiveColleges = async () => {
      setLoading(true)
      try {
        const data = await publicApi.getColleges({
          stream: activeStream,
          query: searchQuery,
          sort: sortBy,
        })
        setColleges(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    fetchLiveColleges()
  }, [activeStream, searchQuery, sortBy])

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
      maxFees: 50,
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
    }
  }

  // Filter computed on dynamically returned colleges
  const filteredColleges = useMemo(() => {
    return colleges.filter((college) => {
      // Ownership filter
      if (filters.ownerships.length > 0 && !filters.ownerships.includes(college.ownership)) {
        return false
      }
      // Rating filter
      if (filters.minRating > 0 && college.rating < filters.minRating) {
        return false
      }
      // Locations filter
      if (filters.locations.length > 0) {
        const match = filters.locations.some((loc) => (college.location || '').toLowerCase().includes(loc.toLowerCase()))
        if (!match) return false
      }
      return true
    })
  }, [colleges, filters])

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      
      {/* 1. Breadcrumb Bar */}
      <div className="bg-white border-b border-border-color py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs font-semibold text-text-light">
            <button
              onClick={onNavigateHome}
              className="hover:text-brand-primary cursor-pointer flex items-center gap-1"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Home</span>
            </button>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="text-text-primary font-bold">Colleges Discovery</span>
          </nav>
        </div>
      </div>

      {/* 2. Main Discovery Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-start gap-8">
          
          {/* Left Desktop & Mobile Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            activeStream={activeStream}
            onStreamChange={(stream) => {
              setActiveStream(stream)
              if (onSelectStream) onSelectStream(stream)
            }}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            totalResults={filteredColleges.length}
            isOpen={isMobileFilterOpen}
            onCloseMobile={() => setIsMobileFilterOpen(false)}
          />

          {/* Right Content Stream */}
          <div className="flex-1 min-w-0 space-y-4">
            
            {/* Sort & Search Bar */}
            <SortBar
              totalCount={filteredColleges.length}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onOpenMobileFilter={() => setIsMobileFilterOpen(true)}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeFilters={filters}
              onRemoveChip={handleRemoveChip}
              onResetFilters={handleResetFilters}
            />

            {/* Colleges Listing Grid/List */}
            {loading ? (
              <div className="p-16 text-center bg-white border border-slate-200/80 rounded-2xl">
                <p className="text-xs font-semibold text-slate-500 animate-pulse">
                  Loading published colleges from live database...
                </p>
              </div>
            ) : filteredColleges.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 gap-5'
                    : 'space-y-4'
                }
              >
                {filteredColleges.map((college) => {
                  const isCompared = compareList.some((c) => c.id === college.id)
                  const isShortlisted = shortlistedIds.includes(college.id)

                  return (
                    <CollegeCard
                      key={college.id}
                      college={college}
                      viewMode={viewMode}
                      isCompared={isCompared}
                      onToggleCompare={onToggleCompare}
                      onSelectCollege={onSelectCollege}
                      isShortlisted={isShortlisted}
                      onToggleShortlist={onToggleShortlist}
                    />
                  )
                })}
              </div>
            ) : (
              <div className="p-16 text-center bg-white border border-slate-200/80 rounded-2xl space-y-3">
                <Building className="h-10 w-10 text-slate-300 mx-auto" />
                <h3 className="font-serif text-base font-bold text-slate-800">
                  No Colleges Found
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  There are no published colleges matching your active search or filters. Colleges approved and published in the Admin Dashboard will appear here live.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="btn btn-outline btn-sm text-xs cursor-pointer mt-2"
                >
                  Clear All Filters
                </button>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Floating Compare Tray */}
      <CompareTray
        compareList={compareList}
        onRemoveCompare={(cId) => onToggleCompare && onToggleCompare({ id: cId })}
        onClearAll={onClearCompare}
        onNavigateCompare={onNavigateCompare}
      />

    </div>
  )
}

export default CollegeListingPage
