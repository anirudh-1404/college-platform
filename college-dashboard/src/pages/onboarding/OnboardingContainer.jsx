import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Clock, CheckCircle2, AlertTriangle, ArrowLeft, ArrowRight, Save, Globe, Send,
  Eye, Check, Lightbulb, MapPin, Building2, BookOpen, UserCheck, BarChart3,
  Briefcase, Award, ShieldCheck, Image as ImageIcon, Sparkles, ChevronRight, Bookmark
} from 'lucide-react'
import { collegeService } from '../../data/collegeService'
import { StatusBadge } from '../../components/common/StatusBadge'
import { ONBOARDING_STEPS } from '../../data/collegeModel'

// Step Components
import Step1BasicInfo from './Step1BasicInfo'
import Step2LocationContact from './Step2LocationContact'
import Step3CoursesFees from './Step3CoursesFees'
import Step4Admissions from './Step4Admissions'
import Step5Cutoffs from './Step5Cutoffs'
import Step6Placements from './Step6Placements'
import Step7Rankings from './Step7Rankings'
import Step8Facilities from './Step8Facilities'
import Step9Gallery from './Step9Gallery'
import Step10ReviewPreview from './Step10ReviewPreview'
import ErrorBoundary from '../../components/common/ErrorBoundary'

const STEP_ICONS = {
  1: Sparkles,
  2: MapPin,
  3: BookOpen,
  4: UserCheck,
  5: BarChart3,
  6: Briefcase,
  7: Award,
  8: ShieldCheck,
  9: ImageIcon,
  10: CheckCircle2,
}

const STEP_SUBTITLES = {
  1: 'Tell students about your institution. This information will appear on your public VidyaScope profile.',
  2: 'Set your official campus location, physical address, and contact information for prospective students.',
  3: 'Configure academic programs, degrees, durations, fees, and seat capacities across all departments.',
  4: 'Define eligibility criteria, entrance test requirements, quota reservations, and key admission cycles.',
  5: 'Input previous year closing ranks and opening cutoffs for standard counselling rounds.',
  6: 'Highlight average and highest salary packages, top hiring partners, and past placement statistics.',
  7: 'Showcase NIRF, NAAC, NBA, and international accreditations to build student trust.',
  8: 'Detail hostel amenities, library resources, sports complexes, labs, and student services.',
  9: 'Upload high-resolution photos and video tours showcasing campus infrastructure and student life.',
  10: 'Verify your submitted institutional profile details and submit for official verification.',
}

