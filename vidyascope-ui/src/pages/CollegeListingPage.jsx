import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Home, Search, GraduationCap, Briefcase, Stethoscope, Layers, Building } from 'lucide-react'
import { publicApi } from '../api/publicApi'
import FilterSidebar from '../components/FilterSidebar'
import SortBar from '../components/SortBar'
import CollegeCard from '../components/CollegeCard'
import { staggerFast, cardVariant } from '../utils/animations'

const parseFeeInLakhs = (feeStr) => {
  if (!feeStr) return 0
  if (typeof feeStr === 'number') return feeStr
  const match = String(feeStr).match(/[\d.]+/)
  if (!match) return 0
  const num = parseFloat(match[0])
  if (/cr/i.test(feeStr)) return num * 100
  if (/lakh|lac|lpa|l\b/i.test(feeStr)) return num
  if (num > 1000) return num / 100000
  return num
}

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
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  const [activeStream, setActiveStream] = useState(selectedStream || 'all')

  // Dynamic Colleges State from Backend
  const [colleges, setColleges] = useState([])
  const [loading, setLoading] = useState(true)

  // 4 Core Streamlined Filters: Stream, Ownership, Location, MaxFees
  const [filters, setFilters] = useState({
    locations: [],
    maxFees: 30, // 30 represents "Any Fee / No Limit"
    ownerships: [],
  })

  // Fetch Live Published Colleges from Backend
  useEffect(() => {
    const fetchLiveColleges = async () => {
      setLoading(true)
      try {
        const data = await publicApi.getColleges({
          stream: activeStream,
          query: searchQuery,
        })
        setColleges(Array.isArray(data) ? data : [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    fetchLiveColleges()
  }, [activeStream, searchQuery])

  // Keep activeStream synced with incoming prop
  useEffect(() => {
    if (selectedStream) {
      setActiveStream(selectedStream)
    }
  }, [selectedStream])

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
    if (onSelectStream) onSelectStream('all')
    setFilters({
      locations: [],
      maxFees: 30,
      ownerships: [],
    })
  }

  const handleRemoveChip = (type, value) => {
    if (type === 'searchQuery') {
      setSearchQuery('')
    } else if (type === 'stream') {
      setActiveStream('all')
      if (onSelectStream) onSelectStream('all')
    } else if (type === 'locations' || type === 'ownerships') {
      setFilters((prev) => ({
        ...prev,
        [type]: (prev[type] || []).filter((item) => item !== value),
      }))
    } else if (type === 'maxFees') {
      setFilters((prev) => ({
        ...prev,
        maxFees: 30,
      }))
    }
  }

  // Active Filter Chips for Quick Dismissal
  const activeFilterChips = useMemo(() => {
    const chips = []
    if (activeStream && activeStream !== 'all') {
      const streamLabel = activeStream.charAt(0).toUpperCase() + activeStream.slice(1)
      chips.push({
        type: 'stream',
        value: activeStream,
        label: `Stream: ${streamLabel}`,
      })
    }
    if (filters.ownerships && filters.ownerships.length > 0) {
      filters.ownerships.forEach((own) => {
        chips.push({
          type: 'ownerships',
          value: own,
          label: own,
        })
      })
    }
    if (filters.locations && filters.locations.length > 0) {
      filters.locations.forEach((loc) => {
        chips.push({
          type: 'locations',
          value: loc,
          label: loc,
        })
      })
    }
    if (filters.maxFees && filters.maxFees < 30) {
      chips.push({
        type: 'maxFees',
        value: filters.maxFees,
        label: `Max Fee: ₹${filters.maxFees}L`,
      })
    }
    if (searchQuery && searchQuery.trim()) {
      chips.push({
        type: 'searchQuery',
        value: searchQuery,
        label: `Search: "${searchQuery}"`,
      })
    }
    return chips
  }, [activeStream, filters, searchQuery])

  // Filter computed on dynamically returned colleges
  const filteredColleges = useMemo(() => {
    return colleges.filter((college) => {
      // 1. Discipline / Stream filter
      if (activeStream && activeStream !== 'all') {
        const streamMatch = (college.stream || '').toLowerCase() === activeStream.toLowerCase()
        if (!streamMatch) return false
      }

      // 2. Ownership / Institute Type filter
      if (filters.ownerships && filters.ownerships.length > 0) {
        if (!filters.ownerships.includes(college.ownership)) {
          return false
        }
      }

      // 3. Location / State filter
      if (filters.locations && filters.locations.length > 0) {
        const match = filters.locations.some((loc) => {
          const l = loc.toLowerCase()
          const collegeLoc = (college.location || '').toLowerCase()
          const city = (college.locationContact?.city || '').toLowerCase()
          const state = (college.locationContact?.state || '').toLowerCase()
          return collegeLoc.includes(l) || city.includes(l) || state.includes(l)
        })
        if (!match) return false
      }

      // 4. Maximum Fees filter
      if (filters.maxFees && filters.maxFees < 30) {
        const feeStr = college.totalFees || college.coursesOffered?.[0]?.fee || ''
        const feeNum = parseFeeInLakhs(feeStr)
        if (feeNum > 0 && feeNum > filters.maxFees) {
          return false
        }
      }

      return true
    })
  }, [colleges, activeStream, filters])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F3F6FC] via-[#F8FAFC] to-[#EEF3FB] pb-20 relative isolate overflow-hidden">
      {/* Ambient background refraction glows for 3D glassmorphic cards */}
      <div className="absolute top-24 right-10 w-96 h-96 bg-blue-300/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[600px] left-10 w-96 h-96 bg-indigo-300/12 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-sky-300/15 rounded-full blur-3xl pointer-events-none -z-10" />
      
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
            
            {/* Controls Bar & Filter Chips */}
            <SortBar
              totalCount={filteredColleges.length}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onOpenMobileFilter={() => setIsMobileFilterOpen(true)}
              activeFilterChips={activeFilterChips}
              onRemoveChip={handleRemoveChip}
            />

            {/* Colleges Listing Grid/List */}
            {loading ? (
              <div className="p-16 text-center bg-white border border-slate-200/80 rounded-2xl">
                <p className="text-xs font-semibold text-slate-500 animate-pulse">
                  Loading published colleges from live database...
                </p>
              </div>
            ) : filteredColleges.length > 0 ? (
              <motion.div
                layout
                variants={staggerFast}
                initial="hidden"
                animate="visible"
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
                    <motion.div key={college.id} variants={cardVariant} layout>
                      <CollegeCard
                        college={college}
                        viewMode={viewMode}
                        isCompared={isCompared}
                        onToggleCompare={onToggleCompare}
                        onSelectCollege={onSelectCollege}
                        isShortlisted={isShortlisted}
                        onToggleShortlist={onToggleShortlist}
                      />
                    </motion.div>
                  )
                })}
              </motion.div>
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
    </div>
  )
}

export default CollegeListingPage
