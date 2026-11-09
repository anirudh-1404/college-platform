import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  X,
  ArrowUpRight,
  MessageSquare,
  Heart,
} from 'lucide-react'
import logoImg from '../assets/logo.png'

const Navbar = ({
  onNavigate,
  currentPage = 'home',
  onOpenCounseling,
  shortlistedCount = 0,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSavedBumping, setIsSavedBumping] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Trigger landing bounce when heart arrives at navbar
  const prevCountRef = useRef(shortlistedCount)
  useEffect(() => {
    if (shortlistedCount > prevCountRef.current) {
      const timer = setTimeout(() => {
        setIsSavedBumping(true)
        setTimeout(() => setIsSavedBumping(false), 600)
      }, 700)
      return () => clearTimeout(timer)
    }
    prevCountRef.current = shortlistedCount
  }, [shortlistedCount])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { id: 'colleges-listing', path: '/colleges', label: 'Colleges' },
    { id: 'courses', path: '/courses', label: 'Courses' },
    { id: 'exams', path: '/exams', label: 'Exams' },
    { id: 'compare', path: '/compare', label: 'Compare' },
    { id: 'career-guide', path: '/career-guide', label: 'Career Guidance' },
    { id: 'blogs', path: '/blogs', label: 'Blogs' },
  ]

  const isLinkActive = (link) => {
    return location.pathname.startsWith(link.path)
  }

  const handleNavClick = (link) => {
    navigate(link.path)
    if (onNavigate) onNavigate(link.id)
    setIsMobileMenuOpen(false)
  }

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${
      isScrolled
        ? 'bg-white/90 backdrop-blur-lg border-b border-slate-200/90 shadow-sm'
        : 'bg-white/95 backdrop-blur-md border-b border-border-color'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${
          isScrolled ? 'h-16 sm:h-17' : 'h-18 sm:h-20'
        }`}>
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                navigate('/')
                if (onNavigate) onNavigate('home')
              }}
              className="flex items-center gap-2 cursor-pointer focus:outline-none"
            >
              <img
                src={logoImg}
                alt="VidyaScope"
                className={`w-auto object-contain transition-all duration-300 ${
                  isScrolled ? 'h-10 sm:h-11' : 'h-11 sm:h-13'
                }`}
              />
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = isLinkActive(link)

              return (
                <motion.button
                  key={link.id}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleNavClick(link)}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-brand-accent text-brand-primary font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </motion.button>
              )
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Minimal Saved Colleges Heart Icon with Counter Badge */}
            <motion.div
              animate={isSavedBumping ? { scale: [1, 1.4, 0.9, 1.2, 1] } : { scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative flex items-center justify-center"
            >
              <button
                type="button"
                onClick={() => {
                  navigate('/shortlist')
                  if (onNavigate) onNavigate('shortlist')
                }}
                className={`relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center ${
                  location.pathname === '/shortlist' ? 'bg-rose-50 text-rose-600' : ''
                }`}
                title={shortlistedCount > 0 ? `${shortlistedCount} Saved Colleges` : 'Saved Colleges'}
              >
                <Heart
                  className={`h-5 w-5 transition-transform duration-200 ${
                    shortlistedCount > 0 ? 'fill-rose-500 text-rose-500' : 'text-slate-600 hover:text-slate-800'
                  }`}
                />
                {shortlistedCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-extrabold bg-rose-500 text-white flex items-center justify-center shadow-xs leading-none">
                    {shortlistedCount}
                  </span>
                )}
              </button>
            </motion.div>

            {/* For Institutions External Portal Link */}
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={import.meta.env.VITE_COLLEGE_PORTAL_URL || "https://onair.vidyascope.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm text-xs font-semibold"
            >
              <span>For Institutions</span>
              <ArrowUpRight className="h-3 w-3 text-slate-400" />
            </motion.a>

            {/* Counseling CTA */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={onOpenCounseling}
              className="btn btn-primary btn-sm text-xs font-bold shadow-2xs"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Get Free Advice</span>
            </motion.button>
          </div>

          {/* Mobile Menu Toggle & Saved Icon */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => {
                navigate('/shortlist')
                if (onNavigate) onNavigate('shortlist')
              }}
              className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
              title="Saved Colleges"
            >
              <Heart className={`h-5 w-5 ${shortlistedCount > 0 ? 'fill-rose-500 text-rose-500' : 'text-slate-500'}`} />
              {shortlistedCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-rose-500 text-white shadow-xs">
                  {shortlistedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5 text-slate-700" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown with AnimatePresence */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden bg-white border-b border-border-color px-4 py-4 space-y-1.5 overflow-hidden"
          >
            {navLinks.map((link) => {
              const isActive = isLinkActive(link)

              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-brand-accent text-brand-primary'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              )
            })}

            <button
              type="button"
              onClick={() => {
                navigate('/shortlist')
                if (onNavigate) onNavigate('shortlist')
                setIsMobileMenuOpen(false)
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                location.pathname === '/shortlist'
                  ? 'bg-rose-50 text-rose-700 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Heart className={`h-4 w-4 ${shortlistedCount > 0 ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                <span>Saved Colleges</span>
              </div>
              {shortlistedCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white">
                  {shortlistedCount}
                </span>
              )}
            </button>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <a
                href={import.meta.env.VITE_COLLEGE_PORTAL_URL || "https://onair.vidyascope.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-md w-full text-xs font-semibold justify-center"
              >
                <span>For Institutions Portal</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 ml-1" />
              </a>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  if (onOpenCounseling) onOpenCounseling()
                }}
                className="btn btn-primary btn-md w-full text-xs font-bold justify-center"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Get Free Advice</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
