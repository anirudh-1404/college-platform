import React, { useState, useEffect, useMemo } from 'react'
import {
  ChevronRight,
  Home,
  Compass,
  Calendar,
  CheckCircle2,
  BookOpen,
  Award,
  ArrowRight,
  Layers,
  Users,
  Clock,
  FileText,
  Building,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { publicApi } from '../api/publicApi'

const ExamsPage = ({ onNavigateHome, onNavigateColleges, onOpenCounseling }) => {
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedExamId, setSelectedExamId] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState('all')

  // Fetch live exams from backend
  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true)
      try {
        const data = await publicApi.getExams()
        setExams(data || [])
        if (data && data.length > 0 && !selectedExamId) {
          setSelectedExamId(data[0].id || data[0].slug)
        }
      } catch (err) {
        console.error('Failed to fetch exams:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchExams()
  }, [])

  // Dynamically derive unique categories from live exams entered by admin
  const dynamicCategories = useMemo(() => {
    if (!exams || exams.length === 0) return []
    const uniqueRaw = Array.from(new Set(exams.map((e) => e.category).filter(Boolean)))
    if (uniqueRaw.length === 0) return []

    const formatCategory = (cat) => {
      const map = {
        engineering: 'Engineering (B.Tech)',
        management: 'Management (MBA)',
        medical: 'Medical (NEET)',
        law: 'Law (CLAT)',
        design: 'Design & Architecture',
        'applied-sciences': 'Sciences & Humanities',
      }
      return map[cat.toLowerCase()] || cat.charAt(0).toUpperCase() + cat.slice(1)
    }

    return [
      { id: 'all', label: 'All Exams' },
      ...uniqueRaw.map((cat) => ({
        id: cat,
        label: formatCategory(cat),
      })),
    ]
  }, [exams])

  const filteredExams = useMemo(() => {
    if (categoryFilter === 'all') return exams
    return exams.filter((ex) => ex.category === categoryFilter)
  }, [exams, categoryFilter])

  const currentExam = useMemo(() => {
    if (!filteredExams.length) return null
    return (
      filteredExams.find((ex) => ex.id === selectedExamId || ex.slug === selectedExamId) ||
      filteredExams[0]
    )
  }, [filteredExams, selectedExamId])

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
            <span className="text-text-primary font-bold">Entrance Exams Guide</span>
          </nav>
        </div>
      </div>

      {/* Page Header Section */}
      <div className="bg-white border-b border-border-color py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950">
              Major Entrance &amp; Competitive Examinations
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-normal">
              Understand exam eligibility, conducting bodies, question patterns, target colleges, and cutoff requirements for higher education in India.
            </p>
          </div>

          {/* Dynamic Discipline Filters (Rendered ONLY when exams exist in database) */}
          {dynamicCategories.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pt-6">
              {dynamicCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setCategoryFilter(cat.id)
                    const matching =
                      cat.id === 'all' ? exams : exams.filter((e) => e.category === cat.id)
                    if (matching.length > 0) setSelectedExamId(matching[0].id || matching[0].slug)
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    categoryFilter === cat.id
                      ? 'bg-brand-primary text-white font-bold shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Layout: Exam List + Selected Exam Deep-Dive */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredExams.length > 0 && currentExam ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Exam List Cards (Span 4) */}
            <div className="lg:col-span-4 space-y-3">
              <h2 className="font-serif text-sm font-bold text-text-light uppercase tracking-wider mb-2">
                Select an Examination ({filteredExams.length})
              </h2>

              {filteredExams.map((exam) => {
                const isSelected = currentExam?.id === exam.id
                return (
                  <button
                    key={exam.id}
                    onClick={() => setSelectedExamId(exam.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group ${
                      isSelected
                        ? 'bg-white border-brand-primary shadow-xs ring-1 ring-brand-primary'
                        : 'bg-white border-border-color hover:border-brand-primary/40 hover:bg-slate-50/70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 capitalize">
                        {exam.category}
                      </span>
                      <span className="text-[11px] text-text-light font-medium">
                        {exam.frequency || 'Once a year'}
                      </span>
                    </div>

                    <h3 className="font-serif text-base font-bold text-text-primary group-hover:text-brand-primary transition-colors">
                      {exam.shortName || exam.name}
                    </h3>

                    <p className="text-xs text-text-secondary line-clamp-2 mt-1 font-normal">
                      {exam.name}
                    </p>

                    <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-text-light font-medium truncate max-w-[180px]">
                        {exam.conductingBody}
                      </span>
                      <span
                        className={`font-bold flex items-center gap-0.5 ${
                          isSelected ? 'text-brand-primary' : 'text-text-light'
                        }`}
                      >
                        <span>View Details</span>
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Right Column: Comprehensive Exam Profile (Span 8) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentExam.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-8 space-y-6"
              >
                {/* Header Card */}
                <div className="bg-white border border-border-color rounded-xl p-6 sm:p-8 space-y-5 shadow-card">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-purple-50 text-brand-primary text-xs font-bold uppercase">
                        {currentExam.level || 'National Level'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-text-secondary text-xs font-semibold">
                        {currentExam.mode || 'Computer Based Test'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold">
                        {currentExam.duration || '180 Minutes'}
                      </span>
                    </div>

                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary">
                      {currentExam.name}
                    </h2>

                    {currentExam.overview && (
                      <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mt-2 font-normal">
                        {currentExam.overview}
                      </p>
                    )}
                  </div>

                  {/* Schedule Timeline Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 border border-border-color rounded-xl text-xs">
                    <div>
                      <p className="text-[10px] font-semibold text-text-light uppercase tracking-wider">
                        Conducting Body
                      </p>
                      <p className="font-bold text-text-primary mt-0.5 truncate">
                        {currentExam.conductingBody}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-text-light uppercase tracking-wider">
                        Application Window
                      </p>
                      <p className="font-bold text-text-primary mt-0.5">
                        {currentExam.examDates?.applicationStart || 'Nov - Jan'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-text-light uppercase tracking-wider">
                        Exam Date
                      </p>
                      <p className="font-bold text-purple-700 mt-0.5">
                        {currentExam.examDates?.examDate || 'May 2026'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-text-light uppercase tracking-wider">
                        Results
                      </p>
                      <p className="font-bold text-emerald-600 mt-0.5">
                        {currentExam.examDates?.resultDate || 'June 2026'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Core Exam Details */}
                <div className="bg-white border border-border-color rounded-xl p-6 sm:p-8 space-y-6 shadow-card">
                  {/* 1. Basic Eligibility */}
                  <div className="space-y-2">
                    <h3 className="font-serif text-base font-bold text-text-primary flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>Eligibility Criteria</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed pl-6 font-normal">
                      {currentExam.eligibility || '10+2 with relevant subjects.'}
                    </p>
                  </div>

                  {/* 2. Target Colleges Scope */}
                  {currentExam.targetCollegesCount && (
                    <div className="space-y-2 pt-3 border-t border-border-color">
                      <h3 className="font-serif text-base font-bold text-text-primary flex items-center gap-2">
                        <Award className="h-4 w-4 text-brand-primary" />
                        <span>Target Participating Institutions</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-text-secondary leading-relaxed pl-6 font-normal">
                        {currentExam.targetCollegesCount}
                      </p>
                    </div>
                  )}

                  {/* 3. Syllabus Highlights */}
                  {currentExam.syllabusHighlights && currentExam.syllabusHighlights.length > 0 && (
                    <div className="space-y-3 pt-3 border-t border-border-color">
                      <h3 className="font-serif text-base font-bold text-text-primary flex items-center gap-2">
                        <FileText className="h-4 w-4 text-brand-primary" />
                        <span>Key Syllabus & Topic Areas</span>
                      </h3>
                      <div className="flex flex-wrap gap-2 pl-6">
                        {currentExam.syllabusHighlights.map((topic, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-semibold text-slate-800"
                          >
                            ✓ {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bottom Actions */}
                  <div className="pt-4 border-t border-border-color flex flex-wrap items-center justify-between gap-3">
                    <button
                      onClick={onNavigateColleges}
                      className="text-xs font-bold text-text-secondary hover:text-brand-primary flex items-center gap-1 cursor-pointer"
                    >
                      <span>Explore Colleges Accepting This Exam</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <div className="p-16 text-center bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-3">
            <FileText className="h-10 w-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">
              {loading ? 'Loading Entrance Examinations...' : 'No Entrance Examinations Found'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-normal">
              {loading
                ? 'Fetching live examination guides from central database...'
                : 'The central administration authority will publish official entrance exam guides and schedules here.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ExamsPage
