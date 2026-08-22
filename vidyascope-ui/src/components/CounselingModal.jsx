import React, { useState } from 'react'
import { X, CheckCircle, Send, PhoneCall, Sparkles } from 'lucide-react'

const CounselingModal = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    stream: 'engineering',
    targetYear: '2025',
  })

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const handleReset = () => {
    setSubmitted(false)
    setFormData({
      name: '',
      email: '',
      phone: '',
      stream: 'engineering',
      targetYear: '2025',
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-premium border border-border-color p-6 sm:p-8 z-10 animate-slide-in">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-text-light hover:text-text-primary hover:bg-slate-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="h-9 w-9 animate-bounce" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-text-primary">
              Counseling Request Submitted!
            </h3>
            <p className="text-sm text-text-secondary max-w-sm mx-auto leading-relaxed">
              Thank you, <strong className="text-text-primary">{formData.name}</strong>. One of our certified senior admission counselors will contact you on <strong className="text-text-primary">{formData.phone}</strong> within 2 hours.
            </p>
            <div className="pt-4">
              <button
                onClick={handleReset}
                className="w-full py-3 rounded-xl bg-brand-primary text-white font-bold text-sm hover:bg-brand-primary-hover transition-colors shadow-premium"
              >
                Back to Browsing
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-primary bg-brand-accent px-3 py-1 rounded-full w-max mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>100% Free Consultation</span>
            </div>

            <h3 className="font-serif text-2xl font-extrabold text-text-primary">
              Book Your Free Counseling Session
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary mt-1 mb-6">
              Get personalized college recommendations, cutoff analysis, and fee breakdown from experienced counselors.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="w-full px-4 py-3 rounded-xl border border-border-color focus:border-brand-primary focus:ring-2 focus:ring-brand-accent outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    className="w-full px-4 py-3 rounded-xl border border-border-color focus:border-brand-primary focus:ring-2 focus:ring-brand-accent outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-primary uppercase mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border-color focus:border-brand-primary focus:ring-2 focus:ring-brand-accent outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-primary uppercase mb-1">
                    Target Stream
                  </label>
                  <select
                    value={formData.stream}
                    onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border-color focus:border-brand-primary focus:ring-2 focus:ring-brand-accent outline-none text-sm bg-white"
                  >
                    <option value="engineering">Engineering (B.Tech)</option>
                    <option value="management">Management (MBA / BBA)</option>
                    <option value="medical">Medical (MBBS / BDS)</option>
                    <option value="law">Law (BA LLB)</option>
                    <option value="design">Design & Architecture</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-primary uppercase mb-1">
                    Admission Year
                  </label>
                  <select
                    value={formData.targetYear}
                    onChange={(e) => setFormData({ ...formData, targetYear: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border-color focus:border-brand-primary focus:ring-2 focus:ring-brand-accent outline-none text-sm bg-white"
                  >
                    <option value="2025">2025 Session</option>
                    <option value="2026">2026 Session</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-sm shadow-premium transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span>Confirm Free Call Back</span>
              </button>
            </form>

            <p className="text-[11px] text-text-light text-center mt-4">
              🔒 Your details are 100% safe. No spam calls or promotional unwanted SMS.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}

export default CounselingModal
