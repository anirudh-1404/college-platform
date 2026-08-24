import React, { useState } from 'react'
import {
  PageHeader,
  SectionCard,
  SaveBar,
  StatusBadge,
} from '../components/common/UIComponents'
import { Plus, Trash2, CheckCircle2, Compass, Award } from 'lucide-react'

const AdmissionsPage = ({
  collegeData,
  onUpdateAdmissions,
  onPreviewPublic,
}) => {
  const [formData, setFormData] = useState({ ...collegeData.admissions })
  const [newExam, setNewExam] = useState('')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setHasUnsavedChanges(true)
    setSavedSuccess(false)
  }

  const handleAddExam = (e) => {
    e.preventDefault()
    if (!newExam.trim()) return
    setFormData((prev) => ({
      ...prev,
      acceptedExams: [...prev.acceptedExams, newExam.trim()],
    }))
    setNewExam('')
    setHasUnsavedChanges(true)
  }

  const handleRemoveExam = (index) => {
    setFormData((prev) => ({
      ...prev,
      acceptedExams: prev.acceptedExams.filter((_, idx) => idx !== index),
    }))
    setHasUnsavedChanges(true)
  }

  const handleStepChange = (index, field, value) => {
    const updatedSteps = formData.processSteps.map((step, idx) =>
      idx === index ? { ...step, [field]: value } : step
    )
    setFormData((prev) => ({ ...prev, processSteps: updatedSteps }))
    setHasUnsavedChanges(true)
  }

  const handleSave = () => {
    if (onUpdateAdmissions) {
      onUpdateAdmissions(formData)
    }
    setHasUnsavedChanges(false)
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  const handleReset = () => {
    setFormData({ ...collegeData.admissions })
    setHasUnsavedChanges(false)
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Admissions & Eligibility Process"
        subtitle="Manage the active admission status, entrance test cutoffs, application timelines, and counseling instructions."
        badge={<StatusBadge status={collegeData.status} />}
        onSave={handleSave}
        onPreview={onPreviewPublic}
        savedSuccess={savedSuccess}
      />

      {/* 1. Admission Status & Timeline */}
      <SectionCard
        title="Session & Application Deadlines"
        description="Public banner indicators shown at the top of the college profile."
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              Admission Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
            >
              <option value="Admissions Open (Session 2026-27)">Admissions Open (Session 2026-27)</option>
              <option value="JoSAA Counseling Round 2 Ongoing">JoSAA Counseling Round 2 Ongoing</option>
              <option value="Admissions Closed for 2025-26">Admissions Closed for 2025-26</option>
              <option value="Applications Opening Soon">Applications Opening Soon</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              Application Start Date *
            </label>
            <input
              type="text"
              value={formData.applicationStart}
              onChange={(e) => handleChange('applicationStart', e.target.value)}
              placeholder="e.g. 15 April 2026"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              Application Closing Date *
            </label>
            <input
              type="text"
              value={formData.applicationEnd}
              onChange={(e) => handleChange('applicationEnd', e.target.value)}
              placeholder="e.g. 30 June 2026"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
            />
          </div>
        </div>
      </SectionCard>

      {/* 2. Entrance Exams Accepted */}
      <SectionCard
        title="Qualifying Entrance Examinations"
        description="National and institutional entrance gateways accepted for admission shortlisting."
      >
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {formData.acceptedExams.map((exam, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-100 text-brand-primary text-xs font-bold"
              >
                <span>{exam}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveExam(idx)}
                  className="p-0.5 hover:text-red-600 transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          <form onSubmit={handleAddExam} className="flex gap-2 pt-1">
            <input
              type="text"
              value={newExam}
              onChange={(e) => setNewExam(e.target.value)}
              placeholder="Add entrance exam (e.g. JEE Advanced, GATE, CAT)..."
              className="flex-1 px-3.5 py-2 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
            />
            <button
              type="submit"
              disabled={!newExam.trim()}
              className="btn btn-secondary btn-sm flex-shrink-0"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Exam</span>
            </button>
          </form>
        </div>
      </SectionCard>

      {/* 3. General Eligibility Criteria */}
      <SectionCard
        title="Eligibility Requirements Overview"
        description="Official eligibility prerequisites shown on public admissions tab."
      >
        <textarea
          rows={4}
          value={formData.eligibilityOverview}
          onChange={(e) => handleChange('eligibilityOverview', e.target.value)}
          className="w-full p-3.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white leading-relaxed"
        />
      </SectionCard>

      {/* 4. 4-Step Admission Process */}
      <SectionCard
        title="Step-by-Step Admission & Counseling Flow"
        description="Sequential student journey steps rendered on public page."
      >
        <div className="space-y-3">
          {formData.processSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-border-color bg-slate-50/50 space-y-2"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={step.title}
                  onChange={(e) => handleStepChange(idx, 'title', e.target.value)}
                  placeholder="Step Title (e.g. Appear for Entrance Exam)"
                  className="flex-1 px-3 py-1.5 rounded-lg border border-border-color focus:border-brand-primary outline-none text-xs font-bold bg-white"
                />
              </div>
              <textarea
                rows={2}
                value={step.desc}
                onChange={(e) => handleStepChange(idx, 'desc', e.target.value)}
                placeholder="Step Description..."
                className="w-full px-3 py-1.5 rounded-lg border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
              />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* 5. External Admission CTA */}
      <SectionCard
        title="Public Admission CTA Link"
        description="Configure the primary apply button that directs students to your official JoSAA / Institutional portal."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              CTA Button Label *
            </label>
            <input
              type="text"
              value={formData.ctaButtonText}
              onChange={(e) => handleChange('ctaButtonText', e.target.value)}
              placeholder="e.g. Apply Through JoSAA Portal"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              Target Web URL *
            </label>
            <input
              type="url"
              value={formData.ctaUrl}
              onChange={(e) => handleChange('ctaUrl', e.target.value)}
              placeholder="https://josaa.nic.in"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
            />
          </div>
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

export default AdmissionsPage
