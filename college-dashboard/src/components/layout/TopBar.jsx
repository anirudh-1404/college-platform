import React from 'react'
import {
  Search,
  Bell,
  ExternalLink,
  Menu,
  CheckCircle,
  HelpCircle,
} from 'lucide-react'
import { StatusBadge } from '../common/UIComponents'

const TopBar = ({
  status = 'published',
  collegeName = 'IIT Bombay',
  onOpenMobileSidebar,
  onPreviewPublic,
  onQuickSearch,
  lastUpdated,
}) => {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-border-color px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-2xs">
      
      {/* Left: Mobile Toggle & Section Path */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-text-secondary hover:bg-slate-100 cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* CMS Live Status Badge */}
        <div className="hidden sm:flex items-center gap-2">
          <StatusBadge status={status} />
          {lastUpdated && (
            <span className="text-[11px] text-text-light font-medium hidden md:inline">
              • Last updated {lastUpdated}
            </span>
          )}
        </div>
      </div>

      {/* Right: Quick Actions & Profile */}
      <div className="flex items-center gap-3">
        {/* Preview Public Page */}
        <button
          onClick={onPreviewPublic}
          className="btn btn-secondary btn-sm hidden sm:inline-flex cursor-pointer"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span>View Public Page</span>
        </button>

        {/* Notifications Icon (Mock UI) */}
        <button
          onClick={() => alert('Notifications (Mock UI): 2 pending student queries from counseling inbox.')}
          className="relative p-2 rounded-xl text-text-secondary hover:text-brand-primary hover:bg-brand-accent transition-colors cursor-pointer"
          title="Notifications"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-primary ring-2 ring-white" />
        </button>

        {/* Administrator Profile Pill */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-border-color">
          <div className="w-8 h-8 rounded-full bg-brand-accent border border-brand-primary/30 flex items-center justify-center font-bold text-xs text-brand-primary">
            AD
          </div>
          <div className="hidden md:block text-left">
            <span className="text-xs font-bold text-text-primary block leading-tight">
              Admin Portal
            </span>
            <span className="text-[10px] text-text-light block leading-tight">
              {collegeName}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default TopBar
