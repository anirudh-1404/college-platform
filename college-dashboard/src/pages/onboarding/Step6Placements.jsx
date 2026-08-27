import React from 'react'
import { TrendingUp, Award, Briefcase, Building } from 'lucide-react'
import { FormField, TextInput, TagInput, SectionCard } from '../../components/common/FormControls'

const Step6Placements = ({ collegeData, onChange, isReadOnly = false }) => {
  const placements = collegeData.placements || {}

  const handlePlacementChange = (field, value) => {
    const updatedPlacements = {
      ...placements,
      [field]: value,
    }

    const updatedRoot = {
      ...collegeData,
      placements: updatedPlacements,
    }

    // Synchronize root convenience fields used in quick metrics bar
    if (field === 'avgPackage') {
      updatedRoot.avgPackage = value
      // Try extract numeric value for filters
      const match = String(value).match(/([0-9.]+)/)
      if (match) updatedRoot.avgPackageVal = parseFloat(match[1])
    }
    if (field === 'highestDomestic') {
      updatedRoot.highestPackage = value
    }
    if (field === 'placementRate') {
      updatedRoot.placementPercent = parseFloat(value) || 0
    }

    onChange(updatedRoot)
  }

  return (
    <div className="space-y-6">
      {/* 1. Placement Summary Packages */}
      <SectionCard
        title="Key Placement Package Metrics"
        description="These placement package figures populate the Quick Metrics Bar and Placements Tab on the public page."
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField
            label="Average Package (LPA)"
            required
            helperText="e.g. ₹24.5 LPA"
          >
            <TextInput
              value={placements.avgPackage}
              onChange={(e) => handlePlacementChange('avgPackage', e.target.value)}
              placeholder="₹24.5 LPA"
              disabled={isReadOnly}
              icon={TrendingUp}
            />
          </FormField>

          <FormField
            label="Median Placement Package"
            helperText="e.g. ₹20.0 LPA"
          >
            <TextInput
              value={placements.medianPackage}
              onChange={(e) => handlePlacementChange('medianPackage', e.target.value)}
              placeholder="₹20.0 LPA"
              disabled={isReadOnly}
            />
          </FormField>

          <FormField
            label="Overall Placement Rate (%)"
            required
            helperText="e.g. 98"
          >
            <TextInput
              type="number"
              value={placements.placementRate}
              onChange={(e) => handlePlacementChange('placementRate', e.target.value)}
              placeholder="98"
              disabled={isReadOnly}
              suffix="%"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <FormField
            label="Highest Domestic Package"
            required
            helperText="e.g. ₹1.50 Cr PA"
          >
            <TextInput
              value={placements.highestDomestic}
              onChange={(e) => handlePlacementChange('highestDomestic', e.target.value)}
              placeholder="₹1.50 Cr PA"
              disabled={isReadOnly}
              icon={Award}
            />
          </FormField>

          <FormField
            label="Highest International Package"
            optional
            helperText="e.g. ₹3.70 Cr PA"
          >
            <TextInput
              value={placements.highestInternational}
              onChange={(e) => handlePlacementChange('highestInternational', e.target.value)}
              placeholder="₹3.70 Cr PA"
              disabled={isReadOnly}
            />
          </FormField>
        </div>
      </SectionCard>

      {/* 2. Recruiter Statistics & Hiring Partners */}
      <SectionCard
        title="Visiting Recruiters & Job Offers"
        description="Showcase company engagement and leading corporate hiring partners visiting the campus."
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Total Participating Recruiters Count"
              helperText="e.g. 350+ Recruiters"
            >
              <TextInput
                value={placements.totalRecruiters}
                onChange={(e) => handlePlacementChange('totalRecruiters', e.target.value)}
                placeholder="350+"
                disabled={isReadOnly}
                icon={Building}
              />
            </FormField>

            <FormField
              label="Total Placement Offers Extended"
              helperText="e.g. 1,850+ Offers"
            >
              <TextInput
                value={placements.totalOffers}
                onChange={(e) => handlePlacementChange('totalOffers', e.target.value)}
                placeholder="1,850+ Offers"
                disabled={isReadOnly}
                icon={Briefcase}
              />
            </FormField>
          </div>

          <FormField
            label="Top Visiting Recruiters (Add Company Names)"
            required
            helperText="Add major hiring partners (e.g. Google, Microsoft, Apple, Goldman Sachs). Type name and press Enter."
          >
            <TagInput
              tags={placements.topRecruiters || []}
              onChange={(tags) => handlePlacementChange('topRecruiters', tags)}
              placeholder="e.g. Google, Microsoft, Apple, McKinsey, Amazon..."
              disabled={isReadOnly}
            />
          </FormField>
        </div>
      </SectionCard>
    </div>
  )
}

export default Step6Placements
