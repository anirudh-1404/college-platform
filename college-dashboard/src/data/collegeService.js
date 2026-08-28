/**
 * VidyaScope College Profile Service (Connected to Live REST Backend)
 */

import { DEFAULT_COLLEGE_DATA } from './collegeModel'
import { authService } from './authService'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/college'
const STORAGE_KEY_COLLEGE_DATA = 'vidyascope_college_data'

export const collegeService = {
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
        localStorage.setItem(STORAGE_KEY_COLLEGE_DATA, JSON.stringify(data.college))
        return data.college
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
        return JSON.parse(stored)
      }
    } catch (e) {
      console.error('Failed to parse college data from storage', e)
    }
    return DEFAULT_COLLEGE_DATA
  },

  // Save complete or partial college data to live backend
  async saveCollegeData(updatedData) {
    const token = authService.getToken()
    try {
      const res = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(updatedData),
      })
      const data = await res.json()
      if (res.ok && data.college) {
        localStorage.setItem(STORAGE_KEY_COLLEGE_DATA, JSON.stringify(data.college))
        window.dispatchEvent(new CustomEvent('vidyascope_college_data_change', { detail: data.college }))
        return data.college
      }
    } catch (e) {
      console.warn('Backend save failed, saving to local cache', e)
    }

    // Local fallback
    const current = this.getCollegeData()
    const merged = { ...current, ...updatedData }
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
}
