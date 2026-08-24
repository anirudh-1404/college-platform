import React, { useState } from 'react'
import {
  PageHeader,
  SectionCard,
  SaveBar,
  StatusBadge,
} from '../components/common/UIComponents'
import { Plus, Trash2, CheckCircle2 } from 'lucide-react'

const AboutCollegePage = ({
  collegeData,
  onUpdateAbout,
  onPreviewPublic,
}) => {
  const [formData, setFormData] = useState({ ...collegeData.about })
  const [newHighlight, setNewHighlight] = useState('')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setHasUnsavedChanges(true)
    setSavedSuccess(false)
  }

  const handleAddHighlight = (e) => {
    e.preventDefault()
    if (!newHighlight.trim()) return
    setFormData((prev) => ({
      ...prev,
      highlights: [...prev.highlights, newHighlight.trim()],
    }))
    setNewHighlight('')
    setHasUnsavedChanges(true)
  }

  const handleRemoveHighlight = (index) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, idx) => idx !== index),
    }))
    setHasUnsavedChanges(true)
  }

  const handleSave = () => {
    if (onUpdateAbout) {
      onUpdateAbout(formData)
    }
    setHasUnsavedChanges(false)
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  const handleReset = () => {
    setFormData({ ...collegeData.about })
    setHasUnsavedChanges(false)
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="About College & Institutional Narrative"
        subtitle="Manage the institutional overview, vision, mission, and principal's message shown on the public About tab."
        badge={<StatusBadge status={collegeData.status} />}
        onSave={handleSave}
        onPreview={onPreviewPublic}
        savedSuccess={savedSuccess}
      />

      {/* 1. Long Institutional Overview */}
      <SectionCard
        title="Institutional Narrative & Overview"
        description="Comprehensive overview paragraphs rendered on the public college detail Overview tab."
      >
        <div className="space-y-2">
          <label className="block text-xs font-bold text-text-primary uppercase tracking-wider">
            Detailed Overview Content *
          </label>
          <textarea
            rows={7}
            value={formData.overview}
            onChange={(e) => handleChange('overview', e.target.value)}
            className="w-full p-4 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs sm:text-sm font-normal leading-relaxed bg-white"
          />
          <span className="text-[11px] text-text-light block">
            Tip: Paragraph breaks will be formatted cleanly on the public site.
          </span>
        </div>
      </SectionCard>

      {/* 2. Vision & Mission Statements */}
      <SectionCard
        title="Vision & Mission Statements"
        description="Core institutional purpose and future technological / academic charter."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider">
              Institutional Vision *
            </label>
            <textarea
              rows={4}
              value={formData.vision}
              onChange={(e) => handleChange('vision', e.target.value)}
              className="w-full p-3 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider">
              Institutional Mission *
            </label>
            <textarea
              rows={4}
              value={formData.mission}
              onChange={(e) => handleChange('mission', e.target.value)}
              className="w-full p-3 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
            />
          </div>
        </div>
      </SectionCard>

      {/* 3. Director / Principal's Message */}
      <SectionCard
        title="Leadership / Director's Message"
        description="Personal message from the Director or Dean featured in the advisory section."
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                Leader's Full Name *
              </label>
              <input
                type="text"
                value={formData.directorName}
                onChange={(e) => handleChange('directorName', e.target.value)}
                placeholder="e.g. Prof. Shireesh B. Kedare"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                Designation / Title *
              </label>
              <input
                type="text"
                value={formData.directorTitle}
                onChange={(e) => handleChange('directorTitle', e.target.value)}
                placeholder="e.g. Director, IIT Bombay"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              Director's Public Message *
            </label>
            <textarea
              rows={3}
              value={formData.directorMessage}
              onChange={(e) => handleChange('directorMessage', e.target.value)}
              className="w-full p-3 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
            />
          </div>
        </div>
      </SectionCard>

      {/* 4. Key Highlights & USPs */}
      <SectionCard
        title="Key Highlights & Institutional USPs"
        description="Bullet highlights displayed in the quick overview summary card."
      >
        <div className="space-y-3">
          <div className="space-y-2">
            {formData.highlights.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-border-color text-xs"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span className="text-text-primary font-medium">{item}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveHighlight(idx)}
                  className="p-1 text-text-light hover:text-red-600 transition-colors cursor-pointer"
                  title="Remove highlight"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add New Highlight Input */}
          <form onSubmit={handleAddHighlight} className="flex gap-2 pt-1">
            <input
              type="text"
              value={newHighlight}
              onChange={(e) => setNewHighlight(e.target.value)}
              placeholder="e.g. Established state-of-the-art AI supercomputing laboratory funded by DST..."
              className="flex-1 px-3.5 py-2 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
            />
            <button
              type="submit"
              disabled={!newHighlight.trim()}
              className="btn btn-secondary btn-sm flex-shrink-0"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Bullet</span>
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

export default AboutCollegePage
