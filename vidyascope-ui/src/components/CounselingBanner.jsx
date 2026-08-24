import React from 'react'
import { MessageSquare, ArrowRight } from 'lucide-react'

const CounselingBanner = ({ onOpenCounseling }) => {
  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-brand-primary rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-sm">
        
        {/* Left Column: Avatars & Copy */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
          {/* Overlapping Counselor Avatars Stack */}
          <div className="flex -space-x-3 overflow-hidden flex-shrink-0">
            <img
              className="inline-block h-11 w-11 rounded-full ring-2 ring-white object-cover"
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80"
              alt="Counselor 1"
            />
            <img
              className="inline-block h-11 w-11 rounded-full ring-2 ring-white object-cover"
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&h=120&q=80"
              alt="Counselor 2"
            />
            <img
              className="inline-block h-11 w-11 rounded-full ring-2 ring-white object-cover"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80"
              alt="Counselor 3"
            />
          </div>

          {/* Banner Copy */}
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight">
              Talk to an Expert Admission Counselor — Free
            </h3>
            <p className="text-xs sm:text-sm text-purple-100 font-medium mt-1">
              Join 50,000+ students who received unbiased 1-on-1 college and career advice.
            </p>
          </div>
        </div>

        {/* Right Column: CTA Action with standardized .btn-secondary */}
        <div className="flex-shrink-0 w-full sm:w-auto">
          <button
            onClick={onOpenCounseling}
            className="btn btn-secondary btn-lg w-full sm:w-auto group"
          >
            <MessageSquare className="h-4 w-4 text-brand-primary" />
            <span className="text-brand-primary font-bold">Get Free Counseling</span>
            <ArrowRight className="h-4 w-4 text-brand-primary group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  )
}

export default CounselingBanner
