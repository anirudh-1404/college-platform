import React, { useState, useMemo } from 'react'
import {
  Users,
  FileText,
  TrendingUp,
  Mail,
  ChevronRight,
  ArrowRight,
  MoreVertical,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  GraduationCap,
  Building2,
  Sliders,
  Send,
  AlertCircle,
  CheckCircle,
  Eye,
  Activity,
  Globe,
  Laptop,
  Smartphone,
  Tablet,
  Radio,
} from 'lucide-react'
import AdminStatusBadge from '../components/common/AdminStatusBadge'

// Reusable collegiate emblem / crest for institutions (Dynamic 1-2 letter initial & theme)
const CollegeCrest = ({ name = '', logoUrl }) => {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={name}
        className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-2xs flex-shrink-0"
      />
    )
  }

  // Generate clean 1-2 letter initials from college name dynamically
  const words = (name || '').trim().split(/\s+/).filter(Boolean)
  let initials = 'CL'
  if (words.length >= 2) {
    initials = (words[0][0] + words[1][0]).toUpperCase()
  } else if (words.length === 1) {
    initials = words[0].slice(0, 2).toUpperCase()
  }

  // Deterministic color styling based on college name hash
  const colorSchemes = [
    'bg-[#EBF2FA] text-[#033C8D] border-[#033C8D]/25',
    'bg-indigo-50 text-indigo-700 border-indigo-200',
    'bg-sky-50 text-sky-700 border-sky-200',
    'bg-blue-50 text-blue-700 border-blue-200',
    'bg-emerald-50 text-emerald-700 border-emerald-200',
    'bg-amber-50 text-amber-700 border-amber-200',
  ]
  let hash = 0
  for (let i = 0; i < (name || '').length; i++) {
    hash = (name || '').charCodeAt(i) + ((hash << 5) - hash)
  }
  const scheme = colorSchemes[Math.abs(hash) % colorSchemes.length]

  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-xs tracking-wider border shadow-2xs flex-shrink-0 select-none ${scheme}`}
      title={name}
    >
      {initials}
    </div>
  )
}

const AdminOverviewPage = ({
  analytics = {},
  trafficData = {},
  registrations = [],
  pendingRegistrations = [],
  profiles = [],
  auditLogs = [],
  onNavigate,
  onInspectRegistration,
  onInspectProfile,
}) => {
  const [activeAttentionTab, setActiveAttentionTab] = useState('all')

  // Dynamic greeting based on current local hour
  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning, Admin 👋'
    if (hour < 17) return 'Good afternoon, Admin 👋'
    return 'Good evening, Admin 👋'
  }, [])

  // Dynamic formatted date
  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }, [])

  // Operational metrics values (strictly dynamic from backend data)
  const pendingRegCount = pendingRegistrations.length || analytics.pendingRegistrations || 0
  const underReviewCount = profiles.filter(p => p.profileStatus === 'under_review').length || analytics.underReviewProfiles || 0
  const publishedCount = profiles.filter(p => p.profileStatus === 'published').length || analytics.publishedProfiles || 0
  const inquiriesCount = analytics.newInquiries ?? analytics.totalInquiries ?? 0

  // Live Website Traffic & Analytics Metrics
  const totalWebsiteViews = trafficData.totalViews || analytics.totalViews || 0
  const todayWebsiteViews = trafficData.todayViews || analytics.todayViews || 0
  const uniqueVisitorsCount = trafficData.uniqueVisitors || 0
  const todayUniqueVisitorsCount = trafficData.todayUniqueVisitors || 0
  const topCollegesList = useMemo(() => {
    if (trafficData.topColleges && trafficData.topColleges.length > 0) {
      return trafficData.topColleges
    }
    return profiles
      .filter((p) => p.profileStatus === 'published')
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 8)
      .map((c) => ({
        id: c.slug || c._id,
        name: c.name,
        shortName: c.shortName || c.name,
        slug: c.slug,
        stream: c.stream,
        location: c.locationContact?.city ? `${c.locationContact.city}, ${c.locationContact.state || ''}` : 'India',
        nirfRank: c.rankings?.nirfRank || null,
        views: c.views || 0,
      }))
  }, [trafficData.topColleges, profiles])

  const recentVisitorsList = trafficData.recentVisitors || []
  const maxViews = useMemo(() => {
    const counts = topCollegesList.map((c) => c.views || 0)
    return Math.max(...counts, 1)
  }, [topCollegesList])

  // Status counts for right-side widget (strictly dynamic from profiles / analytics)
  const statusBreakdown = useMemo(() => {
    const published = profiles.filter(p => p.profileStatus === 'published').length || analytics.publishedProfiles || 0
    const underReview = profiles.filter(p => p.profileStatus === 'under_review').length || analytics.underReviewProfiles || 0
    const changesReq = profiles.filter(p => p.profileStatus === 'changes_requested').length || analytics.changesRequestedProfiles || 0
    const draft = profiles.filter(p => p.profileStatus === 'draft').length || 0
    const rejected = profiles.filter(p => p.profileStatus === 'rejected').length || 0

    return [
      { label: 'Published', count: published, dotColor: 'bg-emerald-500', statusKey: 'published' },
      { label: 'Under Review', count: underReview, dotColor: 'bg-[#033C8D]', statusKey: 'under_review' },
      { label: 'Changes Requested', count: changesReq, dotColor: 'bg-orange-500', statusKey: 'changes_requested' },
      { label: 'Draft', count: draft, dotColor: 'bg-slate-400', statusKey: 'draft' },
      { label: 'Rejected', count: rejected, dotColor: 'bg-rose-500', statusKey: 'rejected' },
    ]
  }, [profiles, analytics])

  // Build the "Needs Your Attention" items list (100% dynamic from real backend data)
  const attentionItems = useMemo(() => {
    const list = []

    // 1. Real pending registrations from backend
    pendingRegistrations.forEach((reg) => {
      list.push({
        id: `reg-${reg.id || reg._id}`,
        category: 'registrations',
        name: reg.collegeName,
        eventDescription: 'New registration request',
        timestamp: reg.registeredAt
          ? new Date(reg.registeredAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
          : 'Submitted recently',
        status: 'pending_verification',
        actionLabel: 'Review →',
        onAction: () => onInspectRegistration ? onInspectRegistration(reg) : onNavigate('registrations'),
        rawItem: reg,
      })
    })

    // 2. Real submitted profiles awaiting review or updated
    profiles
      .filter(p => p.profileStatus === 'under_review' || p.profileStatus === 'changes_requested')
      .forEach((p) => {
        list.push({
          id: `prof-${p.id || p._id || p.slug}`,
          category: 'profiles',
          name: p.name,
          eventDescription: p.profileStatus === 'changes_requested'
            ? 'Profile updated after changes requested'
            : 'Profile submitted for review',
          timestamp: p.updatedAt
            ? new Date(p.updatedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
            : 'Submitted recently',
          status: p.profileStatus === 'changes_requested' ? 'ready_for_review' : 'under_review',
          actionLabel: 'Review →',
          onAction: () => onInspectProfile ? onInspectProfile(p) : onNavigate('profiles'),
          rawItem: p,
        })
      })

    return list
  }, [pendingRegistrations, profiles, onInspectRegistration, onInspectProfile, onNavigate])

  // Filter items by active tab
  const filteredAttentionItems = useMemo(() => {
    if (activeAttentionTab === 'all') return attentionItems
    if (activeAttentionTab === 'registrations') return attentionItems.filter(i => i.category === 'registrations')
    if (activeAttentionTab === 'profiles') return attentionItems.filter(i => i.category === 'profiles')
    if (activeAttentionTab === 'inquiries') return attentionItems.filter(i => i.category === 'inquiries')
    return attentionItems
  }, [attentionItems, activeAttentionTab])

  // Count per tab
  const tabCounts = useMemo(() => {
    return {
      all: attentionItems.length,
      registrations: attentionItems.filter(i => i.category === 'registrations').length,
      profiles: attentionItems.filter(i => i.category === 'profiles').length,
      inquiries: attentionItems.filter(i => i.category === 'inquiries').length,
    }
  }, [attentionItems])

  // Activity items list (strictly real audit logs from backend)
  const activityItems = useMemo(() => {
    if (auditLogs && auditLogs.length > 0) {
      return auditLogs.slice(0, 5).map((log) => ({
        id: log.id || log._id,
        text: `${log.target || 'System'} ${log.action || 'updated'}`,
        time: log.timestamp
          ? new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
          : 'Recently',
        icon: log.action?.toLowerCase().includes('approve') || log.action?.toLowerCase().includes('publish')
          ? CheckCircle2
          : log.action?.toLowerCase().includes('review')
          ? FileText
          : log.action?.toLowerCase().includes('inquiry')
          ? Mail
          : Sliders,
        color: log.action?.toLowerCase().includes('approve') || log.action?.toLowerCase().includes('publish')
          ? 'text-emerald-500 bg-emerald-50 ring-emerald-100'
          : log.action?.toLowerCase().includes('review')
          ? 'text-blue-500 bg-blue-50 ring-blue-100'
          : 'text-purple-500 bg-purple-50 ring-purple-100',
      }))
    }

    return []
  }, [auditLogs])

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Admin Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {greeting}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Here's what's happening with VidyaScope today.
          </p>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-xs sm:text-sm font-bold text-slate-900">
            {formattedDate}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
            Keep building a better future for students.
          </p>
        </div>
      </div>

      {/* 2. Key Operational Metrics Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Pending Registrations */}
        <div
          onClick={() => onNavigate('registrations')}
          className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-all cursor-pointer group flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">
                Pending Registrations
              </p>
              <p className="text-2xl font-extrabold text-slate-900 mt-0.5">
                {pendingRegCount}
              </p>
              <p className="text-[11px] text-orange-600 font-semibold flex items-center gap-1 mt-0.5">
                <span>↗</span> {pendingRegCount > 0 ? `${pendingRegCount} awaiting verification` : 'No pending requests'}
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-slate-600 transition-colors flex-shrink-0" />
        </div>

        {/* Card 2: Profiles Under Review */}
        <div
          onClick={() => onNavigate('profiles')}
          className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-all cursor-pointer group flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#EBF2FA] text-[#033C8D] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">
                Profiles Under Review
              </p>
              <p className="text-2xl font-extrabold text-slate-900 mt-0.5">
                {underReviewCount}
              </p>
              <p className="text-[11px] text-[#033C8D] font-semibold flex items-center gap-1 mt-0.5">
                <span>↗</span> {underReviewCount > 0 ? `${underReviewCount} awaiting review` : 'All up to date'}
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-slate-600 transition-colors flex-shrink-0" />
        </div>

        {/* Card 3: Published Colleges */}
        <div
          onClick={() => onNavigate('published-colleges')}
          className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-all cursor-pointer group flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">
                Published Colleges
              </p>
              <p className="text-2xl font-extrabold text-slate-900 mt-0.5">
                {publishedCount}
              </p>
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                <span>↗</span> {publishedCount > 0 ? `${publishedCount} active in directory` : 'No published profiles'}
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-slate-600 transition-colors flex-shrink-0" />
        </div>

        {/* Card 4: Contact Inquiries */}
        <div
          onClick={() => onNavigate('inquiries')}
          className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-all cursor-pointer group flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">
                Contact Inquiries
              </p>
              <p className="text-2xl font-extrabold text-slate-900 mt-0.5">
                {inquiriesCount}
              </p>
              <p className="text-[11px] text-purple-600 font-semibold flex items-center gap-1 mt-0.5">
                <span>↗</span> {inquiriesCount > 0 ? `${inquiriesCount} unanswered queries` : 'All queries answered'}
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-slate-600 transition-colors flex-shrink-0" />
        </div>
      </div>

      {/* 2.5 Website Traffic & Student Engagement Section */}
      <div className="space-y-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 text-[#033C8D] flex items-center justify-center font-bold">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Website Traffic & Student Footfall</span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Tracking
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Real-time visitor telemetry, page views, and per-college engagement metrics on VidyaScope.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Traffic KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Page Views */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Page Views</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Eye className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">
              {totalWebsiteViews.toLocaleString()}
            </p>
            <p className="text-[11px] text-blue-600 font-semibold mt-1 flex items-center gap-1">
              <span>Today:</span>
              <span className="font-extrabold">+{todayWebsiteViews.toLocaleString()} views</span>
            </p>
          </div>

          {/* Card 2: Unique Visitors */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Unique Visitors</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Globe className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">
              {uniqueVisitorsCount.toLocaleString()}
            </p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <span>Today:</span>
              <span className="font-extrabold">+{todayUniqueVisitorsCount.toLocaleString()} unique</span>
            </p>
          </div>

          {/* Card 3: Top Viewed College */}
          <div
            onClick={() => onNavigate('profiles')}
            className="bg-white border border-slate-200/80 hover:border-[#033C8D]/40 rounded-2xl p-4 sm:p-5 shadow-2xs cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Most Viewed College</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#033C8D] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Building2 className="h-4 w-4" />
              </div>
            </div>
            <p className="text-sm font-extrabold text-slate-900 mt-2 truncate" title={topCollegesList[0]?.name || 'N/A'}>
              {topCollegesList[0]?.name || 'No Data Yet'}
            </p>
            <p className="text-[11px] text-indigo-700 font-semibold mt-1 flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{(topCollegesList[0]?.views || 0).toLocaleString()} views</span>
            </p>
          </div>

          {/* Card 4: Device Breakdown */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Device Footprint</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Laptop className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-2 text-xs font-bold text-slate-800">
              <div className="flex items-center gap-1">
                <Laptop className="h-3.5 w-3.5 text-slate-400" />
                <span>{trafficData.deviceBreakdown?.Desktop || 0}</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1">
                <Smartphone className="h-3.5 w-3.5 text-slate-400" />
                <span>{trafficData.deviceBreakdown?.Mobile || 0}</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1">
                <Tablet className="h-3.5 w-3.5 text-slate-400" />
                <span>{trafficData.deviceBreakdown?.Tablet || 0}</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-1.5">
              Desktop / Mobile / Tablet
            </p>
          </div>
        </div>

        {/* Two-Column Deep-Dive Grid: Top Colleges Leaderboard & Live Visitor Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left: Top Colleges by Student Views */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-extrabold text-slate-900 tracking-tight">
                    Top Colleges by Student Views
                  </h4>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                    Leaderboard
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('published-colleges')}
                  className="text-xs font-bold text-[#033C8D] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>All Colleges</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {topCollegesList.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  No college views recorded yet. Views will appear automatically when students explore colleges.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 mt-2">
                  {topCollegesList.slice(0, 6).map((college, idx) => {
                    const pct = Math.min(100, Math.round(((college.views || 0) / maxViews) * 100))
                    return (
                      <div
                        key={college.id || college.slug || idx}
                        onClick={() => onNavigate('profiles')}
                        className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/70 -mx-2 px-2 rounded-xl cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <span className={`w-5 text-center text-xs font-black ${
                            idx === 0 ? 'text-amber-500' : idx === 1 ? 'text-slate-400' : idx === 2 ? 'text-amber-700' : 'text-slate-400'
                          }`}>
                            #{idx + 1}
                          </span>
                          <CollegeCrest name={college.name} />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-900 truncate group-hover:text-[#033C8D] transition-colors">
                              {college.name}
                            </p>
                            <p className="text-[11px] text-slate-400 capitalize flex items-center gap-1.5 mt-0.5">
                              <span>{college.stream || 'Engineering'}</span>
                              <span>•</span>
                              <span>{college.location}</span>
                            </p>
                            {/* Proportional View Bar */}
                            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                              <div
                                className="bg-[#033C8D] h-full rounded-full transition-all duration-500"
                                style={{ width: `${Math.max(8, pct)}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-100 text-[#033C8D] font-extrabold text-xs">
                            <Eye className="h-3 w-3" />
                            <span>{(college.views || 0).toLocaleString()}</span>
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">views</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right: Live Visitor Stream (Recent Traffic Log) */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-extrabold text-slate-900 tracking-tight">
                    Live Visitor Stream
                  </h4>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
                    <Radio className="h-3 w-3 text-emerald-500 animate-pulse" />
                    Real-time
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  Latest activity
                </span>
              </div>

              {recentVisitorsList.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  <Globe className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p>No visitor sessions logged yet.</p>
                  <p className="text-[11px] text-slate-400 mt-1">Live traffic from vidyascope.com will stream here in real time.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 mt-2 max-h-[380px] overflow-y-auto pr-1">
                  {recentVisitorsList.slice(0, 10).map((v) => {
                    const isCollege = Boolean(v.collegeName || v.pageType === 'college_detail')
                    return (
                      <div key={v.id || v._id} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 font-bold text-slate-900 truncate">
                            {isCollege ? (
                              <>
                                <Building2 className="h-3.5 w-3.5 text-[#033C8D] shrink-0" />
                                <span className="truncate text-[#033C8D]">{v.collegeName || v.path}</span>
                              </>
                            ) : (
                              <>
                                <Globe className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                <span className="truncate text-slate-800">{v.pageTitle || v.path}</span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5 font-medium flex-wrap">
                            <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-semibold">
                              {v.device || 'Desktop'}
                            </span>
                            <span>•</span>
                            <span>{v.browser || 'Web'}</span>
                            {v.referrer && v.referrer !== 'Direct' && (
                              <>
                                <span>•</span>
                                <span className="text-indigo-600 font-semibold">via {v.referrer}</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[10px] text-slate-400 font-medium">
                            {v.timestamp
                              ? new Date(v.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              : 'Just now'}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Operational Workspace (Two Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: "Needs Your Attention" & "Quick Actions" */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section: Needs Your Attention */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
            {/* Header with Title and View All */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Needs Your Attention
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
                  {tabCounts.all}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('registrations')}
                className="text-xs font-bold text-[#033C8D] hover:text-[#022B66] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>View all</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-4 sm:gap-6 border-b border-slate-100 pt-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveAttentionTab('all')}
                className={`pb-2.5 flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeAttentionTab === 'all'
                    ? 'border-b-2 border-[#033C8D] text-[#033C8D] font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>All</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600">
                  {tabCounts.all}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveAttentionTab('registrations')}
                className={`pb-2.5 flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeAttentionTab === 'registrations'
                    ? 'border-b-2 border-[#033C8D] text-[#033C8D] font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Registrations</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600">
                  {tabCounts.registrations}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveAttentionTab('profiles')}
                className={`pb-2.5 flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeAttentionTab === 'profiles'
                    ? 'border-b-2 border-[#033C8D] text-[#033C8D] font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Profile Reviews</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600">
                  {tabCounts.profiles}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveAttentionTab('inquiries')}
                className={`pb-2.5 flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeAttentionTab === 'inquiries'
                    ? 'border-b-2 border-[#033C8D] text-[#033C8D] font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Inquiries</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600">
                  {tabCounts.inquiries}
                </span>
              </button>
            </div>

            {/* List of Attention Items */}
            <div className="divide-y divide-slate-100">
              {filteredAttentionItems.map((item) => (
                <div
                  key={item.id}
                  className="py-3.5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-slate-50/50 -mx-2 px-2 rounded-xl transition-colors"
                >
                  {/* Left: Emblem & Details */}
                  <div className="flex items-center gap-3 min-w-0">
                    <CollegeCrest name={item.name} />

                    <div className="min-w-0">
                      <p
                        onClick={item.onAction}
                        className="text-xs sm:text-sm font-bold text-slate-900 truncate hover:text-[#033C8D] cursor-pointer transition-colors"
                      >
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5 truncate">
                        {item.eventDescription}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {item.timestamp}
                      </p>
                    </div>
                  </div>

                  {/* Right: Status Pill & Action Buttons */}
                  <div className="flex items-center gap-2.5 self-end sm:self-center flex-shrink-0">
                    <AdminStatusBadge status={item.status} />

                    <button
                      type="button"
                      onClick={item.onAction}
                      className="px-3 py-1.5 rounded-lg border border-[#033C8D]/25 bg-white hover:bg-[#EBF2FA] text-[#033C8D] text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                    >
                      {item.actionLabel}
                    </button>

                    <button
                      type="button"
                      onClick={item.onAction}
                      className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                      title="More actions"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              {filteredAttentionItems.length === 0 && (
                <div className="py-12 text-center text-xs text-slate-500">
                  <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                  <p className="font-bold text-slate-800 text-sm">All caught up!</p>
                  <p className="text-slate-500 mt-0.5">No pending items requiring attention in this category.</p>
                </div>
              )}
            </div>
          </div>

          {/* Section: Quick Actions */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Quick Actions
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Action 1 */}
              <div
                onClick={() => onNavigate('registrations')}
                className="p-3.5 bg-white border border-slate-200/80 hover:border-[#033C8D]/40 rounded-xl cursor-pointer transition-all shadow-2xs hover:shadow-xs group flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-[#EBF2FA] text-[#033C8D] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Users className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    Review Registrations
                  </p>
                  <p className="text-[10px] text-slate-400 truncate flex items-center gap-0.5">
                    Verify new college accounts <span>→</span>
                  </p>
                </div>
              </div>

              {/* Action 2 */}
              <div
                onClick={() => onNavigate('profiles')}
                className="p-3.5 bg-white border border-slate-200/80 hover:border-[#033C8D]/40 rounded-xl cursor-pointer transition-all shadow-2xs hover:shadow-xs group flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-[#EBF2FA] text-[#033C8D] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    Review Profiles
                  </p>
                  <p className="text-[10px] text-slate-400 truncate flex items-center gap-0.5">
                    Check submitted profiles <span>→</span>
                  </p>
                </div>
              </div>

              {/* Action 3 */}
              <div
                onClick={() => onNavigate('inquiries')}
                className="p-3.5 bg-white border border-slate-200/80 hover:border-[#033C8D]/40 rounded-xl cursor-pointer transition-all shadow-2xs hover:shadow-xs group flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-[#EBF2FA] text-[#033C8D] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    View Inquiries
                  </p>
                  <p className="text-[10px] text-slate-400 truncate flex items-center gap-0.5">
                    Manage contact queries <span>→</span>
                  </p>
                </div>
              </div>

              {/* Action 4 */}
              <div
                onClick={() => onNavigate('users')}
                className="p-3.5 bg-white border border-slate-200/80 hover:border-[#033C8D]/40 rounded-xl cursor-pointer transition-all shadow-2xs hover:shadow-xs group flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-[#EBF2FA] text-[#033C8D] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Users className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    Manage Users
                  </p>
                  <p className="text-[10px] text-slate-400 truncate flex items-center gap-0.5">
                    Add or update admin users <span>→</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right 1 Column: "College Profile Status" & "Recent Activity" */}
        <div className="space-y-6">
          
          {/* Widget 1: College Profile Status */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                College Profile Status
              </h3>
              <button
                type="button"
                onClick={() => onNavigate('profiles')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>View all</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-50 mt-1">
              {statusBreakdown.map((item) => (
                <div
                  key={item.label}
                  onClick={() => onNavigate('profiles', item.statusKey)}
                  className="py-3 flex items-center justify-between hover:bg-slate-50/70 -mx-2 px-2 rounded-lg cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.dotColor}`} />
                    <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Widget 2: Recent Activity */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                Recent Activity
              </h3>
              <button
                type="button"
                onClick={() => onNavigate('audit-logs')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>View all</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {activityItems.length > 0 ? (
              <div className="relative mt-3 pl-2 space-y-4">
                {/* Connecting line */}
                <div className="absolute top-2 bottom-2 left-5 w-0.5 bg-slate-100 -z-0" />

                {activityItems.map((act) => {
                  const Icon = act.icon
                  return (
                    <div key={act.id} className="relative z-10 flex items-start gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ring-4 ring-white ${act.color}`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>

                      <div className="min-w-0 flex-1 pt-0.5">
                        <p className="text-xs font-medium text-slate-800 leading-snug">
                          {act.text}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                          {act.time}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                No recent activity logged
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}

export default AdminOverviewPage
