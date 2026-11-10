import React from 'react'
import {
  Building2,
  Check,
  ShieldAlert,
  HelpCircle,
  Users,
  Layers,
  ChevronRight,
  Sparkles,
  LogOut,
} from 'lucide-react'
import { ONBOARDING_STEPS } from '../../data/collegeModel'

const Sidebar = ({
  activeStep,
  onSelectStep,
  completedSteps = [],
  collegeData,
  activeView = 'onboarding',
  onSelectView,
  leadsCount = 0,
  onPreviewPublic,
  onLogout,
  isMobileOpen,
  onCloseMobile,
}) => {
  // Calculate completion percentage based on completed steps or active progress
  const completedCount = completedSteps.length
  const completionPercentage = Math.min(100, Math.max(10, Math.round((completedCount / 10) * 100)))

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-72 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 overflow-hidden ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-5">
          
          {/* 1. College Identity Card (Matching Reference Screenshot) */}
          <div className="flex items-start gap-3 p-3 bg-white border border-slate-200/80 rounded-2xl shadow-2xs">
            <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center p-1 flex-shrink-0 text-indigo-600 font-bold overflow-hidden shadow-2xs">
              {collegeData?.logo ? (
                <img src={collegeData.logo} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <Building2 className="h-6 w-6 text-indigo-600" />
              )}
            </div>
            
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-xs text-slate-900 leading-snug truncate" title={collegeData?.name}>
                {collegeData?.name || 'Indian Institute of Technology Bombay'}
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                College Dashboard
              </p>
              <div className="mt-1">
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Registration Verified</span>
                </span>
              </div>
            </div>
          </div>

          {/* 2. Portal Switcher Tabs (Profile CMS vs Student Leads) */}
          <div className="grid grid-cols-2 p-1 bg-slate-100/80 rounded-xl border border-slate-200/70 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                if (onSelectView) onSelectView('onboarding')
                if (onCloseMobile) onCloseMobile()
              }}
              className={`py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeView === 'onboarding'
                  ? 'bg-white text-slate-900 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="h-3.5 w-3.5 text-indigo-600" />
              <span>Profile CMS</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onSelectView) onSelectView('leads')
                if (onCloseMobile) onCloseMobile()
              }}
              className={`py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 relative ${
                activeView === 'leads'
                  ? 'bg-white text-slate-900 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="h-3.5 w-3.5 text-indigo-600" />
              <span>Leads</span>
              {leadsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {leadsCount}
                </span>
              )}
            </button>
          </div>

          {/* 3. Profile Completion Indicator */}
          <div className="space-y-1.5 px-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">College Profile</span>
              <span className="text-slate-500 font-semibold">{completionPercentage}% Complete</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {/* 4. Numbered Step Navigation (01 to 10) */}
          <nav className="space-y-1">
            {ONBOARDING_STEPS.map((step) => {
              const isActive = activeStep === step.id && activeView === 'onboarding'
              const isCompleted = completedSteps.includes(step.id)

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => {
                    if (onSelectView) onSelectView('onboarding')
                    onSelectStep(step.id)
                    if (onCloseMobile) onCloseMobile()
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all cursor-pointer group ${
                    isActive
                      ? 'bg-indigo-50/70 border border-indigo-100/90 shadow-2xs'
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  {/* Numbered Step Indicator Badge */}
                  <div
                    className={`w-7 h-7 rounded-lg text-xs flex items-center justify-center flex-shrink-0 transition-colors ${
                      isActive
                        ? 'bg-white text-indigo-700 font-bold shadow-2xs border border-indigo-100'
                        : isCompleted
                        ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/60'
                        : 'bg-slate-50 text-slate-400 font-semibold border border-slate-200/60 group-hover:text-slate-700'
                    }`}
                  >
                    {isCompleted && !isActive ? (
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    ) : (
                      <span>{step.number || `0${step.id}`}</span>
                    )}
                  </div>

                  {/* Step Label & Subtitle */}
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs leading-tight truncate ${
                        isActive
                          ? 'font-bold text-indigo-950'
                          : 'font-semibold text-slate-700 group-hover:text-slate-900'
                      }`}
                    >
                      {step.label}
                    </p>
                    <p
                      className={`text-[11px] leading-tight truncate mt-0.5 ${
                        isActive ? 'text-indigo-600/90 font-medium' : 'text-slate-400'
                      }`}
                    >
                      {step.subtitle || step.fullTitle}
                    </p>
                  </div>
                </button>
              )
            })}
          </nav>

        </div>

        {/* 5. Bottom "Need Help?" Card (Matching Reference Screenshot) */}
        <div className="p-4 border-t border-slate-200/80 bg-slate-50/50">
          <div className="p-3 bg-white border border-slate-200/80 rounded-2xl shadow-2xs space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center flex-shrink-0">
                <HelpCircle className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 leading-none">Need Help?</p>
                <p className="text-[10px] text-slate-500 mt-1 leading-none">Our team is here to assist you.</p>
              </div>
            </div>

            <a
              href="mailto:info@vidyascope.com"
              className="block text-center py-1.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
            >
              Contact Support
            </a>
          </div>

          {/* Logout Action */}
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="w-full mt-2.5 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50/70 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log Out</span>
            </button>
          )}
        </div>

      </aside>
    </>
  )
}

export default Sidebar
