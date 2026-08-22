import React from 'react'
import { Star, Quote, Award } from 'lucide-react'
import { testimonialsData, counselorStats } from '../data/testimonialsData'

const Testimonials = () => {
  return (
    <section className="py-20 bg-slate-50 border-t border-border-color">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent text-brand-primary text-xs font-bold uppercase tracking-wider mb-3">
            <Award className="h-3.5 w-3.5" />
            <span>Success Stories</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-text-primary">
            Loved by 50,000+ Students & Parents Across India
          </h2>
          <p className="text-text-secondary text-sm sm:text-base mt-2">
            Hear from rank holders, parents, and alumni who made confident career choices using VidyaScope data.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16">
          {counselorStats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white border border-border-color p-6 rounded-2xl text-center shadow-sm"
            >
              <p className="font-serif text-2xl sm:text-3xl font-extrabold text-brand-primary">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-text-secondary mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Testimonials Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonialsData.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-border-color hover:border-brand-primary/30 p-8 rounded-2xl shadow-sm hover:shadow-card transition-all duration-300 flex flex-col justify-between relative"
            >
              <Quote className="h-8 w-8 text-brand-accent absolute top-6 right-6 -z-0" />
              
              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed italic mb-6 relative z-10">
                  "{item.quote}"
                </p>
              </div>

              {/* User Bio */}
              <div className="flex items-center gap-3 pt-4 border-t border-border-color">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-brand-accent"
                />
                <div>
                  <h4 className="font-serif text-sm font-bold text-text-primary">
                    {item.name}
                  </h4>
                  <p className="text-xs font-semibold text-brand-primary">
                    {item.score}
                  </p>
                  <p className="text-[11px] text-text-light">
                    {item.college}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Testimonials
