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
} from 'lucide-react'
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
  const [highlightDifferences, setHighlightDifferences] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Live colleges from database
  const [allLiveColleges, setAllLiveColleges] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchColleges = async () => {
      setLoading(true)
      try {
        const data = await publicApi.getColleges()
        setAllLiveColleges(data || [])
      } catch (err) {
        console.error('Failed to fetch live colleges for comparison:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchColleges()
  }, [])

  // Current colleges being compared
  const comparedList = useMemo(() => {
    if (selectedColleges && selectedColleges.length > 0) {
      return selectedColleges
    }
    if (allLiveColleges.length > 0) {
      return allLiveColleges.slice(0, 2)
    }
    return []
  }, [selectedColleges, allLiveColleges])

  // Available colleges to add in the modal
  const availableToAdd = useMemo(() => {
    const activeIds = comparedList.map((c) => c.id || c.slug)
    return allLiveColleges.filter(
      (c) =>
        !activeIds.includes(c.id || c.slug) &&
        (c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (c.shortName && c.shortName.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (c.location && c.location.toLowerCase().includes(searchQuery.toLowerCase())))
    )
  }, [comparedList, allLiveColleges, searchQuery])

  // Helper to check if row values differ across compared colleges
  const isDifferent = (keyExtractor) => {
    if (comparedList.length < 2) return false
    const firstVal = keyExtractor(comparedList[0])
    return comparedList.some((c) => keyExtractor(c) !== firstVal)
  }

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
                Comparing {comparedList.length} of max 4 colleges across fees, placements, ratings, rankings, and facilities.
              </p>
            </div>

            {/* Actions Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-xs font-semibold text-text-primary bg-slate-100 px-3 py-2 rounded-xl border border-border-color cursor-pointer hover:bg-slate-200 transition-colors select-none">
                <input
                  type="checkbox"
                  checked={highlightDifferences}
                  onChange={(e) => setHighlightDifferences(e.target.checked)}
                  className="rounded text-brand-primary border-border-color focus:ring-brand-primary accent-brand-primary"
                />
                <span>Highlight Differences Only</span>
              </label>

              {comparedList.length < 4 && allLiveColleges.length > comparedList.length && (
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="btn btn-primary btn-md text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add College</span>
                </button>
              )}

              {selectedColleges && selectedColleges.length > 0 && (
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
                  <tr className={highlightDifferences && isDifferent((c) => c.ownership) ? 'bg-amber-50/50' : ''}>
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
                  <tr className={highlightDifferences && isDifferent((c) => c.rating) ? 'bg-amber-50/50' : ''}>
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
                  <tr className={highlightDifferences && isDifferent((c) => c.avgPackage) ? 'bg-amber-50/50' : ''}>
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
                  <tr className={highlightDifferences && isDifferent((c) => c.highestPackage) ? 'bg-amber-50/50' : ''}>
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
                  <tr className={highlightDifferences && isDifferent((c) => c.totalFees) ? 'bg-amber-50/50' : ''}>
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
                  <tr className={highlightDifferences && isDifferent((c) => c.placementPercent) ? 'bg-amber-50/50' : ''}>
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
                  <tr className={highlightDifferences && isDifferent((c) => (c.examAccepted || []).join()) ? 'bg-amber-50/50' : ''}>
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
          <div className="p-16 text-center bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-3">
            <Scale className="h-10 w-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">
              {loading ? 'Loading Published Colleges...' : 'No Colleges Available for Comparison'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-normal">
              {loading
                ? 'Fetching live institutions data from central database...'
                : 'Browse colleges from the directory and click "+ Add to Compare" to compare fees, cutoffs, and placements side-by-side.'}
            </p>
          </div>
        )}
      </div>

      {/* 4. Add College Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setIsAddModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-text-primary">
                Add College to Compare
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-text-light hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-text-light" />
              <input
                type="text"
                placeholder="Search live college by name or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium"
              />
            </div>

            <div className="max-h-64 overflow-y-auto custom-scrollbar space-y-2 pr-1">
              {availableToAdd.map((college) => (
                <button
                  key={college.id || college.slug}
                  type="button"
                  onClick={() => {
                    if (onAddCollege) onAddCollege(college)
                    setIsAddModalOpen(false)
                  }}
                  className="w-full text-left p-3 rounded-xl border border-border-color hover:border-brand-primary hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <h4 className="font-serif text-xs font-bold text-text-primary group-hover:text-brand-primary">
                      {college.name}
                    </h4>
                    <p className="text-[11px] text-text-light mt-0.5">
                      {college.location || 'India'} • {college.avgPackage || '₹12.5 LPA'}
                    </p>
                  </div>
                  <Plus className="h-4 w-4 text-brand-primary" />
                </button>
              ))}

              {availableToAdd.length === 0 && (
                <p className="text-center py-6 text-xs text-slate-400">
                  No additional colleges found matching your search.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CollegeComparePage
