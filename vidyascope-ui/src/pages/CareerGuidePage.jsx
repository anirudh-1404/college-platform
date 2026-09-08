import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  ChevronRight,
  Home,
  Compass,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  GraduationCap,
  Award,
  Search,
  CheckCircle2,
  Building,
  Sparkles,
} from 'lucide-react'
import { publicApi } from '../api/publicApi'

const CATEGORIES = [
  'All Disciplines',
  'Engineering & Technology',
  'Management & Finance',
  'Medical & Healthcare',
  'Law & Legal',
  'Design & Architecture',
  'Applied Sciences',
]

const CareerGuidePage = ({
  onNavigateHome,
  onNavigateColleges,
  onOpenCounseling,
}) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const guideParam = searchParams.get('id') || searchParams.get('guide')

  const [guides, setGuides] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedGuideId, setSelectedGuideId] = useState(guideParam || null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Disciplines')

  // Fetch live career guides from backend
  useEffect(() => {
    const fetchGuides = async () => {
      setLoading(true)
      try {
        const data = await publicApi.getCareerGuides()
        setGuides(data)
      } catch (err) {
        console.error('Failed to fetch career roadmaps:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchGuides()
  }, [])

  // Sync guideParam from URL with selectedGuideId
  useEffect(() => {
    if (guideParam) {
      setSelectedGuideId(guideParam)
    }
  }, [guideParam])

  const handleSelectGuide = (id) => {
    setSelectedGuideId(id)
    if (id) {
      setSearchParams({ id })
    } else {
      setSearchParams({})
    }
  }

  // Filtered guides based on search query and category
  const filteredGuides = useMemo(() => {
    return guides.filter((guide) => {
      const matchCategory =
        selectedCategory === 'All Disciplines' || guide.category === selectedCategory

      const matchSearch =
        searchQuery.trim() === '' ||
        guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (guide.shortDescription && guide.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (guide.summary && guide.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (guide.requiredDegrees || []).some((d) =>
          d.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        (guide.targetExams || []).some((e) =>
          e.toLowerCase().includes(searchQuery.toLowerCase())
        )

      return matchCategory && matchSearch
    })
  }, [guides, selectedCategory, searchQuery])

  // Active guide for Reader / Detail view
  const currentGuide = useMemo(() => {
    if (!selectedGuideId) return null
    return (
      guides.find(
        (g) =>
          g.id === selectedGuideId ||
          g.slug === selectedGuideId ||
          g._id === selectedGuideId
      ) || null
    )
  }, [guides, selectedGuideId])

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* 1. Breadcrumb Bar */}
      <div className="bg-white border-b border-border-color py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs font-semibold text-text-light flex-wrap">
            <button
              onClick={onNavigateHome}
              className="hover:text-brand-primary cursor-pointer flex items-center gap-1"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Home</span>
            </button>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <button
              onClick={() => handleSelectGuide(null)}
              className={`hover:text-brand-primary cursor-pointer ${
                !currentGuide ? 'text-text-primary font-bold' : ''
              }`}
            >
              Career Guidance
            </button>

            {currentGuide && (
              <>
                <ChevronRight className="h-3 w-3 text-slate-400" />
                <span className="text-text-primary font-bold truncate max-w-xs">
                  {currentGuide.title}
                </span>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* 2. Main Body Canvas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* VIEW 1: SINGLE CAREER ROADMAP DETAIL READER */}
        {currentGuide ? (
          <div className="max-w-4xl mx-auto space-y-6">
            <button
              type="button"
              onClick={() => handleSelectGuide(null)}
              className="inline-flex items-center gap-2 text-xs font-bold text-brand-primary hover:text-brand-primary-hover cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to all career roadmaps</span>
            </button>

            <div className="bg-white border border-border-color rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
              {/* Featured Banner Image */}
              {currentGuide.image && (
                <div className="relative rounded-xl overflow-hidden aspect-[21/9] max-h-72 bg-slate-100">
                  <img
                    src={currentGuide.image}
                    alt={currentGuide.title}
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'
                    }}
                    className="w-full h-full object-cover"
                  />
                  {currentGuide.badge && (
                    <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-brand-primary text-xs font-bold px-2.5 py-1 rounded-md shadow-xs uppercase">
                      {currentGuide.badge}
                    </span>
                  )}
                </div>
              )}

              {/* Header */}
              <div className="space-y-2 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                  <span className="font-semibold text-brand-primary">{currentGuide.category}</span>
                  {currentGuide.date && (
                    <>
                      <span>•</span>
                      <span>{currentGuide.date}</span>
                    </>
                  )}
                  {currentGuide.readTime && (
                    <>
                      <span>•</span>
                      <span>{currentGuide.readTime}</span>
                    </>
                  )}
                  {currentGuide.author && (
                    <>
                      <span>•</span>
                      <span>By {currentGuide.author}</span>
                    </>
                  )}
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-text-primary">
                  {currentGuide.title}
                </h1>
                <p className="text-sm text-text-secondary leading-relaxed pt-1">
                  {currentGuide.summary ||
                    currentGuide.shortDescription ||
                    'Comprehensive educational roadmap and industry entrance strategy.'}
                </p>
              </div>

              {/* Key Quick Facts Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block">
                    Average Salary
                  </span>
                  <span className="font-bold text-emerald-600 text-sm mt-0.5 block">
                    {currentGuide.averageSalary || '₹12 - 25 LPA'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block">
                    Eligibility
                  </span>
                  <span className="font-bold text-slate-900 text-xs mt-0.5 block line-clamp-2">
                    {currentGuide.eligibility || '10+2 with relevant subjects'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block">
                    Target Exams
                  </span>
                  <span className="font-bold text-slate-900 text-xs mt-0.5 block line-clamp-2">
                    {(currentGuide.targetExams || []).join(', ') || 'National Entrance'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block">
                    Key Degrees
                  </span>
                  <span className="font-bold text-slate-900 text-xs mt-0.5 block line-clamp-2">
                    {(currentGuide.requiredDegrees || []).join(', ') || 'Undergraduate Degree'}
                  </span>
                </div>
              </div>

              {/* Step-by-Step Educational Milestones */}
              <div className="space-y-4 pt-2">
                <h2 className="font-serif text-xl font-bold text-slate-900">
                  Step-by-Step Educational Pathway
                </h2>

                <div className="space-y-4">
                  {(currentGuide.roadmapSteps || []).map((step, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-xl border border-slate-200 bg-white hover:border-brand-primary/40 transition-colors space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-purple-50 text-brand-primary font-bold text-xs flex items-center justify-center border border-purple-200">
                            {step.stepNumber || idx + 1}
                          </span>
                          <h3 className="font-bold text-slate-900 text-base">
                            {step.title}
                          </h3>
                        </div>
                        {step.duration && (
                          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {step.duration}
                          </span>
                        )}
                      </div>

                      {step.description && (
                        <p className="text-xs sm:text-sm text-slate-600 pl-8.5 leading-relaxed font-normal">
                          {step.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Recruiters */}
              {currentGuide.topRecruiters && currentGuide.topRecruiters.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="font-serif text-base font-bold text-slate-900">
                    Leading Industry Recruiters
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {currentGuide.topRecruiters.map((rec, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-semibold text-slate-800"
                      >
                        ✓ {rec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Banner */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-slate-900">Ready to explore relevant colleges?</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Browse top NIRF ranked institutions offering verified degrees for this career.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onNavigateColleges}
                  className="btn btn-primary btn-md text-xs font-bold w-full sm:w-auto cursor-pointer"
                >
                  <span>Explore Matching Colleges</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* VIEW 2: ALL CAREER ROADMAPS LISTING */
          <div className="space-y-8">
            {/* Header Banner */}
            <div className="bg-white border border-border-color rounded-2xl p-6 sm:p-8 space-y-4 shadow-card">
              <div className="max-w-2xl">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary">
                  Career Roadmaps & Higher Education Pathways
                </h1>
                <p className="text-xs sm:text-sm text-text-secondary mt-1">
                  Structured educational roadmaps, starting compensation benchmarks, and prerequisite degrees curated for high-growth careers.
                </p>
              </div>

              {/* Search & Category Filter Controls */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between border-t border-slate-100">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-text-light" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search careers, target degrees or exams..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-border-color rounded-xl text-xs font-medium text-text-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-border-color rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-primary cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Career Roadmaps Grid */}
            {filteredGuides.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredGuides.map((guide) => (
                  <div
                    key={guide.id || guide.slug || guide._id}
                    onClick={() => handleSelectGuide(guide.slug || guide.id || guide._id)}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-brand-primary/50 hover:shadow-card transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      {guide.image && (
                        <div className="relative overflow-hidden aspect-[16/9] bg-slate-100">
                          <img
                            src={guide.image}
                            alt={guide.title}
                            onError={(e) => {
                              e.currentTarget.onerror = null
                              e.currentTarget.src =
                                'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs text-brand-primary text-[10px] font-bold px-2 py-0.5 rounded-md uppercase shadow-2xs">
                            {guide.badge || guide.category}
                          </span>
                        </div>
                      )}

                      <div className="p-5 space-y-2.5">
                        {!guide.image && (
                          <span className="text-[11px] font-semibold text-slate-400 block">
                            {guide.category}
                          </span>
                        )}

                        <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-brand-primary transition-colors line-clamp-1">
                          {guide.title}
                        </h3>

                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                          {guide.summary ||
                            guide.shortDescription ||
                            'Step-by-step career milestones, salary benchmarks, and target exams.'}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0 space-y-3">
                      <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                            Salary Outlook
                          </span>
                          <span className="font-bold text-emerald-600">
                            {guide.averageSalary || '₹12 - 25 LPA'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                            Milestones
                          </span>
                          <span className="font-bold text-slate-900">
                            {guide.roadmapSteps?.length || 3} Stages
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-brand-primary font-bold">View Roadmap</span>
                        <ArrowRight className="h-4 w-4 text-brand-primary group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-16 text-center bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-3">
                <Compass className="h-10 w-10 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">
                  {loading ? 'Loading Career Roadmaps...' : 'No Career Roadmaps Found'}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto font-normal">
                  {loading
                    ? 'Fetching live career guidance data from central database...'
                    : 'The central administration authority will publish verified career guides and educational roadmaps here.'}
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

export default CareerGuidePage
