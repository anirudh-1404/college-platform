import React, { useState, useMemo } from 'react'
import {
  Search,
  CheckCircle2,
  XCircle,
  FileText,
  Eye,
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
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-600"
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
                        <FileText className="h-3 w-3 text-purple-600" />
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
                        className="btn btn-secondary btn-sm text-xs cursor-pointer"
                      >
                        <Eye className="h-3 w-3" />
                        <span>Inspect</span>
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
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
          />

          <div className="relative bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full p-6 z-10 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedReg.collegeName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  ID: {selectedReg.id} • Submitted: {selectedReg.registeredAt}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReg(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Representative</span>
                  <span className="font-bold text-slate-900">{selectedReg.contactPerson}</span>
                  <span className="text-slate-500 block">{selectedReg.designation}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Email & Phone</span>
                  <span className="font-medium text-slate-900 block truncate">{selectedReg.email}</span>
                  <span className="text-slate-500">{selectedReg.phone || 'N/A'}</span>
                </div>
              </div>

              {selectedReg.proofDocument && (
                <div className="p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="font-semibold text-slate-900">{selectedReg.proofDocument.name}</p>
                      <p className="text-[10px] text-slate-500">{selectedReg.proofDocument.size}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPreviewDoc(selectedReg.proofDocument)}
                    className="btn btn-secondary btn-sm text-xs cursor-pointer"
                  >
                    View File
                  </button>
                </div>
              )}
            </div>

            <div className="pt-3 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedReg(null)}
                className="btn btn-outline btn-md text-xs cursor-pointer"
              >
                Close
              </button>

              {selectedReg.status === 'pending' && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRejectModalOpen(true)}
                    className="btn btn-danger btn-md text-xs cursor-pointer"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => setApproveModalOpen(true)}
                    className="btn btn-success btn-md text-xs cursor-pointer"
                  >
                    Approve
                  </button>
                </div>
              )}
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
        confirmText="Approve"
        type="success"
        isLoading={isProcessing}
      >
        <p className="text-slate-600 text-xs">
          This will approve the registration and enable the college to sign in to the College Dashboard.
        </p>
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
