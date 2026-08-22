import React from 'react'
import CounselingBanner from './CounselingBanner'
import { GraduationCap, Mail, Phone, MapPin, Heart } from 'lucide-react'
import logoImg from '../assets/vidyascope_logo.png'

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

const YoutubeIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
)

const Footer = () => {
  const exploreLinks = [
    { name: 'Colleges in India', href: '#colleges' },
    { name: 'Popular Exams', href: '#exams' },
    { name: 'Career Library', href: '#careers' },
    { name: 'Top Courses', href: '#courses' },
    { name: 'Scholarships', href: '#scholarships' },
  ]

  const resourceLinks = [
    { name: 'Compare Colleges', href: '#compare' },
    { name: 'ROI Calculator', href: '#roi' },
    { name: 'Admission Predictor', href: '#predictor' },
    { name: 'Student Blogs', href: '#blogs' },
    { name: 'Help Center', href: '#help' },
  ]

  const companyLinks = [
    { name: 'About Us', href: '#about' },
    { name: 'Careers', href: '#careers' },
    { name: 'Contact Us', href: '#contact' },
    { name: 'Privacy Policy', href: '#privacy' },
    { name: 'Terms of Service', href: '#terms' },
  ]

  const socials = [
    { icon: FacebookIcon, href: 'https://facebook.com', name: 'Facebook' },
    { icon: TwitterIcon, href: 'https://twitter.com', name: 'Twitter' },
    { icon: LinkedinIcon, href: 'https://linkedin.com', name: 'LinkedIn' },
    { icon: InstagramIcon, href: 'https://instagram.com', name: 'Instagram' },
    { icon: YoutubeIcon, href: 'https://youtube.com', name: 'YouTube' },
  ]

  return (
    <footer className="relative w-full">
      {/* Part 1: Counseling CTA Banner (sitting on a clean transition layout) */}
      <div className="bg-white">
        <CounselingBanner />
      </div>

      {/* Part 2: Main Dark Navy Footer */}
      <div className="bg-navy-panel border-t border-border-dark text-text-on-dark-muted pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* 5-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 pb-12">

            {/* Column 1: Brand & Socials (Span 4) */}
            <div className="lg:col-span-4 flex flex-col items-start text-left gap-5">
              <a href="/" className="flex items-center justify-start group focus:outline-none">
                <img
                  src={logoImg}
                  alt="VidyaScope Logo"
                  className="h-16 sm:h-20 lg:h-22 w-auto max-w-[260px] object-contain hover:scale-105 transition-transform duration-300"
                />
              </a>
              <p className="text-sm font-medium leading-relaxed max-w-sm text-text-on-dark-muted">
                Empowering students to discover the right college, compare options, and map successful career paths with AI-driven recommendations and authentic insights.
              </p>

              {/* Social Media Handles */}
              <div className="flex items-center justify-start gap-3 mt-2">
                {socials.map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className="flex items-center justify-center w-9 h-9 rounded-xl border border-border-dark bg-navy-card/50 text-text-on-dark-muted hover:text-brand-primary hover:bg-brand-accent hover:border-brand-primary/20 hover:scale-110 active:scale-95 transition-all duration-300"
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Column 2: Explore (Span 2) */}
            <div className="lg:col-span-2 flex flex-col items-start gap-4">
              <h4 className="text-sm font-bold text-text-on-dark uppercase tracking-wider font-serif">
                Explore
              </h4>
              <ul className="flex flex-col items-start gap-3">
                {exploreLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm font-semibold text-text-on-dark-muted hover:text-brand-primary transition-colors duration-200 text-left"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Resources (Span 2) */}
            <div className="lg:col-span-2 flex flex-col items-start gap-4">
              <h4 className="text-sm font-bold text-text-on-dark uppercase tracking-wider font-serif">
                Resources
              </h4>
              <ul className="flex flex-col items-start gap-3">
                {resourceLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm font-semibold text-text-on-dark-muted hover:text-brand-primary transition-colors duration-200 text-left"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Company (Span 2) */}
            <div className="lg:col-span-2 flex flex-col items-start gap-4">
              <h4 className="text-sm font-bold text-text-on-dark uppercase tracking-wider font-serif">
                Company
              </h4>
              <ul className="flex flex-col items-start gap-3">
                {companyLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm font-semibold text-text-on-dark-muted hover:text-brand-primary transition-colors duration-200 text-left"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 5: Contact Details (Span 2) */}
            <div className="lg:col-span-2 flex flex-col items-start gap-4">
              <h4 className="text-sm font-bold text-text-on-dark uppercase tracking-wider font-serif text-left">
                Contact Us
              </h4>
              <ul className="flex flex-col items-start gap-3.5 w-full">
                {/* <li className="flex items-start gap-2.5 text-sm font-medium leading-relaxed">
                  <MapPin className="h-5 w-5 text-brand-primary flex-shrink-0 mt-0.5" />
                  <span>4th Floor, Tech Hub, Sector 62, Noida, UP - 201301</span>
                </li> */}
                <li className="flex items-center justify-start gap-2.5 text-sm font-semibold hover:text-brand-primary transition-colors duration-200 w-full lg:w-auto">
                  <Phone className="h-4.5 w-4.5 text-brand-primary flex-shrink-0" />
                  <a href="tel:+9118001234567">+91 1800 123 4567</a>
                </li>
                <li className="flex items-center justify-start gap-2.5 text-sm font-semibold hover:text-brand-primary transition-colors duration-200 w-full lg:w-auto">
                  <Mail className="h-4.5 w-4.5 text-brand-primary flex-shrink-0" />
                  <a href="mailto:info@vidyascope.com">info@vidyascope.com</a>
                </li>
              </ul>
            </div>

          </div>

          {/* Copyright Strip */}
          <div className="border-t border-border-dark/60 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs sm:text-sm font-semibold text-text-on-dark-muted/80">
              © 2026 VidyaScope. All rights reserved.
            </p>
            <p className="text-xs sm:text-sm font-semibold text-text-on-dark-muted/80 flex items-center gap-1.5 hover:text-brand-primary transition-colors duration-200 cursor-pointer">
              <span>Made for Students</span>
              <Heart className="h-4 w-4 fill-brand-primary text-brand-primary animate-pulse" />
            </p>
          </div>

        </div>
      </div>
    </footer>
  )
}

export default Footer
