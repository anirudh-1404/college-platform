import React from 'react'
import {
  LayoutDashboard,
  ShieldCheck,
  Building2,
  Users,
  Compass,
  FileText,
  SlidersHorizontal,
  History,
  LogOut,
} from 'lucide-react'
import logoImg from '../../assets/logo.png'

const AdminSidebar = ({
  activePage,
  onSelectPage,
  pendingRegistrationsCount = 0,
  underReviewCount = 0,
  usersCount = 0,
  currentUser,
  onLogout,
  isMobileOpen,
  onCloseMobile,
}) => {
  const navItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'registrations',
      label: 'Registration Requests',
      icon: ShieldCheck,
      badge: pendingRegistrationsCount > 0 ? pendingRegistrationsCount : null,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'profiles',
      label: 'College Profiles CMS',
      icon: Building2,
      badge: underReviewCount > 0 ? underReviewCount : null,
      badgeColor: 'bg-purple-100 text-purple-800',
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      badge: usersCount > 0 ? usersCount : null,
      badgeColor: 'bg-slate-100 text-slate-700',
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
      id: 'platform-data',
      label: 'Platform Data & Ratings',
      icon: SlidersHorizontal,
      badge: null,
    },
    {
      id: 'audit-logs',
      label: 'Audit Logs',
      icon: History,
      badge: null,
    },
  ]

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-60 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-150 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-lg' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 px-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={logoImg}
                alt="VidyaScope"
                className="h-8 w-auto object-contain"
              />
              <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                Admin
              </span>
            </div>

            {isMobileOpen && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="lg:hidden p-1 text-slate-400 hover:text-slate-600 cursor-pointer text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Navigation
            </p>

            {navItems.map((item) => {
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
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
                    isActive
                      ? 'bg-purple-50 text-purple-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`h-4 w-4 flex-shrink-0 ${
                        isActive ? 'text-purple-600' : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                        item.badgeColor || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Footer / User Account & Logout */}
        <div className="p-3 border-t border-slate-100">
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <p className="text-xs font-semibold text-slate-900 truncate">
                {currentUser?.name || 'Super Admin'}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {currentUser?.email || 'admin@vidyascope.com'}
              </p>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default AdminSidebar
