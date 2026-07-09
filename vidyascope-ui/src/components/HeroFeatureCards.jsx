import React from 'react'
import { Award, Sparkles, TrendingUp, DollarSign } from 'lucide-react'

export const PlacementCard = () => {
  return (
    <div className="absolute top-[8%] left-[-5%] md:left-[-12%] bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-border-color shadow-premium hover:shadow-card hover:border-brand-primary/20 hover:scale-105 transition-all duration-300 animate-float-slow z-20 max-w-[190px] md:max-w-[210px]">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-green-50 text-green-600">
          <TrendingUp className="h-5.5 w-5.5 animate-pulse" />
        </div>
        <div>
          <p className="text-[10px] md:text-xs font-bold text-text-light uppercase tracking-wider">
            Top Placements
          </p>
          <p className="text-lg md:text-xl font-extrabold text-text-primary">
            45 LPA
          </p>
        </div>
      </div>
      <p className="text-[10px] md:text-xs font-semibold text-text-secondary mt-2 flex items-center gap-1">
        <span>Highest package secured</span>
        <span className="text-green-500 font-bold">↑ 18%</span>
      </p>
    </div>
  )
}

export const FitScoreCard = () => {
  return (
    <div className="absolute top-[42%] right-[-5%] md:right-[-10%] bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-border-color shadow-premium hover:shadow-card hover:border-brand-primary/20 hover:scale-105 transition-all duration-300 animate-float-mid z-20 max-w-[190px] md:max-w-[210px]">
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-accent text-brand-primary flex-shrink-0">
          <Sparkles className="h-5.5 w-5.5" />
        </div>
        <div>
          <p className="text-[10px] md:text-xs font-bold text-text-light uppercase tracking-wider">
            AI Match Rating
          </p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-lg md:text-xl font-extrabold text-text-primary">98%</span>
            <span className="text-[10px] md:text-xs font-semibold text-text-secondary">Fit Score</span>
          </div>
          
          {/* Visual Mini Progress Bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-brand-primary h-full rounded-full w-[98%] animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

export const ScholarshipCard = () => {
  return (
    <div className="absolute bottom-[10%] left-[-4%] md:left-[-10%] bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-border-color shadow-premium hover:shadow-card hover:border-brand-primary/20 hover:scale-105 transition-all duration-300 animate-float-fast z-20 max-w-[200px] md:max-w-[220px]">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 text-amber-600">
          <Award className="h-5.5 w-5.5" />
        </div>
        <div>
          <p className="text-[10px] md:text-xs font-bold text-text-light uppercase tracking-wider">
            Scholarships
          </p>
          <p className="text-lg md:text-xl font-extrabold text-text-primary">
            ₹25 Cr+
          </p>
        </div>
      </div>
      
      {/* Avatars Stack */}
      <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-100">
        <div className="flex -space-x-2.5 overflow-hidden">
          <img
            className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80"
            alt="Student 1"
          />
          <img
            className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80"
            alt="Student 2"
          />
          <img
            className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80"
            alt="Student 3"
          />
        </div>
        <span className="text-[10px] md:text-xs font-semibold text-text-secondary">
          1.2k+ students awarded
        </span>
      </div>
    </div>
  )
}
