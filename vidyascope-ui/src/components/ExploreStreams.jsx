import React, { useState, useEffect, useMemo } from 'react'
import {
  Cpu,
  Briefcase,
  Stethoscope,
  Scale,
  Atom,
  Palette,
  ArrowRight,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { publicApi } from '../api/publicApi'
import { fadeInUp, staggerContainer, cardVariant } from '../utils/animations'

// Master metadata catalogue for streams with premium icons & branding
const STREAM_METADATA = {
  engineering: {
    id: 'engineering',
    title: 'Engineering & Technology',
    shortTitle: 'Engineering',
    icon: Cpu,
    borderHover: 'hover:border-[#033C8D]',
    bgIcon: 'bg-blue-50 text-[#033C8D] border border-blue-100',
    tagline: 'Premier IITs, NITs & Top Technical Institutes',
  },
  management: {
    id: 'management',
    title: 'Management & Business',
    shortTitle: 'Management',
    icon: Briefcase,
    borderHover: 'hover:border-amber-500',
    bgIcon: 'bg-amber-50 text-amber-700 border border-amber-100',
    tagline: 'Top IIMs & Premier Business Schools',
  },
  medical: {
    id: 'medical',
    title: 'Medical & Healthcare',
    shortTitle: 'Medical',
    icon: Stethoscope,
    borderHover: 'hover:border-emerald-500',
    bgIcon: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    tagline: 'AIIMS, Government & Top Medical Colleges',
  },
  law: {
    id: 'law',
    title: 'Law & Legal Studies',
    shortTitle: 'Law',
    icon: Scale,
    borderHover: 'hover:border-purple-500',
    bgIcon: 'bg-purple-50 text-purple-700 border border-purple-100',
    tagline: 'National Law Universities (NLUs) & Colleges',
  },
  science: {
    id: 'science',
    title: 'Pure Sciences & Research',
    shortTitle: 'Science',
    icon: Atom,
    borderHover: 'hover:border-cyan-500',
    bgIcon: 'bg-cyan-50 text-cyan-700 border border-cyan-100',
    tagline: 'IISc, IISERs & Premier Research Campuses',
  },
  arts: {
    id: 'arts',
    title: 'Humanities, Arts & Media',
    shortTitle: 'Arts',
    icon: Palette,
    borderHover: 'hover:border-rose-500',
    bgIcon: 'bg-rose-50 text-rose-700 border border-rose-100',
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
        streamMap[rawStream] = { count: 0 }
      }
      streamMap[rawStream].count += 1
    })

    // Filter master metadata: only streams that have live colleges in backend
    return Object.keys(STREAM_METADATA)
      .filter((streamId) => Boolean(streamMap[streamId] && streamMap[streamId].count > 0))
      .map((streamId) => STREAM_METADATA[streamId])
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
      <section className="py-12 bg-slate-50/60 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-5 w-28 bg-slate-200 rounded-full mx-auto mb-2.5 animate-pulse" />
          <div className="h-8 w-56 bg-slate-200 rounded-xl mx-auto mb-8 animate-pulse" />
          <div className="h-20 max-w-2xl mx-auto rounded-2xl bg-white border border-slate-200 animate-pulse" />
        </div>
      </section>
    )
  }

  // If no colleges are published yet, don't show an empty section
  if (activeStreams.length === 0) {
    return null
  }

  return (
    <section className="py-12 sm:py-16 bg-slate-50/60 border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeInUp}
          className="text-center space-y-1.5 mb-8 sm:mb-10"
        >
          <span className="text-brand-primary text-xs font-bold tracking-wider uppercase inline-flex items-center gap-1">
            <span>&gt;&gt;</span>
            <span>Academic Disciplines</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">
            Explore by Field of Study
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Discover verified institutions and transparent benchmarks for your chosen career field.
          </p>
        </motion.div>

        {/* Compact, Sleek Streams Grid (No clutter, No campus count) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={staggerContainer}
          className={`grid gap-4 sm:gap-5 ${
            activeStreams.length === 1
              ? 'max-w-2xl mx-auto grid-cols-1'
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
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleClick(stream.id)}
                className={`bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer group ${stream.borderHover}`}
              >
                <div className="flex items-center gap-4">
                  {/* Clean Branded Icon */}
                  <div className={`w-13 h-13 rounded-2xl ${stream.bgIcon} flex items-center justify-center transition-transform group-hover:scale-105 shadow-2xs flex-shrink-0`}>
                    <IconComponent className="h-6 w-6" />
                  </div>

                  {/* Stream Title & Subtitle */}
                  <div className="space-y-0.5">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-brand-primary transition-colors">
                      {stream.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {stream.tagline}
                    </p>
                  </div>
                </div>

                {/* Clean Action Button */}
                <div className="flex items-center gap-2 text-xs font-bold text-brand-primary group-hover:text-brand-primary-hover flex-shrink-0 self-end sm:self-center">
                  <span>Explore</span>
                  <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-brand-primary group-hover:text-white flex items-center justify-center transition-all shadow-2xs">
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
