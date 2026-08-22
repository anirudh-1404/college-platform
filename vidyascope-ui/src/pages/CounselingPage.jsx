import React, { useState } from 'react'
import {
  ChevronRight, Home, ShieldCheck, CheckCircle2, Phone, Mail, MessageSquare,
  Award, Sparkles, Send, UserCheck, Star, Clock
} from 'lucide-react'
import { testimonialsData, counselorStats } from '../data/testimonialsData'

const CounselingPage = ({ onNavigateHome }) => {
  const [submitted, setSubmitted] = useState(false)
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

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-slate-50/60 pb-28">
      
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-border-color py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs font-semibold text-text-light">
            <button onClick={onNavigateHome} className="hover:text-brand-primary cursor-pointer flex items-center gap-1">
              <Home className="h-3.5 w-3.5" />
              <span>Home</span>
            </button>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="text-text-primary font-bold">1-on-1 Expert Counseling</span>
          </nav>
        </div>
      </div>

      {/* Main Page Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Form (Span 7) */}
          <div className="lg:col-span-7 bg-white border border-border-color rounded-3xl p-6 sm:p-10 shadow-premium">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent text-brand-primary text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              <span>100% Free & Unbiased Service</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
              Get Free Personalized College Counseling
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-2 mb-8 leading-relaxed">
              Fill out your score details to receive a customized admission roadmap, cutoff report, and 1-on-1 advice from experienced alumni.
            </p>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-9 w-9" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-emerald-950">
                  Counseling Slot Booked!
                </h3>
                <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-emerald-950">{formData.fullName}</strong>. Our lead counselor will call you on <strong className="text-emerald-950">{formData.phone}</strong> within 2 business hours with your custom admission report.
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
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-colors cursor-pointer"
                >
                  Submit Another Counseling Query
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1.5">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border-color focus:border-brand-primary focus:ring-2 focus:ring-brand-accent outline-none text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1.5">
                      Phone Number *
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
                    <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border-color focus:border-brand-primary focus:ring-2 focus:ring-brand-accent outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1.5">
                      Targeted Field / Course
                    </label>
                    <select
                      value={formData.stream}
                      onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border-color focus:border-brand-primary focus:ring-2 focus:ring-brand-accent outline-none text-sm bg-white"
                    >
                      <option value="engineering">B.Tech / Engineering</option>
                      <option value="management">MBA / PGDM / BBA</option>
                      <option value="medical">MBBS / BDS / Medical</option>
                      <option value="law">Law (BA LLB)</option>
                      <option value="design">Design & Architecture</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1.5">
                      Entrance Exam Score / Rank
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. JEE Rank 12,500 or CAT 98%"
                      value={formData.targetScore}
                      onChange={(e) => setFormData({ ...formData, targetScore: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border-color focus:border-brand-primary focus:ring-2 focus:ring-brand-accent outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1.5">
                      Budget Range (4 Years)
                    </label>
                    <select
                      value={formData.budgetRange}
                      onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border-color focus:border-brand-primary focus:ring-2 focus:ring-brand-accent outline-none text-sm bg-white"
                    >
                      <option value="under-5">Under ₹5 Lakhs</option>
                      <option value="5-10">₹5 Lakhs – ₹10 Lakhs</option>
                      <option value="10-15">₹10 Lakhs – ₹15 Lakhs</option>
                      <option value="above-15">Above ₹15 Lakhs</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1.5">
                      Admission Session
                    </label>
                    <select
                      value={formData.admissionYear}
                      onChange={(e) => setFormData({ ...formData, admissionYear: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border-color focus:border-brand-primary focus:ring-2 focus:ring-brand-accent outline-none text-sm bg-white"
                    >
                      <option value="2025">2025 Academic Year</option>
                      <option value="2026">2026 Academic Year</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1.5">
                    Any Specific College Preferences or Questions?
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Want options in Bangalore with good hostel facilities..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border-color focus:border-brand-primary focus:ring-2 focus:ring-brand-accent outline-none text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-sm shadow-premium transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  <span>Request Free Counseling Call</span>
                </button>

                <p className="text-[11px] text-text-light text-center">
                  🔒 We respect your privacy. No unwanted spam or paid promotional calls.
                </p>
              </form>
            )}

          </div>

          {/* Right Column: Value Prop & Contact Info (Span 5) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Why Choose VidyaScope Panel */}
            <div className="bg-gradient-to-br from-slate-900 to-navy-dark text-white rounded-3xl p-8 shadow-dark-panel space-y-6">
              <h3 className="font-serif text-2xl font-bold">
                Why 50,000+ Aspirants Trust VidyaScope
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-brand-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-serif text-base">Zero Sponsored Boosts</strong>
                    Every cutoff predictor and recommendation is based strictly on merit and real college data.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <UserCheck className="h-5 w-5 text-brand-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-serif text-base">Alumni Counselors</strong>
                    Interact directly with graduates from top IITs, IIMs, and AIIMS.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-brand-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-serif text-base">2-Hour Rapid Response</strong>
                    Get your personalized counseling report delivered quickly.
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="pt-6 border-t border-slate-800 grid grid-cols-2 gap-4 text-center">
                {counselorStats.slice(0, 2).map((stat) => (
                  <div key={stat.label} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                    <p className="font-serif text-xl font-extrabold text-brand-primary">{stat.value}</p>
                    <p className="text-[11px] text-slate-400 font-semibold">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Contact Cards */}
            <div className="bg-white border border-border-color rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <h4 className="font-serif text-base font-bold text-text-primary">
                Alternate Instant Contact Methods
              </h4>

              <div className="space-y-3">
                <a
                  href="tel:+9118001234567"
                  className="flex items-center gap-3.5 p-3.5 rounded-xl border border-border-color hover:border-brand-primary hover:bg-brand-accent transition-all text-xs font-semibold text-text-primary group"
                >
                  <div className="w-9 h-9 rounded-lg bg-brand-accent text-brand-primary flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-colors">
                    <Phone className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="font-bold">Toll-Free Helpline</p>
                    <p className="text-text-light">+91 1800 123 4567 (Mon-Sat, 9am - 7pm)</p>
                  </div>
                </a>

                <a
                  href="https://wa.me/9118001234567"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3.5 p-3.5 rounded-xl border border-border-color hover:border-emerald-500 hover:bg-emerald-50 transition-all text-xs font-semibold text-text-primary group"
                >
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <MessageSquare className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="font-bold">WhatsApp Admission Desk</p>
                    <p className="text-text-light">Instant query resolution on WhatsApp</p>
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
