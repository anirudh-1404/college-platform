import React, { useState, useEffect, useMemo } from 'react'
import {
  Cpu,
  Briefcase,
  Stethoscope,
  Scale,
  Atom,
  Palette,
  ArrowRight,
  GraduationCap,
  Building2,
  CheckCircle2,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { publicApi } from '../api/publicApi'
import { fadeInUp, staggerContainer, cardVariant } from '../utils/animations'

// Master metadata catalogue for streams
const STREAM_METADATA = {
  engineering: {
    id: 'engineering',
    title: 'Engineering & Technology',
    shortTitle: 'Engineering',
    defaultDegrees: 'B.Tech, B.E., M.Tech, Dual Degree',
    exams: ['JEE Advanced', 'JEE Main', 'BITSAT'],
    icon: Cpu,
    colorAccent: 'text-[#033C8D]',
    borderHover: 'hover:border-[#033C8D]',
    bgIcon: 'bg-blue-50 text-[#033C8D]',
    badgeBg: 'bg-blue-50 text-[#033C8D] border-blue-200/80',
    tagline: 'Premier IITs, NITs & Top Technical Institutes',
  },
  management: {
    id: 'management',
    title: 'Management & Business',
    shortTitle: 'Management',
    defaultDegrees: 'MBA, PGDM, BBA, Executive',
    exams: ['CAT', 'XAT', 'SNAP', 'GMAT'],
    icon: Briefcase,
    colorAccent: 'text-amber-700',
    borderHover: 'hover:border-amber-500',
    bgIcon: 'bg-amber-50 text-amber-700',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200/80',
    tagline: 'Top IIMs & Premier Business Schools',
  },
  medical: {
    id: 'medical',
    title: 'Medical & Healthcare',
    shortTitle: 'Medical',
    defaultDegrees: 'MBBS, BDS, B.Pharm, MD',
    exams: ['NEET UG', 'INI-CET', 'NEET PG'],
    icon: Stethoscope,
    colorAccent: 'text-emerald-700',
    borderHover: 'hover:border-emerald-500',
    bgIcon: 'bg-emerald-50 text-emerald-700',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    tagline: 'AIIMS, Government & Top Medical Colleges',
  },
  law: {
    id: 'law',
    title: 'Law & Legal Studies',
    shortTitle: 'Law',
    defaultDegrees: 'BA LLB, BBA LLB, LLM',
    exams: ['CLAT', 'AILET', 'LSAT India'],
    icon: Scale,
    colorAccent: 'text-purple-700',
    borderHover: 'hover:border-purple-500',
    bgIcon: 'bg-purple-50 text-purple-700',
    badgeBg: 'bg-purple-50 text-purple-800 border-purple-200/80',
    tagline: 'National Law Universities (NLUs) & Colleges',
  },
  science: {
    id: 'science',
    title: 'Pure Sciences & Research',
    shortTitle: 'Science',
    defaultDegrees: 'B.Sc, M.Sc, BS-MS',
    exams: ['IISER IAT', 'NEST', 'CUET UG'],
    icon: Atom,
    colorAccent: 'text-cyan-700',
    borderHover: 'hover:border-cyan-500',
    bgIcon: 'bg-cyan-50 text-cyan-700',
    badgeBg: 'bg-cyan-50 text-cyan-800 border-cyan-200/80',
    tagline: 'IISc, IISERs & Premier Research Campuses',
  },
  arts: {
    id: 'arts',
    title: 'Humanities, Arts & Media',
    shortTitle: 'Arts',
    defaultDegrees: 'BA, MA, Journalism',
    exams: ['CUET UG', 'IPU CET'],
    icon: Palette,
    colorAccent: 'text-rose-700',
    borderHover: 'hover:border-rose-500',
    bgIcon: 'bg-rose-50 text-rose-700',
    badgeBg: 'bg-rose-50 text-rose-800 border-rose-200/80',
    tagline: 'Central Universities & Premier Arts Colleges',
  },
}

const ExploreStreams = ({ onSelectStream, onNavigateListing }) => {
  const [colleges, setColleges] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch live published colleges from backend
  useEffect(() => {
    let isMounted = true
    const loadPublishedColleges = async () => {
      try {
        const data = await publicApi.getColleges()
        if (isMounted) {
          setColleges(Array.isArray(data) ? data : [])
          setLoading(false)
        }
      } catch (err) {
        console.error('ExploreStreams fetch error:', err)
        if (isMounted) setLoading(false)
      }
    }
    loadPublishedColleges()
    return () => {
      isMounted = false
    }
  }, [])

  // 100% Dynamic detection: Only keep streams that actually have >= 1 published college
  const activeStreams = useMemo(() => {
    if (!colleges || colleges.length === 0) return []

    // Group colleges by stream
    const streamMap = {}
    colleges.forEach((c) => {
      const rawStream = (c.stream || 'engineering').toLowerCase()
      if (!streamMap[rawStream]) {
        streamMap[rawStream] = {
          count: 0,
          colleges: [],
          courseNames: new Set(),
        }
      }
      streamMap[rawStream].count += 1
      streamMap[rawStream].colleges.push(c)

      if (Array.isArray(c.coursesOffered)) {
        c.coursesOffered.forEach((course) => {
          if (course.name) streamMap[rawStream].courseNames.add(course.name)
        })
      }
    })

    // Filter master metadata: only streams that have live colleges in backend!
    return Object.keys(STREAM_METADATA)
      .filter((streamId) => Boolean(streamMap[streamId] && streamMap[streamId].count > 0))
      .map((streamId) => {
        const meta = STREAM_METADATA[streamId]
        const group = streamMap[streamId]

        // Extract real sample institutions
        const sampleColleges = group.colleges
          .slice(0, 2)
          .map((c) => c.shortName || c.name)

        return {
          ...meta,
          count: group.count,
          sampleColleges,
        }
      })
  }, [colleges])

  // Click Handler: route with filter
  const handleClick = (streamId) => {
    if (onSelectStream) {
      onSelectStream(streamId)
    } else if (onNavigateListing) {
      onNavigateListing({ stream: streamId })
    }
  }

  // If loading, render elegant pulse skeleton
  if (loading) {
    return (
      <section className="py-16 bg-slate-50/60 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-6 w-32 bg-slate-200 rounded-full mx-auto mb-3 animate-pulse" />
          <div className="h-9 w-64 bg-slate-200 rounded-xl mx-auto mb-10 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-56 rounded-2xl bg-white border border-slate-200 p-6 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  // If no colleges are published yet, don't show an empty broken section
  if (activeStreams.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-slate-50/60 border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeInUp}
          className="text-center space-y-2 mb-12"
        >
          <span className="text-brand-primary text-xs font-bold tracking-wider uppercase inline-flex items-center gap-1">
            <span>&gt;&gt;</span>
            <span>Academic Disciplines</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#111827]">
            Explore by Field of Study
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Discover verified institutions, audited entrance examination cutoffs, and transparent placement benchmarks for your career stream.
          </p>
        </motion.div>

        {/* Dynamic Streams Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={staggerContainer}
          className={`grid gap-6 ${
            activeStreams.length === 1
              ? 'max-w-xl mx-auto grid-cols-1'
              : activeStreams.length === 2
              ? 'max-w-4xl mx-auto grid-cols-1 md:grid-cols-2'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {activeStreams.map((stream) => {
            const IconComponent = stream.icon

            return (
              <motion.div
                key={stream.id}
                variants={cardVariant}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleClick(stream.id)}
                className={`bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer group ${stream.borderHover}`}
              >
                <div>
                  {/* Card Header: Icon & Verified Institution Count Pill */}
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <div className={`w-13 h-13 rounded-2xl ${stream.bgIcon} flex items-center justify-center transition-transform group-hover:scale-110 shadow-2xs`}>
                      <IconComponent className="h-6 w-6" />
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${stream.badgeBg} flex items-center gap-1.5 shadow-2xs`}>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{stream.count} Verified {stream.count === 1 ? 'Campus' : 'Campuses'}</span>
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-brand-primary transition-colors">
                    {stream.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1 mb-4">
                    {stream.tagline}
                  </p>

                  {/* Degrees & Programs */}
                  <div className="space-y-2 pt-3 border-t border-slate-100">
                    <div className="flex items-start gap-2 text-xs">
                      <span className="text-slate-400 font-semibold flex-shrink-0">Programs:</span>
                      <span className="text-slate-700 font-medium">{stream.defaultDegrees}</span>
                    </div>

                    {/* Entrance Exams */}
                    <div className="flex items-start gap-2 text-xs">
                      <span className="text-slate-400 font-semibold flex-shrink-0">Gateways:</span>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {stream.exams.map((exam) => (
                          <span
                            key={exam}
                            className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold"
                          >
                            {exam}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Sample Verified Colleges */}
                    {stream.sampleColleges.length > 0 && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
                        <Building2 className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">
                          Live: <strong className="text-slate-700">{stream.sampleColleges.join(', ')}</strong>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Link */}
                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-brand-primary group-hover:text-brand-hover">
                  <span>Explore {stream.shortTitle} Colleges</span>
                  <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-brand-primary group-hover:text-white flex items-center justify-center transition-all">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

export default ExploreStreams
