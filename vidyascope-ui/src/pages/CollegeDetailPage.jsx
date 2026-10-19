import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ChevronRight, ChevronLeft, X, Maximize2, Home, MapPin, Star, Heart,
  Calculator, ShieldCheck, Building2, Users,
  Check, AlertCircle, Scale, Layers, GraduationCap, Building,
  Compass, Calendar, ExternalLink, FileText, CheckCircle2, ArrowRight, Clock, Sparkles, Utensils, Download
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { publicApi } from '../api/publicApi'

const CollegeDetailPage = ({
  collegeId = 'iit-bombay',
  onNavigateHome,
  onNavigateListing,
  onOpenCounseling,
  onSelectCollege,
  isShortlisted = false,
  shortlistedIds = [],
  onToggleShortlist,
  onToggleCompare,
  isCompared = false,
  compareList = [],
}) => {
  const { id } = useParams()
  const effectiveCollegeId = id || collegeId || 'iit-bombay'
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('overview')
  const [calculatorTenure, setCalculatorTenure] = useState(4)
  const [college, setCollege] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  // Memoized, normalized gallery items array
  const galleryList = useMemo(() => {
    if (!college) return []
    const items = []

    if (Array.isArray(college.gallery) && college.gallery.length > 0) {
      college.gallery.forEach((item, idx) => {
        if (typeof item === 'string' && item.trim()) {
          items.push({
            url: item.trim(),
            caption: `${college.name || 'Campus'} - Photo ${idx + 1}`,
            category: 'Campus',
          })
        } else if (item && typeof item === 'object' && (item.url || item.src)) {
          items.push({
            url: (item.url || item.src).trim(),
            caption: item.caption || item.title || `${college.name || 'Campus'} - Photo ${idx + 1}`,
            category: item.category || 'Campus',
          })
        }
      })
    }

    if (items.length === 0 && college.image) {
      items.push({
        url: college.image,
        caption: `${college.name || 'Campus'} - Main Campus Banner`,
        category: 'Campus',
      })
    }

    return items
  }, [college])

  const handlePrevImage = (e) => {
    if (e) e.stopPropagation()
    if (galleryList.length === 0) return
    setLightboxIndex((prev) => (prev === null || prev === 0 ? galleryList.length - 1 : prev - 1))
  }

  const handleNextImage = (e) => {
    if (e) e.stopPropagation()
    if (galleryList.length === 0) return
    setLightboxIndex((prev) => (prev === null || prev === galleryList.length - 1 ? 0 : prev + 1))
  }

  const handleCloseLightbox = () => {
    setLightboxIndex(null)
  }

  // Keyboard navigation & lock body scroll when Lightbox is active
  useEffect(() => {
    if (lightboxIndex === null) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleCloseLightbox()
      } else if (e.key === 'ArrowLeft') {
        handlePrevImage()
      } else if (e.key === 'ArrowRight') {
        handleNextImage()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [lightboxIndex, galleryList.length])

  const effectiveIsShortlisted =
    isShortlisted ||
    shortlistedIds.includes(effectiveCollegeId) ||
    Boolean(college && (shortlistedIds.includes(college.id) || shortlistedIds.includes(college._id) || shortlistedIds.includes(college.slug)))

  const effectiveIsCompared =
    isCompared ||
    compareList.some(
      (c) =>
        c.id === effectiveCollegeId ||
        c.slug === effectiveCollegeId ||
        Boolean(college && (c.id === college.id || c.id === college._id || c.id === college.slug))
    )

  // Fetch Live College Details from Backend
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await publicApi.getCollegeDetail(effectiveCollegeId)
        setCollege(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    setLoading(true)
    fetchDetail()

    const handleDataChange = () => fetchDetail()
    window.addEventListener('vidyascope_college_data_change', handleDataChange)
    window.addEventListener('vidyascope_admin_data_change', handleDataChange)
    window.addEventListener('storage', handleDataChange)

    return () => {
      window.removeEventListener('vidyascope_college_data_change', handleDataChange)
      window.removeEventListener('vidyascope_admin_data_change', handleDataChange)
      window.removeEventListener('storage', handleDataChange)
    }
  }, [effectiveCollegeId])

  const tabs = [
    { id: 'overview', label: 'Overview & Facts' },
    { id: 'admissions', label: 'Admissions & Process' },
    { id: 'courses', label: 'Courses & Fees' },
    { id: 'cutoffs', label: 'Cutoffs & Eligibility' },
    { id: 'placements', label: 'Placements' },
    { id: 'roi', label: 'ROI & Fee Breakdown' },
    { id: 'gallery', label: 'Campus Gallery' },
  ]

  // Calculate estimated total expenditure
  const annualTotalCost = useMemo(() => {
    if (!college || !college.hiddenCosts) return 0
    const {
      tuitionFeePerYear = 0,
      hostelRentYearly = 0,
      messChargesYearly = 0,
      examinationMiscYearly = 0,
    } = college.hiddenCosts
    return (
      tuitionFeePerYear +
      hostelRentYearly +
      messChargesYearly +
      examinationMiscYearly
    )
  }, [college])

  const estimatedTotalCost = useMemo(() => {
    if (!college) return 0
    const caution = college.hiddenCosts?.cautionDepositOneTime || 0
    return (annualTotalCost * calculatorTenure + caution) / 100000 // In Lakhs
  }, [annualTotalCost, calculatorTenure, college])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 pb-20 animate-pulse">
        {/* Breadcrumb Skeleton */}
        <div className="bg-white border-b border-border-color py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-4 w-56 bg-slate-200 rounded-md" />
          </div>
        </div>

        {/* Hero Cover Skeleton */}
        <div className="bg-white border-b border-border-color">
          <div className="h-48 sm:h-64 md:h-72 w-full bg-slate-200" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end justify-between">
              <div className="flex gap-4 items-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-300 border-4 border-white shadow-sm shrink-0" />
                <div className="space-y-2.5">
                  <div className="h-7 w-64 sm:w-80 bg-slate-300 rounded-lg" />
                  <div className="h-4 w-44 bg-slate-200 rounded-md" />
                  <div className="flex gap-2">
                    <div className="h-5 w-20 bg-slate-200 rounded-full" />
                    <div className="h-5 w-24 bg-slate-200 rounded-full" />
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-10 w-28 bg-slate-200 rounded-xl" />
                <div className="h-10 w-36 bg-slate-200 rounded-xl" />
              </div>
            </div>

            {/* Tabs Skeleton */}
            <div className="flex gap-3 mt-8 pt-4 border-t border-slate-100 overflow-x-auto">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-8 w-28 bg-slate-200 rounded-lg shrink-0" />
              ))}
            </div>
          </div>
        </div>

        {/* Content Grid Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 space-y-4">
                <div className="h-6 w-48 bg-slate-300 rounded-md" />
                <div className="h-4 w-full bg-slate-200 rounded-md" />
                <div className="h-4 w-5/6 bg-slate-200 rounded-md" />
                <div className="h-4 w-4/6 bg-slate-200 rounded-md" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-20 bg-slate-100 rounded-xl" />
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 space-y-4">
                <div className="h-6 w-40 bg-slate-300 rounded-md" />
                <div className="h-12 w-full bg-slate-100 rounded-xl" />
                <div className="h-12 w-full bg-slate-100 rounded-xl" />
                <div className="h-12 w-full bg-slate-100 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!college) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-8 space-y-4">
        <Building className="h-12 w-12 text-slate-300" />
        <h2 className="font-serif text-xl font-bold text-slate-800">College Profile Not Found</h2>
        <p className="text-xs text-slate-500 max-w-sm text-center">
          This institution is either not yet published by the editorial board or has been updated.
        </p>
        <button
          onClick={onNavigateListing}
          className="btn btn-primary btn-sm text-xs cursor-pointer font-bold"
        >
          Browse All Colleges
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      {/* Breadcrumb Bar */}
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
              onClick={() => onNavigateListing && onNavigateListing(college.stream)}
              className="hover:text-brand-primary cursor-pointer capitalize"
            >
              {college.stream} Colleges
            </button>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="text-text-primary font-bold truncate">
              {college.shortName || college.name}
            </span>
          </nav>
        </div>
      </div>

      {/* LinkedIn-style Hero Banner & Header */}
      <div className="bg-white border-b border-border-color">
        
        {/* Wide Background Banner with 100% Full Uncut Ambient Showcase */}
        <div className="relative h-64 sm:h-80 md:h-96 lg:h-[440px] w-full overflow-hidden bg-slate-950 flex items-center justify-center">
          {/* Layer 1: Ambient Blurred Backdrop (Full edge-to-edge color fill matching image) */}
          <img
            src={
              college.image ||
              (Array.isArray(college.gallery) && college.gallery.length > 0
                ? (typeof college.gallery[0] === 'string' ? college.gallery[0] : college.gallery[0]?.url)
                : 'https://images.unsplash.com/photo-1562774053-701939374585?w=1600&auto=format&fit=crop&q=80')
            }
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover filter blur-3xl opacity-50 scale-125 pointer-events-none select-none"
          />
          {/* Subtle gradient vignette to blend nicely */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-black/20 pointer-events-none" />

          {/* Layer 2: 100% Full Uncut Photo (ZERO CROP - 100% of the image is shown without any cut!) */}
          <img
            src={
              college.image ||
              (Array.isArray(college.gallery) && college.gallery.length > 0
                ? (typeof college.gallery[0] === 'string' ? college.gallery[0] : college.gallery[0]?.url)
                : 'https://images.unsplash.com/photo-1562774053-701939374585?w=1600&auto=format&fit=crop&q=80')
            }
            alt={`${college.name} Campus Banner`}
            className="relative z-10 max-h-full max-w-full object-contain mx-auto drop-shadow-2xl"
          />

          {/* Top-Right Badge Overlay on Banner */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-8 flex items-center gap-2 z-20">
            <span className="px-3 py-1 rounded-full bg-slate-900/75 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider border border-white/20 shadow-sm">
              {college.stream || 'Engineering'}
            </span>
            {college.ownership && (
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold border border-white/30 shadow-sm">
                {college.ownership}
              </span>
            )}
          </div>
        </div>

        {/* Profile Content (White Card Area) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
          
          {/* Row 1: Circular Avatar (Overlapping Banner) + Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-18 md:-mt-22 mb-4">
            
            {/* Circular Logo Avatar (LinkedIn style) */}
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl bg-white overflow-hidden flex-shrink-0 z-10 flex items-center justify-center">
              {college.logo ? (
                <img
                  src={college.logo}
                  alt={`${college.name} Logo`}
                  className="w-full h-full object-cover"
                />
              ) : college.image ? (
                <img
                  src={college.image}
                  alt={`${college.name} Logo`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#033C8D] to-indigo-900 flex items-center justify-center text-white text-2xl font-bold uppercase">
                  {(college.shortName || college.name || 'VS').slice(0, 4)}
                </div>
              )}
            </div>

            {/* Right Action Buttons (Cleanly positioned inside white area) */}
            <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-end pt-2 sm:pt-0">
              <button
                type="button"
                onClick={() => onToggleShortlist && onToggleShortlist(college?.id || college?._id || effectiveCollegeId)}
                className={`btn btn-sm ${
                  effectiveIsShortlisted
                    ? 'bg-rose-50 border-rose-300 text-rose-600 font-bold'
                    : 'btn-outline bg-white hover:bg-slate-50'
                } shadow-2xs cursor-pointer`}
              >
                <Heart className={`h-3.5 w-3.5 ${effectiveIsShortlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{effectiveIsShortlisted ? 'Saved' : 'Save'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onToggleCompare) {
                    onToggleCompare(
                      college || {
                        id: effectiveCollegeId,
                        name: effectiveCollegeId.replace(/-/g, ' ').toUpperCase(),
                        shortName: effectiveCollegeId.replace(/-/g, ' ').toUpperCase(),
                      }
                    )
                  }
                }}
                className={`btn btn-sm ${
                  effectiveIsCompared
                    ? 'bg-[#EBF2FA] text-[#033C8D] border-[#033C8D]/40 font-bold shadow-2xs'
                    : 'btn-outline bg-white hover:bg-slate-50'
                } shadow-2xs cursor-pointer`}
              >
                <Scale className="h-3.5 w-3.5" />
                <span>{effectiveIsCompared ? 'Comparing' : 'Compare'}</span>
              </button>

              <button
                onClick={onOpenCounseling}
                className="btn btn-primary btn-md text-xs font-bold shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <span>Get Free Counseling</span>
              </button>
            </div>
          </div>

          {/* Row 2: Title, Badges & Institutional Details (100% inside white card, no collision) */}
          <div className="space-y-2 mb-6">
            <div className="flex flex-wrap items-center gap-2">
              {college.nirfRank && (
                <span className="px-2.5 py-0.5 rounded-md bg-brand-primary text-white text-[11px] font-bold uppercase shadow-2xs">
                  NIRF #{college.nirfRank}
                </span>
              )}
              {college.ownership && (
                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-text-secondary text-[11px] font-semibold border border-slate-200">
                  {college.ownership}
                </span>
              )}
              {college.establishmentYear && (
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                  Est. {college.establishmentYear}
                </span>
              )}
              {college.naacGrade && (
                <span className="px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[11px] font-semibold border border-purple-200">
                  NAAC {college.naacGrade}
                </span>
              )}
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary tracking-tight">
              {college.name}
            </h1>

            <p className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-text-light font-medium">
              <MapPin className="h-3.5 w-3.5 text-brand-primary flex-shrink-0" />
              <span>{college.location}</span>
              {college.campusArea && (
                <>
                  <span>•</span>
                  <span>Campus: {college.campusArea}</span>
                </>
              )}
              {college.affiliation && (
                <>
                  <span>•</span>
                  <span className="text-text-secondary">{college.affiliation}</span>
                </>
              )}
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl mt-6">
            <div>
              <p className="text-[10px] font-semibold text-text-light uppercase tracking-wider">
                Average Package
              </p>
              <p className="text-base sm:text-lg font-extrabold text-emerald-600 mt-0.5">
                {college.avgPackage}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-text-light uppercase tracking-wider">
                Total Tuition Fees
              </p>
              <p className="text-base sm:text-lg font-bold text-text-primary mt-0.5">
                {college.totalFees} ({college.feesPeriod})
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-text-light uppercase tracking-wider">
                Highest Placement
              </p>
              <p className="text-base sm:text-lg font-bold text-brand-primary mt-0.5">
                {college.highestPackage || '₹50 LPA'}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-text-light uppercase tracking-wider">
                Student Rating
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-base sm:text-lg font-bold text-text-primary">
                  {college.rating}
                </span>
                <span className="text-xs text-text-light font-medium">
                  ({college.reviewsCount || 0})
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Sticky Tab Navigation Bar */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-border-color shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-brand-primary text-white font-bold shadow-2xs'
                    : 'text-text-secondary hover:text-brand-primary hover:bg-brand-accent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left 2 Columns: Active Tab View */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              className="lg:col-span-2 space-y-6"
            >
            
            {/* 1. OVERVIEW & FACTS TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-card">
                  <h2 className="font-serif text-xl font-bold text-text-primary">
                    About {college.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                    {college.description || 'Verified institutional disclosure.'}
                  </p>

                  {college.snapshot && (
                    <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                      <div className="flex items-start gap-2">
                        <ShieldCheck className="h-4 w-4 text-brand-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-text-primary">Accreditation: </strong>
                          <span className="text-text-secondary">{college.snapshot.accreditation}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Users className="h-4 w-4 text-brand-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-text-primary">Faculty: </strong>
                          <span className="text-text-secondary">{college.snapshot.totalFaculty}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Building2 className="h-4 w-4 text-brand-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-text-primary">Hostel Capacity: </strong>
                          <span className="text-text-secondary">{college.snapshot.hostelCapacity}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Layers className="h-4 w-4 text-brand-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-text-primary">Gender Ratio: </strong>
                          <span className="text-text-secondary">{college.snapshot.genderRatio}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Campus Facilities */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-card">
                  <h3 className="font-serif text-lg font-bold text-text-primary mb-3">
                    Campus Facilities & Infrastructure
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {(college.facilities || []).map((fac) => (
                      <div
                        key={fac}
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-text-primary"
                      >
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span>{fac}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Residential Hostels & Housing (If provided) */}
                {college.hostelDetails && (college.hostelDetails.totalHostels || college.hostelDetails.totalCapacity || college.hostelDetails.boysHostelDetails) && (
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-card space-y-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-brand-primary" />
                      <h3 className="font-serif text-lg font-bold text-text-primary">
                        Residential Hostels & Accommodation
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {college.hostelDetails.totalHostels && (
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <strong className="text-text-primary">Total Hostels: </strong>
                          <span className="text-text-secondary">{college.hostelDetails.totalHostels}</span>
                        </div>
                      )}
                      {college.hostelDetails.totalCapacity && (
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <strong className="text-text-primary">Hostel Capacity: </strong>
                          <span className="text-text-secondary">{college.hostelDetails.totalCapacity}</span>
                        </div>
                      )}
                      {college.hostelDetails.boysHostelDetails && (
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <strong className="text-text-primary">Boys Hostels: </strong>
                          <span className="text-text-secondary">{college.hostelDetails.boysHostelDetails}</span>
                        </div>
                      )}
                      {college.hostelDetails.girlsHostelDetails && (
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <strong className="text-text-primary">Girls Hostels: </strong>
                          <span className="text-text-secondary">{college.hostelDetails.girlsHostelDetails}</span>
                        </div>
                      )}
                      {college.hostelDetails.messFoodType && (
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 sm:col-span-2">
                          <strong className="text-text-primary">Mess & Dining: </strong>
                          <span className="text-text-secondary">{college.hostelDetails.messFoodType}</span>
                        </div>
                      )}
                      {college.hostelDetails.annualHostelMessFee && (
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 sm:col-span-2">
                          <strong className="text-text-primary">Annual Hostel + Mess Fee: </strong>
                          <span className="text-emerald-700 font-bold">{college.hostelDetails.annualHostelMessFee}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. ADMISSIONS & PROCESS TAB */}
            {activeTab === 'admissions' && (
              <div className="space-y-6">
                {/* A. Admission Status, Academic Session & Timeline Card */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-card space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        <h2 className="font-serif text-lg sm:text-xl font-bold text-text-primary">
                          {college.admissionStatus || college.admissions?.status || 'Admissions Open'}
                        </h2>
                      </div>
                      <p className="text-xs text-text-secondary mt-1">
                        Official enrollment cycle for Academic Year <strong className="text-text-primary font-bold">{college.academicYear || '2026 - 2027'}</strong>
                      </p>
                    </div>

                    {college.admissionPortalUrl && (
                      <a
                        href={college.admissionPortalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-brand-primary hover:bg-[#022B66] text-white text-xs font-bold transition-all shadow-sm hover:shadow cursor-pointer self-start sm:self-auto"
                      >
                        <span>Apply via Central Portal</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>

                  {/* Application Timeline Dates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-text-light uppercase tracking-wider">
                          Application Start Date
                        </p>
                        <p className="text-sm font-bold text-text-primary mt-0.5">
                          {college.applicationStartDate
                            ? new Date(college.applicationStartDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                            : (college.admissions?.applicationStart || 'Announced upon official notification')}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-text-light uppercase tracking-wider">
                          Application Closing Deadline
                        </p>
                        <p className="text-sm font-bold text-rose-600 mt-0.5">
                          {college.applicationEndDate
                            ? new Date(college.applicationEndDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                            : (college.admissions?.applicationEnd || 'Subject to counseling schedule')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* B. Accepted Entrance Examinations */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-card space-y-4">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-text-primary">
                      Accepted Entrance Examinations
                    </h3>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Applicants must obtain qualifying ranks in the following recognized national or institutional entrance tests.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {(college.examAccepted?.length ? college.examAccepted : (college.admissions?.examAccepted || ['JEE Advanced', 'JEE Main'])).map((exam) => (
                      <div
                        key={exam}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-accent text-brand-primary border border-brand-primary/20 text-xs font-bold shadow-2xs"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-brand-primary" />
                        <span>{exam}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* C. General Eligibility Overview */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-card space-y-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-brand-primary" />
                    <h3 className="font-serif text-lg font-bold text-text-primary">
                      Eligibility & Qualification Criteria
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                    {college.admissionOverview ||
                      'Candidates must meet minimum educational aggregate requirements (e.g., 75% in 10+2 with Physics, Chemistry & Mathematics for B.Tech, or 65% for reserved categories) along with a valid qualifying rank in the designated national entrance test.'}
                  </p>
                </div>

                {/* D. Step-by-Step Admission Process Flow */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-card space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-text-primary">
                        Step-by-Step Admission Process
                      </h3>
                      <p className="text-xs text-text-secondary mt-0.5">
                        Follow the sequence of stages to secure confirmed enrollment.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-1">
                    {(college.admissionProcessSteps?.length > 0
                      ? college.admissionProcessSteps
                      : (college.admissions?.admissionSteps || [
                          { step: '1', title: 'Appear for Entrance Exam', desc: 'Qualify the national or institutional entrance exam with a competitive rank.' },
                          { step: '2', title: 'Counseling & Choice Locking', desc: 'Register on the designated central counseling portal (e.g., JoSAA / CSAB) and submit branch preferences.' },
                          { step: '3', title: 'Seat Allotment & Acceptance', desc: 'Accept the allotted seat and pay the provisional seat confirmation fee.' },
                          { step: '4', title: 'Physical Verification & Onboarding', desc: 'Report to campus with original documents for document verification and hostel allotment.' },
                        ])
                    ).map((item, idx) => {
                      const stepNum = item.step || idx + 1
                      const title = typeof item === 'string' ? (item.split(':')[0] || `Stage ${stepNum}`) : (item.title || `Stage ${stepNum}`)
                      const desc = typeof item === 'string' ? (item.split(':')[1] || item) : (item.desc || '')

                      return (
                        <div
                          key={idx}
                          className="flex items-start gap-3.5 p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-full bg-brand-primary text-white text-xs font-extrabold flex items-center justify-center flex-shrink-0 shadow-2xs mt-0.5">
                            {stepNum}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs sm:text-sm font-bold text-text-primary">
                              {title}
                            </h4>
                            {desc && (
                              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                                {desc}
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 3. COURSES TAB */}
            {activeTab === 'courses' && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-card">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-xl font-bold text-text-primary">
                    Courses Offered & Fee Structure
                  </h2>
                  <span className="text-xs font-bold text-brand-primary bg-brand-accent px-2.5 py-1 rounded-md">
                    {college.coursesOffered?.length || 0} Programs
                  </span>
                </div>

                <div className="space-y-3">
                  {(college.coursesOffered || []).map((course) => (
                    <div
                      key={course.id || course.name}
                      className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2.5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                        <div>
                          <span className="text-[10px] font-bold text-brand-primary uppercase">
                            {course.degreeLevel || 'Degree Program'}
                          </span>
                          <h4 className="font-serif text-base font-bold text-text-primary">
                            {course.name}
                          </h4>
                        </div>
                        <span className="text-xs font-bold text-text-primary bg-white border border-slate-200 px-2.5 py-1 rounded-md self-start sm:self-auto">
                          {course.fee}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-text-secondary pt-2 border-t border-slate-200/80">
                        <div>
                          <strong className="text-text-primary">Duration:</strong> {course.duration}
                        </div>
                        <div>
                          <strong className="text-text-primary">Seats:</strong> {course.seatIntake}
                        </div>
                        <div>
                          <strong className="text-text-primary">Avg Package:</strong> {course.avgSalary}
                        </div>
                      </div>

                      <p className="text-xs text-text-secondary">
                        <strong className="text-text-primary">Eligibility:</strong> {course.eligibility}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. CUTOFFS TAB */}
            {activeTab === 'cutoffs' && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-card">
                <h2 className="font-serif text-xl font-bold text-text-primary">
                  Entrance Exam Cutoff Ranks (2025–26)
                </h2>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-text-primary font-bold">
                        <th className="py-3 px-3.5">Entrance Exam</th>
                        <th className="py-3 px-3.5">Branch / Course</th>
                        <th className="py-3 px-3.5">General Cutoff</th>
                        <th className="py-3 px-3.5">OBC Cutoff</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/80">
                      {(college.admissionCutoffs || []).map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-3 px-3.5 font-bold text-brand-primary">{item.exam}</td>
                          <td className="py-3 px-3.5 font-semibold text-text-primary">{item.course}</td>
                          <td className="py-3 px-3.5 text-emerald-600 font-bold">{item.generalCutoff}</td>
                          <td className="py-3 px-3.5 text-text-secondary">{item.obcCutoff}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. PLACEMENTS TAB */}
            {activeTab === 'placements' && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-5 shadow-card">
                <h2 className="font-serif text-xl font-bold text-text-primary">
                  Placement Records & Top Recruiters
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
                    <p className="text-[10px] font-bold text-emerald-800 uppercase">Highest Domestic</p>
                    <p className="text-lg font-bold text-emerald-700 mt-0.5">
                      {college.placements?.highestDomestic || '₹1.50 Cr PA'}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-100 text-center">
                    <p className="text-[10px] font-bold text-brand-primary uppercase">Average Package</p>
                    <p className="text-lg font-bold text-brand-primary mt-0.5">
                      {college.placements?.avgPackage || '₹24.5 LPA'}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center col-span-2 sm:col-span-1">
                    <p className="text-[10px] font-bold text-text-secondary uppercase">Placement Rate</p>
                    <p className="text-lg font-bold text-text-primary mt-0.5">
                      {college.placements?.placementRate || 98}%
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-sm font-bold text-text-primary mb-2.5">
                    Top Visiting Recruiters
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(college.placements?.topRecruiters || []).map((rec) => (
                      <span
                        key={rec}
                        className="px-3 py-1 rounded-lg bg-slate-100 text-text-primary text-xs font-semibold border border-slate-200"
                      >
                        {rec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 5. ROI CALCULATOR TAB */}
            {activeTab === 'roi' && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-5 shadow-card">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-text-primary">
                      ROI & Hidden Cost Calculator
                    </h2>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Estimates complete college expenditure including hostel, food, caution deposit vs starting salary.
                    </p>
                  </div>
                  <Calculator className="h-6 w-6 text-brand-primary flex-shrink-0" />
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-text-primary">
                  <span>Program Tenure:</span>
                  {[2, 4, 5].map((yrs) => (
                    <button
                      key={yrs}
                      type="button"
                      onClick={() => setCalculatorTenure(yrs)}
                      className={`px-3 py-1 rounded-lg border transition-colors cursor-pointer ${
                        calculatorTenure === yrs
                          ? 'bg-brand-primary text-white border-brand-primary font-bold'
                          : 'bg-slate-50 text-text-secondary border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {yrs} Years
                    </button>
                  ))}
                </div>

                {college.hiddenCosts && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-200">
                        <span className="text-text-secondary">Tuition Fee ({calculatorTenure} Yrs):</span>
                        <span className="font-bold text-text-primary">
                          ₹{(((college.hiddenCosts.tuitionFeePerYear || 0) * calculatorTenure) / 100000).toFixed(2)} L
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200">
                        <span className="text-text-secondary">Hostel Rent ({calculatorTenure} Yrs):</span>
                        <span className="font-bold text-text-primary">
                          ₹{(((college.hiddenCosts.hostelRentYearly || 0) * calculatorTenure) / 100000).toFixed(2)} L
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200">
                        <span className="text-text-secondary">Mess & Food ({calculatorTenure} Yrs):</span>
                        <span className="font-bold text-text-primary">
                          ₹{(((college.hiddenCosts.messChargesYearly || 0) * calculatorTenure) / 100000).toFixed(2)} L
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200">
                        <span className="text-text-secondary">Caution Money (One-Time):</span>
                        <span className="font-bold text-text-primary">
                          ₹{((college.hiddenCosts.cautionDepositOneTime || 0) / 100000).toFixed(2)} L
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
                      <div>
                        <p className="text-[10px] text-text-light font-bold uppercase">Estimated Total Cost</p>
                        <p className="text-xl font-bold text-brand-primary">₹{estimatedTotalCost.toFixed(2)} Lakhs</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-text-light font-bold uppercase">Expected Avg Package</p>
                        <p className="text-xl font-bold text-emerald-600">{college.avgPackage || '₹24.5 LPA'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}


            {/* 7. GALLERY TAB */}
            {activeTab === 'gallery' && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-card">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-text-primary">
                      Campus & Hostel Photos
                    </h2>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Click any photo to open full-screen preview with previous and next navigation.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-brand-primary bg-brand-accent/50 px-3 py-1 rounded-full border border-brand-primary/20">
                    {galleryList.length} {galleryList.length === 1 ? 'Photo' : 'Photos'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {galleryList.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => setLightboxIndex(idx)}
                      className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-44 sm:h-52 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-brand-primary"
                      title="Click to view full photo"
                    >
                      <img
                        src={item.url}
                        alt={item.caption || `Campus Photo ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />

                      {/* Top Category Badge */}
                      {item.category && (
                        <div className="absolute top-2.5 left-2.5 z-10">
                          <span className="px-2.5 py-0.5 rounded-md bg-slate-900/70 text-white text-[10px] font-bold backdrop-blur-md border border-white/20 uppercase tracking-wider">
                            {item.category}
                          </span>
                        </div>
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3.5">
                        <div className="self-end">
                          <span className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center border border-white/30 shadow-sm transition-transform group-hover:scale-110">
                            <Maximize2 className="h-4 w-4" />
                          </span>
                        </div>
                        <div className="text-white">
                          <p className="text-xs sm:text-sm font-bold truncate drop-shadow-sm">
                            {item.caption}
                          </p>
                          <span className="text-[10px] text-white/80 font-medium flex items-center gap-1 mt-0.5">
                            <span>Click to view full size</span>
                            <span>→</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {galleryList.length === 0 && (
                    <div className="col-span-full py-16 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                      <p className="text-sm font-medium">No campus photography uploaded yet.</p>
                      <p className="text-xs text-slate-400 mt-1">Photos will appear here once published by the college administration.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            </motion.div>
          </AnimatePresence>

          {/* Right 1 Column: Admissions & Deadlines Card (Sticky on Scroll) */}
          <div className="lg:sticky lg:top-32 space-y-5 self-start z-20">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  Admissions & Deadlines
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Official admission timeline, entrance eligibility and application desk.
                </p>
              </div>

              {/* Deadlines Box */}
              <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3.5 space-y-3">
                <div className="flex items-start justify-between gap-2 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                      Application Starts
                    </span>
                    <span className="font-bold text-slate-800">
                      {college.applicationStartDate || college.admissions?.applicationStart || 'May 2026'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                      Closing Deadline
                    </span>
                    <span className="font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/60 inline-block">
                      {college.applicationEndDate || college.admissions?.applicationEnd || 'July 2026'}
                    </span>
                  </div>
                </div>

                {/* Accepted Entrance Tests */}
                <div className="pt-2 border-t border-slate-200/70 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Accepted Entrance Tests
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {(college.examAccepted && college.examAccepted.length > 0
                      ? college.examAccepted
                      : (college.admissions?.examAccepted && college.admissions.examAccepted.length > 0
                          ? college.admissions.examAccepted
                          : ['JEE Advanced', 'JEE Main', 'GATE'])
                    ).map((exam, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px] font-bold shadow-2xs"
                      >
                        {exam}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenCounseling) {
                      onOpenCounseling({
                        title: 'Download Official Brochure',
                        collegeName: college.name,
                        portalUrl: college.admissionPortalUrl || college.locationContact?.websiteUrl,
                        stream: college.stream || 'engineering',
                      })
                    }
                  }}
                  className="btn btn-primary btn-md w-full text-xs font-bold justify-center shadow-xs cursor-pointer flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Official Brochure</span>
                </button>
              </div>
            </div>
          </div>


        </div>
      </div>

      {/* ================= LIGHTBOX IMAGE PREVIEW MODAL ================= */}
      <AnimatePresence>
        {lightboxIndex !== null && galleryList[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 select-none"
            onClick={handleCloseLightbox}
          >
            {/* Top Bar: Title, Counter & Close Button */}
            <div
              className="flex items-center justify-between z-10 w-full max-w-6xl mx-auto py-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                  {lightboxIndex + 1} / {galleryList.length}
                </span>
                <span className="text-white/90 text-xs sm:text-sm font-semibold truncate max-w-xs sm:max-w-md">
                  {galleryList[lightboxIndex].caption}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCloseLightbox}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 hover:scale-105 active:scale-95 shadow-md"
                  title="Close (Esc)"
                  aria-label="Close Preview"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Center Area: Left Nav Button + Image Viewport + Right Nav Button */}
            <div
              className="relative flex-1 flex items-center justify-center w-full max-w-6xl mx-auto my-2 min-h-0"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Previous Image Button (Left) */}
              {galleryList.length > 1 && (
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-2 sm:left-4 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 hover:scale-110 active:scale-95 shadow-2xl backdrop-blur-sm"
                  title="Previous image (Left Arrow)"
                  aria-label="Previous Image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}

              {/* Main Active Image with Smooth Motion */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={lightboxIndex}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full flex items-center justify-center p-2"
                >
                  <img
                    src={galleryList[lightboxIndex].url}
                    alt={galleryList[lightboxIndex].caption}
                    className="max-h-[72vh] max-w-full object-contain rounded-xl shadow-2xl drop-shadow-2xl border border-white/10"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Next Image Button (Right) */}
              {galleryList.length > 1 && (
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-2 sm:right-4 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 hover:scale-110 active:scale-95 shadow-2xl backdrop-blur-sm"
                  title="Next image (Right Arrow)"
                  aria-label="Next Image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              )}
            </div>

            {/* Bottom Thumbnail Strip for Instant Jump */}
            {galleryList.length > 1 && (
              <div
                className="z-10 w-full max-w-3xl mx-auto flex items-center justify-center gap-2 overflow-x-auto py-2 custom-scrollbar"
                onClick={(e) => e.stopPropagation()}
              >
                {galleryList.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setLightboxIndex(idx)}
                    className={`relative rounded-lg overflow-hidden shrink-0 h-12 sm:h-14 w-16 sm:w-20 transition-all border-2 cursor-pointer ${
                      lightboxIndex === idx
                        ? 'border-white scale-105 shadow-md ring-2 ring-blue-500'
                        : 'border-transparent opacity-40 hover:opacity-100 hover:scale-100'
                    }`}
                    title={item.caption}
                  >
                    <img
                      src={item.url}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CollegeDetailPage
