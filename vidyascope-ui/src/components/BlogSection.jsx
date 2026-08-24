import React from 'react'
import { BookOpen, Clock, ArrowRight } from 'lucide-react'
import { blogsData } from '../data/blogsData'

const BlogSection = ({ onNavigate }) => {
  return (
    <section className="py-14 bg-slate-50/40 border-b border-border-color">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
              Admissions Insights
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary mt-1">
              Latest Guidance & Strategy Articles
            </h2>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('career-guide')}
            className="text-xs sm:text-sm font-bold text-brand-primary hover:text-brand-primary-hover flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>View all career guides</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogsData.map((post) => (
            <article
              key={post.id}
              onClick={() => onNavigate && onNavigate('career-guide')}
              className="bg-white border border-border-color rounded-xl overflow-hidden hover:border-brand-primary/30 card-hover-lift cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="relative overflow-hidden aspect-[16/9] bg-slate-100">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs text-brand-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    {post.category}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 text-[11px] text-text-light mb-2">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="font-serif text-base font-bold text-text-primary group-hover:text-brand-primary transition-colors leading-snug mb-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                    {post.summary}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <span className="text-xs font-bold text-brand-primary flex items-center gap-1">
                  <span>Read Guide</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  )
}

export default BlogSection
