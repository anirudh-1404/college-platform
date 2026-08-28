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
  const [registrations, setRegistrations] = useState([])
  const [profiles, setProfiles] = useState([])
  const [users, setUsers] = useState([])
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

  // Reload handler
  const reloadData = async () => {
    const [regs, profs, usrs, logs, anal] = await Promise.all([
      adminService.getRegistrations(),
      adminService.getAllProfiles(),
      adminService.getUsers(),
      adminService.getAuditLogs(),
      adminService.getAnalytics(),
    ])
    setRegistrations(regs)
    setProfiles(profs)
    setUsers(usrs)
    setAuditLogs(logs)
    setAnalytics(anal)
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
    setAuthState(session)
    reloadData()
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
    await adminService.approveAndPublish(collegeId)
    reloadData()
  }

  const handleRequestProfileChanges = async (collegeId, feedbackNotes) => {
    await adminService.requestChanges(collegeId, feedbackNotes)
    reloadData()
  }

  const handleUnpublishProfile = async (collegeId) => {
    await adminService.unpublish(collegeId)
    reloadData()
  }

  // Action Handlers for Admin Team Management
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

  const getPageTitle = () => {
    switch (activePage) {
      case 'registrations':
        return 'Registration Verification Queue'
      case 'profiles':
        return 'College Profiles & CMS Editorial Review'
      case 'users':
        return 'Admin Users Management'
      case 'platform-data':
        return 'Platform Data & Ratings Management'
      case 'audit-logs':
        return 'Audit Logs & Action Trail'
      case 'overview':
      default:
        return 'Admin Overview'
    }
  }

  // If not logged in, render Admin Login screen
  if (!authState.isAuthenticated) {
    return <AdminLoginPage onLoginSuccess={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* 1. Master Left Sidebar */}
      <AdminSidebar
        activePage={activePage}
        onSelectPage={(page) => setActivePage(page)}
        pendingRegistrationsCount={analytics.pendingRegistrations}
        underReviewCount={analytics.underReviewProfiles}
        usersCount={users.length}
        currentUser={authState.user}
        onLogout={handleLogout}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Main Administration Canvas */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-60">
        {/* Top Header */}
        <AdminTopBar
          pageTitle={getPageTitle()}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          pendingCount={analytics.pendingRegistrations}
          currentUser={authState.user}
          onLogout={handleLogout}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activePage === 'overview' && (
            <AdminOverviewPage
              analytics={analytics}
              pendingRegistrations={registrations.filter((r) => r.status === 'pending')}
              profiles={profiles}
              onNavigate={(page) => setActivePage(page)}
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
              onAddUser={handleAddUser}
              onDeleteUser={handleDeleteUser}
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
