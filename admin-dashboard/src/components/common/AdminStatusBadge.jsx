import React from 'react'

export const AdminStatusBadge = ({ status = 'draft', label: customLabel, showDot = false }) => {
  const norm = (status || '').toLowerCase().replace(/[\s-]/g, '_')

  let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200'
  let dotColor = 'bg-slate-400'
  let defaultLabel = 'Draft'

  switch (norm) {
    case 'pending':
    case 'pending_verification':
      badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200'
      dotColor = 'bg-amber-500'
      defaultLabel = 'Pending Verification'
      break

    case 'under_review':
      badgeStyle = 'bg-[#EBF2FA] text-[#033C8D] border-[#033C8D]/25'
      dotColor = 'bg-[#033C8D]'
      defaultLabel = 'Under Review'
      break

    case 'ready_for_review':
      badgeStyle = 'bg-indigo-50 text-indigo-700 border-indigo-200'
      dotColor = 'bg-indigo-500'
      defaultLabel = 'Ready for Review'
      break

    case 'changes_requested':
      badgeStyle = 'bg-orange-50 text-orange-700 border-orange-200'
      dotColor = 'bg-orange-500'
      defaultLabel = 'Changes Requested'
      break

    case 'published':
    case 'approved':
      badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200'
      dotColor = 'bg-emerald-500'
      defaultLabel = norm === 'approved' ? 'Approved' : 'Published'
      break

    case 'rejected':
      badgeStyle = 'bg-rose-50 text-rose-700 border-rose-200'
      dotColor = 'bg-rose-500'
      defaultLabel = 'Rejected'
      break

    case 'unread':
    case 'new':
      badgeStyle = 'bg-rose-50 text-rose-700 border-rose-200'
      dotColor = 'bg-rose-500'
      defaultLabel = norm === 'new' ? 'New Lead' : 'Unread'
      break

    case 'draft':
    default:
      badgeStyle = 'bg-slate-100 text-slate-600 border-slate-200'
      dotColor = 'bg-slate-400'
      defaultLabel = 'Draft'
      break
  }

  const displayLabel = customLabel || defaultLabel

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-tight border ${badgeStyle}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
      <span>{displayLabel}</span>
    </span>
  )
}

export default AdminStatusBadge
