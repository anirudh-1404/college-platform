import React, { useState, useEffect } from 'react'
import AdminSidebar from './components/layout/AdminSidebar'
import AdminTopBar from './components/layout/AdminTopBar'
import AdminLoginPage from './pages/auth/AdminLoginPage'
import AdminOverviewPage from './pages/AdminOverviewPage'
import RegistrationRequestsPage from './pages/RegistrationRequestsPage'
import CollegeProfilesReviewPage from './pages/CollegeProfilesReviewPage'
import UserManagementPage from './pages/UserManagementPage'
import CareerGuidesManagementPage from './pages/CareerGuidesManagementPage'
import ExamManagementPage from './pages/ExamManagementPage'
import PlatformDataManagementPage from './pages/PlatformDataManagementPage'
import AuditLogPage from './pages/AuditLogPage'
import ContactInquiriesPage from './pages/ContactInquiriesPage'
import LiveIntelManagementPage from './pages/LiveIntelManagementPage'
import BlogsManagementPage from './pages/BlogsManagementPage'
import SettingsPage from './pages/SettingsPage'
import ErrorBoundary from './components/common/ErrorBoundary'
import { adminService } from './data/adminService'
import { adminAuthService } from './data/adminAuthService'

function App() {
  // Authentication State
  const [authState, setAuthState] = useState(() => adminAuthService.getAdminAuth())

  // Navigation State
  const [activePage, setActivePage] = useState('overview')
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // Live Synchronized Master Data States
  const [registrations, setRegistrations] = useState([])
  const [profiles, setProfiles] = useState([])
  const [users, setUsers] = useState([])
  const [careerGuides, setCareerGuides] = useState([])
  const [exams, setExams] = useState([])
  const [liveIntelAlerts, setLiveIntelAlerts] = useState([])
  const [auditLogs, setAuditLogs] = useState([])
  const [analytics, setAnalytics] = useState({
    totalColleges: 0,
    publishedProfiles: 0,
    underReviewProfiles: 0,
    changesRequestedProfiles: 0,
    pendingRegistrations: 0,
    approvedRegistrations: 0,
    totalUsers: 0,
  })
  const [trafficData, setTrafficData] = useState({
    totalViews: 0,
    todayViews: 0,
    uniqueVisitors: 0,
    todayUniqueVisitors: 0,
    topColleges: [],
    recentVisitors: [],
    deviceBreakdown: { Desktop: 0, Mobile: 0, Tablet: 0 },
  })

  // Reload handler
  const reloadData = async () => {
    const [regs, profs, usrs, guides, exms, logs, anal, intel, traf] = await Promise.all([
      adminService.getRegistrations(),
      adminService.getAllProfiles(),
      adminService.getUsers(),
      adminService.getCareerGuides(),
      adminService.getExams(),
      adminService.getAuditLogs(),
      adminService.getAnalytics(),
      adminService.getLiveIntel(),
      adminService.getTrafficAnalytics(),
    ])
    setRegistrations(regs)
    setProfiles(profs)
    setUsers(usrs)
    setCareerGuides(guides)
    setExams(exms)
    setAuditLogs(logs)
    setAnalytics(anal)
    setLiveIntelAlerts(intel)
    if (traf) setTrafficData(traf)
  }

  // Load data on mount & subscribe to changes
  useEffect(() => {
    reloadData()

    const handleSync = () => reloadData()
    const handleAuth = (e) => {
      if (e.detail) setAuthState(e.detail)
    }

    window.addEventListener('vidyascope_admin_data_change', handleSync)
    window.addEventListener('vidyascope_college_data_change', handleSync)
    window.addEventListener('vidyascope_auth_change', handleSync)
    window.addEventListener('vidyascope_admin_auth_change', handleAuth)
    window.addEventListener('storage', handleSync)

    return () => {
      window.removeEventListener('vidyascope_admin_data_change', handleSync)
      window.removeEventListener('vidyascope_college_data_change', handleSync)
      window.removeEventListener('vidyascope_auth_change', handleSync)
      window.removeEventListener('vidyascope_admin_auth_change', handleAuth)
      window.removeEventListener('storage', handleSync)
    }
  }, [authState.isAuthenticated])

  // Auth Handlers
  const handleLogin = async (email, password) => {
    const session = await adminAuthService.login(email, password)
    if (session.requireOtp) {
      return session
    }
    setAuthState(session)
    reloadData()
    return session
  }

  const handleVerifyOtp = async (email, otp) => {
    const session = await adminAuthService.verifyLoginOtp({ email, otp })
    setAuthState(session)
    reloadData()
    return session
  }

  const handleLogout = async () => {
    await adminAuthService.logout()
    setAuthState(adminAuthService.getAdminAuth())
  }

  // Action Handlers for Registrations
  const handleApproveRegistration = async (regId) => {
    await adminService.approveRegistration(regId)
    reloadData()
  }

  const handleRejectRegistration = async (regId, reason) => {
    await adminService.rejectRegistration(regId, reason)
    reloadData()
  }

  // Action Handlers for Profiles
  const handleApproveAndPublishProfile = async (collegeId) => {
    await adminService.approveAndPublishProfile(collegeId)
    reloadData()
  }

  const handleRequestProfileChanges = async (collegeId, feedback) => {
    await adminService.requestProfileChanges(collegeId, feedback)
    reloadData()
  }

  const handleUnpublishProfile = async (collegeId) => {
    await adminService.unpublishProfile(collegeId)
    reloadData()
  }

  const handleUpdateCollegeProfile = async (collegeId, updates) => {
    await adminService.updateCollegeProfile(collegeId, updates)
    reloadData()
  }

  // Action Handlers for Admin Users
  const handleAddUser = async (userData) => {
    await adminService.addUser(userData)
    reloadData()
  }

  const handleDeleteUser = async (userId) => {
    await adminService.deleteUser(userId)
    reloadData()
  }

  const handleUpdatePlatformData = async (collegeId, data) => {
    await adminService.updatePlatformData(collegeId, data)
    reloadData()
  }

  const handleAddGuide = async (guideData) => {
    await adminService.addCareerGuide(guideData)
    reloadData()
  }

  const handleDeleteGuide = async (guideId) => {
    await adminService.deleteCareerGuide(guideId)
    reloadData()
  }

  const handleAddExam = async (examData) => {
    await adminService.addExam(examData)
    reloadData()
  }

  const handleDeleteExam = async (examId) => {
    await adminService.deleteExam(examId)
    reloadData()
  }

  const [profilesFilterPreset, setProfilesFilterPreset] = useState('all')

  const getPageTitle = () => {
    switch (activePage) {
      case 'registrations':
        return 'Registration Verification Queue'
      case 'inquiries':
        return 'Contact Inquiries & Student Leads'
      case 'profiles':
        return 'College Profiles & CMS Editorial Review'
      case 'published-colleges':
        return 'Published Colleges Directory'
      case 'users':
        return 'Users Management'
      case 'admin-team':
        return 'Admin Team & Authorization Management'
      case 'career-guides':
        return 'Career Roadmaps & Guidance Management'
      case 'exams':
        return 'Entrance Examinations Management'
      case 'blogs':
        return 'Blogs & Articles CMS'
      case 'live-intel':
        return 'Live Intel Ticker Management'
      case 'platform-data':
        return 'Platform Data & Ratings Management'
      case 'audit-logs':
        return 'Audit Logs & Action Trail'
      case 'settings':
        return 'Platform Settings & Governance'
      case 'overview':
      default:
        return 'Admin Overview'
    }
  }

  // If not logged in, render Admin Login screen
  if (!authState.isAuthenticated) {
    return <AdminLoginPage onLoginSuccess={handleLogin} onVerifyOtp={handleVerifyOtp} />
  }

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex">
      {/* Sidebar */}
      <AdminSidebar
        activePage={activePage}
        onSelectPage={(page) => {
          if (page === 'published-colleges') {
            setProfilesFilterPreset('published')
          } else if (page === 'profiles') {
            setProfilesFilterPreset('all')
          }
          setActivePage(page)
        }}
        pendingRegistrationsCount={registrations.filter((r) => r.status === 'pending').length}
        underReviewCount={profiles.filter((p) => p.profileStatus === 'under_review').length}
        usersCount={users.length}
        newInquiriesCount={analytics.newInquiries || 0}
        currentUser={authState.user}
        onLogout={handleLogout}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top App Bar */}
        <AdminTopBar
          pageTitle={getPageTitle()}
          currentUser={authState.user}
          pendingCount={
            registrations.filter((r) => r.status === 'pending').length +
            profiles.filter((p) => p.profileStatus === 'under_review').length
          }
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onLogout={handleLogout}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <ErrorBoundary resetKey={activePage}>
          {activePage === 'overview' && (
            <AdminOverviewPage
              analytics={analytics}
              trafficData={trafficData}
              registrations={registrations}
              pendingRegistrations={registrations.filter((r) => r.status === 'pending')}
              profiles={profiles}
              auditLogs={auditLogs}
              onNavigate={(page, filter) => {
                if (filter) setProfilesFilterPreset(filter)
                setActivePage(page)
              }}
              onInspectRegistration={() => setActivePage('registrations')}
              onInspectProfile={() => setActivePage('profiles')}
            />
          )}

          {activePage === 'registrations' && (
            <RegistrationRequestsPage
              registrations={registrations}
              onApprove={handleApproveRegistration}
              onReject={handleRejectRegistration}
            />
          )}

          {activePage === 'inquiries' && (
            <ContactInquiriesPage />
          )}

          {(activePage === 'profiles' || activePage === 'published-colleges') && (
            <CollegeProfilesReviewPage
              profiles={profiles}
              defaultFilter={activePage === 'published-colleges' ? 'published' : profilesFilterPreset}
              onApproveAndPublish={handleApproveAndPublishProfile}
              onRequestChanges={handleRequestProfileChanges}
              onUnpublish={handleUnpublishProfile}
              onUpdateCollege={handleUpdateCollegeProfile}
            />
          )}

          {(activePage === 'users' || activePage === 'admin-team') && (
            <UserManagementPage
              users={users}
              onAddUser={handleAddUser}
              onDeleteUser={handleDeleteUser}
            />
          )}

          {activePage === 'career-guides' && (
            <CareerGuidesManagementPage
              guides={careerGuides}
              onAddGuide={handleAddGuide}
              onDeleteGuide={handleDeleteGuide}
            />
          )}

          {activePage === 'exams' && (
            <ExamManagementPage
              exams={exams}
              onAddExam={handleAddExam}
              onDeleteExam={handleDeleteExam}
            />
          )}

          {activePage === 'blogs' && (
            <BlogsManagementPage />
          )}

          {activePage === 'live-intel' && (
            <LiveIntelManagementPage
              alerts={liveIntelAlerts}
              onAddAlert={async (payload) => {
                const res = await adminService.createLiveIntel(payload)
                reloadData()
                return res
              }}
              onUpdateAlert={async (id, payload) => {
                const res = await adminService.updateLiveIntel(id, payload)
                reloadData()
                return res
              }}
              onToggleAlert={async (id) => {
                const res = await adminService.toggleLiveIntel(id)
                reloadData()
                return res
              }}
              onDeleteAlert={async (id) => {
                const res = await adminService.deleteLiveIntel(id)
                reloadData()
                return res
              }}
            />
          )}

          {activePage === 'platform-data' && (
            <PlatformDataManagementPage
              profiles={profiles}
              onUpdatePlatformData={handleUpdatePlatformData}
            />
          )}

          {activePage === 'audit-logs' && (
            <AuditLogPage auditLogs={auditLogs} />
          )}

          {activePage === 'settings' && (
            <SettingsPage currentUser={authState.user} />
          )}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  )
}

export default App
