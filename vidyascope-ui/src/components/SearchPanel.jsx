import React, { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  X,
  GraduationCap,
  BookOpen,
  Compass,
  Briefcase,
  ArrowRight,
  TrendingUp,
  MapPin,
  Star,
} from 'lucide-react'
import { collegesData } from '../data/collegesData'
import { coursesData } from '../data/coursesData'
import { examsData } from '../data/examsData'
import { careersData } from '../data/careersData'

const SearchPanel = ({
  isOpen,
  onClose,
  onSelectCollege,
  onSelectCourse,
  onSelectExam,
  onSelectCareer,
  onNavigateListing,
}) => {
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all') // 'all' | 'colleges' | 'courses' | 'exams' | 'careers'
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus()
      }, 100)
    } else {
      setQuery('')
      setActiveTab('all')
    }
  }, [isOpen])

  // Multi-entity search results
  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return { colleges: [], courses: [], exams: [], careers: [] }

    const matchedColleges = collegesData
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.shortName.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.stream.toLowerCase().includes(q)
      )
      .slice(0, 4)

    const matchedCourses = coursesData
      .filter(
        (co) =>
          co.title.toLowerCase().includes(q) ||
          co.shortName.toLowerCase().includes(q) ||
          co.category.toLowerCase().includes(q) ||
          (co.specializations && co.specializations.some((s) => s.toLowerCase().includes(q)))
      )
      .slice(0, 4)

    const matchedExams = examsData
      .filter(
        (ex) =>
          ex.name.toLowerCase().includes(q) ||
          ex.fullName.toLowerCase().includes(q) ||
          ex.category.toLowerCase().includes(q)
      )
      .slice(0, 4)

    const matchedCareers = careersData
      .filter(
        (cr) =>
          cr.title.toLowerCase().includes(q) ||
          cr.shortDescription.toLowerCase().includes(q) ||
          cr.streamId.toLowerCase().includes(q)
      )
      .slice(0, 4)

    return {
      colleges: matchedColleges,
      courses: matchedCourses,
      exams: matchedExams,
      careers: matchedCareers,
    }
  }, [query])

  const totalResultsCount =
    results.colleges.length +
    results.courses.length +
    results.exams.length +
    results.careers.length

  const quickTrending = [
    { label: 'IIT Bombay', type: 'college', action: () => onSelectCollege && onSelectCollege('iit-bombay') },
    { label: 'B.Tech CSE', type: 'course', action: () => onSelectCourse && onSelectCourse('btech-cs') },
    { label: 'JEE Main', type: 'exam', action: () => onSelectExam && onSelectExam('jee-main') },
    { label: 'Software Engineer', type: 'career', action: () => onSelectCareer && onSelectCareer('software-engineer') },
    { label: 'IIM Ahmedabad', type: 'college', action: () => onSelectCollege && onSelectCollege('iim-ahmedabad') },
    { label: 'NEET UG', type: 'exam', action: () => onSelectExam && onSelectExam('neet-ug') },
  ]

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="w-full bg-white border-b border-border-color shadow-lg relative z-30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-4">
          
          {/* Top Row: Search Input & Close Action */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search across colleges, courses, entrance exams, or careers..."
                className="w-full pl-11 pr-10 py-3 rounded-xl bg-slate-50 border border-border-color focus:border-brand-primary focus:bg-white outline-none text-sm font-medium text-text-primary transition-all shadow-xs"
              />
              <Search className="h-5 w-5 text-brand-primary absolute left-3.5 top-3.5" />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3.5 top-3.5 text-text-light hover:text-text-primary text-xs font-bold p-0.5 rounded cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              onClick={onClose}
              className="btn btn-secondary btn-md flex-shrink-0 cursor-pointer"
            >
              <X className="h-4 w-4" />
              <span className="hidden sm:inline">Close</span>
            </button>
          </div>

          {/* Filter Tabs Bar (Only when query is present) */}
          {query && (
            <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pt-1 pb-1">
              {[
                { id: 'all', label: `All Results (${totalResultsCount})` },
                { id: 'colleges', label: `Colleges (${results.colleges.length})` },
                { id: 'courses', label: `Courses (${results.courses.length})` },
                { id: 'exams', label: `Exams (${results.exams.length})` },
                { id: 'careers', label: `Careers (${results.careers.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                    activeTab === tab.id
                      ? 'bg-brand-primary text-white font-bold'
                      : 'bg-slate-100 text-text-secondary hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* Search Content Body */}
          <div className="max-h-[60vh] overflow-y-auto custom-scrollbar pt-1 pb-2">
            
            {/* Empty State: Trending Suggestions */}
            {!query ? (
              <div className="py-3 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-text-light uppercase tracking-wider">
                  <TrendingUp className="h-3.5 w-3.5 text-brand-primary" />
                  <span>Trending Searches on VidyaScope</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {quickTrending.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        item.action()
                        onClose()
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-brand-accent hover:text-brand-primary border border-border-color text-xs font-semibold text-text-secondary transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="h-3 w-3 text-text-light" />
                    </button>
                  ))}
                </div>
              </div>
            ) : totalResultsCount > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Colleges Section */}
                {(activeTab === 'all' || activeTab === 'colleges') && results.colleges.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-text-light flex items-center gap-1">
                      <GraduationCap className="h-3.5 w-3.5 text-brand-primary" />
                      <span>Colleges ({results.colleges.length})</span>
                    </span>
                    <div className="space-y-1.5">
                      {results.colleges.map((col) => (
                        <div
                          key={col.id}
                          onClick={() => {
                            onSelectCollege && onSelectCollege(col.id)
                            onClose()
                          }}
                          className="p-2.5 rounded-xl border border-border-color bg-slate-50/50 hover:bg-brand-accent/40 hover:border-brand-primary/30 transition-all cursor-pointer flex items-center justify-between gap-2 group"
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <img
                              src={col.image}
                              alt={col.name}
                              className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="truncate">
                              <h4 className="font-serif text-xs font-bold text-text-primary group-hover:text-brand-primary truncate">
                                {col.name}
                              </h4>
                              <p className="text-[11px] text-text-light flex items-center gap-1">
                                <MapPin className="h-2.5 w-2.5 text-brand-primary" />
                                <span>{col.location}</span>
                                <span>•</span>
                                <span className="font-semibold text-emerald-600">{col.avgPackage}</span>
                              </p>
                            </div>
                          </div>
                          <span className="text-[11px] font-bold text-brand-primary flex-shrink-0 group-hover:underline">
                            View ➔
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Courses Section */}
                {(activeTab === 'all' || activeTab === 'courses') && results.courses.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-text-light flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5 text-brand-primary" />
                      <span>Courses & Degrees ({results.courses.length})</span>
                    </span>
                    <div className="space-y-1.5">
                      {results.courses.map((course) => (
                        <div
                          key={course.id}
                          onClick={() => {
                            onSelectCourse && onSelectCourse(course.id)
                            onClose()
                          }}
                          className="p-2.5 rounded-xl border border-border-color bg-slate-50/50 hover:bg-brand-accent/40 hover:border-brand-primary/30 transition-all cursor-pointer flex items-center justify-between gap-2 group"
                        >
                          <div className="truncate">
                            <h4 className="font-serif text-xs font-bold text-text-primary group-hover:text-brand-primary truncate">
                              {course.title}
                            </h4>
                            <p className="text-[11px] text-text-light">
                              {course.duration} • {course.level}
                            </p>
                          </div>
                          <span className="text-[11px] font-bold text-brand-primary flex-shrink-0 group-hover:underline">
                            Explore ➔
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Entrance Exams Section */}
                {(activeTab === 'all' || activeTab === 'exams') && results.exams.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-text-light flex items-center gap-1">
                      <Compass className="h-3.5 w-3.5 text-brand-primary" />
                      <span>Entrance Exams ({results.exams.length})</span>
                    </span>
                    <div className="space-y-1.5">
                      {results.exams.map((exam) => (
                        <div
                          key={exam.id}
                          onClick={() => {
                            onSelectExam && onSelectExam(exam.id)
                            onClose()
                          }}
                          className="p-2.5 rounded-xl border border-border-color bg-slate-50/50 hover:bg-brand-accent/40 hover:border-brand-primary/30 transition-all cursor-pointer flex items-center justify-between gap-2 group"
                        >
                          <div className="truncate">
                            <h4 className="font-serif text-xs font-bold text-text-primary group-hover:text-brand-primary truncate">
                              {exam.name} ({exam.fullName})
                            </h4>
                            <p className="text-[11px] text-text-light">
                              {exam.level} • {exam.examMode}
                            </p>
                          </div>
                          <span className="text-[11px] font-bold text-brand-primary flex-shrink-0 group-hover:underline">
                            Guide ➔
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Careers Section */}
                {(activeTab === 'all' || activeTab === 'careers') && results.careers.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-text-light flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5 text-brand-primary" />
                      <span>Career Pathways ({results.careers.length})</span>
                    </span>
                    <div className="space-y-1.5">
                      {results.careers.map((career) => (
                        <div
                          key={career.id}
                          onClick={() => {
                            onSelectCareer && onSelectCareer(career.id)
                            onClose()
                          }}
                          className="p-2.5 rounded-xl border border-border-color bg-slate-50/50 hover:bg-brand-accent/40 hover:border-brand-primary/30 transition-all cursor-pointer flex items-center justify-between gap-2 group"
                        >
                          <div className="truncate">
                            <h4 className="font-serif text-xs font-bold text-text-primary group-hover:text-brand-primary truncate">
                              {career.title}
                            </h4>
                            <p className="text-[11px] text-text-light">
                              {career.streamId} • <span className="font-semibold text-emerald-600">{career.avgSalary}</span>
                            </p>
                          </div>
                          <span className="text-[11px] font-bold text-brand-primary flex-shrink-0 group-hover:underline">
                            Path ➔
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            ) : (
              /* No Matches State */
              <div className="py-6 text-center space-y-2">
                <p className="text-xs font-semibold text-text-primary">
                  No exact matches found for "{query}"
                </p>
                <p className="text-[11px] text-text-secondary">
                  Try searching by college name (e.g. IIT, BITS), stream (Engineering, Medical), or exam (JEE, NEET).
                </p>
                <button
                  onClick={() => {
                    onNavigateListing && onNavigateListing({ query })
                    onClose()
                  }}
                  className="btn btn-primary btn-sm mt-1"
                >
                  <span>Search in Colleges Directory</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default SearchPanel
