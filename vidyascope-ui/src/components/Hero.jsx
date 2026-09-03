import React, { useState } from 'react'
import { Search, ArrowRight, GraduationCap, Star, CheckCircle, ChevronDown } from 'lucide-react'
import studentImg from '../assets/student-hero.jpg'

const Hero = ({ onNavigateListing, onNavigateCompare, onSelectCollege }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStream, setSelectedStream] = useState('all')

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (onNavigateListing) {
      onNavigateListing({
        query: searchQuery.trim(),
        stream: selectedStream === 'all' ? undefined : selectedStream,
      })
    }
  }

  const handleQuickSearch = (name) => {
    if (onNavigateListing) {
      onNavigateListing({ query: name })
    }
  }

  return (
    <section className="relative bg-white pt-8 pb-16 lg:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column (Span 7): Title, Subtitle, Search Console */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-[#111827] leading-[1.12] tracking-tight">
                Find colleges, <br />
                <span className="text-[#3B82F6]">courses, & exams</span>
              </h1>
              
              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Exploring Higher Education: Discovering Colleges, Courses, and Exams to Shape Your Future.
              </p>
            </div>

            {/* Dribbble Style Search Console Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white rounded-full p-2 border border-slate-200 shadow-md flex items-center gap-2 max-w-xl"
            >
              {/* Category Dropdown */}
              <div className="relative pl-3 flex items-center flex-shrink-0">
                <select
                  value={selectedStream}
                  onChange={(e) => setSelectedStream(e.target.value)}
                  className="appearance-none bg-transparent pr-6 text-xs sm:text-sm font-bold text-slate-800 outline-none cursor-pointer"
                >
                  <option value="all">All Streams</option>
                  <option value="engineering">Engineering</option>
                  <option value="management">Management</option>
                  <option value="medical">Medical</option>
                  <option value="law">Law</option>
                </select>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-1 pointer-events-none" />
              </div>

              <div className="h-5 w-[1px] bg-slate-200 flex-shrink-0" />

              {/* Search Text Input */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search from 1200+ Colleges, Courses, Exams"
                className="flex-1 min-w-0 bg-transparent px-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none"
              />

              {/* Round Blue Search Action Button */}
              <button
                type="submit"
                className="w-10 h-10 rounded-full bg-[#3B82F6] hover:bg-[#2563EB] text-white flex items-center justify-center flex-shrink-0 transition-colors shadow-sm cursor-pointer"
                title="Search Colleges"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>

            {/* Popular Searches */}
            <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500 pt-1">
              <span className="font-semibold text-slate-400">Popular:</span>
              {['IIT Bombay', 'IIM Ahmedabad', 'BITS Pilani', 'AIIMS Delhi', 'NLSIU'].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleQuickSearch(item)}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Quick Metrics */}
            <div className="pt-4 border-t border-slate-100 flex items-center gap-8 text-left">
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-slate-900">1,280+</p>
                <p className="text-xs text-slate-500 font-medium">Verified Campuses</p>
              </div>
              <div className="border-l border-slate-200 pl-6">
                <p className="text-xl sm:text-2xl font-extrabold text-[#3B82F6]">450+</p>
                <p className="text-xs text-slate-500 font-medium">Entrance Exams</p>
              </div>
              <div className="border-l border-slate-200 pl-6">
                <p className="text-xl sm:text-2xl font-extrabold text-emerald-600">100%</p>
                <p className="text-xs text-slate-500 font-medium">Audited Cutoffs</p>
              </div>
            </div>

          </div>

          {/* Right Column (Span 5): Student Cutout with Warm Organic Blob */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-full max-w-[380px] sm:max-w-[420px] aspect-[4/4.5] flex items-center justify-center">
              
              {/* Organic Warm Amber Background Shape */}
              <div
                className="absolute inset-4 sm:inset-2 bg-gradient-to-tr from-[#EAB308] to-[#FBBF24] rounded-[48%_52%_42%_58%_/_55%_45%_55%_45%] transform rotate-3 transition-transform duration-700 hover:rotate-6 opacity-95 shadow-lg"
              />

              {/* Student Portrait Image with rounded frame */}
              <div className="relative z-10 w-[88%] h-[92%] rounded-[40px] overflow-hidden shadow-2xl border-4 border-white bg-white">
                <img
                  src={studentImg}
                  alt="Student exploring higher education on VidyaScope"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Floating Badge 1: Top Right */}
              <div className="absolute top-4 -right-2 z-20 bg-white/95 backdrop-blur-sm px-3.5 py-2 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-[#3B82F6] flex items-center justify-center">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight">1,280+ Colleges</p>
                  <p className="text-[10px] text-slate-500">Government & Top Private</p>
                </div>
              </div>

              {/* Floating Badge 2: Bottom Left */}
              <div className="absolute bottom-4 -left-2 z-20 bg-white/95 backdrop-blur-sm px-3.5 py-2 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center">
                  <Star className="h-4 w-4 fill-amber-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight">4.9 / 5 Rating</p>
                  <p className="text-[10px] text-slate-500">Verified Student Advice</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Hero
