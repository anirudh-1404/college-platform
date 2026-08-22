import React, { useState } from 'react'
import {
  ChevronRight, Home, Compass, Target, TrendingUp, Award,
  Sparkles, CheckCircle2, ArrowRight, Lightbulb, Users, ShieldCheck, Briefcase
} from 'lucide-react'

const careerStreams = [
  {
    id: 'engineering-tech',
    title: 'Engineering & Technology',
    icon: '💻',
    subtitle: 'Software, AI, Robotics, Data & Core Engineering',
    description: 'Ideal for analytical thinkers interested in problem solving, coding, building systems, and innovation.',
    topPaths: [
      { role: 'AI & Data Scientist', demand: 'Very High', avgSalary: '₹12 - ₹35 LPA', keySkills: ['Python', 'ML', 'Mathematics'] },
      { role: 'Full Stack Engineer', demand: 'High', avgSalary: '₹8 - ₹24 LPA', keySkills: ['JavaScript', 'React', 'Node.js'] },
      { role: 'Cybersecurity Specialist', demand: 'High', avgSalary: '₹10 - ₹28 LPA', keySkills: ['Network Security', 'Ethical Hacking'] },
    ]
  },
  {
    id: 'management-commerce',
    title: 'Management & Business',
    icon: '📊',
    subtitle: 'Finance, Marketing, Consulting, Analytics & HR',
    description: 'Great for leaders, communicators, and strategists focused on business growth, markets, and finance.',
    topPaths: [
      { role: 'Financial Analyst / Investment Manager', demand: 'High', avgSalary: '₹10 - ₹30 LPA', keySkills: ['Financial Modeling', 'Excel', 'Valuation'] },
      { role: 'Product Manager', demand: 'Very High', avgSalary: '₹14 - ₹35 LPA', keySkills: ['Product Strategy', 'UX', 'Agile'] },
      { role: 'Digital Marketing Strategist', demand: 'High', avgSalary: '₹6 - ₹18 LPA', keySkills: ['SEO', 'Analytics', 'Campaigns'] },
    ]
  },
  {
    id: 'medical-healthcare',
    title: 'Medical & Healthcare',
    icon: '🩺',
    subtitle: 'Medicine, Biotechnology, Pharmacy & Diagnostics',
    description: 'For compassionate students passionate about science, human biology, research, and saving lives.',
    topPaths: [
      { role: 'Doctor (MBBS + Specialization)', demand: 'Very High', avgSalary: '₹12 - ₹40 LPA', keySkills: ['Clinical Skills', 'Diagnostics', 'Patient Care'] },
      { role: 'Biotech & Pharma Researcher', demand: 'High', avgSalary: '₹7 - ₹20 LPA', keySkills: ['Genomics', 'Lab Research', 'Clinical Trials'] },
      { role: 'Healthcare Administrator', demand: 'Moderate', avgSalary: '₹8 - ₹22 LPA', keySkills: ['Hospital Mgmt', 'Operations'] },
    ]
  },
  {
    id: 'design-creativity',
    title: 'Design, Media & Architecture',
    icon: '🎨',
    subtitle: 'UI/UX, Industrial Design, Animation & Media',
    description: 'Suited for creative visionaries skilled in visual arts, digital media, user experience, and spatial design.',
    topPaths: [
      { role: 'UI/UX Product Designer', demand: 'Very High', avgSalary: '₹8 - ₹25 LPA', keySkills: ['Figma', 'User Research', 'Wireframing'] },
      { role: 'Architect', demand: 'Moderate', avgSalary: '₹6 - ₹20 LPA', keySkills: ['AutoCAD', '3D Modeling', 'Building Design'] },
      { role: 'Game & 3D Animator', demand: 'High', avgSalary: '₹7 - ₹22 LPA', keySkills: ['Blender', 'Maya', 'Concept Art'] },
    ]
  }
]

const guidanceSteps = [
  {
    num: '01',
    title: 'Self Assessment',
    desc: 'Identify your core interests, personality traits, and natural aptitude across technical, analytical, or creative domains.'
  },
  {
    num: '02',
    title: 'Degree & Stream Selection',
    desc: 'Map your goals to top-recognized undergraduate programs (B.Tech, MBA, MBBS, B.Des, BBA) with high market demand.'
  },
  {
    num: '03',
    title: 'Entrance Exam Strategy',
    desc: 'Understand qualifying exam patterns (JEE, NEET, CAT, CUET) and cutoffs for premier government and private institutes.'
  },
  {
    num: '04',
    title: 'Skill & Career Roadmap',
    desc: 'Build a step-by-step career path with industry certifications, internships, and placement assistance.'
  }
]

