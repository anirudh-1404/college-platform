import React, { useState } from 'react'
import {
  ChevronRight, Home, ShieldCheck, CheckCircle2, Phone, Mail,
  UserCheck, Clock, Send, PhoneCall, Lock, Loader2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { publicApi } from '../api/publicApi'
import { fadeInUp } from '../utils/animations'

const CounselingPage = ({ onNavigateHome }) => {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    stream: 'engineering',
    targetScore: '',
    preferredLocation: '',
    budgetRange: 'under-10',
    admissionYear: '2025',
    notes: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await publicApi.submitInquiry({
        studentName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        stream: formData.stream,
        targetScore: formData.targetScore,
        preferredLocation: formData.preferredLocation,
        budgetRange: formData.budgetRange,
        admissionYear: formData.admissionYear,
        notes: formData.notes,
        source: 'counseling_page',
      })
      setSubmitted(true)
    } catch (err) {
      console.error('Failed to submit counseling page:', err)
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-border-color py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs font-semibold text-text-light">
            <button
              onClick={onNavigateHome}
              className="hover:text-brand-primary cursor-pointer flex items-center gap-1"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Home</span>
            </button>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="text-text-primary font-bold">1-on-1 Admissions Counseling</span>
          </nav>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Counseling Request Form (Span 7) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:col-span-7 bg-white border border-border-color rounded-2xl p-6 sm:p-8 shadow-xs"
          >
            
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary">
              Personalized Admissions Guidance
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-1 mb-6 leading-relaxed">
              Share your score and target branch to receive an objective college roadmap and 1-on-1 counseling from verified alumni.
            </p>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success-box"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center space-y-3"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto"
                  >
                    <CheckCircle2 className="h-6 w-6" />
                  </motion.div>
                  <h3 className="font-serif text-xl font-bold text-emerald-950">
                    Counseling Request Received
                  </h3>
                  <p className="text-xs text-emerald-800 max-w-sm mx-auto leading-relaxed">
                    Thank you, <strong className="text-emerald-950">{formData.fullName}</strong>. An advisor will contact you on <strong className="text-emerald-950">{formData.phone}</strong> within 2 business hours with your personalized cutoff and college report.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false)
                      setFormData({
                        fullName: '',
                        phone: '',
                        email: '',
                        stream: 'engineering',
                        targetScore: '',
                        preferredLocation: '',
                        budgetRange: 'under-10',
                        admissionYear: '2025',
                        notes: '',
                      })
                    }}
                    className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Submit Another Query
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form-box"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                <div>
                  <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                      Target Discipline
                    </label>
                    <select
                      value={formData.stream}
                      onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
                    >
                      <option value="engineering">Engineering (B.Tech / M.Tech)</option>
                      <option value="management">Management (MBA / PGDM)</option>
                      <option value="medical">Medical (MBBS / BDS)</option>
                      <option value="law">Law (BA LLB)</option>
                      <option value="applied-sciences">Applied Sciences (B.Sc / BA)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                      Entrance Exam Score / Rank
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. JEE Rank 14,000 or CAT 98%"
                      value={formData.targetScore}
                      onChange={(e) => setFormData({ ...formData, targetScore: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                      Budget Range (Total Fees)
                    </label>
                    <select
                      value={formData.budgetRange}
                      onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
                    >
                      <option value="under-5">Under ₹5 Lakhs</option>
                      <option value="5-10">₹5 Lakhs – ₹10 Lakhs</option>
                      <option value="10-15">₹10 Lakhs – ₹15 Lakhs</option>
                      <option value="above-15">Above ₹15 Lakhs</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                      Admission Session
                    </label>
                    <select
                      value={formData.admissionYear}
                      onChange={(e) => setFormData({ ...formData, admissionYear: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
                    >
                      <option value="2025">2025 – 2026 Academic Year</option>
                      <option value="2026">2026 – 2027 Academic Year</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                    Specific Queries or Preferences
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Seeking options in Maharashtra with good computer science placements..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  <span>Request Free Counseling Call</span>
                </button>

                <p className="text-[11px] text-text-light text-center flex items-center justify-center gap-1">
                  <Lock className="h-3 w-3" />
                  <span>Your information is kept 100% confidential. No spam or promotional calls.</span>
                </p>
              </motion.form>
            )}
            </AnimatePresence>

          </motion.div>

          {/* Right Column: Trust Proof & Direct Helpline (Span 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Why VidyaScope Advisory */}
            <div className="bg-navy-dark text-white rounded-2xl p-6 sm:p-7 border border-border-dark space-y-5">
              <h3 className="font-serif text-xl font-bold">
                Why Aspirants Trust VidyaScope
              </h3>

              <div className="space-y-3.5 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="h-4.5 w-4.5 text-brand-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-serif text-sm">Zero Sponsored Bias</strong>
                    Every cutoff predictor and recommendation is based strictly on merit and official institutional disclosures.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <UserCheck className="h-4.5 w-4.5 text-brand-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-serif text-sm">Alumni Counselors</strong>
                    Interact directly with graduates from top IITs, IIMs, and AIIMS.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="h-4.5 w-4.5 text-brand-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-serif text-sm">Rapid Response</strong>
                    Personalized counseling report delivered within 2 business hours.
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Helpline Card */}
            <div className="bg-white border border-border-color rounded-2xl p-5 space-y-3">
              <h4 className="font-serif text-sm font-bold text-text-primary">
                Direct Contact Channels
              </h4>

              <div className="space-y-2">
                <a
                  href="tel:+9118001234567"
                  className="flex items-center gap-3 p-3 rounded-xl border border-border-color hover:border-brand-primary hover:bg-brand-accent transition-colors text-xs text-text-primary group"
                >
                  <div className="w-8 h-8 rounded-lg bg-brand-accent text-brand-primary flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-colors">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold">Toll-Free Helpline</p>
                    <p className="text-text-light text-[11px]">1800 123 4567 (Mon-Sat, 9am - 7pm)</p>
                  </div>
                </a>

                <a
                  href="mailto:counseling@vidyascope.com"
                  className="flex items-center gap-3 p-3 rounded-xl border border-border-color hover:border-brand-primary hover:bg-brand-accent transition-colors text-xs text-text-primary group"
                >
                  <div className="w-8 h-8 rounded-lg bg-brand-accent text-brand-primary flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-colors">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold">Email Advisory</p>
                    <p className="text-text-light text-[11px]">counseling@vidyascope.com</p>
                  </div>
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  )
}

export default CounselingPage
