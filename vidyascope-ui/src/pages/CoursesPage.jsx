import React, { useState, useEffect, useMemo } from 'react'
import {
  ChevronRight, Home, Search, BookOpen, GraduationCap,
  Clock, IndianRupee, Briefcase, Award, CheckCircle,
  ArrowRight, ArrowLeft, Building2, MapPin,
  Layers, Users, HelpCircle, Building
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { publicApi } from '../api/publicApi'

const CoursesPage = ({
  onNavigateHome,
  onSelectCollegeDetail,
  onOpenCounseling,
  initialCollegeId = null,
  initialCourseId = null,
}) => {
  const [colleges, setColleges] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCollegeId, setSelectedCollegeId] = useState(initialCollegeId)
  const [selectedCourseId, setSelectedCourseId] = useState(initialCourseId)
  const [searchQuery, setSearchQuery] = useState('')
  const [streamFilter, setStreamFilter] = useState('all')

  useEffect(() => {
    const fetchColleges = async () => {
      setLoading(true)
      try {
        const data = await publicApi.getColleges()
        setColleges(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchColleges()
  }, [])

  const selectedCollege = useMemo(() => {
    if (!selectedCollegeId) return null
    return colleges.find((c) => c.id === selectedCollegeId || c.slug === selectedCollegeId) || null
  }, [colleges, selectedCollegeId])

  const selectedCourse = useMemo(() => {
    if (!selectedCollege || !selectedCourseId) return null
    return (
      selectedCollege.coursesOffered?.find((crs) => crs.id === selectedCourseId || crs.name === selectedCourseId) ||
      null
    )
  }, [selectedCollege, selectedCourseId])

  // Filtered colleges list for Step 1
  const filteredColleges = useMemo(() => {
    return colleges.filter((col) => {
      if (streamFilter !== 'all' && col.stream !== streamFilter) return false
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase()
        const matchName =
          col.name.toLowerCase().includes(q) ||
          (col.shortName && col.shortName.toLowerCase().includes(q))
        const matchCourse = col.coursesOffered?.some((c) =>
          c.name.toLowerCase().includes(q)
        )
        const matchLoc = (col.location || '').toLowerCase().includes(q)
        if (!matchName && !matchCourse && !matchLoc) return false
      }
      return true
    })
  }, [colleges, streamFilter, searchQuery])

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

  const streamOptions = [
    { id: 'all', label: 'All Streams', icon: Layers },
    { id: 'engineering', label: 'Engineering', icon: GraduationCap },
    { id: 'management', label: 'Management', icon: Briefcase },
    { id: 'medical', label: 'Medical', icon: Award },
  ]

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      
      {/* 1. Breadcrumb Bar */}
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
            <button
              onClick={handleBackToColleges}
              className={`hover:text-brand-primary cursor-pointer ${
                !selectedCollege ? 'text-text-primary font-bold' : ''
              }`}
            >
              Courses & Degree Directory
            </button>

            {selectedCollege && (
              <>
                <ChevronRight className="h-3 w-3 text-slate-400" />
                <button
                  onClick={handleBackToCourses}
                  className={`hover:text-brand-primary cursor-pointer ${
                    !selectedCourse ? 'text-text-primary font-bold' : ''
                  }`}
                >
                  {selectedCollege.shortName || selectedCollege.name}
                </button>
              </>
            )}

            {selectedCourse && (
              <>
                <ChevronRight className="h-3 w-3 text-slate-400" />
                <span className="text-text-primary font-bold truncate">
                  {selectedCourse.name}
                </span>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* STEP 1: ALL COLLEGES LIST VIEW */}
        {!selectedCollege && (
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="bg-white border border-border-color rounded-2xl p-6 sm:p-8 space-y-4 shadow-card">
              <div className="max-w-2xl">
                <span className="text-xs font-bold text-brand-primary uppercase tracking-wider bg-brand-accent px-2.5 py-0.5 rounded-md">
                  Academics & Curricula
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary mt-2">
                  Browse Courses by Published Institution
                </h1>
                <p className="text-xs sm:text-sm text-text-secondary mt-1">
                  Explore degree programs, seat capacities, fee structures, and average salary outcomes from live published institutions.
                </p>
              </div>

              {/* Search & Stream Filter Controls */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between border-t border-slate-100">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-text-light" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by college name, course or city..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-border-color rounded-xl text-xs font-medium text-text-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {streamOptions.map((st) => (
                    <button
                      key={st.id}
                      onClick={() => setStreamFilter(st.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                        streamFilter === st.id
                          ? 'bg-brand-primary text-white font-bold'
                          : 'bg-slate-100 text-text-secondary hover:bg-slate-200'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Colleges Grid */}
            {loading ? (
              <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl">
                <p className="text-xs font-semibold text-slate-500 animate-pulse">
                  Loading courses directory...
                </p>
              </div>
            ) : filteredColleges.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredColleges.map((college) => (
                  <div
                    key={college.id}
                    onClick={() => handleSelectCollege(college.id)}
                    className="bg-white border border-slate-200/90 rounded-2xl p-5 hover:border-brand-primary/40 hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between group space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-text-secondary px-2 py-0.5 rounded">
                          NIRF #{college.nirfRank}
                        </span>
                        <span className="text-xs font-bold text-brand-primary bg-brand-accent px-2 py-0.5 rounded">
                          {college.coursesOffered?.length || 0} Courses
                        </span>
                      </div>

                      <h3 className="font-serif text-base font-bold text-text-primary group-hover:text-brand-primary transition-colors">
                        {college.name}
                      </h3>
                      <p className="text-xs text-text-light flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3 text-brand-primary" />
                        <span>{college.location}</span>
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-text-secondary">Explore Curricula</span>
                      <ArrowRight className="h-4 w-4 text-brand-primary group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-16 text-center bg-white border border-slate-200/80 rounded-2xl space-y-2">
                <Building className="h-10 w-10 text-slate-300 mx-auto" />
                <h3 className="font-serif text-base font-bold text-slate-800">
                  No Published Courses Found
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Institutions and courses published from the Admin Dashboard will appear here dynamically.
                </p>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: COURSES FOR SELECTED COLLEGE */}
        {selectedCollege && !selectedCourse && (
          <div className="space-y-6">
            <button
              onClick={handleBackToColleges}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-brand-primary cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to all institutions</span>
            </button>

            <div className="bg-white border border-border-color rounded-2xl p-6 shadow-card space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                    {selectedCollege.stream} Programs
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-text-primary mt-1">
                    {selectedCollege.name} — Courses & Degrees
                  </h2>
                </div>
                <button
                  onClick={() => onSelectCollegeDetail(selectedCollege.id)}
                  className="btn btn-outline btn-sm text-xs cursor-pointer"
                >
                  View Full College Intel
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(selectedCollege.coursesOffered || []).map((course) => (
                <div
                  key={course.id || course.name}
                  onClick={() => handleSelectCourse(course.id || course.name)}
                  className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-brand-primary/40 hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between group space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase text-brand-primary">
                        {course.degreeLevel || 'Degree'}
                      </span>
                      <span className="text-xs font-bold text-text-primary bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        {course.fee}
                      </span>
                    </div>

                    <h4 className="font-serif text-base font-bold text-text-primary group-hover:text-brand-primary transition-colors">
                      {course.name}
                    </h4>

                    <div className="grid grid-cols-2 gap-2 text-xs text-text-secondary pt-2 mt-2 border-t border-slate-100">
                      <div><strong>Duration:</strong> {course.duration}</div>
                      <div><strong>Seats:</strong> {course.seatIntake}</div>
                      <div><strong>Avg Salary:</strong> {course.avgSalary}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-brand-primary font-bold">Inspect Syllabus & Details</span>
                    <ArrowRight className="h-4 w-4 text-brand-primary group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: SINGLE COURSE DETAIL */}
        {selectedCollege && selectedCourse && (
          <div className="space-y-6">
            <button
              onClick={handleBackToCourses}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-brand-primary cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to {selectedCollege.shortName || selectedCollege.name} courses</span>
            </button>

            <div className="bg-white border border-border-color rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
              <div>
                <span className="text-xs font-bold text-brand-primary uppercase tracking-wider bg-brand-accent px-2.5 py-0.5 rounded-md">
                  {selectedCourse.degreeLevel}
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary mt-2">
                  {selectedCourse.name}
                </h1>
                <p className="text-xs sm:text-sm text-text-secondary mt-1">
                  Offered by {selectedCollege.name} • {selectedCollege.location}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <div>
                  <span className="text-text-light uppercase font-semibold block text-[10px]">Duration</span>
                  <span className="font-bold text-text-primary text-sm mt-0.5 block">{selectedCourse.duration}</span>
                </div>
                <div>
                  <span className="text-text-light uppercase font-semibold block text-[10px]">Tuition Fee</span>
                  <span className="font-bold text-text-primary text-sm mt-0.5 block">{selectedCourse.fee}</span>
                </div>
                <div>
                  <span className="text-text-light uppercase font-semibold block text-[10px]">Seat Capacity</span>
                  <span className="font-bold text-text-primary text-sm mt-0.5 block">{selectedCourse.seatIntake} Seats</span>
                </div>
                <div>
                  <span className="text-text-light uppercase font-semibold block text-[10px]">Avg Package</span>
                  <span className="font-bold text-emerald-600 text-sm mt-0.5 block">{selectedCourse.avgSalary}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-sm font-bold text-text-primary">Eligibility Criteria</h3>
                <p className="text-xs text-text-secondary leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedCourse.eligibility}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onSelectCollegeDetail(selectedCollege.id)}
                  className="btn btn-outline btn-md text-xs cursor-pointer"
                >
                  View College Profile
                </button>
                <button
                  onClick={onOpenCounseling}
                  className="btn btn-primary btn-md text-xs font-bold cursor-pointer"
                >
                  Apply & Get Counseling
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default CoursesPage
