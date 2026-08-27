/**
 * VidyaScope Admin Authentication Service
 * Manages admin session persistence and login credentials.
 */

const STORAGE_KEY_ADMIN_AUTH = 'vidyascope_admin_auth_session'

export const adminAuthService = {
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
    await new Promise((resolve) => setTimeout(resolve, 400))

    if (!email || !password) {
      throw new Error('Please enter email and password.')
    }

    const trimmedEmail = email.trim().toLowerCase()

    // Accept standard admin emails or newly added admin credentials
    const adminUser = {
      id: 'admin_usr_01',
      name: trimmedEmail.includes('editorial') ? 'Editorial Officer' : 'VidyaScope Super Admin',
      email: trimmedEmail,
      role: 'super_admin',
      designation: 'Central Authority Administrator',
      lastLogin: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    }

    const session = {
      isAuthenticated: true,
      user: adminUser,
    }

    localStorage.setItem(STORAGE_KEY_ADMIN_AUTH, JSON.stringify(session))
    window.dispatchEvent(new CustomEvent('vidyascope_admin_auth_change', { detail: session }))
    return session
  },

  logout() {
    const emptySession = {
      isAuthenticated: false,
      user: null,
    }
    localStorage.setItem(STORAGE_KEY_ADMIN_AUTH, JSON.stringify(emptySession))
    window.dispatchEvent(new CustomEvent('vidyascope_admin_auth_change', { detail: emptySession }))
  },
}
