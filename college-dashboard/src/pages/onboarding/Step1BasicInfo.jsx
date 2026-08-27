import React from 'react'
import { Building2, Users, ShieldCheck, Layers, Calendar, Maximize2 } from 'lucide-react'
import { FormField, TextInput, Textarea, SelectInput, SectionCard } from '../../components/common/FormControls'
import { ImageUploader } from '../../components/common/FileUpload'
import { STREAM_OPTIONS, OWNERSHIP_OPTIONS } from '../../data/collegeModel'

const Step1BasicInfo = ({ collegeData, onChange, isReadOnly = false }) => {
  const handleChange = (field, value) => {
    onChange({
      ...collegeData,
      [field]: value,
    })
  }

  const handleSnapshotChange = (field, value) => {
    onChange({
      ...collegeData,
      snapshot: {
        ...(collegeData.snapshot || {}),
        [field]: value,
      },
    })
  }

  return (
    <div className="space-y-6">
      {/* 1. College Identity & Name */}
      <SectionCard
        title="Institutional Identity"
        description="Provide the primary registered name and discipline categories shown on the public directory."
      >
        <div className="space-y-4">
          <FormField
            label="Full College / University Name"
            required
            helperText="The official complete name displayed on the public College Detail page header."
          >
            <TextInput
              value={collegeData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g. Indian Institute of Technology Bombay"
              disabled={isReadOnly}
              icon={Building2}
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Short Name / Acronym"
              required
              helperText="Used in breadcrumbs, tags, and compact cards."
            >
              <TextInput
                value={collegeData.shortName}
                onChange={(e) => handleChange('shortName', e.target.value)}
                placeholder="e.g. IIT Bombay"
                disabled={isReadOnly}
              />
            </FormField>

            <FormField
              label="Primary Academic Stream"
              required
              helperText="Determines the public category filter listing."
            >
              <SelectInput
                value={collegeData.stream}
                onChange={(e) => handleChange('stream', e.target.value)}
                options={STREAM_OPTIONS}
                disabled={isReadOnly}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField
              label="Ownership / Institute Type"
              required
            >
              <SelectInput
                value={collegeData.ownership}
                onChange={(e) => handleChange('ownership', e.target.value)}
                options={OWNERSHIP_OPTIONS}
                disabled={isReadOnly}
              />
            </FormField>

            <FormField
              label="Establishment Year"
              required
            >
              <TextInput
                type="number"
                value={collegeData.establishmentYear}
                onChange={(e) => handleChange('establishmentYear', e.target.value)}
                placeholder="e.g. 1958"
                disabled={isReadOnly}
                icon={Calendar}
              />
            </FormField>

            <FormField
              label="Campus Land Area"
              helperText="e.g. 550 Acres"
            >
              <TextInput
                value={collegeData.campusArea}
                onChange={(e) => handleChange('campusArea', e.target.value)}
                placeholder="e.g. 550 Acres"
                disabled={isReadOnly}
                icon={Maximize2}
              />
            </FormField>
          </div>
        </div>
      </SectionCard>

      {/* 2. Media & Branding */}
      <SectionCard
        title="College Branding & Imagery"
        description="Upload official high-resolution logo and main campus cover photo."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageUploader
            label="College Official Logo"
            aspectRatio="square"
            imageUrl={collegeData.logo}
            onChange={(url) => handleChange('logo', url)}
            onRemove={() => handleChange('logo', '')}
            helperText="Square format (PNG/JPG, min 200x200px recommended)."
            disabled={isReadOnly}
          />

          <ImageUploader
            label="Main Campus Banner / Header Image"
            aspectRatio="video"
            imageUrl={collegeData.image}
            onChange={(url) => handleChange('image', url)}
            onRemove={() => handleChange('image', '')}
            helperText="Landscape cover photo displayed in public listings and header banner."
            disabled={isReadOnly}
          />
        </div>
      </SectionCard>

      {/* 3. Institutional Snapshot Facts */}
      <SectionCard
        title="Key Institutional Facts (Public Snapshot)"
        description="These factual statistics appear in the 'Overview & Facts' snapshot on the public website."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Accreditation / Status"
            helperText="e.g. NAAC A++ | IoE (Institute of Eminence)"
          >
            <TextInput
              value={collegeData.snapshot?.accreditation}
              onChange={(e) => handleSnapshotChange('accreditation', e.target.value)}
              placeholder="NAAC A++ | IoE status"
              disabled={isReadOnly}
              icon={ShieldCheck}
            />
          </FormField>

          <FormField
            label="Total PhD / Full-time Faculty"
            helperText="e.g. 680+ PhD Faculty"
          >
            <TextInput
              value={collegeData.snapshot?.totalFaculty}
              onChange={(e) => handleSnapshotChange('totalFaculty', e.target.value)}
              placeholder="680+ PhD Faculty"
              disabled={isReadOnly}
              icon={Users}
            />
          </FormField>

          <FormField
            label="Gender Ratio (Male:Female)"
            helperText="e.g. 80:20 (Male:Female)"
          >
            <TextInput
              value={collegeData.snapshot?.genderRatio}
              onChange={(e) => handleSnapshotChange('genderRatio', e.target.value)}
              placeholder="80:20 (Male:Female)"
              disabled={isReadOnly}
              icon={Layers}
            />
          </FormField>

          <FormField
            label="Hostel Capacity"
            helperText="e.g. 18 Hostels (100% On-Campus Housing)"
          >
            <TextInput
              value={collegeData.snapshot?.hostelCapacity}
              onChange={(e) => handleSnapshotChange('hostelCapacity', e.target.value)}
              placeholder="18 Hostels"
              disabled={isReadOnly}
            />
          </FormField>
        </div>
      </SectionCard>

      {/* 4. About College Overview */}
      <SectionCard
        title="About College / Overview"
        description="Comprehensive narrative of the institution's legacy, academic culture, and research output."
      >
        <FormField
          label="College Description"
          required
          helperText="Displayed under 'About [College Name]' on the public page."
        >
          <Textarea
            rows={5}
            value={collegeData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Describe the college history, research facilities, notable programs, and student life..."
            disabled={isReadOnly}
            maxLength={1000}
          />
        </FormField>
      </SectionCard>
    </div>
  )
}

export default Step1BasicInfo
