import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Menu,
  X,
  ArrowUpRight,
  MessageSquare,
  Scale,
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
  const navigate = useNavigate()
  const location = useLocation()

  const navLinks = [
    { id: 'home', path: '/', label: 'Home' },
    { id: 'colleges-listing', path: '/colleges', label: 'Colleges' },
    { id: 'courses', path: '/courses', label: 'Courses' },
    { id: 'exams', path: '/exams', label: 'Exams' },
    { id: 'compare', path: '/compare', label: 'Compare' },
    { id: 'career-guide', path: '/career-guide', label: 'Career Guidance' },
  ]

  const isLinkActive = (link) => {
    if (link.path === '/') return location.pathname === '/'
    return location.pathname.startsWith(link.path)
  }

  const handleNavClick = (link) => {
    navigate(link.path)
    if (onNavigate) onNavigate(link.id)
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-border-color">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          
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
                className="h-11 sm:h-13 w-auto object-contain"
              />
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = isLinkActive(link)

              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link)}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-brand-accent text-brand-primary font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              )
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* For Institutions External Portal Link */}
            <a
              href="https://vidyascope-college-platform.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm text-xs font-semibold"
            >
              <span>For Institutions</span>
              <ArrowUpRight className="h-3 w-3 text-slate-400" />
            </a>

            {/* Counseling CTA */}
            <button
              type="button"
              onClick={onOpenCounseling}
              className="btn btn-primary btn-sm text-xs font-bold shadow-2xs"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Get Free Advice</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5 text-slate-700" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-border-color px-4 py-4 space-y-1.5">
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

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <a
              href="https://vidyascope-college-platform.vercel.app"
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
        </div>
      )}
    </header>
  )
}

export default Navbar
