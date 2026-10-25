/**
 * VidyaScope Auth & Registration Service (Connected to Live REST Backend)
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/auth`
    : (import.meta.env.PROD
        ? 'https://vidyascope-backend.onrender.com/api/auth'
        : 'http://localhost:8080/api/auth')

const STORAGE_KEY_AUTH = 'vidyascope_college_auth'
const STORAGE_KEY_TOKEN = 'vidyascope_token'

export const authService = {
  // Get token
  getToken() {
    return localStorage.getItem(STORAGE_KEY_TOKEN) || ''
  },

  // Set token
  setToken(token) {
    if (token) {
      localStorage.setItem(STORAGE_KEY_TOKEN, token)
    } else {
      localStorage.removeItem(STORAGE_KEY_TOKEN)
    }
  },

  // Get current local auth state
  getAuthState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_AUTH)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (e) {
      console.error('Error reading auth state from storage', e)
    }
    return {
      isAuthenticated: false,
      user: null,
    }
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

  // Register a new college account in MongoDB (Step 1: Initiate & send OTP)
  async registerCollege({ collegeName, email, password, contactPerson, designation, phone, proofFile }) {
    try {
      const res = await fetch(`${API_BASE_URL}/register-college`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collegeName,
          email,
          password: password || 'College@123',
          contactPerson,
          designation,
          phone,
          proofDocument: proofFile ? {
            name: proofFile.name || 'Registration_Document.pdf',
            size: typeof proofFile.size === 'string'
              ? proofFile.size
              : `${((proofFile.size || 0) / (1024 * 1024)).toFixed(2)} MB`,
            type: proofFile.type || 'application/pdf',
            url: proofFile.previewUrl || proofFile.url || '',
          } : undefined,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      // Backend now sends OTP first
      if (data.requireOtp) {
        return {
          requireOtp: true,
          email: data.email,
          message: data.message,
        }
      }

      const state = {
        isAuthenticated: false,
        user: {
          ...data.user,
          accountStatus: 'pending_verification',
        },
      }
      this.saveAuthState(state)

      return { success: true, user: data.user }
    } catch (error) {
      console.error('registerCollege error:', error)
      throw error
    }
  },

  // Verify College Registration OTP (Step 2: Commit Registration)
  async verifyRegisterOtp({ email, otp }) {
    try {
      const res = await fetch(`${API_BASE_URL}/verify-register-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || 'OTP verification failed')
      }

      const state = {
        isAuthenticated: false,
        user: {
          ...data.user,
          accountStatus: 'pending_verification',
        },
      }
      this.saveAuthState(state)

      return { success: true, user: data.user, message: data.message }
    } catch (error) {
      console.error('verifyRegisterOtp error:', error)
      throw error
    }
  },

  // Login via Live Backend (Step 1: Check password & trigger OTP)
  async login({ email, password }) {
    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || 'Invalid credentials')
      }

      // Backend requires OTP verification
      if (data.requireOtp) {
        return {
          requireOtp: true,
          email: data.email,
          role: data.role,
          message: data.message,
        }
      }

      return { success: true, user: data.user }
    } catch (error) {
      console.error('login error:', error)
      throw error
    }
  },

  // Verify Login OTP (Step 2: Issue Session & Token)
  async verifyLoginOtp({ email, otp }) {
    try {
      const res = await fetch(`${API_BASE_URL}/verify-login-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || 'Invalid verification code')
      }

      if (data.user?.accountStatus === 'pending_verification') {
        const state = {
          isAuthenticated: false,
          user: data.user,
        }
        this.saveAuthState(state)
        return {
          success: false,
          status: 'pending_verification',
          user: data.user,
          message: 'Your college account is pending verification by VidyaScope Admin.',
        }
      }

      if (data.user?.accountStatus === 'rejected') {
        const state = {
          isAuthenticated: false,
          user: data.user,
        }
        this.saveAuthState(state)
        return {
          success: false,
          status: 'rejected',
          user: data.user,
          message: data.user.rejectionReason || 'Your registration was rejected by Admin.',
        }
      }

      // Successful verified login
      if (data.token) {
        this.setToken(data.token)
      }

      localStorage.removeItem('vidyascope_college_data')

      const state = {
        isAuthenticated: true,
        user: data.user,
      }
      this.saveAuthState(state)

      return { success: true, user: data.user }
    } catch (error) {
      console.error('verifyLoginOtp error:', error)
      throw error
    }
  },

  // Resend OTP
  async resendOtp({ email, purpose = 'login' }) {
    try {
      const res = await fetch(`${API_BASE_URL}/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || 'Failed to resend code')
      }

      return { success: true, message: data.message }
    } catch (error) {
      console.error('resendOtp error:', error)
      throw error
    }
  },

  // Logout
  async logout() {
    try {
      await fetch(`${API_BASE_URL}/logout`, { method: 'POST' })
    } catch (e) {
      console.error(e)
    } finally {
      this.setToken(null)
      localStorage.removeItem('vidyascope_college_data')
      const state = {
        isAuthenticated: false,
        user: null,
      }
      this.saveAuthState(state)
    }
  },
}
