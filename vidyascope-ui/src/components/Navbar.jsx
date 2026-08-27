import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap,
  BookOpen,
  Compass,
  Award,
  PhoneCall,
  Menu,
  X,
  Search,
  Heart,
  Sparkles,
} from 'lucide-react'
import logoImg from '../assets/logo.png'
import SearchPanel from './SearchPanel'

const Navbar = ({
  onNavigate,
  currentPage,
  onOpenCounseling,
  shortlistedCount = 0,
  onSelectCollege,
  onSelectCourse,
  onSelectExam,
  onSelectCareer,
  onNavigateListing,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const navLinks = [
    { name: 'Colleges', target: 'colleges-listing', icon: GraduationCap },
    { name: 'Courses', target: 'courses', icon: BookOpen },
    { name: 'Exams', target: 'exams', icon: Compass },
    { name: 'Career Guide', target: 'career-guide', icon: Award },
    { name: 'Counseling', target: 'counseling', icon: PhoneCall },
  ]

  const handleMobileNavClick = (target) => {
    setIsMobileMenuOpen(false)
    if (onNavigate) onNavigate(target)
  }

  const handleToggleSearch = () => {
    setIsSearchOpen((prev) => !prev)
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-border-color shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            
            {/* Brand Logo */}
            <div className="flex-shrink-0 flex items-center">
              <button
                onClick={() => onNavigate && onNavigate('home')}
                className="flex items-center gap-2 group focus:outline-none cursor-pointer"
                title="VidyaScope Home"
              >
                <img
                  src={logoImg}
                  alt="VidyaScope Logo"
                  className="h-9 sm:h-10 w-auto object-contain transition-opacity group-hover:opacity-90"
                />
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1.5 bg-slate-50/80 p-1 rounded-xl border border-slate-200/70">
              {navLinks.map((link) => {
                const Icon = link.icon
                const isActive =
                  currentPage === link.target ||
                  (link.name === 'Colleges' &&
                    (currentPage === 'colleges-listing' ||
                      currentPage === 'colleges-categories' ||
                      currentPage === 'college-detail')) ||
                  (link.name === 'Courses' && currentPage === 'courses') ||
                  (link.name === 'Exams' && currentPage === 'exams')

                return (
                  <button
                    key={link.name}
                    onClick={() => onNavigate && onNavigate(link.target)}
                    className={`relative px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'text-brand-primary bg-white shadow-2xs font-bold'
                        : 'text-text-secondary hover:text-text-primary hover:bg-white/60'
                    }`}
                  >
                    <Icon
                      className={`h-3.5 w-3.5 transition-colors ${
                        isActive ? 'text-brand-primary' : 'text-text-light'
                      }`}
                    />
                    <span>{link.name}</span>
                  </button>
                )
              })}
            </nav>

            {/* Right Action Buttons */}
            <div className="hidden lg:flex items-center gap-2.5">
              {/* Quick Search Button */}
              <button
                onClick={handleToggleSearch}
                aria-label="Search"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-text-secondary hover:text-text-primary text-xs transition-colors cursor-pointer"
                title="Search Colleges, Courses & Exams"
              >
                <Search className="h-3.5 w-3.5 text-text-light" />
                <span className="text-text-light">Search...</span>
                <kbd className="hidden xl:inline-block px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono text-slate-400 font-semibold shadow-2xs">
                  ⌘K
                </kbd>
              </button>

              {/* Saved Colleges Button */}
              <button
                onClick={() => onNavigate && onNavigate('shortlist')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  currentPage === 'shortlist'
                    ? 'bg-rose-50 border-rose-200 text-rose-700 font-bold'
                    : shortlistedCount > 0
                    ? 'bg-white border-slate-200 text-text-secondary hover:text-rose-600 hover:border-rose-200'
                    : 'bg-white border-slate-200 text-text-secondary hover:text-text-primary'
                }`}
                title="Saved Colleges"
              >
                <Heart
                  className={`h-3.5 w-3.5 transition-colors ${
                    shortlistedCount > 0
                      ? 'text-rose-500 fill-rose-500'
                      : 'text-text-light'
                  }`}
                />
                <span>Saved</span>
                {shortlistedCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                    {shortlistedCount}
                  </span>
                )}
              </button>

              {/* Free Counseling CTA */}
              <button
                onClick={onOpenCounseling}
                className="btn btn-primary btn-sm text-xs font-bold cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Free Counseling</span>
              </button>
            </div>

            {/* Mobile Menu & Search / Shortlist Buttons */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={handleToggleSearch}
                aria-label="Search"
                className="p-2 rounded-lg bg-slate-50 text-text-secondary hover:text-brand-primary border border-slate-200 cursor-pointer"
              >
                <Search className="h-4 w-4" />
              </button>

              <button
                onClick={() => onNavigate && onNavigate('shortlist')}
                aria-label="Shortlist"
                className={`relative p-2 rounded-lg border transition-colors cursor-pointer ${
                  shortlistedCount > 0
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-slate-50 border-slate-200 text-text-secondary'
                }`}
              >
                <Heart className={`h-4 w-4 ${shortlistedCount > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
                {shortlistedCount > 0 && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-bold">
                    {shortlistedCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-text-secondary hover:text-brand-primary hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>

          </div>
        </div>

        {/* Integrated Inline Search Screen / Slide-Down Command Panel */}
        <SearchPanel
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSelectCollege={onSelectCollege}
          onSelectCourse={onSelectCourse}
          onSelectExam={onSelectExam}
          onSelectCareer={onSelectCareer}
          onNavigateListing={onNavigateListing}
        />

        {/* Mobile Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
              />

              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-white shadow-2xl z-50 p-6 flex flex-col justify-between overflow-y-auto lg:hidden"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-border-color mb-6">
                    <img src={logoImg} alt="VidyaScope" className="h-8 w-auto object-contain" />
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-1.5 rounded-lg text-text-secondary hover:bg-slate-100"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    {navLinks.map((link) => {
                      const Icon = link.icon
                      const isActive = currentPage === link.target

                      return (
                        <button
                          key={link.name}
                          onClick={() => handleMobileNavClick(link.target)}
                          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors text-left ${
                            isActive
                              ? 'bg-brand-accent text-brand-primary font-bold'
                              : 'text-text-secondary hover:bg-slate-50 hover:text-brand-primary'
                          }`}
                        >
                          <Icon className="h-4 w-4 text-brand-primary" />
                          <span>{link.name}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="pt-6 border-t border-border-color space-y-3">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      onOpenCounseling && onOpenCounseling()
                    }}
                    className="btn btn-primary btn-md w-full text-xs font-bold"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Get Free Counseling</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}

export default Navbar
