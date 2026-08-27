import React from 'react'
import { Menu, Globe } from 'lucide-react'
import { StatusBadge } from '../common/StatusBadge'

const TopBar = ({
  status = 'draft',
  user,
  lastUpdated,
  onOpenMobileSidebar,
  onPreviewPublic,
}) => {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-sm border-b border-border-color px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-2xs">
      
      {/* Left: Mobile Toggle & Status Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-text-secondary hover:bg-slate-100 cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <StatusBadge status={status} size="sm" />
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="hidden sm:inline text-xs text-text-secondary font-medium">
            Last modified: <strong className="text-text-primary">{lastUpdated || 'Today'}</strong>
          </span>
        </div>
      </div>

      {/* Right: Quick Public Preview, Notifications, and Representative Avatar */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onPreviewPublic}
          className="btn btn-outline btn-sm text-xs cursor-pointer flex items-center gap-1.5"
          title="Preview public profile appearance"
        >
          <Globe className="h-3.5 w-3.5 text-brand-primary" />
          <span className="hidden sm:inline">Preview Live Profile</span>
          <span className="sm:hidden">Preview</span>
        </button>

        {/* Representative Info Pill */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-border-color">
          <div className="w-8 h-8 rounded-full bg-brand-accent text-brand-primary border border-brand-primary/20 flex items-center justify-center font-bold text-xs">
            {user?.contactPerson ? user.contactPerson.charAt(0) : 'A'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-text-primary leading-none">
              {user?.contactPerson || 'College Representative'}
            </p>
            <p className="text-[10px] text-text-light mt-0.5 leading-none truncate max-w-[140px]">
              {user?.email || 'admin@iitb.ac.in'}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default TopBar
