import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, Send, PhoneCall, Lock, Loader2, ExternalLink } from 'lucide-react'
import { publicApi } from '../api/publicApi'

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 350, damping: 25 },
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    y: 10,
    transition: { duration: 0.2 },
  },
}

const CounselingModal = ({ isOpen, onClose, context = null }) => {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    stream: context?.stream || '',
    targetYear: '2027',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await publicApi.submitInquiry({
        studentName: formData.name,
        email: formData.email,
        phone: formData.phone,
        stream: formData.stream,
        admissionYear: formData.targetYear,
        source: context?.portalUrl ? 'brochure_download' : 'counseling_modal',
        collegeName: context?.collegeName,
      })
      setSubmitted(true)
    } catch (err) {
      console.error('Failed to submit counseling modal:', err)
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSubmitted(false)
    setFormData({
      name: '',
      email: '',
      phone: '',
      stream: '',
      targetYear: '2027',
    })
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Modal Content with Spring Physics */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-border-color p-6 sm:p-7 z-10"
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-text-light hover:text-text-primary hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </motion.button>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-3"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-text-primary">
                  {context?.portalUrl ? 'Brochure Request Submitted!' : 'Counseling Slot Reserved!'}
                </h3>
                <p className="text-xs text-text-secondary max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong className="text-text-primary">{formData.name}</strong>. {context?.portalUrl ? `Your inquiry has been registered. You can now proceed to the official admission portal of ${context?.collegeName || 'the college'}.` : `An advisor will contact you on ${formData.phone} within 2 business hours.`}
                </p>
                <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                  {context?.portalUrl ? (
                    <a
                      href={context.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-brand-primary text-white font-semibold text-xs hover:bg-brand-primary-hover transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <span>Proceed to Official Admission Portal</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : null}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleReset}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Done
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <div>
                <h3 className="font-serif text-xl font-bold text-text-primary">
                  {context?.title || 'Book Free 1-on-1 Counseling'}
                </h3>
                <p className="text-xs text-text-secondary mt-0.5 mb-5">
                  {context?.collegeName
                    ? `Enter your details to access ${context.collegeName}'s official curriculum brochure and direct admission desk.`
                    : 'Get personalized college recommendations, cutoff analysis, and fee breakdown from verified alumni.'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-text-primary uppercase mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-text-primary uppercase mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-primary uppercase mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="student@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-text-primary uppercase mb-1">
                        Target Stream
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. B.Tech, MBA, MBBS, B.Com..."
                        value={formData.stream}
                        onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-primary uppercase mb-1">
                        Admission Session
                      </label>
                      <select
                        value={formData.targetYear}
                        onChange={(e) => setFormData({ ...formData, targetYear: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
                      >
                        <option value="2027">2027 Session</option>
                        <option value="2028">2028 Session</option>
                        <option value="2029">2029 Session</option>
                        <option value="2030">2030 Session</option>
                      </select>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    type="submit"
                    className="w-full mt-2 py-3 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Confirm Free Call Back</span>
                  </motion.button>
                </form>

                <p className="text-[11px] text-text-light text-center mt-3 flex items-center justify-center gap-1">
                  <Lock className="h-3 w-3" />
                  <span>100% confidential. No spam calls.</span>
                </p>
              </div>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default CounselingModal
