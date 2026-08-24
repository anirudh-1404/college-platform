import React, { useState } from 'react'
import {
  ChevronRight, Home, Compass, ArrowRight,
  CheckCircle2, Briefcase, GraduationCap
} from 'lucide-react'

const careerStreams = [
  {
    id: 'engineering-tech',
    title: 'Engineering & Technology',
    icon: '💻',
    subtitle: 'Software, AI, Robotics, Data & Core Engineering',
    description: 'Ideal for analytical thinkers interested in problem-solving, software architecture, algorithm design, and core hardware systems.',
    topPaths: [
      { role: 'AI & Machine Learning Engineer', demand: 'Very High', avgSalary: '₹14 - ₹35 LPA', keySkills: ['Python', 'PyTorch / TF', 'Mathematics & Stats'] },
      { role: 'Software Development Engineer (SDE)', demand: 'Very High', avgSalary: '₹10 - ₹28 LPA', keySkills: ['Data Structures', 'System Design', 'JavaScript / Go'] },
      { role: 'VLSI & Semiconductor Engineer', demand: 'High', avgSalary: '₹12 - ₹30 LPA', keySkills: ['Verilog', 'Micro-architecture', 'FPGA'] },
    ],
  },
  {
    id: 'management-business',
    title: 'Management & Business Strategy',
    icon: '📊',
    subtitle: 'Finance, Marketing, Strategy, Analytics & HR',
    description: 'Suited for strategic leaders, communicators, and analysts focused on corporate finance, consulting, product management, and operations.',
    topPaths: [
      { role: 'Management Consultant', demand: 'Very High', avgSalary: '₹18 - ₹36 LPA', keySkills: ['Problem Structuring', 'Business Modeling', 'Case Analysis'] },
      { role: 'Investment Banker / Private Equity', demand: 'High', avgSalary: '₹20 - ₹40 LPA', keySkills: ['Financial Valuation', 'M&A', 'Financial Modeling'] },
      { role: 'Product Manager', demand: 'Very High', avgSalary: '₹16 - ₹32 LPA', keySkills: ['Product Strategy', 'UX Research', 'Agile Roadmaps'] },
    ],
  },
  {
    id: 'medical-healthcare',
    title: 'Medical & Clinical Sciences',
    icon: '🩺',
    subtitle: 'Clinical Medicine, Surgery, Diagnostics & Pharma',
    description: 'For dedicated science students passionate about human biology, diagnostics, clinical surgery, and saving lives.',
    topPaths: [
      { role: 'Clinical Doctor (MBBS + MD/MS)', demand: 'Very High', avgSalary: '₹14 - ₹40 LPA', keySkills: ['Clinical Diagnostics', 'Patient Care', 'Surgical Protocols'] },
      { role: 'Biomedical & Pharma Researcher', demand: 'High', avgSalary: '₹8 - ₹22 LPA', keySkills: ['Clinical Trials', 'Genomics', 'Drug Formulation'] },
      { role: 'Hospital Administrator', demand: 'Moderate', avgSalary: '₹10 - ₹24 LPA', keySkills: ['Healthcare Ops', 'NABH Standards', 'Health Tech'] },
    ],
  },
  {
    id: 'law-judiciary',
    title: 'Legal Studies & Corporate Law',
    icon: '⚖️',
    subtitle: 'Corporate Advisory, Litigation, Policy & Intellectual Property',
    description: 'For articulate thinkers with strong reasoning, argumentation, research, and interest in commercial contracts or judiciary.',
    topPaths: [
      { role: 'Corporate Legal Counsel', demand: 'High', avgSalary: '₹12 - ₹30 LPA', keySkills: ['Contract Drafting', 'M&A Due Diligence', 'Corporate Governance'] },
      { role: 'Litigation & Dispute Specialist', demand: 'High', avgSalary: '₹8 - ₹25 LPA', keySkills: ['Court Craft', 'Legal Drafting', 'Cross Examination'] },
      { role: 'IP & Patent Attorney', demand: 'High', avgSalary: '₹10 - ₹26 LPA', keySkills: ['Patent Search', 'Trademark Law', 'Tech Licensing'] },
    ],
  },
]

const guidanceSteps = [
  {
    num: '01',
    title: 'Aptitude & Interest Alignment',
    desc: 'Identify whether your core strengths lie in mathematical logic, commercial strategy, biological sciences, or legal reasoning.',
  },
  {
    num: '02',
    title: 'Degree & Program Mapping',
    desc: 'Select established national degree programs (B.Tech, MBA, MBBS, BA-LLB) with recognized accreditation and strong placement records.',
  },
  {
    num: '03',
    title: 'Entrance Examination Strategy',
    desc: 'Focus preparation on qualifying gateways (JEE, CAT, NEET, CLAT, BITSAT) and understand realistic historical rank cutoffs.',
  },
  {
    num: '04',
    title: 'Institutional ROI & Fit Evaluation',
    desc: 'Compare total expenses against verified starting salary packages to ensure high return on educational investment.',
  },
]

