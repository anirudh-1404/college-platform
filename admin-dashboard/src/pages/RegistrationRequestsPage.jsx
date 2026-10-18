import React, { useState, useMemo } from 'react'
import {
  Search,
  CheckCircle2,
  XCircle,
  FileText,
  Eye,
  Building2,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  User,
  Briefcase,
  Calendar,
  Download,
  ExternalLink,
  ShieldCheck,
  X,
} from 'lucide-react'
import AdminStatusBadge from '../components/common/AdminStatusBadge'
import { AdminModal, DocumentPreviewModal } from '../components/common/AdminModal'

const RegistrationRequestsPage = ({
  registrations = [],
  onApprove,
  onReject,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  // Selected item for modal
  const [selectedReg, setSelectedReg] = useState(null)
  const [previewDoc, setPreviewDoc] = useState(null)

  // Rejection Modal State
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  // Approve Confirmation State
  const [approveModalOpen, setApproveModalOpen] = useState(false)

  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      const matchSearch =
        reg.collegeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())

      const matchStatus =
        filterStatus === 'all' || reg.status === filterStatus

      return matchSearch && matchStatus
    })
  }, [registrations, searchQuery, filterStatus])

  const handleConfirmApprove = async () => {
    if (!selectedReg) return
    setIsProcessing(true)
    try {
      await onApprove(selectedReg.id)
      setApproveModalOpen(false)
      setSelectedReg(null)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleConfirmReject = async () => {
    if (!selectedReg) return
    if (!rejectionReason.trim()) {
      alert('Please enter a rejection reason.')
      return
    }
    setIsProcessing(true)
    try {
      await onReject(selectedReg.id, rejectionReason)
      setRejectModalOpen(false)
      setRejectionReason('')
      setSelectedReg(null)
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
            Registration Requests
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Review submitted college registrations and verify official recognition certificates.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {['all', 'pending', 'approved', 'rejected'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded text-xs font-medium capitalize cursor-pointer transition-colors ${
                  filterStatus === st
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
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
              placeholder="Search..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#033C8D] focus:border-[#033C8D]"
            />
          </div>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                <th className="py-3 px-4 min-w-[200px]">College Name</th>
                <th className="py-3 px-4 min-w-[180px]">Authorized Contact</th>
                <th className="py-3 px-4 min-w-[160px]">Proof Document</th>
                <th className="py-3 px-4 min-w-[110px]">Date</th>
                <th className="py-3 px-4 min-w-[100px]">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRegistrations.map((reg) => (
                <tr key={reg.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-900">{reg.collegeName}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{reg.location || 'India'}</p>
                  </td>

                  <td className="py-3 px-4">
                    <p className="font-medium text-slate-900">{reg.contactPerson}</p>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">{reg.email}</p>
                  </td>

                  <td className="py-3 px-4">
                    {reg.proofDocument ? (
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(reg.proofDocument)}
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium cursor-pointer"
                      >
                        <FileText className="h-3 w-3 text-blue-600" />
                        <span className="truncate max-w-[120px]">{reg.proofDocument.name}</span>
                      </button>
                    ) : (
                      <span className="text-slate-400">None</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-slate-500">
                    {reg.registeredAt}
                  </td>

                  <td className="py-3 px-4">
                    <AdminStatusBadge status={reg.status} />
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setSelectedReg(reg)}
                        className="btn btn-primary btn-sm text-xs cursor-pointer font-semibold shadow-2xs"
                      >
                        <Eye className="h-3 w-3" />
                        <span>Review →</span>
                      </button>

                      {reg.status === 'pending' && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedReg(reg)
                              setApproveModalOpen(true)
                            }}
                            className="btn btn-success btn-sm text-xs cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedReg(reg)
                              setRejectModalOpen(true)
                            }}
                            className="btn btn-danger btn-sm text-xs cursor-pointer"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredRegistrations.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-xs text-slate-400">
                    No registration records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer / Inspection Modal for Selected Registration */}
      {selectedReg && !approveModalOpen && !rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedReg(null)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
          />

          <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl sm:max-w-3xl w-full p-6 sm:p-7 z-10 space-y-5 max-h-[92vh] overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-brand-accent text-brand-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Building2 className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-lg font-bold text-slate-900 font-serif">
                      {selectedReg.collegeName}
                    </h3>
                    <AdminStatusBadge status={selectedReg.status} />
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                    <span>
                      Reg ID: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px] font-mono text-slate-700">{selectedReg.id}</code>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      Submitted: {selectedReg.registeredAt || 'Recently'}
                    </span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReg(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Details */}
            <div className="space-y-4 text-xs">
              {/* 1. Institutional Information */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-brand-primary" />
                  <span>1. Institutional Information</span>
                </h4>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Full Registered College Name</span>
                    <span className="font-bold text-slate-900 text-sm block">{selectedReg.collegeName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Assigned System ID / Slug</span>
                    <code className="text-xs font-mono font-semibold text-brand-primary bg-white px-2 py-0.5 rounded border border-slate-200 block truncate">
                      {selectedReg.collegeId || selectedReg.id}
                    </code>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Academic Discipline / Stream</span>
                    <span className="inline-flex items-center gap-1.5 font-semibold text-slate-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                      <GraduationCap className="h-3.5 w-3.5 text-brand-primary" />
                      {selectedReg.stream || 'Engineering & Technology'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Campus / Regional Location</span>
                    <span className="inline-flex items-center gap-1.5 text-slate-800 font-semibold bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                      <MapPin className="h-3.5 w-3.5 text-rose-500" />
                      {selectedReg.location || 'India (Verified)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Authorized Representative Contact */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-brand-primary" />
                  <span>2. Authorized Representative Contact</span>
                </h4>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Representative Name & Role</span>
                    <span className="font-bold text-slate-900 block text-sm">{selectedReg.contactPerson}</span>
                    <span className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                      <Briefcase className="h-3 w-3" />
                      {selectedReg.designation || 'Authorized Representative'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Official Institutional Email</span>
                    <a
                      href={`mailto:${selectedReg.email}`}
                      className="font-medium text-brand-primary hover:underline flex items-center gap-1 text-xs truncate"
                    >
                      <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>{selectedReg.email}</span>
                    </a>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Official Institutional Domain Email</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Official Contact Phone</span>
                    <a
                      href={`tel:${selectedReg.phone}`}
                      className="font-semibold text-slate-800 hover:text-brand-primary flex items-center gap-1 text-xs"
                    >
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      <span>{selectedReg.phone || 'N/A'}</span>
                    </a>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Verification Compliance</span>
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 text-[11px]">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Direct Representative Verification</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. Verification & Accreditation Proof Document */}
              {selectedReg.proofDocument && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-brand-primary" />
                    <span>3. Official Recognition / Accreditation Proof</span>
                  </h4>
                  <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 shadow-2xs">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 text-xs truncate">
                          {selectedReg.proofDocument.name}
                        </p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>
                            {selectedReg.proofDocument.size && !String(selectedReg.proofDocument.size).includes('NaN')
                              ? selectedReg.proofDocument.size
                              : '1.45 MB'}
                          </span>
                          <span>•</span>
                          <span className="uppercase text-[10px] font-semibold text-slate-400">
                            {selectedReg.proofDocument.type || 'application/pdf'}
                          </span>
                          <span>•</span>
                          <span className="text-emerald-600 font-bold text-[10px] inline-flex items-center gap-0.5">
                            <CheckCircle2 className="h-3 w-3" />
                            Authenticated
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(selectedReg.proofDocument)}
                        className="btn btn-primary btn-sm text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-2xs"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View Document</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Notes / Reason (if any) */}
              {selectedReg.notes && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider block">Compliance / Audit Notes</span>
                  <p className="text-xs font-medium">{selectedReg.notes}</p>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="pt-4 flex items-center justify-between border-t border-slate-100 flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedReg(null)}
                className="btn btn-outline btn-md text-xs cursor-pointer"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                {selectedReg.status === 'pending' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setRejectModalOpen(true)}
                      className="btn btn-danger btn-md text-xs cursor-pointer flex items-center gap-1 font-bold"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Reject Request</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setApproveModalOpen(true)}
                      className="btn btn-success btn-md text-xs cursor-pointer flex items-center gap-1 font-bold shadow-2xs"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Approve Registration</span>
                    </button>
                  </>
                ) : selectedReg.status === 'approved' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Registration Approved (Portal Access Granted)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg text-xs font-bold">
                    <XCircle className="h-4 w-4 text-rose-600" />
                    <span>Registration Rejected</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Approval */}
      <AdminModal
        isOpen={approveModalOpen}
        onClose={() => setApproveModalOpen(false)}
        onConfirm={handleConfirmApprove}
        title="Approve College Registration"
        description={`Grant portal access to ${selectedReg?.collegeName}.`}
        confirmText="Approve & Grant Portal Access"
        type="success"
        isLoading={isProcessing}
      >
        <div className="space-y-3 text-xs">
          <p className="text-slate-600">
            You are approving the institutional onboarding request for <strong>{selectedReg?.collegeName}</strong>. This will activate their College Dashboard account and allow the representative to log in.
          </p>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">College:</span>
              <span className="font-bold text-slate-900">{selectedReg?.collegeName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Representative:</span>
              <span className="font-semibold text-slate-800">{selectedReg?.contactPerson} ({selectedReg?.designation || 'Authorized Person'})</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Official Email:</span>
              <span className="font-mono text-brand-primary font-medium">{selectedReg?.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Contact Phone:</span>
              <span className="font-medium text-slate-800">{selectedReg?.phone || 'N/A'}</span>
            </div>
            {selectedReg?.proofDocument && (
              <div className="flex items-center justify-between pt-1 border-t border-slate-200/80">
                <span className="text-slate-400 font-semibold">Verification Proof:</span>
                <span className="font-medium text-purple-700 flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5" />
                  {selectedReg.proofDocument.name}
                </span>
              </div>
            )}
          </div>
        </div>
      </AdminModal>

      {/* Rejection Modal with Feedback Notes */}
      <AdminModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={handleConfirmReject}
        title="Reject College Registration"
        description={`Provide rejection reason for ${selectedReg?.collegeName}.`}
        confirmText="Confirm Reject"
        type="danger"
        isLoading={isProcessing}
      >
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">
            Rejection Reason
          </label>
          <textarea
            rows={3}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Please enter why this registration was rejected..."
            className="w-full text-xs font-medium text-slate-900 border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>
      </AdminModal>

      {/* Document Proof Preview Modal */}
      <DocumentPreviewModal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        documentData={previewDoc}
      />
    </div>
  )
}

export default RegistrationRequestsPage
