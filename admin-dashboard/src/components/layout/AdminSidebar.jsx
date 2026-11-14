import React from 'react'
import {
  LayoutDashboard,
  ShieldCheck,
  Building2,
  Landmark,
  MessageSquare,
  Users,
  Compass,
  FileText,
  SlidersHorizontal,
  Shield,
  History,
  Settings,
  ArrowLeft,
  ExternalLink,
  Sparkles,
  Radio,
  BookOpen,
  Globe,
  X,
} from 'lucide-react'
import logoImg from '../../assets/logo.png'
import { usePortalUrls } from '../../data/portalNavigation'

const AdminSidebar = ({
  activePage,
  onSelectPage,
  pendingRegistrationsCount = 0,
  underReviewCount = 0,
  usersCount = 0,
  newInquiriesCount = 0,
  currentUser,
  onLogout,
  isMobileOpen,
  onCloseMobile,
}) => {
  const { publicWebsiteUrl, collegePortalUrl } = usePortalUrls()
  const navGroups = [
    {
      title: 'OVERVIEW',
      items: [
        {
          id: 'overview',
          label: 'Dashboard',
          icon: LayoutDashboard,
          badge: null,
        },
      ],
    },
    {
      title: 'COLLEGES',
      items: [
        {
          id: 'registrations',
          label: 'Registration Requests',
          icon: ShieldCheck,
          badge: pendingRegistrationsCount > 0 ? pendingRegistrationsCount : null,
          badgeVariant: 'danger',
        },
        {
          id: 'profiles',
          label: 'College Profiles',
          icon: Building2,
          badge: underReviewCount > 0 ? underReviewCount : null,
          badgeVariant: 'neutral',
        },
        {
          id: 'published-colleges',
          label: 'Published Colleges',
          icon: Landmark,
          badge: null,
        },
      ],
    },
    {
      title: 'PLATFORM',
      items: [
        {
          id: 'inquiries',
          label: 'Contact Inquiries',
          icon: MessageSquare,
          badge: newInquiriesCount > 0 ? newInquiriesCount : null,
          badgeVariant: 'danger',
        },
        {
          id: 'users',
          label: 'Users',
          icon: Users,
          badge: null,
        },
        {
          id: 'career-guides',
          label: 'Career Roadmaps',
          icon: Compass,
          badge: null,
        },
        {
          id: 'exams',
          label: 'Entrance Exams',
          icon: FileText,
          badge: null,
        },
        {
          id: 'blogs',
          label: 'Blogs & Articles',
          icon: BookOpen,
          badge: null,
        },
        {
          id: 'live-intel',
          label: 'Live Intel Ticker',
          icon: Radio,
          badge: null,
        },
        {
          id: 'platform-data',
          label: 'Platform Data & Ratings',
          icon: SlidersHorizontal,
          badge: null,
        },
      ],
    },
    {
      title: 'MANAGEMENT',
      items: [
        {
          id: 'admin-team',
          label: 'Admin Team',
          icon: Shield,
          badge: null,
        },
        {
          id: 'audit-logs',
          label: 'Audit Logs',
          icon: History,
          badge: null,
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: Settings,
          badge: null,
        },
      ],
    },
  ]

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Top: Brand Header & Navigation */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Brand Header */}
          <div className="h-16 px-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={logoImg}
                alt="VidyaScope"
                className="h-8 w-auto object-contain"
              />
            </div>

            {isMobileOpen && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Grouped Navigation Links */}
          <nav className="p-3.5 space-y-4">
            {navGroups.map((group) => (
              <div key={group.title}>
                <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  {group.title}
                </p>

                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    const isActive = activePage === item.id

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onSelectPage(item.id)
                          if (onCloseMobile) onCloseMobile()
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer text-left ${
                          isActive
                            ? 'bg-[#EBF2FA] text-[#033C8D] font-bold shadow-2xs'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            className={`h-4 w-4 flex-shrink-0 transition-colors ${
                              isActive ? 'text-[#033C8D]' : 'text-slate-400 group-hover:text-slate-600'
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>

                        {item.badge !== null && item.badge !== undefined && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center ${
                              item.badgeVariant === 'danger'
                                ? 'bg-rose-500 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Section: External Platform Navigation */}
        <div className="p-3 border-t border-slate-100 space-y-1">
          <a
            href={publicWebsiteUrl || 'https://vidyascope.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-[#033C8D] hover:bg-slate-50 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Globe className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#033C8D] transition-colors" />
              <span className="truncate">Public Website</span>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600" />
          </a>

          <a
            href={collegePortalUrl || 'https://onair.vidyascope.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-purple-700 hover:bg-slate-50 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Shield className="h-3.5 w-3.5 text-slate-400 group-hover:text-purple-600 transition-colors" />
              <span className="truncate">College Portal</span>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600" />
          </a>
        </div>
      </aside>
    </>
  )
}

export default AdminSidebar
