import React, { useEffect, useState } from 'react'
import {
  ArrowRight,
  Building,
  MapPin,
  Star,
  Award,
  TrendingUp,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { publicApi } from '../api/publicApi'
import { fadeInUp, staggerContainer } from '../utils/animations'

const TopColleges = ({ onSelectCollege, onNavigateListing }) => {
  const [featuredColleges, setFeaturedColleges] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const fetchTop = async () => {
      setLoading(true)
      try {
        const data = await publicApi.getColleges({ sort: 'nirf' })
        if (isMounted) {
          setFeaturedColleges(Array.isArray(data) ? data.slice(0, 5) : [])
        }
      } catch (e) {
        if (isMounted) setFeaturedColleges([])
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchTop()
    return () => {
      isMounted = false
    }
  }, [])

  const activeCollege = featuredColleges[selectedIndex] || featuredColleges[0]

  return (
    <section className="relative py-16 sm:py-24 bg-gradient-to-b from-[#F3F6FC] via-[#F8FAFC] to-[#EEF3FB] border-b border-slate-200/70 overflow-hidden isolate">
      {/* Ambient background glows for 3D glassmorphism */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-300/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-300/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeInUp}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-12 gap-3"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#033C8D]/8 border border-[#033C8D]/15 text-[#033C8D] text-[11px] font-bold uppercase tracking-wider mb-2">
              <Sparkles className="h-3 w-3" />
              <span>National Benchmarks • Verified Leaderboard</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-950">
              Premier Campuses & National Rankings
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl font-normal">
              Official NIRF audit rankings, audited placement packages, and accredited institutional profiles.
            </p>
          </div>
          <button
            onClick={onNavigateListing}
            className="text-xs sm:text-sm font-bold text-[#033C8D] hover:underline flex items-center gap-1.5 cursor-pointer self-start sm:self-auto transition-colors"
          >
            <span>Explore All Colleges in Catalog</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>

        {/* Dynamic Content */}
        {loading ? (
          <div className="p-16 text-center bg-white/70 backdrop-blur-xl border border-white/90 rounded-3xl space-y-3">
            <div className="w-8 h-8 border-3 border-[#033C8D] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-500">
              Loading national ranking benchmarks...
            </p>
          </div>
        ) : featuredColleges.length > 0 && activeCollege ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ================= LEFT SIDE: 3D SPOTLIGHT SHOWCASE CARD (7 COLS) ================= */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCollege.id || selectedIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="group relative isolate bg-gradient-to-b from-white/95 via-white/80 to-white/90 backdrop-blur-2xl rounded-3xl border border-white/90 shadow-[0_25px_60px_-15px_rgba(3,60,141,0.18),0_12px_28px_-6px_rgba(0,0,0,0.06),inset_0_2px_2.5px_rgba(255,255,255,1),inset_0_-1.5px_2px_rgba(3,60,141,0.03)] overflow-hidden"
                >
                  {/* Ambient 3D Pop Glow */}
                  <div className="absolute -inset-1 bg-gradient-to-br from-[#033C8D]/25 via-[#00A3FF]/20 to-[#6366F1]/20 rounded-3xl blur-2xl opacity-60 pointer-events-none -z-10" />

                  {/* Top Specular Sheen (Gloss Reflection) */}
                  <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/80 via-white/20 to-transparent pointer-events-none rounded-t-3xl z-10" />

                  {/* Main High-Res Campus Visual with Gradient Overlay */}
                  <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-900">
                    <img
                      src={
                        activeCollege.image ||
                        activeCollege.logo ||
                        'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80'
                      }
                      alt={activeCollege.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* Gradient Overlay for Crisp Text Contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent z-10" />

                    {/* Top Floating Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-xl bg-amber-500/90 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/25 backdrop-blur-md flex items-center gap-1.5 border border-amber-300/50">
                          <Award className="h-3.5 w-3.5" />
                          <span>NIRF #{activeCollege.nirfRank || selectedIndex + 1}</span>
                        </span>
                        <span className="px-3 py-1 rounded-xl bg-white/90 text-slate-900 font-bold text-xs shadow-md backdrop-blur-md border border-white/95">
                          {activeCollege.ownership || 'Government'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950/70 border border-white/20 text-white text-xs font-bold backdrop-blur-md">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>{activeCollege.rating || 4.8} Rating</span>
                      </div>
                    </div>

                    {/* Bottom Title on Image */}
                    <div className="absolute bottom-4 left-5 right-5 z-20">
                      <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-blue-300 block mb-1">
                        National Spotlight Institution
                      </span>
                      <h3
                        onClick={() => onSelectCollege && onSelectCollege(activeCollege.id)}
                        className="font-serif text-xl sm:text-2xl font-bold text-white hover:text-blue-200 transition-colors cursor-pointer line-clamp-1 drop-shadow-md"
                      >
                        {activeCollege.name}
                      </h3>
                      <p className="flex items-center gap-2 text-xs text-slate-200 mt-1">
                        <MapPin className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" />
                        <span>{activeCollege.location || 'India'}</span>
                        {activeCollege.establishmentYear && (
                          <>
                            <span>•</span>
                            <span>Established {activeCollege.establishmentYear}</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Spotlight Body Section */}
                  <div className="p-6 sm:p-7 space-y-5">
                    {/* Brief Synopsis */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {activeCollege.description ||
                        'Premier institution recognized for excellence in academic curriculum, audited placements, and state-of-the-art research infrastructure.'}
                    </p>

                    {/* 3D Floating Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-white/80 backdrop-blur-xl rounded-2xl border border-white/95 shadow-[0_8px_24px_rgba(3,60,141,0.06),inset_0_1.5px_2px_rgba(255,255,255,1)]">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Highest Package
                        </span>
                        <span className="text-base sm:text-lg font-black text-slate-900 mt-0.5 block">
                          {activeCollege.highestPackage || '₹1.50 Cr PA'}
                        </span>
                      </div>

                      <div className="border-l border-slate-200/80 pl-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Avg Package
                        </span>
                        <span className="text-base sm:text-lg font-black text-emerald-600 mt-0.5 block">
                          {activeCollege.avgPackage || '₹24.5 LPA'}
                        </span>
                      </div>

                      <div className="col-span-2 sm:col-span-1 border-t sm:border-t-0 sm:border-l border-slate-200/80 pt-2 sm:pt-0 sm:pl-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Annual Course Fees
                        </span>
                        <span className="text-base sm:text-lg font-black text-[#033C8D] mt-0.5 block">
                          {activeCollege.totalFees || '₹2.5 L/yr'}
                        </span>
                      </div>
                    </div>

                    {/* Accreditations & Key Highlights Pills */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                      {activeCollege.naacGrade && (
                        <span className="px-3 py-1 rounded-xl bg-blue-50/90 text-[#033C8D] font-bold border border-blue-200/60 flex items-center gap-1.5 shadow-2xs">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#033C8D]" />
                          <span>{activeCollege.naacGrade} Accredited</span>
                        </span>
                      )}
                      <span className="px-3 py-1 rounded-xl bg-emerald-50/90 text-emerald-800 font-bold border border-emerald-200/60 flex items-center gap-1.5 shadow-2xs">
                        <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                        <span>{activeCollege.placementPercent || 95}% Placement Rate</span>
                      </span>
                      {activeCollege.examAccepted && activeCollege.examAccepted.length > 0 && (
                        <span className="px-3 py-1 rounded-xl bg-slate-100/90 text-slate-700 font-semibold border border-slate-200/80">
                          Exams: {activeCollege.examAccepted.slice(0, 2).join(', ')}
                        </span>
                      )}
                    </div>

                    {/* Direct Action Button */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => onSelectCollege && onSelectCollege(activeCollege.id)}
                        className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#033C8D] to-[#022B66] hover:from-[#022B66] hover:to-[#011B40] text-white text-sm font-bold shadow-[0_10px_25px_rgba(3,60,141,0.28)] hover:shadow-[0_15px_35px_rgba(3,60,141,0.42)] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Explore Comprehensive Campus Profile</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ================= RIGHT SIDE: RANKED CONTENDERS STACK (5 COLS) ================= */}
            <div className="lg:col-span-5 space-y-3.5">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-[#033C8D]" />
                  <span>National Benchmark Contenders</span>
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  Click to inspect in Spotlight
                </span>
              </div>

              {/* Contender Strips Stack */}
              <div className="space-y-3">
                {featuredColleges.map((college, idx) => {
                  const isSelected = idx === selectedIndex
                  const rankNumber = college.nirfRank || idx + 1

                  return (
                    <motion.div
                      key={college.id}
                      onClick={() => setSelectedIndex(idx)}
                      whileHover={{ x: 4, transition: { duration: 0.18 } }}
                      className={`group relative p-3.5 sm:p-4 rounded-2xl cursor-pointer transition-all duration-300 flex items-center gap-3.5 ${
                        isSelected
                          ? 'bg-white/95 backdrop-blur-2xl border-2 border-[#033C8D] shadow-[0_14px_30px_rgba(3,60,141,0.16),inset_0_1.5px_2px_rgba(255,255,255,1)] scale-[1.01]'
                          : 'bg-white/70 hover:bg-white/85 backdrop-blur-xl border border-white/90 hover:border-[#033C8D]/40 shadow-[0_6px_20px_rgba(0,0,0,0.03),inset_0_1px_1.5px_rgba(255,255,255,1)]'
                      }`}
                    >
                      {/* Rank Medal / Badge */}
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-xs flex-shrink-0 shadow-sm ${
                          rankNumber === 1
                            ? 'bg-amber-500 text-slate-950 font-black'
                            : rankNumber === 2
                            ? 'bg-slate-300 text-slate-800'
                            : rankNumber === 3
                            ? 'bg-amber-700/80 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        #{rankNumber}
                      </div>

                      {/* Small Thumbnail */}
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-white/90 flex-shrink-0 shadow-inner">
                        <img
                          src={
                            college.image ||
                            college.logo ||
                            'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=400&q=80'
                          }
                          alt={college.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Meta Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4
                            className={`font-bold text-sm truncate transition-colors ${
                              isSelected ? 'text-[#033C8D]' : 'text-slate-900 group-hover:text-[#033C8D]'
                            }`}
                          >
                            {college.name}
                          </h4>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-[#033C8D] flex-shrink-0 animate-ping" />
                          )}
                        </div>

                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {college.location || 'India'} • {college.ownership || 'Government'}
                        </p>

                        <div className="flex items-center gap-3 text-xs mt-1">
                          <span className="font-bold text-emerald-600">
                            Avg {college.avgPackage || '₹24.5 LPA'}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="font-semibold text-slate-600">
                            Fees {college.totalFees || '₹2.5 L/yr'}
                          </span>
                        </div>
                      </div>

                      {/* View CTA icon */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectCollege && onSelectCollege(college.id)
                        }}
                        className={`p-2 rounded-xl transition-all flex-shrink-0 cursor-pointer ${
                          isSelected
                            ? 'bg-[#033C8D] text-white shadow-md'
                            : 'bg-slate-100/80 text-slate-400 group-hover:bg-[#033C8D] group-hover:text-white'
                        }`}
                        title="View Full Profile"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </motion.div>
                  )
                })}
              </div>

              {/* Bottom Quick Navigator CTA */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onNavigateListing}
                  className="w-full py-3 px-4 rounded-2xl bg-white/60 hover:bg-white/80 border border-white/90 text-xs sm:text-sm font-bold text-slate-800 hover:text-[#033C8D] shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur-md"
                >
                  <span>Compare All 50+ Top Universities in Directory</span>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                </button>
              </div>
            </div>

          </div>
        ) : (
          <div className="p-14 text-center bg-white/70 backdrop-blur-xl border border-white/90 rounded-3xl space-y-2.5">
            <Building className="h-10 w-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">
              No Published Colleges Yet
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Colleges submitted through the Institutional Portal and approved by the Admin Authority will appear here live.
            </p>
          </div>
        )}

      </div>
    </section>
  )
}

export default TopColleges