const OnboardingContainer = ({
  collegeData,
  onUpdateCollegeData,
  currentStep = 1,
  onStepChange,
  onCompleteStep,
  onOpenPublicPreview,
}) => {
  const profileStatus = collegeData.profileStatus || 'draft'
  const isReadOnly = profileStatus === 'under_review'

  // Handle data updates from children steps with instant synchronous state update
  const handleDataChange = (updated) => {
    onUpdateCollegeData(updated)
    try {
      localStorage.setItem('vidyascope_college_data', JSON.stringify(updated))
    } catch (e) {
      console.error('Failed to sync to local storage', e)
    }
  }

  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [isSubmittingApproval, setIsSubmittingApproval] = useState(false)

  // Handle Save as Draft (Persist to Backend & Storage)
  const handleSaveDraft = async () => {
    if (isSavingDraft) return
    setIsSavingDraft(true)
    try {
      const toSave = {
        ...collegeData,
        profileStatus: profileStatus === 'changes_requested' ? 'changes_requested' : 'draft',
        lastUpdated: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      }
      onUpdateCollegeData(toSave)
      await collegeService.saveCollegeData(toSave)
    } catch (err) {
      console.error('Failed to save draft:', err)
    } finally {
      setTimeout(() => setIsSavingDraft(false), 500)
    }
  }

  // Handle Navigation Next (Save & Continue)
  const handleNext = async () => {
    await handleSaveDraft()
    if (onCompleteStep) onCompleteStep(currentStep)
    if (currentStep < 10) {
      const next = currentStep + 1
      if (onStepChange) onStepChange(next)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Handle Navigation Back
  const handleBack = () => {
    if (currentStep > 1) {
      const prev = currentStep - 1
      if (onStepChange) onStepChange(prev)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Handle Submit for Approval
  const handleSubmitForApproval = async () => {
    if (isSubmittingApproval) return
    setIsSubmittingApproval(true)
    try {
      const updated = await collegeService.submitForApproval()
      if (updated) {
        onUpdateCollegeData(updated)
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      console.error('Submit for approval failed:', err)
    } finally {
      setIsSubmittingApproval(false)
    }
  }

  const currentStepObj = ONBOARDING_STEPS.find((s) => s.id === currentStep) || ONBOARDING_STEPS[0]
  const nextStepObj = ONBOARDING_STEPS.find((s) => s.id === currentStep + 1)
  const StepIcon = STEP_ICONS[currentStep] || Sparkles

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] justify-between">
      
      {/* Main Content Area */}
      <div className="space-y-6 max-w-7xl mx-auto w-full pb-10">
        
        {/* 1. Profile Lifecycle Status Banners (When applicable) */}
        {profileStatus === 'under_review' && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs"
          >
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">Profile Submission Under Review</p>
                <p className="text-blue-800 text-xs mt-0.5">
                  Your college information was submitted on <strong className="font-semibold">{collegeData.submittedAt || collegeData.lastUpdated}</strong>. While our editorial team inspects regulatory approvals, the form remains locked in read-only mode.
                </p>
              </div>
            </div>
            <StatusBadge status="under_review" size="md" />
          </motion.div>
        )}

        {profileStatus === 'changes_requested' && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-950 space-y-2 shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0" />
                <span className="font-bold text-sm">Changes Requested by VidyaScope Editorial Board</span>
              </div>
              <StatusBadge status="changes_requested" size="sm" />
            </div>
            <div className="bg-white/80 p-3 rounded-lg border border-orange-200 text-xs space-y-1">
              <p className="font-semibold text-orange-900">Admin Review Notes:</p>
              <p className="text-orange-950">
                {collegeData.adminFeedback?.[0]?.comment || 'Please update the NIRF certification details and course fee breakdown.'}
              </p>
              <span className="text-[10px] text-orange-700 block">
                Requested on {collegeData.adminFeedback?.[0]?.date || 'Recent'} by {collegeData.adminFeedback?.[0]?.requestedBy || 'Verification Officer'}
              </span>
            </div>
            <p className="text-[11px] text-orange-800">
              Please make the necessary amendments below, proceed to Step 10, and click <strong>&quot;Send Profile for Approval&quot;</strong> again.
            </p>
          </motion.div>
        )}

        {profileStatus === 'published' && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">Institutional Profile Approved & Live</p>
                <p className="text-emerald-800 text-xs mt-0.5">
                  Your verified college profile is currently active on the VidyaScope public discovery portal. Updates made here can be saved directly.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenPublicPreview}
              className="btn btn-sm btn-outline bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-100 flex items-center gap-1.5 cursor-pointer flex-shrink-0"
            >
              <Globe className="h-3.5 w-3.5 text-emerald-600" />
              <span>View Public Page</span>
            </button>
          </motion.div>
        )}

        {/* 2. Top Breadcrumb & Step Heading Banner (matching reference screenshot) */}
        <div className="space-y-3">
          {/* Breadcrumb navigation */}
          <div className="flex items-center gap-1.5 text-xs text-text-light">
            <button
              type="button"
              onClick={() => onStepChange && onStepChange(1)}
              className="hover:text-text-primary transition-colors cursor-pointer flex items-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>College Profile</span>
            </button>
            <ChevronRight className="h-3 w-3 opacity-50" />
            <span className="text-text-secondary font-medium">{currentStepObj.label}</span>
          </div>

          {/* Heading Row with Step Pill and Preview Live Profile Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
                  {currentStepObj.label}
                </h1>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-brand-primary border border-indigo-100 flex-shrink-0">
                  Step {currentStep} of 10
                </span>
              </div>
              <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
                {STEP_SUBTITLES[currentStep] || currentStepObj.fullTitle}
              </p>
            </div>

            {/* Top Right 'Preview Live Profile' button matching screenshot */}
            <button
              type="button"
              onClick={onOpenPublicPreview}
              className="btn btn-sm btn-outline bg-white hover:bg-slate-50 text-text-primary border-border-color text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-2 cursor-pointer shadow-2xs self-start sm:self-auto flex-shrink-0"
            >
              <Eye className="h-4 w-4 text-brand-primary" />
              <span>Preview Live Profile</span>
            </button>
          </div>
        </div>

        {/* 3. Responsive 2-Column Layout (Form Canvas + Right Preview Column) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Main Form Canvas (Left 8 Cols on desktop) */}
          <main className="xl:col-span-8 min-h-[460px]">
            <ErrorBoundary>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.16 }}
                >
                  {currentStep === 1 && (
                    <Step1BasicInfo
                      collegeData={collegeData}
                      onChange={handleDataChange}
                      isReadOnly={isReadOnly}
                    />
                  )}
                  {currentStep === 2 && (
                    <Step2LocationContact
                      collegeData={collegeData}
                      onChange={handleDataChange}
                      isReadOnly={isReadOnly}
                    />
                  )}
                  {currentStep === 3 && (
                    <Step3CoursesFees
                      collegeData={collegeData}
                      onChange={handleDataChange}
                      isReadOnly={isReadOnly}
                    />
                  )}
                  {currentStep === 4 && (
                    <Step4Admissions
                      collegeData={collegeData}
                      onChange={handleDataChange}
                      isReadOnly={isReadOnly}
                    />
                  )}
                  {currentStep === 5 && (
                    <Step5Cutoffs
                      collegeData={collegeData}
                      onChange={handleDataChange}
                      isReadOnly={isReadOnly}
                    />
                  )}
                  {currentStep === 6 && (
                    <Step6Placements
                      collegeData={collegeData}
                      onChange={handleDataChange}
                      isReadOnly={isReadOnly}
                    />
                  )}
                  {currentStep === 7 && (
                    <Step7Rankings
                      collegeData={collegeData}
                      onChange={handleDataChange}
                      isReadOnly={isReadOnly}
                    />
                  )}
                  {currentStep === 8 && (
                    <Step8Facilities
                      collegeData={collegeData}
                      onChange={handleDataChange}
                      isReadOnly={isReadOnly}
                    />
                  )}
                  {currentStep === 9 && (
                    <Step9Gallery
                      collegeData={collegeData}
                      onChange={handleDataChange}
                      isReadOnly={isReadOnly}
                    />
                  )}
                  {currentStep === 10 && (
                    <Step10ReviewPreview
                      collegeData={collegeData}
                      onSubmitForApproval={handleSubmitForApproval}
                      onNavigateStep={(s) => {
                        if (onStepChange) onStepChange(s)
                      }}
                      isReadOnly={isReadOnly}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </ErrorBoundary>
          </main>

          {/* Right Column: Institutional Profile Preview & Tips (Right 4 Cols on desktop) */}
          <aside className="xl:col-span-4 space-y-6">
            
            {/* Card 1: Profile Preview (Live Student-facing Card) */}
            <div className="bg-white border border-border-color rounded-2xl p-5 space-y-4 shadow-2xs">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-brand-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Eye className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary tracking-tight">
                    Profile Preview
                  </h3>
                  <p className="text-[11px] text-text-light leading-snug mt-0.5">
                    This is how your information will appear to students on VidyaScope.
                  </p>
                </div>
              </div>

              {/* Live Preview Student Card */}
              <div className="border border-border-color rounded-xl p-3.5 bg-slate-50/50 space-y-3">
                {/* Logo & Basic Meta */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white border border-border-color p-1 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-2xs">
                    {collegeData.logo ? (
                      <img
                        src={collegeData.logo}
                        alt="Logo"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Building2 className="h-6 w-6 text-brand-primary" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-text-primary truncate">
                      {collegeData.name || 'Indian Institute of Technology Bombay'}
                    </h4>
                    <p className="text-[11px] text-text-secondary truncate mt-0.5">
                      {collegeData.shortName || 'IITB'} • {collegeData.stream || 'Engineering & Technology'}
                    </p>
                    <p className="text-[10px] text-text-light flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-brand-primary flex-shrink-0" />
                      <span>{collegeData.location?.city || 'Mumbai'}, {collegeData.location?.state || 'Maharashtra'}</span>
                    </p>
                  </div>
                </div>

                {/* Badges row */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-border-color text-text-secondary">
                    {collegeData.ownership || 'Government'}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-border-color text-text-secondary">
                    Est. {collegeData.establishmentYear || '1958'}
                  </span>
                </div>

                {/* Banner / Campus photo */}
                <div className="w-full h-28 rounded-lg overflow-hidden border border-border-color bg-slate-200/60 relative">
                  {collegeData.image ? (
                    <img
                      src={collegeData.image}
                      alt="Campus"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-light text-[11px]">
                      Campus image preview
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Card 2: Tips for a great profile */}
            <div className="bg-indigo-50/40 border border-indigo-100 rounded-2xl p-5 space-y-3.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-indigo-100 text-brand-primary flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="h-3.5 w-3.5" />
                </div>
                <h3 className="text-xs font-bold text-text-primary tracking-tight">
                  Tips for a great profile
                </h3>
              </div>

              <ul className="space-y-2 text-xs text-text-secondary">
                <li className="flex items-start gap-2">
                  <Check className="h-3.5 w-3.5 text-brand-primary flex-shrink-0 mt-0.5" />
                  <span>Use your official college name and high-res logo</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-3.5 w-3.5 text-brand-primary flex-shrink-0 mt-0.5" />
                  <span>Provide accurate and up-to-date information</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-3.5 w-3.5 text-brand-primary flex-shrink-0 mt-0.5" />
                  <span>Upload high-quality campus and infrastructure images</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-3.5 w-3.5 text-brand-primary flex-shrink-0 mt-0.5" />
                  <span>Complete all 10 sections for verified profile tier</span>
                </li>
              </ul>
            </div>

          </aside>

        </div>
      </div>

      {/* 4. Bottom Sticky Action Navigation Bar (matching reference screenshot) */}
      <footer className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-border-color -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Last Saved indicator & Optional Back button */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 animate-pulse" />
              <span className="font-medium text-emerald-700">Last saved:</span>
              <span className="text-text-light">{collegeData.lastUpdated || 'Just now'}</span>
            </div>

            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-text-secondary hover:text-text-primary px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer border border-border-color"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>
            )}
          </div>

          {/* Right: Save as Draft & Primary Continue action */}
          <div className="flex items-center gap-3">
            {!isReadOnly && (
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isSavingDraft}
                className="btn btn-outline btn-md text-xs font-semibold bg-white hover:bg-slate-50 text-text-primary border-border-color cursor-pointer flex items-center gap-1.5 shadow-2xs disabled:opacity-60"
              >
                <Bookmark className="h-3.5 w-3.5 text-text-secondary" />
                <span>{isSavingDraft ? 'Saving Draft...' : 'Save as Draft'}</span>
              </button>
            )}

            {currentStep < 10 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={isSavingDraft}
                className="btn btn-primary btn-md text-xs font-bold cursor-pointer flex items-center gap-2 shadow-xs disabled:opacity-60"
              >
                <span>Continue to {nextStepObj?.label || 'Next Step'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              !isReadOnly && (
                <button
                  type="button"
                  onClick={handleSubmitForApproval}
                  disabled={isSubmittingApproval}
                  className="btn btn-primary btn-md text-xs font-bold cursor-pointer flex items-center gap-2 shadow-md bg-emerald-600 hover:bg-emerald-700 border-emerald-600 disabled:opacity-60"
                >
                  <Send className="h-4 w-4" />
                  <span>{isSubmittingApproval ? 'Submitting...' : 'Send for Approval'}</span>
                </button>
              )
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}

export default OnboardingContainer
