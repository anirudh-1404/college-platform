/**
 * VidyaScope Admin Master Service (Live Database Simulation)
 * Syncs seamlessly across Admin Dashboard, College Dashboard, and VidyaScope UI.
 */

import { INITIAL_REGISTRATIONS_QUEUE, INITIAL_AUDIT_LOGS, INITIAL_USERS } from './adminModel'

const STORAGE_KEY_REGISTRATIONS = 'vidyascope_pending_registrations'
const STORAGE_KEY_MASTER_COLLEGE = 'vidyascope_college_master_data'
const STORAGE_KEY_AUTH = 'vidyascope_college_auth'
const STORAGE_KEY_AUDIT_LOGS = 'vidyascope_admin_activity_log'
const STORAGE_KEY_ALL_PROFILES = 'vidyascope_all_college_profiles'
const STORAGE_KEY_USERS = 'vidyascope_platform_users'

export const adminService = {
  // 1. USER MANAGEMENT METHODS
  getUsers() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USERS)
      if (stored) return JSON.parse(stored)
    } catch (e) {
      console.error(e)
    }
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(INITIAL_USERS))
    return INITIAL_USERS
  },

  saveUsers(users) {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users))
    window.dispatchEvent(new CustomEvent('vidyascope_admin_data_change'))
  },

  async addUser(userData) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const users = this.getUsers()
    const newUser = {
      id: `usr_${Date.now()}`,
      createdAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      lastLogin: 'Never',
      status: 'active',
      ...userData,
    }

    const updated = [newUser, ...users]
    this.saveUsers(updated)

    this.addAuditLog({
      action: 'User Created',
      target: newUser.name,
      details: `Created new ${newUser.role} user (${newUser.email}) for ${newUser.collegeName || 'Platform Desk'}.`,
      type: 'user_created',
    })

    return updated
  },

  async updateUser(userId, updatedFields) {
    const users = this.getUsers()
    const updated = users.map((u) => (u.id === userId ? { ...u, ...updatedFields } : u))
    this.saveUsers(updated)
    return updated
  },

  async deleteUser(userId) {
    const users = this.getUsers()
    const target = users.find((u) => u.id === userId)
    const updated = users.filter((u) => u.id !== userId)
    this.saveUsers(updated)

    if (target) {
      this.addAuditLog({
        action: 'User Deleted',
        target: target.name,
        details: `Removed account (${target.email}).`,
        type: 'user_deleted',
      })
    }

    return updated
  },

  async toggleUserStatus(userId) {
    const users = this.getUsers()
    const target = users.find((u) => u.id === userId)
    if (!target) return users

    const nextStatus = target.status === 'active' ? 'suspended' : 'active'
    const updated = users.map((u) => (u.id === userId ? { ...u, status: nextStatus } : u))
    this.saveUsers(updated)

    this.addAuditLog({
      action: `User Account ${nextStatus === 'active' ? 'Reactivated' : 'Suspended'}`,
      target: target.name,
      details: `Changed account status to ${nextStatus}.`,
      type: 'user_status_change',
    })

    return updated
  },

  // 2. REGISTRATIONS MANAGEMENT
  getRegistrations() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_REGISTRATIONS)
      if (stored) return JSON.parse(stored)
    } catch (e) {
      console.error(e)
    }
    localStorage.setItem(STORAGE_KEY_REGISTRATIONS, JSON.stringify(INITIAL_REGISTRATIONS_QUEUE))
    return INITIAL_REGISTRATIONS_QUEUE
  },

  saveRegistrations(regs) {
    localStorage.setItem(STORAGE_KEY_REGISTRATIONS, JSON.stringify(regs))
    window.dispatchEvent(new CustomEvent('vidyascope_admin_data_change'))
  },

  async approveRegistration(regId) {
    await new Promise((resolve) => setTimeout(resolve, 400))
    const regs = this.getRegistrations()
    const target = regs.find((r) => r.id === regId)
    if (!target) return

    const updated = regs.map((r) =>
      r.id === regId ? { ...r, status: 'approved', notes: 'Approved by VidyaScope Compliance Desk' } : r
    )
    this.saveRegistrations(updated)

    // Sync with College Auth state if active
    try {
      const authStored = localStorage.getItem(STORAGE_KEY_AUTH)
      if (authStored) {
        const auth = JSON.parse(authStored)
        if (auth.user && (auth.user.id === regId || auth.user.collegeId === target.collegeId)) {
          auth.user.accountStatus = 'approved'
          auth.user.rejectionReason = null
          auth.isAuthenticated = true
          localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(auth))
          window.dispatchEvent(new CustomEvent('vidyascope_auth_change', { detail: auth }))
        }
      }
    } catch (e) {
      console.error(e)
    }

    this.addAuditLog({
      action: 'Registration Approved',
      target: target.collegeName,
      details: `Institution accreditation authenticated. Granted dashboard portal access.`,
      type: 'approval',
    })

    return updated
  },

  async rejectRegistration(regId, reason) {
    await new Promise((resolve) => setTimeout(resolve, 400))
    const regs = this.getRegistrations()
    const target = regs.find((r) => r.id === regId)
    if (!target) return

    const updated = regs.map((r) =>
      r.id === regId ? { ...r, status: 'rejected', notes: reason || 'Certificate validation failed' } : r
    )
    this.saveRegistrations(updated)

    // Sync with College Auth state
    try {
      const authStored = localStorage.getItem(STORAGE_KEY_AUTH)
      if (authStored) {
        const auth = JSON.parse(authStored)
        if (auth.user && (auth.user.id === regId || auth.user.collegeId === target.collegeId)) {
          auth.user.accountStatus = 'rejected'
          auth.user.rejectionReason = reason || 'Registration rejected by Admin verification team.'
          auth.isAuthenticated = false
          localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(auth))
          window.dispatchEvent(new CustomEvent('vidyascope_auth_change', { detail: auth }))
        }
      }
    } catch (e) {
      console.error(e)
    }

    this.addAuditLog({
      action: 'Registration Rejected',
      target: target.collegeName,
      details: `Rejected: ${reason || 'Document validation failed'}`,
      type: 'rejection',
    })

    return updated
  },

  // 3. COLLEGE PROFILES REVIEW & CMS LIFECYCLE
  getMasterCollegeData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_MASTER_COLLEGE)
      if (stored) return JSON.parse(stored)
    } catch (e) {
      console.error(e)
    }
    return null
  },

  getAllProfiles() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ALL_PROFILES)
      if (stored) return JSON.parse(stored)
    } catch (e) {
      console.error(e)
    }

    // Default multi-college array with current master
    const master = this.getMasterCollegeData()
    const defaultProfiles = [
      master || {
        id: 'iit-bombay',
        name: 'Indian Institute of Technology Bombay',
        shortName: 'IIT Bombay',
        stream: 'engineering',
        ownership: 'Government',
        establishmentYear: 1958,
        nirfRank: 3,
        profileStatus: 'under_review',
        avgPackage: '₹24.5 LPA',
        totalFees: '₹8.94 Lakhs',
        lastUpdated: '28 Aug 2026, 01:20 AM',
        rating: 4.9,
        reviewsCount: 2450,
      },
      {
        id: 'iim-ahmedabad',
        name: 'Indian Institute of Management Ahmedabad',
        shortName: 'IIM Ahmedabad',
        stream: 'management',
        ownership: 'Government',
        establishmentYear: 1961,
        nirfRank: 1,
        profileStatus: 'published',
        avgPackage: '₹34.4 LPA',
        totalFees: '₹25.0 Lakhs',
        lastUpdated: '25 Aug 2026, 03:30 PM',
        rating: 4.9,
        reviewsCount: 1890,
      },
      {
        id: 'aiims-delhi',
        name: 'All India Institute of Medical Sciences New Delhi',
        shortName: 'AIIMS Delhi',
        stream: 'medical',
        ownership: 'Government',
        establishmentYear: 1956,
        nirfRank: 1,
        profileStatus: 'published',
        avgPackage: '₹18.0 LPA',
        totalFees: '₹6,800',
        lastUpdated: '26 Aug 2026, 11:00 AM',
        rating: 4.9,
        reviewsCount: 3120,
      },
      {
        id: 'bits-pilani',
        name: 'Birla Institute of Technology and Science, Pilani',
        shortName: 'BITS Pilani',
        stream: 'engineering',
        ownership: 'Private',
        establishmentYear: 1964,
        nirfRank: 20,
        profileStatus: 'draft',
        avgPackage: '₹20.5 LPA',
        totalFees: '₹23.8 Lakhs',
        lastUpdated: '27 Aug 2026, 05:00 PM',
        rating: 4.8,
        reviewsCount: 1650,
      },
    ]

    localStorage.setItem(STORAGE_KEY_ALL_PROFILES, JSON.stringify(defaultProfiles))
    return defaultProfiles
  },

  saveAllProfiles(profiles) {
    localStorage.setItem(STORAGE_KEY_ALL_PROFILES, JSON.stringify(profiles))
    window.dispatchEvent(new CustomEvent('vidyascope_admin_data_change'))
  },

  // Approve & Publish Profile live to VidyaScope User Website
  async approveAndPublishProfile(collegeId) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const profiles = this.getAllProfiles()
    const target = profiles.find((p) => p.id === collegeId)
    if (!target) return

    const updatedProfiles = profiles.map((p) =>
      p.id === collegeId ? { ...p, profileStatus: 'published', publishedAt: new Date().toLocaleString() } : p
    )
    this.saveAllProfiles(updatedProfiles)

    // Also update master single record if it matches
    const master = this.getMasterCollegeData()
    if (master && master.id === collegeId) {
      const updatedMaster = {
        ...master,
        profileStatus: 'published',
        publishedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      }
      localStorage.setItem(STORAGE_KEY_MASTER_COLLEGE, JSON.stringify(updatedMaster))
      window.dispatchEvent(new CustomEvent('vidyascope_college_data_change', { detail: updatedMaster }))
    }

    this.addAuditLog({
      action: 'Profile Approved & Published',
      target: target.name,
      details: 'All 10 sections validated. Profile published live on VidyaScope public discovery platform.',
      type: 'published',
    })

    return updatedProfiles
  },

  // Request Editorial Changes / Feedback Notes
  async requestProfileChanges(collegeId, feedbackComment) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const profiles = this.getAllProfiles()
    const target = profiles.find((p) => p.id === collegeId)
    if (!target) return

    const feedbackObj = {
      id: `fb_${Date.now()}`,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      comment: feedbackComment || 'Please revise your certification and fee breakdown.',
      requestedBy: 'VidyaScope Editorial Officer',
      resolved: false,
    }

    const updatedProfiles = profiles.map((p) =>
      p.id === collegeId ? {
        ...p,
        profileStatus: 'changes_requested',
        adminFeedback: [feedbackObj, ...(p.adminFeedback || [])],
      } : p
    )
    this.saveAllProfiles(updatedProfiles)

    // Sync master data
    const master = this.getMasterCollegeData()
    if (master && master.id === collegeId) {
      const updatedMaster = {
        ...master,
        profileStatus: 'changes_requested',
        adminFeedback: [feedbackObj, ...(master.adminFeedback || [])],
      }
      localStorage.setItem(STORAGE_KEY_MASTER_COLLEGE, JSON.stringify(updatedMaster))
      window.dispatchEvent(new CustomEvent('vidyascope_college_data_change', { detail: updatedMaster }))
    }

    this.addAuditLog({
      action: 'Changes Requested',
      target: target.name,
      details: `Editorial note sent: "${feedbackComment}"`,
      type: 'changes_requested',
    })

    return updatedProfiles
  },

  // Revert to Draft / Unpublish
  async unpublishProfile(collegeId) {
    await new Promise((resolve) => setTimeout(resolve, 400))
    const profiles = this.getAllProfiles()
    const target = profiles.find((p) => p.id === collegeId)
    if (!target) return

    const updatedProfiles = profiles.map((p) =>
      p.id === collegeId ? { ...p, profileStatus: 'draft' } : p
    )
    this.saveAllProfiles(updatedProfiles)

    const master = this.getMasterCollegeData()
    if (master && master.id === collegeId) {
      const updatedMaster = { ...master, profileStatus: 'draft' }
      localStorage.setItem(STORAGE_KEY_MASTER_COLLEGE, JSON.stringify(updatedMaster))
      window.dispatchEvent(new CustomEvent('vidyascope_college_data_change', { detail: updatedMaster }))
    }

    this.addAuditLog({
      action: 'Profile Unpublished',
      target: target.name,
      details: 'Profile withdrawn from live directory and reverted to draft.',
      type: 'unpublish',
    })

    return updatedProfiles
  },

  // 4. PLATFORM-MANAGED DATA (Ratings, Pros/Cons, Reviews)
  updatePlatformData(collegeId, platformData) {
    const profiles = this.getAllProfiles()
    const updatedProfiles = profiles.map((p) =>
      p.id === collegeId ? { ...p, ...platformData } : p
    )
    this.saveAllProfiles(updatedProfiles)

    const master = this.getMasterCollegeData()
    if (master && master.id === collegeId) {
      const updatedMaster = { ...master, ...platformData }
      localStorage.setItem(STORAGE_KEY_MASTER_COLLEGE, JSON.stringify(updatedMaster))
      window.dispatchEvent(new CustomEvent('vidyascope_college_data_change', { detail: updatedMaster }))
    }

    this.addAuditLog({
      action: 'Platform Data Updated',
      target: collegeId,
      details: 'Updated star ratings, reviews count, pros/cons, or similar colleges algorithm.',
      type: 'platform_update',
    })
  },

  // 5. AUDIT LOGS
  getAuditLogs() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_AUDIT_LOGS)
      if (stored) return JSON.parse(stored)
    } catch (e) {
      console.error(e)
    }
    localStorage.setItem(STORAGE_KEY_AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS))
    return INITIAL_AUDIT_LOGS
  },

  addAuditLog(logItem) {
    const logs = this.getAuditLogs()
    const newLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      adminUser: 'VidyaScope Admin',
      ...logItem,
    }
    const updated = [newLog, ...logs].slice(0, 50)
    localStorage.setItem(STORAGE_KEY_AUDIT_LOGS, JSON.stringify(updated))
    window.dispatchEvent(new CustomEvent('vidyascope_admin_data_change'))
    return updated
  },

  // Analytics Metrics Calculator
  getAnalytics() {
    const regs = this.getRegistrations()
    const profiles = this.getAllProfiles()
    const users = this.getUsers()

    const pendingRegistrations = regs.filter((r) => r.status === 'pending').length
    const approvedRegistrations = regs.filter((r) => r.status === 'approved').length
    const underReviewProfiles = profiles.filter((p) => p.profileStatus === 'under_review').length
    const publishedProfiles = profiles.filter((p) => p.profileStatus === 'published').length
    const changesRequestedProfiles = profiles.filter((p) => p.profileStatus === 'changes_requested').length

    return {
      totalColleges: profiles.length,
      totalUsers: users.length,
      pendingRegistrations,
      approvedRegistrations,
      underReviewProfiles,
      publishedProfiles,
      changesRequestedProfiles,
      totalCoursesIndexed: 320,
      counselingLeads: 1420,
    }
  },
}
