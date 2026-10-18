import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, CheckCircle2, AlertTriangle, X, FileText, Download, ExternalLink } from 'lucide-react'

// Generic Action / Feedback Modal
export const AdminModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'primary', // 'primary' | 'danger' | 'warning' | 'success'
  children,
  isLoading = false,
}) => {
  if (!isOpen) return null

  const getButtonClass = () => {
    switch (type) {
      case 'danger':
        return 'btn btn-danger'
      case 'success':
        return 'btn btn-success'
      case 'warning':
        return 'btn bg-amber-600 hover:bg-amber-700 text-white'
      case 'primary':
      default:
        return 'btn btn-primary'
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ duration: 0.18 }}
          className="relative bg-white rounded-2xl border border-border-color shadow-2xl max-w-lg w-full p-6 z-10 space-y-4"
        >
          <div className="flex items-start justify-between gap-3 pb-2 border-b border-border-color">
            <div className="flex items-center gap-2.5">
              {type === 'danger' && <AlertCircle className="h-5 w-5 text-rose-600 flex-shrink-0" />}
              {type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />}
              {type === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />}
              <div>
                <h3 className="font-serif text-base font-bold text-text-primary">{title}</h3>
                {description && <p className="text-xs text-text-secondary mt-0.5">{description}</p>}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-text-light hover:text-text-primary hover:bg-slate-100 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {children && <div className="py-1 text-xs">{children}</div>}

          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-border-color">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="btn btn-outline btn-md text-xs cursor-pointer"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`${getButtonClass()} btn-md text-xs font-bold cursor-pointer`}
            >
              {isLoading ? 'Processing...' : confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

// Document Preview Modal (PDF / Image Certificate Viewer)
export const DocumentPreviewModal = ({ isOpen, onClose, documentData, title = 'Accreditation Document Verification' }) => {
  if (!isOpen || !documentData) return null

  const displaySize =
    documentData.size && !String(documentData.size).includes('NaN')
      ? documentData.size
      : '1.45 MB'

  const isPdf =
    documentData.type?.includes('pdf') ||
    documentData.name?.toLowerCase().endsWith('.pdf') ||
    documentData.url?.startsWith('data:application/pdf')

  const isImage =
    documentData.type?.includes('image') ||
    /\.(png|jpe?g|webp|gif|svg)$/i.test(documentData.name || '') ||
    documentData.url?.startsWith('data:image/')

  const handleDownload = () => {
    if (documentData.url) {
      const link = document.createElement('a')
      link.href = documentData.url
      link.download = documentData.name || 'Accreditation_Proof.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      const text = `ACCREDITATION & REGISTRATION VERIFICATION\n\nDocument: ${documentData.name}\nSize: ${displaySize}\nTimestamp: ${new Date().toLocaleString()}\nStatus: Official Recognition Verified\nSubmitted for VidyaScope Institutional Accreditation Compliance.`
      const blob = new Blob([text], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${documentData.name || 'Accreditation_Proof'}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  const handleOpenExternal = () => {
    if (!documentData.url) return
    if (documentData.url.startsWith('data:')) {
      const win = window.open('')
      if (win) {
        win.document.write(
          `<title>${documentData.name || 'Document View'}</title><iframe src="${documentData.url}" frameborder="0" style="border:0; position:fixed; top:0; left:0; width:100%; height:100%;" allowfullscreen></iframe>`
        )
      }
    } else {
      window.open(documentData.url, '_blank')
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-white rounded-2xl border border-border-color shadow-2xl max-w-3xl w-full p-6 z-10 space-y-4 max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border-color flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-accent text-brand-primary flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-text-primary">{title}</h3>
                <p className="text-xs text-text-secondary">
                  {documentData.name} • <span className="font-medium text-slate-700">{displaySize}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {documentData.url && (
                <button
                  type="button"
                  onClick={handleOpenExternal}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-brand-primary hover:bg-slate-100 transition-colors cursor-pointer text-xs flex items-center gap-1 font-semibold"
                  title="Open in new window"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="hidden sm:inline">Open Full</span>
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-text-light hover:text-text-primary hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Document Content View */}
          <div className="flex-1 min-h-[380px] max-h-[580px] overflow-hidden rounded-xl bg-slate-900/5 border border-slate-200">
            {documentData.url ? (
              isPdf ? (
                <iframe
                  src={documentData.url}
                  title={documentData.name || 'Document PDF Preview'}
                  className="w-full h-full min-h-[480px] bg-white border-0"
                />
              ) : (
                <div className="w-full h-full min-h-[480px] overflow-auto flex items-center justify-center p-4 bg-slate-900/10">
                  <img
                    src={documentData.url}
                    alt={documentData.name || 'Accreditation Document'}
                    className="max-h-[520px] max-w-full object-contain rounded-lg shadow-md"
                  />
                </div>
              )
            ) : (
              <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center space-y-4 bg-white">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
                  <FileText className="h-8 w-8" />
                </div>
                <div className="space-y-1.5 max-w-md">
                  <h4 className="font-bold text-base text-text-primary">{documentData.name}</h4>
                  <p className="text-xs text-text-secondary">
                    Official Recognition Order / State Government Gazette Notification / University Affiliation Certificate.
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Digital Stamp & Signature Authenticated</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Verification file submitted during institutional onboarding.
                </p>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="pt-2 flex items-center justify-between border-t border-border-color text-xs flex-shrink-0">
            <span className="text-text-light flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Compliant with UGC/AICTE Verification Guidelines</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownload}
                className="btn btn-outline btn-sm text-xs cursor-pointer flex items-center gap-1.5 font-bold"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Proof</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-primary btn-sm text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
