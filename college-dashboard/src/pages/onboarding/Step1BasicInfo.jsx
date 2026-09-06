import React from 'react'
import { Building2, Users, ShieldCheck, Layers, Calendar, Maximize2, Sparkles, BookOpen } from 'lucide-react'
import { FormField, TextInput, Textarea, SelectInput } from '../../components/common/FormControls'
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
    <div className="space-y-8 bg-white border border-border-color rounded-2xl p-6 sm:p-8 shadow-2xs">
      
      {/* 1. Institution Details */}
      <section className="space-y-5">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-text-primary tracking-tight">
            Institution Details
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Provide the basic details about your college or university.
          </p>
        </div>

        <div className="space-y-4 pt-1">
          <FormField
            label="Full College / University Name"
            required
            helperText="This will be displayed on your public profile."
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
              helperText="Used in listings, filters and compact views."
            >
              <TextInput
                value={collegeData.shortName}
                onChange={(e) => handleChange('shortName', e.target.value)}
                placeholder="e.g. IITB"
                disabled={isReadOnly}
              />
            </FormField>

            <FormField
              label="Primary Academic Stream"
              required
              helperText="Select the main academic category."
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
                placeholder="550"
                disabled={isReadOnly}
                icon={Maximize2}
                addonRight="Acres"
              />
            </FormField>
          </div>
        </div>
      </section>

      <hr className="border-border-color/80" />

      {/* 2. College Branding */}
      <section className="space-y-5">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-text-primary tracking-tight">
            College Branding
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Upload your official logo and a high-quality campus image.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-1 items-start">
          <ImageUploader
            label="College Official Logo"
            required
            aspectRatio="square"
            imageUrl={collegeData.logo}
            onChange={(url) => handleChange('logo', url)}
            onRemove={() => handleChange('logo', '')}
            helperText={`PNG or JPG, min 200×200px\nMax 5MB`}
            disabled={isReadOnly}
          />

          <ImageUploader
            label="Main Campus Banner / Header Image"
            required
            aspectRatio="banner"
            imageUrl={collegeData.image}
            onChange={(url) => handleChange('image', url)}
            onRemove={() => handleChange('image', '')}
            helperText="Recommended size: 1200×400px (3:1 ratio). Max 5MB."
            disabled={isReadOnly}
          />
        </div>
      </section>

      <hr className="border-border-color/80" />

      {/* 3. Key Institutional Facts (Preserved Snapshot) */}
      <section className="space-y-5">
        <div className="flex items-center gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-text-primary tracking-tight">
              Key Institutional Facts
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              These factual statistics appear in the 'Overview & Facts' snapshot on the public website.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
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
      </section>

      <hr className="border-border-color/80" />

      {/* 4. About College / Overview Description */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-text-primary tracking-tight">
            About College Overview
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Comprehensive narrative of the institution's legacy, academic culture, and research output.
          </p>
        </div>

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
      </section>
    </div>
  )
}

export default Step1BasicInfo
