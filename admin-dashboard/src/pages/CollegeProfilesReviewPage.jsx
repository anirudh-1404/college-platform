import React, { useState, useEffect, useMemo } from 'react'
import {
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  FileCheck,
  Building2,
  MapPin,
  BookOpen,
  Award,
  TrendingUp,
  RefreshCw,
  Sparkles,
} from 'lucide-react'
import AdminStatusBadge from '../components/common/AdminStatusBadge'
import { AdminModal } from '../components/common/AdminModal'
import { CollegeReviewStudio } from '../components/review/CollegeReviewStudio'
import { adminService } from '../data/adminService'

const CollegeProfilesReviewPage = ({
  profiles = [],
  defaultFilter = 'all',
  onApproveAndPublish,
  onRequestChanges,
  onUnpublish,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState(defaultFilter)

  useEffect(() => {
    setFilterStatus(defaultFilter)
  }, [defaultFilter])

  // Selected Profile for Full 10-Step Review Studio
  const [reviewingProfile, setReviewingProfile] = useState(null)
  const [isRefreshingProfile, setIsRefreshingProfile] = useState(false)

  // Modals State
  const [requestChangesModalOpen, setRequestChangesModalOpen] = useState(false)
  const [feedbackComment, setFeedbackComment] = useState('')
  const [approvePublishModalOpen, setApprovePublishModalOpen] = useState(false)
  const [unpublishModalOpen, setUnpublishModalOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Real-time Single Profile Refresher
  const handleOpenReview = async (profile) => {
    setReviewingProfile(profile)
    const collegeId = profile.id || profile.slug || profile._id
    if (collegeId) {
      try {
        setIsRefreshingProfile(true)
        const fresh = await adminService.getProfileById(collegeId)
        if (fresh) {
          setReviewingProfile(fresh)
        }
      } catch (err) {
        console.warn('Real-time single profile fetch error:', err)
      } finally {
        setIsRefreshingProfile(false)
      }
    }
  }

  const handleRefreshCurrentProfile = async () => {
    if (!reviewingProfile) return
    const collegeId = reviewingProfile.id || reviewingProfile.slug || reviewingProfile._id
    if (collegeId) {
      try {
        setIsRefreshingProfile(true)
        const fresh = await adminService.getProfileById(collegeId)
        if (fresh) {
          setReviewingProfile(fresh)
        }
      } catch (err) {
        console.warn('Refresh current profile error:', err)
      } finally {
        setIsRefreshingProfile(false)
      }
    }
  }

  // Filtered Profiles for Queue
  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      const matchSearch =
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.shortName && p.shortName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.stream && p.stream.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.city && p.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.locationContact?.city && p.locationContact.city.toLowerCase().includes(searchQuery.toLowerCase()))

      // If 'all', show submitted/actionable profiles (under_review, changes_requested, published)
      let matchStatus = false
      if (filterStatus === 'all') {
        matchStatus =
          p.profileStatus === 'under_review' ||
          p.profileStatus === 'changes_requested' ||
          p.profileStatus === 'published'
      } else {
        matchStatus = p.profileStatus === filterStatus
      }

      return matchSearch && matchStatus
    })
  }, [profiles, searchQuery, filterStatus])

  // Counts for Badges
  const counts = useMemo(() => {
    return {
      all: profiles.filter(
        (p) =>
          p.profileStatus === 'under_review' ||
          p.profileStatus === 'changes_requested' ||
          p.profileStatus === 'published'
      ).length,
      under_review: profiles.filter((p) => p.profileStatus === 'under_review').length,
      changes_requested: profiles.filter((p) => p.profileStatus === 'changes_requested').length,
      published: profiles.filter((p) => p.profileStatus === 'published').length,
      draft: profiles.filter((p) => p.profileStatus === 'draft' || !p.profileStatus).length,
      rejected: profiles.filter((p) => p.profileStatus === 'rejected').length,
    }
  }, [profiles])

  // Confirmation Handlers
  const handleConfirmPublish = async () => {
    if (!reviewingProfile) return
    const collegeId = reviewingProfile.id || reviewingProfile.slug || reviewingProfile._id
    setIsProcessing(true)
    try {
      await onApproveAndPublish(collegeId)
      setApprovePublishModalOpen(false)
      setReviewingProfile(null)
    } catch (err) {
      console.error('Failed to approve profile:', err)
      alert(err.message || 'Failed to approve and publish profile. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleConfirmRequestChanges = async () => {
    if (!reviewingProfile) return
    const collegeId = reviewingProfile.id || reviewingProfile.slug || reviewingProfile._id
    if (!feedbackComment.trim()) {
      alert('Please provide specific feedback notes for the college representative.')
      return
    }
    setIsProcessing(true)
    try {
      await onRequestChanges(collegeId, feedbackComment)
      setRequestChangesModalOpen(false)
      setFeedbackComment('')
      setReviewingProfile(null)
    } catch (err) {
      console.error('Failed to request changes:', err)
      alert(err.message || 'Failed to request changes. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleConfirmUnpublish = async () => {
    if (!reviewingProfile) return
    const collegeId = reviewingProfile.id || reviewingProfile.slug || reviewingProfile._id
    setIsProcessing(true)
    try {
      await onUnpublish(collegeId)
      setUnpublishModalOpen(false)
      setReviewingProfile(null)
    } catch (err) {
      console.error('Failed to unpublish profile:', err)
      alert(err.message || 'Failed to unpublish profile. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <span>College Profiles CMS Review</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EBF2FA] text-[#033C8D] font-bold border border-[#033C8D]/20">
              {counts.under_review} Awaiting Approval
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Inspect submitted 10-step institutional data across programs, cutoffs, placements, rankings, and true costs before live publishing.
          </p>
        </div>

        {/* Search Box */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by college name, city..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#033C8D] shadow-2xs"
          />
        </div>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => setFilterStatus('under_review')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer shadow-2xs ${
            filterStatus === 'under_review'
              ? 'bg-[#EBF2FA] border-[#033C8D]/40 text-[#033C8D]'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Under Review</span>
            <span className="h-2 w-2 rounded-full bg-[#033C8D]" />
          </div>
          <p className="text-xl font-black text-slate-900 mt-1">{counts.under_review}</p>
          <span className="text-[11px] text-[#033C8D] font-semibold mt-0.5 block">Requires Editorial Audit</span>
        </div>

        <div
          onClick={() => setFilterStatus('published')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer shadow-2xs ${
            filterStatus === 'published'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Published Live</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <p className="text-xl font-black text-slate-900 mt-1">{counts.published}</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">Live in Student Search</span>
        </div>

        <div
          onClick={() => setFilterStatus('changes_requested')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer shadow-2xs ${
            filterStatus === 'changes_requested'
              ? 'bg-amber-50 border-amber-300 text-amber-800'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Changes Requested</span>
            <span className="h-2 w-2 rounded-full bg-amber-500" />
          </div>
          <p className="text-xl font-black text-slate-900 mt-1">{counts.changes_requested}</p>
          <span className="text-[11px] text-amber-700 font-semibold mt-0.5 block">Returned with Notes</span>
        </div>

        <div
          onClick={() => setFilterStatus('all')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer shadow-2xs ${
            filterStatus === 'all'
              ? 'bg-purple-50 border-purple-300 text-purple-800'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Actionable Queue</span>
            <span className="h-2 w-2 rounded-full bg-purple-500" />
          </div>
          <p className="text-xl font-black text-slate-900 mt-1">{counts.all}</p>
          <span className="text-[11px] text-purple-700 font-semibold mt-0.5 block">Total Tracked Profiles</span>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto">
        {[
          { id: 'all', label: 'All Actionable', count: counts.all },
          { id: 'under_review', label: 'Under Review', count: counts.under_review },
          { id: 'changes_requested', label: 'Changes Requested', count: counts.changes_requested },
          { id: 'published', label: 'Published', count: counts.published },
          { id: 'draft', label: 'Draft', count: counts.draft },
          { id: 'rejected', label: 'Rejected', count: counts.rejected },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilterStatus(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              filterStatus === tab.id
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                filterStatus === tab.id
                  ? 'bg-[#033C8D] text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Main Review Queue Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th className="py-3.5 px-4 min-w-[240px]">Institution Name & Campus</th>
                <th className="py-3.5 px-4 min-w-[140px]">Stream & Ownership</th>
                <th className="py-3.5 px-4 min-w-[100px]">NIRF Rank</th>
                <th className="py-3.5 px-4 min-w-[120px]">Avg Package</th>
                <th className="py-3.5 px-4 min-w-[90px]">Programs</th>
                <th className="py-3.5 px-4 min-w-[130px]">Status</th>
                <th className="py-3.5 px-4 text-right min-w-[130px]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProfiles.map((profile) => {
                const city = profile.locationContact?.city || profile.city || profile.location || 'India'
                const state = profile.locationContact?.state || profile.state || ''
                const nirf = profile.rankings?.nirfRank || profile.nirfRank || 'N/A'
                const avgSalary = profile.placements?.avgPackage || profile.avgPackage || 'Not Specified'
                const coursesCount = profile.coursesOffered?.length || 0

                return (
                  <tr key={profile.id || profile._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-[#033C8D]/10 text-[#033C8D] flex items-center justify-center font-bold text-xs shrink-0 border border-[#033C8D]/20">
                          {profile.shortName?.slice(0, 2).toUpperCase() || 'IN'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-xs sm:text-sm">{profile.name}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                            <span>{city}{state ? `, ${state}` : ''}</span>
                            <span className="mx-1">•</span>
                            <span className="font-semibold text-slate-700">{profile.shortName}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 capitalize font-medium">
                      <p className="text-slate-900 font-semibold">{profile.stream}</p>
                      <p className="text-[11px] text-slate-400">{profile.ownership || 'Government'}</p>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-[#033C8D]">
                      #{nirf}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-emerald-600">
                      {avgSalary}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-bold border border-purple-200 text-[11px]">
                        {coursesCount} Courses
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <AdminStatusBadge status={profile.profileStatus} />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenReview(profile)}
                        className="btn bg-[#033C8D] hover:bg-[#022B66] text-white btn-sm text-xs font-bold cursor-pointer shadow-2xs inline-flex items-center gap-1.5"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Inspect & Review</span>
                      </button>
                    </td>
                  </tr>
                )
              })}

              {filteredProfiles.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-slate-400 space-y-2">
                    <FileCheck className="h-9 w-9 text-slate-300 mx-auto" />
                    <p className="font-bold text-slate-800 text-sm">No Institutional Profiles in this Filter</p>
                    <p className="text-slate-500 max-w-sm mx-auto">
                      Colleges that submit their complete 10-step institutional CMS profile will appear here with full verification controls.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= FULL-SCREEN / EXPANSIVE REVIEW STUDIO ================= */}
      {reviewingProfile && (
        <CollegeReviewStudio
          profile={reviewingProfile}
          onClose={() => setReviewingProfile(null)}
          onApproveAndPublish={() => setApprovePublishModalOpen(true)}
          onRequestChanges={() => setRequestChangesModalOpen(true)}
          onUnpublish={() => setUnpublishModalOpen(true)}
          onRefreshProfile={handleRefreshCurrentProfile}
          isRefreshing={isRefreshingProfile}
        />
      )}

      {/* ================= MODALS ================= */}

      {/* 1. Approve & Publish Live Confirmation Modal */}
      <AdminModal
        isOpen={approvePublishModalOpen}
        onClose={() => setApprovePublishModalOpen(false)}
        onConfirm={handleConfirmPublish}
        title="Approve & Publish College Profile Live"
        description={`Validate and publish ${reviewingProfile?.name} to VidyaScope student discovery platform.`}
        confirmText="Approve & Publish Live"
        type="success"
        isLoading={isProcessing}
      >
        <div className="space-y-3 text-xs text-slate-600">
          <p>
            By publishing this profile, all 10 verified sections (Courses, Cutoffs, Placements, Rankings, Facilities, and Fee Structure) will instantly become searchable and live on VidyaScope website for thousands of prospective students.
          </p>
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
            ✓ College representative will be notified that their profile has been officially approved and published.
          </div>
        </div>
      </AdminModal>

      {/* 2. Request Changes Modal with Custom Feedback */}
      <AdminModal
        isOpen={requestChangesModalOpen}
        onClose={() => setRequestChangesModalOpen(false)}
        onConfirm={handleConfirmRequestChanges}
        title="Request Institutional Profile Revisions"
        description={`Send specific verification feedback notes to ${reviewingProfile?.name}.`}
        confirmText="Send Revision Feedback"
        type="warning"
        isLoading={isProcessing}
      >
        <div className="space-y-2.5">
          <label className="block text-xs font-bold text-slate-800">
            Specific Changes Required by Editorial Council:
          </label>
          <textarea
            rows={4}
            value={feedbackComment}
            onChange={(e) => setFeedbackComment(e.target.value)}
            placeholder="e.g. Please upload latest 2025 NIRF certificate and verify General closing cutoffs for Computer Science..."
            className="w-full text-xs font-medium text-slate-900 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-[#033C8D] shadow-2xs leading-relaxed"
          />
          <p className="text-[11px] text-slate-500">
            The profile will be unlocked for the college representative to make corrections and re-submit for approval.
          </p>
        </div>
      </AdminModal>

      {/* 3. Unpublish Profile Modal */}
      <AdminModal
        isOpen={unpublishModalOpen}
        onClose={() => setUnpublishModalOpen(false)}
        onConfirm={handleConfirmUnpublish}
        title="Unpublish Institutional Profile"
        description={`Withdraw ${reviewingProfile?.name} from live public search.`}
        confirmText="Unpublish Profile"
        type="danger"
        isLoading={isProcessing}
      >
        <p className="text-slate-600 text-xs">
          The institutional profile will be reverted to draft mode and immediately hidden from student search queries until re-approved.
        </p>
      </AdminModal>

    </div>
  )
}

export default CollegeProfilesReviewPage
