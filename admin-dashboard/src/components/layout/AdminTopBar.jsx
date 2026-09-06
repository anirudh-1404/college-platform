import React, { useState, useRef, useEffect } from 'react'
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  Globe,
  Shield,
  LogOut,
  User,
  CheckCircle2,
} from 'lucide-react'

const AdminTopBar = ({
  pageTitle = 'Overview',
  onOpenMobileSidebar,
  pendingCount = 0,
  currentUser,
  onLogout,
  onSearch,
}) => {
  const [searchValue, setSearchValue] = useState('')
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const menuRef = useRef(null)
  const notifRef = useRef(null)

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotificationOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value)
    if (onSearch) onSearch(e.target.value)
  }

  const userInitial = (currentUser?.name || 'A')[0].toUpperCase()

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile Toggle & Global Search Input */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 cursor-pointer transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full max-w-sm sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Search colleges, users, inquiries..."
            className="w-full bg-slate-50/90 border border-slate-200/80 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#033C8D]/15 focus:border-[#033C8D] transition-all"
          />
        </div>
      </div>

      {/* Right: Notifications & User Profile */}
      <div className="flex items-center gap-3 sm:gap-4 ml-4">
        {/* Notifications Bell */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setIsNotificationOpen((prev) => !prev)}
            className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            {pendingCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Notifications</span>
                {pendingCount > 0 ? (
                  <span className="text-[10px] font-semibold bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full">
                    {pendingCount} new
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                    0 new
                  </span>
                )}
              </div>
              <div className="divide-y divide-slate-50 max-h-64 overflow-y-auto custom-scrollbar">
                {pendingCount > 0 ? (
                  <div className="px-4 py-3">
                    <p className="text-xs font-semibold text-slate-800">Pending Actions Required</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      You have {pendingCount} item{pendingCount > 1 ? 's' : ''} awaiting admin verification or review.
                    </p>
                  </div>
                ) : (
                  <div className="px-4 py-6 text-center text-xs text-slate-400">
                    No new notifications
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Admin Badge Tag in TopBar */}
        <span className="inline-flex items-center text-[10px] font-extrabold uppercase tracking-wider bg-[#EBF2FA] text-[#033C8D] border border-[#033C8D]/20 px-2.5 py-1 rounded-md select-none">
          Admin
        </span>

        {/* User Profile Pill & Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            className="flex items-center gap-2.5 p-1 sm:px-2 py-1 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200/80 transition-all cursor-pointer text-left"
          >
            {/* Circle Avatar */}
            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200 flex items-center justify-center text-xs flex-shrink-0 shadow-2xs">
              {userInitial}
            </div>

            {/* User Meta (Hidden on mobile) */}
            <div className="hidden sm:block leading-tight">
              <p className="text-xs font-bold text-slate-900 truncate max-w-28">
                {currentUser?.name || 'Admin User'}
              </p>
              <p className="text-[10px] text-slate-400 font-medium">
                {currentUser?.role === 'admin' ? 'Super Admin' : (currentUser?.role || 'Super Admin')}
              </p>
            </div>

            <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-slate-400" />
          </button>

          {/* User Profile Dropdown Menu */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {currentUser?.name || 'Admin User'}
                </p>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {currentUser?.email || 'admin@vidyascope.com'}
                </p>
              </div>

              <div className="py-1">
                <a
                  href="http://localhost:5173"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Globe className="h-3.5 w-3.5 text-slate-400" />
                  <span>Public Website</span>
                </a>

                <a
                  href="http://localhost:5174"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Shield className="h-3.5 w-3.5 text-purple-600" />
                  <span>College Portal</span>
                </a>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false)
                    onLogout()
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default AdminTopBar
