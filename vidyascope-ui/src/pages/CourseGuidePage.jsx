import React, { useState, useMemo } from 'react'
import {
  ChevronRight, Home, BookOpen, Clock, GraduationCap, IndianRupee,
  Briefcase, Award, CheckCircle, HelpCircle, ChevronDown, Sparkles
} from 'lucide-react'
import { coursesData } from '../data/coursesData'
import { collegesData } from '../data/collegesData'

const CourseGuidePage = ({ onNavigateHome, onSelectCollege, onOpenCounseling }) => {
  const [selectedCourseId, setSelectedCourseId] = useState('btech-cs')
  const [openFaqIndex, setOpenFaqIndex] = useState(null)

  const currentCourse = useMemo(() => {
    return coursesData.find((c) => c.id === selectedCourseId) || coursesData[0]
  }, [selectedCourseId])

  const courseColleges = useMemo(() => {
    if (!currentCourse.topCollegesIds) return []
    return collegesData.filter((c) => currentCourse.topCollegesIds.includes(c.id))
  }, [currentCourse])

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
            <span className="text-text-primary font-bold">Course & Career Guide</span>
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-border-color py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent text-brand-primary text-xs font-bold uppercase tracking-wider mb-3">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Higher Education Stream Guide</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-text-primary">
              Explore Academic Courses & Career Paths
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-text-secondary font-medium mt-2 leading-relaxed">
              Understand course eligibility, specialization options, fee ranges, entrance exams, and salary packages across top Indian degrees.
            </p>
          </div>

          {/* Course Switcher Pills */}
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pt-6">
            {coursesData.map((course) => (
              <button
                key={course.id}
                onClick={() => {
                  setSelectedCourseId(course.id)
                  setOpenFaqIndex(null)
                }}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCourseId === course.id
                    ? 'bg-brand-primary text-white shadow-premium'
                    : 'bg-slate-100 hover:bg-brand-accent text-text-secondary hover:text-brand-primary'
                }`}
              >
                {course.shortName}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Overview & Quick Metrics Banner */}
        <div className="bg-white border border-border-color rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-bold text-brand-primary bg-brand-accent px-3 py-1 rounded-full uppercase tracking-wider">
              {currentCourse.category} • {currentCourse.level}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-text-primary mt-2">
              {currentCourse.title}
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed mt-3">
              {currentCourse.overview}
            </p>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-slate-50 border border-border-color rounded-2xl">
            <div>
              <p className="text-[11px] font-bold text-text-light uppercase tracking-wider">Duration</p>
              <p className="text-base font-extrabold text-text-primary mt-0.5">{currentCourse.duration}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-text-light uppercase tracking-wider">Fee Range</p>
              <p className="text-base font-extrabold text-text-primary mt-0.5">{currentCourse.avgFees}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-text-light uppercase tracking-wider">Average Starting Package</p>
              <p className="text-base font-extrabold text-emerald-600 mt-0.5">{currentCourse.startingSalary}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-text-light uppercase tracking-wider">Primary Entrance</p>
              <p className="text-base font-extrabold text-brand-primary mt-0.5">{currentCourse.entranceExams.slice(0, 2).join(', ')}</p>
            </div>
          </div>

          <div className="pt-2 text-xs text-text-secondary">
            <strong className="text-text-primary">Eligibility Requirements:</strong> {currentCourse.eligibility}
          </div>
        </div>

        {/* Specializations & Career Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Specializations */}
          <div className="bg-white border border-border-color rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="font-serif text-xl font-bold text-text-primary flex items-center gap-2">
              <Award className="h-5 w-5 text-brand-primary" />
              <span>Popular Specializations</span>
            </h3>
            <div className="space-y-2.5">
              {currentCourse.specializations.map((spec, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-border-color flex items-center gap-3 text-xs font-semibold text-text-primary">
                  <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Career Opportunities */}
          <div className="bg-white border border-border-color rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="font-serif text-xl font-bold text-text-primary flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-brand-primary" />
              <span>Career Opportunities & Job Roles</span>
            </h3>
            <div className="space-y-3">
              {currentCourse.careerOpportunities.map((career, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-border-color bg-slate-50/60 flex items-center justify-between gap-3">
                  <div>
                    <h4 className="font-serif text-sm font-bold text-text-primary">{career.role}</h4>
                    <p className="text-[11px] text-text-light">{career.topHiring}</p>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                    {career.avgSalary}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Top Colleges Offering Course */}
        {courseColleges.length > 0 && (
          <div className="bg-white border border-border-color rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="font-serif text-xl font-bold text-text-primary">
              Top Institutes Offering {currentCourse.shortName}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courseColleges.map((college) => (
                <div key={college.id} className="p-5 rounded-2xl border border-border-color bg-slate-50/70 hover:border-brand-primary/30 transition-all space-y-3 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-brand-primary bg-brand-accent px-2 py-0.5 rounded-md">
                      NIRF #{college.nirfRank}
                    </span>
                    <h4 className="font-serif text-base font-bold text-text-primary mt-1 line-clamp-1">
                      {college.name}
                    </h4>
                    <p className="text-xs text-text-light">{college.location}</p>

                    <div className="pt-3 border-t border-border-color border-b py-2 my-2 flex items-center justify-between text-xs font-bold">
                      <span className="text-text-secondary">Avg Package:</span>
                      <span className="text-emerald-600">{college.avgPackage}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectCollege(college.id)}
                    className="w-full py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    View College Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQs Accordion */}
        <div className="bg-white border border-border-color rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="font-serif text-xl font-bold text-text-primary flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-brand-primary" />
            <span>Frequently Asked Questions</span>
          </h3>

          <div className="space-y-3">
            {currentCourse.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx
              return (
                <div key={idx} className="border border-border-color rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 text-left font-serif text-sm font-bold text-text-primary flex items-center justify-between gap-3 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 text-text-light transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="p-4 bg-white text-xs text-text-secondary leading-relaxed border-t border-border-color">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Counseling CTA */}
        <div className="bg-gradient-to-r from-brand-primary to-purple-800 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-glow">
          <div>
            <h3 className="font-serif text-2xl font-bold">Unsure Which Branch Suits Your Career Goal?</h3>
            <p className="text-xs sm:text-sm text-purple-100 mt-1 max-w-xl">
              Get personalized course advice based on your entrance score and future salary expectations.
            </p>
          </div>
          <button
            onClick={onOpenCounseling}
            className="px-6 py-3 rounded-xl bg-white text-slate-900 font-bold text-xs sm:text-sm hover:bg-slate-100 transition-colors shadow-lg cursor-pointer whitespace-nowrap"
          >
            Speak to Course Counselor
          </button>
        </div>

      </div>

    </div>
  )
}

export default CourseGuidePage
