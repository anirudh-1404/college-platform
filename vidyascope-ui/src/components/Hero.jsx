import React from 'react'
import SearchBar from './SearchBar'
import TrendingTags from './TrendingTags'
import { PlacementCard, FitScoreCard, ScholarshipCard } from './HeroFeatureCards'
import heroRightImage from '../assets/hero_section_right_image.jpeg'
import { CheckCircle2 } from 'lucide-react'

const Hero = () => {
  const handleSearch = (searchData) => {
    console.log('Hero Search triggered:', searchData)
  }

  const handleTagClick = (tag) => {
    console.log('Hero Tag Clicked:', tag)
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF5FF] via-white to-white pt-8 pb-24 lg:pt-16 lg:pb-32">

      {/* Background Decorative Blur Gradients */}
      <div className="absolute top-[-10%] left-[-5%] w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-brand-primary/5 blur-3xl -z-10" />
      <div className="absolute bottom-[20%] right-[-10%] w-80 h-80 sm:w-[450px] sm:h-[450px] rounded-full bg-brand-primary/10 blur-[80px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: Heading, Search & Tags */}
          <div className="lg:col-span-6 flex flex-col items-start text-left z-20">
            {/* Banner Pill */}
            {/* <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-accent/60 border border-brand-primary/10 text-xs sm:text-sm font-bold text-brand-primary mb-6 transition-all duration-300 hover:bg-brand-accent hover:border-brand-primary/20 cursor-pointer">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
              </span>
              <span className="font-semibold text-text-secondary tracking-wide">AI-Powered Admissions Compass 2026</span>
            </div> */}

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-primary leading-[1.12] sm:leading-[1.1] lg:leading-[1.08] mb-6">
              Discover the Right{' '}
              <span className="relative inline-block px-1">
                <span className="relative z-10 bg-gradient-to-r from-brand-primary via-[#9333EA] to-brand-primary-hover bg-clip-text text-transparent font-black">
                  College.
                </span>
                <span className="absolute bottom-1 left-0 w-full h-2.5 bg-brand-accent -z-0 rounded-lg transform -skew-x-6" />
              </span>{' '}
              Build Your{' '}
              <span className="relative inline-block px-1">
                <span className="relative z-10 bg-gradient-to-r from-brand-primary via-[#9333EA] to-brand-primary-hover bg-clip-text text-transparent font-black">
                  Better Tomorrow.
                </span>
                <span className="absolute bottom-1 left-0 w-full h-2.5 bg-brand-accent -z-0 rounded-lg transform -skew-x-6" />
              </span>
            </h1>

            {/* Subheading / Description */}
            <p className="text-base sm:text-lg lg:text-xl text-text-secondary font-medium leading-relaxed mb-8 max-w-2xl">
              Explore 25,000+ Colleges, 500+ Exams, and find your dream career path with personalized AI-powered counseling and authentic insights.
            </p>

            {/* Search Bar Wrapper */}
            <div className="w-full mb-5 max-w-3xl">
              <SearchBar onSearch={handleSearch} />
            </div>

            {/* Trending Tags */}
            <div className="w-full mb-8">
              <TrendingTags onTagClick={handleTagClick} />
            </div>

            {/* Quick Core Benefits / Trust Indicators */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-6 border-t border-slate-100 w-full max-w-2xl">
              {[
                '100% Free AI Recommendations',
                'Verified Placements Reports',
                'Direct College Counseling',
              ].map((benefit) => (
                <div key={benefit} className="flex items-center gap-2.5 group/benefit">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-accent text-brand-primary group-hover/benefit:bg-brand-primary group-hover/benefit:text-white transition-all duration-300">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-text-secondary group-hover/benefit:text-text-primary transition-colors duration-200">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Hero Image & Floating Cards */}
          <div className="lg:col-span-5 lg:col-start-8 flex justify-center lg:justify-end relative mt-12 lg:mt-0 z-10">
            <div className="relative w-full max-w-[420px] lg:max-w-[440px]">

              {/* Main Image Container - border, bg, shadow, and overlay removed as requested */}
              <div className="relative rounded-[2.2rem] overflow-hidden group">
                <img
                  src={heroRightImage}
                  alt="Student exploring educational goals on VidyaScope"
                  className="w-full h-auto object-cover aspect-[4/5] object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                />
              </div>

              {/* Floating Overlay Info Cards */}
              <PlacementCard />
              <FitScoreCard />
              <ScholarshipCard />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Hero
