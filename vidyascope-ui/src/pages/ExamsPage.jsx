import React, { useState, useMemo } from 'react'
import {
  ChevronRight, Home, Compass, Calendar, CheckCircle2,
  BookOpen, Award, ArrowRight, Layers, Users, HelpCircle,
  Clock, FileText
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { examsData } from '../data/examsData'

const ExamsPage = ({ onNavigateHome, onNavigateColleges, onOpenCounseling }) => {
  const [selectedExamId, setSelectedExamId] = useState('jee-main')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const filteredExams = useMemo(() => {
    if (categoryFilter === 'all') return examsData
    return examsData.filter((ex) => ex.category === categoryFilter)
  }, [categoryFilter])

  const currentExam = useMemo(() => {
    return (
      examsData.find((ex) => ex.id === selectedExamId) ||
      filteredExams[0] ||
      examsData[0]
    )
  }, [selectedExamId, filteredExams])

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
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand-accent text-brand-primary text-xs font-bold uppercase tracking-wider mb-2.5">
              <Compass className="h-3.5 w-3.5" />
              <span>Educational Entrance Exam Guide</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary">
              Major Entrance & Competitive Examinations
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-2 leading-relaxed">
              Understand exam eligibility, conducting bodies, question patterns, target colleges, and cutoff requirements for higher education in India.
            </p>
          </div>

          {/* Discipline Filters */}
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pt-6">
            {[
              { id: 'all', label: 'All Exams' },
              { id: 'engineering', label: 'Engineering (JEE / BITSAT)' },
              { id: 'management', label: 'Management (CAT / XAT)' },
              { id: 'medical', label: 'Medical (NEET UG)' },
              { id: 'law', label: 'Law (CLAT)' },
              { id: 'applied-sciences', label: 'Central Universities (CUET)' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setCategoryFilter(cat.id)
                  const matching = cat.id === 'all' ? examsData : examsData.filter((e) => e.category === cat.id)
                  if (matching.length > 0) setSelectedExamId(matching[0].id)
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  categoryFilter === cat.id
                    ? 'bg-brand-primary text-white font-bold'
                    : 'bg-slate-100 text-text-secondary hover:text-brand-primary hover:bg-brand-accent'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Layout: Exam List + Selected Exam Deep-Dive */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Exam List Cards (Span 4) */}
          <div className="lg:col-span-4 space-y-3">
            <h2 className="font-serif text-sm font-bold text-text-light uppercase tracking-wider mb-2">
              Select an Examination ({filteredExams.length})
            </h2>

            {filteredExams.map((exam) => {
              const isSelected = currentExam.id === exam.id
              return (
                <button
                  key={exam.id}
                  onClick={() => setSelectedExamId(exam.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group ${
                    isSelected
                      ? 'bg-white border-brand-primary shadow-sm ring-1 ring-brand-primary'
                      : 'bg-white border-border-color hover:border-brand-primary/40 hover:bg-slate-50/70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        isSelected
                          ? 'bg-brand-accent text-brand-primary'
                          : 'bg-slate-100 text-text-secondary'
                      }`}
                    >
                      {exam.category}
                    </span>
                    <span className="text-[11px] text-text-light font-medium">
                      {exam.frequency}
                    </span>
                  </div>

                  <h3 className="font-serif text-base font-bold text-text-primary group-hover:text-brand-primary transition-colors">
                    {exam.name}
                  </h3>

                  <p className="text-xs text-text-secondary line-clamp-2 mt-1">
                    {exam.fullName}
                  </p>

                  <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-text-light font-medium">
                      {exam.conductingBody}
                    </span>
                    <span
                      className={`font-bold flex items-center gap-0.5 ${
                        isSelected ? 'text-brand-primary' : 'text-text-light'
                      }`}
                    >
                      <span>Read Guide</span>
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
            <div className="bg-white border border-border-color rounded-xl p-6 sm:p-8 space-y-5">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-brand-accent text-brand-primary text-xs font-bold uppercase">
                    {currentExam.level}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-text-secondary text-xs font-semibold">
                    {currentExam.examMode}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold">
                    {currentExam.frequency}
                  </span>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary">
                  {currentExam.name} ({currentExam.fullName})
                </h2>

                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mt-2">
                  {currentExam.description}
                </p>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 border border-border-color rounded-xl text-xs">
                <div>
                  <p className="text-[10px] font-semibold text-text-light uppercase tracking-wider">
                    Conducting Authority
                  </p>
                  <p className="font-bold text-text-primary mt-0.5">{currentExam.conductingBody}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-text-light uppercase tracking-wider">
                    Tentative Exam Timeline
                  </p>
                  <p className="font-bold text-brand-primary mt-0.5">{currentExam.examDate}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-text-light uppercase tracking-wider">
                    Application Window
                  </p>
                  <p className="font-bold text-text-primary mt-0.5">{currentExam.applicationDate}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-text-light uppercase tracking-wider">
                    Result Timeline
                  </p>
                  <p className="font-bold text-emerald-600 mt-0.5">{currentExam.resultDate}</p>
                </div>
              </div>
            </div>

            {/* Core Educational Details */}
            <div className="bg-white border border-border-color rounded-xl p-6 sm:p-8 space-y-6">
              
              {/* 1. What is it & Who should consider it */}
              <div className="space-y-2">
                <h3 className="font-serif text-base font-bold text-text-primary flex items-center gap-2">
                  <Users className="h-4 w-4 text-brand-primary" />
                  <span>Who Should Consider Taking {currentExam.name}?</span>
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed pl-6">
                  {currentExam.targetAudience || 'Students aspiring for top undergraduate or postgraduate technical programs in India.'}
                </p>
              </div>

              {/* 2. Basic Eligibility */}
              <div className="space-y-2 pt-3 border-t border-border-color">
                <h3 className="font-serif text-base font-bold text-text-primary flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Eligibility Criteria</span>
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed pl-6">
                  {currentExam.eligibility}
                </p>
              </div>

              {/* 3. Question Pattern & Scoring */}
              <div className="space-y-2 pt-3 border-t border-border-color">
                <h3 className="font-serif text-base font-bold text-text-primary flex items-center gap-2">
                  <FileText className="h-4 w-4 text-brand-primary" />
                  <span>Exam Structure & Question Pattern</span>
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed pl-6">
                  {currentExam.pattern}
                </p>
              </div>

              {/* 4. Participating Institutions */}
              <div className="space-y-2 pt-3 border-t border-border-color">
                <h3 className="font-serif text-base font-bold text-text-primary flex items-center gap-2">
                  <Award className="h-4 w-4 text-brand-primary" />
                  <span>Participating Colleges & Universities</span>
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed pl-6">
                  {currentExam.participatingColleges}
                </p>
              </div>

              {/* 5. Cutoff Guidance */}
              {currentExam.cutoffGuidance && (
                <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-100 space-y-1.5">
                  <h4 className="font-serif text-xs font-bold text-brand-primary uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5" />
                    <span>Cutoff & Score Targets</span>
                  </h4>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {currentExam.cutoffGuidance}
                  </p>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-border-color flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={onNavigateColleges}
                  className="text-xs font-bold text-text-secondary hover:text-brand-primary flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore Participating Colleges</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>

                <button
                  onClick={onOpenCounseling}
                  className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Get Exam Preparation Advice
                </button>
              </div>

            </div>

            </motion.div>
          </AnimatePresence>

        </div>
      </div>

    </div>
  )
}

export default ExamsPage
