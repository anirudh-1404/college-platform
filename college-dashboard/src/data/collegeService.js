/**
 * VidyaScope College Profile Service (Connected to Live REST Backend)
 */

import { DEFAULT_COLLEGE_DATA } from './collegeModel'
import { authService } from './authService'

const API_BASE_URL =
  import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/college`
    : (import.meta.env.PROD
        ? 'https://vidyascope-backend.onrender.com/api/college'
        : 'http://localhost:8080/api/college')

const STORAGE_KEY_COLLEGE_DATA = 'vidyascope_college_data'

export const collegeService = {
  // Normalize data ensuring both top-level and nested locationContact fields are populated
  normalizeCollegeData(data) {
    const user = authService.getAuthState()?.user
    const registeredName = user?.collegeName || ''
    const base = {
      ...DEFAULT_COLLEGE_DATA,
      name: registeredName,
    }
    if (!data) return base

    const lc = data.locationContact || {}
    const city = data.city || lc.city || ''
    const state = data.state || lc.state || ''
    const address = data.address || lc.address || ''
    const pincode = data.pincode || lc.pincode || ''
    const website = data.website || lc.websiteUrl || ''
    const admissionEmail = data.admissionEmail || lc.admissionEmail || ''
    const helplinePhone = data.helplinePhone || lc.helplineNumber || ''
    const tollFreeHelpline = data.tollFreeHelpline || lc.alternatePhone || ''
    const googleMapCoordinates = data.googleMapCoordinates || lc.mapCoordinates || ''

    return {
      ...base,
      ...data,
      name: data.name || registeredName,
      address,
      city,
      state,
      pincode,
      website,
      admissionEmail,
      helplinePhone,
      tollFreeHelpline,
      googleMapCoordinates,
      location: data.location || (city && state ? `${city}, ${state}` : ''),
      locationContact: {
        address,
        city,
        state,
        pincode,
        websiteUrl: website,
        admissionEmail,
        helplineNumber: helplinePhone,
        alternatePhone: tollFreeHelpline,
        mapCoordinates: googleMapCoordinates,
        ...lc,
      },
    }
  },

  // Load college profile data from live backend
  async fetchCollegeData() {
    const token = authService.getToken()
    try {
      const res = await fetch(`${API_BASE_URL}/profile`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
      const data = await res.json()
      if (res.ok && data.college) {
        const normalized = this.normalizeCollegeData(data.college)
        localStorage.setItem(STORAGE_KEY_COLLEGE_DATA, JSON.stringify(normalized))
        return normalized
      }
    } catch (e) {
      console.warn('Backend fetch failed, using local cache', e)
    }

    return this.getCollegeData()
  },

  // Read local cache
  getCollegeData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_COLLEGE_DATA)
      if (stored) {
        const parsed = JSON.parse(stored)
        const user = authService.getAuthState()?.user
        // Auto-purge stale mock IIT Bombay cache if user registered under a different college
        if (user?.collegeName && parsed.name === 'Indian Institute of Technology Bombay' && user.collegeName !== 'Indian Institute of Technology Bombay') {
          localStorage.removeItem(STORAGE_KEY_COLLEGE_DATA)
        } else {
          return this.normalizeCollegeData(parsed)
        }
      }
    } catch (e) {
      console.error('Failed to parse college data from storage', e)
    }
    const user = authService.getAuthState()?.user
    return {
      ...DEFAULT_COLLEGE_DATA,
      name: user?.collegeName || '',
    }
  },

  // Save complete or partial college data to live backend
  async saveCollegeData(updatedData) {
    const token = authService.getToken()
    const payload = {
      ...updatedData,
      locationContact: {
        address: updatedData.address || updatedData.locationContact?.address || '',
        city: updatedData.city || updatedData.locationContact?.city || '',
        state: updatedData.state || updatedData.locationContact?.state || '',
        pincode: updatedData.pincode || updatedData.locationContact?.pincode || '',
        admissionEmail: updatedData.admissionEmail || updatedData.locationContact?.admissionEmail || '',
        helplineNumber: updatedData.helplinePhone || updatedData.locationContact?.helplineNumber || '',
        alternatePhone: updatedData.tollFreeHelpline || updatedData.locationContact?.alternatePhone || '',
        websiteUrl: updatedData.website || updatedData.locationContact?.websiteUrl || '',
        mapCoordinates: updatedData.googleMapCoordinates || updatedData.locationContact?.mapCoordinates || '',
        ...(updatedData.locationContact || {}),
      },
    }

    try {
      const res = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (res.ok && data.college) {
        const normalized = this.normalizeCollegeData(data.college)
        localStorage.setItem(STORAGE_KEY_COLLEGE_DATA, JSON.stringify(normalized))
        window.dispatchEvent(new CustomEvent('vidyascope_college_data_change', { detail: normalized }))
        return normalized
      }
    } catch (e) {
      console.warn('Backend save failed, saving to local cache', e)
    }

    // Local fallback
    const current = this.getCollegeData()
    const merged = this.normalizeCollegeData({ ...current, ...updatedData })
    localStorage.setItem(STORAGE_KEY_COLLEGE_DATA, JSON.stringify(merged))
    window.dispatchEvent(new CustomEvent('vidyascope_college_data_change', { detail: merged }))
    return merged
  },

  // Update specific slice (Step-by-Step)
  async updateSlice(key, value) {
    const current = this.getCollegeData()
    return await this.saveCollegeData({
      ...current,
      [key]: value,
    })
  },

  // Calculate completion percentage dynamically across all 10 steps
  calculateCompletion(data) {
    if (!data) return 0
    let score = 0
    const totalChecks = 10

    if (data.name && data.shortName && data.description) score += 1
    if (data.locationContact?.city && data.locationContact?.admissionEmail) score += 1
    if (data.coursesOffered?.length > 0) score += 1
    if (data.admissions?.examAccepted?.length > 0) score += 1
    if (data.admissionCutoffs?.length > 0) score += 1
    if (data.placements?.avgPackage) score += 1
    if (data.rankings?.nirfRank) score += 1
    if (data.facilities?.length > 0) score += 1
    if (data.gallery?.length > 0) score += 1
    if (data.hiddenCosts?.tuitionFeePerYear) score += 1

    return Math.round((score / totalChecks) * 100)
  },

  // Submit complete 10-step profile to Admin for editorial review
  async submitForReview() {
    const token = authService.getToken()
    try {
      const res = await fetch(`${API_BASE_URL}/submit-review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
      const data = await res.json()
      if (res.ok && data.college) {
        localStorage.setItem(STORAGE_KEY_COLLEGE_DATA, JSON.stringify(data.college))
        window.dispatchEvent(new CustomEvent('vidyascope_college_data_change', { detail: data.college }))
        return { success: true, college: data.college }
      }
    } catch (e) {
      console.warn('Backend submit review failed, falling back', e)
    }

    const current = this.getCollegeData()
    const updated = {
      ...current,
      profileStatus: 'under_review',
      submittedAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    }
    return { success: true, college: this.saveCollegeData(updated) }
  },

  // Fetch student inquiries specifically for this college
  async getCollegeLeads() {
    const token = authService.getToken()
    try {
      const res = await fetch(`${API_BASE_URL}/leads`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
      const data = await res.json()
      if (res.ok && data.leads) {
        return data.leads
      }
    } catch (e) {
      console.warn('Backend leads fetch failed:', e)
    }
    return []
  },

  // Upload an image file to backend Cloudinary pipeline
  async uploadImage(file, folder = 'vidyascope/colleges') {
    const token = authService.getToken()
    const uploadEndpoint = import.meta.env.VITE_API_URL
      ? `${import.meta.env.VITE_API_URL}/upload`
      : (import.meta.env.PROD
          ? 'https://vidyascope-backend.onrender.com/api/upload'
          : 'http://localhost:8080/api/upload')

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
}
