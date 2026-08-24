import React from 'react'
import { ExternalLink, Save, CheckCircle2 } from 'lucide-react'

export const StatusBadge = ({ status }) => {
  const config = {
    published: {
      label: 'Published Live',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      dot: 'bg-emerald-500',
    },
    'under-review': {
      label: 'Under Review',
      bg: 'bg-amber-50 text-amber-800 border-amber-200/80',
      dot: 'bg-amber-500',
    },
    draft: {
      label: 'Draft Mode',
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      dot: 'bg-slate-400',
    },
  }[status] || {
    label: 'Draft',
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${config.bg}`}>
      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  )
}

export const PageHeader = ({
  title,
  subtitle,
  badge,
  onSave,
  onPreview,
  saveLoading = false,
  savedSuccess = false,
  extraActions,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-color">
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary">
            {title}
          </h1>
          {badge}
        </div>
        {subtitle && (
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
        {extraActions}

        {onPreview && (
          <button
            type="button"
            onClick={onPreview}
            className="btn btn-secondary btn-md cursor-pointer"
          >
            <ExternalLink className="h-4 w-4 text-text-secondary" />
            <span>Preview on Public Site</span>
          </button>
        )}

        {onSave && (
          <button
            type="button"
            onClick={onSave}
            disabled={saveLoading}
            className={`btn btn-primary btn-md cursor-pointer ${
              savedSuccess ? 'bg-emerald-600 border-emerald-600' : ''
            }`}
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Saved Live!</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>{saveLoading ? 'Saving...' : 'Save Changes'}</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export const SectionCard = ({
  title,
  description,
  children,
  actionButton,
  className = '',
}) => {
  return (
    <div className={`bg-white border border-border-color rounded-xl p-5 sm:p-6 space-y-4 shadow-xs ${className}`}>
      {(title || description || actionButton) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            {title && (
              <h2 className="font-serif text-base sm:text-lg font-bold text-text-primary">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-xs text-text-secondary mt-0.5">{description}</p>
            )}
          </div>
          {actionButton && <div>{actionButton}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  )
}

export const UploadCard = ({
  label,
  recommendation,
  currentImage,
  onUpload,
  aspectRatio = 'aspect-video',
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-text-primary uppercase tracking-wider block">
          {label}
        </label>
        {recommendation && (
          <span className="text-[11px] text-text-light font-medium">
            {recommendation}
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 hover:bg-slate-50 transition-colors">
        {currentImage && (
          <div className={`w-32 h-20 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0 border border-border-color ${aspectRatio}`}>
            <img
              src={currentImage}
              alt={label}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="space-y-1 text-center sm:text-left flex-1">
          <p className="text-xs font-semibold text-text-primary">
            Upload new image asset
          </p>
          <p className="text-[11px] text-text-secondary">
            PNG, JPG, WebP up to 5MB. Will be automatically optimized.
          </p>
        </div>

        <button
          type="button"
          onClick={onUpload || (() => alert('File upload dialog (Mock UI). In production, this uploads directly to S3/Cloudinary.'))}
          className="btn btn-secondary btn-sm flex-shrink-0"
        >
          Choose File
        </button>
      </div>
    </div>
  )
}

export const SaveBar = ({ show, onSave, onReset, message = 'You have unsaved edits in this section.' }) => {
  if (!show) return null

  return (
    <div className="sticky bottom-4 z-40 max-w-4xl mx-auto px-4">
      <div className="bg-navy-dark text-white p-3.5 sm:p-4 rounded-xl shadow-xl border border-border-dark flex items-center justify-between gap-4 animate-fade-in">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs font-semibold text-slate-200">
            {message}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              Discard
            </button>
          )}
          <button
            type="button"
            onClick={onSave}
            className="btn btn-primary btn-sm"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  )
}
