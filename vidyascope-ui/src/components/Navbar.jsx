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
} from 'lucide-react'
import logoImg from '../assets/logo.png'

const Navbar = ({
  onNavigate,
  currentPage,
  onOpenCounseling,
  shortlistedCount = 0,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-border-color shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div className="flex-shrink-0 flex items-center">
            <button
              onClick={() => onNavigate && onNavigate('home')}
              className="flex items-center gap-2 group focus:outline-none cursor-pointer"
            >
              <img
                src={logoImg}
                alt="VidyaScope Logo"
                className="h-16 sm:h-20 w-auto object-contain transition-transform group-hover:scale-102"
              />
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-7">
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
                  className={`relative py-2 text-sm font-semibold transition-colors duration-200 flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'text-brand-primary font-bold'
                      : 'text-text-secondary hover:text-brand-primary'
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 transition-colors ${
                      isActive ? 'text-brand-primary' : 'text-text-light'
                    }`}
                  />
                  <span>{link.name}</span>
                  {isActive && (
                    <motion.span
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-primary rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              )
            })}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Search Button */}
            <button
              onClick={() => onNavigate && onNavigate('colleges-listing')}
              aria-label="Search"
              className="btn btn-ghost btn-sm p-2.5 rounded-xl text-text-secondary hover:text-brand-primary hover:bg-brand-accent cursor-pointer"
              title="Search Colleges"
            >
              <Search className="h-4.5 w-4.5" />
            </button>

            {/* Shortlist Saved Colleges Button */}
            <button
              onClick={() => onNavigate && onNavigate('shortlist')}
              className={`btn btn-sm rounded-xl cursor-pointer flex items-center gap-1.5 ${
                currentPage === 'shortlist'
                  ? 'btn-accent font-bold'
                  : 'btn-ghost text-text-secondary hover:text-brand-primary hover:bg-brand-accent'
              }`}
              title="Saved Colleges"
            >
              <Heart className={`h-4.5 w-4.5 ${shortlistedCount > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
              <span className="text-xs font-semibold">Saved</span>
              {shortlistedCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                  {shortlistedCount}
                </span>
              )}
            </button>

            {/* Free Counseling CTA with standardized .btn-primary */}
            <button
              onClick={onOpenCounseling}
              className="btn btn-primary btn-md cursor-pointer"
            >
              <span>Get Free Counseling</span>
            </button>
          </div>

          {/* Mobile Menu & Search / Shortlist Buttons */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => onNavigate && onNavigate('shortlist')}
              aria-label="Shortlist"
              className="relative p-2 rounded-xl text-text-secondary hover:text-brand-primary hover:bg-brand-accent transition-colors cursor-pointer"
            >
              <Heart className={`h-5 w-5 ${shortlistedCount > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
              {shortlistedCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-bold">
                  {shortlistedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-text-secondary hover:text-brand-primary hover:bg-brand-accent transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer with Framer Motion AnimatePresence */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
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
                  <span className="font-serif text-lg font-bold text-text-primary">
                    VidyaScope Menu
                  </span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg text-text-secondary hover:bg-slate-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  {navLinks.map((link) => {
                    const Icon = link.icon
                    const isActive = currentPage === link.target

                    return (
                      <button
                        key={link.name}
                        onClick={() => handleMobileNavClick(link.target)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors text-left ${
                          isActive
                            ? 'bg-brand-accent text-brand-primary font-bold'
                            : 'text-text-secondary hover:bg-slate-50 hover:text-brand-primary'
                        }`}
                      >
                        <Icon className="h-4.5 w-4.5 text-brand-primary" />
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
                  className="btn btn-primary btn-md w-full"
                >
                  Get Free Counseling
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
