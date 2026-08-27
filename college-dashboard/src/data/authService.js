/**
 * VidyaScope Auth & Registration Service (Local Database Simulation)
 * Implements Stage 1: College Account Registration, Verification Proof Upload,
 * Pending Verification state, and Admin acceptance/rejection flow.
 */

const STORAGE_KEY_AUTH = 'vidyascope_college_auth'

const DEFAULT_AUTH_STATE = {
  isAuthenticated: true,
  user: {
    id: 'user_iitb_01',
    collegeId: 'iit-bombay',
    collegeName: 'Indian Institute of Technology Bombay',
    email: 'admin@iitb.ac.in',
    contactPerson: 'Dr. S. K. Sharma',
    designation: 'Dean of Academic & Public Relations',
    phone: '+91-9820012345',
    registrationProof: {
      name: 'IITB_Govt_Establishment_Act_Proof.pdf',
      size: '2.4 MB',
      type: 'application/pdf',
      uploadedAt: '24 Aug 2026, 10:00 AM',
      url: null,
    },
    // Account Verification Status: 'pending_verification' | 'approved' | 'rejected'
    accountStatus: 'approved',
    rejectionReason: null,
    registeredAt: '24 Aug 2026, 10:00 AM',
  },
}

export const authService = {
  // Get current auth state
  getAuthState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_AUTH)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (e) {
      console.error('Error reading auth state from storage', e)
    }
    // Set default and return
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(DEFAULT_AUTH_STATE))
    return DEFAULT_AUTH_STATE
  },

  // Save auth state
  saveAuthState(state) {
    try {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(state))
      window.dispatchEvent(new CustomEvent('vidyascope_auth_change', { detail: state }))
    } catch (e) {
      console.error('Error saving auth state', e)
    }
  },

  // Register a new college account
  async registerCollege({ collegeName, email, contactPerson, designation, phone, proofFile }) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    const collegeId = collegeName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')

    const proofData = proofFile ? {
      name: proofFile.name || 'Registration_Document.pdf',
      size: proofFile.size ? `${(proofFile.size / (1024 * 1024)).toFixed(2)} MB` : '1.2 MB',
      type: proofFile.type || 'application/pdf',
      uploadedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      url: proofFile.previewUrl || null,
    } : {
      name: 'Verification_Proof.pdf',
      size: '1.5 MB',
      type: 'application/pdf',
      uploadedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      url: null,
    }

    const newUser = {
      id: `user_${Date.now()}`,
      collegeId: collegeId || 'new-college',
      collegeName,
      email,
      contactPerson: contactPerson || 'Authorized Representative',
      designation: designation || 'College Registrar / Administrator',
      phone: phone || '',
      registrationProof: proofData,
      accountStatus: 'pending_verification', // MUST START IN PENDING VERIFICATION
      rejectionReason: null,
      registeredAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    }

    const state = {
      isAuthenticated: false, // Not logged into dashboard yet
      user: newUser,
    }

    this.saveAuthState(state)
    return { success: true, user: newUser }
  },

  // Login
  async login({ email }) {
    await new Promise((resolve) => setTimeout(resolve, 400))
    const current = this.getAuthState()
    
    // Check if account matches or allow default
    if (current.user && current.user.email === email) {
      if (current.user.accountStatus === 'pending_verification') {
        return { success: false, status: 'pending_verification', user: current.user, message: 'Your college account is pending verification by VidyaScope Admin.' }
      }
      if (current.user.accountStatus === 'rejected') {
        return { success: false, status: 'rejected', user: current.user, message: current.user.rejectionReason || 'Your registration was rejected by Admin.' }
      }

      const updated = {
        ...current,
        isAuthenticated: true,
      }
      this.saveAuthState(updated)
      return { success: true, user: updated.user }
    }

    // Default mock login fallback
    const fallbackUser = {
      ...DEFAULT_AUTH_STATE.user,
      email,
      accountStatus: 'approved',
    }
    const state = {
      isAuthenticated: true,
      user: fallbackUser,
    }
    this.saveAuthState(state)
    return { success: true, user: fallbackUser }
  },

  // Logout
  logout() {
    const current = this.getAuthState()
    const updated = {
      ...current,
      isAuthenticated: false,
    }
    this.saveAuthState(updated)
  },

  // Admin Simulator Actions for Stage 1: Registration Approval
  adminApproveRegistration() {
    const current = this.getAuthState()
    if (!current.user) return
    const updated = {
      ...current,
      user: {
        ...current.user,
        accountStatus: 'approved',
        rejectionReason: null,
      },
    }
    this.saveAuthState(updated)
    return updated
  },

  adminRejectRegistration(reason = 'Verification proof is blurry or invalid. Please re-upload official state recognition certificate.') {
    const current = this.getAuthState()
    if (!current.user) return
    const updated = {
      ...current,
      isAuthenticated: false,
      user: {
        ...current.user,
        accountStatus: 'rejected',
        rejectionReason: reason,
      },
    }
    this.saveAuthState(updated)
    return updated
  },

  adminSetRegistrationPending() {
    const current = this.getAuthState()
    if (!current.user) return
    const updated = {
      ...current,
      isAuthenticated: false,
      user: {
        ...current.user,
        accountStatus: 'pending_verification',
      },
    }
    this.saveAuthState(updated)
    return updated
  },

  resetAllAuth() {
    localStorage.removeItem(STORAGE_KEY_AUTH)
    return DEFAULT_AUTH_STATE
  },
}
