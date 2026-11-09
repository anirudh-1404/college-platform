import React, { useState } from 'react'
import {
  Settings,
  Shield,
  Bell,
  Sliders,
  Save,
  CheckCircle2,
  Server,
  Lock,
  Globe,
  Database,
} from 'lucide-react'
import { usePortalUrls } from '../data/portalNavigation'

const SettingsPage = ({ currentUser }) => {
  const { publicWebsiteUrl, collegePortalUrl } = usePortalUrls()
  const [activeTab, setActiveTab] = useState('general')
  const [isSaved, setIsSaved] = useState(false)

  // Form states
  const [platformName, setPlatformName] = useState('VidyaScope')
  const [supportEmail, setSupportEmail] = useState('support@vidyascope.com')
  const [verificationApprovalMode, setVerificationApprovalMode] = useState('manual')
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [auditLogRetention, setAuditLogRetention] = useState('90')

  const handleSave = (e) => {
    e.preventDefault()
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Platform Settings & Governance
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
            Configure institutional verification thresholds, notifications, and operational parameters.
          </p>
        </div>

        {isSaved && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Settings saved successfully</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 sm:gap-6 border-b border-slate-200/80 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`pb-2.5 flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'general'
              ? 'border-b-2 border-[#033C8D] text-[#033C8D] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings className="h-4 w-4" />
          <span>General</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('verification')}
          className={`pb-2.5 flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'verification'
              ? 'border-b-2 border-[#033C8D] text-[#033C8D] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield className="h-4 w-4" />
          <span>Verification & Governance</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('system')}
          className={`pb-2.5 flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'system'
              ? 'border-b-2 border-[#033C8D] text-[#033C8D] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Server className="h-4 w-4" />
          <span>System & Environment</span>
        </button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSave} className="space-y-6">
        {activeTab === 'general' && (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Platform Identity & Public Visibility
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Platform Name
                </label>
                <input
                  type="text"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Support / Operations Email
                </label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Email Notifications for Queued Submissions</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Receive instant admin alerts when a new institutional registration or profile review is submitted.
                </p>
              </div>

              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>
          </div>
        )}

        {activeTab === 'verification' && (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Institutional Verification Rules
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Registration Review Authority Mode
                </label>
                <select
                  value={verificationApprovalMode}
                  onChange={(e) => setVerificationApprovalMode(e.target.value)}
                  className="w-full max-w-md bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 cursor-pointer"
                >
                  <option value="manual">Strict Manual Verification (Proof Document Inspection Required)</option>
                  <option value="dual">Dual Admin Sign-off Required</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Enforces that all UGC/AICTE accreditation certificates are reviewed prior to credential distribution.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Audit Log Retention Duration
                </label>
                <select
                  value={auditLogRetention}
                  onChange={(e) => setAuditLogRetention(e.target.value)}
                  className="w-full max-w-md bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 cursor-pointer"
                >
                  <option value="30">30 Days</option>
                  <option value="90">90 Days (Recommended)</option>
                  <option value="180">180 Days</option>
                  <option value="365">1 Year</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              System Environment & Endpoints
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Backend API Endpoint</span>
                <p className="font-mono text-xs text-slate-800 truncate">
                  {import.meta.env.VITE_API_URL || 'https://api.vidyascope.com/api/admin'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Public Web App</span>
                <p className="font-mono text-xs text-slate-800">
                  {publicWebsiteUrl}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">College Onboarding Portal</span>
                <p className="font-mono text-xs text-slate-800">
                  {collegePortalUrl}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Database Status</span>
                <div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>MongoDB Atlas Connected</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-[#033C8D] hover:bg-[#022B66] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default SettingsPage
