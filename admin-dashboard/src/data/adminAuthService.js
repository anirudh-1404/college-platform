/**
 * VidyaScope Admin Authentication Service (Connected to Live REST Backend)
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/auth'
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
      const stored = localStorage.getItem(STORAGE_KEY_ADMIN_AUTH)
      if (stored) return JSON.parse(stored)
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
