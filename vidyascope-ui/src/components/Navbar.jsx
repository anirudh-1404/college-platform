import React, { useState } from 'react'
import {
  Layers,
  GraduationCap,
  Scale,
  MessageSquare,
  Building2,
  Menu,
  X,
  ArrowUpRight,
} from 'lucide-react'
import logoImg from '../assets/logo.png'

const Navbar = ({
  onNavigateHome,
  onNavigateListing,
  onNavigateCourses,
  onNavigateCompare,
  onNavigateCounseling,
  onOpenCounseling,
  activePage = 'home',
  compareCount = 0,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navLinks = [
    { id: 'home', label: 'Home', action: onNavigateHome },
    { id: 'colleges-listing', label: 'Colleges Directory', action: onNavigateListing },
    { id: 'courses', label: 'Courses & Degrees', action: onNavigateCourses },
    {
      id: 'compare',
      label: 'Compare Colleges',
      action: onNavigateCompare,
      badge: compareCount > 0 ? compareCount : null,
    },
    { id: 'counseling', label: 'Admissions Advisory', action: onNavigateCounseling },
  ]

  const handleNavClick = (link) => {
    link.action()
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-border-color">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2 cursor-pointer focus:outline-none"
            >
              <img
                src={logoImg}
                alt="VidyaScope"
                className="h-9 w-auto object-contain"
              />
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activePage === link.id

              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link)}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-purple-50 text-brand-primary font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-brand-primary text-white font-bold">
                      {link.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* For Colleges Institutional Link */}
            <a
              href="https://vidyascope-college-platform.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm text-xs font-semibold"
            >
              <Building2 className="h-3.5 w-3.5 text-brand-primary" />
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

          {/* Mobile Menu Button */}
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

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-border-color px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link)}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-between"
            >
              <span>{link.label}</span>
              {link.badge && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-brand-primary text-white font-bold">
                  {link.badge}
                </span>
              )}
            </button>
          ))}

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <a
              href="https://vidyascope-college-platform.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-md w-full text-xs font-semibold justify-center"
            >
              <Building2 className="h-4 w-4 text-brand-primary" />
              <span>For Institutions Portal</span>
            </a>

            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false)
                onOpenCounseling()
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
