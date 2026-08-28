/**
 * VidyaScope Admin Service (Connected to Live REST Backend)
 */

import { adminAuthService } from './adminAuthService'

const API_BASE_URL =
  import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/admin`
    : (import.meta.env.PROD
        ? 'https://vidyascope-backend.onrender.com/api/admin'
        : 'http://localhost:8080/api/admin')

export const adminService = {
  getHeaders() {
    const token = adminAuthService.getToken()
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }
  },

  // 1. ANALYTICS
  async getAnalytics() {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics`, { headers: this.getHeaders() })
      const data = await res.json()
      if (res.ok && data.analytics) {
        return data.analytics
      }
    } catch (e) {
      console.warn('Analytics fetch error:', e)
    }
    return {
      totalColleges: 0,
      publishedProfiles: 0,
      underReviewProfiles: 0,
      changesRequestedProfiles: 0,
      pendingRegistrations: 0,
      approvedRegistrations: 0,
      totalUsers: 0,
    }
  },

  // 2. REGISTRATIONS
  async getRegistrations(status = 'all') {
    try {
      const res = await fetch(`${API_BASE_URL}/registrations?status=${status}`, { headers: this.getHeaders() })
      const data = await res.json()
      if (res.ok && data.registrations) {
        return data.registrations.map(r => ({ ...r, id: r._id || r.id }))
      }
    } catch (e) {
      console.warn('Registrations fetch error:', e)
    }
    return []
  },

  async approveRegistration(regId) {
    try {
      const res = await fetch(`${API_BASE_URL}/registrations/${regId}/approve`, {
        method: 'POST',
        headers: this.getHeaders(),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Approval failed')
      window.dispatchEvent(new CustomEvent('vidyascope_admin_data_change'))
      return data.registration
    } catch (error) {
      console.error('approveRegistration error:', error)
      throw error
    }
  },

  async rejectRegistration(regId, reason) {
    try {
      const res = await fetch(`${API_BASE_URL}/registrations/${regId}/reject`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ reason }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Rejection failed')
      window.dispatchEvent(new CustomEvent('vidyascope_admin_data_change'))
      return data.registration
    } catch (error) {
      console.error('rejectRegistration error:', error)
      throw error
    }
  },

  // 3. COLLEGE PROFILES CMS REVIEW
  async getAllProfiles(status = 'all') {
    try {
      const res = await fetch(`${API_BASE_URL}/profiles?status=${status}`, { headers: this.getHeaders() })
      const data = await res.json()
      if (res.ok && data.profiles) {
        return data.profiles.map(p => ({ ...p, id: p.slug || p._id }))
      }
    } catch (e) {
      console.warn('Profiles fetch error:', e)
    }
    return []
  },

  async approveAndPublish(collegeId) {
    try {
      const res = await fetch(`${API_BASE_URL}/profiles/${collegeId}/publish`, {
        method: 'POST',
        headers: this.getHeaders(),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Publish failed')
      window.dispatchEvent(new CustomEvent('vidyascope_admin_data_change'))
      return data.college
    } catch (error) {
      console.error('approveAndPublish error:', error)
      throw error
    }
  },

  async requestChanges(collegeId, feedbackComment) {
    try {
      const res = await fetch(`${API_BASE_URL}/profiles/${collegeId}/request-changes`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ feedbackComment }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Request changes failed')
      window.dispatchEvent(new CustomEvent('vidyascope_admin_data_change'))
      return data.college
    } catch (error) {
      console.error('requestChanges error:', error)
      throw error
    }
  },

  async unpublish(collegeId) {
    try {
      const res = await fetch(`${API_BASE_URL}/profiles/${collegeId}/unpublish`, {
        method: 'POST',
        headers: this.getHeaders(),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Unpublish failed')
      window.dispatchEvent(new CustomEvent('vidyascope_admin_data_change'))
      return data.college
    } catch (error) {
      console.error('unpublish error:', error)
      throw error
    }
  },

  // 4. PLATFORM DATA (Ratings & Pros/Cons)
  async updatePlatformData(collegeId, data) {
    try {
      const res = await fetch(`${API_BASE_URL}/platform-data/${collegeId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      })
      const resData = await res.json()
      if (!res.ok) throw new Error(resData.message || 'Update platform data failed')
      window.dispatchEvent(new CustomEvent('vidyascope_admin_data_change'))
      return resData.college
    } catch (error) {
      console.error('updatePlatformData error:', error)
      throw error
    }
  },

  // 5. ADMIN USERS (Name, Email, Password, Role: Admin)
  async getUsers() {
    try {
      const res = await fetch(`${API_BASE_URL}/users`, { headers: this.getHeaders() })
      const data = await res.json()
      if (res.ok && data.users) {
        return data.users.map(u => ({ ...u, id: u._id || u.id }))
      }
    } catch (e) {
      console.warn('Users fetch error:', e)
    }
    return []
  },

  async addUser(userData) {
    try {
      const res = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(userData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Add admin user failed')
      window.dispatchEvent(new CustomEvent('vidyascope_admin_data_change'))
      return data.user
    } catch (error) {
      console.error('addUser error:', error)
      throw error
    }
  },

  async deleteUser(userId) {
    try {
      const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Delete user failed')
      window.dispatchEvent(new CustomEvent('vidyascope_admin_data_change'))
      return true
    } catch (error) {
      console.error('deleteUser error:', error)
      throw error
    }
  },

  // 6. AUDIT LOGS
  async getAuditLogs() {
    try {
      const res = await fetch(`${API_BASE_URL}/audit-logs`, { headers: this.getHeaders() })
      const data = await res.json()
      if (res.ok && data.auditLogs) {
        return data.auditLogs.map(l => ({ ...l, id: l._id || l.id }))
      }
    } catch (e) {
      console.warn('Audit logs fetch error:', e)
    }
    return []
  },
}
