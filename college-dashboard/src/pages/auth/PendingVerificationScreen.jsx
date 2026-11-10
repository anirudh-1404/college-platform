import React from 'react'
import { motion } from 'framer-motion'
import { Clock, FileText, LogOut, RefreshCw, Mail } from 'lucide-react'
import logoImg from '../../assets/logo.png'
import { StatusBadge } from '../../components/common/StatusBadge'

const PendingVerificationScreen = ({ user, onCheckStatus, onLogout }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center space-y-3">
        <div className="flex justify-center">
          <img src={logoImg} alt="VidyaScope" className="h-12 w-auto object-contain" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
          <Clock className="h-4 w-4 text-amber-600" />
          <span>Account Registration Under Review</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary">
          Institutional Verification in Progress
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto">
          Thank you for registering <strong className="text-text-primary">{user?.collegeName || 'your college'}</strong>. Our administration board is verifying your official documents.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white py-8 px-6 sm:px-8 border border-border-color rounded-2xl shadow-card space-y-6"
        >
          {/* Progress Timeline */}
          <div className="space-y-4">
            <h3 className="font-serif text-sm font-bold text-text-primary">
              Verification Milestones
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {/* Step 1 */}
              <div className="relative flex items-start gap-3">
                <div className="absolute -left-6 mt-0.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold ring-4 ring-white">
                  ✓
                </div>
                <div>
                  <h4 className="text-xs font-bold text-text-primary">Registration Details Submitted</h4>
                  <p className="text-[11px] text-text-secondary">
                    Official email and contact credentials recorded on {user?.registeredAt || '24 Aug 2026'}.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex items-start gap-3">
                <div className="absolute -left-6 mt-0.5 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold ring-4 ring-white animate-pulse">
                  2
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-800">Admin Document Verification (Active)</h4>
                  <p className="text-[11px] text-text-secondary">
                    The VidyaScope compliance team is reviewing the uploaded recognition documents. Expected turnaround: 24–48 working hours.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex items-start gap-3 opacity-60">
                <div className="absolute -left-6 mt-0.5 w-5 h-5 rounded-full bg-slate-300 text-white flex items-center justify-center text-[10px] font-bold ring-4 ring-white">
                  3
                </div>
                <div>
                  <h4 className="text-xs font-bold text-text-primary">College Dashboard Activated</h4>
                  <p className="text-[11px] text-text-secondary">
                    Full onboarding access will be unlocked automatically upon verification.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Uploaded Proof Details Card */}
          {user?.registrationProof && (
            <div className="p-4 rounded-xl bg-slate-50 border border-border-color space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-light">
                Submitted Proof Document
              </span>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-brand-accent text-brand-primary flex items-center justify-center">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-primary">{user.registrationProof.name}</p>
                    <p className="text-[11px] text-text-light">{user.registrationProof.size} • Uploaded {user.registrationProof.uploadedAt}</p>
                  </div>
                </div>
                <StatusBadge status="pending_verification" size="sm" />
              </div>
            </div>
          )}

          {/* Support / Quick Help Note */}
          <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-100 flex items-start gap-2.5 text-xs text-text-secondary">
            <Mail className="h-4 w-4 text-brand-primary flex-shrink-0 mt-0.5" />
            <p>
              Need expedited onboarding for your campus admissions cycle? Contact the institutional verification desk at{' '}
              <a href="mailto:info@vidyascope.com" className="text-brand-primary font-bold hover:underline">
                info@vidyascope.com
              </a>.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border-color">
            <button
              type="button"
              onClick={onLogout}
              className="btn btn-outline btn-sm text-xs cursor-pointer w-full sm:w-auto"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>

            <button
              type="button"
              onClick={onCheckStatus}
              className="btn btn-primary btn-md text-xs cursor-pointer w-full sm:w-auto"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Refresh Status</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default PendingVerificationScreen
