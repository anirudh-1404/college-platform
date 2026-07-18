import React from 'react'
import { MessageSquare } from 'lucide-react'

const CounselingBanner = () => {
  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden bg-gradient-to-r from-brand-primary via-[#8B5CF6] to-[#9333EA] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-premium flex flex-col lg:flex-row items-center justify-between gap-6">
        
        {/* Left Column: Avatars & Copy */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
          
          {/* Overlapping Counselor Avatars Stack */}
          <div className="flex -space-x-3 overflow-hidden flex-shrink-0">
            <img
              className="inline-block h-12 w-12 rounded-full ring-4 ring-white/20 object-cover"
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80"
              alt="Counselor 1"
            />
            <img
              className="inline-block h-12 w-12 rounded-full ring-4 ring-white/20 object-cover"
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&h=120&q=80"
              alt="Counselor 2"
            />
            <img
              className="inline-block h-12 w-12 rounded-full ring-4 ring-white/20 object-cover"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80"
              alt="Counselor 3"
            />
          </div>

          {/* Banner Copy */}
          <div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-text-on-dark leading-tight">
              Talk to our expert counselors – For Free!
            </h3>
            <p className="text-sm text-text-on-dark-muted font-medium mt-1">
              Join 50,000+ students who got personalized guidance.
            </p>
          </div>
        </div>

        {/* Right Column: CTA Action */}
        <div className="flex-shrink-0 w-full sm:w-auto">
          <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-brand-primary font-bold text-sm sm:text-base transition-all duration-300 shadow-premium hover:shadow-card hover:-translate-y-[2px] active:translate-y-0 flex items-center justify-center gap-2.5 cursor-pointer">
            <MessageSquare className="h-5 w-5 fill-brand-primary/10" />
            <span>Get Free Counseling</span>
          </button>
        </div>

        {/* Abstract Background Design Elements */}
        <div className="absolute right-[-4%] top-[-20%] w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute left-[10%] bottom-[-50%] w-60 h-60 rounded-full bg-black/10 blur-3xl pointer-events-none" />

      </div>
    </section>
  )
}

export default CounselingBanner
