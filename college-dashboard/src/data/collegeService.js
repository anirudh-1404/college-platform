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
  // Normalize data ensuring both top-level and nested locationContact and admissions fields are populated
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

    const admissions = data.admissions || {}
    const admissionStatus = data.admissionStatus || admissions.status || base.admissionStatus || 'Admissions Open'
    const academicYear = data.academicYear || base.academicYear || '2026 - 2027'
    const applicationStartDate = data.applicationStartDate || admissions.applicationStart || ''
    const applicationEndDate = data.applicationEndDate || admissions.applicationEnd || ''
    const admissionPortalUrl = data.admissionPortalUrl || ''
    const examAccepted = data.examAccepted || admissions.examAccepted || []
    const admissionOverview = data.admissionOverview || ''
    
    // Normalize admission process steps (handle both structured objects and string arrays)
    let admissionProcessSteps = []
    if (Array.isArray(data.admissionProcessSteps) && data.admissionProcessSteps.length > 0) {
      admissionProcessSteps = data.admissionProcessSteps
    } else if (Array.isArray(admissions.admissionSteps) && admissions.admissionSteps.length > 0) {
      admissionProcessSteps = admissions.admissionSteps.map((stepStr, idx) => {
        if (typeof stepStr === 'object' && stepStr !== null) return stepStr
        const colonIdx = String(stepStr).indexOf(':')
        if (colonIdx !== -1) {
          return {
            step: String(idx + 1),
            title: String(stepStr).substring(0, colonIdx).trim(),
            desc: String(stepStr).substring(colonIdx + 1).trim(),
          }
        }
        return {
          step: String(idx + 1),
          title: `Step ${idx + 1}`,
          desc: String(stepStr).trim(),
        }
      })
    } else if (Array.isArray(base.admissionProcessSteps)) {
      admissionProcessSteps = base.admissionProcessSteps
    }

    const hostelDetails = { ...base.hostelDetails, ...(data.hostelDetails || {}) }
    const hiddenCosts = { ...base.hiddenCosts, ...(data.hiddenCosts || {}) }
    const snapshot = { ...base.snapshot, ...(data.snapshot || {}) }
    const placements = { ...base.placements, ...(data.placements || {}) }

    // Safe Rankings Normalization: handle both object and array schemas seamlessly
    const rankingsObj = (data.rankings && typeof data.rankings === 'object' && !Array.isArray(data.rankings)) ? data.rankings : {}
    const nirfRank = (data.nirfRank !== undefined && data.nirfRank !== '')
      ? data.nirfRank
      : (rankingsObj.nirfRank !== undefined ? rankingsObj.nirfRank : base.nirfRank || '')
    const nirfCategory = data.nirfCategory || rankingsObj.nirfCategory || base.nirfCategory || 'Engineering'
    const naacGrade = data.naacGrade || rankingsObj.naacGrade || base.naacGrade || 'A++ (3.88 CGPA)'
    const affiliation = data.affiliation || base.affiliation || ''
    const university = data.university || base.university || ''
    const accreditation = data.accreditation || base.accreditation || ''
    const seats = data.seats || base.seats || ''
    const tags = Array.isArray(data.tags) ? data.tags : (Array.isArray(base.tags) ? base.tags : [])

    let additionalRankings = []
    if (Array.isArray(data.additionalRankings) && data.additionalRankings.length > 0) {
      additionalRankings = data.additionalRankings
    } else if (Array.isArray(data.rankings) && data.rankings.length > 0) {
      additionalRankings = data.rankings
    } else if (Array.isArray(rankingsObj.otherRankings) && rankingsObj.otherRankings.length > 0) {
      additionalRankings = rankingsObj.otherRankings.map((item, idx) => {
        if (typeof item === 'object' && item !== null) return item
        const parts = String(item).split(':')
        const agency = parts[0]?.trim() || String(item)
        let rest = parts.slice(1).join(':').trim()
        let category = 'General'
        const catMatch = rest.match(/\(([^)]+)\)$/)
        if (catMatch) {
          category = catMatch[1]
          rest = rest.replace(/\s*\([^)]+\)$/, '').trim()
        }
        return {
          id: `rank_${idx}_${Date.now()}`,
          agency,
          year: '2025',
          rank: rest || '',
          category,
        }
      })
    } else if (Array.isArray(base.additionalRankings)) {
      additionalRankings = base.additionalRankings
    }

    const safeRankings = {
      ...rankingsObj,
      nirfRank,
      nirfCategory,
      nirfYear: data.nirfYear || rankingsObj.nirfYear || 2025,
      naacGrade,
      naacCgpa: data.naacCgpa || rankingsObj.naacCgpa || '3.88',
      otherRankings: additionalRankings.map((r) => {
        if (typeof r === 'string') return r
        return `${r.agency || ''}: ${r.rank || ''}${r.category ? ` (${r.category})` : ''}`.trim()
      }).filter(Boolean),
    }

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
      admissionStatus,
      academicYear,
      applicationStartDate,
      applicationEndDate,
      admissionPortalUrl,
      examAccepted,
      admissionOverview,
      admissionProcessSteps,
      hostelDetails,
      hiddenCosts,
      snapshot,
      placements,
      nirfRank,
      nirfCategory,
      naacGrade,
      affiliation,
      university,
      accreditation,
      seats,
      tags,
      rankings: safeRankings,
      additionalRankings,
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
        const current = this.getCollegeData()
        const normalized = this.normalizeCollegeData({ ...current, ...data.college })
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
    const current = this.getCollegeData()
    const fullData = { ...current, ...updatedData }

    // Resolve additionalRankings with full fallback preservation
    let additionalRankings = []
    if (Array.isArray(fullData.additionalRankings) && fullData.additionalRankings.length > 0) {
      additionalRankings = fullData.additionalRankings
    } else if (Array.isArray(fullData.rankings) && fullData.rankings.length > 0) {
      additionalRankings = fullData.rankings
    } else if (Array.isArray(fullData.rankings?.otherRankings) && fullData.rankings.otherRankings.length > 0) {
      additionalRankings = fullData.rankings.otherRankings.map((item, idx) => {
        if (typeof item === 'object' && item !== null) return item
        const parts = String(item).split(':')
        const agency = parts[0]?.trim() || String(item)
        let rest = parts.slice(1).join(':').trim()
        let category = 'General'
        const catMatch = rest.match(/\(([^)]+)\)$/)
        if (catMatch) {
          category = catMatch[1]
          rest = rest.replace(/\s*\([^)]+\)$/, '').trim()
        }
        return {
          id: `rank_${idx}_${Date.now()}`,
          agency,
          year: '2025',
          rank: rest || '',
          category,
        }
      })
    } else if (Array.isArray(current.additionalRankings) && current.additionalRankings.length > 0) {
      additionalRankings = current.additionalRankings
    }

    const existingRankingsObj = (typeof fullData.rankings === 'object' && !Array.isArray(fullData.rankings))
      ? fullData.rankings
      : (typeof current.rankings === 'object' && !Array.isArray(current.rankings) ? current.rankings : {})

    const nirfRank = (fullData.nirfRank !== undefined && fullData.nirfRank !== '')
      ? Number(fullData.nirfRank)
      : (existingRankingsObj.nirfRank !== undefined ? Number(existingRankingsObj.nirfRank) : 3)

    const existingOther = Array.isArray(existingRankingsObj.otherRankings) ? existingRankingsObj.otherRankings : []
    const otherRankings = additionalRankings.length > 0
      ? additionalRankings.map((r) => {
          if (typeof r === 'string') return r
          return `${r.agency || ''}: ${r.rank || ''}${r.category ? ` (${r.category})` : ''}`.trim()
        }).filter(Boolean)
      : existingOther

    // Resolve admissionProcessSteps with full fallback preservation
    let admissionProcessSteps = Array.isArray(fullData.admissionProcessSteps) ? fullData.admissionProcessSteps : []
    if (admissionProcessSteps.length === 0 && Array.isArray(fullData.admissions?.admissionSteps)) {
      admissionProcessSteps = fullData.admissions.admissionSteps.map((s, idx) => {
        if (typeof s === 'object' && s !== null) return s
        const colonIdx = String(s).indexOf(':')
        return {
          step: String(idx + 1),
          title: colonIdx !== -1 ? String(s).substring(0, colonIdx).trim() : `Step ${idx + 1}`,
          desc: colonIdx !== -1 ? String(s).substring(colonIdx + 1).trim() : String(s).trim(),
        }
      })
    }

    const payload = {
      ...fullData,
      nirfRank,
      nirfCategory: fullData.nirfCategory || existingRankingsObj.nirfCategory || 'Engineering',
      naacGrade: fullData.naacGrade || existingRankingsObj.naacGrade || 'A++ (3.88 CGPA)',
      affiliation: fullData.affiliation || current.affiliation || '',
      university: fullData.university || current.university || '',
      accreditation: fullData.accreditation || current.accreditation || '',
      seats: fullData.seats || current.seats || '',
      tags: Array.isArray(fullData.tags) ? fullData.tags : (Array.isArray(current.tags) ? current.tags : []),
      additionalRankings,
      rankings: {
        ...existingRankingsObj,
        nirfRank,
        nirfCategory: fullData.nirfCategory || existingRankingsObj.nirfCategory || 'Engineering',
        nirfYear: fullData.nirfYear || existingRankingsObj.nirfYear || 2025,
        naacGrade: fullData.naacGrade || existingRankingsObj.naacGrade || 'A++ (3.88 CGPA)',
        naacCgpa: fullData.naacCgpa || existingRankingsObj.naacCgpa || '3.88',
        otherRankings,
      },
      admissionStatus: fullData.admissionStatus || 'Admissions Open',
      academicYear: fullData.academicYear || '2026 - 2027',
      applicationStartDate: fullData.applicationStartDate || '',
      applicationEndDate: fullData.applicationEndDate || '',
      admissionPortalUrl: fullData.admissionPortalUrl || '',
      examAccepted: fullData.examAccepted || [],
      admissionOverview: fullData.admissionOverview || '',
      admissionProcessSteps,
      admissions: {
        status: fullData.admissionStatus || 'Admissions Open',
        applicationStart: fullData.applicationStartDate || '',
        applicationEnd: fullData.applicationEndDate || '',
        examAccepted: fullData.examAccepted || [],
        admissionSteps: admissionProcessSteps.map(
          (s) => (s.title && s.desc ? `${s.title}: ${s.desc}` : s.title || s.desc || '')
        ).filter(Boolean),
      },
      hostelDetails: fullData.hostelDetails || {},
      hiddenCosts: fullData.hiddenCosts || {},
      snapshot: fullData.snapshot || {},
      locationContact: {
        address: fullData.address || fullData.locationContact?.address || '',
        city: fullData.city || fullData.locationContact?.city || '',
        state: fullData.state || fullData.locationContact?.state || '',
        pincode: fullData.pincode || fullData.locationContact?.pincode || '',
        admissionEmail: fullData.admissionEmail || fullData.locationContact?.admissionEmail || '',
        helplineNumber: fullData.helplinePhone || fullData.locationContact?.helplineNumber || '',
        alternatePhone: fullData.tollFreeHelpline || fullData.locationContact?.alternatePhone || '',
        websiteUrl: fullData.website || fullData.locationContact?.websiteUrl || '',
        mapCoordinates: fullData.googleMapCoordinates || fullData.locationContact?.mapCoordinates || '',
        ...(fullData.locationContact || {}),
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
        // Merge returned college with fullData to guarantee zero data loss
        const normalized = this.normalizeCollegeData({ ...fullData, ...data.college })
        localStorage.setItem(STORAGE_KEY_COLLEGE_DATA, JSON.stringify(normalized))
        window.dispatchEvent(new CustomEvent('vidyascope_college_data_change', { detail: normalized }))
        return normalized
      }
    } catch (e) {
      console.warn('Backend save failed, saving to local cache', e)
    }

    // Local fallback
    const merged = this.normalizeCollegeData(fullData)
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
    if (data.admissions?.examAccepted?.length > 0 || data.examAccepted?.length > 0) score += 1
    if (data.admissionCutoffs?.length > 0) score += 1
    if (data.placements?.avgPackage || data.avgPackage) score += 1
    if (data.nirfRank || data.rankings?.nirfRank) score += 1
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
