import React from 'react'
import { MapPin, Globe, Mail, Phone, Navigation } from 'lucide-react'
import { FormField, TextInput, SectionCard } from '../../components/common/FormControls'

const Step2LocationContact = ({ collegeData, onChange, isReadOnly = false }) => {
  const handleChange = (field, value) => {
    const updated = {
      ...collegeData,
      [field]: value,
    }

    // Keep location formatted as "City, State" automatically if city or state updates
    if (field === 'city' || field === 'state') {
      const city = field === 'city' ? value : collegeData.city
      const state = field === 'state' ? value : collegeData.state
      updated.location = `${city || ''}${city && state ? ', ' : ''}${state || ''}`
    }

    onChange(updated)
  }

  return (
    <div className="space-y-6">
      {/* 1. Campus Physical Address */}
      <SectionCard
        title="Campus Geographic Location"
        description="Accurate location data helps students discover colleges by state, city, and campus proximity."
      >
        <div className="space-y-4">
          <FormField
            label="Campus Street Address"
            required
            helperText="Complete physical address of the main campus."
          >
            <TextInput
              value={collegeData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="e.g. Main Gate Road, IIT Area, Powai"
              disabled={isReadOnly}
              icon={MapPin}
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="City" required>
              <TextInput
                value={collegeData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="e.g. Mumbai"
                disabled={isReadOnly}
              />
            </FormField>

            <FormField label="State / UT" required>
              <TextInput
                value={collegeData.state}
                onChange={(e) => handleChange('state', e.target.value)}
                placeholder="e.g. Maharashtra"
                disabled={isReadOnly}
              />
            </FormField>

            <FormField label="Postal Code / PIN" required>
              <TextInput
                value={collegeData.pincode}
                onChange={(e) => handleChange('pincode', e.target.value)}
                placeholder="e.g. 400076"
                disabled={isReadOnly}
              />
            </FormField>
          </div>

          <FormField
            label="Public Location Summary"
            helperText="Appears next to the map pin icon in public college cards and header."
          >
            <TextInput
              value={collegeData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="e.g. Mumbai, Maharashtra"
              disabled={isReadOnly}
              icon={Navigation}
            />
          </FormField>
        </div>
      </SectionCard>

      {/* 2. Official Contact & Web Channels */}
      <SectionCard
        title="Official Communication Channels"
        description="Public inquiries from prospective students will be routed to these official channels."
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Official Institutional Website"
              required
              helperText="e.g. https://www.iitb.ac.in"
            >
              <TextInput
                type="url"
                value={collegeData.website}
                onChange={(e) => handleChange('website', e.target.value)}
                placeholder="https://www.college.edu.in"
                disabled={isReadOnly}
                icon={Globe}
              />
            </FormField>

            <FormField
              label="Central Admission Office Email"
              required
              helperText="Email for student admission queries."
            >
              <TextInput
                type="email"
                value={collegeData.admissionEmail}
                onChange={(e) => handleChange('admissionEmail', e.target.value)}
                placeholder="admissions@college.edu.in"
                disabled={isReadOnly}
                icon={Mail}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Admissions Helpline Phone"
              required
            >
              <TextInput
                value={collegeData.helplinePhone}
                onChange={(e) => handleChange('helplinePhone', e.target.value)}
                placeholder="+91-22-2572-2545"
                disabled={isReadOnly}
                icon={Phone}
              />
            </FormField>

            <FormField
              label="Toll-Free Helpline Number"
              optional
            >
              <TextInput
                value={collegeData.tollFreeHelpline}
                onChange={(e) => handleChange('tollFreeHelpline', e.target.value)}
                placeholder="1800-223-345"
                disabled={isReadOnly}
                icon={Phone}
              />
            </FormField>
          </div>

          <FormField
            label="Google Maps Coordinates / Map Link"
            optional
            helperText="Coordinates or share link to render campus location pinpoint."
          >
            <TextInput
              value={collegeData.googleMapCoordinates}
              onChange={(e) => handleChange('googleMapCoordinates', e.target.value)}
              placeholder="e.g. 19.1334° N, 72.9133° E or https://maps.google.com/..."
              disabled={isReadOnly}
              icon={MapPin}
            />
          </FormField>
        </div>
      </SectionCard>
    </div>
  )
}

export default Step2LocationContact
