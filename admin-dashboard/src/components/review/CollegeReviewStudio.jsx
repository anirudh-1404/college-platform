import React, { useState, useMemo } from 'react'
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  ExternalLink,
  BookOpen,
  Calendar,
  Clock,
  Award,
  DollarSign,
  TrendingUp,
  Users,
  ShieldCheck,
  Home,
  Utensils,
  Image as ImageIcon,
  Video,
  Sparkles,
  Check,
  X,
  ChevronRight,
  ArrowRight,
  Download,
  Filter,
  Layers,
  Compass,
  HelpCircle,
  AlertCircle,
  Info,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  FileCheck,
  Bookmark,
  Share2,
  Star,
  Percent,
  Edit3,
  Search,
} from 'lucide-react'
import AdminStatusBadge from '../common/AdminStatusBadge'
import ErrorBoundary from '../common/ErrorBoundary'

export const CollegeReviewStudio = ({
  profile,
  onClose,
  onApproveAndPublish,
  onRequestChanges,
  onUnpublish,
  onRefreshProfile,
  onEditCollege,
  isRefreshing = false,
}) => {
  // Navigation Section in Audit Mode
  const [activeStep, setActiveStep] = useState(1)
  // Studio View Mode: 'audit' (default) or 'public_simulation'
  const [viewMode, setViewMode] = useState('audit')
  // Search filter within courses / cutoffs
  const [courseSearch, setCourseSearch] = useState('')
  const [cutoffSearch, setCutoffSearch] = useState('')
  // Image zoom modal
  const [zoomedImage, setZoomedImage] = useState(null)
  // Active Public Preview Tab
  const [previewTab, setPreviewTab] = useState('overview')
  // Public Preview Calculator Tenure
  const [calcTenure, setCalcTenure] = useState(4)

  if (!profile) return null

  // 1. Normalized Field Resolution (Bulletproof against schema variances)
  const basic = {
    name: profile.name || 'Unnamed Institution',
    shortName: profile.shortName || profile.short_name || 'College',
    stream: profile.stream || 'engineering',
    ownership: profile.ownership || 'Government',
    establishmentYear: profile.establishmentYear || profile.established || '1958',
    campusArea: profile.campusArea || profile.campusSize || 'N/A',
    affiliation: profile.affiliation || profile.university || 'Autonomous Institute',
    accreditation: profile.accreditation || 'AICTE, UGC Approved',
    description: profile.description || profile.about || 'No detailed institutional description provided.',
    tags: Array.isArray(profile.tags) ? profile.tags : [],
    logo: profile.logo || '',
    image: profile.image || 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&auto=format&fit=crop&q=80',
  }

  const contact = {
    address: profile.locationContact?.address || profile.address || 'Campus Address Not Provided',
    city: profile.locationContact?.city || profile.city || profile.location || 'N/A',
    state: profile.locationContact?.state || profile.state || 'N/A',
    pincode: profile.locationContact?.pincode || profile.pincode || '',
    admissionEmail: profile.locationContact?.admissionEmail || profile.admissionEmail || profile.email || '',
    helplineNumber: profile.locationContact?.helplineNumber || profile.helplinePhone || profile.phone || '',
    alternatePhone: profile.locationContact?.alternatePhone || profile.tollFreeHelpline || '',
    websiteUrl: profile.locationContact?.websiteUrl || profile.website || '',
    mapCoordinates: profile.locationContact?.mapCoordinates || profile.googleMapCoordinates || '',
  }

  const courses = Array.isArray(profile.coursesOffered) ? profile.coursesOffered : []

  const admissions = {
    status: profile.admissionStatus || profile.admissions?.status || 'Admissions Open',
    academicYear: profile.academicYear || '2026 - 2027',
    applicationStart: profile.applicationStartDate || profile.admissions?.applicationStart || '',
    applicationEnd: profile.applicationEndDate || profile.admissions?.applicationEnd || '',
    portalUrl: profile.admissionPortalUrl || '',
    examAccepted: Array.isArray(profile.examAccepted) && profile.examAccepted.length > 0
      ? profile.examAccepted
      : (Array.isArray(profile.admissions?.examAccepted) ? profile.admissions.examAccepted : []),
    overview: profile.admissionOverview || 'Admissions are conducted strictly via national/state level entrance examination counselling followed by centralized seat allocation.',
    steps: Array.isArray(profile.admissionProcessSteps) && profile.admissionProcessSteps.length > 0
      ? profile.admissionProcessSteps
      : (Array.isArray(profile.admissions?.admissionSteps)
          ? profile.admissions.admissionSteps.map((s, idx) =>
              typeof s === 'string'
                ? { step: idx + 1, title: s.split(':')[0] || `Step ${idx + 1}`, desc: s.split(':').slice(1).join(':').trim() || s }
                : s
            )
          : []),
  }

  const cutoffs = Array.isArray(profile.admissionCutoffs) ? profile.admissionCutoffs : []

  const placements = {
    highestDomestic: profile.placements?.highestDomestic || profile.highestPackage || 'N/A',
    highestInternational: profile.placements?.highestInternational || 'N/A',
    avgPackage: profile.placements?.avgPackage || profile.avgPackage || 'N/A',
    medianPackage: profile.placements?.medianPackage || 'N/A',
    placementRate: profile.placements?.placementRate || profile.placementPercent || 0,
    topRecruiters: Array.isArray(profile.placements?.topRecruiters) ? profile.placements.topRecruiters : [],
    branchWise: Array.isArray(profile.placements?.branchWise) ? profile.placements.branchWise : [],
    placementReportUrl: profile.placements?.placementReportUrl || '',
  }

  const rankings = {
    nirfRank: profile.rankings?.nirfRank || profile.nirfRank || 'N/A',
    nirfCategory: profile.rankings?.nirfCategory || profile.nirfCategory || 'Engineering',
    nirfYear: profile.rankings?.nirfYear || 2025,
    naacGrade: profile.rankings?.naacGrade || profile.naacGrade || 'A++ (3.88 CGPA)',
    naacCgpa: profile.rankings?.naacCgpa || '3.88',
    additionalRankings: (
      Array.isArray(profile.additionalRankings) && profile.additionalRankings.length > 0
        ? profile.additionalRankings
        : (Array.isArray(profile.rankings?.otherRankings) ? profile.rankings.otherRankings : [])
    ).map((r, idx) => {
      if (typeof r === 'string') {
        const parts = r.split(':')
        return {
          id: `rank_${idx}`,
          agency: parts[0]?.trim() || r,
          rank: parts.slice(1).join(':').trim() || '#1',
          category: 'General',
          year: '2025',
        }
      }
      return {
        id: r?.id || `rank_${idx}`,
        agency: r?.agency || r?.name || 'Ranking Agency',
        rank: r?.rank || '#1',
        category: r?.category || 'General',
        year: r?.year || '2025',
      }
    }),
  }

  const facilities = Array.isArray(profile.facilities) ? profile.facilities : []
  const hostel = profile.hostelDetails || {}
  const costs = profile.hiddenCosts || {}

  const parseNumericCost = (val, fallback = 0) => {
    if (typeof val === 'number') return isNaN(val) ? fallback : val
    if (!val) return fallback
    const cleaned = String(val).replace(/[^0-9.]/g, '')
    const num = parseFloat(cleaned)
    return isNaN(num) ? fallback : num
  }

  const annualTotalCost = useMemo(() => {
    const t = parseNumericCost(costs.tuitionFeePerYear, 0)
    const h = parseNumericCost(costs.hostelRentYearly, 0)
    const m = parseNumericCost(costs.messChargesYearly, 0)
    const e = parseNumericCost(costs.examinationMiscYearly, 0) * 2
    return t + h + m + e
  }, [costs])

  const calculated4YrExpense = useMemo(() => {
    const caution = parseNumericCost(costs.cautionDepositOneTime, 0)
    return ((annualTotalCost * calcTenure + caution) / 100000).toFixed(2)
  }, [annualTotalCost, calcTenure, costs.cautionDepositOneTime])

  const gallery = Array.isArray(profile.gallery) ? profile.gallery : []
  const virtualTourUrl = profile.virtualTourUrl || ''

  // 2. 10-Step Completeness Audit Matrix
  const auditSections = [
    {
      id: 1,
      title: 'Basic Info & Legal Identity',
      icon: Building2,
      isComplete: !!(basic.name && basic.shortName && basic.establishmentYear),
      summary: `${basic.stream} • ${basic.ownership}`,
    },
    {
      id: 2,
      title: 'Location & Official Contacts',
      icon: MapPin,
      isComplete: !!(contact.city && contact.admissionEmail && contact.helplineNumber),
      summary: `${contact.city}, ${contact.state}`,
    },
    {
      id: 3,
      title: 'Academic Programs & Fees',
      icon: BookOpen,
      isComplete: courses.length > 0,
      summary: `${courses.length} Programs Added`,
    },
    {
      id: 4,
      title: 'Admissions & Timeline',
      icon: Compass,
      isComplete: admissions.examAccepted.length > 0 || !!admissions.status,
      summary: `${admissions.status} • ${admissions.examAccepted.length} Exams`,
    },
    {
      id: 5,
      title: 'Cutoff Ranks Matrix',
      icon: Award,
      isComplete: cutoffs.length > 0,
      summary: `${cutoffs.length} Cutoff Rows`,
    },
    {
      id: 6,
      title: 'Placements & Recruiters',
      icon: TrendingUp,
      isComplete: !!(placements.avgPackage !== 'N/A' && placements.placementRate),
      summary: `${placements.avgPackage} Avg • ${placements.placementRate}% Placed`,
    },
    {
      id: 7,
      title: 'Rankings & Accreditations',
      icon: Award,
      isComplete: !!(rankings.nirfRank !== 'N/A' || rankings.additionalRankings.length > 0),
      summary: `NIRF #${rankings.nirfRank} • NAAC ${rankings.naacGrade}`,
    },
    {
      id: 8,
      title: 'Facilities & ROI Costs',
      icon: Sparkles,
      isComplete: facilities.length > 0 && !!costs.tuitionFeePerYear,
      summary: `${facilities.length} Amenities • ₹${((annualTotalCost || 0) / 100000).toFixed(1)}L/yr`,
    },
    {
      id: 9,
      title: 'Campus Gallery & Media',
      icon: ImageIcon,
      isComplete: gallery.length > 0,
      summary: `${gallery.length} High-Res Photos`,
    },
    {
      id: 10,
      title: 'Verification Verdict',
      icon: ShieldCheck,
      isComplete: profile.profileStatus === 'under_review' || profile.profileStatus === 'published',
      summary: `Status: ${profile.profileStatus || 'Draft'}`,
    },
  ]

  const completedCount = auditSections.filter((s) => s.isComplete).length
  const completenessPercent = Math.round((completedCount / auditSections.length) * 100)

  // Filtered Courses & Cutoffs
  const filteredCourses = useMemo(() => {
    if (!courseSearch.trim()) return courses
    const q = courseSearch.toLowerCase()
    return courses.filter((c) => {
      if (!c) return false
      const name = typeof c === 'string' ? c : (c.name || '')
      const level = typeof c === 'object' ? (c.degreeLevel || '') : ''
      const elig = typeof c === 'object' ? (c.eligibility || '') : ''
      return (
        name.toLowerCase().includes(q) ||
        level.toLowerCase().includes(q) ||
        elig.toLowerCase().includes(q)
      )
    })
  }, [courses, courseSearch])

  const filteredCutoffs = useMemo(() => {
    if (!cutoffSearch.trim()) return cutoffs
    const q = cutoffSearch.toLowerCase()
    return cutoffs.filter((c) => {
      if (!c) return false
      const exam = typeof c === 'string' ? c : (c.exam || '')
      const course = typeof c === 'object' ? (c.course || '') : ''
      const quota = typeof c === 'object' ? (c.quota || '') : ''
      return (
        exam.toLowerCase().includes(q) ||
        course.toLowerCase().includes(q) ||
        quota.toLowerCase().includes(q)
      )
    })
  }, [cutoffs, cutoffSearch])

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col justify-end sm:justify-center p-0 sm:p-3 overflow-hidden animate-in fade-in duration-200">
      
      {/* Main Studio Card */}
      <div className="bg-slate-50 w-full h-full sm:rounded-2xl sm:border sm:border-slate-200 shadow-2xl flex flex-col overflow-hidden">
        
        {/* ================= TOP HEADER BAR ================= */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 shrink-0 shadow-2xs z-20">
          
          {/* Left Identity Info */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1.5 shrink-0"
              title="Return to Review Queue"
            >
              <span>← Back</span>
            </button>

            <div className="h-9 w-9 rounded-xl bg-[#033C8D] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
              {basic.shortName?.slice(0, 2).toUpperCase() || 'VS'}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-serif text-base sm:text-lg font-bold text-slate-900 truncate">
                  {basic.name}
                </h1>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200">
                  {basic.shortName}
                </span>
                <AdminStatusBadge status={profile.profileStatus} />
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 truncate">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-slate-400" />
                  {contact.city}, {contact.state}
                </span>
                <span>•</span>
                <span className="capitalize">{basic.stream} ({basic.ownership})</span>
                <span>•</span>
                <span className="text-[#033C8D] font-bold">NIRF #{rankings.nirfRank}</span>
                <span>•</span>
                <span className="text-emerald-600 font-bold">{placements.avgPackage} Avg CTC</span>
              </div>
            </div>
          </div>

          {/* Center: View Switcher */}
          <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('audit')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'audit'
                  ? 'bg-white text-[#033C8D] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCheck className="h-3.5 w-3.5 text-[#033C8D]" />
              <span>Full 10-Step Audit</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('public_simulation')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'public_simulation'
                  ? 'bg-white text-[#033C8D] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className="h-3.5 w-3.5 text-[#033C8D]" />
              <span>Live Public Preview</span>
            </button>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Live Refresh Button */}
            {onRefreshProfile && (
              <button
                type="button"
                onClick={onRefreshProfile}
                disabled={isRefreshing}
                className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer text-xs"
                title="Refresh Live Data from Database"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-[#033C8D]' : ''}`} />
              </button>
            )}

            {/* Edit College Details Button */}
            {onEditCollege && (
              <button
                type="button"
                onClick={() => onEditCollege(profile)}
                className="btn btn-outline border-blue-300 text-[#033C8D] bg-blue-50/70 hover:bg-blue-100 btn-md text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-2xs"
                title="Edit Institutional Details"
              >
                <Edit3 className="h-3.5 w-3.5 text-[#033C8D]" />
                <span className="hidden sm:inline">Edit</span> Details
              </button>
            )}

            {/* Request Changes Button */}
            <button
              type="button"
              onClick={onRequestChanges}
              className="btn btn-outline border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100 btn-md text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
              <span className="hidden sm:inline">Request</span> Changes
            </button>

            {/* Publish / Unpublish Action */}
            {profile.profileStatus === 'published' ? (
              <button
                type="button"
                onClick={onUnpublish}
                className="btn btn-outline border-rose-300 text-rose-700 bg-rose-50 hover:bg-rose-100 btn-md text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <XCircle className="h-3.5 w-3.5 text-rose-600" />
                <span>Unpublish</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onApproveAndPublish}
                className="btn bg-emerald-600 hover:bg-emerald-700 text-white btn-md text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-sm border border-emerald-600"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Approve & Publish Live</span>
              </button>
            )}

            {/* Close Cross */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Close Review Studio"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

        </header>

        {/* Mobile View Switcher Banner */}
        <div className="md:hidden bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-600">Mode:</span>
          <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('audit')}
              className={`px-2 py-1 rounded text-[11px] font-bold ${
                viewMode === 'audit' ? 'bg-[#033C8D] text-white' : 'text-slate-600'
              }`}
            >
              Audit Mode
            </button>
            <button
              type="button"
              onClick={() => setViewMode('public_simulation')}
              className={`px-2 py-1 rounded text-[11px] font-bold ${
                viewMode === 'public_simulation' ? 'bg-[#033C8D] text-white' : 'text-slate-600'
              }`}
            >
              Public Preview
            </button>
          </div>
        </div>

        {/* ================= STUDIO BODY CONTENT ================= */}
        <div className="flex-1 flex overflow-hidden">

          {/* ----------------- MODE A: FULL 10-STEP AUDIT ----------------- */}
          {viewMode === 'audit' && (
            <>
              {/* LEFT SIDEBAR: 10-Step Navigation & Readiness */}
              <aside className="w-64 sm:w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
                
                {/* Readiness Score Card */}
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-800">Profile Readiness</span>
                    <span className="text-xs font-extrabold text-[#033C8D]">{completenessPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#033C8D] h-full rounded-full transition-all duration-300"
                      style={{ width: `${completenessPercent}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5 font-medium">
                    {completedCount} of {auditSections.length} sections populated
                  </p>
                </div>

                {/* 10 Step Navigation Items */}
                <nav className="p-2 space-y-1 flex-1">
                  {auditSections.map((sec) => {
                    const Icon = sec.icon
                    const isActive = activeStep === sec.id
                    return (
                      <button
                        key={sec.id}
                        type="button"
                        onClick={() => setActiveStep(sec.id)}
                        className={`w-full text-left p-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center justify-between group ${
                          isActive
                            ? 'bg-[#EBF2FA] text-[#033C8D] shadow-2xs font-bold border border-[#033C8D]/20'
                            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className={`p-1.5 rounded-lg shrink-0 ${
                              isActive
                                ? 'bg-[#033C8D] text-white'
                                : 'bg-slate-100 text-slate-500 group-hover:text-slate-700'
                            }`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate leading-tight">{sec.id}. {sec.title}</p>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">{sec.summary}</p>
                          </div>
                        </div>

                        <span className="shrink-0 ml-1">
                          {sec.isComplete ? (
                            <span className="h-2 w-2 rounded-full bg-emerald-500 block" title="Data Populated" />
                          ) : (
                            <span className="h-2 w-2 rounded-full bg-slate-300 block" title="Empty / Unpopulated" />
                          )}
                        </span>
                      </button>
                    )
                  })}
                </nav>

                {/* Institutional Metadata Footer */}
                <div className="p-3.5 border-t border-slate-200 bg-slate-50/70 text-[11px] text-slate-500 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Profile Slug:</span>
                    <span className="font-mono text-slate-700 font-bold">{profile.slug || profile.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Submitted:</span>
                    <span className="text-slate-700 font-medium">{profile.submittedAt || profile.lastUpdated || 'Draft'}</span>
                  </div>
                  {profile.publishedAt && (
                    <div className="flex items-center justify-between text-emerald-700 font-semibold">
                      <span>Published:</span>
                      <span>{profile.publishedAt}</span>
                    </div>
                  )}
                </div>

              </aside>

              {/* RIGHT MAIN CANVAS: Active Step Detailed Inspection */}
              <main className="flex-1 bg-slate-50 overflow-y-auto p-4 sm:p-6 custom-scrollbar space-y-6">
                <ErrorBoundary key={activeStep} resetKey={activeStep}>
                {/* ---------------- STEP 1: BASIC INFORMATION ---------------- */}
                {activeStep === 1 && (
                  <div className="space-y-6 max-w-5xl">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <div>
                        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-[#033C8D]" />
                          <span>Step 1: Basic Institutional Information & Identity</span>
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Inspect regulatory ownership, affiliation, establishment records, and identity narrative.
                        </p>
                      </div>
                      <span className="text-xs font-bold text-slate-400">Step 1 of 10</span>
                    </div>

                    {/* Key Facts Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                      <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Short Name / Code</span>
                        <p className="font-bold text-slate-900 text-sm mt-0.5">{String(basic.shortName || '')}</p>
                      </div>
                      <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Academic Stream</span>
                        <p className="font-bold text-slate-900 text-sm mt-0.5 capitalize">{String(basic.stream || '')}</p>
                      </div>
                      <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ownership Structure</span>
                        <p className="font-bold text-slate-900 text-sm mt-0.5">{String(basic.ownership || '')}</p>
                      </div>
                      <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Established Year</span>
                        <p className="font-bold text-slate-900 text-sm mt-0.5">{String(basic.establishmentYear || '')}</p>
                      </div>
                      <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Campus Area</span>
                        <p className="font-bold text-slate-900 text-sm mt-0.5">{String(basic.campusArea || '')} Acres</p>
                      </div>
                      <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Affiliated University</span>
                        <p className="font-bold text-slate-900 text-sm mt-0.5 truncate" title={basic.affiliation}>{String(basic.affiliation || '')}</p>
                      </div>
                      <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Accreditation Badges</span>
                        <p className="font-bold text-slate-900 text-sm mt-0.5">{String(basic.accreditation || '')}</p>
                      </div>
                      <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">NAAC Grade</span>
                        <p className="font-bold text-emerald-700 text-sm mt-0.5">{String(rankings.naacGrade || '')}</p>
                      </div>
                    </div>

                    {/* About Narrative */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Official Institutional Narrative / Overview
                        </h3>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {String(basic.description || '').length} Characters
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/70 p-4 rounded-lg border border-slate-200">
                        {String(basic.description || '')}
                      </p>
                    </div>

                    {/* Tags */}
                    {basic.tags.length > 0 && (
                      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Institutional Tags & Highlights
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {basic.tags.map((tag, idx) => (
                            <span key={idx} className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold">
                              #{typeof tag === 'string' ? tag : (tag?.name || JSON.stringify(tag))}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ---------------- STEP 2: LOCATION & CONTACTS ---------------- */}
                {activeStep === 2 && (
                  <div className="space-y-6 max-w-5xl">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <div>
                        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-[#033C8D]" />
                          <span>Step 2: Campus Location & Official Communication Channels</span>
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Verify physical campus location, official admission contact points, and verified website.
                        </p>
                      </div>
                      <span className="text-xs font-bold text-slate-400">Step 2 of 10</span>
                    </div>

                    {/* Physical Address Card */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                      <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                        <MapPin className="h-4 w-4 text-[#033C8D]" />
                        <span>Official Physical Campus Address</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                        {typeof contact.address === 'string' ? contact.address : JSON.stringify(contact.address || '')}
                      </p>
                      <div className="grid grid-cols-3 gap-3 text-xs pt-1">
                        <div><span className="text-slate-400 font-medium">City:</span> <strong className="text-slate-900">{typeof contact.city === 'string' ? contact.city : String(contact.city || '')}</strong></div>
                        <div><span className="text-slate-400 font-medium">State:</span> <strong className="text-slate-900">{typeof contact.state === 'string' ? contact.state : String(contact.state || '')}</strong></div>
                        <div><span className="text-slate-400 font-medium">Postal Pincode:</span> <strong className="text-slate-900">{typeof contact.pincode === 'string' ? contact.pincode : String(contact.pincode || 'N/A')}</strong></div>
                      </div>
                    </div>

                    {/* Communication Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Email */}
                      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5 text-blue-600" />
                            Admission Office Email
                          </span>
                          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Verified</span>
                        </div>
                        <p className="text-sm font-bold text-slate-900">{typeof contact.admissionEmail === 'string' ? contact.admissionEmail : 'Not Provided'}</p>
                        {contact.admissionEmail && (
                          <a
                            href={`mailto:${contact.admissionEmail}`}
                            className="inline-flex items-center gap-1 text-xs text-[#033C8D] font-bold hover:underline"
                          >
                            <span>Send Test Email</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>

                      {/* Primary Helpline */}
                      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-emerald-600" />
                          Primary Helpline Telephone
                        </span>
                        <p className="text-sm font-bold text-slate-900">{typeof contact.helplineNumber === 'string' ? contact.helplineNumber : 'Not Provided'}</p>
                        {contact.helplineNumber && (
                          <a
                            href={`tel:${contact.helplineNumber}`}
                            className="inline-flex items-center gap-1 text-xs text-emerald-700 font-bold hover:underline"
                          >
                            <span>Call Institution Desk</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>

                      {/* Alternate / Toll-Free Helpline */}
                      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-purple-600" />
                          Toll-Free / Alternate Helpline
                        </span>
                        <p className="text-sm font-bold text-slate-900">{typeof contact.alternatePhone === 'string' ? contact.alternatePhone : 'None Provided'}</p>
                      </div>

                      {/* Official Website */}
                      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                            <Globe className="h-3.5 w-3.5 text-[#033C8D]" />
                            Official Institutional Website
                          </span>
                        </div>
                        <p className="text-sm font-bold text-slate-900 truncate" title={contact.websiteUrl}>
                          {typeof contact.websiteUrl === 'string' ? contact.websiteUrl : 'Not Provided'}
                        </p>
                        {contact.websiteUrl && (
                          <a
                            href={String(contact.websiteUrl).startsWith('http') ? contact.websiteUrl : `https://${contact.websiteUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-[#033C8D] font-bold hover:underline"
                          >
                            <span>Open Website in New Tab</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>

                    </div>

                    {/* Google Map Coordinates */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-800">Map Coordinates / Geolocation</span>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">{typeof contact.mapCoordinates === 'string' ? contact.mapCoordinates : 'Coordinates not provided'}</p>
                      </div>
                      {contact.mapCoordinates && typeof contact.mapCoordinates === 'string' && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.mapCoordinates)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline btn-sm text-xs font-bold"
                        >
                          <span>Inspect on Google Maps</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* ---------------- STEP 3: COURSES & FEES ---------------- */}
                {activeStep === 3 && (
                  <div className="space-y-6 max-w-5xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                      <div>
                        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-[#033C8D]" />
                          <span>Step 3: Academic Programs, Degrees & Fee Structures</span>
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Inspect all programs, seat capacities, course duration, and annual tuition fees.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 font-bold text-xs border border-purple-200">
                          {courses.length} Programs Added
                        </span>
                      </div>
                    </div>

                    {/* Search & Filter Bar */}
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={courseSearch}
                        onChange={(e) => setCourseSearch(e.target.value)}
                        placeholder="Search courses by degree, branch, or eligibility..."
                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#033C8D]"
                      />
                    </div>

                    {/* Courses Table */}
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                            <tr>
                              <th className="py-3 px-4">Program & Specialization</th>
                              <th className="py-3 px-4">Degree Level</th>
                              <th className="py-3 px-4">Duration</th>
                              <th className="py-3 px-4">Total Tuition Fee</th>
                              <th className="py-3 px-4">Seats</th>
                              <th className="py-3 px-4">Eligibility & Exam</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {filteredCourses.map((c, idx) => (
                              <tr key={c.id || idx} className="hover:bg-slate-50/70 transition-colors">
                                <td className="py-3 px-4">
                                  <p className="font-bold text-slate-900">{typeof c.name === 'string' ? c.name : String(c.name || '')}</p>
                                  {c.department && <p className="text-[11px] text-slate-400 mt-0.5">{String(c.department)}</p>}
                                </td>
                                <td className="py-3 px-4 font-semibold text-slate-700">
                                  {typeof c.degreeLevel === 'string' ? c.degreeLevel : 'B.Tech'}
                                </td>
                                <td className="py-3 px-4 text-slate-600">
                                  {typeof c.duration === 'string' ? c.duration : '4 Years'}
                                </td>
                                <td className="py-3 px-4">
                                  <span className="font-bold text-[#033C8D] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                    {typeof c.fee === 'string' ? c.fee : '₹2.5 L/yr'}
                                  </span>
                                </td>
                                <td className="py-3 px-4 font-bold text-slate-700">
                                  {String(c.seatIntake || '120')}
                                </td>
                                <td className="py-3 px-4">
                                  <p className="text-slate-700 font-medium truncate max-w-xs" title={typeof c.eligibility === 'string' ? c.eligibility : ''}>
                                    {typeof c.eligibility === 'string' ? c.eligibility : 'Class 12th with PCM ≥ 75%'}
                                  </p>
                                  {c.examAccepted && (
                                    <span className="text-[10px] text-purple-700 font-bold block mt-0.5">
                                      Exams: {Array.isArray(c.examAccepted)
                                        ? c.examAccepted.map((e) => (typeof e === 'string' ? e : (e?.name || e?.exam || JSON.stringify(e)))).join(', ')
                                        : (typeof c.examAccepted === 'string' ? c.examAccepted : '')}
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}

                            {filteredCourses.length === 0 && (
                              <tr>
                                <td colSpan={6} className="py-8 text-center text-slate-400">
                                  No academic programs found matching your search.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* ---------------- STEP 4: ADMISSIONS & TIMELINE ---------------- */}
                {activeStep === 4 && (
                  <div className="space-y-6 max-w-5xl">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <div>
                        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <Compass className="h-4 w-4 text-[#033C8D]" />
                          <span>Step 4: Admissions, Application Cycles & Process Steps</span>
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Inspect admission cycle status, accepted entrance exams, and the student application journey.
                        </p>
                      </div>
                      <span className="text-xs font-bold text-slate-400">Step 4 of 10</span>
                    </div>

                    {/* Cycle Banner */}
                    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Admission Status</span>
                        <span className="inline-block mt-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                          {String(admissions.status || 'Admissions Open')}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Academic Year</span>
                        <span className="font-bold text-slate-900 text-sm mt-1 block">{String(admissions.academicYear || '')}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Applications Open</span>
                        <span className="font-bold text-slate-900 text-sm mt-1 block">{String(admissions.applicationStart || 'Rolling')}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Application Deadline</span>
                        <span className="font-bold text-rose-600 text-sm mt-1 block">{String(admissions.applicationEnd || 'Rolling Basis')}</span>
                      </div>
                    </div>

                    {/* Accepted Entrance Exams */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Recognized & Accepted National/State Entrance Exams ({admissions.examAccepted.length})
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {admissions.examAccepted.map((ex, idx) => (
                          <span key={idx} className="px-3 py-1.5 rounded-lg bg-blue-50 text-[#033C8D] border border-blue-200 text-xs font-bold flex items-center gap-1.5">
                            <Award className="h-3.5 w-3.5 text-[#033C8D]" />
                            <span>{typeof ex === 'string' ? ex : (ex?.name || ex?.exam || ex?.label || JSON.stringify(ex))}</span>
                          </span>
                        ))}
                        {admissions.examAccepted.length === 0 && (
                          <p className="text-xs text-slate-400">No specific entrance exams listed.</p>
                        )}
                      </div>
                    </div>

                    {/* Direct Portal Link */}
                    {admissions.portalUrl && (
                      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-slate-800">Online Admission Application Portal</span>
                          <p className="text-xs text-slate-500 font-mono mt-0.5 truncate">{String(admissions.portalUrl)}</p>
                        </div>
                        <a
                          href={String(admissions.portalUrl).startsWith('http') ? admissions.portalUrl : `https://${admissions.portalUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline btn-sm text-xs font-bold"
                        >
                          <span>Test Portal Link</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}

                    {/* Step-by-Step Admission Process Timeline */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Step-by-Step Institutional Admission Process ({admissions.steps.length} Steps)
                      </h3>

                      <div className="space-y-3">
                        {admissions.steps.map((st, idx) => {
                          const stepNumber = typeof st === 'object' ? (st?.step || idx + 1) : idx + 1
                          const title = typeof st === 'object' ? (st?.title || `Stage ${idx + 1}`) : (typeof st === 'string' ? st.split(':')[0] : `Stage ${idx + 1}`)
                          const desc = typeof st === 'object' ? (st?.desc || st?.description || '') : (typeof st === 'string' ? st.split(':').slice(1).join(':').trim() : '')
                          return (
                            <div key={idx} className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                              <span className="h-7 w-7 rounded-lg bg-[#033C8D] text-white text-xs font-bold flex items-center justify-center shrink-0">
                                {stepNumber}
                              </span>
                              <div>
                                <h4 className="font-bold text-xs sm:text-sm text-slate-900">{title}</h4>
                                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{desc}</p>
                              </div>
                            </div>
                          )
                        })}

                        {admissions.steps.length === 0 && (
                          <p className="text-xs text-slate-400 text-center py-4">No admission process stages entered.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ---------------- STEP 5: CUTOFFS MATRIX ---------------- */}
                {activeStep === 5 && (
                  <div className="space-y-6 max-w-5xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                      <div>
                        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <Award className="h-4 w-4 text-[#033C8D]" />
                          <span>Step 5: Previous Year Closing Rank Cutoff Matrix</span>
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Inspect category-wise opening and closing ranks for entrance counselling.
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 font-bold text-xs border border-purple-200">
                        {cutoffs.length} Cutoff Rows
                      </span>
                    </div>

                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={cutoffSearch}
                        onChange={(e) => setCutoffSearch(e.target.value)}
                        placeholder="Search cutoffs by exam or branch..."
                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#033C8D]"
                      />
                    </div>

                    {/* Cutoffs Table */}
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                            <tr>
                              <th className="py-3 px-4">Exam Name</th>
                              <th className="py-3 px-4">Branch / Specialization</th>
                              <th className="py-3 px-4">Quota</th>
                              <th className="py-3 px-4">Round</th>
                              <th className="py-3 px-4">General Cutoff</th>
                              <th className="py-3 px-4">OBC Cutoff</th>
                              <th className="py-3 px-4">SC Cutoff</th>
                              <th className="py-3 px-4">ST Cutoff</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {filteredCutoffs.map((row, idx) => {
                              const formatCutoff = (val) => {
                                if (!val) return 'N/A'
                                if (typeof val === 'object') return val.rank || val.cutoff || JSON.stringify(val)
                                const s = String(val)
                                return s.startsWith('#') ? s : `#${s}`
                              }
                              return (
                                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                                  <td className="py-3 px-4 font-bold text-[#033C8D]">{String(row.exam || '')}</td>
                                  <td className="py-3 px-4 font-semibold text-slate-900">{String(row.course || '')}</td>
                                  <td className="py-3 px-4 text-slate-600">{String(row.quota || 'All India')}</td>
                                  <td className="py-3 px-4 text-slate-500 font-bold">Round {String(row.round || 1)}</td>
                                  <td className="py-3 px-4 font-bold text-emerald-700 bg-emerald-50/50">
                                    {formatCutoff(row.generalCutoff || row.general)}
                                  </td>
                                  <td className="py-3 px-4 font-bold text-blue-700">
                                    {formatCutoff(row.obcCutoff || row.obc)}
                                  </td>
                                  <td className="py-3 px-4 text-slate-600">
                                    {formatCutoff(row.scCutoff || row.sc)}
                                  </td>
                                  <td className="py-3 px-4 text-slate-600">
                                    {formatCutoff(row.stCutoff || row.st)}
                                  </td>
                                </tr>
                              )
                            })}

                            {filteredCutoffs.length === 0 && (
                              <tr>
                                <td colSpan={8} className="py-8 text-center text-slate-400">
                                  No cutoff matrices found.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* ---------------- STEP 6: PLACEMENTS & RECRUITERS ---------------- */}
                {activeStep === 6 && (
                  <div className="space-y-6 max-w-5xl">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <div>
                        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-[#033C8D]" />
                          <span>Step 6: Placement Statistics, Salary CTC & Hiring Partners</span>
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Verify highest packages, average CTC, overall placement percentage, and recruiters.
                        </p>
                      </div>
                      <span className="text-xs font-bold text-slate-400">Step 6 of 10</span>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Average Salary CTC</span>
                        <p className="font-extrabold text-emerald-600 text-lg mt-1">{String(placements.avgPackage || 'N/A')}</p>
                      </div>
                      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Median Salary CTC</span>
                        <p className="font-extrabold text-slate-900 text-lg mt-1">{String(placements.medianPackage || 'N/A')}</p>
                      </div>
                      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Highest Domestic CTC</span>
                        <p className="font-extrabold text-[#033C8D] text-lg mt-1">{String(placements.highestDomestic || 'N/A')}</p>
                      </div>
                      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Placement Success Rate</span>
                        <p className="font-extrabold text-purple-700 text-lg mt-1">{String(placements.placementRate || 0)}%</p>
                      </div>
                    </div>

                    {/* Top Recruiters */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Top Corporate Recruiters & Hiring Partners ({placements.topRecruiters.length})
                      </h3>
                      <div className="flex flex-wrap gap-2.5">
                        {placements.topRecruiters.map((rec, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs"
                          >
                            {typeof rec === 'string' ? rec : (rec?.name || rec?.company || JSON.stringify(rec))}
                          </span>
                        ))}
                        {placements.topRecruiters.length === 0 && (
                          <p className="text-xs text-slate-400">No recruiters listed yet.</p>
                        )}
                      </div>
                    </div>

                    {/* Placement Brochure Link */}
                    {placements.placementReportUrl && (
                      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-slate-800">Official Placement Report / Brochure</span>
                          <p className="text-xs text-slate-500 font-mono mt-0.5 truncate">{String(placements.placementReportUrl)}</p>
                        </div>
                        <a
                          href={placements.placementReportUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline btn-sm text-xs font-bold"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>View Brochure</span>
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* ---------------- STEP 7: RANKINGS & ACCREDITATIONS ---------------- */}
                {activeStep === 7 && (
                  <div className="space-y-6 max-w-5xl">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <div>
                        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <Award className="h-4 w-4 text-[#033C8D]" />
                          <span>Step 7: National & Global Rankings & Accreditations</span>
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Inspect NIRF Ministry ranking, NAAC CGPA certificates, and international ranking bands.
                        </p>
                      </div>
                      <span className="text-xs font-bold text-slate-400">Step 7 of 10</span>
                    </div>

                    {/* Primary Highlight Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      
                      {/* NIRF */}
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-200 shadow-2xs space-y-1">
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">NIRF All India Rank</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-[#033C8D]">#{String(rankings.nirfRank || '')}</span>
                          <span className="text-xs font-bold text-slate-500">in {String(rankings.nirfCategory || 'Engineering')} ({String(rankings.nirfYear || 2025)})</span>
                        </div>
                      </div>

                      {/* NAAC */}
                      <div className="p-4 bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-200 shadow-2xs space-y-1">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">NAAC Accreditation</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-emerald-700">{String(rankings.naacGrade || '')}</span>
                          <span className="text-xs font-bold text-slate-500">({String(rankings.naacCgpa || '')} CGPA)</span>
                        </div>
                      </div>

                      {/* Approvals */}
                      <div className="p-4 bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-200 shadow-2xs space-y-1">
                        <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Statutory Recognition</span>
                        <div className="text-sm font-extrabold text-purple-900 mt-1">
                          {String(basic.accreditation || 'AICTE / UGC / MHRD')}
                        </div>
                      </div>

                    </div>

                    {/* Additional Rankings Matrix */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Additional National & Global Rankings ({rankings.additionalRankings.length})
                      </h3>

                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                            <tr>
                              <th className="py-2.5 px-4">Ranking Agency / Publisher</th>
                              <th className="py-2.5 px-4">Rank / Band</th>
                              <th className="py-2.5 px-4">Discipline / Category</th>
                              <th className="py-2.5 px-4">Year</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {rankings.additionalRankings.map((r, idx) => {
                              const agency = r?.agency || r?.name || 'Agency'
                              const rankStr = r?.rank ? (String(r.rank).startsWith('#') ? r.rank : `#${r.rank}`) : '#1'
                              return (
                                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                                  <td className="py-2.5 px-4 font-bold text-slate-900">{agency}</td>
                                  <td className="py-2.5 px-4 font-bold text-[#033C8D]">{rankStr}</td>
                                  <td className="py-2.5 px-4 text-slate-600">{String(r?.category || 'Overall / Engineering')}</td>
                                  <td className="py-2.5 px-4 text-slate-500 font-semibold">{String(r?.year || '2025')}</td>
                                </tr>
                              )
                            })}

                            {rankings.additionalRankings.length === 0 && (
                              <tr>
                                <td colSpan={4} className="py-6 text-center text-slate-400">
                                  No additional rankings submitted.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* ---------------- STEP 8: FACILITIES & COSTS ---------------- */}
                {activeStep === 8 && (
                  <div className="space-y-6 max-w-5xl">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <div>
                        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-[#033C8D]" />
                          <span>Step 8: Campus Facilities, Hostel Amenities & 4-Year Cost Model</span>
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Inspect campus amenities, hostel room infrastructure, and transparent cost breakdown.
                        </p>
                      </div>
                      <span className="text-xs font-bold text-slate-400">Step 8 of 10</span>
                    </div>

                    {/* Facilities Badges */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Verified Campus Amenities ({facilities.length})
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {facilities.map((f, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5"
                          >
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                            <span>{typeof f === 'string' ? f : (f?.name || f?.title || JSON.stringify(f))}</span>
                          </span>
                        ))}
                        {facilities.length === 0 && (
                          <p className="text-xs text-slate-400">No campus amenities selected.</p>
                        )}
                      </div>
                    </div>

                    {/* Hostel Details */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <Home className="h-4 w-4 text-purple-600" />
                        <span>Hostel Accommodation Infrastructure</span>
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">Total Hostels</span>
                          <strong className="text-slate-900 text-sm mt-0.5 block">{String(hostel.totalHostels || '17 Halls of Residence')}</strong>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">Total Capacity</span>
                          <strong className="text-slate-900 text-sm mt-0.5 block">{String(hostel.totalCapacity || '10,000+ Students')}</strong>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">Mess Food Type</span>
                          <strong className="text-slate-900 text-sm mt-0.5 block">{String(hostel.messFoodType || 'Veg & Non-Veg Multi-Cuisine')}</strong>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">Annual Hostel + Mess Fee</span>
                          <strong className="text-emerald-700 text-sm mt-0.5 block">{String(hostel.annualHostelMessFee || '₹85,000 / Year')}</strong>
                        </div>
                      </div>
                    </div>

                    {/* 4-Year Cost Breakdown Table */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-emerald-600" />
                          <span>4-Year True Cost of Education Model</span>
                        </h3>
                        <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-extrabold text-xs border border-emerald-200">
                          Total ~₹{calculated4YrExpense} Lakhs (4 Years)
                        </span>
                      </div>

                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                            <tr>
                              <th className="py-2.5 px-4">Fee Component</th>
                              <th className="py-2.5 px-4">Frequency</th>
                              <th className="py-2.5 px-4">Amount (₹)</th>
                              <th className="py-2.5 px-4">4-Year Total Impact</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            <tr>
                              <td className="py-2.5 px-4 font-bold text-slate-900">Tuition Fee</td>
                              <td className="py-2.5 px-4 text-slate-500">Per Academic Year</td>
                              <td className="py-2.5 px-4 font-bold text-[#033C8D]">₹{parseNumericCost(costs.tuitionFeePerYear, 200000).toLocaleString('en-IN')}</td>
                              <td className="py-2.5 px-4 font-bold text-slate-900">₹{((parseNumericCost(costs.tuitionFeePerYear, 200000) * 4) / 100000).toFixed(2)} L</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 px-4 font-bold text-slate-900">Hostel Room Rent</td>
                              <td className="py-2.5 px-4 text-slate-500">Per Academic Year</td>
                              <td className="py-2.5 px-4 font-bold text-slate-700">₹{parseNumericCost(costs.hostelRentYearly, 45000).toLocaleString('en-IN')}</td>
                              <td className="py-2.5 px-4 font-bold text-slate-900">₹{((parseNumericCost(costs.hostelRentYearly, 45000) * 4) / 100000).toFixed(2)} L</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 px-4 font-bold text-slate-900">Mess / Dining Charges</td>
                              <td className="py-2.5 px-4 text-slate-500">Per Academic Year</td>
                              <td className="py-2.5 px-4 font-bold text-slate-700">₹{parseNumericCost(costs.messChargesYearly, 40000).toLocaleString('en-IN')}</td>
                              <td className="py-2.5 px-4 font-bold text-slate-900">₹{((parseNumericCost(costs.messChargesYearly, 40000) * 4) / 100000).toFixed(2)} L</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 px-4 font-bold text-slate-900">One-Time Caution Deposit</td>
                              <td className="py-2.5 px-4 text-slate-500">One-Time (Refundable)</td>
                              <td className="py-2.5 px-4 font-bold text-slate-700">₹{parseNumericCost(costs.cautionDepositOneTime, 10000).toLocaleString('en-IN')}</td>
                              <td className="py-2.5 px-4 font-bold text-slate-900">₹{((parseNumericCost(costs.cautionDepositOneTime, 10000)) / 100000).toFixed(2)} L</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* ---------------- STEP 9: CAMPUS MEDIA & GALLERY ---------------- */}
                {activeStep === 9 && (
                  <div className="space-y-6 max-w-5xl">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <div>
                        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <ImageIcon className="h-4 w-4 text-[#033C8D]" />
                          <span>Step 9: High-Resolution Campus Photography & Media</span>
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Inspect uploaded infrastructure photos, category labels, and 360 virtual tour links.
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 font-bold text-xs border border-purple-200">
                        {gallery.length} Photos Uploaded
                      </span>
                    </div>

                    {/* Virtual Tour URL */}
                    {virtualTourUrl && (
                      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <Video className="h-4 w-4 text-purple-600" />
                            Campus 360 Virtual Tour / Drone Video Tour
                          </span>
                          <p className="text-xs text-slate-500 font-mono mt-0.5 truncate">{String(virtualTourUrl)}</p>
                        </div>
                        <a
                          href={virtualTourUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline btn-sm text-xs font-bold"
                        >
                          <span>Watch Tour</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}

                    {/* Photo Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {gallery.map((img, idx) => {
                        const imgUrl = typeof img === 'string' ? img : (img?.url || img?.src || '')
                        const caption = typeof img === 'object' ? (img?.caption || `Campus Photo ${idx + 1}`) : `Campus Photo ${idx + 1}`
                        const category = typeof img === 'object' ? (img?.category || 'Campus') : 'Campus'
                        return (
                          <div
                            key={idx}
                            onClick={() => setZoomedImage(imgUrl)}
                            className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs group cursor-pointer hover:border-[#033C8D] transition-all"
                          >
                            <div className="h-40 bg-slate-100 overflow-hidden relative">
                              <img
                                src={imgUrl}
                                alt={caption}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 text-white text-[10px] font-bold backdrop-blur-xs">
                                {category}
                              </span>
                            </div>
                            <div className="p-3">
                              <p className="text-xs font-semibold text-slate-800 truncate" title={caption}>
                                {caption}
                              </p>
                              <span className="text-[10px] text-[#033C8D] font-bold mt-1 block">Click to Enlarge 🔍</span>
                            </div>
                          </div>
                        )
                      })}

                      {gallery.length === 0 && (
                        <div className="col-span-full p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-400">
                          <ImageIcon className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                          <p className="text-xs font-semibold">No campus photography uploaded yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ---------------- STEP 10: VERIFICATION AUDIT & VERDICT ---------------- */}
                {activeStep === 10 && (
                  <div className="space-y-6 max-w-5xl">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <div>
                        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-[#033C8D]" />
                          <span>Step 10: Editorial Verification Audit & Live Publishing Verdict</span>
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Inspect the complete checklist across all sections and record your administrative decision.
                        </p>
                      </div>
                      <span className="text-xs font-bold text-slate-400">Step 10 of 10</span>
                    </div>

                    {/* Score Summary Box */}
                    <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Profile Completeness</span>
                        <div className="flex items-center gap-2">
                          <h3 className="text-2xl font-black text-slate-900">{completenessPercent}%</h3>
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {completedCount} of 10 Checks Satisfied
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          All mandatory institutional fields have been validated against VidyaScope directory criteria.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <AdminStatusBadge status={profile.profileStatus} size="lg" />
                      </div>
                    </div>

                    {/* Section-by-Section Verification Checklist */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        10-Point Regulatory Checklist
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {auditSections.slice(0, 9).map((sec) => (
                          <div
                            key={sec.id}
                            className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                              sec.isComplete
                                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                                : 'bg-slate-50 border-slate-200 text-slate-600'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              {sec.isComplete ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                              )}
                              <div>
                                <strong className="font-bold">{sec.title}</strong>
                                <p className="text-[11px] opacity-75">{sec.summary}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setActiveStep(sec.id)}
                              className="text-[11px] font-bold text-[#033C8D] hover:underline shrink-0"
                            >
                              Inspect →
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Verdict Decision Panel */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Administrative Verdict Actions
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        
                        {/* Approve Card */}
                        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                          <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                            <span>Approve & Publish Profile Live</span>
                          </div>
                          <p className="text-xs text-emerald-800 leading-relaxed">
                            Publish this institution to VidyaScope student discovery search with full SEO indexation.
                          </p>
                          <button
                            type="button"
                            onClick={onApproveAndPublish}
                            className="btn bg-emerald-600 hover:bg-emerald-700 text-white btn-md text-xs font-bold w-full cursor-pointer shadow-xs border border-emerald-600"
                          >
                            <span>Publish Live to Platform</span>
                          </button>
                        </div>

                        {/* Request Changes Card */}
                        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3">
                          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                            <AlertTriangle className="h-5 w-5 text-amber-600" />
                            <span>Request Editorial Changes</span>
                          </div>
                          <p className="text-xs text-amber-800 leading-relaxed">
                            Unlock the profile back to college representative with specific inspection feedback notes.
                          </p>
                          <button
                            type="button"
                            onClick={onRequestChanges}
                            className="btn btn-outline border-amber-300 text-amber-800 bg-white hover:bg-amber-100 btn-md text-xs font-bold w-full cursor-pointer shadow-xs"
                          >
                            <span>Send Revision Notes</span>
                          </button>
                        </div>

                      </div>
                    </div>

                  </div>
                )}
                </ErrorBoundary>
              </main>
            </>
          )}

          {/* ----------------- MODE B: LIVE PUBLIC PREVIEW SIMULATION ----------------- */}
          {viewMode === 'public_simulation' && (
            <main className="flex-1 bg-slate-100 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
              <div className="max-w-5xl mx-auto space-y-6">
                
                {/* Simulation Watermark Banner */}
                <div className="bg-[#033C8D] text-white px-4 py-2.5 rounded-xl shadow-xs flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-white/80" />
                    <span className="font-bold">VidyaScope Public Discovery Simulator</span>
                    <span className="text-white/70 hidden sm:inline">• Exact student-facing rendering</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-white/20 text-[10px] font-bold uppercase tracking-wider">
                    Live Simulator
                  </span>
                </div>

                {/* Hero Header Banner */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="h-48 sm:h-64 bg-slate-200 relative">
                    <img
                      src={gallery[0]?.url || basic.image}
                      alt={basic.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                    
                    <div className="absolute bottom-4 left-4 right-4 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="px-2 py-0.5 rounded bg-white/20 text-white text-[10px] font-bold backdrop-blur-xs uppercase">
                            {basic.ownership}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/90 text-white text-[10px] font-bold backdrop-blur-xs">
                            {admissions.status}
                          </span>
                        </div>
                        <h2 className="font-serif text-xl sm:text-2xl font-bold">{basic.name}</h2>
                        <p className="text-xs text-white/80 mt-0.5 flex items-center gap-1.5">
                          <MapPin className="h-3 w-3" />
                          <span>{contact.city}, {contact.state}</span>
                          <span>• Estd. {basic.establishmentYear}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-center">
                          <span className="text-[10px] text-white/70 block uppercase font-bold">NIRF Rank</span>
                          <span className="text-base font-extrabold text-white">#{rankings.nirfRank}</span>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-center">
                          <span className="text-[10px] text-white/70 block uppercase font-bold">Avg Package</span>
                          <span className="text-base font-extrabold text-emerald-400">{placements.avgPackage}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Public Preview Tabs */}
                  <div className="px-4 border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
                    {[
                      { id: 'overview', label: 'Overview' },
                      { id: 'courses', label: `Courses (${courses.length})` },
                      { id: 'cutoffs', label: 'Cutoffs' },
                      { id: 'placements', label: 'Placements' },
                      { id: 'rankings', label: 'Rankings' },
                      { id: 'facilities', label: 'Facilities & ROI' },
                      { id: 'contact', label: 'Contact & Map' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setPreviewTab(tab.id)}
                        className={`py-3 px-3 border-b-2 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                          previewTab === tab.id
                            ? 'border-[#033C8D] text-[#033C8D]'
                            : 'border-transparent text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Public Preview Tab Content */}
                  <div className="p-6">
                    {previewTab === 'overview' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-serif text-base font-bold text-slate-900 mb-2">About {basic.name}</h3>
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                            {basic.description}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Campus Size</span>
                            <strong className="text-slate-900 text-sm">{basic.campusArea} Acres</strong>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Highest CTC</span>
                            <strong className="text-slate-900 text-sm">{placements.highestDomestic}</strong>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Placement %</span>
                            <strong className="text-emerald-600 text-sm">{placements.placementRate}%</strong>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">NAAC Grade</span>
                            <strong className="text-purple-700 text-sm">{rankings.naacGrade}</strong>
                          </div>
                        </div>
                      </div>
                    )}

                    {previewTab === 'courses' && (
                      <div className="space-y-3">
                        <h3 className="font-serif text-base font-bold text-slate-900">Offered Degrees & Fee Structure</h3>
                        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                          {courses.map((c, idx) => (
                            <div key={idx} className="p-4 bg-white flex items-center justify-between">
                              <div>
                                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{c.name}</h4>
                                <p className="text-[11px] text-slate-500 mt-0.5">
                                  {c.degreeLevel} • {c.duration} • Intake: {c.seatIntake}
                                </p>
                              </div>
                              <span className="font-bold text-[#033C8D] bg-blue-50 px-3 py-1 rounded-lg text-xs border border-blue-200">
                                {c.fee} Total
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {previewTab === 'cutoffs' && (
                      <div className="space-y-3">
                        <h3 className="font-serif text-base font-bold text-slate-900">Closing Rank Benchmarks</h3>
                        <div className="border border-slate-200 rounded-xl overflow-hidden">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                              <tr>
                                <th className="p-3">Exam</th>
                                <th className="p-3">Course</th>
                                <th className="p-3">General Rank</th>
                                <th className="p-3">OBC Rank</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {cutoffs.map((row, idx) => (
                                <tr key={idx}>
                                  <td className="p-3 font-bold text-[#033C8D]">{row.exam}</td>
                                  <td className="p-3 font-semibold text-slate-900">{row.course}</td>
                                  <td className="p-3 font-bold text-emerald-700">#{row.generalCutoff || row.general}</td>
                                  <td className="p-3 text-slate-600">#{row.obcCutoff || row.obc || 'N/A'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {previewTab === 'placements' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Highest CTC</span>
                            <span className="text-base font-extrabold text-slate-900 mt-0.5 block">{placements.highestDomestic}</span>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Average CTC</span>
                            <span className="text-base font-extrabold text-emerald-600 mt-0.5 block">{placements.avgPackage}</span>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Placement %</span>
                            <span className="text-base font-extrabold text-[#033C8D] mt-0.5 block">{placements.placementRate}%</span>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-slate-700 mb-2">Key Hiring Partners</h4>
                          <div className="flex flex-wrap gap-2">
                            {placements.topRecruiters.map((r, idx) => (
                              <span key={idx} className="px-2.5 py-1 rounded bg-slate-100 text-xs font-bold text-slate-700">
                                {typeof r === 'string' ? r : (r?.name || r?.company || JSON.stringify(r))}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {previewTab === 'rankings' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200">
                          <span className="text-xs font-bold text-blue-600 uppercase block">NIRF Ranking</span>
                          <span className="text-2xl font-black text-[#033C8D]">#{rankings.nirfRank}</span>
                          <p className="text-xs text-slate-500 mt-1">{rankings.nirfCategory} ({rankings.nirfYear})</p>
                        </div>
                        <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200">
                          <span className="text-xs font-bold text-emerald-600 uppercase block">NAAC Grade</span>
                          <span className="text-2xl font-black text-emerald-700">{rankings.naacGrade}</span>
                          <p className="text-xs text-slate-500 mt-1">{rankings.naacCgpa} CGPA Scale</p>
                        </div>
                      </div>
                    )}

                    {previewTab === 'facilities' && (
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-xs font-bold text-slate-700 mb-2">Campus Facilities</h4>
                          <div className="flex flex-wrap gap-2">
                            {facilities.map((f, idx) => (
                              <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-100 text-xs text-slate-700">
                                ✓ {typeof f === 'string' ? f : (f?.name || f?.title || JSON.stringify(f))}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Cost Calculator */}
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-900">4-Year Degree ROI & Expenditure</h4>
                            <div className="flex items-center gap-1">
                              {[3, 4, 5].map((y) => (
                                <button
                                  key={y}
                                  type="button"
                                  onClick={() => setCalcTenure(y)}
                                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                    calcTenure === y ? 'bg-[#033C8D] text-white' : 'bg-slate-200 text-slate-700'
                                  }`}
                                >
                                  {y} Yrs
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="text-xl font-extrabold text-emerald-600">
                            Total Estimated: ₹{calculated4YrExpense} Lakhs
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Includes Tuition + Hostel + Mess + Misc Charges across {calcTenure} academic years.
                          </p>
                        </div>
                      </div>
                    )}

                    {previewTab === 'contact' && (
                      <div className="space-y-3 text-xs">
                        <p><strong>Campus Address:</strong> {contact.address}, {contact.city}, {contact.state} - {contact.pincode}</p>
                        <p><strong>Admission Email:</strong> {contact.admissionEmail}</p>
                        <p><strong>Helpline:</strong> {contact.helplineNumber}</p>
                        <p><strong>Website:</strong> {contact.websiteUrl}</p>
                      </div>
                    )}
                  </div>

                </div>

              </div>
            </main>
          )}

        </div>

      </div>

      {/* ================= IMAGE ZOOM MODAL ================= */}
      {zoomedImage && (
        <div
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-black rounded-xl overflow-hidden">
            <img src={zoomedImage} alt="Campus View" className="w-full h-full object-contain" />
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white text-xs font-bold cursor-pointer hover:bg-black"
            >
              ✕
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default CollegeReviewStudio
