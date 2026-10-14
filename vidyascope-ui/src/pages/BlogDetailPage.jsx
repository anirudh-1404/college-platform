import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  Home,
  Clock,
  ArrowLeft,
  ArrowRight,
  Eye,
  Share2,
  Check,
  BookOpen,
  Calendar,
  GraduationCap,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { publicApi } from '../api/publicApi'

// Helper component to render markdown/formatted blog body into beautiful typography
const FormattedBlogContent = ({ content }) => {
  if (!content) return null

  // Split content into paragraphs/blocks by double newline
  const blocks = content.split(/\n\n+/)

  return (
    <div className="space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
      {blocks.map((block, idx) => {
        const trimmed = block.trim()

        // H2 heading
        if (trimmed.startsWith('## ')) {
          return (
            <h2
              key={idx}
              className="font-serif text-xl sm:text-2xl font-bold text-slate-900 pt-6 pb-2 border-b border-slate-100 flex items-center gap-2"
            >
              <span className="w-1.5 h-6 bg-brand-primary rounded-full inline-block" />
              <span>{trimmed.replace(/^##\s+/, '')}</span>
            </h2>
          )
        }

        // H3 heading
        if (trimmed.startsWith('### ')) {
          return (
            <h3
              key={idx}
              className="font-serif text-lg sm:text-xl font-bold text-slate-900 pt-4 text-slate-800"
            >
              {trimmed.replace(/^###\s+/, '')}
            </h3>
          )
        }

        // Blockquote
        if (trimmed.startsWith('> ')) {
          const quoteText = trimmed.replace(/^>\s*/gm, '')
          return (
            <div
              key={idx}
              className="my-5 p-4 sm:p-5 bg-blue-50/70 border-l-4 border-brand-primary rounded-r-xl text-slate-800 text-sm italic font-medium"
            >
              {quoteText}
            </div>
          )
        }

        // Unordered list
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const items = trimmed.split(/\n[-*]\s+/).filter(Boolean)
          return (
            <ul key={idx} className="space-y-2.5 my-4 pl-1">
              {items.map((item, itemIdx) => {
                const cleaned = item.replace(/^[-*]\s*/, '').trim()
                // Parse bold **text**
                const parts = cleaned.split(/(\*\*.*?\*\*)/g)
                return (
                  <li key={itemIdx} className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 shrink-0" />
                    <span>
                      {parts.map((p, pIdx) => {
                        if (p.startsWith('**') && p.endsWith('**')) {
                          return (
                            <strong key={pIdx} className="font-semibold text-slate-900">
                              {p.slice(2, -2)}
                            </strong>
                          )
                        }
                        return p
                      })}
                    </span>
                  </li>
                )
              })}
            </ul>
          )
        }

        // Standard Paragraph with bold support
        const parts = trimmed.split(/(\*\*.*?\*\*)/g)
        return (
          <p key={idx} className="text-slate-700 leading-relaxed font-normal">
            {parts.map((p, pIdx) => {
              if (p.startsWith('**') && p.endsWith('**')) {
                return (
                  <strong key={pIdx} className="font-semibold text-slate-900">
                    {p.slice(2, -2)}
                  </strong>
                )
              }
              return p
            })}
          </p>
        )
      })}
    </div>
  )
}

const BlogDetailPage = ({ onNavigateHome, onNavigateListing, onOpenCounseling, onSelectCollege }) => {
  const { slug } = useParams()
  const navigate = useNavigate()

  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [relatedBlogs, setRelatedBlogs] = useState([])
  const [copied, setCopied] = useState(false)

  // Scroll to top on slug change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [slug])

  // Fetch current blog
  useEffect(() => {
    let isMounted = true
    const fetchArticle = async () => {
      setLoading(true)
      try {
        const data = await publicApi.getBlogDetail(slug)
        if (isMounted) {
          setBlog(data)
        }
      } catch (err) {
        console.error('Failed to load blog:', err)
        if (isMounted) setBlog(null)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    if (slug) {
      fetchArticle()
    }
    return () => {
      isMounted = false
    }
  }, [slug])

  // Fetch related blogs
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const all = await publicApi.getBlogs({ limit: 4 })
        if (Array.isArray(all)) {
          setRelatedBlogs(all.filter((b) => (b.slug || b.id) !== slug).slice(0, 3))
        }
      } catch (err) {
        console.error('Failed to load related blogs:', err)
      }
    }
    fetchRelated()
  }, [slug])

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }



  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" />
          <div className="h-12 w-3/4 bg-slate-200 rounded animate-pulse" />
          <div className="h-64 bg-slate-200 rounded-2xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-4 bg-slate-200 rounded w-full animate-pulse" />
            <div className="h-4 bg-slate-200 rounded w-5/6 animate-pulse" />
            <div className="h-4 bg-slate-200 rounded w-4/6 animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h2 className="font-serif text-xl font-bold text-slate-800">Blog Article Not Found</h2>
          <p className="text-xs text-slate-500 mt-2">
            The article you are looking for may have been moved or unpublished.
          </p>
          <button
            onClick={() => navigate('/blogs')}
            className="mt-6 px-5 py-2.5 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-primary-hover transition-colors cursor-pointer"
          >
            Back to All Blogs
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Top Breadcrumb Navigation */}
      <div className="bg-white border-b border-border-color sticky top-16 sm:top-20 z-20 backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1 hover:text-brand-primary transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <button
              onClick={() => navigate('/blogs')}
              className="hover:text-brand-primary transition-colors cursor-pointer"
            >
              Blogs
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-slate-900 font-semibold truncate max-w-xs sm:max-w-md">
              {blog.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Back Link */}
        <button
          onClick={() => navigate('/blogs')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:text-brand-primary-hover transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all articles</span>
        </button>

        {/* 2-Column Grid (Article & Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Article Column (Span 8) */}
          <div className="lg:col-span-8 space-y-8">
            
            <article className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-10 shadow-xs">
              {/* Category & Badge */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary font-bold text-xs uppercase tracking-wider rounded-md">
                  {blog.badge || blog.category}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {blog.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight sm:leading-snug mb-5">
                {blog.title}
              </h1>

              {/* Metadata Bar (Author, Date, Read Time, Views, Share) */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-100 text-xs text-slate-500 mb-6">
                <div className="flex items-center gap-3">
                  <img
                    src={blog.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                    alt={blog.author?.name || 'Author'}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <div className="font-bold text-slate-900 text-sm">
                      {blog.author?.name || 'VidyaScope Academic Team'}
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      {blog.author?.role || 'Senior Admission Counselor'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{blog.date || 'Recent'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{blog.readTime || '5 min read'}</span>
                  </div>
                  {blog.views > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span>{blog.views} views</span>
                    </div>
                  )}
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold transition-colors cursor-pointer"
                    title="Share article"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Cover Image */}
              {blog.coverImage && (
                <div className="relative rounded-xl overflow-hidden aspect-[16/9] mb-8 bg-slate-100">
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Excerpt Summary Box */}
              {blog.excerpt && (
                <div className="p-5 bg-slate-50/80 rounded-xl border border-slate-200 mb-8">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Article Summary
                  </span>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed italic">
                    &ldquo;{blog.excerpt}&rdquo;
                  </p>
                </div>
              )}

              {/* Rich Body Content */}
              <div className="prose-content">
                <FormattedBlogContent content={blog.content} />
              </div>

              {/* Tags Section */}
              {Array.isArray(blog.tags) && blog.tags.length > 0 && (
                <div className="mt-10 pt-6 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                    Filed Under
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                        onClick={() => navigate(`/blogs?search=${encodeURIComponent(tag)}`)}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Author Bio Box */}
              <div className="mt-8 p-5 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-200 flex items-center gap-4">
                <img
                  src={blog.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                  alt={blog.author?.name || 'Author'}
                  className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
                />
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    Written by {blog.author?.name || 'VidyaScope Academic Team'}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {blog.author?.role || 'Academic Mentor & Counseling Expert'}
                  </div>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Dedicated to providing student-first, verified insights on college selections, cutoffs, and campus decisions across Indian universities.
                  </p>
                </div>
              </div>

            </article>

            {/* Next / Previous / Bottom Action */}
            <div className="flex items-center justify-between p-4 bg-white border border-slate-200/90 rounded-2xl">
              <button
                onClick={() => navigate('/blogs')}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>All Articles</span>
              </button>
              <button
                onClick={handleShare}
                className="text-xs font-bold text-brand-primary hover:text-brand-primary-hover flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>{copied ? 'Link Copied!' : 'Share with Friends'}</span>
              </button>
            </div>

          </div>

          {/* Right Sticky Sidebar (Span 4) */}
          <aside className="lg:col-span-4 sticky top-28 self-start space-y-6">
            
            {/* Browse by Category */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
              <h3 className="font-serif text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-brand-primary" />
                <span>Browse by Category</span>
              </h3>
              <div className="space-y-1.5">
                {[
                  'Admissions & Cutoffs',
                  'Exam Preparation',
                  'Placement Insights',
                  'Campus & Hostel Life',
                  'College Comparisons',
                ].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => navigate(`/blogs?category=${encodeURIComponent(cat)}`)}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-brand-primary hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>{cat}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                  </button>
                ))}
              </div>
            </div>

          </aside>

        </div>

        {/* Related Articles Carousel / Grid */}
        {relatedBlogs.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-serif text-2xl font-bold text-slate-900">
                  Related Insights & Guides
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Keep reading more articles handpicked by our academic mentors.
                </p>
              </div>
              <button
                onClick={() => navigate('/blogs')}
                className="text-xs font-bold text-brand-primary hover:text-brand-primary-hover flex items-center gap-1 cursor-pointer"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((item) => (
                <div
                  key={item.slug || item.id}
                  onClick={() => navigate(`/blogs/${item.slug || item.id}`)}
                  className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:shadow-card-hover hover:border-brand-primary/40 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-white/95 text-brand-primary text-[10px] font-bold px-2 py-0.5 rounded shadow-xs uppercase">
                        {item.badge || item.category}
                      </span>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                        <span>{item.date || 'Recent'}</span>
                        <span>•</span>
                        <span>{item.readTime || '5 min read'}</span>
                      </div>
                      <h3 className="font-serif text-base font-bold text-slate-900 group-hover:text-brand-primary transition-colors line-clamp-2 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2">
                        {item.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <span className="text-xs font-bold text-brand-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Read Story</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default BlogDetailPage
