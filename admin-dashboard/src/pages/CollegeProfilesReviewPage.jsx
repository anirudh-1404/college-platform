import React, { useState, useEffect, useMemo } from 'react'
import {
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  FileCheck,
} from 'lucide-react'
import AdminStatusBadge from '../components/common/AdminStatusBadge'
import { AdminModal } from '../components/common/AdminModal'

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

  // Selected Profile for Full 10-Step Review Canvas
  const [reviewingProfile, setReviewingProfile] = useState(null)
  const [activeReviewSection, setActiveReviewSection] = useState('overview')

  // Modals State
  const [requestChangesModalOpen, setRequestChangesModalOpen] = useState(false)
  const [feedbackComment, setFeedbackComment] = useState('')
  const [approvePublishModalOpen, setApprovePublishModalOpen] = useState(false)
  const [unpublishModalOpen, setUnpublishModalOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.shortName && p.shortName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.stream && p.stream.toLowerCase().includes(searchQuery.toLowerCase()))

      // If 'all', show ONLY submitted/actionable profiles (under_review, changes_requested, published)
      // Unsubmitted drafts won't clutter the approval review queue unless the 'draft' tab is explicitly clicked
      let matchStatus = false
      if (filterStatus === 'all') {
        matchStatus = p.profileStatus === 'under_review' || p.profileStatus === 'changes_requested' || p.profileStatus === 'published'
      } else {
        matchStatus = p.profileStatus === filterStatus
      }

      return matchSearch && matchStatus
    })
  }, [profiles, searchQuery, filterStatus])

  const handleConfirmPublish = async () => {
    if (!reviewingProfile) return
    setIsProcessing(true)
    try {
      await onApproveAndPublish(reviewingProfile.id)
      setApprovePublishModalOpen(false)
      setReviewingProfile(null)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleConfirmRequestChanges = async () => {
    if (!reviewingProfile) return
    if (!feedbackComment.trim()) {
      alert('Please provide feedback notes for the college.')
      return
    }
    setIsProcessing(true)
    try {
      await onRequestChanges(reviewingProfile.id, feedbackComment)
      setRequestChangesModalOpen(false)
      setFeedbackComment('')
      setReviewingProfile(null)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleConfirmUnpublish = async () => {
    if (!reviewingProfile) return
    setIsProcessing(true)
    try {
      await onUnpublish(reviewingProfile.id)
      setUnpublishModalOpen(false)
      setReviewingProfile(null)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            College Profiles CMS Review
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Review submitted 10-step institutional data from colleges and approve for live publishing.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {[
              { id: 'all', label: 'All' },
              { id: 'under_review', label: 'Under Review' },
              { id: 'changes_requested', label: 'Changes Requested' },
              { id: 'published', label: 'Published' },
              { id: 'draft', label: 'Draft' },
              { id: 'rejected', label: 'Rejected' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterStatus(tab.id)}
                className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                  filterStatus === tab.id
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search college..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#033C8D] focus:border-[#033C8D]"
            />
          </div>
        </div>
      </div>

      {/* Profiles Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                <th className="py-3 px-4 min-w-[200px]">College Name</th>
                <th className="py-3 px-4 min-w-[120px]">Stream</th>
                <th className="py-3 px-4 min-w-[100px]">NIRF Rank</th>
                <th className="py-3 px-4 min-w-[120px]">Avg Package</th>
                <th className="py-3 px-4 min-w-[120px]">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProfiles.map((profile) => (
                <tr key={profile.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-900">{profile.name}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{profile.shortName || 'College'}</p>
                  </td>

                  <td className="py-3 px-4 text-slate-700 capitalize">
                    {profile.stream} ({profile.ownership})
                  </td>

                  <td className="py-3 px-4 font-semibold text-slate-900">
                    #{profile.rankings?.nirfRank || profile.nirfRank || 'N/A'}
                  </td>

                  <td className="py-3 px-4 font-semibold text-emerald-600">
                    {profile.placements?.avgPackage || profile.avgPackage || 'Not Specified'}
                  </td>

                  <td className="py-3 px-4">
                    <AdminStatusBadge status={profile.profileStatus} />
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setReviewingProfile(profile)}
                      className="btn btn-secondary btn-sm text-xs cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Review</span>
                    </button>
                  </td>
                </tr>
              ))}

              {filteredProfiles.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-slate-400 space-y-2">
                    <FileCheck className="h-8 w-8 text-slate-300 mx-auto" />
                    <p className="font-semibold text-slate-700">No Profiles Awaiting Review</p>
                    <p className="text-slate-400 max-w-sm mx-auto">
                      When an approved college fills in their 10-step profile and clicks "Submit for Review", it will appear here for editorial inspection and live publishing.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comprehensive 10-Section Profile Review Modal */}
      {reviewingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setReviewingProfile(null)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
          />

          <div className="relative bg-white rounded-xl border border-slate-200 shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar p-6 z-10 space-y-5">
            
            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    {reviewingProfile.name}
                  </h3>
                  <AdminStatusBadge status={reviewingProfile.profileStatus} />
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  NIRF #{reviewingProfile.rankings?.nirfRank || reviewingProfile.nirfRank || 'N/A'} • {reviewingProfile.locationContact?.city || reviewingProfile.location || 'India'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRequestChangesModalOpen(true)}
                  className="btn btn-outline text-amber-700 hover:bg-amber-50 btn-sm text-xs cursor-pointer"
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Request Changes</span>
                </button>

                {reviewingProfile.profileStatus === 'published' ? (
                  <button
                    type="button"
                    onClick={() => setUnpublishModalOpen(true)}
                    className="btn btn-outline text-red-600 hover:bg-red-50 btn-sm text-xs cursor-pointer"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    <span>Unpublish</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setApprovePublishModalOpen(true)}
                    className="btn btn-success btn-sm text-xs font-semibold cursor-pointer"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Approve & Publish</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setReviewingProfile(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer text-xs ml-2"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Review Section Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto pb-2">
              {[
                { id: 'overview', label: '1. Basic Info' },
                { id: 'courses', label: '2. Courses & Fees' },
                { id: 'cutoffs', label: '3. Cutoff Ranks' },
                { id: 'placements', label: '4. Placements' },
                { id: 'roi', label: '5. ROI & Costs' },
                { id: 'facilities', label: '6. Facilities' },
                { id: 'rankings', label: '7. Rankings' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveReviewSection(tab.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
                    activeReviewSection === tab.id
                      ? 'bg-purple-50 text-purple-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Active Review Canvas */}
            <div className="space-y-4 text-xs">
              {activeReviewSection === 'overview' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-lg border border-slate-100">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-semibold block">Short Name</span>
                      <span className="font-bold text-slate-900">{reviewingProfile.shortName || 'College'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-semibold block">Stream</span>
                      <span className="font-bold text-slate-900 capitalize">{reviewingProfile.stream}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-semibold block">Ownership</span>
                      <span className="font-bold text-slate-900">{reviewingProfile.ownership}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-semibold block">Established</span>
                      <span className="font-bold text-slate-900">{reviewingProfile.establishmentYear || '1958'}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-700 font-semibold block mb-1">About Description</span>
                    <p className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-600 leading-relaxed">
                      {reviewingProfile.description || 'Institutional description.'}
                    </p>
                  </div>
                </div>
              )}

              {activeReviewSection === 'courses' && (
                <div className="space-y-2">
                  <span className="text-slate-700 font-semibold block">
                    Programs Offered ({reviewingProfile.coursesOffered?.length || 0})
                  </span>
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                    {(reviewingProfile.coursesOffered || []).map((course, idx) => (
                      <div key={course.id || idx} className="p-3 bg-white flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-900">{course.name}</p>
                          <p className="text-slate-500 text-[11px] mt-0.5">
                            Level: {course.degreeLevel} • Seats: {course.seatIntake} • Duration: {course.duration}
                          </p>
                        </div>
                        <span className="font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded">
                          {course.fee} Total
                        </span>
                      </div>
                    ))}
                    {(reviewingProfile.coursesOffered || []).length === 0 && (
                      <p className="p-4 text-center text-slate-400">No courses added yet by the college.</p>
                    )}
                  </div>
                </div>
              )}

              {activeReviewSection === 'cutoffs' && (
                <div className="space-y-2">
                  <span className="text-slate-700 font-semibold block">Cutoff Ranks Matrix</span>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                        <tr>
                          <th className="p-2.5">Exam</th>
                          <th className="p-2.5">Branch</th>
                          <th className="p-2.5">General Cutoff</th>
                          <th className="p-2.5">OBC Cutoff</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(reviewingProfile.admissionCutoffs || []).map((c, idx) => (
                          <tr key={idx}>
                            <td className="p-2.5 font-bold text-purple-700">{c.exam}</td>
                            <td className="p-2.5">{c.course}</td>
                            <td className="p-2.5 font-semibold text-emerald-600">{c.generalCutoff}</td>
                            <td className="p-2.5 text-slate-500">{c.obcCutoff}</td>
                          </tr>
                        ))}
                        {(reviewingProfile.admissionCutoffs || []).length === 0 && (
                          <tr><td colSpan={4} className="p-4 text-center text-slate-400">No cutoffs added yet.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeReviewSection === 'placements' && (
                <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-semibold block">Highest Domestic</span>
                    <span className="font-bold text-slate-900 text-sm mt-0.5 block">{reviewingProfile.placements?.highestDomestic || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-semibold block">Average Package</span>
                    <span className="font-bold text-emerald-600 text-sm mt-0.5 block">{reviewingProfile.placements?.avgPackage || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-semibold block">Placement Rate</span>
                    <span className="font-bold text-slate-900 text-sm mt-0.5 block">{reviewingProfile.placements?.placementRate || 0}%</span>
                  </div>
                </div>
              )}

              {activeReviewSection === 'roi' && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-2">
                  <span className="text-slate-700 font-semibold block">Annual Cost Breakdown</span>
                  {reviewingProfile.hiddenCosts ? (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>Tuition/Yr: ₹{((reviewingProfile.hiddenCosts.tuitionFeePerYear || 0) / 100000).toFixed(2)} L</div>
                      <div>Hostel/Yr: ₹{((reviewingProfile.hiddenCosts.hostelRentYearly || 0) / 100000).toFixed(2)} L</div>
                      <div>Mess/Yr: ₹{((reviewingProfile.hiddenCosts.messChargesYearly || 0) / 100000).toFixed(2)} L</div>
                      <div>Caution Money: ₹{((reviewingProfile.hiddenCosts.cautionDepositOneTime || 0) / 100000).toFixed(2)} L</div>
                    </div>
                  ) : (
                    <p className="text-slate-400">No cost breakdown submitted.</p>
                  )}
                </div>
              )}

              {activeReviewSection === 'facilities' && (
                <div className="flex flex-wrap gap-2">
                  {(reviewingProfile.facilities || []).map((f) => (
                    <span key={f} className="px-2.5 py-1 bg-slate-100 rounded text-slate-700 text-xs">
                      ✓ {f}
                    </span>
                  ))}
                  {(reviewingProfile.facilities || []).length === 0 && (
                    <p className="text-slate-400">No facilities selected.</p>
                  )}
                </div>
              )}

              {activeReviewSection === 'rankings' && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div><strong>NIRF Rank:</strong> #{reviewingProfile.rankings?.nirfRank || reviewingProfile.nirfRank || 'N/A'}</div>
                  <div><strong>NAAC Grade:</strong> {reviewingProfile.rankings?.naacGrade || reviewingProfile.naacGrade || 'N/A'}</div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setReviewingProfile(null)}
                className="btn btn-outline btn-md text-xs cursor-pointer"
              >
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Approve & Publish Confirmation Modal */}
      <AdminModal
        isOpen={approvePublishModalOpen}
        onClose={() => setApprovePublishModalOpen(false)}
        onConfirm={handleConfirmPublish}
        title="Approve & Publish Profile Live"
        description={`Publish ${reviewingProfile?.name} to VidyaScope public discovery.`}
        confirmText="Approve & Publish"
        type="success"
        isLoading={isProcessing}
      >
        <p className="text-slate-600 text-xs">
          This profile will immediately become live in the public search directory.
        </p>
      </AdminModal>

      {/* Request Changes Modal with Feedback Comments */}
      <AdminModal
        isOpen={requestChangesModalOpen}
        onClose={() => setRequestChangesModalOpen(false)}
        onConfirm={handleConfirmRequestChanges}
        title="Request Profile Changes"
        description={`Send revision feedback to ${reviewingProfile?.name}.`}
        confirmText="Send Feedback"
        type="warning"
        isLoading={isProcessing}
      >
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">
            Revision Feedback
          </label>
          <textarea
            rows={3}
            value={feedbackComment}
            onChange={(e) => setFeedbackComment(e.target.value)}
            placeholder="Specify what needs to be changed..."
            className="w-full text-xs font-medium text-slate-900 border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-purple-600"
          />
        </div>
      </AdminModal>

      {/* Unpublish Modal */}
      <AdminModal
        isOpen={unpublishModalOpen}
        onClose={() => setUnpublishModalOpen(false)}
        onConfirm={handleConfirmUnpublish}
        title="Unpublish College Profile"
        description={`Withdraw ${reviewingProfile?.name} from live public search.`}
        confirmText="Unpublish"
        type="danger"
        isLoading={isProcessing}
      >
        <p className="text-slate-600 text-xs">
          The profile will be reverted to draft mode and hidden from public search until re-approved.
        </p>
      </AdminModal>
    </div>
  )
}

export default CollegeProfilesReviewPage