const CareerGuidePage = ({ onNavigateHome, onOpenCounseling, onNavigateColleges }) => {
  const [activeStreamId, setActiveStreamId] = useState('engineering-tech')

  const activeStream = careerStreams.find((s) => s.id === activeStreamId) || careerStreams[0]

  return (
    <div className="min-h-screen bg-slate-50/60 pb-28">
      
      {/* Breadcrumb Navigation Bar */}
      <div className="bg-white border-b border-border-color py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs font-semibold text-text-light">
            <button onClick={onNavigateHome} className="hover:text-brand-primary cursor-pointer flex items-center gap-1">
              <Home className="h-3.5 w-3.5" />
              <span>Home</span>
            </button>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="text-text-primary font-bold">Career Guidance</span>
          </nav>
        </div>
      </div>

      {/* Hero Header Section */}
      <div className="bg-white border-b border-border-color py-10 lg:py-14 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent text-brand-primary text-xs font-bold uppercase tracking-wider mb-4">
              <Compass className="h-3.5 w-3.5" />
              <span>Career Roadmap & Counseling</span>
            </div>
            
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary leading-tight">
              Choose the Right Career Path with Confidence
            </h1>
            
            <p className="text-sm sm:text-base text-text-secondary font-medium mt-3 leading-relaxed">
              Explore high-growth career options, salary expectations, required skills, and step-by-step guidance tailored for your future.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenCounseling}
                className="px-6 py-3.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Get Free 1-on-1 AI Counseling</span>
              </button>

              <button
                onClick={onNavigateColleges}
                className="px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-text-primary font-semibold text-sm transition-all duration-200 cursor-pointer"
              >
                Explore Top Colleges
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">

        {/* Stream & Career Path Explorer */}
        <div className="bg-white border border-border-color rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-bold text-brand-primary bg-brand-accent px-3 py-1 rounded-full uppercase tracking-wider">
              Interactive Explorer
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-text-primary mt-2">
              Explore High-Growth Career Streams
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Select a domain below to see top job roles, required skills, and average starting packages.
            </p>
          </div>

          {/* Stream Selector Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {careerStreams.map((stream) => {
              const isSelected = activeStreamId === stream.id
              return (
                <button
                  key={stream.id}
                  onClick={() => setActiveStreamId(stream.id)}
                  className={`p-4 rounded-2xl text-left border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-brand-primary text-white border-brand-primary shadow-md'
                      : 'bg-slate-50 border-border-color hover:bg-slate-100 text-text-primary'
                  }`}
                >
                  <div className="text-2xl mb-1">{stream.icon}</div>
                  <h3 className="font-serif text-sm font-bold">{stream.title}</h3>
                  <p className={`text-[11px] mt-1 line-clamp-1 ${isSelected ? 'text-purple-100' : 'text-text-light'}`}>
                    {stream.subtitle}
                  </p>
                </button>
              )
            })}
          </div>

          {/* Active Stream Details */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-border-color space-y-6 mt-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-text-primary flex items-center gap-2">
                <span>{activeStream.icon}</span>
                <span>{activeStream.title} Overview</span>
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary mt-2 leading-relaxed">
                {activeStream.description}
              </p>
            </div>

            {/* Top Career Roles Cards */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-light">
                Top In-Demand Roles & Salary Packages
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activeStream.topPaths.map((path, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-xl border border-border-color space-y-3 shadow-xs">
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="font-serif text-sm font-bold text-text-primary">{path.role}</h5>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 whitespace-nowrap">
                        {path.demand} Demand
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <p className="text-[10px] text-text-light uppercase font-bold">Avg Package</p>
                      <p className="text-sm font-extrabold text-emerald-600">{path.avgSalary}</p>
                    </div>

                    <div>
                      <p className="text-[10px] text-text-light uppercase font-bold mb-1">Key Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {path.keySkills.map((skill, sIdx) => (
                          <span key={sIdx} className="text-[10px] bg-slate-100 text-text-secondary font-medium px-2 py-0.5 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4-Step Career Decision Roadmap */}
        <div className="bg-white border border-border-color rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
          <div>
            <span className="text-xs font-bold text-brand-primary bg-brand-accent px-3 py-1 rounded-full uppercase tracking-wider">
              Step-by-Step Blueprint
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-text-primary mt-2">
              How to Plan Your Career Goal
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {guidanceSteps.map((step) => (
              <div key={step.num} className="p-6 rounded-2xl border border-border-color bg-slate-50/70 relative space-y-3">
                <span className="text-2xl font-black text-brand-primary/30 font-serif">
                  {step.num}
                </span>
                <h3 className="font-serif text-base font-bold text-text-primary">{step.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 1-on-1 Counseling Banner */}
        <div className="bg-gradient-to-r from-brand-primary via-[#9333EA] to-purple-800 rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-glow">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
              <span>Confused About Which Stream to Pick?</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-extrabold">
              Talk to an Expert Career Advisor Today
            </h3>
            <p className="text-xs sm:text-sm text-purple-100 max-w-xl">
              Get customized advice based on your marks, interests, budget, and desired placement outcomes. 100% Free & Confidential.
            </p>
          </div>

          <button
            onClick={onOpenCounseling}
            className="px-7 py-4 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-slate-100 transition-all duration-200 shadow-xl cursor-pointer whitespace-nowrap flex items-center gap-2"
          >
            <span>Book Free Session</span>
            <ArrowRight className="w-4 h-4 text-brand-primary" />
          </button>
        </div>

      </div>

    </div>
  )
}

export default CareerGuidePage
