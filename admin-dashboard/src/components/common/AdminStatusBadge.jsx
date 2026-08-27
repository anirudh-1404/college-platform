import React from 'react'

export const AdminStatusBadge = ({ status = 'draft' }) => {
  switch (status.toLowerCase()) {
    case 'pending':
    case 'pending_verification':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
          Pending
        </span>
      )

    case 'approved':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          Approved
        </span>
      )

    case 'rejected':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-red-50 text-red-700 border border-red-200">
          Rejected
        </span>
      )

    case 'under_review':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
          Under Review
        </span>
      )

    case 'changes_requested':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-orange-50 text-orange-700 border border-orange-200">
          Changes Requested
        </span>
      )

    case 'published':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          Published
        </span>
      )

    case 'draft':
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
          Draft
        </span>
      )
  }
}

export default AdminStatusBadge
