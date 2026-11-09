import React from 'react'
import CounselingBanner from './CounselingBanner'
import { Mail, Heart } from 'lucide-react'
import logoImg from '../assets/logo.png'

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
)

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

const Footer = ({ onNavigate, onOpenCounseling }) => {
  const exploreLinks = [
    { name: 'Colleges', target: 'colleges-listing' },
    { name: 'Academic Courses', target: 'courses' },
    { name: 'Entrance Exams', target: 'exams' },
  ]

  const resourceLinks = [
    { name: 'Student Blogs & Articles', target: 'blogs' },
    { name: 'Compare Colleges', target: 'compare' },
    { name: 'Saved Colleges', target: 'shortlist' },
    { name: 'Career Roadmaps', target: 'career-guide' },
    { name: '1-on-1 Counseling', target: 'counseling' },
    { name: 'Explore by Stream', target: 'colleges-categories' },
  ]

  const socials = [
    { icon: FacebookIcon, href: 'https://www.facebook.com/VidyaScopeOfficial', name: 'Facebook' },
    { icon: TwitterIcon, href: 'https://twitter.com', name: 'Twitter' },
    { icon: LinkedinIcon, href: 'https://linkedin.com', name: 'LinkedIn' },
    { icon: InstagramIcon, href: 'https://instagram.com', name: 'Instagram' },
  ]

  return (
    <footer className="relative w-full">
      {/* Top Banner */}
      <div className="bg-white">
        <CounselingBanner onOpenCounseling={onOpenCounseling} />
      </div>

      {/* Main Dark Navy Footer */}
      <div className="bg-navy-panel border-t border-border-dark text-text-on-dark-muted pt-14 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* 4-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10">

            {/* Column 1: Brand & Bio (Span 5) */}
            <div className="lg:col-span-5 flex flex-col items-start gap-4">
              <button
                onClick={() => onNavigate && onNavigate('home')}
                className="flex items-center group focus:outline-none cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-slate-700/50 hover:bg-slate-100 transition-all shadow-sm"
              >
                <img
                  src={logoImg}
                  alt="VidyaScope Logo"
                  className="h-8 sm:h-9 w-auto object-contain"
                />
              </button>
              <p className="text-xs sm:text-sm font-medium leading-relaxed max-w-sm text-slate-400">
                VidyaScope is India&apos;s dedicated college discovery platform empowering students to explore verified cutoffs, authentic placement records, and transparent fee calculators.
              </p>

              {/* Social Handles */}
              <div className="flex items-center gap-2 mt-1">
                {socials.map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className="flex items-center justify-center w-8 h-8 rounded-lg border border-border-dark bg-navy-card text-slate-400 hover:text-white hover:border-brand-primary/40 transition-colors"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Column 2: Explore (Span 2) */}
            <div className="lg:col-span-2 flex flex-col items-start gap-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-serif">
                Explore
              </h4>
              <ul className="flex flex-col items-start gap-2.5">
                {exploreLinks.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => onNavigate && onNavigate(link.target)}
                      className="text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Resources (Span 2) */}
            <div className="lg:col-span-2 flex flex-col items-start gap-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-serif">
                Decision Tools
              </h4>
              <ul className="flex flex-col items-start gap-2.5">
                {resourceLinks.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => onNavigate && onNavigate(link.target)}
                      className="text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Contact (Span 3) */}
            <div className="lg:col-span-3 flex flex-col items-start gap-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-serif">
                Support & Inquiries
              </h4>
              <ul className="flex flex-col items-start gap-2.5 w-full text-xs">
                <li className="flex items-center gap-2 text-slate-400">
                  <Mail className="h-3.5 w-3.5 text-brand-primary flex-shrink-0" />
                  <a href="mailto:info@vidyascope.com" className="hover:text-white transition-colors">
                    info@vidyascope.com
                  </a>
                </li>
              </ul>
              <div className="mt-2 pt-3 border-t border-border-dark/80 w-full">
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenCounseling) {
                      onOpenCounseling({ title: 'Request a Call Back', source: 'request_call_back', isCallback: true })
                    } else if (onNavigate) {
                      onNavigate('counseling')
                    }
                  }}
                  className="w-full py-2 rounded-lg bg-brand-primary/20 hover:bg-brand-primary/30 text-brand-primary border border-brand-primary/30 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Request Call Back
                </button>
              </div>
            </div>

          </div>

          {/* Copyright Strip */}
          <div className="border-t border-border-dark/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <p>© 2026 VidyaScope. Transparent College Discovery Platform.</p>
            <p className="flex items-center gap-1.5">
              <span>Designed for students</span>
              <Heart className="h-3.5 w-3.5 text-brand-primary fill-brand-primary" />
            </p>
          </div>

        </div>
      </div>
    </footer>
  )
}

export default Footer
