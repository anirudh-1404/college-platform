import React, { useState, useMemo } from 'react'
import {
  MapPin, Star, Heart, Scale, Calculator, ShieldCheck, Building2, Users,
  Check, AlertCircle, Layers, GraduationCap, Lock, Send, Eye
} from 'lucide-react'
import { ConfirmationModal } from '../../components/common/ConfirmationModal'
import { StatusBadge } from '../../components/common/StatusBadge'

const Step10ReviewPreview = ({
  collegeData,
  onSubmitForApproval,
  onNavigateStep,
  isReadOnly = false,
}) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [calculatorTenure, setCalculatorTenure] = useState(4)
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const tabs = [
    { id: 'overview', label: 'Overview & Facts' },
    { id: 'courses', label: 'Courses & Fees' },
    { id: 'cutoffs', label: 'Cutoffs & Eligibility' },
    { id: 'placements', label: 'Placements' },
    { id: 'roi', label: 'ROI & Fee Breakdown' },
    { id: 'reviews', label: 'Reviews & Pros/Cons' },
    { id: 'gallery', label: 'Campus Gallery' },
  ]

  // Calculate estimated total expenditure dynamically for ROI tab
  const annualTotalCost = useMemo(() => {
    if (!collegeData.hiddenCosts) return 0
    const {
      tuitionFeePerYear = 0,
      hostelRentYearly = 0,
      messChargesYearly = 0,
      examinationMiscYearly = 0,
    } = collegeData.hiddenCosts
    return (
      tuitionFeePerYear +
      hostelRentYearly +
      messChargesYearly +
      examinationMiscYearly
    )
  }, [collegeData.hiddenCosts])

  const estimatedTotalCost = useMemo(() => {
    const caution = collegeData.hiddenCosts?.cautionDepositOneTime || 0
    return (annualTotalCost * calculatorTenure + caution) / 100000 // In Lakhs
  }, [annualTotalCost, calculatorTenure, collegeData.hiddenCosts])

  // Profile readiness checklist
  const validationChecklist = useMemo(() => {
    return [
      { step: 1, label: 'Basic Information & Branding', valid: !!(collegeData.name && collegeData.shortName && collegeData.establishmentYear) },
      { step: 2, label: 'Location & Official Contact', valid: !!(collegeData.city && collegeData.state && collegeData.admissionEmail) },
      { step: 3, label: 'Academic Courses & Fees', valid: (collegeData.coursesOffered?.length || 0) > 0, detail: `${collegeData.coursesOffered?.length || 0} courses added` },
      { step: 4, label: 'Admissions & Exam Criteria', valid: (collegeData.examAccepted?.length || 0) > 0, detail: `${collegeData.examAccepted?.length || 0} exams accepted` },
      { step: 5, label: 'Cutoff Ranks Matrix', valid: (collegeData.admissionCutoffs?.length || 0) > 0, detail: `${collegeData.admissionCutoffs?.length || 0} records` },
      { step: 6, label: 'Placements & Hiring Partners', valid: !!(collegeData.placements?.avgPackage && collegeData.placements?.placementRate) },
      { step: 7, label: 'Rankings & Accreditations', valid: !!(collegeData.nirfRank || (collegeData.rankings?.length || 0) > 0) },
      { step: 8, label: 'Facilities & ROI Cost Structure', valid: (collegeData.facilities?.length || 0) > 0 && !!collegeData.hiddenCosts },
      { step: 9, label: 'Campus Photography Gallery', valid: (collegeData.gallery?.length || 0) > 0, detail: `${collegeData.gallery?.length || 0} photos` },
    ]
  }, [collegeData])

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true)
    try {
      await onSubmitForApproval()
      setConfirmSubmitOpen(false)
    } catch (e) {
      console.error(e)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* 1. Review & Submission Banner */}
      <div className="bg-white border border-border-color rounded-2xl p-6 shadow-card space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-brand-accent text-brand-primary">
                <Eye className="h-5 w-5" />
              </span>
              <h2 className="font-serif text-xl font-bold text-text-primary">
                Public Profile Preview & Final Review
              </h2>
              <StatusBadge status={collegeData.profileStatus || 'draft'} />
            </div>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              This preview matches the exact layout, metrics, and information hierarchy rendered on VidyaScope public website.
            </p>
          </div>

          {!isReadOnly && (
            <button
              type="button"
              onClick={() => setConfirmSubmitOpen(true)}
              className="btn btn-primary btn-lg text-xs sm:text-sm font-bold shadow-md cursor-pointer flex-shrink-0"
            >
              <Send className="h-4 w-4" />
              <span>Send Profile for Approval</span>
            </button>
          )}
        </div>

        {/* Validation Checklist Strip */}
        <div className="pt-4 border-t border-border-color">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-text-primary">Profile Completeness Check</span>
            <span className="text-xs font-semibold text-brand-primary">
              {validationChecklist.filter((c) => c.valid).length} / {validationChecklist.length} Sections Complete
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {validationChecklist.map((item) => (
              <button
                key={item.step}
                type="button"
                onClick={() => onNavigateStep && onNavigateStep(item.step)}
                className={`p-2 rounded-lg text-left border text-[11px] transition-colors cursor-pointer ${
                  item.valid
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50/70 border-amber-200 text-amber-900'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold">
                  {item.valid ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" />
                  )}
                  <span className="truncate">Step {item.step}</span>
                </div>
                <p className="text-[10px] text-text-secondary truncate mt-0.5">{item.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Public College Detail Preview Canvas (High Fidelity) */}
      <div className="border border-border-color rounded-2xl overflow-hidden bg-slate-50 shadow-md">
        
        {/* Preview Notice Header */}
        <div className="bg-navy-dark text-white px-4 py-2 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono text-[11px] text-slate-300">
              Live Public Preview Simulator • https://vidyascope.com/colleges/{collegeData.id || 'iit-bombay'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold">VidyaScope UI View</span>
        </div>

        {/* Public Header Banner */}
        <div className="bg-white border-b border-border-color py-6 sm:py-8 px-4 sm:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Left: Image & Titles */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-100 border border-border-color flex-shrink-0">
                <img
                  src={collegeData.image || collegeData.logo}
                  alt={collegeData.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-md bg-brand-primary text-white text-[11px] font-bold uppercase">
                    NIRF #{collegeData.nirfRank || '3'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-text-secondary text-[11px] font-semibold">
                    {collegeData.ownership || 'Government'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
                    Est. {collegeData.establishmentYear || '1958'}
                  </span>
                </div>

                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary">
                  {collegeData.name}
                </h1>

                <p className="flex items-center gap-2 text-xs sm:text-sm text-text-light font-medium mt-1">
                  <MapPin className="h-4 w-4 text-brand-primary flex-shrink-0" />
                  <span>{collegeData.location || 'Mumbai, Maharashtra'}</span>
                  <span>•</span>
                  <span>Campus: {collegeData.campusArea || '550 Acres'}</span>
                </p>
              </div>
            </div>

            {/* Right Public Action Buttons Mock */}
            <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
              <div className="btn btn-sm btn-outline pointer-events-none opacity-80">
                <Heart className="h-4 w-4" />
                <span>Save</span>
              </div>
              <div className="btn btn-sm btn-outline pointer-events-none opacity-80">
                <Scale className="h-4 w-4" />
                <span>Compare</span>
              </div>
              <div className="btn btn-primary btn-md pointer-events-none opacity-90">
                <span>Get Free Counseling</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 border border-border-color rounded-xl mt-6">
            <div>
              <p className="text-[10px] font-semibold text-text-light uppercase tracking-wider">
                Average Package
              </p>
              <p className="text-base sm:text-lg font-extrabold text-emerald-600 mt-0.5">
                {collegeData.avgPackage || collegeData.placements?.avgPackage || '₹24.5 LPA'}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-text-light uppercase tracking-wider">
                Total Tuition Fees
              </p>
              <p className="text-base sm:text-lg font-bold text-text-primary mt-0.5">
                {collegeData.totalFees || '₹8.94 Lakhs'} ({collegeData.feesPeriod || '4 Yrs'})
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-text-light uppercase tracking-wider">
                Highest Placement
              </p>
              <p className="text-base sm:text-lg font-bold text-brand-primary mt-0.5">
                {collegeData.highestPackage || collegeData.placements?.highestDomestic || '₹1.50 Cr PA'}
              </p>
            </div>
            <div className="relative">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold text-text-light uppercase tracking-wider">
                  Student Rating
                </p>
                <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1 rounded">
                  <Lock className="h-2.5 w-2.5" /> Platform
                </span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-base sm:text-lg font-bold text-text-primary">
                  {collegeData.rating || 4.9}
                </span>
                <span className="text-xs text-text-light font-medium">
                  ({collegeData.reviewsCount || 2450})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-border-color px-4 sm:px-8 py-2">
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === tab.id
                    ? 'bg-brand-primary text-white font-bold'
                    : 'text-text-secondary hover:text-brand-primary hover:bg-brand-accent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-4 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2 Columns: Active Tab Content */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="bg-white border border-border-color rounded-xl p-6 space-y-4">
                    <h3 className="font-serif text-xl font-bold text-text-primary">
                      About {collegeData.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                      {collegeData.description || 'Institutional overview narrative...'}
                    </p>

                    {collegeData.snapshot && (
                      <div className="pt-4 border-t border-border-color grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                        <div className="flex items-start gap-2">
                          <ShieldCheck className="h-4 w-4 text-brand-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-text-primary">Accreditation: </strong>
                            <span className="text-text-secondary">{collegeData.snapshot.accreditation}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Users className="h-4 w-4 text-brand-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-text-primary">Faculty: </strong>
                            <span className="text-text-secondary">{collegeData.snapshot.totalFaculty}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Building2 className="h-4 w-4 text-brand-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-text-primary">Hostel Capacity: </strong>
                            <span className="text-text-secondary">{collegeData.snapshot.hostelCapacity}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Layers className="h-4 w-4 text-brand-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-text-primary">Gender Ratio: </strong>
                            <span className="text-text-secondary">{collegeData.snapshot.genderRatio}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Facilities */}
                  <div className="bg-white border border-border-color rounded-xl p-6">
                    <h4 className="font-serif text-lg font-bold text-text-primary mb-3">
                      Campus Facilities & Infrastructure
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {(collegeData.facilities || []).map((fac) => (
                        <div
                          key={fac}
                          className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-border-color text-xs font-semibold text-text-primary"
                        >
                          <Check className="h-4 w-4 text-emerald-600" />
                          <span>{fac}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: COURSES */}
              {activeTab === 'courses' && (
                <div className="bg-white border border-border-color rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xl font-bold text-text-primary">
                      Courses Offered & Fee Structure
                    </h3>
                    <span className="text-xs font-bold text-brand-primary bg-brand-accent px-2.5 py-1 rounded-md">
                      {collegeData.coursesOffered?.length || 0} Programs
                    </span>
                  </div>

                  <div className="space-y-3">
                    {(collegeData.coursesOffered || []).map((course) => (
                      <div
                        key={course.id}
                        className="p-4 rounded-xl border border-border-color bg-slate-50/60 space-y-2.5"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                          <div>
                            <span className="text-[10px] font-bold text-brand-primary uppercase">
                              {course.degreeLevel || 'Degree Program'}
                            </span>
                            <h4 className="font-serif text-base font-bold text-text-primary">
                              {course.name}
                            </h4>
                          </div>
                          <span className="text-xs font-bold text-text-primary bg-white border border-border-color px-2.5 py-1 rounded-md self-start sm:self-auto">
                            {course.fee} Total
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-text-secondary pt-2 border-t border-border-color">
                          <div>
                            <strong className="text-text-primary">Duration:</strong> {course.duration}
                          </div>
                          <div>
                            <strong className="text-text-primary">Seats:</strong> {course.seatIntake}
                          </div>
                          <div>
                            <strong className="text-text-primary">Avg Package:</strong> {course.avgSalary}
                          </div>
                        </div>

                        <p className="text-xs text-text-secondary">
                          <strong className="text-text-primary">Eligibility:</strong> {course.eligibility}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: CUTOFFS */}
              {activeTab === 'cutoffs' && (
                <div className="bg-white border border-border-color rounded-xl p-6 space-y-4">
                  <h3 className="font-serif text-xl font-bold text-text-primary">
                    Entrance Exam Cutoff Ranks (2024–25)
                  </h3>
                  <p className="text-xs text-text-secondary">
                    Opening and closing ranks for general, OBC, and SC/ST categories based on official seat allocation rounds.
                  </p>

                  <div className="overflow-x-auto border border-border-color rounded-xl">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-border-color text-text-primary font-bold">
                          <th className="py-3 px-3.5">Entrance Exam</th>
                          <th className="py-3 px-3.5">Branch / Course</th>
                          <th className="py-3 px-3.5">General Cutoff</th>
                          <th className="py-3 px-3.5">OBC Cutoff</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-color">
                        {(collegeData.admissionCutoffs || []).map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="py-3 px-3.5 font-bold text-brand-primary">{item.exam}</td>
                            <td className="py-3 px-3.5 font-semibold text-text-primary">{item.course}</td>
                            <td className="py-3 px-3.5 text-emerald-600 font-bold">{item.generalCutoff}</td>
                            <td className="py-3 px-3.5 text-text-secondary">{item.obcCutoff}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: PLACEMENTS */}
              {activeTab === 'placements' && (
                <div className="bg-white border border-border-color rounded-xl p-6 space-y-5">
                  <h3 className="font-serif text-xl font-bold text-text-primary">
                    Placement Records & Top Recruiters
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
                      <p className="text-[11px] font-bold text-emerald-800 uppercase">Highest Domestic</p>
                      <p className="text-lg font-bold text-emerald-700 mt-0.5">
                        {collegeData.placements?.highestDomestic || '₹1.50 Cr PA'}
                      </p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-100 text-center">
                      <p className="text-[11px] font-bold text-brand-primary uppercase">Average Package</p>
                      <p className="text-lg font-bold text-brand-primary mt-0.5">
                        {collegeData.placements?.avgPackage || '₹24.5 LPA'}
                      </p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-border-color text-center col-span-2 sm:col-span-1">
                      <p className="text-[11px] font-bold text-text-secondary uppercase">Placement Rate</p>
                      <p className="text-lg font-bold text-text-primary mt-0.5">
                        {collegeData.placements?.placementRate || 98}%
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-serif text-sm font-bold text-text-primary mb-2.5">
                      Top Visiting Recruiters
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(collegeData.placements?.topRecruiters || []).map((rec) => (
                        <span
                          key={rec}
                          className="px-3 py-1 rounded-lg bg-slate-100 text-text-primary text-xs font-semibold border border-border-color"
                        >
                          {rec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: ROI CALCULATOR */}
              {activeTab === 'roi' && (
                <div className="bg-white border border-border-color rounded-xl p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-text-primary">
                        ROI & Hidden Cost Calculator
                      </h3>
                      <p className="text-xs text-text-secondary mt-0.5">
                        Estimates complete college expenditure including hostel, food, caution deposit vs starting salary.
                      </p>
                    </div>
                    <Calculator className="h-6 w-6 text-brand-primary flex-shrink-0" />
                  </div>

                  {/* Duration Picker */}
                  <div className="flex items-center gap-2 text-xs font-semibold text-text-primary">
                    <span>Program Tenure:</span>
                    {[2, 4, 5].map((yrs) => (
                      <button
                        key={yrs}
                        type="button"
                        onClick={() => setCalculatorTenure(yrs)}
                        className={`px-3 py-1 rounded-lg border transition-colors cursor-pointer ${
                          calculatorTenure === yrs
                            ? 'bg-brand-primary text-white border-brand-primary font-bold'
                            : 'bg-slate-50 text-text-secondary border-border-color hover:bg-slate-100'
                        }`}
                      >
                        {yrs} Years
                      </button>
                    ))}
                  </div>

                  {collegeData.hiddenCosts && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-border-color space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="flex justify-between py-1 border-b border-border-color">
                          <span className="text-text-secondary">Tuition Fee ({calculatorTenure} Yrs):</span>
                          <span className="font-bold text-text-primary">
                            ₹{(((collegeData.hiddenCosts.tuitionFeePerYear || 0) * calculatorTenure) / 100000).toFixed(2)} L
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-border-color">
                          <span className="text-text-secondary">Hostel Rent ({calculatorTenure} Yrs):</span>
                          <span className="font-bold text-text-primary">
                            ₹{(((collegeData.hiddenCosts.hostelRentYearly || 0) * calculatorTenure) / 100000).toFixed(2)} L
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-border-color">
                          <span className="text-text-secondary">Mess & Food ({calculatorTenure} Yrs):</span>
                          <span className="font-bold text-text-primary">
                            ₹{(((collegeData.hiddenCosts.messChargesYearly || 0) * calculatorTenure) / 100000).toFixed(2)} L
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-border-color">
                          <span className="text-text-secondary">Caution Money (One-Time):</span>
                          <span className="font-bold text-text-primary">
                            ₹{((collegeData.hiddenCosts.cautionDepositOneTime || 0) / 100000).toFixed(2)} L
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border-color">
                        <div>
                          <p className="text-[10px] text-text-light font-bold uppercase">Estimated Total Cost</p>
                          <p className="text-xl font-bold text-brand-primary">₹{estimatedTotalCost.toFixed(2)} Lakhs</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-text-light font-bold uppercase">Expected Avg Package</p>
                          <p className="text-xl font-bold text-emerald-600">{collegeData.avgPackage || '₹24.5 LPA'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: REVIEWS (Platform Generated - Locked) */}
              {activeTab === 'reviews' && (
                <div className="bg-white border border-border-color rounded-xl p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xl font-bold text-text-primary">
                      Verified Student Pros & Cons
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                      <Lock className="h-3 w-3" /> Platform Managed (Locked)
                    </span>
                  </div>

                  {collegeData.prosAndCons && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 space-y-2">
                        <h4 className="font-serif text-sm font-bold text-emerald-900 flex items-center gap-1.5">
                          <Check className="h-4 w-4 text-emerald-600" />
                          <span>Key Advantages (Pros)</span>
                        </h4>
                        <ul className="space-y-1.5 text-xs text-emerald-950">
                          {collegeData.prosAndCons.pros.map((pro, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-emerald-600 font-bold">•</span>
                              <span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-100 space-y-2">
                        <h4 className="font-serif text-sm font-bold text-amber-900 flex items-center gap-1.5">
                          <AlertCircle className="h-4 w-4 text-amber-600" />
                          <span>Things to Consider (Cons)</span>
                        </h4>
                        <ul className="space-y-1.5 text-xs text-amber-950">
                          {collegeData.prosAndCons.cons.map((con, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-amber-600 font-bold">•</span>
                              <span>{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 7: GALLERY */}
              {activeTab === 'gallery' && (
                <div className="bg-white border border-border-color rounded-xl p-6 space-y-4">
                  <h3 className="font-serif text-xl font-bold text-text-primary">
                    Campus & Hostel Photos
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(collegeData.gallery || []).map((imgUrl, idx) => (
                      <img
                        key={idx}
                        src={imgUrl}
                        alt={`Gallery ${idx}`}
                        className="rounded-xl w-full h-44 object-cover border border-border-color"
                      />
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right 1 Column: Advisory & Similar Colleges Sidebar (Platform Generated) */}
            <div className="space-y-5">
              <div className="bg-navy-dark text-white p-6 rounded-xl border border-border-dark space-y-3.5">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-primary bg-brand-primary/15 px-2.5 py-0.5 rounded-full border border-brand-primary/25">
                  <GraduationCap className="h-3.5 w-3.5" />
                  <span>VidyaScope Advisory</span>
                </div>
                <h4 className="font-serif text-lg font-bold">
                  Evaluating {collegeData.shortName}?
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Connect with verified student mentors from {collegeData.shortName} for real insights on campus life, grading, and placement tips.
                </p>
                <div className="btn btn-primary btn-md w-full opacity-90 pointer-events-none">
                  <span>Connect With Student Mentor</span>
                </div>
              </div>

              {/* Similar Colleges Locked Widget */}
              <div className="bg-white border border-border-color rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-xs font-bold text-text-primary">
                    Similar Colleges (Algorithmic)
                  </h4>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Platform</span>
                </div>
                <div className="space-y-2">
                  {['IIT Delhi', 'BITS Pilani', 'IIIT Hyderabad'].map((cName, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border border-border-color bg-slate-50/70 flex items-center justify-between text-xs"
                    >
                      <span className="font-bold text-text-primary">{cName}</span>
                      <span className="text-emerald-600 font-bold text-[11px]">₹25.8 LPA</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Confirmation Modal for Final Submission */}
      <ConfirmationModal
        isOpen={confirmSubmitOpen}
        onClose={() => setConfirmSubmitOpen(false)}
        onConfirm={handleConfirmSubmit}
        title="Submit Profile for Administrative Approval"
        message="Once submitted, your institutional profile will enter 'Under Review' status. The verification team will inspect your courses, cutoffs, and regulatory certifications before publishing live on VidyaScope."
        confirmText="Send for Approval"
        isLoading={isSubmitting}
        type="primary"
      />
    </div>
  )
}

export default Step10ReviewPreview
