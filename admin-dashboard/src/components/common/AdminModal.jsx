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
          className="relative bg-white rounded-2xl border border-border-color shadow-2xl max-w-2xl w-full p-6 z-10 space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar"
        >
          <div className="flex items-center justify-between pb-3 border-b border-border-color">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-brand-primary" />
              <div>
                <h3 className="font-serif text-base font-bold text-text-primary">{title}</h3>
                <p className="text-xs text-text-secondary">{documentData.name} ({documentData.size || '2.4 MB'})</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-text-light hover:text-text-primary hover:bg-slate-100 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Document Content Simulation */}
          <div className="bg-slate-50 border border-border-color rounded-xl p-4 min-h-[300px] flex flex-col items-center justify-center text-center space-y-3">
            {documentData.url ? (
              <img
                src={documentData.url}
                alt="Document preview"
                className="max-h-[350px] w-auto object-contain rounded-lg border border-border-color shadow-sm"
              />
            ) : (
              <div className="p-8 space-y-3 text-text-secondary">
                <FileText className="h-12 w-12 text-brand-primary mx-auto opacity-70" />
                <h4 className="font-bold text-sm text-text-primary">{documentData.name}</h4>
                <p className="text-xs max-w-md mx-auto">
                  Official UGC / AICTE recognition order, state government gazette notification, and university affiliation certificate.
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Digital Signature & Stamp Authenticated</span>
                </div>
              </div>
            )}
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-border-color text-xs">
            <span className="text-text-light">Submitted for Verification Compliance</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => alert(`Downloading ${documentData.name}...`)}
                className="btn btn-outline btn-sm text-xs cursor-pointer flex items-center gap-1"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Proof</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-primary btn-sm text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
