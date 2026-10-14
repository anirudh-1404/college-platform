import React, { useState, useEffect } from 'react'
import { Clock, ArrowRight, BookOpen, Eye } from 'lucide-react'
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
        const data = await publicApi.getBlogs({ limit: 3 })
        if (isMounted) {
          setArticles(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        console.error('Failed to load blogs from backend:', err)
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
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-[11px] font-bold tracking-wide uppercase mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Campus & Admission News</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary">
              Latest Educational & Career Blogs
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-xl">
              Unfiltered cutoff breakdowns, campus reality checks, placement trends, and preparation strategies written by academic mentors.
            </p>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('blogs')}
            className="text-xs sm:text-sm font-bold text-brand-primary hover:text-brand-primary-hover flex items-center gap-1.5 cursor-pointer self-start sm:self-auto transition-colors group"
          >
            <span>View all articles</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Dynamic Blog Cards (Limit: 3) */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden p-0 animate-pulse"
              >
                <div className="aspect-[16/10] bg-slate-200" />
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
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {articles.slice(0, 3).map((post) => (
              <motion.article
                key={post.id || post._id || post.slug}
                variants={cardVariant}
                whileHover={{ y: -6, transition: { duration: 0.22 } }}
                onClick={() => onNavigate && onNavigate('blog-detail', post.slug || post.id)}
                className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:border-brand-primary/40 hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="relative overflow-hidden aspect-[16/10] bg-slate-100">
                    <img
                      src={post.coverImage || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'}
                      alt={post.title}
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-brand-primary text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-xs">
                      {post.badge || post.category}
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 text-[11px] text-text-light mb-2.5">
                      <span>{post.date || 'Recent'}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime || '5 min read'}
                      </span>
                      {post.views > 0 && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {post.views} views
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="font-serif text-base sm:text-lg font-bold text-text-primary group-hover:text-brand-primary transition-colors leading-snug mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed line-clamp-2 mb-4">
                      {post.excerpt || post.summary}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={post.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                      alt={post.author?.name || 'Author'}
                      className="w-6 h-6 rounded-full object-cover border border-slate-200"
                    />
                    <span className="text-xs font-semibold text-slate-700 truncate max-w-[120px]">
                      {post.author?.name || 'VidyaScope Team'}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-brand-primary flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Read Article</span>
                    <ArrowRight className="h-3.5 w-3.5" />
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

