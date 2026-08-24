import React from 'react'
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  Edit3,
  PlusCircle,
  Image as ImageIcon,
  Compass,
  Building2,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  HelpCircle,
  Sparkles,
} from 'lucide-react'
import { PageHeader, StatusBadge } from '../components/common/UIComponents'

const DashboardHome = ({
  collegeData,
  onNavigateTab,
  onPreviewPublic,
  onSave,
}) => {
  const checklist = [
    { id: 'profile', label: 'Basic Profile & Identity', completed: true, tab: 'profile' },
    { id: 'about', label: 'About & Director Message', completed: true, tab: 'about' },
    { id: 'courses', label: 'Courses & Degree Programs (5)', completed: true, tab: 'courses' },
    { id: 'admissions', label: 'Admissions 2026 Process', completed: true, tab: 'admissions' },
    { id: 'fees', label: 'Detailed Fees & Waivers', completed: true, tab: 'fees' },
    { id: 'facilities', label: 'Campus Facilities (10)', completed: true, tab: 'facilities' },
    { id: 'placements', label: 'Placement Records & Packages', completed: true, tab: 'placements' },
    { id: 'rankings', label: 'NIRF & QS Rankings', completed: true, tab: 'rankings' },
    { id: 'scholarships', label: 'Scholarships & Aid Schemes', completed: true, tab: 'scholarships' },
    { id: 'hostels', label: 'Hostel & Residential Info', completed: true, tab: 'hostels' },
    { id: 'gallery', label: 'Campus Photo Gallery (6)', completed: true, tab: 'gallery' },
    { id: 'faqs', label: 'Frequently Asked Questions (4)', completed: true, tab: 'faqs' },
    { id: 'contact', label: 'Contact & Location Info', completed: true, tab: 'contact' },
  ]

  const completedCount = checklist.filter((item) => item.completed).length
  const totalCount = checklist.length
  const percentage = Math.round((completedCount / totalCount) * 100)

  const quickActions = [
    {
      label: 'Edit College Profile',
      desc: 'Update identity, NIRF rank, city, and summary.',
      icon: Building2,
      tab: 'profile',
      color: 'text-brand-primary bg-brand-accent',
    },
    {
      label: 'Add New Course',
      desc: 'Introduce a new degree, eligibility, and fee structure.',
      icon: PlusCircle,
      tab: 'courses',
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Update Admissions',
      desc: 'Modify 2026-27 application dates and JoSAA links.',
      icon: Compass,
      tab: 'admissions',
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Upload Campus Photos',
      desc: 'Add hostel, lab, and campus life photography.',
      icon: ImageIcon,
      tab: 'gallery',
      color: 'text-purple-600 bg-purple-50',
    },
  ]

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <PageHeader
        title={`Welcome, ${collegeData.profile.shortName || 'College Administrator'}`}
        subtitle="Manage your institutional disclosures, courses, placement figures, and public profile on VidyaScope."
        badge={<StatusBadge status={collegeData.status} />}
        onPreview={onPreviewPublic}
      />

      {/* Hero Overview Banner (CMS Status, not fake analytics) */}
      <div className="bg-white border border-border-color rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                Institutional CMS Status
              </span>
              <span className="text-xs text-text-light">•</span>
              <span className="text-xs text-text-secondary font-medium flex items-center gap-1">
                <Clock className="h-3 w-3 text-text-light" />
                <span>Last updated {collegeData.lastUpdated}</span>
              </span>
            </div>

            <h2 className="font-serif text-xl sm:text-2xl font-bold text-text-primary">
              {collegeData.profile.name}
            </h2>

            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-2xl">
              Your institutional profile is currently <strong className="text-emerald-700 font-semibold">Live & Verified</strong> on the VidyaScope student discovery platform. Any edits made here will immediately sync to the public profile.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigateTab('profile')}
                className="btn btn-primary btn-sm cursor-pointer"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Edit Full Profile</span>
              </button>

              <button
                onClick={onPreviewPublic}
                className="btn btn-secondary btn-sm cursor-pointer"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Open Public Page</span>
              </button>
            </div>
          </div>

          {/* Profile Completion Progress Card */}
          <div className="lg:col-span-4 bg-slate-50 border border-border-color rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Profile Completeness
              </span>
              <span className="text-base font-extrabold text-brand-primary font-serif">
                {percentage}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-primary rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>

            <p className="text-[11px] text-text-secondary">
              <strong className="text-text-primary">{completedCount} of {totalCount}</strong> sections verified and active on the public site.
            </p>

            <div className="pt-1 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Ready for daily student discovery</span>
            </div>
          </div>

        </div>
      </div>

      {/* Quick Action Cards Grid */}
      <div>
        <h3 className="font-serif text-lg font-bold text-text-primary mb-3">
          Quick Management Actions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <button
                key={action.label}
                onClick={() => onNavigateTab(action.tab)}
                className="bg-white border border-border-color rounded-xl p-4 text-left hover:border-brand-primary/40 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className={`w-9 h-9 rounded-lg ${action.color} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <h4 className="font-serif text-sm font-bold text-text-primary group-hover:text-brand-primary transition-colors">
                    {action.label}
                  </h4>
                  <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                    {action.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-brand-primary">
                  <span>Manage Section</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* CMS Checklist Section */}
      <div className="bg-white border border-border-color rounded-xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-text-primary">
              Section Completion Checklist
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Click any section below to jump directly to its editor.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
            {completedCount}/{totalCount} Completed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {checklist.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigateTab(item.tab)}
              className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-brand-primary/30 transition-all cursor-pointer flex items-center justify-between text-left group"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span className="text-xs font-semibold text-text-primary group-hover:text-brand-primary transition-colors">
                  {item.label}
                </span>
              </div>
              <ArrowRight className="h-3 w-3 text-text-light group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all" />
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}

export default DashboardHome
