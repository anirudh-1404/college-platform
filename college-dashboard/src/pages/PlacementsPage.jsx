import React, { useState } from 'react'
import {
  PageHeader,
  SectionCard,
  SaveBar,
  StatusBadge,
} from '../components/common/UIComponents'
import { TrendingUp, Plus, Trash2, Building, ShieldCheck } from 'lucide-react'

const PlacementsPage = ({
  collegeData,
  onUpdatePlacements,
  onPreviewPublic,
}) => {
  const [formData, setFormData] = useState({ ...collegeData.placements })
  const [newRecruiter, setNewRecruiter] = useState('')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setHasUnsavedChanges(true)
    setSavedSuccess(false)
  }

  const handleAddRecruiter = (e) => {
    e.preventDefault()
    if (!newRecruiter.trim()) return
    setFormData((prev) => ({
      ...prev,
      topRecruiters: [...prev.topRecruiters, newRecruiter.trim()],
    }))
    setNewRecruiter('')
    setHasUnsavedChanges(true)
  }

  const handleRemoveRecruiter = (index) => {
    setFormData((prev) => ({
      ...prev,
      topRecruiters: prev.topRecruiters.filter((_, idx) => idx !== index),
    }))
    setHasUnsavedChanges(true)
  }

  const handleSave = () => {
    if (onUpdatePlacements) {
      onUpdatePlacements(formData)
    }
    setHasUnsavedChanges(false)
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  const handleReset = () => {
    setFormData({ ...collegeData.placements })
    setHasUnsavedChanges(false)
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Placements & Recruitment Records"
        subtitle="Manage verified average packages, highest domestic/international CTC offers, placement rates, and corporate hiring partners."
        badge={<StatusBadge status={collegeData.status} />}
        onSave={handleSave}
        onPreview={onPreviewPublic}
        savedSuccess={savedSuccess}
      />

      {/* 1. Core Package Metrics */}
      <SectionCard
        title="Key Salary Packages & Placement Statistics"
        description="Crucial metrics displayed across the college card header and placement analytics tab."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              Average Package (CTC) *
            </label>
            <input
              type="text"
              value={formData.averagePackage}
              onChange={(e) => handleChange('averagePackage', e.target.value)}
              placeholder="e.g. ₹23.5 LPA"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-bold text-emerald-600 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              Median Salary Package *
            </label>
            <input
              type="text"
              value={formData.medianPackage}
              onChange={(e) => handleChange('medianPackage', e.target.value)}
              placeholder="e.g. ₹19.2 LPA"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              Overall Placement Rate (%) *
            </label>
            <input
              type="text"
              value={formData.overallPlacementRate}
              onChange={(e) => handleChange('overallPlacementRate', e.target.value)}
              placeholder="e.g. 94.8%"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-bold text-brand-primary bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              Highest Domestic Package *
            </label>
            <input
              type="text"
              value={formData.highestDomesticPackage}
              onChange={(e) => handleChange('highestDomesticPackage', e.target.value)}
              placeholder="e.g. ₹1.68 Crore / Annum"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              Highest International Package
            </label>
            <input
              type="text"
              value={formData.highestInternationalPackage}
              onChange={(e) => handleChange('highestInternationalPackage', e.target.value)}
              placeholder="e.g. ₹2.80 Crore / Annum"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              Total Offers Extended
            </label>
            <input
              type="text"
              value={formData.totalOffers}
              onChange={(e) => handleChange('totalOffers', e.target.value)}
              placeholder="e.g. 1,850+ Offers"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
            />
          </div>
        </div>
      </SectionCard>

      {/* 2. Top Recruiting Companies */}
      <SectionCard
        title="Top Recruiting Companies & Hiring Partners"
        description="Logos and corporate names featured in the placement recruiters grid."
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {formData.topRecruiters.map((recruiter, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-text-primary text-xs font-semibold"
              >
                <span>{recruiter}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveRecruiter(idx)}
                  className="p-0.5 text-text-light hover:text-red-600 transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          <form onSubmit={handleAddRecruiter} className="flex gap-2 pt-1">
            <input
              type="text"
              value={newRecruiter}
              onChange={(e) => setNewRecruiter(e.target.value)}
              placeholder="Add recruiter name (e.g. Google, Microsoft, McKinsey, Goldman Sachs)..."
              className="flex-1 px-3.5 py-2 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
            />
            <button
              type="submit"
              disabled={!newRecruiter.trim()}
              className="btn btn-secondary btn-sm flex-shrink-0"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Recruiter</span>
            </button>
          </form>
        </div>
      </SectionCard>

      {/* Save Bar */}
      <SaveBar
        show={hasUnsavedChanges}
        onSave={handleSave}
        onReset={handleReset}
      />
    </div>
  )
}

export default PlacementsPage
