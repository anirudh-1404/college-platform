import React, { useState, useMemo } from 'react'
import {
  ChevronRight, Home, MapPin, Award, Star, CheckCircle, Heart,
  Share2, ArrowUpRight, Calculator, IndianRupee, ShieldCheck,
  Building2, GraduationCap, Users, FileText, Check, AlertCircle, Sparkles
} from 'lucide-react'
import { collegesData } from '../data/collegesData'
import CollegeCard from '../components/CollegeCard'

const CollegeDetailPage = ({ collegeId = 'iit-bombay', onNavigateHome, onNavigateListing, onOpenCounseling, onSelectCollege, isShortlisted = false, onToggleShortlist, onToggleCompare, isCompared = false }) => {
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
    { id: 'overview', label: 'Overview' },
    { id: 'courses', label: 'Courses & Fees' },
    { id: 'cutoffs', label: 'Cutoffs' },
    { id: 'placements', label: 'Placements' },
    { id: 'roi', label: 'ROI & Costs' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'gallery', label: 'Gallery' },
  ]

  // Calculate estimated total 4-year expenditure
  const annualTotalCost = useMemo(() => {
    if (!college.hiddenCosts) return 0
    const { tuitionFeePerYear, hostelRentYearly, messChargesYearly, examinationMiscYearly } = college.hiddenCosts
    return tuitionFeePerYear + hostelRentYearly + messChargesYearly + examinationMiscYearly
  }, [college])

  const estimatedTotalCost = useMemo(() => {
    const caution = college.hiddenCosts?.cautionDepositOneTime || 0
    return (annualTotalCost * calculatorTenure + caution) / 100000 // Convert to Lakhs
  }, [annualTotalCost, calculatorTenure, college])

  return (
    <div className="min-h-screen bg-slate-50/60 pb-28">
      
      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-border-color py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs font-semibold text-text-light">
            <button onClick={onNavigateHome} className="hover:text-brand-primary cursor-pointer flex items-center gap-1">
              <Home className="h-3.5 w-3.5" />
              <span>Home</span>
            </button>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <button onClick={onNavigateListing} className="hover:text-brand-primary cursor-pointer capitalize">
              {college.stream} Colleges
            </button>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="text-text-primary font-bold truncate">{college.shortName}</span>
          </nav>
        </div>
      </div>

      {/* Hero Cover & Header Section */}
      <div className="bg-white border-b border-border-color">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Cover & Avatar Header */}
          <div className="relative rounded-3xl overflow-hidden mb-6 h-56 sm:h-72 md:h-80 shadow-premium">
            <img
              src={college.image}
              alt={college.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
            
            {/* Top Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
              <span className="bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                NIRF #{college.nirfRank}
              </span>
              <span className="bg-white/90 backdrop-blur-md text-text-primary text-xs font-bold px-3 py-1 rounded-full shadow-md">
                {college.ownership}
              </span>
            </div>

            {/* Bottom Title & Actions on Cover */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                  {college.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-200 mt-1 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-brand-accent flex-shrink-0" />
                  <span>{college.location}</span>
                  <span>•</span>
                  <span>Est. {college.establishmentYear || '1958'}</span>
                </p>
              </div>

              {/* Cover Quick Action Buttons */}
              <div className="flex items-center gap-3 self-start sm:self-auto">
                <button
                  onClick={() => onToggleShortlist && onToggleShortlist(college.id)}
                  className={`p-3 rounded-xl backdrop-blur-md border transition-all cursor-pointer ${
                    isShortlisted
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'bg-white/20 hover:bg-white/30 text-white border-white/30'
                  }`}
                  title="Shortlist College"
                >
                  <Heart className={`h-5 w-5 ${isShortlisted ? 'fill-white' : ''}`} />
                </button>
                <button
                  onClick={onOpenCounseling}
                  className="px-6 py-3 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-sm shadow-premium transition-all cursor-pointer"
                >
                  Apply Now / Get Advice
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-slate-50 border border-border-color rounded-2xl">
            <div>
              <p className="text-[11px] font-bold text-text-light uppercase tracking-wider">Average Package</p>
              <p className="text-lg font-extrabold text-emerald-600 mt-0.5">{college.avgPackage}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-text-light uppercase tracking-wider">Total Fees</p>
              <p className="text-lg font-extrabold text-text-primary mt-0.5">{college.totalFees}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-text-light uppercase tracking-wider">Highest Offer</p>
              <p className="text-lg font-extrabold text-brand-primary mt-0.5">{college.highestPackage || '₹60 LPA'}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-text-light uppercase tracking-wider">Student Rating</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-lg font-extrabold text-text-primary">{college.rating}</span>
                <span className="text-xs text-text-light font-medium">({college.reviewsCount})</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Sticky Navigation Tab Bar */}
      <div className="sticky top-20 z-40 bg-white border-b border-border-color shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-brand-primary text-white shadow-premium'
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Columns: Tab Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* About Section */}
                <div className="bg-white border border-border-color rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
                  <h3 className="font-serif text-xl font-bold text-text-primary">
                    About {college.name}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {college.description}
                  </p>

                  {/* Highlights Grid */}
                  {college.snapshot && (
                    <div className="pt-4 border-t border-border-color grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="flex items-start gap-2">
                        <ShieldCheck className="h-4 w-4 text-brand-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-text-primary">Accreditation: </span>
                          <span className="text-text-secondary">{college.snapshot.accreditation}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Users className="h-4 w-4 text-brand-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-text-primary">Faculty: </span>
                          <span className="text-text-secondary">{college.snapshot.totalFaculty}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Building2 className="h-4 w-4 text-brand-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-text-primary">Campus Size: </span>
                          <span className="text-text-secondary">{college.campusArea || '300+ Acres'}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Award className="h-4 w-4 text-brand-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-text-primary">Gender Ratio: </span>
                          <span className="text-text-secondary">{college.snapshot.genderRatio}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Facilities List */}
                <div className="bg-white border border-border-color rounded-2xl p-6 sm:p-8 shadow-sm">
                  <h3 className="font-serif text-xl font-bold text-text-primary mb-4">
                    Campus Facilities
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {college.facilities.map((facility) => (
                      <div key={facility} className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 text-xs font-semibold text-text-primary border border-border-color">
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                        <span>{facility}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* COURSES & FEES TAB */}
            {activeTab === 'courses' && (
              <div className="bg-white border border-border-color rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                <h3 className="font-serif text-xl font-bold text-text-primary">
                  Courses Offered, Eligibility & Fee Breakdown
                </h3>

                <div className="space-y-4">
                  {college.coursesOffered ? (
                    college.coursesOffered.map((course) => (
                      <div key={course.id} className="p-5 rounded-2xl border border-border-color bg-slate-50/60 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <h4 className="font-serif text-base font-bold text-text-primary">
                            {course.name}
                          </h4>
                          <span className="text-xs font-extrabold text-brand-primary bg-brand-accent px-3 py-1 rounded-full border border-brand-primary/10 self-start sm:self-auto">
                            {course.fee} Total
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-text-secondary pt-2 border-t border-border-color">
                          <div>
                            <span className="font-bold text-text-primary">Duration:</span> {course.duration}
                          </div>
                          <div>
                            <span className="font-bold text-text-primary">Seats:</span> {course.seatIntake}
                          </div>
                          <div>
                            <span className="font-bold text-text-primary">Avg Pkg:</span> {course.avgSalary}
                          </div>
                        </div>
                        <p className="text-xs text-text-secondary pt-1">
                          <strong className="text-text-primary">Eligibility:</strong> {course.eligibility}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-text-secondary">Standard B.Tech and M.Tech engineering programs available.</p>
                  )}
                </div>
              </div>
            )}

            {/* CUTOFFS TAB */}
            {activeTab === 'cutoffs' && (
              <div className="bg-white border border-border-color rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                <h3 className="font-serif text-xl font-bold text-text-primary">
                  Entrance Exam Cutoff Ranks (2025–26)
                </h3>

                {college.admissionCutoffs ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-border-color bg-slate-50 text-text-primary">
                          <th className="py-3 px-4 font-bold">Exam</th>
                          <th className="py-3 px-4 font-bold">Course / Branch</th>
                          <th className="py-3 px-4 font-bold">General Cutoff</th>
                          <th className="py-3 px-4 font-bold">OBC Cutoff</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-color">
                        {college.admissionCutoffs.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/60">
                            <td className="py-3.5 px-4 font-bold text-brand-primary">{item.exam}</td>
                            <td className="py-3.5 px-4 font-semibold text-text-primary">{item.course}</td>
                            <td className="py-3.5 px-4 text-emerald-600 font-bold">{item.generalCutoff}</td>
                            <td className="py-3.5 px-4 text-text-secondary">{item.obcCutoff}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-text-secondary">Cutoff details updated post JoSAA / entrance rounds.</p>
                )}
              </div>
            )}

            {/* PLACEMENTS TAB */}
            {activeTab === 'placements' && (
              <div className="bg-white border border-border-color rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                <h3 className="font-serif text-xl font-bold text-text-primary">
                  Placement Statistics & Top Recruiters
                </h3>

                {college.placements && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
                        <p className="text-xs font-bold text-emerald-700">Highest Package</p>
                        <p className="text-xl font-extrabold text-emerald-800 mt-1">{college.placements.highestDomestic}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-brand-accent border border-brand-primary/10 text-center">
                        <p className="text-xs font-bold text-brand-primary">Average Package</p>
                        <p className="text-xl font-extrabold text-brand-primary mt-1">{college.placements.avgPackage}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50 border border-border-color text-center col-span-2 sm:col-span-1">
                        <p className="text-xs font-bold text-text-secondary">Placement Rate</p>
                        <p className="text-xl font-extrabold text-text-primary mt-1">{college.placements.placementRate}%</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-serif text-base font-bold text-text-primary mb-3">
                        Top Visiting Recruiters
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {college.placements.topRecruiters.map((rec) => (
                          <span key={rec} className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-text-primary text-xs font-semibold border border-border-color">
                            {rec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ROI & HIDDEN COSTS TAB */}
            {activeTab === 'roi' && (
              <div className="bg-white border border-border-color rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-text-primary">
                      ROI & Hidden Cost Estimator
                    </h3>
                    <p className="text-xs text-text-secondary mt-1">
                      Interactive tool calculating total college expenditure (tuition + hostel + mess + caution money) vs expected package.
                    </p>
                  </div>
                  <Calculator className="h-6 w-6 text-brand-primary flex-shrink-0" />
                </div>

                {/* Tenure Selector */}
                <div className="flex items-center gap-3 text-xs font-bold text-text-primary">
                  <span>Select Course Duration:</span>
                  {[2, 4, 5].map((yrs) => (
                    <button
                      key={yrs}
                      onClick={() => setCalculatorTenure(yrs)}
                      className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        calculatorTenure === yrs
                          ? 'bg-brand-primary text-white border-brand-primary'
                          : 'bg-slate-50 text-text-secondary border-border-color hover:bg-slate-100'
                      }`}
                    >
                      {yrs} Years
                    </button>
                  ))}
                </div>

                {college.hiddenCosts && (
                  <div className="p-5 rounded-2xl bg-slate-50 border border-border-color space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="flex justify-between py-1.5 border-b border-border-color">
                        <span className="text-text-secondary">Tuition Fee ({calculatorTenure} Yrs):</span>
                        <span className="font-bold text-text-primary">₹{((college.hiddenCosts.tuitionFeePerYear * calculatorTenure) / 100000).toFixed(2)} Lakhs</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-border-color">
                        <span className="text-text-secondary">Hostel Rent ({calculatorTenure} Yrs):</span>
                        <span className="font-bold text-text-primary">₹{((college.hiddenCosts.hostelRentYearly * calculatorTenure) / 100000).toFixed(2)} Lakhs</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-border-color">
                        <span className="text-text-secondary">Mess & Food ({calculatorTenure} Yrs):</span>
                        <span className="font-bold text-text-primary">₹{((college.hiddenCosts.messChargesYearly * calculatorTenure) / 100000).toFixed(2)} Lakhs</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-border-color">
                        <span className="text-text-secondary">Caution Money (One-Time):</span>
                        <span className="font-bold text-text-primary">₹{(college.hiddenCosts.cautionDepositOneTime / 100000).toFixed(2)} Lakhs</span>
                      </div>
                    </div>

                    <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border-color">
                      <div>
                        <p className="text-xs text-text-light font-bold uppercase">Estimated Total Cost</p>
                        <p className="text-2xl font-extrabold text-brand-primary">₹{estimatedTotalCost.toFixed(2)} Lakhs</p>
                      </div>
                      <div>
                        <p className="text-xs text-text-light font-bold uppercase">Expected Avg Package</p>
                        <p className="text-2xl font-extrabold text-emerald-600">{college.avgPackage}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* REVIEWS TAB */}
            {activeTab === 'reviews' && (
              <div className="bg-white border border-border-color rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                <h3 className="font-serif text-xl font-bold text-text-primary">
                  Verified Student Pros & Cons
                </h3>

                {college.prosAndCons && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-100 space-y-3">
                      <h4 className="font-serif text-base font-bold text-emerald-900 flex items-center gap-2">
                        <Check className="h-4 w-4 text-emerald-600" />
                        <span>The Good (Pros)</span>
                      </h4>
                      <ul className="space-y-2 text-xs text-emerald-950">
                        {college.prosAndCons.pros.map((pro, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-600 font-bold">•</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-100 space-y-3">
                      <h4 className="font-serif text-base font-bold text-amber-900 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        <span>Things to Consider (Cons)</span>
                      </h4>
                      <ul className="space-y-2 text-xs text-amber-950">
                        {college.prosAndCons.cons.map((con, idx) => (
                          <li key={idx} className="flex items-start gap-2">
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

            {/* GALLERY TAB */}
            {activeTab === 'gallery' && (
              <div className="bg-white border border-border-color rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                <h3 className="font-serif text-xl font-bold text-text-primary">
                  Campus Gallery & Hostels
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {college.gallery.map((imgUrl, idx) => (
                    <img
                      key={idx}
                      src={imgUrl}
                      alt={`Gallery ${idx}`}
                      className="rounded-2xl w-full h-48 object-cover shadow-sm hover:opacity-95 transition-opacity"
                    />
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right 1 Column: Sticky Widget Card */}
          <div className="space-y-6">
            
            {/* Quick Counseling Box */}
            <div className="bg-gradient-to-br from-slate-900 to-navy-dark text-white p-6 sm:p-7 rounded-3xl shadow-dark-panel space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary bg-brand-primary/20 px-3 py-1 rounded-full border border-brand-primary/30">
                <Sparkles className="h-3.5 w-3.5" />
                <span>VidyaScope Advisory</span>
              </div>
              
              <h3 className="font-serif text-xl font-bold">
                Need Help Choosing Between Colleges?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect with alumni from {college.shortName} for real insights on campus life, professors, and placements.
              </p>

              <button
                onClick={onOpenCounseling}
                className="w-full py-3.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-sm shadow-premium transition-all cursor-pointer"
              >
                Connect With Student Mentor
              </button>
            </div>

            {/* Similar Colleges List */}
            {similarCollegesList.length > 0 && (
              <div className="bg-white border border-border-color rounded-2xl p-6 shadow-sm space-y-4">
                <h4 className="font-serif text-base font-bold text-text-primary">
                  Similar Colleges to Explore
                </h4>
                <div className="space-y-3">
                  {similarCollegesList.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onSelectCollege(item.id)}
                      className="w-full text-left p-3.5 rounded-xl border border-border-color hover:border-brand-primary/30 hover:bg-slate-50 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div>
                        <h5 className="font-serif text-sm font-bold text-text-primary group-hover:text-brand-primary transition-colors">
                          {item.shortName}
                        </h5>
                        <p className="text-xs text-text-light">{item.location}</p>
                      </div>
                      <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
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
