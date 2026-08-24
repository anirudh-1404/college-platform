import React, { useState } from 'react'
import {
  PageHeader,
  SectionCard,
  UploadCard,
  SaveBar,
  StatusBadge,
} from '../components/common/UIComponents'
import { Building2, Globe, MapPin, Award, Check } from 'lucide-react'

const CollegeProfilePage = ({
  collegeData,
  onUpdateProfile,
  onPreviewPublic,
}) => {
  const [formData, setFormData] = useState({ ...collegeData.profile })
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setHasUnsavedChanges(true)
    setSavedSuccess(false)
  }

  const handleSave = () => {
    if (onUpdateProfile) {
      onUpdateProfile(formData)
    }
    setHasUnsavedChanges(false)
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  const handleReset = () => {
    setFormData({ ...collegeData.profile })
    setHasUnsavedChanges(false)
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="College Profile & Identity"
        subtitle="Manage the primary institutional identity, NIRF rankings, and location shown in the public hero header."
        badge={<StatusBadge status={collegeData.status} />}
        onSave={handleSave}
        onPreview={onPreviewPublic}
        savedSuccess={savedSuccess}
      />

      {/* 1. Visual Branding Assets */}
      <SectionCard
        title="Visual Assets & Brand Identity"
        description="Official institutional logo and panoramic campus cover image."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UploadCard
            label="Institutional Crest / Logo"
            recommendation="Square PNG / SVG, min 400x400px (Transparent background preferred)"
            currentImage={formData.logo}
            aspectRatio="aspect-square"
          />

          <UploadCard
            label="Campus Panoramic Cover Banner"
            recommendation="Wide 16:9 or 21:9 image, min 1920x800px (High resolution)"
            currentImage={formData.coverImage}
            aspectRatio="aspect-video"
          />
        </div>
      </SectionCard>

      {/* 2. Core Institutional Details */}
      <SectionCard
        title="Basic Institutional Information"
        description="Public names, establishment year, and institutional classification."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              Full Official Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              Short Name / Abbreviation *
            </label>
            <input
              type="text"
              value={formData.shortName}
              onChange={(e) => handleChange('shortName', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              Established Year *
            </label>
            <input
              type="number"
              value={formData.establishedYear}
              onChange={(e) => handleChange('establishedYear', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              Ownership Type *
            </label>
            <select
              value={formData.ownership}
              onChange={(e) => handleChange('ownership', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
            >
              <option value="Public / Government">Public / Government</option>
              <option value="Private Deemed">Private Deemed University</option>
              <option value="Autonomous Private">Autonomous Private</option>
              <option value="State Government">State Government University</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              Campus Area
            </label>
            <input
              type="text"
              value={formData.campusArea}
              onChange={(e) => handleChange('campusArea', e.target.value)}
              placeholder="e.g. 550 Acres"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
            />
          </div>
        </div>

        <div className="pt-2">
          <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
            Short Summary / One-Liner Description *
          </label>
          <textarea
            rows={3}
            value={formData.shortDescription}
            onChange={(e) => handleChange('shortDescription', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
          />
        </div>
      </SectionCard>

      {/* 3. Accreditations & National Ranks */}
      <SectionCard
        title="Accreditations & Government Rankings"
        description="National recognition tags displayed on public cards and filter badges."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              NIRF Rank (Numerical) *
            </label>
            <input
              type="text"
              value={formData.nirfRank}
              onChange={(e) => handleChange('nirfRank', e.target.value)}
              placeholder="e.g. 3"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              NIRF Domain Category
            </label>
            <input
              type="text"
              value={formData.nirfCategory}
              onChange={(e) => handleChange('nirfCategory', e.target.value)}
              placeholder="e.g. Engineering"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              NAAC Grade
            </label>
            <input
              type="text"
              value={formData.naacGrade}
              onChange={(e) => handleChange('naacGrade', e.target.value)}
              placeholder="e.g. A++ (3.88 CGPA)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              Statutory Approvals
            </label>
            <input
              type="text"
              value={formData.accreditation}
              onChange={(e) => handleChange('accreditation', e.target.value)}
              placeholder="e.g. AICTE, UGC"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
            />
          </div>
        </div>
      </SectionCard>

      {/* 4. Location & Official Web Address */}
      <SectionCard
        title="Location & Web Presence"
        description="Publicly displayed city, state, and verified portal links."
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              City *
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              State *
            </label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => handleChange('state', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              Official Website URL *
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="https://www.college.edu.in"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
            />
          </div>
        </div>
      </SectionCard>

      {/* Unsaved Changes Sticky SaveBar */}
      <SaveBar
        show={hasUnsavedChanges}
        onSave={handleSave}
        onReset={handleReset}
      />
    </div>
  )
}

export default CollegeProfilePage
