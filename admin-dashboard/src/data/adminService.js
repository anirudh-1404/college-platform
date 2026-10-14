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

  // UPLOAD IMAGE
  async uploadImage(file, folder = 'vidyascope/career_guides') {
    const token = adminAuthService.getToken()
    const uploadEndpoint = `${API_BASE_URL.replace(/\/admin\/?$/, '')}/upload`

    const formData = new FormData()
    formData.append('image', file)
    formData.append('folder', folder)

    const res = await fetch(uploadEndpoint, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Image upload failed')
    return data.url
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

  async getProfileById(collegeId) {
    try {
      const res = await fetch(`${API_BASE_URL}/profiles/${collegeId}`, { headers: this.getHeaders() })
      const data = await res.json()
      if (res.ok && data.profile) {
        return { ...data.profile, id: data.profile.slug || data.profile._id }
      }
    } catch (e) {
      console.warn('Profile fetch by ID error:', e)
    }
    return null
  },

  async updateCollegeProfile(collegeId, updates) {
    try {
      const res = await fetch(`${API_BASE_URL}/profiles/${collegeId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(updates),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to update college details')
      window.dispatchEvent(new CustomEvent('vidyascope_admin_data_change'))
      window.dispatchEvent(new CustomEvent('vidyascope_college_data_change'))
      return data.college
    } catch (error) {
      console.error('updateCollegeProfile error:', error)
      throw error
    }
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

  async approveAndPublishProfile(collegeId) {
    return this.approveAndPublish(collegeId)
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

  async requestProfileChanges(collegeId, feedbackComment) {
    return this.requestChanges(collegeId, feedbackComment)
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

  async unpublishProfile(collegeId) {
    return this.unpublish(collegeId)
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

  // 7. CAREER ROADMAPS MANAGEMENT
  async getCareerGuides() {
    try {
      const res = await fetch(`${API_BASE_URL}/career-guides`, { headers: this.getHeaders() })
      const data = await res.json()
      if (res.ok && data.guides) {
        return data.guides.map(g => ({ ...g, id: g._id || g.slug }))
      }
    } catch (e) {
      console.warn('Career guides fetch error:', e)
    }
    return []
  },

  async addCareerGuide(guideData) {
    try {
      const res = await fetch(`${API_BASE_URL}/career-guides`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(guideData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Create career roadmap failed')
      window.dispatchEvent(new CustomEvent('vidyascope_admin_data_change'))
      return data.guide
    } catch (error) {
      console.error('addCareerGuide error:', error)
      throw error
    }
  },

  async updateCareerGuide(id, guideData) {
    try {
      const res = await fetch(`${API_BASE_URL}/career-guides/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(guideData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Update career roadmap failed')
      window.dispatchEvent(new CustomEvent('vidyascope_admin_data_change'))
      return data.guide
    } catch (error) {
      console.error('updateCareerGuide error:', error)
      throw error
    }
  },

  async deleteCareerGuide(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/career-guides/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Delete career roadmap failed')
      window.dispatchEvent(new CustomEvent('vidyascope_admin_data_change'))
      return true
    } catch (error) {
      console.error('deleteCareerGuide error:', error)
      throw error
    }
  },

  // 8. ENTRANCE EXAMS MANAGEMENT
  async getExams() {
    try {
      const res = await fetch(`${API_BASE_URL}/exams`, { headers: this.getHeaders() })
      const data = await res.json()
      if (res.ok && data.exams) {
        return data.exams.map(e => ({ ...e, id: e._id || e.slug }))
      }
    } catch (e) {
      console.warn('Exams fetch error:', e)
    }
    return []
  },

  async addExam(examData) {
    try {
      const res = await fetch(`${API_BASE_URL}/exams`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(examData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Create exam failed')
      window.dispatchEvent(new CustomEvent('vidyascope_admin_data_change'))
      return data.exam
    } catch (error) {
      console.error('addExam error:', error)
      throw error
    }
  },

  async updateExam(id, examData) {
    try {
      const res = await fetch(`${API_BASE_URL}/exams/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(examData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Update exam failed')
      window.dispatchEvent(new CustomEvent('vidyascope_admin_data_change'))
      return data.exam
    } catch (error) {
      console.error('updateExam error:', error)
      throw error
    }
  },

  async deleteExam(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/exams/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Delete exam failed')
      window.dispatchEvent(new CustomEvent('vidyascope_admin_data_change'))
      return true
    } catch (error) {
      console.error('deleteExam error:', error)
      throw error
    }
  },

  // 8. CONTACT INQUIRIES & STUDENT LEADS
  async getInquiries(params = {}) {
    try {
      const query = new URLSearchParams()
      if (params.status && params.status !== 'all') query.append('status', params.status)
      if (params.stream && params.stream !== 'all') query.append('stream', params.stream)
      if (params.search) query.append('search', params.search)

      const res = await fetch(`${API_BASE_URL}/inquiries?${query.toString()}`, {
        headers: this.getHeaders(),
      })
      const data = await res.json()
      if (res.ok && data.inquiries) {
        return {
          inquiries: data.inquiries.map(i => ({ ...i, id: i._id || i.id })),
          counts: data.counts || {},
        }
      }
    } catch (e) {
      console.warn('Inquiries fetch error:', e)
    }
    return { inquiries: [], counts: {} }
  },

  async updateInquiryStatus(id, updateData) {
    try {
      const res = await fetch(`${API_BASE_URL}/inquiries/${id}/status`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(updateData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Update inquiry status failed')
      window.dispatchEvent(new CustomEvent('vidyascope_admin_data_change'))
      return data.inquiry
    } catch (error) {
      console.error('updateInquiryStatus error:', error)
      throw error
    }
  },

  async deleteInquiry(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/inquiries/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Delete inquiry failed')
      window.dispatchEvent(new CustomEvent('vidyascope_admin_data_change'))
      return true
    } catch (error) {
      console.error('deleteInquiry error:', error)
      throw error
    }
  },

  // 9. LIVE INTEL TICKER MANAGEMENT
  async getLiveIntel() {
    try {
      const res = await fetch(`${API_BASE_URL}/live-intel`, {
        headers: this.getHeaders(),
      })
      const data = await res.json()
      if (res.ok && data.alerts) {
        return data.alerts.map(a => ({ ...a, id: a._id || a.id }))
      }
    } catch (e) {
      console.warn('Live intel fetch error:', e)
    }
    return []
  },

  async createLiveIntel(intelData) {
    try {
      const res = await fetch(`${API_BASE_URL}/live-intel`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(intelData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Create live intel failed')
      window.dispatchEvent(new CustomEvent('vidyascope_admin_data_change'))
      return data.alert
    } catch (error) {
      console.error('createLiveIntel error:', error)
      throw error
    }
  },

  async updateLiveIntel(id, intelData) {
    try {
      const res = await fetch(`${API_BASE_URL}/live-intel/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(intelData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Update live intel failed')
      window.dispatchEvent(new CustomEvent('vidyascope_admin_data_change'))
      return data.alert
    } catch (error) {
      console.error('updateLiveIntel error:', error)
      throw error
    }
  },

  async toggleLiveIntel(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/live-intel/${id}/toggle`, {
        method: 'PATCH',
        headers: this.getHeaders(),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Toggle live intel failed')
      window.dispatchEvent(new CustomEvent('vidyascope_admin_data_change'))
      return data.alert
    } catch (error) {
      console.error('toggleLiveIntel error:', error)
      throw error
    }
  },

  async deleteLiveIntel(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/live-intel/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Delete live intel failed')
      window.dispatchEvent(new CustomEvent('vidyascope_admin_data_change'))
      return true
    } catch (error) {
      console.error('deleteLiveIntel error:', error)
      throw error
    }
  },

  // 10. BLOGS & EDITORIAL CMS
  async getBlogs(params = {}) {
    try {
      const query = new URLSearchParams()
      if (params.category && params.category !== 'all') query.append('category', params.category)
      if (params.status && params.status !== 'all') query.append('status', params.status)
      if (params.search) query.append('search', params.search)

      const res = await fetch(`${API_BASE_URL}/blogs?${query.toString()}`, {
        headers: this.getHeaders(),
      })
      const data = await res.json()
      if (res.ok && data.blogs) {
        return data.blogs.map(b => ({ ...b, id: b._id || b.id }))
      }
    } catch (e) {
      console.warn('Blogs fetch error:', e)
    }
    return []
  },

  async createBlog(blogData) {
    try {
      const res = await fetch(`${API_BASE_URL}/blogs`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(blogData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Create blog failed')
      window.dispatchEvent(new CustomEvent('vidyascope_admin_data_change'))
      return data.blog
    } catch (error) {
      console.error('createBlog error:', error)
      throw error
    }
  },

  async updateBlog(id, blogData) {
    try {
      const res = await fetch(`${API_BASE_URL}/blogs/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(blogData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Update blog failed')
      window.dispatchEvent(new CustomEvent('vidyascope_admin_data_change'))
      return data.blog
    } catch (error) {
      console.error('updateBlog error:', error)
      throw error
    }
  },

  async deleteBlog(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/blogs/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Delete blog failed')
      window.dispatchEvent(new CustomEvent('vidyascope_admin_data_change'))
      return true
    } catch (error) {
      console.error('deleteBlog error:', error)
      throw error
    }
  },
}


