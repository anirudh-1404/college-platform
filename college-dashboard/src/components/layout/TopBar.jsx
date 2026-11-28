import React, { useState, useRef, useEffect } from 'react'
import { Menu, ChevronDown, Eye, LogOut, Mail, X, CheckCircle2, AlertCircle } from 'lucide-react'
import logoImg from '../../assets/logo.png'
import { StatusBadge } from '../common/StatusBadge'
import { collegeService } from '../../data/collegeService'

const TopBar = ({
  status = 'draft',
  user,
  lastUpdated,
  onOpenMobileSidebar,
  onPreviewPublic,
  onLogout,
}) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [emailSaving, setEmailSaving] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [emailSuccess, setEmailSuccess] = useState('')
  const menuRef = useRef(null)

  const handleOpenEmailModal = () => {
    setMenuOpen(false)
    setNewEmail(user?.email || '')
    setEmailError('')
    setEmailSuccess('')
    setEmailModalOpen(true)
  }

  const handleUpdateEmail = async (e) => {
    e.preventDefault()
    setEmailError('')
    setEmailSuccess('')
    const trimmed = newEmail.trim()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError('Please enter a valid email address.')
      return
    }
    setEmailSaving(true)
    try {
      const res = await collegeService.updateLoginEmail(trimmed)
      setEmailSuccess(res.message || 'Login email updated successfully.')
      setTimeout(() => {
        setEmailModalOpen(false)
      }, 1200)
    } catch (err) {
      setEmailError(err.message || 'Failed to update login email.')
    } finally {
      setEmailSaving(false)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const initial = user?.contactPerson
    ? user.contactPerson.charAt(0).toUpperCase()
    : user?.name
    ? user.name.charAt(0).toUpperCase()
    : 'A'

  const displayName = user?.contactPerson || user?.name || 'College Representative'

  return (
    <header className="sticky top-0 z-40 h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-2xs">
      
      {/* Left: VidyaScope Brand & Sidebar Toggle (Matching reference layout) */}
      <div className="flex items-center gap-3 sm:gap-4">
        <img
          src={logoImg}
          alt="VidyaScope"
          className="h-8 sm:h-9 w-auto object-contain cursor-pointer"
        />

        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer lg:hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Right: Actions, User Account Pill */}
      <div className="flex items-center gap-3 sm:gap-4">
        
        {/* Subtle Draft / Profile Status Pill */}
        <div className="hidden md:flex items-center gap-2 pr-1">
          <StatusBadge status={status} size="sm" />
          <span className="text-slate-300">•</span>
          <span className="text-[11px] text-slate-500 font-medium">
            Saved: <span className="text-slate-700 font-semibold">{lastUpdated || 'Just now'}</span>
          </span>
        </div>

        {/* College Representative Account Pill with Dropdown */}
        <div className="relative pl-1 sm:pl-2" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shadow-2xs">
              {initial}
            </div>
            
            <div className="hidden sm:flex items-center gap-1 select-none">
              <span className="text-xs font-bold text-slate-800 leading-none">
                {displayName}
              </span>
              <ChevronDown className={`h-3.5 w-3.5 text-slate-400 ml-0.5 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900 truncate">{displayName}</p>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">{user?.email || 'admin@iitb.ac.in'}</p>
                <span className="inline-block text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded mt-1.5">
                  Institutional Account
                </span>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleOpenEmailModal}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer text-left"
                >
                  <Mail className="h-4 w-4 text-indigo-600" />
                  <span>Change Login Email</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    if (onLogout) onLogout()
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
                >
                  <LogOut className="h-4 w-4 text-rose-500" />
                  <span>Log Out of Portal</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Change Login Email Modal */}
      {emailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Change Portal Login Email</h3>
                  <p className="text-[11px] text-slate-500">Use this new email for all future logins.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEmailModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {emailError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{emailError}</span>
              </div>
            )}

            {emailSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{emailSuccess}</span>
              </div>
            )}

            <form onSubmit={handleUpdateEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  New Login Email Address
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="registrar@institution.edu.in"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setEmailModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={emailSaving}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#033C8D] hover:bg-[#022B66] text-white disabled:opacity-60 cursor-pointer"
                >
                  {emailSaving ? 'Updating...' : 'Save New Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  )
}

export default TopBar
