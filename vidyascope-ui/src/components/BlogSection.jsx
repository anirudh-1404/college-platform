import React from 'react'
import { BookOpen, Clock, ArrowRight } from 'lucide-react'
import { blogsData } from '../data/blogsData'

const BlogSection = ({ onNavigate }) => {
  return (
    <section className="py-20 bg-white border-t border-border-color">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent text-brand-primary text-xs font-bold uppercase tracking-wider mb-3">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Admissions Guide & Insights</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-text-primary">
              Latest Counseling Articles & Guides
            </h2>
            <p className="text-text-secondary text-sm sm:text-base mt-2 max-w-2xl">
              Stay ahead with expert advice on cutoff trends, choice filling strategies, and college ROI analysis.
            </p>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('course-guide')}
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-primary hover:text-brand-primary-hover transition-colors group cursor-pointer self-start md:self-auto"
          >
            <span>Read All Articles</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogsData.map((post) => (
            <article
              key={post.id}
              className="bg-white border border-border-color hover:border-brand-primary/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-card transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative overflow-hidden aspect-[16/9]">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-brand-primary text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm">
                    {post.category}
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-text-light mb-2 font-medium">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-text-primary group-hover:text-brand-primary transition-colors leading-snug mb-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                    {post.summary}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-0">
                <button
                  onClick={() => onNavigate && onNavigate('course-guide')}
                  className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Read Full Article</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  )
}

export default BlogSection
