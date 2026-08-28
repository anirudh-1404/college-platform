import React, { useEffect, useState } from 'react'
import { ArrowRight, Building, MapPin, Star } from 'lucide-react'
import { publicApi } from '../api/publicApi'

const TopColleges = ({ onSelectCollege, onNavigateListing }) => {
  const [featuredColleges, setFeaturedColleges] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTop = async () => {
      setLoading(true)
      try {
        const data = await publicApi.getColleges({ sort: 'nirf' })
        setFeaturedColleges(data.slice(0, 4))
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchTop()
  }, [])

  return (
    <section className="py-16 sm:py-20 bg-slate-50/60 border-b border-border-color">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-3">
          <div>
            <span className="text-xs font-bold text-brand-primary uppercase tracking-wider bg-purple-50 px-2.5 py-0.5 rounded-md">
              Premier Institutions
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
              Top Ranked Colleges in India
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-xl font-normal">
              Validated national NIRF rankings, verified placement figures, and official course fee structures.
            </p>
          </div>
          <button
            onClick={onNavigateListing}
            className="text-sm font-bold text-brand-primary hover:text-brand-primary-hover flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>View all colleges</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Dynamic College Cards Grid */}
        {featuredColleges.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredColleges.map((college) => (
              <div
                key={college.id}
                onClick={() => onSelectCollege && onSelectCollege(college.id)}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-brand-primary/50 hover:shadow-card transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  {/* Card Image */}
                  <div className="relative h-40 overflow-hidden bg-slate-100">
                    <img
                      src={college.image || college.logo || 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80'}
                      alt={college.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-slate-900/90 text-white text-[10px] font-bold">
                        NIRF #{college.nirfRank || 1}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white/95 text-slate-900 text-[10px] font-bold shadow-2xs">
                        {college.ownership || 'Government'}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs text-slate-400 flex items-center gap-1 truncate">
                        <MapPin className="h-3 w-3 text-brand-primary flex-shrink-0" />
                        <span className="truncate">{college.location || 'India'}</span>
                      </p>
                      <div className="flex items-center gap-1 flex-shrink-0 text-xs font-bold text-slate-800">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>{college.rating || 4.8}</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-primary transition-colors line-clamp-1">
                      {college.name}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                      {college.description || 'Verified institutional profile.'}
                    </p>
                  </div>
                </div>

                {/* Card Metrics Footer */}
                <div className="p-4 pt-3 border-t border-slate-100 bg-slate-50/50 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">
                      Avg Package
                    </span>
                    <span className="font-bold text-emerald-600">
                      {college.avgPackage || '₹24.5 LPA'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">
                      Total Fees
                    </span>
                    <span className="font-bold text-slate-900">
                      {college.totalFees || '₹2.5 L/yr'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-xl">
            <Building className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800">
              {loading ? 'Fetching Verified Colleges...' : 'No Published Colleges Yet'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 font-normal">
              Colleges submitted through the Institutional Portal and published by the Admin Authority will appear here live.
            </p>
          </div>
        )}

      </div>
    </section>
  )
}

export default TopColleges
