import React from 'react'
import { Calendar, CheckCircle2, ArrowRight, Compass } from 'lucide-react'
import { examsData } from '../data/examsData'

const TrendingExams = ({ onNavigate }) => {
  return (
    <section className="py-16 bg-white border-t border-border-color">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent text-brand-primary text-xs font-bold uppercase tracking-wider mb-3">
              <Compass className="h-3.5 w-3.5" />
              <span>Entrance Examinations</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-text-primary">
              Trending Entrance Exams 2025–26
            </h2>
            <p className="text-text-secondary text-sm sm:text-base mt-2 max-w-2xl">
              Track upcoming registration deadlines, exam dates, eligibility criteria, and cutoffs for major national entrance tests.
            </p>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('course-guide')}
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-primary hover:text-brand-primary-hover transition-colors group cursor-pointer self-start md:self-auto"
          >
            <span>View All Exam Guides</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Exams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {examsData.map((exam) => (
            <div
              key={exam.id}
              className="bg-slate-50/70 border border-border-color hover:border-brand-primary/30 rounded-2xl p-6 transition-all duration-300 hover:shadow-card flex flex-col justify-between group"
            >
              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-brand-primary bg-brand-accent px-2.5 py-1 rounded-md border border-brand-primary/10">
                    {exam.level}
                  </span>
                  <span className="text-xs font-semibold text-text-light flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-brand-primary" />
                    <span>{exam.examMode}</span>
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-text-primary group-hover:text-brand-primary transition-colors mb-1">
                  {exam.name}
                </h3>
                <p className="text-xs font-semibold text-text-secondary mb-3">
                  {exam.fullName}
                </p>
                <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed mb-4">
                  {exam.description}
                </p>

                {/* Info List */}
                <div className="space-y-2 py-3 border-t border-border-color border-b border-border-color/60 text-xs">
                  <div className="flex items-start gap-2 text-text-secondary">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span><strong className="text-text-primary">Body:</strong> {exam.conductingBody}</span>
                  </div>
                  <div className="flex items-start gap-2 text-text-secondary">
                    <Calendar className="h-4 w-4 text-brand-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-text-primary">Exam Date:</strong> {exam.examDate}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="mt-5 flex items-center justify-between">
                <span className="text-[11px] font-bold text-text-light uppercase tracking-wider">
                  {exam.category}
                </span>
                <button
                  onClick={() => onNavigate && onNavigate('course-guide')}
                  className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Check Cutoffs</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default TrendingExams