const CareerGuidePage = ({ onNavigateHome, onOpenCounseling, onNavigateColleges }) => {
  const [activeStreamId, setActiveStreamId] = useState('engineering-tech')

  const activeStream =
    careerStreams.find((s) => s.id === activeStreamId) || careerStreams[0]

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-border-color py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs font-semibold text-text-light">
            <button
              onClick={onNavigateHome}
              className="hover:text-brand-primary cursor-pointer flex items-center gap-1"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Home</span>
            </button>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="text-text-primary font-bold">Career Guidance</span>
          </nav>
        </div>
      </div>

      {/* Page Hero Header */}
      <div className="bg-white border-b border-border-color py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand-accent text-brand-primary text-xs font-bold uppercase tracking-wider mb-2.5">
              <Compass className="h-3.5 w-3.5" />
              <span>Educational Roadmaps</span>
            </div>
            
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary">
              Plan Your Career Path with Clarity
            </h1>
            
            <p className="text-xs sm:text-sm text-text-secondary mt-2 leading-relaxed">
              Explore industry salary expectations, required core skills, and decision steps across high-growth professional fields.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenCounseling}
                className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs"
              >
                Book Free Career Advisory
              </button>

              <button
                onClick={onNavigateColleges}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-text-primary font-semibold text-xs transition-colors cursor-pointer"
              >
                Explore Matching Colleges
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Explorer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Stream Selector & Roles */}
        <div className="bg-white border border-border-color rounded-xl p-6 space-y-5">
          <div>
            <h2 className="font-serif text-xl font-bold text-text-primary">
              High-Growth Professional Streams
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Select a domain below to see in-demand roles, key required skillsets, and average salary benchmarks.
            </p>
          </div>

          {/* Stream Selector Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {careerStreams.map((stream) => {
              const isSelected = activeStreamId === stream.id
              return (
                <button
                  key={stream.id}
                  onClick={() => setActiveStreamId(stream.id)}
                  className={`p-4 rounded-xl text-left border transition-colors cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-brand-primary text-white border-brand-primary'
                      : 'bg-slate-50 border-border-color hover:bg-slate-100 text-text-primary'
                  }`}
                >
                  <span className="text-xl mb-1">{stream.icon}</span>
                  <h3 className="font-serif text-sm font-bold leading-snug">{stream.title}</h3>
                  <p className={`text-[11px] mt-1 line-clamp-1 ${isSelected ? 'text-purple-100' : 'text-text-light'}`}>
                    {stream.subtitle}
                  </p>
                </button>
              )
            })}
          </div>

          {/* Active Stream Details */}
          <div className="p-5 rounded-xl bg-slate-50 border border-border-color space-y-4">
            <div>
              <h3 className="font-serif text-base font-bold text-text-primary flex items-center gap-2">
                <span>{activeStream.icon}</span>
                <span>{activeStream.title} Overview</span>
              </h3>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                {activeStream.description}
              </p>
            </div>

            {/* Roles Grid */}
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-light mb-3">
                In-Demand Roles & Salary Benchmarks
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {activeStream.topPaths.map((path, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-4 rounded-xl border border-border-color space-y-2.5 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <h5 className="font-serif text-xs font-bold text-text-primary">{path.role}</h5>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {path.demand} Demand
                      </span>
                    </div>

                    <div className="pt-1.5 border-t border-slate-100">
                      <p className="text-[10px] text-text-light font-semibold uppercase">Expected Package</p>
                      <p className="text-xs font-bold text-emerald-600">{path.avgSalary}</p>
                    </div>

                    <div>
                      <p className="text-[10px] text-text-light font-semibold uppercase mb-1">Core Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {path.keySkills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[10px] bg-slate-100 text-text-secondary font-medium px-2 py-0.5 rounded"
                          >
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

        {/* 4-Step Decision Framework */}
        <div className="bg-white border border-border-color rounded-xl p-6 space-y-5">
          <div>
            <h2 className="font-serif text-xl font-bold text-text-primary">
              4-Step Career Decision Framework
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Structured approach to evaluate your aptitude, entrance gateways, and long-term placement returns.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {guidanceSteps.map((step) => (
              <div
                key={step.num}
                className="p-4 rounded-xl border border-border-color bg-slate-50/60 space-y-2"
              >
                <span className="text-lg font-bold text-brand-primary font-serif">
                  {step.num}
                </span>
                <h3 className="font-serif text-sm font-bold text-text-primary">{step.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  )
}

export default CareerGuidePage
