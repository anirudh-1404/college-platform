import React, { useState, useEffect, useMemo } from 'react'
import {
  ChevronRight,
  Home,
  X,
  Plus,
  Star,
  Scale,
  Building2,
  CheckCircle,
  ArrowRight,
  Search,
  Sparkles,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { publicApi } from '../api/publicApi'

const CollegeComparePage = ({
  selectedColleges = [],
  onRemoveCollege,
  onAddCollege,
  onClearAll,
  onNavigateHome,
  onNavigateListing,
  onOpenCounseling,
  onSelectCollege,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Strictly REAL-TIME colleges fetched directly from MongoDB Database (same as College Listing)
  const [allLiveColleges, setAllLiveColleges] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const fetchColleges = async () => {
      setLoading(true)
      try {
        const live = await publicApi.getColleges({ sort: 'nirf' })
        if (isMounted) {
          if (Array.isArray(live)) {
            const normalized = live.map((c) => ({
              ...c,
              id: c.slug || c.id || c._id,
              slug: c.slug || c.id || c._id,
              name: c.name,
              shortName: c.shortName || c.name,
              image:
                c.image ||
                c.logo ||
                'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
              avgPackage: c.avgPackage || c.placements?.avgPackage || '₹18.5 LPA',
              totalFees: c.totalFees || '₹8.5 Lakhs',
              rating: c.rating || 4.8,
              ownership: c.ownership || 'Government',
              nirfRank: c.nirfRank || c.rankings?.nirfRank || 1,
            }))
            setAllLiveColleges(normalized)
          } else {
            setAllLiveColleges([])
          }
        }
      } catch (err) {
        console.error('Failed to fetch real live colleges for comparison:', err)
        if (isMounted) setAllLiveColleges([])
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchColleges()
    return () => {
      isMounted = false
    }
  }, [])

  // Lock body & Lenis smooth scroll while the Add College modal is open
  useEffect(() => {
    if (isAddModalOpen) {
      document.body.style.overflow = 'hidden'
      if (window.__lenis) {
        window.__lenis.stop()
      }
    } else {
      document.body.style.overflow = ''
      if (window.__lenis) {
        window.__lenis.start()
      }
    }
    return () => {
      document.body.style.overflow = ''
      if (window.__lenis) {
        window.__lenis.start()
      }
    }
  }, [isAddModalOpen])

  // Current colleges being compared (hydrated with real-time live database values)
  const comparedList = useMemo(() => {
    if (!selectedColleges || selectedColleges.length === 0) return []
    return selectedColleges.map((sc) => {
      const liveMatch = allLiveColleges.find(
        (lc) => (lc.slug || lc.id || lc._id) === (sc.slug || sc.id || sc._id)
      )
      return liveMatch ? { ...liveMatch, ...sc } : sc
    })
  }, [selectedColleges, allLiveColleges])

  // Top 4 popular colleges directly from real-time database (same order as College Listing)
  const suggestedColleges = useMemo(() => {
    if (!allLiveColleges || allLiveColleges.length === 0) return []
    return allLiveColleges.slice(0, 4)
  }, [allLiveColleges])

  // Toggle college into/out of comparison from the top cards
  const handleToggleSuggest = (college) => {
    const collegeId = college.id || college._id || college.slug
    const isAlreadySelected = comparedList.some(
      (c) => (c.id || c._id || c.slug) === collegeId
    )
    if (isAlreadySelected) {
      if (onRemoveCollege) onRemoveCollege(collegeId)
    } else {
      if (comparedList.length >= 4) {
        alert('You can compare up to 4 colleges at a time.')
        return
      }
      if (onAddCollege) onAddCollege(college)
    }
  }

  // Available colleges to add in the modal
  const availableToAdd = useMemo(() => {
    const activeIds = comparedList.map((c) => c.id || c._id || c.slug)
    return allLiveColleges.filter(
      (c) =>
        !activeIds.includes(c.id || c._id || c.slug) &&
        (c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (c.shortName && c.shortName.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (c.location && c.location.toLowerCase().includes(searchQuery.toLowerCase())))
    )
  }, [comparedList, allLiveColleges, searchQuery])

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      {/* 1. Breadcrumb Navigation */}
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
            <button
              onClick={onNavigateListing}
              className="hover:text-brand-primary cursor-pointer"
            >
              Colleges
            </button>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="text-text-primary font-bold">Side-by-Side Comparison</span>
          </nav>
        </div>
      </div>

      {/* 2. Main Header & Toolbar */}
      <div className="bg-white border-b border-border-color py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary">
                Compare Selected Colleges
              </h1>
              <p className="text-xs sm:text-sm text-text-secondary mt-1">
                {comparedList.length > 0
                  ? `Comparing ${comparedList.length} of max 4 colleges across fees, placements, ratings, rankings, and facilities.`
                  : 'Select up to 4 colleges to compare their placements, fees, ratings, and cutoffs side-by-side.'}
              </p>
            </div>

            {/* Actions Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
              {comparedList.length < 4 && (
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="btn btn-primary btn-md text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add College</span>
                </button>
              )}

              {comparedList.length > 0 && (
                <button
                  type="button"
                  onClick={onClearAll}
                  className="text-xs font-bold text-slate-500 hover:text-rose-600 px-2 py-1 cursor-pointer transition-colors"
                >
                  Clear Selection
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2.5 Quick Compare Suggestions Strip (4-5 Cards) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-7 pb-2">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs mb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#033C8D] flex items-center justify-center border border-blue-100 shadow-2xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-serif text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>Quick Compare Suggestions</span>
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Click any of the 4 featured colleges below to compare directly ({comparedList.length}/4 selected)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${comparedList.length > 0
                  ? 'bg-blue-50 text-[#033C8D] border-blue-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                {comparedList.length} of 4 selected
              </span>
            </div>
          </div>

          {/* 4 Quick Comparison Cards Grid (Real-Time Database Colleges) */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((idx) => (
                <div
                  key={idx}
                  className="rounded-xl p-3 bg-white border border-slate-200 animate-pulse space-y-2.5"
                >
                  <div className="h-28 w-full bg-slate-200 rounded-lg" />
                  <div className="h-4 w-3/4 bg-slate-200 rounded" />
                  <div className="h-3 w-1/2 bg-slate-100 rounded" />
                  <div className="h-10 w-full bg-slate-100 rounded-lg" />
                  <div className="h-7 w-full bg-slate-100 rounded-lg" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {suggestedColleges.map((college) => {
                const collegeId = college.id || college._id || college.slug
                const isSelected = comparedList.some(
                  (c) => (c.id || c._id || c.slug) === collegeId
                )

                return (
                  <motion.div
                    key={collegeId}
                    whileHover={{ y: -4, scale: 1.015 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleToggleSuggest(college)}
                    className={`relative rounded-xl p-3 cursor-pointer transition-all duration-200 flex flex-col justify-between group text-left ${isSelected
                        ? 'bg-blue-50/50 border-2 border-[#033C8D] shadow-md ring-2 ring-[#033C8D]/15'
                        : 'bg-white border border-slate-200/90 hover:border-[#033C8D]/50 shadow-2xs hover:shadow-md'
                      }`}
                  >
                    <div>
                      {/* Thumbnail Image + Floating Badges */}
                      <div className="relative h-28 w-full rounded-lg overflow-hidden bg-slate-100 mb-2.5">
                        <img
                          src={
                            college.image ||
                            college.logo ||
                            'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=400&q=80'
                          }
                          alt={college.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src =
                              'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=400&q=80'
                          }}
                        />
                        {/* Rank Badge */}
                        {college.nirfRank && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[9px] font-bold uppercase backdrop-blur-xs absolute top-2 left-2">
                            NIRF #{college.nirfRank}
                          </span>
                        )}
                        {/* Selected / Add Icon Badge */}
                        {isSelected ? (
                          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[9px] font-bold flex items-center gap-1 shadow-xs">
                            <CheckCircle className="w-3 h-3" />
                            <span>Added</span>
                          </span>
                        ) : (
                          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-white/95 text-slate-700 group-hover:bg-[#033C8D] group-hover:text-white flex items-center gap-1 text-[10px] font-bold shadow-xs transition-colors">
                            <Plus className="w-3 h-3" />
                            <span>Compare</span>
                          </span>
                        )}
                      </div>

                      {/* Title & Location */}
                      <h3 className="font-serif text-sm font-bold text-slate-900 group-hover:text-[#033C8D] transition-colors line-clamp-1">
                        {college.shortName || college.name}
                      </h3>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-0.5">
                        <span className="truncate">{college.location || 'India'}</span>
                        <span className="flex items-center gap-0.5 text-amber-500 font-bold ml-1 shrink-0">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{college.rating || '4.8'}</span>
                        </span>
                      </div>

                      {/* Key Metrics Pill */}
                      <div className="grid grid-cols-2 gap-1.5 p-2 bg-slate-50/90 rounded-lg border border-slate-100 text-[10px] mt-2 mb-2">
                        <div>
                          <span className="text-slate-400 uppercase font-semibold block text-[9px]">
                            Avg Package
                          </span>
                          <span className="font-bold text-emerald-600 truncate block">
                            {college.avgPackage || '₹18.5 LPA'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 uppercase font-semibold block text-[9px]">
                            Total Fees
                          </span>
                          <span className="font-bold text-slate-800 truncate block">
                            {college.totalFees || '₹8.5 Lakhs'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Footer Button */}
                    <div className="mt-1">
                      {isSelected ? (
                        <div className="w-full py-1.5 rounded-lg bg-[#033C8D] text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-2xs">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>In Comparison</span>
                        </div>
                      ) : (
                        <div className="w-full py-1.5 rounded-lg bg-slate-100 text-[#033C8D] group-hover:bg-[#033C8D] group-hover:text-white transition-colors text-[11px] font-bold flex items-center justify-center gap-1.5">
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Compare</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* 3. Comparison Matrix Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {comparedList.length > 0 ? (
          <div className="bg-white border border-border-color rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[720px]">
                {/* Header Row */}
                <thead>
                  <tr className="border-b border-border-color bg-slate-50/70">
                    <th className="p-5 text-xs font-bold text-text-light uppercase tracking-wider w-48 border-r border-border-color">
                      Decision Parameter
                    </th>
                    {comparedList.map((college) => (
                      <th
                        key={college.id || college.slug}
                        className="p-5 min-w-[240px] max-w-[280px] border-r border-border-color last:border-r-0 relative align-top"
                      >
                        {comparedList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => onRemoveCollege && onRemoveCollege(college.id || college.slug)}
                            className="absolute top-3 right-3 p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Remove from comparison"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}

                        <div className="space-y-2.5">
                          <img
                            src={college.image || 'https://images.unsplash.com/photo-1562774053-701939374585?w=800'}
                            alt={college.name}
                            className="w-full h-28 object-cover rounded-lg border border-border-color"
                          />
                          <div>
                            <span className="text-[11px] font-semibold text-slate-500 block">
                              NIRF #{college.nirfRank || 1} • {college.ownership || 'Verified'}
                            </span>
                            <h3 className="font-serif text-sm font-bold text-text-primary mt-1 line-clamp-2">
                              {college.name}
                            </h3>
                            <p className="text-xs text-text-light mt-0.5">{college.location || 'India'}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => onSelectCollege && onSelectCollege(college.id || college.slug)}
                            className="w-full py-1.5 rounded-lg bg-slate-100 hover:bg-brand-primary hover:text-white text-text-primary font-semibold text-xs transition-colors cursor-pointer"
                          >
                            View Full Details
                          </button>
                        </div>
                      </th>
                    ))}
                    {comparedList.length < 4 && (
                      <th className="p-5 min-w-[180px] text-center border-r-0 align-middle">
                        <button
                          type="button"
                          onClick={() => setIsAddModalOpen(true)}
                          className="w-full h-full min-h-[200px] rounded-xl border-2 border-dashed border-border-color hover:border-brand-primary text-text-light hover:text-brand-primary flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer p-4"
                        >
                          <Plus className="h-6 w-6" />
                          <span className="text-xs font-bold">Add College</span>
                        </button>
                      </th>
                    )}
                  </tr>
                </thead>

                {/* Rows */}
                <tbody className="divide-y divide-border-color text-xs">
                  {/* Ownership */}
                  <tr>
                    <td className="p-3.5 font-bold text-text-primary bg-slate-50/50 border-r border-border-color">
                      Ownership / Type
                    </td>
                    {comparedList.map((c) => (
                      <td key={c.id || c.slug} className="p-3.5 border-r border-border-color text-text-secondary">
                        {c.ownership || 'Private / Government'}
                      </td>
                    ))}
                    {comparedList.length < 4 && <td />}
                  </tr>

                  {/* Rating */}
                  <tr>
                    <td className="p-3.5 font-bold text-text-primary bg-slate-50/50 border-r border-border-color">
                      Student Rating
                    </td>
                    {comparedList.map((c) => (
                      <td key={c.id || c.slug} className="p-3.5 border-r border-border-color text-text-secondary">
                        <span className="font-bold text-text-primary flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          {c.rating || 4.8} / 5 ({c.reviewsCount || 100}+ reviews)
                        </span>
                      </td>
                    ))}
                    {comparedList.length < 4 && <td />}
                  </tr>

                  {/* Average Package */}
                  <tr>
                    <td className="p-3.5 font-bold text-text-primary bg-slate-50/50 border-r border-border-color">
                      Average Package
                    </td>
                    {comparedList.map((c) => (
                      <td key={c.id || c.slug} className="p-3.5 border-r border-border-color font-bold text-emerald-600">
                        {c.avgPackage || (c.placements?.avgPackage) || '₹12.5 LPA'}
                      </td>
                    ))}
                    {comparedList.length < 4 && <td />}
                  </tr>

                  {/* Highest Package */}
                  <tr>
                    <td className="p-3.5 font-bold text-text-primary bg-slate-50/50 border-r border-border-color">
                      Highest Placement
                    </td>
                    {comparedList.map((c) => (
                      <td key={c.id || c.slug} className="p-3.5 border-r border-border-color font-bold text-slate-900">
                        {c.highestPackage || (c.placements?.highestDomestic) || '₹45.0 LPA'}
                      </td>
                    ))}
                    {comparedList.length < 4 && <td />}
                  </tr>

                  {/* Total Tuition Fees */}
                  <tr>
                    <td className="p-3.5 font-bold text-text-primary bg-slate-50/50 border-r border-border-color">
                      Total Tuition Fees
                    </td>
                    {comparedList.map((c) => (
                      <td key={c.id || c.slug} className="p-3.5 border-r border-border-color font-bold text-text-primary">
                        {c.totalFees || c.coursesOffered?.[0]?.fee || '₹2.5 Lakhs/yr'}
                      </td>
                    ))}
                    {comparedList.length < 4 && <td />}
                  </tr>

                  {/* Placement Rate */}
                  <tr>
                    <td className="p-3.5 font-bold text-text-primary bg-slate-50/50 border-r border-border-color">
                      Placement Rate
                    </td>
                    {comparedList.map((c) => (
                      <td key={c.id || c.slug} className="p-3.5 border-r border-border-color font-semibold text-text-primary">
                        {c.placementPercent || (c.placements?.placementRate) || 90}% Placed
                      </td>
                    ))}
                    {comparedList.length < 4 && <td />}
                  </tr>

                  {/* Exams Accepted */}
                  <tr>
                    <td className="p-3.5 font-bold text-text-primary bg-slate-50/50 border-r border-border-color">
                      Exams Accepted
                    </td>
                    {comparedList.map((c) => {
                      const exams = Array.isArray(c.examAccepted)
                        ? c.examAccepted
                        : c.admissions?.examAccepted || ['National Entrance']
                      return (
                        <td key={c.id || c.slug} className="p-3.5 border-r border-border-color">
                          <div className="flex flex-wrap gap-1">
                            {exams.map((ex) => (
                              <span key={ex} className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-semibold">
                                {ex}
                              </span>
                            ))}
                          </div>
                        </td>
                      )
                    })}
                    {comparedList.length < 4 && <td />}
                  </tr>

                  {/* Facilities */}
                  <tr>
                    <td className="p-3.5 font-bold text-text-primary bg-slate-50/50 border-r border-border-color">
                      Campus Facilities
                    </td>
                    {comparedList.map((c) => (
                      <td key={c.id || c.slug} className="p-3.5 border-r border-border-color text-text-secondary font-normal">
                        {(c.facilities || []).join(', ') || 'Hostel, Library, Wi-Fi, Sports, Placement Cell'}
                      </td>
                    ))}
                    {comparedList.length < 4 && <td />}
                  </tr>

                  {/* Key Advantage / Pros */}
                  <tr>
                    <td className="p-3.5 font-bold text-text-primary bg-slate-50/50 border-r border-border-color">
                      Key Advantage
                    </td>
                    {comparedList.map((c) => (
                      <td key={c.id || c.slug} className="p-3.5 border-r border-border-color text-text-secondary leading-relaxed font-normal">
                        {c.prosAndCons?.pros?.[0] || 'Top tier faculty, alumni network, and verified placement record.'}
                      </td>
                    ))}
                    {comparedList.length < 4 && <td />}
                  </tr>

                  {/* Next Action */}
                  <tr className="bg-slate-50/80">
                    <td className="p-3.5 font-bold text-text-primary border-r border-border-color">
                      Admissions Guidance
                    </td>
                    {comparedList.map((c) => (
                      <td key={c.id || c.slug} className="p-3.5 border-r border-border-color">
                        <button
                          type="button"
                          onClick={onOpenCounseling}
                          className="btn btn-primary btn-sm text-xs font-semibold w-full cursor-pointer"
                        >
                          Get Free Advice
                        </button>
                      </td>
                    ))}
                    {comparedList.length < 4 && <td />}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-12 sm:p-16 text-center bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-4 max-w-xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#033C8D] flex items-center justify-center mx-auto border border-blue-100/80">
              <Scale className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                No Colleges Selected for Comparison
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto font-normal">
                Click any college card above to start comparing immediately, or click the Add College button below to search from 100+ verified institutes.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={onNavigateListing}
                className="btn btn-outline btn-md text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                <Building2 className="h-4 w-4" />
                <span>Browse Directory</span>
              </button>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="btn btn-primary btn-md text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Plus className="h-4 w-4" />
                <span>Add College to Compare</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Add College Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div
            data-lenis-prevent
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onWheel={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs cursor-pointer"
              onClick={() => setIsAddModalOpen(false)}
            />

            <motion.div
              data-lenis-prevent
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl z-10 flex flex-col max-h-[85vh] border border-slate-100"
              onWheel={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between shrink-0 mb-4">
                <h3 className="font-serif text-lg font-bold text-text-primary">
                  Add College to Compare
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 rounded-xl text-text-light hover:bg-slate-100 cursor-pointer transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="relative shrink-0 mb-4">
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-text-light" />
                <input
                  type="text"
                  placeholder="Search live college by name or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium focus:ring-2 focus:ring-brand-primary/10 transition-all"
                />
              </div>

              <div
                data-lenis-prevent
                onWheel={(e) => e.stopPropagation()}
                className="flex-1 overflow-y-auto max-h-[380px] custom-scrollbar space-y-2 pr-1.5 overscroll-contain"
                style={{
                  WebkitOverflowScrolling: 'touch',
                  overscrollBehavior: 'contain',
                }}
              >
                {availableToAdd.map((college) => (
                  <motion.button
                    key={college.id || college.slug}
                    whileHover={{ scale: 1.01, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => {
                      if (onAddCollege) onAddCollege(college)
                      setIsAddModalOpen(false)
                    }}
                    className="w-full text-left p-3.5 rounded-2xl border border-border-color hover:border-brand-primary/50 hover:bg-blue-50/40 transition-all flex items-center justify-between group cursor-pointer shadow-2xs"
                  >
                    <div>
                      <h4 className="font-serif text-xs font-bold text-text-primary group-hover:text-brand-primary transition-colors">
                        {college.name}
                      </h4>
                      <p className="text-[11px] text-text-light mt-0.5">
                        {college.location || 'India'} • {college.avgPackage || '₹12.5 LPA'}
                      </p>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-brand-primary group-hover:text-white flex items-center justify-center transition-all shrink-0">
                      <Plus className="h-3.5 w-3.5" />
                    </div>
                  </motion.button>
                ))}

                {availableToAdd.length === 0 && (
                  <p className="text-center py-6 text-xs text-slate-400">
                    No additional colleges found matching your search.
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CollegeComparePage
