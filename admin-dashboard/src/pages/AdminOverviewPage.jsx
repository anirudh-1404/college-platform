import React from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import AdminStatusBadge from '../components/common/AdminStatusBadge'

const AdminOverviewPage = ({
  analytics,
  pendingRegistrations = [],
  profiles = [],
  onNavigate,
  onInspectRegistration,
  onInspectProfile,
}) => {
  const underReviewProfiles = profiles.filter((p) => p.profileStatus === 'under_review')
  const changesRequestedProfiles = profiles.filter((p) => p.profileStatus === 'changes_requested')

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Admin Overview
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor registration queues, review submitted institutional profiles, and manage live publishing.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('registrations')}
          className="btn btn-primary btn-sm text-xs cursor-pointer self-start sm:self-auto"
        >
          <span>View Registrations Queue</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* 2. Key Metric Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs font-medium text-slate-500">Pending Registrations</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {analytics.pendingRegistrations}
          </p>
          <p className="text-[11px] text-amber-600 mt-1 font-medium">Awaiting verification</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs font-medium text-slate-500">Profiles Under Review</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {analytics.underReviewProfiles}
          </p>
          <p className="text-[11px] text-blue-600 mt-1 font-medium">Submitted by colleges</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs font-medium text-slate-500">Live Published Colleges</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {analytics.publishedProfiles}
          </p>
          <p className="text-[11px] text-emerald-600 mt-1 font-medium">Active in public directory</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs font-medium text-slate-500">Admin Team Members</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {analytics.totalUsers || 4}
          </p>
          <p className="text-[11px] text-purple-600 mt-1 font-medium">Authorized staff accounts</p>
        </div>
      </div>

      {/* 3. Action Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Pending Registrations Queue */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Registration Verification Queue
              </h3>
              <button
                type="button"
                onClick={() => onNavigate('registrations')}
                className="text-xs text-purple-600 hover:text-purple-700 font-medium cursor-pointer"
              >
                View all ({pendingRegistrations.length})
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-1">
              {pendingRegistrations.slice(0, 3).map((reg) => (
                <div key={reg.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-900">{reg.collegeName}</p>
                      <AdminStatusBadge status={reg.status} />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {reg.contactPerson} • {reg.email}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onInspectRegistration(reg)}
                    className="btn btn-secondary btn-sm text-xs cursor-pointer flex-shrink-0"
                  >
                    Inspect
                  </button>
                </div>
              ))}

              {pendingRegistrations.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-500">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500 mx-auto mb-1.5 opacity-80" />
                  <p className="font-medium text-slate-800">No Pending Registrations</p>
                  <p>All institutional accounts have been processed.</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onNavigate('registrations')}
              className="btn btn-outline btn-sm w-full text-xs cursor-pointer"
            >
              Open Full Registration Queue
            </button>
          </div>
        </div>

        {/* Right: Submitted Profiles Awaiting Review */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Profiles Awaiting Review
              </h3>
              <button
                type="button"
                onClick={() => onNavigate('profiles')}
                className="text-xs text-purple-600 hover:text-purple-700 font-medium cursor-pointer"
              >
                View all ({underReviewProfiles.length + changesRequestedProfiles.length})
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-1">
              {[...underReviewProfiles, ...changesRequestedProfiles].slice(0, 3).map((profile) => (
                <div key={profile.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-900">{profile.name}</p>
                      <AdminStatusBadge status={profile.profileStatus} />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      NIRF #{profile.nirfRank || 3} • {profile.avgPackage} Avg Package
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onInspectProfile(profile)}
                    className="btn btn-primary btn-sm text-xs cursor-pointer flex-shrink-0"
                  >
                    Review
                  </button>
                </div>
              ))}

              {underReviewProfiles.length === 0 && changesRequestedProfiles.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-500">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500 mx-auto mb-1.5 opacity-80" />
                  <p className="font-medium text-slate-800">No Profiles Awaiting Review</p>
                  <p>All submitted college CMS profiles are up to date.</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onNavigate('profiles')}
              className="btn btn-outline btn-sm w-full text-xs cursor-pointer"
            >
              Open Full College Profiles CMS
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default AdminOverviewPage
