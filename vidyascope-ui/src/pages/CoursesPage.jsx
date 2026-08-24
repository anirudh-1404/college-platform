import React, { useState, useMemo } from 'react'
import {
  ChevronRight, Home, Search, BookOpen, GraduationCap,
  Clock, IndianRupee, Briefcase, Award, CheckCircle,
  ArrowRight, ArrowLeft, Building2, MapPin,
  Layers, Users, HelpCircle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { collegesData } from '../data/collegesData'

const CoursesPage = ({
  onNavigateHome,
  onSelectCollegeDetail,
  onOpenCounseling,
  initialCollegeId = null,
  initialCourseId = null,
}) => {
  // Navigation Flow State
  // selectedCollege: null (Step 1: All Colleges) | College Object (Step 2 & 3)
  // selectedCourse: null (Step 2: College Courses) | Course Object (Step 3: Course Details)
  const [selectedCollegeId, setSelectedCollegeId] = useState(initialCollegeId)
  const [selectedCourseId, setSelectedCourseId] = useState(initialCourseId)
  const [searchQuery, setSearchQuery] = useState('')
  const [streamFilter, setStreamFilter] = useState('all')

  const selectedCollege = useMemo(() => {
    if (!selectedCollegeId) return null
    return collegesData.find((c) => c.id === selectedCollegeId) || null
  }, [selectedCollegeId])

  const selectedCourse = useMemo(() => {
    if (!selectedCollege || !selectedCourseId) return null
    return (
      selectedCollege.coursesOffered?.find((crs) => crs.id === selectedCourseId) ||
      null
    )
  }, [selectedCollege, selectedCourseId])

  // Filtered colleges list for Step 1
  const filteredColleges = useMemo(() => {
    return collegesData.filter((col) => {
      if (streamFilter !== 'all' && col.stream !== streamFilter) return false
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase()
        const matchName =
          col.name.toLowerCase().includes(q) ||
          col.shortName.toLowerCase().includes(q)
        const matchCourse = col.coursesOffered?.some((c) =>
          c.name.toLowerCase().includes(q)
        )
        const matchCity =
          col.city.toLowerCase().includes(q) ||
          col.state.toLowerCase().includes(q)
        if (!matchName && !matchCourse && !matchCity) return false
      }
      return true
    })
  }, [streamFilter, searchQuery])

  // Handlers for moving between steps
  const handleSelectCollege = (collegeId) => {
    setSelectedCollegeId(collegeId)
    setSelectedCourseId(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSelectCourse = (courseId) => {
    setSelectedCourseId(courseId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBackToColleges = () => {
    setSelectedCollegeId(null)
    setSelectedCourseId(null)
  }

  const handleBackToCourses = () => {
    setSelectedCourseId(null)
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      
      {/* Dynamic Breadcrumbs Bar */}
      <div className="bg-white border-b border-border-color py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs font-semibold text-text-light flex-wrap">
            <button
              onClick={onNavigateHome}
              className="hover:text-brand-primary cursor-pointer flex items-center gap-1"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Home</span>
            </button>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            
            {/* Level 1: Courses */}
            {selectedCollege ? (
              <button
                onClick={handleBackToColleges}
                className="hover:text-brand-primary cursor-pointer"
              >
                Courses Directory
              </button>
            ) : (
              <span className="text-text-primary font-bold">Courses Directory</span>
            )}

            {/* Level 2: College */}
            {selectedCollege && (
              <>
                <ChevronRight className="h-3 w-3 text-slate-400" />
                {selectedCourse ? (
                  <button
                    onClick={handleBackToCourses}
                    className="hover:text-brand-primary cursor-pointer truncate max-w-[180px]"
                  >
                    {selectedCollege.shortName}
                  </button>
                ) : (
                  <span className="text-text-primary font-bold truncate max-w-[200px]">
                    {selectedCollege.shortName} Courses
                  </span>
                )}
              </>
            )}

            {/* Level 3: Course */}
            {selectedCourse && (
              <>
                <ChevronRight className="h-3 w-3 text-slate-400" />
                <span className="text-text-primary font-bold truncate max-w-[240px]">
                  {selectedCourse.name}
                </span>
              </>
            )}
          </nav>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ========================================================================= */}
        {/* STEP 1: ALL COLLEGES VIEW */}
        {/* ========================================================================= */}
        {!selectedCollege && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6"
          >
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand-accent text-brand-primary text-xs font-bold uppercase tracking-wider mb-2">
                <BookOpen className="h-3.5 w-3.5" />
                <span>Academic Courses Directory</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary">
                Explore Courses by College
              </h1>
              <p className="text-xs sm:text-sm text-text-secondary mt-1">
                Select an institution below to view its academic degree programs, specializations, duration, and fee structures.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search college, course or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white border border-border-color focus:border-brand-primary outline-none text-xs font-medium shadow-xs"
              />
              <Search className="h-4 w-4 text-text-light absolute left-3 top-3" />
            </div>
          </div>

          {/* Stream Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pt-1">
            {[
              { id: 'all', label: 'All Institutions' },
              { id: 'engineering', label: 'Engineering Colleges' },
              { id: 'management', label: 'Management / MBA Institutes' },
              { id: 'medical', label: 'Medical Colleges' },
            ].map((stream) => (
              <button
                key={stream.id}
                onClick={() => setStreamFilter(stream.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  streamFilter === stream.id
                    ? 'bg-brand-primary text-white font-bold'
                    : 'bg-white border border-border-color text-text-secondary hover:text-brand-primary hover:bg-brand-accent'
                }`}
              >
                {stream.label}
              </button>
            ))}
          </div>

          {/* Colleges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
            {filteredColleges.map((col) => (
              <div
                key={col.id}
                onClick={() => handleSelectCollege(col.id)}
                className="bg-white border border-border-color rounded-xl overflow-hidden hover:border-brand-primary/40 card-hover-lift cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-40 overflow-hidden bg-slate-100">
                    <img
                      src={col.image}
                      alt={col.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-bold uppercase">
                        NIRF #{col.nirfRank}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white/90 text-text-primary text-[10px] font-bold uppercase">
                        {col.ownership}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <p className="text-xs text-text-light flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-brand-primary flex-shrink-0" />
                      <span>{col.location}</span>
                    </p>

                    <h3 className="font-serif text-base font-bold text-text-primary group-hover:text-brand-primary transition-colors line-clamp-1">
                      {col.name}
                    </h3>

                    <p className="text-xs text-text-secondary line-clamp-2">
                      {col.description}
                    </p>
                  </div>
                </div>

                {/* Footer Strip */}
                <div className="p-4 pt-3 border-t border-border-color bg-slate-50/50 flex items-center justify-between text-xs">
                  <span className="font-bold text-brand-primary">
                    {col.coursesOffered?.length || 0} Programs Offered
                  </span>
                  <span className="font-semibold text-text-secondary group-hover:text-brand-primary flex items-center gap-1">
                    <span>View Courses</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>

        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: SELECTED COLLEGE COURSES VIEW */}
      {/* ========================================================================= */}
      {selectedCollege && !selectedCourse && (
        <motion.div
          key={`step-2-${selectedCollege.id}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6"
        >
          
          {/* Back Button */}
          <button
            onClick={handleBackToColleges}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:underline cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to All Colleges</span>
          </button>

          {/* College Summary Banner */}
          <div className="bg-white border border-border-color rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-border-color flex-shrink-0">
                <img
                  src={selectedCollege.image}
                  alt={selectedCollege.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-brand-primary uppercase">
                  NIRF #{selectedCollege.nirfRank} • {selectedCollege.ownership}
                </span>
                <h1 className="font-serif text-xl sm:text-2xl font-bold text-text-primary">
                  Courses Offered at {selectedCollege.name}
                </h1>
                <p className="text-xs text-text-light flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3 w-3 text-brand-primary" />
                  <span>{selectedCollege.location}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => onSelectCollegeDetail(selectedCollege.id)}
              className="px-4 py-2 rounded-lg border border-border-color hover:border-brand-primary text-text-secondary hover:text-brand-primary text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto"
            >
              View Full College Profile
            </button>
          </div>

          {/* Section Subheading */}
          <div>
            <h2 className="font-serif text-lg font-bold text-text-primary">
              Available Degree Programs ({selectedCollege.coursesOffered?.length || 0})
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Click on any course below to inspect full syllabus, eligibility criteria, admission tests, and career prospects.
            </p>
          </div>

          {/* Courses List */}
          <div className="space-y-4">
            {selectedCollege.coursesOffered?.map((course) => (
              <div
                key={course.id}
                onClick={() => handleSelectCourse(course.id)}
                className="bg-white border border-border-color rounded-xl p-5 hover:border-brand-primary/40 hover:shadow-card transition-all duration-200 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-brand-accent text-brand-primary text-[10px] font-bold uppercase">
                      {course.degreeLevel || 'Undergraduate'}
                    </span>
                    <span className="text-xs text-text-light font-semibold">
                      {course.duration}
                    </span>
                  </div>

                  <h3 className="font-serif text-base sm:text-lg font-bold text-text-primary group-hover:text-brand-primary transition-colors">
                    {course.name}
                  </h3>

                  <p className="text-xs text-text-secondary line-clamp-2">
                    {course.overview || course.eligibility}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                    <div>
                      <strong className="text-text-primary">Total Fee:</strong>{' '}
                      <span className="text-brand-primary font-bold">{course.fee}</span>
                    </div>
                    <div>
                      <strong className="text-text-primary">Avg Package:</strong>{' '}
                      <span className="text-emerald-600 font-bold">{course.avgSalary}</span>
                    </div>
                    <div>
                      <strong className="text-text-primary">Seats:</strong>{' '}
                      <span className="text-text-secondary">{course.seatIntake}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
                  <span className="text-xs font-bold text-brand-primary group-hover:underline flex items-center gap-1">
                    <span>Course Details</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: SELECTED COURSE DETAIL VIEW */}
        {/* ========================================================================= */}
        {selectedCollege && selectedCourse && (
          <motion.div
            key={`step-3-${selectedCourse.id}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6"
          >
            {/* Back Button */}
            <button
              onClick={handleBackToCourses}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:underline cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to {selectedCollege.shortName} Courses</span>
            </button>

            {/* Course Hero Profile Card */}
            <div className="bg-white border border-border-color rounded-xl p-6 sm:p-8 space-y-6">
              
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-brand-accent text-brand-primary text-xs font-bold uppercase tracking-wider">
                    {selectedCourse.degreeLevel || 'Degree Program'}
                  </span>
                  <span className="text-xs text-text-light font-semibold">
                    Offered by {selectedCollege.name}
                  </span>
                </div>

                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary">
                  {selectedCourse.name}
                </h1>

                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mt-2 max-w-3xl">
                  {selectedCourse.overview}
                </p>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 border border-border-color rounded-xl">
                <div>
                  <p className="text-[10px] font-semibold text-text-light uppercase tracking-wider">
                    Program Duration
                  </p>
                  <p className="text-sm sm:text-base font-bold text-text-primary mt-0.5">
                    {selectedCourse.duration}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-semibold text-text-light uppercase tracking-wider">
                    Annual / Total Fee
                  </p>
                  <p className="text-sm sm:text-base font-bold text-brand-primary mt-0.5">
                    {selectedCourse.annualFee || selectedCourse.fee}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-semibold text-text-light uppercase tracking-wider">
                    Average Placement
                  </p>
                  <p className="text-sm sm:text-base font-bold text-emerald-600 mt-0.5">
                    {selectedCourse.avgSalary}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-semibold text-text-light uppercase tracking-wider">
                    Seat Intake
                  </p>
                  <p className="text-sm sm:text-base font-bold text-text-primary mt-0.5">
                    {selectedCourse.seatIntake} Seats
                  </p>
                </div>
              </div>

              {/* 2-Column Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* Eligibility & Admission Process */}
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-border-color bg-slate-50/50 space-y-2">
                    <h3 className="font-serif text-sm font-bold text-text-primary flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span>Eligibility Requirements</span>
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {selectedCourse.eligibility}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-border-color bg-slate-50/50 space-y-2">
                    <h3 className="font-serif text-sm font-bold text-text-primary flex items-center gap-1.5">
                      <Award className="h-4 w-4 text-brand-primary" />
                      <span>Admission & Counseling Process</span>
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {selectedCourse.admissionProcess || 'Admission based on standard entrance merit list and institutional counseling.'}
                    </p>
                  </div>
                </div>

                {/* Specializations & Career Options */}
                <div className="space-y-4">
                  {selectedCourse.specializations && (
                    <div className="p-4 rounded-xl border border-border-color bg-slate-50/50 space-y-2">
                      <h3 className="font-serif text-sm font-bold text-text-primary flex items-center gap-1.5">
                        <Layers className="h-4 w-4 text-brand-primary" />
                        <span>Specialization Modules</span>
                      </h3>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {selectedCourse.specializations.map((spec) => (
                          <span
                            key={spec}
                            className="px-2.5 py-1 rounded bg-white border border-border-color text-text-secondary text-[11px] font-medium"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedCourse.careerOutcomes && (
                    <div className="p-4 rounded-xl border border-border-color bg-slate-50/50 space-y-2">
                      <h3 className="font-serif text-sm font-bold text-text-primary flex items-center gap-1.5">
                        <Briefcase className="h-4 w-4 text-brand-primary" />
                        <span>Career Pathways & Job Roles</span>
                      </h3>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {selectedCourse.careerOutcomes.map((role) => (
                          <span
                            key={role}
                            className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-[11px] font-semibold"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-border-color flex flex-wrap items-center justify-between gap-4">
                <button
                  onClick={() => onSelectCollegeDetail(selectedCollege.id)}
                  className="text-xs font-bold text-text-secondary hover:text-brand-primary flex items-center gap-1 cursor-pointer"
                >
                  <span>View Full {selectedCollege.shortName} Profile</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>

                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onOpenCounseling}
                    className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold text-xs sm:text-sm shadow-sm transition-colors cursor-pointer"
                  >
                    Get Course Counseling
                  </motion.button>
                </div>
              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

export default CoursesPage
