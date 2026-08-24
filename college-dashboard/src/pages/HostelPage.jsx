import React, { useState } from 'react'
import {
  PageHeader,
  SectionCard,
  SaveBar,
  StatusBadge,
} from '../components/common/UIComponents'
import { Home, ShieldCheck, Utensils } from 'lucide-react'

const HostelPage = ({
  collegeData,
  onUpdateHostels,
  onPreviewPublic,
}) => {
  const [formData, setFormData] = useState({ ...collegeData.hostels })
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setHasUnsavedChanges(true)
    setSavedSuccess(false)
  }

  const handleSave = () => {
    if (onUpdateHostels) {
      onUpdateHostels(formData)
    }
    setHasUnsavedChanges(false)
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  const handleReset = () => {
    setFormData({ ...collegeData.hostels })
    setHasUnsavedChanges(false)
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Hostel & Residential Accommodation"
        subtitle="Manage boys and girls hostel facilities, room inventory, mess meal policies, and safety protocols."
        badge={<StatusBadge status={collegeData.status} />}
        onSave={handleSave}
        onPreview={onPreviewPublic}
        savedSuccess={savedSuccess}
      />

      {/* 1. Overall Capacity & Fees */}
      <SectionCard
        title="Hostel Inventory & Annual Charges"
        description="Public statistics shown on the campus living overview."
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              Total Number of Hostels *
            </label>
            <input
              type="text"
              value={formData.totalHostels}
              onChange={(e) => handleChange('totalHostels', e.target.value)}
              placeholder="e.g. 18 Hostels (14 Boys, 3 Girls, 1 PG)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              Total Residential Capacity *
            </label>
            <input
              type="text"
              value={formData.totalCapacity}
              onChange={(e) => handleChange('totalCapacity', e.target.value)}
              placeholder="e.g. 11,500+ Residents"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              Annual Hostel & Mess Charge *
            </label>
            <input
              type="text"
              value={formData.annualHostelMessFee}
              onChange={(e) => handleChange('annualHostelMessFee', e.target.value)}
              placeholder="e.g. ₹68,000 / Year"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-bold text-brand-primary bg-white"
            />
          </div>
        </div>
      </SectionCard>

      {/* 2. Boys & Girls Hostel Details */}
      <SectionCard
        title="Gender-Specific Residential Details"
        description="Room configurations, amenities, and security arrangements for boys and girls hostels."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-4 rounded-xl border border-border-color bg-slate-50/50 space-y-2">
            <h3 className="font-serif text-sm font-bold text-text-primary flex items-center gap-2">
              <Home className="h-4 w-4 text-blue-600" />
              <span>Boys Hostel Details</span>
            </h3>
            <textarea
              rows={4}
              value={formData.boysHostelDetails}
              onChange={(e) => handleChange('boysHostelDetails', e.target.value)}
              className="w-full p-3 rounded-lg border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white leading-relaxed"
            />
          </div>

          <div className="p-4 rounded-xl border border-border-color bg-slate-50/50 space-y-2">
            <h3 className="font-serif text-sm font-bold text-text-primary flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-purple-600" />
              <span>Girls Hostel Details & Safety</span>
            </h3>
            <textarea
              rows={4}
              value={formData.girlsHostelDetails}
              onChange={(e) => handleChange('girlsHostelDetails', e.target.value)}
              className="w-full p-3 rounded-lg border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white leading-relaxed"
            />
          </div>
        </div>
      </SectionCard>

      {/* 3. Mess & Catering Policy */}
      <SectionCard
        title="Mess & Dining Facilities"
        description="Meal options, vegetarian/non-vegetarian provisions, and hygiene oversight."
      >
        <textarea
          rows={3}
          value={formData.messFoodType}
          onChange={(e) => handleChange('messFoodType', e.target.value)}
          className="w-full p-3.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white leading-relaxed"
        />
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

export default HostelPage
