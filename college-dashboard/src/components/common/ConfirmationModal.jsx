import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, CheckCircle2, HelpCircle, X } from 'lucide-react'

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'primary', // 'primary' | 'danger' | 'success'
  isLoading = false,
}) => {
  if (!isOpen) return null

  const getButtonClass = () => {
    if (type === 'danger') return 'btn-danger'
    return 'btn-primary'
  }

  const getIcon = () => {
    if (type === 'danger') return <AlertCircle className="h-6 w-6 text-rose-600" />
    if (type === 'success') return <CheckCircle2 className="h-6 w-6 text-emerald-600" />
    return <HelpCircle className="h-6 w-6 text-brand-primary" />
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
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative bg-white rounded-2xl border border-border-color shadow-2xl max-w-md w-full p-6 z-10 space-y-4"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-50 border border-border-color">
                {getIcon()}
              </div>
              <h3 className="font-serif text-lg font-bold text-text-primary">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-text-light hover:text-text-primary hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{message}</p>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="btn btn-md btn-outline text-xs cursor-pointer"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`btn btn-md ${getButtonClass()} text-xs cursor-pointer`}
            >
              {isLoading ? 'Processing...' : confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
