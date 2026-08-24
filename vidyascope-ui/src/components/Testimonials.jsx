import React from 'react'
import { Star, Quote, Award } from 'lucide-react'
import { testimonialsData, counselorStats } from '../data/testimonialsData'

const Testimonials = () => {
  return (
    <section className="py-14 bg-white border-b border-border-color">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
            Student & Parent Experiences
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary mt-1">
            Trusted by Thousands of Aspirants
          </h2>
          <p className="text-text-secondary text-xs sm:text-sm mt-2">
            Real feedback from students and parents who used VidyaScope insights for admissions decisions.
          </p>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {counselorStats.map((stat) => (
            <div
              key={stat.label}
              className="bg-slate-50 border border-border-color p-4 sm:p-5 rounded-xl text-center"
            >
              <p className="font-serif text-2xl sm:text-3xl font-bold text-brand-primary">
                {stat.value}
              </p>
              <p className="text-xs font-semibold text-text-secondary mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonialsData.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-border-color p-6 rounded-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-5 italic">
                  "{item.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-border-color">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover border border-border-color"
                />
                <div>
                  <h4 className="font-serif text-sm font-bold text-text-primary">
                    {item.name}
                  </h4>
                  <p className="text-[11px] font-semibold text-brand-primary">
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
