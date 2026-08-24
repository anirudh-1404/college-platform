import React from 'react'
import logoImg from '../../assets/logo.png'
import {
  LayoutDashboard,
  Building2,
  FileText,
  MapPin,
  BookOpen,
  Compass,
  IndianRupee,
  Sparkles,
  Home,
  Image as ImageIcon,
  TrendingUp,
  Award,
  GraduationCap,
  HelpCircle,
  Settings,
  LogOut,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react'

export const navSections = [
  {
    group: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard Home', icon: LayoutDashboard },
    ],
  },
  {
    group: 'College Information',
    items: [
      { id: 'profile', label: 'College Profile', icon: Building2 },
      { id: 'about', label: 'About College', icon: FileText },
      { id: 'contact', label: 'Contact & Location', icon: MapPin },
    ],
  },
  {
    group: 'Academics',
    items: [
      { id: 'courses', label: 'Courses & Programs', icon: BookOpen },
      { id: 'admissions', label: 'Admissions', icon: Compass },
      { id: 'fees', label: 'Fees Structure', icon: IndianRupee },
    ],
  },
  {
    group: 'Campus Life',
    items: [
      { id: 'facilities', label: 'Facilities', icon: Sparkles },
      { id: 'hostels', label: 'Hostel & Living', icon: Home },
      { id: 'gallery', label: 'Campus Gallery', icon: ImageIcon },
    ],
  },
  {
    group: 'Performance & Aid',
    items: [
      { id: 'placements', label: 'Placements', icon: TrendingUp },
      { id: 'rankings', label: 'Rankings & NIRF', icon: Award },
      { id: 'scholarships', label: 'Scholarships', icon: GraduationCap },
    ],
  },
  {
    group: 'Content & Help',
    items: [
      { id: 'faqs', label: 'FAQs Management', icon: HelpCircle },
    ],
  },
]

const Sidebar = ({ activeTab, onSelectTab, collegeName, onPreviewPublic, isMobileOpen, onCloseMobile }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-border-color flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="h-16 px-4 border-b border-border-color flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={logoImg}
                alt="VidyaScope Logo"
                className="h-12 w-auto object-contain"
              />
            </div>

            {/* Mobile Close Button */}
            {isMobileOpen && (
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1 text-text-light hover:text-text-primary cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* College Quick Identity */}
          <div className="p-4 border-b border-border-color bg-slate-50/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white border border-border-color flex items-center justify-center font-bold text-brand-primary text-xs shadow-2xs flex-shrink-0">
              IITB
            </div>
            <div className="overflow-hidden">
              <h3 className="font-serif text-xs font-bold text-text-primary truncate">
                {collegeName || 'IIT Bombay'}
              </h3>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded inline-block">
                Verified Portal
              </span>
            </div>
          </div>

          {/* Navigation Items (Scrollable) */}
          <div className="p-3 space-y-4 max-h-[calc(100vh-240px)] overflow-y-auto custom-scrollbar">
            {navSections.map((sec) => (
              <div key={sec.group} className="space-y-1">
                <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-text-light block">
                  {sec.group}
                </span>
                {sec.items.map((item) => {
                  const Icon = item.icon
                  const isActive = activeTab === item.id

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTab(item.id)
                        if (onCloseMobile) onCloseMobile()
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-left ${
                        isActive
                          ? 'bg-brand-primary text-white font-bold shadow-xs'
                          : 'text-text-secondary hover:bg-slate-100 hover:text-text-primary'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-text-light'}`} />
                        <span>{item.label}</span>
                      </div>
                      {isActive && <ChevronRight className="h-3.5 w-3.5 text-white" />}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions (Settings & Public Preview) */}
        <div className="p-3 border-t border-border-color space-y-1.5 bg-slate-50/50">
          <button
            onClick={onPreviewPublic}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-brand-primary hover:bg-brand-accent transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Preview Live Site</span>
            </div>
            <span className="text-[10px] bg-brand-primary/10 text-brand-primary px-1.5 py-0.2 rounded font-bold">
              Public
            </span>
          </button>

          <button
            onClick={() => alert('Institution Settings modal (Mock UI)')}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-text-secondary hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Settings className="h-3.5 w-3.5 text-text-light" />
            <span>Portal Settings</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
