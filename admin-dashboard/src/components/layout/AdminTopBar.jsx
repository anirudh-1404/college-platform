import React from 'react'
import { Menu, Globe, Shield, LogOut } from 'lucide-react'

const AdminTopBar = ({
  pageTitle = 'Overview',
  onOpenMobileSidebar,
  pendingCount = 0,
  currentUser,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-1.5 rounded-md text-slate-500 hover:bg-slate-100 cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>

        <h1 className="text-sm sm:text-base font-semibold text-slate-900">
          {pageTitle}
        </h1>
      </div>

      {/* Right: Quick Links & Logout */}
      <div className="flex items-center gap-2.5">
        {/* Public Site Link */}
        <a
          href="http://localhost:5174"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary btn-sm text-xs cursor-pointer"
          title="Open Public User Website"
        >
          <Globe className="h-3.5 w-3.5 text-slate-500" />
          <span className="hidden sm:inline">Public Site</span>
        </a>

        {/* College Portal Link */}
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary btn-sm text-xs cursor-pointer"
          title="Open College Portal"
        >
          <Shield className="h-3.5 w-3.5 text-purple-600" />
          <span className="hidden sm:inline">College Portal</span>
        </a>

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={onLogout}
          className="btn btn-outline text-red-600 hover:bg-red-50 btn-sm text-xs cursor-pointer"
          title="Sign Out"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  )
}

export default AdminTopBar
