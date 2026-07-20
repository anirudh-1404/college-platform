import React, { useState, useEffect } from 'react'
import { Menu, X, Search, GraduationCap, Compass, HelpCircle, BookOpen, Award, ChevronDown } from 'lucide-react'
import logoImg from '../assets/vidyascope_logo.png'

const Navbar = ({ onNavigate, currentPage = 'home' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)

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
    { name: 'Colleges', href: '#colleges', icon: GraduationCap },
    { name: 'Exams', href: '#exams', icon: Compass },
    { name: 'Courses', href: '#courses', icon: BookOpen },
    { name: 'Career Guide', href: '#career-guide', icon: HelpCircle },
    { name: 'Scholarships', href: '#scholarships', icon: Award },
  ]

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/85 backdrop-blur-md border-b border-border-color shadow-premium'
          : 'bg-transparent border-b border-transparent'
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
              const isCollegesActive = link.name === 'Colleges' && currentPage === 'colleges'
              return (
                <button
                  key={link.name}
                  onClick={() => {
                    if (link.name === 'Colleges' && onNavigate) {
                      onNavigate('colleges')
                    } else if (onNavigate) {
                      onNavigate('home')
                    }
                  }}
                  className={`relative group py-2 text-sm font-semibold transition-colors duration-200 flex items-center gap-1.5 cursor-pointer ${
                    isCollegesActive ? 'text-brand-primary font-bold' : 'text-text-secondary hover:text-brand-primary'
                  }`}
                >
                  <Icon className={`h-4 w-4 transition-colors duration-200 ${isCollegesActive ? 'text-brand-primary' : 'text-text-light group-hover:text-brand-primary'}`} />
                  <span>{link.name}</span>
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-brand-primary transition-all duration-300 ${isCollegesActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </button>
              )
            })}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <button 
              aria-label="Search"
              className="p-2.5 rounded-xl text-text-secondary hover:text-brand-primary hover:bg-brand-accent transition-all duration-200"
            >
              <Search className="h-5 w-5" />
            </button>
            <button className="relative overflow-hidden px-6 py-3 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-text-on-dark font-semibold text-sm transition-all duration-300 hover:shadow-premium transform hover:-translate-y-[1px] active:translate-y-0 group">
              <span className="relative z-10">Get Counseling</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#9333EA] to-brand-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0" />
            </button>
          </div>

          {/* Mobile Menu & Search Icon Buttons */}
          <div className="flex lg:hidden items-center gap-3">
            <button 
              aria-label="Search"
              className="p-2.5 rounded-xl text-text-secondary hover:text-brand-primary hover:bg-brand-accent transition-all duration-200"
            >
              <Search className="h-5.5 w-5.5" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl text-text-secondary hover:text-brand-primary hover:bg-brand-accent transition-all duration-200 focus:outline-none"
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
                  className="p-2 rounded-xl text-text-secondary hover:text-brand-primary hover:bg-brand-accent transition-all duration-200"
                  aria-label="Close Menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="mt-8 flex flex-col gap-5">
                {navLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-base font-semibold text-text-secondary hover:text-brand-primary hover:bg-brand-accent transition-all duration-200"
                    >
                      <Icon className="h-5 w-5 text-text-light group-hover:text-brand-primary" />
                      <span>{link.name}</span>
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-border-color flex flex-col gap-4">
              <button className="w-full py-3.5 px-4 rounded-xl border border-border-color font-semibold text-text-secondary hover:text-brand-primary hover:bg-brand-accent hover:border-brand-primary/20 transition-all duration-200">
                Sign In
              </button>
              <button className="w-full py-3.5 px-4 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-text-on-dark font-semibold transition-all duration-300 shadow-premium flex items-center justify-center gap-2">
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
