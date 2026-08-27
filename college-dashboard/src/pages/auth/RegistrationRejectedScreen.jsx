import React from 'react'
import { motion } from 'framer-motion'
import { AlertOctagon, RefreshCw, Mail, LogOut } from 'lucide-react'
import logoImg from '../../assets/logo.png'

const RegistrationRejectedScreen = ({ user, onReRegister, onLogout }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center space-y-3">
        <div className="flex justify-center">
          <img src={logoImg} alt="VidyaScope" className="h-12 w-auto object-contain" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold">
          <AlertOctagon className="h-4 w-4 text-rose-600" />
          <span>Registration Verification Rejected</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary">
          Verification Could Not Be Completed
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto">
          The registration submission for <strong className="text-text-primary">{user?.collegeName || 'your college'}</strong> was reviewed and rejected by the VidyaScope Verification Board.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white py-8 px-6 sm:px-8 border border-border-color rounded-2xl shadow-card space-y-6"
        >
          {/* Rejection Reason Notice */}
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-2 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800">
              Admin Board Feedback & Reason
            </span>
            <p className="text-rose-950 font-medium leading-relaxed">
              {user?.rejectionReason || 'The uploaded recognition certificate could not be authenticated against the central university/regulatory portal. Please provide valid official gazette documents.'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-border-color flex items-start gap-2.5 text-xs text-text-secondary">
            <Mail className="h-4 w-4 text-brand-primary flex-shrink-0 mt-0.5" />
            <p>
              If you believe this is a clerical error, you can submit a fresh registration with updated documents or write to{' '}
              <a href="mailto:support@vidyascope.com" className="text-brand-primary font-bold hover:underline">
                support@vidyascope.com
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
              onClick={onReRegister}
              className="btn btn-primary btn-md text-xs cursor-pointer w-full sm:w-auto"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Submit Fresh Registration</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default RegistrationRejectedScreen
