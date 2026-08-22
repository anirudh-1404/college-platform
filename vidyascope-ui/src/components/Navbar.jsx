import React, { useState, useEffect } from 'react'
import { Menu, X, Search, GraduationCap, Compass, HelpCircle, BookOpen, Award } from 'lucide-react'
import logoImg from '../assets/logo.png'

const Navbar = ({ onNavigate, currentPage = 'home', onOpenCounseling }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Colleges', target: 'colleges-categories', icon: GraduationCap },
    { name: 'Courses', target: 'course-guide', icon: BookOpen },
    { name: 'Career Guide', target: 'career-guide', icon: HelpCircle },
    { name: 'Counseling', target: 'counseling', icon: Award },
  ]

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-border-color shadow-premium'
          : 'bg-white border-b border-border-color/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <button
              onClick={() => onNavigate && onNavigate('home')}
              className="flex items-center group cursor-pointer text-left focus:outline-none"
            >
              <img
                src={logoImg}
                alt="VidyaScope Logo"
                className="h-14 sm:h-16 max-h-16 w-auto object-contain hover:scale-105 transition-transform duration-300"
              />
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = currentPage === link.target || (link.name === 'Colleges' && (currentPage === 'colleges-categories' || currentPage === 'colleges-listing'))
              return (
                <button
                  key={link.name}
                  onClick={() => onNavigate && onNavigate(link.target)}
                  className={`relative group py-2 text-sm font-semibold transition-colors duration-200 flex items-center gap-1.5 cursor-pointer ${
                    isActive ? 'text-brand-primary font-bold' : 'text-text-secondary hover:text-brand-primary'
                  }`}
                >
                  <Icon className={`h-4 w-4 transition-colors duration-200 ${isActive ? 'text-brand-primary' : 'text-text-light group-hover:text-brand-primary'}`} />
                  <span>{link.name}</span>
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-brand-primary transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </button>
              )
            })}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={() => onNavigate && onNavigate('colleges-listing')}
              aria-label="Search"
              className="p-2.5 rounded-xl text-text-secondary hover:text-brand-primary hover:bg-brand-accent transition-all duration-200 cursor-pointer"
              title="Search Colleges"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={onOpenCounseling}
              className="relative overflow-hidden px-6 py-3 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-text-on-dark font-semibold text-sm transition-all duration-300 hover:shadow-premium transform hover:-translate-y-[1px] active:translate-y-0 group cursor-pointer"
            >
              <span className="relative z-10">Get Counseling</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#9333EA] to-brand-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0" />
            </button>
          </div>

          {/* Mobile Menu & Search Icon Buttons */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={() => onNavigate && onNavigate('colleges-listing')}
              aria-label="Search"
              className="p-2.5 rounded-xl text-text-secondary hover:text-brand-primary hover:bg-brand-accent transition-all duration-200 cursor-pointer"
            >
              <Search className="h-5.5 w-5.5" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl text-text-secondary hover:text-brand-primary hover:bg-brand-accent transition-all duration-200 focus:outline-none cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-sm bg-white h-full shadow-premium flex flex-col justify-between py-6 px-6 z-50 transform transition-transform duration-300 ease-out animate-slide-in">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-border-color">
                <div className="flex items-center">
                  <img
                    src={logoImg}
                    alt="VidyaScope Logo"
                    className="h-12 sm:h-14 w-auto object-contain"
                  />
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl text-text-secondary hover:text-brand-primary hover:bg-brand-accent transition-all duration-200 cursor-pointer"
                  aria-label="Close Menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="mt-8 flex flex-col gap-3">
                {navLinks.map((link) => {
                  const Icon = link.icon
                  const isActive = currentPage === link.target
                  return (
                    <button
                      key={link.name}
                      onClick={() => {
                        setIsOpen(false)
                        onNavigate && onNavigate(link.target)
                      }}
                      className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-base font-semibold transition-all duration-200 w-full text-left cursor-pointer ${
                        isActive
                          ? 'text-brand-primary bg-brand-accent font-bold'
                          : 'text-text-secondary hover:text-brand-primary hover:bg-brand-accent'
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${isActive ? 'text-brand-primary' : 'text-text-light'}`} />
                      <span>{link.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-border-color flex flex-col gap-4">
              <button
                onClick={() => {
                  setIsOpen(false)
                  onOpenCounseling()
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-text-on-dark font-semibold transition-all duration-300 shadow-premium flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Get Counseling</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
