import React, { useState, useEffect, useMemo } from 'react'
import {
  ChevronRight, Home, Heart, Trash2, Scale, ArrowRight,
  MapPin, Star, Building2, CheckCircle, Loader2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { publicApi } from '../api/publicApi'

const ShortlistPage = ({
  shortlistedIds = [],
  onToggleShortlist,
  onClearShortlist,
  onSelectCollege,
  onNavigateHome,
  onNavigateColleges,
  onOpenCounseling,
  compareList = [],
  onToggleCompare,
  onNavigateCompare,
}) => {
  const [allColleges, setAllColleges] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const fetchColleges = async () => {
      try {
        const live = await publicApi.getColleges()
        if (isMounted) {
          if (Array.isArray(live)) {
            const normalized = live.map((c) => ({
              ...c,
              id: c.slug || c.id || c._id,
              slug: c.slug || c.id || c._id,
              name: c.name,
              shortName: c.shortName || c.name,
              image: c.image || c.logo || 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
              avgPackage: c.avgPackage || (c.placements?.avgPackage) || '₹18.5 LPA',
              totalFees: c.totalFees || '₹8.5 Lakhs',
              rating: c.rating || 4.8,
              ownership: c.ownership || 'Government',
              nirfRank: c.nirfRank || c.rankings?.nirfRank || 1,
            }))
            setAllColleges(normalized)
          } else {
            setAllColleges([])
          }
        }
      } catch (err) {
        console.warn('Failed to load live colleges for shortlist:', err)
        if (isMounted) setAllColleges([])
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchColleges()
    return () => {
      isMounted = false
    }
  }, [])


  const shortlistedColleges = useMemo(() => {
    if (!shortlistedIds || shortlistedIds.length === 0) return []
    return allColleges.filter((c) => {
      return shortlistedIds.some(
        (id) => id === c.id || id === c.slug || id === c._id
      )
    })
  }, [allColleges, shortlistedIds])

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      
      {/* Breadcrumb Navigation */}
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
            <span className="text-text-primary font-bold">Saved Colleges</span>
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-border-color py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-wider mb-2">
                <Heart className="h-3.5 w-3.5 fill-rose-600" />
                <span>Student Shortlist</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary">
                Your Saved Colleges ({shortlistedColleges.length})
              </h1>
              <p className="text-xs sm:text-sm text-text-secondary mt-1">
                Save target colleges while exploring, compare fees & placements, and request counseling.
              </p>
            </div>

            {shortlistedColleges.length > 0 && (
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={onNavigateCompare}
                  className="px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Scale className="h-4 w-4" />
                  <span>Launch Comparison</span>
                </motion.button>

                <button
                  type="button"
                  onClick={onClearShortlist}
                  className="text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors px-2 py-1 cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && shortlistedColleges.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
            <p className="text-xs font-semibold">Loading your saved colleges...</p>
          </div>
        ) : shortlistedColleges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence>
              {shortlistedColleges.map((college) => {
                const collegeId = college.slug || college.id || college._id
                const isCompared = compareList.some((c) => (c.id || c.slug || c._id) === collegeId)
                return (
                  <motion.div
                    layout
                    key={collegeId}
                    initial={{ opacity: 0, scale: 0.92, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.88, y: -10, transition: { duration: 0.2 } }}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    className="bg-white border border-border-color rounded-xl overflow-hidden hover:border-brand-primary/40 shadow-2xs hover:shadow-card-hover transition-all flex flex-col justify-between"
                  >
                    {/* Thumbnail & Badges */}
                    <div>
                      <div
                        className="relative h-44 overflow-hidden bg-slate-100 cursor-pointer group"
                        onClick={() => onSelectCollege && onSelectCollege(collegeId)}
                      >
                        <img
                          src={college.image || college.logo || 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80'}
                          alt={college.name}
                          className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80'
                          }}
                        />
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          {college.nirfRank && (
                            <span className="px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-bold uppercase backdrop-blur-xs">
                              NIRF #{college.nirfRank}
                            </span>
                          )}
                          {college.ownership && (
                            <span className="px-2 py-0.5 rounded-md bg-white/95 text-text-primary text-[10px] font-bold uppercase backdrop-blur-xs">
                              {college.ownership}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            onToggleShortlist && onToggleShortlist(collegeId)
                          }}
                          className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition-colors cursor-pointer shadow-xs"
                          title="Remove from saved"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Details Body */}
                      <div className="p-4 space-y-2.5">
                        <div className="flex items-start justify-between gap-1">
                          <p className="text-xs text-text-light flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-brand-primary flex-shrink-0" />
                            <span>{college.location || `${college.city || ''}${college.city && college.state ? ', ' : ''}${college.state || 'India'}`}</span>
                          </p>
                          <div className="flex items-center gap-1 text-xs font-bold text-text-primary">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <span>{college.rating || 4.8}</span>
                          </div>
                        </div>

                        <h3
                          onClick={() => onSelectCollege && onSelectCollege(collegeId)}
                          className="font-serif text-base font-bold text-text-primary hover:text-brand-primary transition-colors cursor-pointer line-clamp-1"
                        >
                          {college.name}
                        </h3>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border border-border-color text-xs">
                          <div>
                            <span className="text-[10px] text-text-light font-semibold uppercase block">
                              Avg Package
                            </span>
                            <span className="font-bold text-emerald-600">
                              {college.avgPackage || '₹24.5 LPA'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-text-light font-semibold uppercase block">
                              Total Fees
                            </span>
                            <span className="font-bold text-text-primary">
                              {college.totalFees || '₹8.94 Lakhs'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions Strip */}
                    <div className="p-4 pt-3 border-t border-border-color flex items-center justify-between text-xs gap-2">
                      <label className="flex items-center gap-1.5 font-medium text-text-secondary cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isCompared}
                          onChange={() => onToggleCompare && onToggleCompare(college)}
                          className="w-3.5 h-3.5 rounded text-brand-primary border-border-color focus:ring-brand-primary accent-brand-primary cursor-pointer"
                        />
                        <span>Compare</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => onSelectCollege && onSelectCollege(collegeId)}
                        className="px-3.5 py-1.5 rounded-lg bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold text-xs transition-colors cursor-pointer"
                      >
                        View Details
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-border-color rounded-2xl p-12 text-center max-w-md mx-auto space-y-4 shadow-xs"
          >
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
              <Heart className="h-7 w-7" />
            </div>
            <h2 className="font-serif text-xl font-bold text-text-primary">
              No Saved Colleges Yet
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              Explore colleges across Engineering, Management, and Medical streams and tap the heart icon to save them for comparison.
            </p>
            <button
              type="button"
              onClick={onNavigateColleges}
              className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold text-xs shadow-sm transition-colors cursor-pointer"
            >
              Browse Colleges Directory
            </button>
          </motion.div>
        )}
      </div>

    </div>
  )
}

export default ShortlistPage
