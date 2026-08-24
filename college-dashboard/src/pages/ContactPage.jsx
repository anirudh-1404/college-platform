import React, { useState } from 'react'
import {
  PageHeader,
  SectionCard,
  SaveBar,
  StatusBadge,
} from '../components/common/UIComponents'
import { MapPin, Mail, Phone, Globe } from 'lucide-react'

const ContactPage = ({
  collegeData,
  onUpdateContact,
  onPreviewPublic,
}) => {
  const [formData, setFormData] = useState({ ...collegeData.contact })
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setHasUnsavedChanges(true)
    setSavedSuccess(false)
  }

  const handleSave = () => {
    if (onUpdateContact) {
      onUpdateContact(formData)
    }
    setHasUnsavedChanges(false)
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  const handleReset = () => {
    setFormData({ ...collegeData.contact })
    setHasUnsavedChanges(false)
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Contact Information & Location Map"
        subtitle="Manage official campus physical addresses, admission cell emails, toll-free helplines, and GPS map coordinates."
        badge={<StatusBadge status={collegeData.status} />}
        onSave={handleSave}
        onPreview={onPreviewPublic}
        savedSuccess={savedSuccess}
      />

      {/* 1. Physical Campus Address */}
      <SectionCard
        title="Official Postal & Physical Address"
        description="Address rendered on the college footer and contact advisory card."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              Street / Campus Area Address *
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="e.g. Main Gate Road, IIT Area, Powai"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
            />
          </div>

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
              State & Pincode *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
                placeholder="State"
                className="w-2/3 px-3 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
              />
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => handleChange('pincode', e.target.value)}
                placeholder="Pincode"
                className="w-1/3 px-2 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
              />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* 2. Communication Channels & Helplines */}
      <SectionCard
        title="Inquiry & Admission Helplines"
        description="Public email addresses and phone helplines for aspiring students."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              Admission Office Email *
            </label>
            <input
              type="email"
              value={formData.admissionEmail}
              onChange={(e) => handleChange('admissionEmail', e.target.value)}
              placeholder="admissions@iitb.ac.in"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              Toll-Free Helpline
            </label>
            <input
              type="text"
              value={formData.tollFreeHelpline}
              onChange={(e) => handleChange('tollFreeHelpline', e.target.value)}
              placeholder="1800-223-345"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              Administrative Phone
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+91-22-2572-2545"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
            />
          </div>
        </div>
      </SectionCard>

      {/* 3. Geographic Coordinates */}
      <SectionCard
        title="Geographic Coordinates & Map Locator"
        description="GPS coordinates rendered on interactive location map."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              GPS Coordinates
            </label>
            <input
              type="text"
              value={formData.googleMapCoordinates}
              onChange={(e) => handleChange('googleMapCoordinates', e.target.value)}
              placeholder="e.g. 19.1334° N, 72.9133° E"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-border-color flex items-center gap-3 text-xs text-text-secondary">
            <MapPin className="h-5 w-5 text-brand-primary flex-shrink-0" />
            <span>
              Coordinates link directly to Google Maps navigation for students planning campus visits.
            </span>
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

export default ContactPage
