import React, { useState, useEffect } from 'react'
import Sidebar from './components/layout/Sidebar'
import TopBar from './components/layout/TopBar'
import OnboardingContainer from './pages/onboarding/OnboardingContainer'
import CollegeRegisterPage from './pages/auth/CollegeRegisterPage'
import CollegeLoginPage from './pages/auth/CollegeLoginPage'
import PendingVerificationScreen from './pages/auth/PendingVerificationScreen'
import RegistrationRejectedScreen from './pages/auth/RegistrationRejectedScreen'
import Step10ReviewPreview from './pages/onboarding/Step10ReviewPreview'
import CollegeLeadsPage from './pages/leads/CollegeLeadsPage'
import { authService } from './data/authService'
import { collegeService } from './data/collegeService'

function App() {
  // Authentication & Session State
  const [authState, setAuthState] = useState(() => authService.getAuthState())
  const [authView, setAuthView] = useState('login') // 'login' | 'register' | 'pending' | 'rejected'

  // College Profile Master State
  const [collegeData, setCollegeData] = useState(() => collegeService.getCollegeData())
  const [activeView, setActiveView] = useState('onboarding') // 'onboarding' | 'leads'
  const [leadsCount, setLeadsCount] = useState(0)
  const [activeStep, setActiveStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState([])
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [previewModalOpen, setPreviewModalOpen] = useState(false)

  // Listen for storage events / updates & fetch live data
  useEffect(() => {
    if (authState.isAuthenticated) {
      collegeService.fetchCollegeData().then((data) => {
        if (data) setCollegeData(data)
      })
      collegeService.getCollegeLeads().then((leads) => {
        if (leads) setLeadsCount(leads.length)
      })
    }

    const handleAuthChange = (e) => {
      if (e.detail) setAuthState(e.detail)
    }
    const handleCollegeChange = (e) => {
      if (e.detail) setCollegeData(e.detail)
    }

    window.addEventListener('vidyascope_auth_change', handleAuthChange)
    window.addEventListener('vidyascope_college_data_change', handleCollegeChange)

    return () => {
      window.removeEventListener('vidyascope_auth_change', handleAuthChange)
      window.removeEventListener('vidyascope_college_data_change', handleCollegeChange)
    }
  }, [authState.isAuthenticated])

  // Sync state changes from actions
  const reloadAllStates = async () => {
    setAuthState(authService.getAuthState())
    const data = await collegeService.fetchCollegeData()
    if (data) setCollegeData(data)
  }

  // Auth Handlers
  const handleRegistrationSuccess = () => {
    setAuthState(authService.getAuthState())
    setAuthView('pending')
  }

  const handleLoginSuccess = () => {
    setAuthState(authService.getAuthState())
  }

  const handleLogout = () => {
    authService.logout()
    setAuthState(authService.getAuthState())
    setAuthView('login')
  }

  const handleStatusRedirect = (status) => {
    if (status === 'pending_verification') setAuthView('pending')
    if (status === 'rejected') setAuthView('rejected')
  }

  // Check which view to render based on auth and registration status
  const currentUser = authState.user
  const isAuthenticated = authState.isAuthenticated
  const accountStatus = currentUser?.accountStatus || 'approved'

  // Case 1: Registration Pending Screen
  if (accountStatus === 'pending_verification' || authView === 'pending') {
    return (
      <div className="relative min-h-screen bg-slate-50 text-text-primary">
        <PendingVerificationScreen
          user={currentUser}
          onCheckStatus={reloadAllStates}
          onLogout={handleLogout}
        />
      </div>
    )
  }

  // Case 2: Registration Rejected Screen
  if (accountStatus === 'rejected' || authView === 'rejected') {
    return (
      <div className="relative min-h-screen bg-slate-50 text-text-primary">
        <RegistrationRejectedScreen
          user={currentUser}
          onReRegister={() => setAuthView('register')}
          onLogout={handleLogout}
        />
      </div>
    )
  }

  // Case 3: Registration View (Unauthenticated)
  if (!isAuthenticated && authView === 'register') {
    return (
      <div className="relative min-h-screen bg-slate-50 text-text-primary">
        <CollegeRegisterPage
          onNavigateLogin={() => setAuthView('login')}
          onRegistrationSuccess={handleRegistrationSuccess}
        />
      </div>
    )
  }

  // Case 4: Login View (Unauthenticated)
  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen bg-slate-50 text-text-primary">
        <CollegeLoginPage
          onNavigateRegister={() => setAuthView('register')}
          onLoginSuccess={handleLoginSuccess}
          onStatusRedirect={handleStatusRedirect}
        />
      </div>
    )
  }

  // Case 5: Authenticated & Approved -> College Dashboard (Onboarding & Profile Manager)
  return (
    <div className="min-h-screen bg-slate-50 text-text-primary flex flex-col">
      {/* 1. Full-Width Top Header Bar */}
      <TopBar
        status={collegeData.profileStatus || 'draft'}
        collegeName={collegeData.name}
        user={currentUser}
        lastUpdated={collegeData.lastUpdated}
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        onPreviewPublic={() => setPreviewModalOpen(true)}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex">
        {/* 2. Left Sidebar Navigation */}
        <Sidebar
          activeStep={activeStep}
          onSelectStep={(step) => {
            setActiveView('onboarding')
            setActiveStep(step)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          completedSteps={completedSteps}
          collegeData={collegeData}
          activeView={activeView}
          onSelectView={(view) => {
            setActiveView(view)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          leadsCount={leadsCount}
          onPreviewPublic={() => setPreviewModalOpen(true)}
          onLogout={handleLogout}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* 3. Main Workspace Canvas */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
          {/* Dynamic View: Onboarding Wizard vs Student Leads */}
          <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 flex flex-col justify-between">
            {activeView === 'leads' ? (
              <CollegeLeadsPage collegeData={collegeData} />
            ) : (
              <OnboardingContainer
                collegeData={collegeData}
                onUpdateCollegeData={setCollegeData}
                currentStep={activeStep}
                onStepChange={(step) => setActiveStep(step)}
                completedSteps={completedSteps}
                onCompleteStep={(stepId) =>
                  setCompletedSteps((prev) => Array.from(new Set([...prev, stepId])))
                }
                onOpenPublicPreview={() => setPreviewModalOpen(true)}
              />
            )}
          </main>
        </div>
      </div>

      {/* 3. Full-Fidelity Public Live Preview Modal */}
      {previewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative bg-slate-50 rounded-2xl border border-border-color shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto custom-scrollbar p-4 sm:p-6">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-border-color">
              <div className="flex items-center gap-2">
                <span className="font-serif text-base font-bold text-text-primary">
                  Live Public Site Preview Simulator
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-brand-primary text-white rounded">
                  Read Only
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                className="p-1.5 rounded-lg text-text-light hover:text-text-primary hover:bg-slate-200 transition-colors cursor-pointer text-xs font-bold"
              >
                Close Preview (✕)
              </button>
            </div>

            <Step10ReviewPreview
              collegeData={collegeData}
              onSubmitForApproval={async () => {
                const updated = await collegeService.submitForApproval()
                setCollegeData(updated)
                setPreviewModalOpen(false)
              }}
              onNavigateStep={(s) => {
                setActiveStep(s)
                setPreviewModalOpen(false)
              }}
              isReadOnly={collegeData.profileStatus === 'under_review'}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
