import React from 'react'
import { MapPin, Globe, Mail, Phone, Navigation } from 'lucide-react'
import { FormField, TextInput } from '../../components/common/FormControls'

const Step2LocationContact = ({ collegeData = {}, onChange, isReadOnly = false }) => {
  const lc = collegeData.locationContact || {}

  const address = collegeData.address ?? lc.address ?? ''
  const city = collegeData.city ?? lc.city ?? ''
  const state = collegeData.state ?? lc.state ?? ''
  const pincode = collegeData.pincode ?? lc.pincode ?? ''
  const location = collegeData.location ?? (city && state ? `${city}, ${state}` : '')
  const website = collegeData.website ?? lc.websiteUrl ?? ''
  const admissionEmail = collegeData.admissionEmail ?? lc.admissionEmail ?? ''
  const helplinePhone = collegeData.helplinePhone ?? lc.helplineNumber ?? ''
  const tollFreeHelpline = collegeData.tollFreeHelpline ?? lc.alternatePhone ?? ''
  const googleMapCoordinates = collegeData.googleMapCoordinates ?? lc.mapCoordinates ?? ''

  const handleChange = (field, value) => {
    const updated = {
      ...collegeData,
      [field]: value,
      locationContact: {
        ...(collegeData.locationContact || {}),
        [field === 'website' ? 'websiteUrl' : field === 'helplinePhone' ? 'helplineNumber' : field === 'tollFreeHelpline' ? 'alternatePhone' : field === 'googleMapCoordinates' ? 'mapCoordinates' : field]: value,
      },
    }

    // Keep location formatted as "City, State" automatically if city or state updates
    if (field === 'city' || field === 'state') {
      const c = field === 'city' ? value : city
      const s = field === 'state' ? value : state
      updated.location = `${c || ''}${c && s ? ', ' : ''}${s || ''}`
    }

    onChange(updated)
  }

  return (
    <div className="space-y-8 bg-white border border-border-color rounded-2xl p-6 sm:p-8 shadow-2xs">
      {/* 1. Campus Physical Address */}
      <section className="space-y-5">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-text-primary tracking-tight">
            Campus Geographic Location
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Accurate location data helps students discover colleges by state, city, and campus proximity.
          </p>
        </div>

        <div className="space-y-4 pt-1">
          <FormField
            label="Campus Street Address"
            required
            helperText="Complete physical address of the main campus."
          >
            <TextInput
              value={address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="e.g. Main Gate Road, IIT Area, Powai"
              disabled={isReadOnly}
              icon={MapPin}
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="City" required>
              <TextInput
                value={city}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="e.g. Mumbai"
                disabled={isReadOnly}
              />
            </FormField>

            <FormField label="State / UT" required>
              <TextInput
                value={state}
                onChange={(e) => handleChange('state', e.target.value)}
                placeholder="e.g. Maharashtra"
                disabled={isReadOnly}
              />
            </FormField>

            <FormField label="Postal Code / PIN" required>
              <TextInput
                value={pincode}
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
              value={location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="e.g. Mumbai, Maharashtra"
              disabled={isReadOnly}
              icon={Navigation}
            />
          </FormField>
        </div>
      </section>

      <hr className="border-border-color/80" />

      {/* 2. Official Contact & Web Channels */}
      <section className="space-y-5">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-text-primary tracking-tight">
            Official Communication Channels
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Public inquiries from prospective students will be routed to these official channels.
          </p>
        </div>

        <div className="space-y-4 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Official Institutional Website"
              required
              helperText="e.g. https://www.iitb.ac.in"
            >
              <TextInput
                type="url"
                value={website}
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
                value={admissionEmail}
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
                value={helplinePhone}
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
                value={tollFreeHelpline}
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
              value={googleMapCoordinates}
              onChange={(e) => handleChange('googleMapCoordinates', e.target.value)}
              placeholder="e.g. 19.1334° N, 72.9133° E or https://maps.google.com/..."
              disabled={isReadOnly}
              icon={MapPin}
            />
          </FormField>
        </div>
      </section>
    </div>
  )
}

export default Step2LocationContact
