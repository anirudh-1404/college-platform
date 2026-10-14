import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  ChevronRight,
  Home,
  BookOpen,
  Search,
  Clock,
  ArrowRight,
  Eye,
  Sparkles,
  MessageSquare,
  Filter,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { publicApi } from '../api/publicApi'

const CATEGORIES = [
  'All Articles',
  'Admissions & Cutoffs',
  'Exam Preparation',
  'Placement Insights',
  'Campus & Hostel Life',
  'College Comparisons',
]

const BlogListingPage = ({ onNavigateHome, onNavigateDetail, onOpenCounseling }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All Articles')

  useEffect(() => {
    const cat = searchParams.get('category')
    const q = searchParams.get('search')
    if (cat) {
      setSelectedCategory(cat)
    } else {
      setSelectedCategory('All Articles')
    }
    if (q !== null && q !== undefined) {
      setSearchQuery(q)
    }
  }, [searchParams])

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat)
    const nextParams = new URLSearchParams(searchParams)
    if (cat === 'All Articles') {
      nextParams.delete('category')
    } else {
      nextParams.set('category', cat)
    }
    setSearchParams(nextParams, { replace: true })
  }

  const handleSearchChange = (val) => {
    setSearchQuery(val)
    const nextParams = new URLSearchParams(searchParams)
    if (val.trim()) {
      nextParams.set('search', val)
    } else {
      nextParams.delete('search')
    }
    setSearchParams(nextParams, { replace: true })
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete('search')
    setSearchParams(nextParams, { replace: true })
  }

  useEffect(() => {
    let isMounted = true
    const fetchBlogs = async () => {
      setLoading(true)
      try {
        const data = await publicApi.getBlogs()
        if (isMounted) {
          setBlogs(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        console.error('Failed to fetch blogs:', err)
        if (isMounted) setBlogs([])
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchBlogs()
    return () => {
      isMounted = false
    }
  }, [])

  // Filter blogs based on search query and category
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesCategory =
        selectedCategory === 'All Articles' ||
        blog.category?.toLowerCase() === selectedCategory.toLowerCase()

      const q = searchQuery.toLowerCase().trim()
      const matchesQuery =
        !q ||
        blog.title?.toLowerCase().includes(q) ||
        blog.excerpt?.toLowerCase().includes(q) ||
        blog.category?.toLowerCase().includes(q) ||
        (Array.isArray(blog.tags) && blog.tags.some((t) => t.toLowerCase().includes(q)))

      return matchesCategory && matchesQuery
    })
  }, [blogs, selectedCategory, searchQuery])

  // Featured article is the first article when looking at all blogs with no search
  const featuredArticle = useMemo(() => {
    if (selectedCategory === 'All Articles' && !searchQuery.trim() && blogs.length > 0) {
      return blogs[0]
    }
    return null
  }, [blogs, selectedCategory, searchQuery])

  const gridArticles = useMemo(() => {
    if (featuredArticle) {
      return filteredBlogs.filter((b) => (b.slug || b.id) !== (featuredArticle.slug || featuredArticle.id))
    }
    return filteredBlogs
  }, [filteredBlogs, featuredArticle])

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Top Breadcrumb Bar */}
      <div className="bg-white border-b border-border-color">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-1.5 hover:text-brand-primary transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-slate-900 font-semibold">Blogs & Articles</span>
          </nav>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-b from-white via-white to-slate-50 border-b border-slate-200/80 pt-10 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold uppercase tracking-wider mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              <span>VidyaScope Editorial & Mentorship</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Student Blogs, Cutoff Analyses & Campus Life
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              Unfiltered guidance on college counseling rounds, realistic placement stats, exam preparation tricks, and campus insider secrets written by experienced educators.
            </p>
          </div>

          {/* Search Bar & Filter Controls */}
          <div className="mt-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search topics, exams, cutoffs, hostels, or branches..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary shadow-xs transition-all"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-1.5 py-0.5 rounded cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 self-end md:self-center">
              <span>Showing {filteredBlogs.length} articles</span>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => handleSelectCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-brand-primary text-white shadow-sm shadow-brand-primary/20'
                      : 'bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {loading ? (
          <div className="space-y-6">
            <div className="w-full h-80 bg-white rounded-2xl border border-slate-200 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-72 bg-white rounded-2xl border border-slate-200 animate-pulse" />
              ))}
            </div>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto my-12">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-serif text-lg font-bold text-slate-800">No articles found</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              We couldn&apos;t find any articles matching your search or filter. Try using different keywords or clear the category.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('All Articles')
              }}
              className="mt-5 px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-primary-hover transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Featured Article Card */}
            {featuredArticle && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => onNavigateDetail(featuredArticle.slug || featuredArticle.id)}
                className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:shadow-card-hover hover:border-brand-primary/40 transition-all cursor-pointer grid grid-cols-1 lg:grid-cols-12 group"
              >
                <div className="lg:col-span-7 relative overflow-hidden aspect-[16/10] lg:aspect-auto min-h-[260px] sm:min-h-[320px]">
                  <img
                    src={featuredArticle.coverImage || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80'}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Featured Story
                    </span>
                    <span className="bg-white/90 backdrop-blur-xs text-brand-primary text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-xs">
                      {featuredArticle.badge || featuredArticle.category}
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                      <span>{featuredArticle.date || 'Recent'}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {featuredArticle.readTime || '5 min read'}
                      </span>
                      {featuredArticle.views > 0 && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            {featuredArticle.views} views
                          </span>
                        </>
                      )}
                    </div>

                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-brand-primary transition-colors leading-snug mb-3">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 mb-6">
                      {featuredArticle.excerpt}
                    </p>

                    {/* Tags */}
                    {Array.isArray(featuredArticle.tags) && featuredArticle.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {featuredArticle.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={featuredArticle.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                        alt={featuredArticle.author?.name || 'Author'}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-800">
                          {featuredArticle.author?.name || 'VidyaScope Team'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {featuredArticle.author?.role || 'Academic Mentor'}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-brand-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Read Story</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridArticles.map((article, idx) => (
                <motion.article
                  key={article.slug || article.id || article._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.05 }}
                  onClick={() => onNavigateDetail(article.slug || article.id)}
                  className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:shadow-card-hover hover:border-brand-primary/40 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative overflow-hidden aspect-[16/10] bg-slate-100">
                      <img
                        src={article.coverImage || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'}
                        alt={article.title}
                        onError={(e) => {
                          e.currentTarget.onerror = null
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-brand-primary text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-xs">
                        {article.badge || article.category}
                      </span>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2.5">
                        <span>{article.date || 'Recent'}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.readTime || '5 min read'}
                        </span>
                        {article.views > 0 && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {article.views} views
                            </span>
                          </>
                        )}
                      </div>

                      <h3 className="font-serif text-base sm:text-lg font-bold text-slate-900 group-hover:text-brand-primary transition-colors leading-snug mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-4">
                        {article.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={article.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                        alt={article.author?.name || 'Author'}
                        className="w-6 h-6 rounded-full object-cover border border-slate-200"
                      />
                      <span className="text-xs font-semibold text-slate-700 truncate max-w-[120px]">
                        {article.author?.name || 'VidyaScope Team'}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-brand-primary flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>Read Article</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default BlogListingPage
