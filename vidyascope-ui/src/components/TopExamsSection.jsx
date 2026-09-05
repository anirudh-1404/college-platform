import React, { useState, useEffect, useMemo } from 'react'
import { FileText, ArrowRight, BookOpen, Clock, Award } from 'lucide-react'
import { publicApi } from '../api/publicApi'

const categoryLabels = {
  engineering: 'Engineering (B.Tech)',
  management: 'Management (MBA)',
  medical: 'Medical (NEET)',
  law: 'Law (CLAT)',
  design: 'Design & Architecture',
  'applied-sciences': 'Sciences & Humanities',
}

const TopExamsSection = ({ onNavigateExams }) => {
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  // Fetch live exams from backend database
  useEffect(() => {
    const fetchLiveExams = async () => {
      setLoading(true)
      try {
        const data = await publicApi.getExams()
        setExams(data || [])
      } catch (err) {
        console.error('Failed to fetch live exams for homepage:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchLiveExams()
  }, [])

  // Dynamically derive unique categories from live exams entered by admin
  const dynamicCategories = useMemo(() => {
    if (!exams || exams.length === 0) return []
    const uniqueRaw = Array.from(new Set(exams.map((e) => e.category).filter(Boolean)))
    if (uniqueRaw.length === 0) return []

    return [
      { id: 'all', label: 'All Exams' },
      ...uniqueRaw.map((cat) => ({
        id: cat,
        label: categoryLabels[cat.toLowerCase()] || cat.charAt(0).toUpperCase() + cat.slice(1),
      })),
    ]
  }, [exams])

  // Filter exams based on active dynamic tab
  const displayedExams = useMemo(() => {
    if (activeTab === 'all') return exams.slice(0, 6)
    return exams.filter((e) => e.category === activeTab).slice(0, 6)
  }, [exams, activeTab])

  // Colors for icon badges
  const badgeColors = [
    'bg-blue-100 text-blue-700',
    'bg-amber-100 text-amber-700',
    'bg-emerald-100 text-emerald-700',
    'bg-purple-100 text-purple-700',
    'bg-rose-100 text-rose-700',
    'bg-indigo-100 text-indigo-700',
  ]

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-100 text-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="space-y-2 mb-8">
          <span className="text-brand-primary text-xs font-bold tracking-wider uppercase inline-flex items-center gap-1">
            <span>&gt;&gt;</span>
            <span>Exams</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#111827]">
            Top Exams By Specialization
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Official eligibility guidelines, exam patterns, and admission schedules directly vetted by testing authorities.
          </p>
        </div>

        {/* Dynamic Filter Pills (Only displayed if categories exist in database) */}
        {dynamicCategories.length > 1 && (
          <div className="inline-flex p-1 bg-slate-100 rounded-full border border-slate-200/80 mb-12 flex-wrap justify-center gap-1">
            {dynamicCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveTab(cat.id)}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === cat.id
                    ? 'bg-brand-primary text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Live Exams Cards Grid */}
        {displayedExams.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left mb-10">
            {displayedExams.map((exam, idx) => {
              const colorClass = badgeColors[idx % badgeColors.length]
              return (
                <div
                  key={exam.id || exam.slug}
                  onClick={onNavigateExams}
                  className="bg-white border border-slate-200/90 rounded-2xl p-6 hover:border-brand-primary hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
                >
                  <div className="space-y-3">
                    {/* Badge Icon & Mode */}
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl ${colorClass} flex items-center justify-center`}>
                        <FileText className="h-5 w-5" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-200">
                        {exam.examMode || 'Online CBT'}
                      </span>
                    </div>

                    {/* Exam Title & Conducting Body */}
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-primary transition-colors">
                        {exam.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {exam.conductingBody || 'National Testing Authority'}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {exam.description || exam.eligibility || 'Official entrance exam details, eligibility criteria, and syllabus highlights.'}
                    </p>
                  </div>

                  {/* Card Footer Link */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#3B82F6]">
                    <span>Syllabus &amp; Schedules</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="p-12 mb-8 bg-slate-50 rounded-2xl border border-slate-200 max-w-xl mx-auto space-y-3">
            <BookOpen className="h-8 w-8 text-slate-400 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">
              {loading ? 'Fetching Entrance Examinations...' : 'No Entrance Exams Published Yet'}
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {loading
                ? 'Connecting to live database...'
                : 'The central administration authority will publish official entrance exam guides, schedules, and cutoffs here.'}
            </p>
          </div>
        )}

        {/* All Exams Link Button */}
        <button
          type="button"
          onClick={onNavigateExams}
          className="px-6 py-2.5 rounded-xl border border-slate-300 hover:border-[#3B82F6] hover:text-[#3B82F6] text-xs font-bold text-slate-700 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
        >
          <span>Explore All Entrance Exams</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>

      </div>
    </section>
  )
}

export default TopExamsSection
