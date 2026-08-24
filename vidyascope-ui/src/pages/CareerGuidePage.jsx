import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight, Home, Compass, ArrowRight, ArrowLeft,
  CheckCircle2, Briefcase, GraduationCap, Award, BookOpen,
  TrendingUp, Search, Clock, FileText, Building2, MapPin,
  Star, Layers, ShieldCheck, X, PhoneCall, HelpCircle,
  Cpu, Stethoscope, Scale, Palette, Sparkles
} from 'lucide-react'
import { stagesData, streamsData, careersData, careerGuidesData } from '../data/careersData'
import { collegesData } from '../data/collegesData'

const streamIconMap = {
  Sparkles: Sparkles,
  Cpu: Cpu,
  Briefcase: Briefcase,
  Stethoscope: Stethoscope,
  Scale: Scale,
  TrendingUp: TrendingUp,
  BookOpen: BookOpen,
  Palette: Palette,
}

const CareerGuidePage = ({
  onNavigateHome,
  onOpenCounseling,
  onNavigateColleges,
  onNavigateCourses,
  onNavigateExams,
  onSelectCollege,
  initialCareerId = null,
}) => {
  const [selectedStageId, setSelectedStageId] = useState('after-12th')
  const [selectedStreamId, setSelectedStreamId] = useState('all')
  const [selectedCareerId, setSelectedCareerId] = useState(initialCareerId)
  const [selectedGuideId, setSelectedGuideId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Filtered Careers based on stage, stream, and search query
  const filteredCareers = useMemo(() => {
    return careersData.filter((career) => {
      const matchesStage = selectedStageId === 'all' || career.stageTags.includes(selectedStageId)
      const matchesStream = selectedStreamId === 'all' || career.streamId === selectedStreamId
      const matchesSearch =
        searchQuery.trim() === '' ||
        career.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        career.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        career.relevantCourses.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
        career.entranceExams.some((e) => e.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchesStage && matchesStream && matchesSearch
    })
  }, [selectedStageId, selectedStreamId, searchQuery])

  // Active Career for Detail View
  const currentCareer = useMemo(() => {
    if (!selectedCareerId) return null
    return careersData.find((c) => c.id === selectedCareerId) || null
  }, [selectedCareerId])

  // Active Guide for Reader Modal
  const currentGuide = useMemo(() => {
    if (!selectedGuideId) return null
    return careerGuidesData.find((g) => g.id === selectedGuideId) || null
  }, [selectedGuideId])

  // Related Colleges for Selected Career
  const careerColleges = useMemo(() => {
    if (!currentCareer || !currentCareer.relatedCollegeIds) return []
    return collegesData.filter((c) => currentCareer.relatedCollegeIds.includes(c.id)).slice(0, 4)
  }, [currentCareer])

  const activeStage = stagesData.find((s) => s.id === selectedStageId) || stagesData[1]

  return (
    <div className="min-h-screen bg-slate-50/40 pb-20">
      
      {/* 1. Breadcrumb Navigation */}
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
              onClick={() => {
                setSelectedCareerId(null)
                setSelectedGuideId(null)
              }}
              className={`hover:text-brand-primary cursor-pointer ${
                !currentCareer ? 'text-text-primary font-bold' : ''
              }`}
            >
              Career Guidance
            </button>
            {currentCareer && (
              <>
                <ChevronRight className="h-3 w-3 text-slate-400" />
                <span className="text-text-primary font-bold truncate max-w-[200px] sm:max-w-none">
                  {currentCareer.title}
                </span>
              </>
            )}
          </nav>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ========================================================================= */}
        {/* VIEW 1: CAREER DIRECTORY & ROADMAP EXPLORER (When no career is selected) */}
        {/* ========================================================================= */}
        {!currentCareer ? (
          <motion.div
            key="career-explorer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            {/* Minimal Clean Hero Header */}
            <section className="bg-white border-b border-border-color py-10 sm:py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-brand-accent text-brand-primary text-[11px] font-bold uppercase tracking-wider mb-3">
                    <Compass className="h-3.5 w-3.5" />
                    <span>Education & Career Guidance</span>
                  </div>

                  <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight leading-tight">
                    Find the Right Career Path for You
                  </h1>

                  <p className="text-xs sm:text-sm text-text-secondary font-medium mt-2.5 leading-relaxed">
                    Explore career options, courses, and top Indian colleges to find an educational roadmap that fits your interests and long-term goals.
                  </p>
                </div>

                {/* Entry Stage Selector (After 10th, After 12th, After Graduation, Career Change) */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {stagesData.map((stage) => {
                    const isSelected = selectedStageId === stage.id
                    return (
                      <button
                        key={stage.id}
                        onClick={() => setSelectedStageId(stage.id)}
                        className={`text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                            : 'bg-slate-50 border-border-color hover:bg-slate-100 hover:border-slate-300 text-text-primary'
                        }`}
                      >
                        <div>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${
                              isSelected ? 'text-purple-200' : 'text-brand-primary'
                            }`}
                          >
                            Academic Stage
                          </span>
                          <h2 className="font-serif text-base font-bold leading-snug">
                            {stage.title}
                          </h2>
                          <p
                            className={`text-xs mt-1.5 line-clamp-2 leading-relaxed ${
                              isSelected ? 'text-purple-100' : 'text-text-secondary'
                            }`}
                          >
                            {stage.tagline}
                          </p>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-white/20 text-[11px] font-semibold flex items-center justify-between">
                          <span className={isSelected ? 'text-white' : 'text-text-light'}>
                            {isSelected ? 'Viewing Stage' : 'Explore stage'}
                          </span>
                          <ArrowRight
                            className={`h-3.5 w-3.5 ${
                              isSelected ? 'text-white' : 'text-text-light'
                            }`}
                          />
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Active Stage Context Box */}
                <div className="mt-4 p-3.5 rounded-xl bg-brand-accent/50 border border-brand-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-brand-primary flex-shrink-0" />
                    <span className="text-text-secondary font-medium">
                      <strong className="text-text-primary">{activeStage.title}:</strong>{' '}
                      {activeStage.description}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0 text-text-light font-semibold">
                    <span className="hidden sm:inline">Popular:</span>
                    <span className="text-brand-primary font-bold">
                      {activeStage.popularRoutes[0]}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              
              {/* 2. Explore by Stream Section */}
              <div className="bg-white border border-border-color rounded-xl p-6 sm:p-7 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                      Domain Navigation
                    </span>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-text-primary mt-0.5">
                      Explore by Academic Stream
                    </h2>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Select your domain of interest to see verified career roles, average salaries, and courses.
                    </p>
                  </div>

                  {/* Search Bar for Careers */}
                  <div className="relative w-full sm:w-64 flex-shrink-0">
                    <input
                      type="text"
                      placeholder="Search career, skill, or exam..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-border-color focus:border-brand-primary outline-none text-xs font-medium"
                    />
                    <Search className="h-4 w-4 text-text-light absolute left-3 top-2.5" />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-2.5 text-text-light hover:text-text-primary text-xs font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Stream Pills Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2.5">
                  {streamsData.map((stream) => {
                    const isSelected = selectedStreamId === stream.id
                    const IconComponent = streamIconMap[stream.iconName] || Sparkles

                    return (
                      <button
                        key={stream.id}
                        onClick={() => setSelectedStreamId(stream.id)}
                        className={`p-3 rounded-xl border text-left transition-colors cursor-pointer flex items-center gap-2.5 ${
                          isSelected
                            ? 'bg-brand-primary text-white border-brand-primary font-bold shadow-xs'
                            : 'bg-white border-border-color hover:bg-slate-50 text-text-primary'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 text-brand-primary'
                          }`}
                        >
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="overflow-hidden">
                          <span className="text-xs font-bold block truncate">
                            {stream.name}
                          </span>
                          <span
                            className={`text-[10px] block truncate ${
                              isSelected ? 'text-purple-200' : 'text-text-light'
                            }`}
                          >
                            {stream.badge}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 3. Popular Career Options Section */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                      Verified Roadmaps
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-text-primary mt-0.5">
                      Popular Career Options ({filteredCareers.length})
                    </h2>
                  </div>
                  <p className="text-xs text-text-light font-medium">
                    Click any career card to view educational roadmap, required exams, and colleges.
                  </p>
                </div>

                {/* Careers Grid */}
                {filteredCareers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {filteredCareers.map((career) => (
                      <div
                        key={career.id}
                        onClick={() => setSelectedCareerId(career.id)}
                        className="bg-white border border-border-color rounded-xl p-5 hover:border-brand-primary/40 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                      >
                        <div className="space-y-3">
                          {/* Top Row: Stream & Badge */}
                          <div className="flex items-center justify-between gap-2">
                            <span className="px-2 py-0.5 rounded bg-brand-accent text-brand-primary text-[10px] font-bold uppercase tracking-wider">
                              {career.streamId}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                              {career.badge}
                            </span>
                          </div>

                          {/* Career Title & Description */}
                          <div>
                            <h3 className="font-serif text-base font-bold text-text-primary group-hover:text-brand-primary transition-colors">
                              {career.title}
                            </h3>
                            <p className="text-xs text-text-secondary mt-1 line-clamp-2 leading-relaxed">
                              {career.shortDescription}
                            </p>
                          </div>

                          {/* Salary Metric */}
                          <div className="p-2.5 rounded-lg bg-slate-50 border border-border-color flex items-center justify-between text-xs">
                            <span className="text-[10px] font-semibold text-text-light uppercase tracking-wider">
                              Avg Package
                            </span>
                            <span className="font-bold text-emerald-600">
                              {career.avgSalary}
                            </span>
                          </div>

                          {/* Relevant Courses */}
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-text-light block mb-1">
                              Relevant Courses
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {career.relevantCourses.slice(0, 2).map((course, cIdx) => (
                                <span
                                  key={cIdx}
                                  className="px-2 py-0.5 rounded bg-slate-100 text-text-secondary text-[11px] font-medium"
                                >
                                  {course}
                                </span>
                              ))}
                              {career.relevantCourses.length > 2 && (
                                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-text-light text-[10px] font-semibold">
                                  +{career.relevantCourses.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Entrance Exams */}
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-text-light block mb-1">
                              Entrance Gateways
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {career.entranceExams.slice(0, 3).map((exam, eIdx) => (
                                <span
                                  key={eIdx}
                                  className="px-2 py-0.5 rounded bg-purple-50 text-brand-primary text-[10px] font-semibold"
                                >
                                  {exam}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Card Footer CTA */}
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-brand-primary group-hover:text-brand-primary-hover">
                          <span>View Career Roadmap</span>
                          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border border-border-color rounded-xl p-10 text-center space-y-3">
                    <Compass className="h-8 w-8 text-brand-primary mx-auto opacity-70" />
                    <h3 className="font-serif text-lg font-bold text-text-primary">
                      No Careers Found Matching Your Filter
                    </h3>
                    <p className="text-xs text-text-secondary max-w-sm mx-auto">
                      Try selecting "All Streams" or resetting your search query to explore all career directions.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedStreamId('all')
                        setSelectedStageId('all')
                        setSearchQuery('')
                      }}
                      className="btn btn-primary btn-sm"
                    >
                      <span>Show All Careers</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 4. Popular Career Guides Section */}
              <div className="bg-white border border-border-color rounded-xl p-6 sm:p-7 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                      In-Depth Decision Guides
                    </span>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-text-primary mt-0.5">
                      Popular Career Guides & Decision Frameworks
                    </h2>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Actionable answers to common stream selection, branch comparisons, and degree dilemmas.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {careerGuidesData.map((guide) => (
                    <div
                      key={guide.id}
                      onClick={() => setSelectedGuideId(guide.id)}
                      className="p-4 rounded-xl border border-border-color bg-slate-50/50 hover:bg-white hover:border-brand-primary/40 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary bg-brand-accent px-2 py-0.5 rounded">
                            {guide.category}
                          </span>
                          <span className="text-[10px] text-text-light font-medium flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{guide.readTime}</span>
                          </span>
                        </div>

                        <h3 className="font-serif text-sm font-bold text-text-primary group-hover:text-brand-primary transition-colors leading-snug">
                          {guide.title}
                        </h3>

                        <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                          {guide.summary}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-border-color flex items-center justify-between text-xs font-semibold text-text-light group-hover:text-brand-primary">
                        <span>Read Decision Guide</span>
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Need Help? Free Counseling Banner */}
              <div className="bg-navy-dark text-white p-6 sm:p-8 rounded-2xl border border-border-dark flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-primary bg-brand-primary/15 px-2.5 py-0.5 rounded-full border border-brand-primary/25">
                    <PhoneCall className="h-3 w-3" />
                    <span>1-on-1 Guidance</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                    Need Help Deciding Your Stream or Degree?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                    Connect with our experienced admission advisors for personalized stream selection, course evaluation, and college shortlisting.
                  </p>
                </div>

                <div className="flex-shrink-0">
                  <button
                    onClick={onOpenCounseling}
                    className="btn btn-primary btn-md"
                  >
                    <span>Book Free Counseling Call</span>
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        ) : (
          /* ========================================================================= */
          /* VIEW 2: INDIVIDUAL CAREER DETAIL VIEW (Career → Course → College Flow)     */
          /* ========================================================================= */
          <motion.div
            key={`career-detail-${currentCareer.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6"
          >
            {/* Back Button */}
            <button
              onClick={() => setSelectedCareerId(null)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:underline cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to All Career Paths</span>
            </button>

            {/* Career Header Profile Card */}
            <div className="bg-white border border-border-color rounded-xl p-6 sm:p-8 space-y-6">
              
              {/* Header Details */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-brand-accent text-brand-primary text-xs font-bold uppercase tracking-wider">
                      {currentCareer.streamId} Domain
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-xs font-bold">
                      {currentCareer.badge}
                    </span>
                  </div>

                  <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary">
                    {currentCareer.title}
                  </h1>

                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-3xl">
                    {currentCareer.shortDescription}
                  </p>
                </div>

                {/* Salary Package Callout */}
                <div className="p-4 rounded-xl bg-slate-50 border border-border-color flex-shrink-0 text-left md:text-right min-w-[200px]">
                  <span className="text-[10px] font-semibold text-text-light uppercase tracking-wider block">
                    Average Salary Package
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-emerald-600 mt-0.5 block">
                    {currentCareer.avgSalary}
                  </span>
                  <span className="text-[10px] text-text-light mt-0.5 block">
                    Verified Industry Benchmark
                  </span>
                </div>
              </div>

              {/* SECTION 1: What this career involves */}
              <div className="pt-4 border-t border-border-color space-y-3">
                <h2 className="font-serif text-lg font-bold text-text-primary flex items-center gap-2">
                  <Briefcase className="h-4.5 w-4.5 text-brand-primary" />
                  <span>What this Career Involves</span>
                </h2>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  {currentCareer.overview}
                </p>
              </div>

              {/* SECTION 2: Recommended Courses & Degrees */}
              <div className="pt-4 border-t border-border-color space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-lg font-bold text-text-primary flex items-center gap-2">
                    <GraduationCap className="h-4.5 w-4.5 text-brand-primary" />
                    <span>Recommended Courses & Degree Programs</span>
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {currentCareer.relevantCourses.map((course, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-border-color bg-slate-50 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <BookOpen className="h-4 w-4 text-brand-primary flex-shrink-0" />
                        <span className="text-xs font-bold text-text-primary">{course}</span>
                      </div>
                      <button
                        onClick={() => {
                          if (onNavigateCourses) onNavigateCourses()
                        }}
                        className="text-[11px] font-bold text-brand-primary hover:underline flex-shrink-0 cursor-pointer"
                      >
                        View Courses ➔
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 3: Step-by-Step Educational Pathway */}
              <div className="pt-4 border-t border-border-color space-y-3">
                <h2 className="font-serif text-lg font-bold text-text-primary flex items-center gap-2">
                  <Compass className="h-4.5 w-4.5 text-brand-primary" />
                  <span>Educational Pathway & Eligibility</span>
                </h2>

                <div className="space-y-2.5">
                  {currentCareer.educationPath.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-border-color bg-slate-50/50 flex items-start gap-3 text-xs"
                    >
                      <div className="w-5 h-5 rounded-full bg-brand-primary text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <span className="text-text-secondary leading-relaxed font-medium">
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 4: Core Skills & Competencies */}
              <div className="pt-4 border-t border-border-color space-y-3">
                <h2 className="font-serif text-lg font-bold text-text-primary flex items-center gap-2">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />
                  <span>Key Skills & Industry Competencies</span>
                </h2>

                <div className="flex flex-wrap gap-2">
                  {currentCareer.keySkills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-text-primary text-xs font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* SECTION 5: Career Progression & Seniority Levels */}
              <div className="pt-4 border-t border-border-color space-y-3">
                <h2 className="font-serif text-lg font-bold text-text-primary flex items-center gap-2">
                  <TrendingUp className="h-4.5 w-4.5 text-brand-primary" />
                  <span>Career Progression & Salary Levels</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {currentCareer.careerProgression.map((prog, pIdx) => (
                    <div
                      key={pIdx}
                      className="p-4 rounded-xl border border-border-color bg-slate-50 space-y-2"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary block">
                        {prog.level}
                      </span>
                      <h3 className="font-serif text-xs font-bold text-text-primary">
                        {prog.roles}
                      </h3>
                      <div className="pt-1.5 border-t border-slate-200">
                        <span className="text-[10px] text-text-light font-semibold uppercase block">
                          Compensation
                        </span>
                        <span className="text-xs font-bold text-emerald-600">
                          {prog.salary}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 6: Key Entrance Exams */}
              <div className="pt-4 border-t border-border-color space-y-3">
                <h2 className="font-serif text-lg font-bold text-text-primary flex items-center gap-2">
                  <Award className="h-4.5 w-4.5 text-brand-primary" />
                  <span>Primary Qualifying Entrance Exams</span>
                </h2>

                <div className="flex flex-wrap gap-2">
                  {currentCareer.entranceExams.map((exam, eIdx) => (
                    <div
                      key={eIdx}
                      className="px-3.5 py-2 rounded-xl bg-purple-50 border border-purple-100 text-brand-primary text-xs font-bold flex items-center gap-2"
                    >
                      <span>{exam}</span>
                      {onNavigateExams && (
                        <button
                          onClick={() => onNavigateExams()}
                          className="text-[10px] font-semibold text-text-light hover:text-brand-primary underline cursor-pointer"
                        >
                          Exam Details
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 7: Related Colleges on VidyaScope */}
              {careerColleges.length > 0 && (
                <div className="pt-4 border-t border-border-color space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="font-serif text-lg font-bold text-text-primary flex items-center gap-2">
                      <Building2 className="h-4.5 w-4.5 text-brand-primary" />
                      <span>Top Colleges Offering Relevant Programs</span>
                    </h2>
                    <button
                      onClick={() => onNavigateColleges && onNavigateColleges({ stream: currentCareer.streamId })}
                      className="text-xs font-bold text-brand-primary hover:underline cursor-pointer"
                    >
                      View all in {currentCareer.streamId} ➔
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {careerColleges.map((col) => (
                      <div
                        key={col.id}
                        onClick={() => onSelectCollege && onSelectCollege(col.id)}
                        className="bg-white border border-border-color rounded-xl overflow-hidden hover:border-brand-primary/40 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                      >
                        <div>
                          <div className="h-28 overflow-hidden bg-slate-100 relative">
                            <img
                              src={col.image}
                              alt={col.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-slate-900/80 text-white text-[9px] font-bold uppercase">
                              NIRF #{col.nirfRank}
                            </span>
                          </div>
                          <div className="p-3 space-y-1">
                            <h3 className="font-serif text-xs font-bold text-text-primary group-hover:text-brand-primary transition-colors line-clamp-1">
                              {col.name}
                            </h3>
                            <p className="text-[11px] text-text-light flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-brand-primary flex-shrink-0" />
                              <span className="truncate">{col.location}</span>
                            </p>
                          </div>
                        </div>

                        <div className="p-3 pt-2 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-emerald-600">{col.avgPackage} Avg</span>
                          <span className="font-bold text-brand-primary group-hover:underline">Explore ➔</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Actions Bar */}
              <div className="pt-6 border-t border-border-color flex flex-wrap items-center justify-between gap-4">
                <button
                  onClick={() => setSelectedCareerId(null)}
                  className="btn btn-secondary btn-sm"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to all careers</span>
                </button>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => onNavigateColleges && onNavigateColleges({ stream: currentCareer.streamId })}
                    className="btn btn-secondary btn-md"
                  >
                    <span>Browse Colleges</span>
                  </button>

                  <button
                    onClick={onOpenCounseling}
                    className="btn btn-primary btn-md"
                  >
                    <span>Book Career Counseling</span>
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* GUIDE READER MODAL (Decision Articles / Guides)                          */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {currentGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
              onClick={() => setSelectedGuideId(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-border-color p-6 sm:p-8 z-10 max-h-[85vh] overflow-y-auto custom-scrollbar space-y-5"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-border-color">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded bg-brand-accent text-brand-primary text-[10px] font-bold uppercase tracking-wider">
                      {currentGuide.category}
                    </span>
                    <span className="text-[10px] text-text-light font-medium flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{currentGuide.readTime}</span>
                    </span>
                  </div>

                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-text-primary">
                    {currentGuide.title}
                  </h2>
                </div>

                <button
                  onClick={() => setSelectedGuideId(null)}
                  className="p-1.5 rounded-lg text-text-light hover:text-text-primary hover:bg-slate-100 transition-colors cursor-pointer flex-shrink-0"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Guide Content Body */}
              <div className="space-y-4 text-xs sm:text-sm text-text-secondary leading-relaxed">
                <p className="font-semibold text-text-primary">
                  {currentGuide.content.headline}
                </p>
                <p>{currentGuide.content.intro}</p>

                {/* Science Guide Sections */}
                {currentGuide.content.pcmPaths && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-border-color space-y-2">
                    <h3 className="font-serif text-xs sm:text-sm font-bold text-text-primary">
                      Key PCM (Engineering & Tech) Pathways:
                    </h3>
                    <ul className="list-disc pl-5 space-y-1 text-xs">
                      {currentGuide.content.pcmPaths.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentGuide.content.pcbPaths && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-border-color space-y-2">
                    <h3 className="font-serif text-xs sm:text-sm font-bold text-text-primary">
                      Key PCB (Medical & Clinical) Pathways:
                    </h3>
                    <ul className="list-disc pl-5 space-y-1 text-xs">
                      {currentGuide.content.pcbPaths.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Commerce Guide Sections */}
                {currentGuide.content.withMathPaths && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-border-color space-y-2">
                    <h3 className="font-serif text-xs sm:text-sm font-bold text-text-primary">
                      With Mathematics Pathways:
                    </h3>
                    <ul className="list-disc pl-5 space-y-1 text-xs">
                      {currentGuide.content.withMathPaths.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentGuide.content.withoutMathPaths && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-border-color space-y-2">
                    <h3 className="font-serif text-xs sm:text-sm font-bold text-text-primary">
                      Without Mathematics Pathways:
                    </h3>
                    <ul className="list-disc pl-5 space-y-1 text-xs">
                      {currentGuide.content.withoutMathPaths.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Humanities Guide Sections */}
                {currentGuide.content.keyFields && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-border-color space-y-2">
                    <h3 className="font-serif text-xs sm:text-sm font-bold text-text-primary">
                      Key Humanities Disciplines & Professional Gateways:
                    </h3>
                    <ul className="list-disc pl-5 space-y-1 text-xs">
                      {currentGuide.content.keyFields.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Branch Selection Sections */}
                {currentGuide.content.branchBreakdown && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-border-color space-y-2">
                    <h3 className="font-serif text-xs sm:text-sm font-bold text-text-primary">
                      Engineering Branches Core Breakdown:
                    </h3>
                    <ul className="list-disc pl-5 space-y-1 text-xs">
                      {currentGuide.content.branchBreakdown.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentGuide.content.decisionRules && (
                  <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100 space-y-2">
                    <h3 className="font-serif text-xs sm:text-sm font-bold text-brand-primary">
                      Key Decision Rules for Branch vs College:
                    </h3>
                    <ul className="list-disc pl-5 space-y-1 text-xs text-text-secondary">
                      {currentGuide.content.decisionRules.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* MBA vs PGDM & BCA vs B.Tech Comparisons */}
                {currentGuide.content.differences && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-border-color space-y-2">
                    <h3 className="font-serif text-xs sm:text-sm font-bold text-text-primary">
                      Key Differences:
                    </h3>
                    <ul className="list-disc pl-5 space-y-1 text-xs">
                      {currentGuide.content.differences.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentGuide.content.comparisons && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-border-color space-y-2">
                    <h3 className="font-serif text-xs sm:text-sm font-bold text-text-primary">
                      Curriculum & Placement Comparison:
                    </h3>
                    <ul className="list-disc pl-5 space-y-1 text-xs">
                      {currentGuide.content.comparisons.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actionable Recommendation Box */}
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/60 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                    VidyaScope Recommendation
                  </span>
                  <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                    {currentGuide.content.recommendation}
                  </p>
                </div>
              </div>

              {/* Modal Footer CTAs */}
              <div className="pt-4 border-t border-border-color flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedGuideId(null)}
                  className="btn btn-secondary btn-sm"
                >
                  Close Guide
                </button>

                <button
                  onClick={() => {
                    setSelectedGuideId(null)
                    onOpenCounseling && onOpenCounseling()
                  }}
                  className="btn btn-primary btn-sm"
                >
                  <span>Discuss with an Advisor</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}

export default CareerGuidePage
