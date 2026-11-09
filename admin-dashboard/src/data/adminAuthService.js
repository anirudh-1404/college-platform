/**
 * VidyaScope Admin Authentication Service (Connected to Live REST Backend)
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/auth`
    : (import.meta.env.PROD
        ? 'https://api.vidyascope.com/api/auth'
        : 'https://api.vidyascope.com/api/auth')

const STORAGE_KEY_ADMIN_AUTH = 'vidyascope_admin_auth_session'
const STORAGE_KEY_ADMIN_TOKEN = 'vidyascope_admin_token'

export const adminAuthService = {
  getToken() {
    return localStorage.getItem(STORAGE_KEY_ADMIN_TOKEN) || ''
  },

  setToken(token) {
    if (token) {
      localStorage.setItem(STORAGE_KEY_ADMIN_TOKEN, token)
    } else {
      localStorage.removeItem(STORAGE_KEY_ADMIN_TOKEN)
    }
  },

  getAdminAuth() {
    try {
      const token = this.getToken()
      if (!token) {
        return { isAuthenticated: false, user: null }
      }
      const stored = localStorage.getItem(STORAGE_KEY_ADMIN_AUTH)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed?.isAuthenticated) return parsed
      }
    } catch (e) {
      console.error(e)
    }
    return {
      isAuthenticated: false,
      user: null,
    }
  },

  async login(email, password) {
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

      if (data.requireOtp) {
        return {
          requireOtp: true,
          email: data.email,
          role: data.role,
          message: data.message,
        }
      }

      if (data.token) {
        this.setToken(data.token)
      }

      const session = {
        isAuthenticated: true,
        user: data.user,
      }

      localStorage.setItem(STORAGE_KEY_ADMIN_AUTH, JSON.stringify(session))
      window.dispatchEvent(new CustomEvent('vidyascope_admin_auth_change', { detail: session }))
      return session
    } catch (error) {
      console.error('adminAuthService.login error:', error)
      throw error
    }
  },

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

      if (data.token) {
        this.setToken(data.token)
      }

      const session = {
        isAuthenticated: true,
        user: data.user,
      }

      localStorage.setItem(STORAGE_KEY_ADMIN_AUTH, JSON.stringify(session))
      window.dispatchEvent(new CustomEvent('vidyascope_admin_auth_change', { detail: session }))
      return session
    } catch (error) {
      console.error('adminAuthService.verifyLoginOtp error:', error)
      throw error
    }
  },

  async resendOtp({ email, purpose = 'admin_login' }) {
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
      console.error('adminAuthService.resendOtp error:', error)
      throw error
    }
  },

  async logout() {
    try {
      await fetch(`${API_BASE_URL}/logout`, { method: 'POST' })
    } catch (e) {
      console.error(e)
    } finally {
      this.setToken(null)
      const emptySession = {
        isAuthenticated: false,
        user: null,
      }
      localStorage.setItem(STORAGE_KEY_ADMIN_AUTH, JSON.stringify(emptySession))
      window.dispatchEvent(new CustomEvent('vidyascope_admin_auth_change', { detail: emptySession }))
    }
  },
}
