import React, { useState, useEffect } from 'react'
import AdminSidebar from './components/layout/AdminSidebar'
import AdminTopBar from './components/layout/AdminTopBar'
import AdminLoginPage from './pages/auth/AdminLoginPage'
import AdminOverviewPage from './pages/AdminOverviewPage'
import RegistrationRequestsPage from './pages/RegistrationRequestsPage'
import CollegeProfilesReviewPage from './pages/CollegeProfilesReviewPage'
import UserManagementPage from './pages/UserManagementPage'
import PlatformDataManagementPage from './pages/PlatformDataManagementPage'
import AuditLogPage from './pages/AuditLogPage'
import { adminService } from './data/adminService'
import { adminAuthService } from './data/adminAuthService'

function App() {
  // Authentication State
  const [authState, setAuthState] = useState(() => adminAuthService.getAdminAuth())

  // Navigation State
  const [activePage, setActivePage] = useState('overview')
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // Live Synchronized Master Data States
  const [registrations, setRegistrations] = useState(() => adminService.getRegistrations())
  const [profiles, setProfiles] = useState(() => adminService.getAllProfiles())
  const [users, setUsers] = useState(() => adminService.getUsers())
  const [auditLogs, setAuditLogs] = useState(() => adminService.getAuditLogs())
  const [analytics, setAnalytics] = useState(() => adminService.getAnalytics())

  // Reload handler
  const reloadData = () => {
    setRegistrations(adminService.getRegistrations())
    setProfiles(adminService.getAllProfiles())
    setUsers(adminService.getUsers())
    setAuditLogs(adminService.getAuditLogs())
    setAnalytics(adminService.getAnalytics())
  }

  // Cross-App & Window Event Listeners for Instant Synchronization
  useEffect(() => {
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
  }, [])

  // Auth Handlers
  const handleLogin = async (email, password) => {
    const session = await adminAuthService.login(email, password)
    setAuthState(session)
  }

  const handleLogout = () => {
    adminAuthService.logout()
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

  const handleRequestProfileChanges = async (collegeId, feedbackNotes) => {
    await adminService.requestProfileChanges(collegeId, feedbackNotes)
    reloadData()
  }

  const handleUnpublishProfile = async (collegeId) => {
    await adminService.unpublishProfile(collegeId)
    reloadData()
  }

  // Action Handlers for Admin Team Management
  const handleAddUser = async (userData) => {
    await adminService.addUser(userData)
    reloadData()
  }

  const handleUpdateUser = async (userId, data) => {
    await adminService.updateUser(userId, data)
    reloadData()
  }

  const handleDeleteUser = async (userId) => {
    await adminService.deleteUser(userId)
    reloadData()
  }

  const handleToggleUserStatus = async (userId) => {
    await adminService.toggleUserStatus(userId)
    reloadData()
  }

  const handleUpdatePlatformData = (collegeId, data) => {
    adminService.updatePlatformData(collegeId, data)
    reloadData()
  }

  const getPageTitle = () => {
    switch (activePage) {
      case 'registrations':
        return 'Registration Verification Queue'
      case 'profiles':
        return 'College Profiles & CMS Editorial Review'
      case 'users':
        return 'Admin Team & Roles'
      case 'platform-data':
        return 'Platform Data & SEO Controls'
      case 'audit-logs':
        return 'Administrative Audit Logs'
      case 'overview':
      default:
        return 'Admin Master Overview'
    }
  }

  // Case 1: Unauthenticated -> Render Admin Login Screen
  if (!authState.isAuthenticated) {
    return <AdminLoginPage onLoginSuccess={handleLogin} />
  }

  // Case 2: Authenticated -> Render Full Admin Authority Console
  return (
    <div className="min-h-screen bg-slate-50 text-text-primary flex">
      {/* 1. Left Sidebar Navigation */}
      <AdminSidebar
        activePage={activePage}
        onSelectPage={(page) => {
          setActivePage(page)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
        pendingRegistrationsCount={analytics.pendingRegistrations}
        underReviewCount={analytics.underReviewProfiles}
        usersCount={users.length}
        currentUser={authState.user}
        onLogout={handleLogout}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Main Content Canvas */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Sticky Header */}
        <AdminTopBar
          pageTitle={getPageTitle()}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          pendingCount={analytics.pendingRegistrations}
          currentUser={authState.user}
          onLogout={handleLogout}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {activePage === 'overview' && (
            <AdminOverviewPage
              analytics={analytics}
              pendingRegistrations={registrations.filter((r) => r.status === 'pending')}
              profiles={profiles}
              onNavigate={(page) => {
                setActivePage(page)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              onInspectRegistration={() => {
                setActivePage('registrations')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              onInspectProfile={() => {
                setActivePage('profiles')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            />
          )}

          {activePage === 'registrations' && (
            <RegistrationRequestsPage
              registrations={registrations}
              onApprove={handleApproveRegistration}
              onReject={handleRejectRegistration}
            />
          )}

          {activePage === 'profiles' && (
            <CollegeProfilesReviewPage
              profiles={profiles}
              onApproveAndPublish={handleApproveAndPublishProfile}
              onRequestChanges={handleRequestProfileChanges}
              onUnpublish={handleUnpublishProfile}
            />
          )}

          {activePage === 'users' && (
            <UserManagementPage
              users={users}
              profiles={profiles}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
              onToggleStatus={handleToggleUserStatus}
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
        </main>
      </div>
    </div>
  )
}

export default App
