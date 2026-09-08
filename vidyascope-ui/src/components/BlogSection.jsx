import React, { useState, useEffect } from 'react'
import { Clock, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { publicApi } from '../api/publicApi'
import { fadeInUp, cardVariant, staggerContainer } from '../utils/animations'

const BlogSection = ({ onNavigate }) => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const fetchArticles = async () => {
      try {
        const data = await publicApi.getCareerGuides()
        if (isMounted) {
          setArticles(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        console.error('Failed to load career guides from backend:', err)
        if (isMounted) setArticles([])
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchArticles()
    return () => {
      isMounted = false
    }
  }, [])

  if (!loading && articles.length === 0) {
    return null
  }

  return (
    <section className="py-14 sm:py-18 bg-slate-50/50 border-b border-border-color overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeInUp}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-3"
        >
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary">
              Latest Career Guidance & Roadmaps
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-xl">
              In-depth educational roadmaps, eligibility criteria, starting salary benchmarks, and admission pathways.
            </p>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('career-guide')}
            className="text-xs sm:text-sm font-bold text-brand-primary hover:text-brand-primary-hover flex items-center gap-1 cursor-pointer self-start sm:self-auto transition-colors group"
          >
            <span>View all career guides</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Dynamic Career Guidance Cards (Limit: 3) */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden p-0 animate-pulse"
              >
                <div className="aspect-[16/9] bg-slate-200" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-slate-200 rounded w-1/3" />
                  <div className="h-5 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-full" />
                  <div className="h-3 bg-slate-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {articles.slice(0, 3).map((post) => (
              <motion.article
                key={post.id || post._id || post.slug}
                variants={cardVariant}
                whileHover={{ y: -6, transition: { duration: 0.22 } }}
                onClick={() => onNavigate && onNavigate('career-guide', post.slug || post.id)}
                className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:border-brand-primary/40 hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="relative overflow-hidden aspect-[16/9] bg-slate-100">
                    <img
                      src={post.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80'}
                      alt={post.title}
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80'
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-brand-primary text-[10px] font-bold px-2 py-0.5 rounded-md uppercase shadow-2xs">
                      {post.badge || post.category}
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 text-[11px] text-text-light mb-2">
                      <span>{post.date || 'Sep 2026'}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime || '5 min read'}
                      </span>
                    </div>

                    <h3 className="font-serif text-base font-bold text-text-primary group-hover:text-brand-primary transition-colors leading-snug mb-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed line-clamp-2 mb-3">
                      {post.shortDescription || post.summary}
                    </p>

                    {/* Career Highlights Pill Box */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                          Avg. Package
                        </span>
                        <span className="font-bold text-emerald-600 text-xs mt-0.5 block truncate">
                          {post.averageSalary || '₹12 - 25 LPA'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                          Milestones
                        </span>
                        <span className="font-bold text-slate-800 text-xs mt-0.5 block">
                          {post.roadmapSteps?.length || 3} Stages
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <span className="text-xs font-bold text-brand-primary flex items-center gap-1">
                    <span>Explore Roadmap</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}

      </div>
    </section>
  )
}

export default BlogSection
