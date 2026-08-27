import React from 'react'
import { Clock, CheckCircle2, AlertTriangle, AlertOctagon, Globe, FileEdit } from 'lucide-react'

export const StatusBadge = ({ status = 'draft', size = 'md' }) => {
  const configs = {
    draft: {
      label: 'Draft',
      bg: 'bg-slate-100',
      text: 'text-text-secondary',
      border: 'border-slate-200',
      icon: FileEdit,
    },
    pending_verification: {
      label: 'Pending Verification',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      icon: Clock,
    },
    under_review: {
      label: 'Under Review',
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-200',
      icon: Clock,
    },
    changes_requested: {
      label: 'Changes Requested',
      bg: 'bg-orange-50',
      text: 'text-orange-800',
      border: 'border-orange-200',
      icon: AlertTriangle,
    },
    published: {
      label: 'Live & Published',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      icon: Globe,
    },
    approved: {
      label: 'Approved',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      icon: CheckCircle2,
    },
    rejected: {
      label: 'Rejected',
      bg: 'bg-rose-50',
      text: 'text-rose-800',
      border: 'border-rose-200',
      icon: AlertOctagon,
    },
  }

  const current = configs[status] || configs.draft
  const Icon = current.icon

  const sizeClasses =
    size === 'sm'
      ? 'text-[10px] px-2 py-0.5'
      : size === 'lg'
      ? 'text-xs px-3 py-1 font-bold'
      : 'text-[11px] px-2.5 py-0.5'

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-md border ${current.bg} ${current.text} ${current.border} ${sizeClasses}`}
    >
      <Icon className="h-3.5 w-3.5 flex-shrink-0" />
      <span>{current.label}</span>
    </span>
  )
}
