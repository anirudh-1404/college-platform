/**
 * VidyaScope College Profile Database Service (Mock API & State Store)
 * Manages Stage 2: 10-step Onboarding data, Drafts, Profile Lifecycle & Admin Approval.
 */

import { DEFAULT_COLLEGE_DATA } from './collegeModel'

const STORAGE_KEY_COLLEGE_DATA = 'vidyascope_college_data'

export const collegeService = {
  // Load college profile data from persistent storage
  getCollegeData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_COLLEGE_DATA)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (e) {
      console.error('Failed to parse college data from storage', e)
    }
    // Seed default data
    localStorage.setItem(STORAGE_KEY_COLLEGE_DATA, JSON.stringify(DEFAULT_COLLEGE_DATA))
    return DEFAULT_COLLEGE_DATA
  },

  // Save complete or partial college data
  saveCollegeData(updatedData) {
    try {
      const current = this.getCollegeData()
      const merged = {
        ...current,
        ...updatedData,
        lastUpdated: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      }
      localStorage.setItem(STORAGE_KEY_COLLEGE_DATA, JSON.stringify(merged))
      window.dispatchEvent(new CustomEvent('vidyascope_college_data_change', { detail: merged }))
      return merged
    } catch (e) {
      console.error('Failed to save college data', e)
      return updatedData
    }
  },

  // Update specific slice (Step-by-Step)
  updateSlice(key, value) {
    const current = this.getCollegeData()
    return this.saveCollegeData({
      ...current,
      [key]: value,
    })
  },

  // Calculate completion percentage dynamically across all 10 steps
  calculateCompletion(data) {
    let completedSteps = 0
    const totalSteps = 10

    // Step 1: Basic Info
    if (data.name && data.shortName && data.establishmentYear && data.ownership) completedSteps++
    // Step 2: Location & Contact
    if (data.city && data.state && data.address && data.admissionEmail && data.helplinePhone) completedSteps++
    // Step 3: Courses
    if (data.coursesOffered && data.coursesOffered.length > 0) completedSteps++
    // Step 4: Admissions
    if (data.admissionStatus && data.examAccepted && data.examAccepted.length > 0) completedSteps++
    // Step 5: Cutoffs
    if (data.admissionCutoffs && data.admissionCutoffs.length > 0) completedSteps++
    // Step 6: Placements
    if (data.placements && data.placements.avgPackage && data.placements.placementRate) completedSteps++
    // Step 7: Rankings
    if (data.nirfRank || (data.rankings && data.rankings.length > 0)) completedSteps++
    // Step 8: Facilities & Hidden Costs
    if (data.facilities && data.facilities.length > 0 && data.hiddenCosts) completedSteps++
    // Step 9: Gallery
    if (data.gallery && data.gallery.length > 0) completedSteps++
    // Step 10: Review (always counts if prior steps filled)
    if (completedSteps >= 8) completedSteps++

    return Math.min(100, Math.round((completedSteps / totalSteps) * 100))
  },

  // Send for approval action (Moves profile to 'under_review')
  async submitForApproval() {
    await new Promise((resolve) => setTimeout(resolve, 500))
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
    return this.saveCollegeData(updated)
  },

  // Admin Simulator Actions for Stage 2: Profile Review
  adminApproveProfile() {
    const current = this.getCollegeData()
    const updated = {
      ...current,
      profileStatus: 'published',
      approvedAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    }
    return this.saveCollegeData(updated)
  },

  adminRequestChanges(comment = 'Please provide official updated fee structure for M.Tech Data Science and add recent NIRF ranking details.') {
    const current = this.getCollegeData()
    const feedbackList = current.adminFeedback || []
    const newFeedback = {
      id: `fb_${Date.now()}`,
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      comment,
      requestedBy: 'VidyaScope Quality & Verification Team',
      resolved: false,
    }

    const updated = {
      ...current,
      profileStatus: 'changes_requested',
      adminFeedback: [newFeedback, ...feedbackList],
    }
    return this.saveCollegeData(updated)
  },

  adminRejectProfile(reason = 'Profile submission contains unverifiable data.') {
    const current = this.getCollegeData()
    const updated = {
      ...current,
      profileStatus: 'draft',
      adminFeedback: [
        {
          id: `fb_${Date.now()}`,
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          comment: `Submission Rejected: ${reason}`,
          requestedBy: 'VidyaScope Quality & Verification Team',
          resolved: false,
        },
        ...(current.adminFeedback || []),
      ],
    }
    return this.saveCollegeData(updated)
  },

  adminSetProfileDraft() {
    const current = this.getCollegeData()
    const updated = {
      ...current,
      profileStatus: 'draft',
    }
    return this.saveCollegeData(updated)
  },

  // Reset data to initial state
  resetCollegeData() {
    localStorage.setItem(STORAGE_KEY_COLLEGE_DATA, JSON.stringify(DEFAULT_COLLEGE_DATA))
    return DEFAULT_COLLEGE_DATA
  },
}
