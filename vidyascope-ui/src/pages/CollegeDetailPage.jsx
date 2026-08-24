import React, { useState, useMemo } from 'react'
import {
  ChevronRight, Home, MapPin, Star, Heart,
  Calculator, ShieldCheck, Building2, Users,
  Check, AlertCircle, Scale, BookOpen, Layers, GraduationCap
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { collegesData } from '../data/collegesData'

const CollegeDetailPage = ({
  collegeId = 'iit-bombay',
  onNavigateHome,
  onNavigateListing,
  onOpenCounseling,
  onSelectCollege,
  isShortlisted = false,
  onToggleShortlist,
  onToggleCompare,
  isCompared = false,
}) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [calculatorTenure, setCalculatorTenure] = useState(4)

  const college = useMemo(() => {
    return collegesData.find((c) => c.id === collegeId) || collegesData[0]
  }, [collegeId])

  const similarCollegesList = useMemo(() => {
    if (!college.similarColleges) return []
    return collegesData.filter((c) => college.similarColleges.includes(c.id))
  }, [college])

  const tabs = [
    { id: 'overview', label: 'Overview & Facts' },
    { id: 'courses', label: 'Courses & Fees' },
    { id: 'cutoffs', label: 'Cutoffs & Eligibility' },
    { id: 'placements', label: 'Placements' },
    { id: 'roi', label: 'ROI & Fee Breakdown' },
    { id: 'reviews', label: 'Reviews & Pros/Cons' },
    { id: 'gallery', label: 'Campus Gallery' },
  ]

  // Calculate estimated total expenditure
  const annualTotalCost = useMemo(() => {
    if (!college.hiddenCosts) return 0
    const {
      tuitionFeePerYear = 0,
      hostelRentYearly = 0,
      messChargesYearly = 0,
      examinationMiscYearly = 0,
    } = college.hiddenCosts
    return (
      tuitionFeePerYear +
      hostelRentYearly +
      messChargesYearly +
      examinationMiscYearly
    )
  }, [college])

  const estimatedTotalCost = useMemo(() => {
    const caution = college.hiddenCosts?.cautionDepositOneTime || 0
    return (annualTotalCost * calculatorTenure + caution) / 100000 // In Lakhs
  }, [annualTotalCost, calculatorTenure, college])

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      {/* Breadcrumb Bar */}
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
            <button
              onClick={onNavigateListing}
              className="hover:text-brand-primary cursor-pointer capitalize"
            >
              {college.stream} Colleges
            </button>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="text-text-primary font-bold truncate">
              {college.shortName || college.name}
            </span>
          </nav>
        </div>
      </div>

      {/* College Header Banner */}
      <div className="bg-white border-b border-border-color py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Left: Image & Titles */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-100 border border-border-color flex-shrink-0">
                <img
                  src={college.image}
                  alt={college.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-md bg-brand-primary text-white text-[11px] font-bold uppercase">
                    NIRF #{college.nirfRank}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-text-secondary text-[11px] font-semibold">
                    {college.ownership}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
                    Est. {college.establishmentYear}
                  </span>
                </div>

                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary">
                  {college.name}
                </h1>

                <p className="flex items-center gap-2 text-xs sm:text-sm text-text-light font-medium mt-1">
                  <MapPin className="h-4 w-4 text-brand-primary flex-shrink-0" />
                  <span>{college.location}</span>
                  <span>•</span>
                  <span>Campus: {college.campusArea || '300+ Acres'}</span>
                </p>
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
              {/* Shortlist */}
              <button
                onClick={() => onToggleShortlist && onToggleShortlist(college.id)}
                className={`btn btn-sm ${
                  isShortlisted
                    ? 'bg-rose-50 border-rose-200 text-rose-600 font-bold'
                    : 'btn-outline'
                }`}
              >
                <Heart className={`h-4 w-4 ${isShortlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{isShortlisted ? 'Saved' : 'Save'}</span>
              </button>

              {/* Compare */}
              <button
                onClick={() => onToggleCompare && onToggleCompare(college)}
                className={`btn btn-sm ${
                  isCompared
                    ? 'btn-accent font-bold'
                    : 'btn-outline'
                }`}
              >
                <Scale className="h-4 w-4" />
                <span>{isCompared ? 'Comparing' : 'Compare'}</span>
              </button>

              {/* Counseling */}
              <button
                onClick={onOpenCounseling}
                className="btn btn-primary btn-md"
              >
                <span>Get Free Counseling</span>
              </button>
            </div>

          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 border border-border-color rounded-xl mt-6">
            <div>
              <p className="text-[10px] font-semibold text-text-light uppercase tracking-wider">
                Average Package
              </p>
              <p className="text-base sm:text-lg font-extrabold text-emerald-600 mt-0.5">
                {college.avgPackage}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-text-light uppercase tracking-wider">
                Total Tuition Fees
              </p>
              <p className="text-base sm:text-lg font-bold text-text-primary mt-0.5">
                {college.totalFees} ({college.feesPeriod})
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-text-light uppercase tracking-wider">
                Highest Placement
              </p>
              <p className="text-base sm:text-lg font-bold text-brand-primary mt-0.5">
                {college.highestPackage || '₹50 LPA'}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-text-light uppercase tracking-wider">
                Student Rating
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-base sm:text-lg font-bold text-text-primary">
                  {college.rating}
                </span>
                <span className="text-xs text-text-light font-medium">
                  ({college.reviewsCount})
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Sticky Tab Navigation Bar */}
      <div className="sticky top-20 z-30 bg-white border-b border-border-color shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
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
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left 2 Columns: Active Tab View with AnimatePresence */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-2 space-y-6"
            >
            
            {/* 1. OVERVIEW & FACTS TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* About College */}
                <div className="bg-white border border-border-color rounded-xl p-6 space-y-4">
                  <h2 className="font-serif text-xl font-bold text-text-primary">
                    About {college.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                    {college.description}
                  </p>

                  {/* Key Institutional Facts */}
                  {college.snapshot && (
                    <div className="pt-4 border-t border-border-color grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                      <div className="flex items-start gap-2">
                        <ShieldCheck className="h-4 w-4 text-brand-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-text-primary">Accreditation: </strong>
                          <span className="text-text-secondary">{college.snapshot.accreditation}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Users className="h-4 w-4 text-brand-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-text-primary">Faculty: </strong>
                          <span className="text-text-secondary">{college.snapshot.totalFaculty}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Building2 className="h-4 w-4 text-brand-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-text-primary">Hostel Capacity: </strong>
                          <span className="text-text-secondary">{college.snapshot.hostelCapacity}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Layers className="h-4 w-4 text-brand-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-text-primary">Gender Ratio: </strong>
                          <span className="text-text-secondary">{college.snapshot.genderRatio}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Campus Facilities */}
                <div className="bg-white border border-border-color rounded-xl p-6">
                  <h3 className="font-serif text-lg font-bold text-text-primary mb-3">
                    Campus Facilities & Infrastructure
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {college.facilities.map((fac) => (
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

            {/* 2. COURSES & FEES TAB */}
            {activeTab === 'courses' && (
              <div className="bg-white border border-border-color rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-xl font-bold text-text-primary">
                    Courses Offered & Fee Structure
                  </h2>
                  <span className="text-xs font-bold text-brand-primary bg-brand-accent px-2.5 py-1 rounded-md">
                    {college.coursesOffered?.length || 0} Programs
                  </span>
                </div>

                <div className="space-y-3">
                  {college.coursesOffered && college.coursesOffered.map((course) => (
                    <div
                      key={course.id}
                      className="p-4 rounded-xl border border-border-color bg-slate-50/60 space-y-2.5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                        <div>
                          <span className="text-[10px] font-bold text-brand-primary uppercase">
                            {course.degreeLevel || 'Degree Program'}
                          </span>
                          <h3 className="font-serif text-base font-bold text-text-primary">
                            {course.name}
                          </h3>
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

            {/* 3. CUTOFFS TAB */}
            {activeTab === 'cutoffs' && (
              <div className="bg-white border border-border-color rounded-xl p-6 space-y-4">
                <h2 className="font-serif text-xl font-bold text-text-primary">
                  Entrance Exam Cutoff Ranks (2024–25)
                </h2>
                <p className="text-xs text-text-secondary">
                  Opening and closing ranks for general, OBC, and SC/ST categories based on official seat allocation rounds.
                </p>

                {college.admissionCutoffs ? (
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
                        {college.admissionCutoffs.map((item, idx) => (
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
                ) : (
                  <p className="text-xs text-text-secondary">Cutoff details updated post entrance results.</p>
                )}
              </div>
            )}

            {/* 4. PLACEMENTS TAB */}
            {activeTab === 'placements' && (
              <div className="bg-white border border-border-color rounded-xl p-6 space-y-5">
                <h2 className="font-serif text-xl font-bold text-text-primary">
                  Placement Records & Top Recruiters
                </h2>

                {college.placements && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
                        <p className="text-[11px] font-bold text-emerald-800 uppercase">Highest Domestic</p>
                        <p className="text-lg font-bold text-emerald-700 mt-0.5">{college.placements.highestDomestic}</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-100 text-center">
                        <p className="text-[11px] font-bold text-brand-primary uppercase">Average Package</p>
                        <p className="text-lg font-bold text-brand-primary mt-0.5">{college.placements.avgPackage}</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-border-color text-center col-span-2 sm:col-span-1">
                        <p className="text-[11px] font-bold text-text-secondary uppercase">Placement Rate</p>
                        <p className="text-lg font-bold text-text-primary mt-0.5">{college.placements.placementRate}%</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-serif text-sm font-bold text-text-primary mb-2.5">
                        Top Visiting Recruiters
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {college.placements.topRecruiters.map((rec) => (
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
              </div>
            )}

            {/* 5. ROI & COSTS TAB */}
            {activeTab === 'roi' && (
              <div className="bg-white border border-border-color rounded-xl p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-text-primary">
                      ROI & Hidden Cost Calculator
                    </h2>
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

                {college.hiddenCosts && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-border-color space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="flex justify-between py-1 border-b border-border-color">
                        <span className="text-text-secondary">Tuition Fee ({calculatorTenure} Yrs):</span>
                        <span className="font-bold text-text-primary">
                          ₹{((college.hiddenCosts.tuitionFeePerYear * calculatorTenure) / 100000).toFixed(2)} L
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-border-color">
                        <span className="text-text-secondary">Hostel Rent ({calculatorTenure} Yrs):</span>
                        <span className="font-bold text-text-primary">
                          ₹{((college.hiddenCosts.hostelRentYearly * calculatorTenure) / 100000).toFixed(2)} L
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-border-color">
                        <span className="text-text-secondary">Mess & Food ({calculatorTenure} Yrs):</span>
                        <span className="font-bold text-text-primary">
                          ₹{((college.hiddenCosts.messChargesYearly * calculatorTenure) / 100000).toFixed(2)} L
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-border-color">
                        <span className="text-text-secondary">Caution Money (One-Time):</span>
                        <span className="font-bold text-text-primary">
                          ₹{(college.hiddenCosts.cautionDepositOneTime / 100000).toFixed(2)} L
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
                        <p className="text-xl font-bold text-emerald-600">{college.avgPackage}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 6. REVIEWS & PROS/CONS */}
            {activeTab === 'reviews' && (
              <div className="bg-white border border-border-color rounded-xl p-6 space-y-5">
                <h2 className="font-serif text-xl font-bold text-text-primary">
                  Verified Student Pros & Cons
                </h2>

                {college.prosAndCons && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 space-y-2">
                      <h3 className="font-serif text-sm font-bold text-emerald-900 flex items-center gap-1.5">
                        <Check className="h-4 w-4 text-emerald-600" />
                        <span>Key Advantages (Pros)</span>
                      </h3>
                      <ul className="space-y-1.5 text-xs text-emerald-950">
                        {college.prosAndCons.pros.map((pro, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-emerald-600 font-bold">•</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-100 space-y-2">
                      <h3 className="font-serif text-sm font-bold text-amber-900 flex items-center gap-1.5">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        <span>Things to Consider (Cons)</span>
                      </h3>
                      <ul className="space-y-1.5 text-xs text-amber-950">
                        {college.prosAndCons.cons.map((con, idx) => (
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

            {/* 7. GALLERY TAB */}
            {activeTab === 'gallery' && (
              <div className="bg-white border border-border-color rounded-xl p-6 space-y-4">
                <h2 className="font-serif text-xl font-bold text-text-primary">
                  Campus & Hostel Photos
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {college.gallery.map((imgUrl, idx) => (
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

            </motion.div>
          </AnimatePresence>

          {/* Right 1 Column: Advisory & Similar Colleges Sidebar */}
          <div className="space-y-5">
            
            {/* Quick Counseling Advisory Card */}
            <div className="bg-navy-dark text-white p-6 rounded-xl border border-border-dark space-y-3.5">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-primary bg-brand-primary/15 px-2.5 py-0.5 rounded-full border border-brand-primary/25">
                <GraduationCap className="h-3.5 w-3.5" />
                <span>VidyaScope Advisory</span>
              </div>
              
              <h3 className="font-serif text-lg font-bold">
                Evaluating {college.shortName}?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect with verified student mentors from {college.shortName} for real insights on campus life, grading, and placement tips.
              </p>

              <button
                onClick={onOpenCounseling}
                className="btn btn-primary btn-md w-full"
              >
                <span>Connect With Student Mentor</span>
              </button>
            </div>

            {/* Similar Colleges List */}
            {similarCollegesList.length > 0 && (
              <div className="bg-white border border-border-color rounded-xl p-5 space-y-3">
                <h3 className="font-serif text-sm font-bold text-text-primary">
                  Similar Colleges to Explore
                </h3>
                <div className="space-y-2.5">
                  {similarCollegesList.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onSelectCollege(item.id)}
                      className="w-full text-left p-3 rounded-lg border border-border-color hover:border-brand-primary/40 hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      <div>
                        <h4 className="font-serif text-xs font-bold text-text-primary group-hover:text-brand-primary">
                          {item.shortName}
                        </h4>
                        <p className="text-[11px] text-text-light">{item.location}</p>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        {item.avgPackage}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  )
}

export default CollegeDetailPage
