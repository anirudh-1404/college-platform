import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Clock, CheckCircle2, AlertTriangle, ArrowLeft, ArrowRight, Save, Globe, Send
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

const OnboardingContainer = ({
  collegeData,
  onUpdateCollegeData,
  currentStep = 1,
  onStepChange,
  onOpenPublicPreview,
}) => {
  const profileStatus = collegeData.profileStatus || 'draft'
  const isReadOnly = profileStatus === 'under_review'

  // Handle data updates from children steps with draft persistence
  const handleDataChange = (updated) => {
    const saved = collegeService.saveCollegeData(updated)
    onUpdateCollegeData(saved)
  }

  // Handle Save as Draft
  const handleSaveDraft = () => {
    const saved = collegeService.saveCollegeData({
      ...collegeData,
      profileStatus: profileStatus === 'changes_requested' ? 'changes_requested' : 'draft',
    })
    onUpdateCollegeData(saved)
  }

  // Handle Navigation Next
  const handleNext = () => {
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
    const updated = await collegeService.submitForApproval()
    onUpdateCollegeData(updated)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const currentStepObj = ONBOARDING_STEPS.find((s) => s.id === currentStep) || ONBOARDING_STEPS[0]

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] justify-between">
      
      {/* Main Content Area */}
      <div className="space-y-6 max-w-5xl mx-auto w-full pb-10">
        
        {/* 1. Profile Lifecycle Status Banners */}
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
                {collegeData.adminFeedback?.[0]?.comment || 'Please update the 2025 NIRF certification details and course fee breakdown.'}
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

        {/* 2. Clean Minimal Page Heading (matching sidebar active selection) */}
        <div className="pb-2">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-brand-accent text-brand-primary font-bold text-xs flex items-center justify-center border border-brand-primary/20">
              {currentStep}
            </span>
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-text-primary">
              {currentStepObj.label}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1 ml-9.5">
            {currentStepObj.fullTitle}
          </p>
        </div>

        {/* 3. Step Content Dynamic Canvas */}
        <main className="min-h-[420px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
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
        </main>
      </div>

      {/* 4. Bottom Sticky Action Navigation Bar (Flush with Bottom Edge) */}
      <footer className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-border-color -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3.5 shadow-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Back Action */}
          <div>
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="btn btn-outline btn-md text-xs cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back: {ONBOARDING_STEPS[currentStep - 2]?.label}</span>
              </button>
            ) : (
              <span className="text-xs text-text-light font-medium pl-1">
                Step 1 of 10
              </span>
            )}
          </div>

          {/* Right: Save Draft & Save & Continue */}
          <div className="flex items-center gap-2.5">
            {!isReadOnly && (
              <button
                type="button"
                onClick={handleSaveDraft}
                className="btn btn-secondary btn-md text-xs cursor-pointer hidden sm:inline-flex items-center gap-1.5"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save as Draft</span>
              </button>
            )}

            {currentStep < 10 ? (
              <button
                type="button"
                onClick={handleNext}
                className="btn btn-primary btn-md text-xs cursor-pointer flex items-center gap-1.5 font-bold shadow-sm"
              >
                <span>Save & Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              !isReadOnly && (
                <button
                  type="button"
                  onClick={handleSubmitForApproval}
                  className="btn btn-primary btn-md text-xs cursor-pointer flex items-center gap-1.5 font-bold shadow-md bg-emerald-600 hover:bg-emerald-700 border-emerald-600"
                >
                  <Send className="h-4 w-4" />
                  <span>Send for Approval</span>
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
