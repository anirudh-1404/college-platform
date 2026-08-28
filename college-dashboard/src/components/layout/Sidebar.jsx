import React from 'react'
import {
  ExternalLink,
  ChevronRight,
  Check,
  LogOut,
} from 'lucide-react'
import logoImg from '../../assets/logo.png'
import { ONBOARDING_STEPS } from '../../data/collegeModel'

const Sidebar = ({
  activeStep,
  onSelectStep,
  completedSteps = [],
  collegeData,
  onPreviewPublic,
  onLogout,
  isMobileOpen,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-border-color flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 px-4 border-b border-border-color flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={logoImg}
                alt="VidyaScope Logo"
                className="h-10 w-auto object-contain"
              />
            </div>

            {/* Mobile Close Button */}
            {isMobileOpen && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="lg:hidden p-1 text-text-light hover:text-text-primary cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* College Quick Identity */}
          <div className="p-3.5 border-b border-border-color bg-slate-50/70 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white border border-border-color overflow-hidden flex items-center justify-center font-bold text-brand-primary text-xs shadow-2xs flex-shrink-0">
              {collegeData?.logo ? (
                <img src={collegeData.logo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                (collegeData?.shortName || 'COL').substring(0, 4)
              )}
            </div>
            <div className="overflow-hidden min-w-0">
              <h3 className="font-serif text-xs font-bold text-text-primary truncate">
                {collegeData?.shortName || collegeData?.name || 'My College'}
              </h3>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded inline-block">
                Institutional Portal
              </span>
            </div>
          </div>

          {/* Navigation Step Items (Scrollable) */}
          <div className="p-3 space-y-1 max-h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-text-light block mb-2">
              Profile Management Sections
            </span>

            {ONBOARDING_STEPS.map((step) => {
              const Icon = step.icon
              const isActive = activeStep === step.id
              const isCompleted = completedSteps.includes(step.id)

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => {
                    onSelectStep(step.id)
                    if (onCloseMobile) onCloseMobile()
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${
                    isActive
                      ? 'bg-brand-primary text-white font-bold shadow-xs'
                      : 'text-text-secondary hover:bg-slate-100 hover:text-text-primary'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-text-light'}`} />
                    <span className="truncate">{step.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {isCompleted && (
                      <span
                        className={`flex items-center justify-center w-4.5 h-4.5 rounded-full ${
                          isActive
                            ? 'bg-white text-brand-primary'
                            : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}
                        title="Completed"
                      >
                        <Check className="h-3 w-3 stroke-[3]" />
                      </span>
                    )}

                    {isActive && <ChevronRight className="h-3.5 w-3.5 text-white" />}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer Actions (Public Preview & Logout) */}
        <div className="p-3 border-t border-border-color space-y-1.5 bg-slate-50/50">
          <button
            type="button"
            onClick={onPreviewPublic}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-brand-primary hover:bg-brand-accent transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Preview Live Site</span>
            </div>
            <span className="text-[10px] bg-brand-primary/10 text-brand-primary px-1.5 py-0.2 rounded font-bold">
              Public
            </span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
