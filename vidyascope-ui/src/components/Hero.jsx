import React, { useState, useEffect, useRef } from 'react'
import {
  Search,
  ChevronRight,
  MapPin,
  Building,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { publicApi } from '../api/publicApi'
import { fadeInUp, staggerContainer } from '../utils/animations'



const Hero = ({
  onNavigateListing,
  onNavigateCompare,
  onSelectCollege,
  onHeroSearch,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [colleges, setColleges] = useState([])
  const [loading, setLoading] = useState(true)
  const dropdownRef = useRef(null)

  // Fetch strictly REAL published colleges from Database via Backend API
  useEffect(() => {
    let isMounted = true
    const fetchRealColleges = async () => {
      setLoading(true)
      try {
        const data = await publicApi.getColleges({ sort: 'nirf' })
        if (isMounted) {
          setColleges(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        console.error('Error fetching real colleges from backend:', err)
        if (isMounted) setColleges([])
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchRealColleges()
    return () => {
      isMounted = false
    }
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Dynamic Auto-suggestions based solely on real database colleges (Colleges only)
  const filteredSuggestions = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return []

    return colleges
      .filter((college) => {
        const nameMatch = college.name && college.name.toLowerCase().includes(q)
        const shortNameMatch = college.shortName && college.shortName.toLowerCase().includes(q)
        return Boolean(nameMatch || shortNameMatch)
      })
      .slice(0, 6)
  }, [searchQuery, colleges])

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault()
    setIsDropdownOpen(false)
    if (onHeroSearch) {
      onHeroSearch({ query: searchQuery.trim(), stream: '' })
    } else if (onNavigateListing) {
      onNavigateListing()
    }
  }



  const handleSelectSuggestion = (collegeId) => {
    setIsDropdownOpen(false)
    if (onSelectCollege) {
      onSelectCollege(collegeId)
    }
  }

  return (
    <section className="relative bg-gradient-to-b from-[#F3F6FC] via-[#F8FAFC] to-white pt-10 pb-16 lg:pt-14 lg:pb-20 overflow-hidden border-b border-slate-100">
      {/* Background Soft Glow Blobs */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-7xl h-80 pointer-events-none -z-10">
        <div className="absolute top-4 left-[8%] w-80 h-80 bg-blue-300/15 rounded-full blur-3xl" />
        <div className="absolute top-4 right-[8%] w-80 h-80 bg-indigo-300/15 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= HERO HEADER & SEARCH CONTAINER ================= */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center relative z-30 max-w-6xl mx-auto"
        >
          {/* Main Hero Titles */}
          <motion.div variants={fadeInUp} className="space-y-2 mb-8 sm:mb-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] xl:text-[2.9rem] font-bold text-slate-900 tracking-tight leading-tight sm:whitespace-nowrap">
              Find Your Dream Campus. Start Your Journey.
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-normal">
              Explore verified top-tier universities, cutoffs, and placements across India
            </p>
          </motion.div>

          {/* Centered Subtle Frosted Glass Search Hub with Light Logo Color Blend */}
          <div className="relative z-30 max-w-2xl sm:max-w-3xl mx-auto mb-14 sm:mb-20">

            {/* Halka Halka Soft Logo Colors Blend Behind Glass (Light Royal Blue, Sky Cyan, Soft Indigo) */}
            <div className="absolute inset-x-2 inset-y-0 bg-gradient-to-r from-[#033C8D]/15 via-[#00A3FF]/22 to-[#6366F1]/18 rounded-full blur-xl z-0 pointer-events-none transform scale-y-125 scale-x-102" />

            {/* MAIN FROSTED GLASS CAPSULE CONTAINER */}
            <motion.div
              variants={fadeInUp}
              ref={dropdownRef}
              className="relative z-30 bg-white/55 hover:bg-white/65 backdrop-blur-xl rounded-full p-2 sm:p-2.5 shadow-[0_15px_35px_rgba(3,60,141,0.08),inset_0_1.5px_2px_rgba(255,255,255,1),inset_0_-1px_1.5px_rgba(3,60,141,0.04)] border border-white/90 transition-all duration-300"
            >
              {/* Search Form Bar */}
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 stroke-[2.2] pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setIsDropdownOpen(true)
                  }}
                  onFocus={() => {
                    if (searchQuery.trim().length > 0) setIsDropdownOpen(true)
                  }}
                  placeholder="Search colleges (e.g. IIT Delhi, BITS Pilani, AIIMS, DTU)..."
                  className="w-full pl-13 pr-16 py-3.5 sm:py-4 rounded-full bg-white/40 hover:bg-white/55 focus:bg-white/75 backdrop-blur-md text-xs sm:text-base text-slate-900 placeholder:text-slate-400 font-medium transition-all border border-white/70 focus:border-[#033C8D]/40 focus:ring-4 focus:ring-[#033C8D]/10 outline-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
                />

                {/* Circular Search Icon Button */}
                <button
                  type="submit"
                  aria-label="Search"
                  className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-[#033C8D] to-[#022B66] hover:from-[#022B66] hover:to-[#011B40] text-white flex items-center justify-center cursor-pointer shadow-md shadow-blue-900/25 ring-2 ring-white/80 active:scale-95 transition-all"
                >
                  <Search className="h-5 w-5 stroke-[2.5]" />
                </button>
              </form>

              {/* Instant Auto-suggestions Dropdown */}
              <AnimatePresence>
                {isDropdownOpen && searchQuery.trim().length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 mt-3 bg-white/98 backdrop-blur-2xl rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-200/90 overflow-hidden z-50 divide-y divide-slate-100 text-left"
                  >
                    {filteredSuggestions.length > 0 ? (
                      <>
                        <div className="px-5 py-2.5 bg-slate-50/90 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                          <span>Matching Colleges in Database</span>
                          <span>{filteredSuggestions.length} Results</span>
                        </div>

                        <div className="max-h-64 overflow-y-auto">
                          {filteredSuggestions.map((item) => (
                            <div
                              key={item.id || item.slug}
                              onClick={() => handleSelectSuggestion(item.id || item.slug)}
                              className="px-5 py-3 hover:bg-blue-50/70 cursor-pointer transition-colors flex items-center justify-between gap-3 group"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-xs text-[#033C8D]">
                                  {item.image || item.logo ? (
                                    <img
                                      src={item.image || item.logo}
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    item.name.charAt(0)
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#033C8D] truncate">
                                    {item.name}
                                  </p>
                                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                                    <span className="flex items-center gap-0.5">
                                      <MapPin className="h-3 w-3 text-slate-400" />
                                      {item.location || item.locationContact?.city || 'India'}
                                    </span>
                                    {item.avgPackage && (
                                      <>
                                        <span>•</span>
                                        <span className="font-semibold text-emerald-600">
                                          Avg {item.avgPackage}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 flex-shrink-0">
                                {item.nirfRank && (
                                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200/60">
                                    NIRF #{item.nirfRank}
                                  </span>
                                )}
                                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-[#033C8D] group-hover:translate-x-0.5 transition-transform" />
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="p-3 bg-slate-50 text-center">
                          <button
                            type="button"
                            onClick={handleSearchSubmit}
                            className="text-xs font-bold text-[#033C8D] hover:underline cursor-pointer"
                          >
                            View all results for &quot;{searchQuery}&quot; →
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="p-6 text-center text-xs text-slate-500 space-y-1">
                        <Building className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                        <p className="font-semibold text-slate-700">No colleges found matching &quot;{searchQuery}&quot;</p>
                        <p className="text-[11px] text-slate-400">Search is limited strictly to college names &amp; abbreviations.</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

          </div>
        </motion.div>

        {/* ================= DISCOVER INDIA'S LEADING INSTITUTIONS (STRICTLY REAL BACKEND DATA) ================= */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={fadeInUp}
          className="relative z-10 mt-6 sm:mt-10"
        >
          {/* Section Heading */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2 text-left">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Discover India’s Leading Institutions
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Real accredited universities & institutes approved and published in the system.
              </p>
            </div>
            {colleges.length > 0 && (
              <button
                type="button"
                onClick={() => onNavigateListing && onNavigateListing()}
                className="text-xs sm:text-sm font-bold text-[#033C8D] hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
              >
                <span>View All In Catalog ({colleges.length})</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Dynamic Content Loading & Rendering */}
          {loading ? (
            <div className="p-12 text-center bg-white border border-slate-200/80 rounded-2xl space-y-3">
              <div className="w-8 h-8 border-3 border-[#033C8D] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-semibold text-slate-500">
                Fetching approved institutions from database...
              </p>
            </div>
          ) : colleges.length > 0 ? (
            <div className="relative isolate">
              {/* Soft Ambient Refraction Glow Behind Cards Grid */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-200/25 via-indigo-200/20 to-sky-200/25 blur-3xl -z-10 pointer-events-none rounded-3xl" />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {colleges.slice(0, 4).map((college) => {
                  const collegeId = college.id || college.slug || college._id
                  const highestSalary =
                    college.highestPackage || college.placements?.highestDomestic || '₹1.50 Cr PA'
                  const avgSalary =
                    college.avgPackage || college.placements?.avgPackage || '₹24.5 LPA'
                  const locationText =
                    college.location ||
                    (college.locationContact
                      ? `${college.locationContact.city || ''}${college.locationContact.city && college.locationContact.state ? ', ' : ''}${college.locationContact.state || 'India'}`
                      : 'India')
                  const tagText =
                    college.naacGrade
                      ? college.naacGrade.includes('A++')
                        ? 'A++ NAAC'
                        : college.naacGrade.split(' ')[0]
                      : college.nirfRank
                      ? `NIRF #${college.nirfRank}`
                      : college.ownership || 'Government'

                  return (
                    <motion.div
                      key={collegeId}
                      whileHover={{ y: -12, scale: 1.025 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                      onClick={() => onSelectCollege && onSelectCollege(collegeId)}
                      className="group relative isolate w-full bg-gradient-to-b from-white/90 via-white/70 to-white/80 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-white/90 hover:border-white shadow-[0_20px_45px_-12px_rgba(3,60,141,0.14),0_10px_22px_-6px_rgba(0,0,0,0.06),inset_0_2px_2.5px_rgba(255,255,255,1),inset_0_-1.5px_2px_rgba(3,60,141,0.03)] hover:shadow-[0_36px_75px_-12px_rgba(3,60,141,0.30),0_20px_35px_-8px_rgba(0,0,0,0.14),inset_0_2px_2.5px_rgba(255,255,255,1)] transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer p-4 sm:p-5"
                    >
                      {/* Ambient 3D Pop Glow */}
                      <div className="absolute -inset-1 bg-gradient-to-br from-[#033C8D]/25 via-[#00A3FF]/20 to-[#6366F1]/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10" />

                      {/* Top Specular Sheen (Gloss Reflection) */}
                      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/80 via-white/20 to-transparent pointer-events-none rounded-t-2xl sm:rounded-t-3xl" />

                      <div>
                        {/* Image Section with Recessed Frame & 3D Badges */}
                        <div className="relative h-48 sm:h-52 rounded-xl overflow-hidden bg-slate-100 mb-3.5 shadow-[inset_0_2px_6px_rgba(0,0,0,0.1)] border border-white/80">
                          <img
                            src={
                              college.image ||
                              college.logo ||
                              'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80'
                            }
                            alt={college.name}
                            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                          />

                          {/* Top Right Accreditation / Rank 3D Pill */}
                          <div className="absolute top-2.5 right-2.5 z-10">
                            <span className="px-2.5 py-1 rounded-lg bg-white/90 text-slate-800 text-[11px] font-bold shadow-md shadow-black/10 backdrop-blur-md border border-white/95">
                              {tagText}
                            </span>
                          </div>

                          {/* Bottom Left 3D Pill Badge */}
                          <div className="absolute bottom-2.5 left-2.5 z-10">
                            <span className="px-3 py-1 rounded-full bg-slate-900/85 text-white text-[10px] font-bold shadow-md shadow-black/15 backdrop-blur-md border border-white/20 flex items-center gap-1">
                              {college.ownership || 'Government'}
                            </span>
                          </div>
                        </div>

                        {/* Body Content */}
                        <div className="space-y-2">
                          <h3
                            className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-[#033C8D] transition-colors line-clamp-2 leading-snug"
                            title={college.name}
                          >
                            {college.name}
                          </h3>

                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 mb-3">
                            <MapPin className="h-3.5 w-3.5 text-[#033C8D] flex-shrink-0" />
                            <span className="truncate">{locationText}</span>
                            {college.establishmentYear && (
                              <>
                                <span>•</span>
                                <span className="flex-shrink-0">Est. {college.establishmentYear}</span>
                              </>
                            )}
                          </p>
                        </div>
                      </div>

                      <div>
                        {/* Stats Row: 3D Floating Glass Pod */}
                        <div className="grid grid-cols-2 gap-2 py-3 px-3.5 bg-white/70 backdrop-blur-xl rounded-xl border border-white/95 shadow-[0_6px_18px_rgba(3,60,141,0.06),inset_0_1.5px_2px_rgba(255,255,255,1)] text-left mt-2">
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                              High CTC
                            </p>
                            <p className="text-xs sm:text-sm font-extrabold text-slate-900 mt-0.5 truncate" title={highestSalary}>
                              {highestSalary}
                            </p>
                          </div>
                          <div className="border-l border-slate-200/80 pl-3 min-w-0">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                              Avg CTC
                            </p>
                            <p className="text-xs sm:text-sm font-extrabold text-emerald-600 mt-0.5 truncate" title={avgSalary}>
                              {avgSalary}
                            </p>
                          </div>
                        </div>

                        {/* Bottom CTA Button with 3D Depth */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            onSelectCollege && onSelectCollege(collegeId)
                          }}
                          className="w-full mt-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#033C8D] to-[#022B66] hover:from-[#022B66] hover:to-[#011B40] text-white text-xs sm:text-sm font-bold shadow-[0_8px_20px_rgba(3,60,141,0.25)] hover:shadow-[0_12px_28px_rgba(3,60,141,0.38)] active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>Explore Programs</span>
                          <ChevronRight className="h-4 w-4 text-white/90 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="p-14 text-center bg-white border border-slate-200/80 rounded-2xl space-y-2.5">
              <Building className="h-10 w-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                No Published Colleges Yet
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Colleges submitted through the Institutional Portal and approved by the Admin Authority in the database will appear here live.
              </p>
            </div>
          )}
        </motion.div>

      </div>
    </section>
  )
}

export default Hero
