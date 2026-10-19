import React, { useState } from 'react'
import { Home, Calculator, Check, Plus, X } from 'lucide-react'
import { FormField, TextInput, Textarea, SectionCard } from '../../components/common/FormControls'
import { COMMON_FACILITIES_LIST } from '../../data/collegeModel'

const Step8Facilities = ({ collegeData, onChange, isReadOnly = false }) => {
  const facilities = Array.isArray(collegeData.facilities) ? collegeData.facilities : []
  const hostel = collegeData.hostelDetails || {}
  const costs = collegeData.hiddenCosts || {}

  const [customFacility, setCustomFacility] = useState('')
  const [isAddingCustom, setIsAddingCustom] = useState(false)

  // Merge default list with any existing custom facilities
  const allFacilities = Array.from(new Set([...COMMON_FACILITIES_LIST, ...facilities]))

  const handleFacilityToggle = (facName) => {
    if (isReadOnly) return
    const isPresent = facilities.includes(facName)
    const updated = isPresent
      ? facilities.filter((f) => f !== facName)
      : [...facilities, facName]
    onChange({ ...collegeData, facilities: updated })
  }

  const handleAddCustomFacility = (e) => {
    if (e) e.preventDefault()
    const trimmed = customFacility.trim()
    if (!trimmed) return
    if (!facilities.includes(trimmed)) {
      onChange({
        ...collegeData,
        facilities: [...facilities, trimmed],
      })
    }
    setCustomFacility('')
    setIsAddingCustom(false)
  }

  const handleRemoveCustomFacility = (facToRemove) => {
    const updated = facilities.filter((f) => f !== facToRemove)
    onChange({
      ...collegeData,
      facilities: updated,
    })
  }

  const handleHostelChange = (field, value) => {
    onChange({
      ...collegeData,
      hostelDetails: {
        ...hostel,
        [field]: value,
      },
    })
  }

  const handleCostChange = (field, value) => {
    const numericVal = parseFloat(value) || 0
    const updatedCosts = {
      ...costs,
      [field]: numericVal,
    }

    // Auto-calculate estimated 4-year total cost
    const tuition = updatedCosts.tuitionFeePerYear || 0
    const hostelRent = updatedCosts.hostelRentYearly || 0
    const mess = updatedCosts.messChargesYearly || 0
    const misc = updatedCosts.examinationMiscYearly || 0
    const caution = updatedCosts.cautionDepositOneTime || 0
    const total4Yr = (tuition + hostelRent + mess + misc) * 4 + caution
    updatedCosts.estimatedTotal4Yr = `₹${(total4Yr / 100000).toFixed(2)} Lakhs`

    onChange({
      ...collegeData,
      hiddenCosts: updatedCosts,
    })
  }

  const handleCostNotesChange = (value) => {
    onChange({
      ...collegeData,
      hiddenCosts: {
        ...costs,
        notes: value,
      },
    })
  }

  return (
    <div className="space-y-6">
      {/* 1. Public Campus Facilities Checklist */}
      <SectionCard
        title="Campus Infrastructure & Facilities"
        description="Select available on-campus amenities displayed under 'Campus Facilities & Infrastructure'."
        action={
          !isReadOnly && (
            <button
              type="button"
              onClick={() => setIsAddingCustom((prev) => !prev)}
              className="btn btn-outline btn-sm text-xs cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{isAddingCustom ? 'Close' : 'Add Custom Facility'}</span>
            </button>
          )
        }
      >
        <div className="space-y-4">
          {/* Custom Facility Input Field */}
          {isAddingCustom && !isReadOnly && (
            <div className="p-3.5 bg-slate-50 border border-brand-primary/30 rounded-xl space-y-2">
              <label className="text-xs font-semibold text-text-primary block">
                Add New Campus Facility / Amenity
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex-1">
                  <TextInput
                    value={customFacility}
                    onChange={(e) => setCustomFacility(e.target.value)}
                    placeholder="e.g. Siemens CAD/CAM Center of Excellence, Robotics Lab, Swimming Pool..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddCustomFacility()
                      }
                    }}
                    autoFocus
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAddCustomFacility}
                    disabled={!customFacility.trim()}
                    className="btn btn-primary text-xs py-2 px-4 whitespace-nowrap cursor-pointer disabled:opacity-50"
                  >
                    Add Facility
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomFacility('')
                      setIsAddingCustom(false)
                    }}
                    className="btn btn-outline text-xs py-2 px-3 whitespace-nowrap cursor-pointer text-text-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {allFacilities.map((fac) => {
              const isChecked = facilities.includes(fac)
              const isCustom = !COMMON_FACILITIES_LIST.includes(fac)
              return (
                <div
                  key={fac}
                  onClick={() => handleFacilityToggle(fac)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none group ${
                    isChecked
                      ? 'bg-purple-50/60 border-brand-primary/40 text-text-primary'
                      : 'bg-white border-border-color text-text-secondary hover:border-slate-300'
                  } ${isReadOnly ? 'cursor-default pointer-events-none' : ''}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-1">
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border transition-colors flex-shrink-0 ${
                        isChecked
                          ? 'bg-brand-primary border-brand-primary text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isChecked && <Check className="h-3 w-3" />}
                    </div>
                    <span className="text-xs font-semibold truncate" title={fac}>
                      {fac}
                    </span>
                    {isCustom && (
                      <span className="text-[10px] uppercase font-bold text-brand-primary bg-purple-100/70 px-1.5 py-0.2 rounded flex-shrink-0">
                        Custom
                      </span>
                    )}
                  </div>

                  {isCustom && !isReadOnly && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveCustomFacility(fac)
                      }}
                      className="p-1 rounded text-text-light hover:text-rose-600 hover:bg-rose-50 transition-colors opacity-80 group-hover:opacity-100 flex-shrink-0 ml-1"
                      title="Delete custom facility"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              )
            })}

            {!isReadOnly && !isAddingCustom && (
              <button
                type="button"
                onClick={() => setIsAddingCustom(true)}
                className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-brand-primary/40 text-brand-primary hover:bg-purple-50/50 transition-colors text-xs font-semibold cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>+ Add Custom Facility</span>
              </button>
            )}
          </div>
        </div>
      </SectionCard>

      {/* 2. Residential Hostels & Housing */}
      <SectionCard
        title="Student Residential Housing & Hostels"
        description="Residential accommodations, capacity, security, and mess meal policies."
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="Total Hostel Buildings" helperText="e.g. 18 Hostels">
              <TextInput
                value={hostel.totalHostels}
                onChange={(e) => handleHostelChange('totalHostels', e.target.value)}
                placeholder="18 Hostels (14 Boys, 3 Girls, 1 PG)"
                disabled={isReadOnly}
                icon={Home}
              />
            </FormField>

            <FormField label="Total Student Housing Capacity" helperText="e.g. 11,500+ Residents">
              <TextInput
                value={hostel.totalCapacity}
                onChange={(e) => handleHostelChange('totalCapacity', e.target.value)}
                placeholder="11,500+ Residents"
                disabled={isReadOnly}
              />
            </FormField>

            <FormField label="Annual Hostel & Mess Fee" helperText="e.g. ₹64,000 / Year">
              <TextInput
                value={hostel.annualHostelMessFee}
                onChange={(e) => handleHostelChange('annualHostelMessFee', e.target.value)}
                placeholder="₹64,000 / Year"
                disabled={isReadOnly}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Boys Hostel Specifications">
              <Textarea
                rows={2}
                value={hostel.boysHostelDetails}
                onChange={(e) => handleHostelChange('boysHostelDetails', e.target.value)}
                placeholder="Single & twin sharing rooms, high-speed LAN, solar water heating..."
                disabled={isReadOnly}
              />
            </FormField>

            <FormField label="Girls Hostel Specifications">
              <Textarea
                rows={2}
                value={hostel.girlsHostelDetails}
                onChange={(e) => handleHostelChange('girlsHostelDetails', e.target.value)}
                placeholder="Dedicated secure hostel premises, biometric entry, study lounges..."
                disabled={isReadOnly}
              />
            </FormField>
          </div>
        </div>
      </SectionCard>

      {/* 3. Itemized Hidden Cost Structure (Powers Public ROI Calculator) */}
      <SectionCard
        title="Itemized Cost Breakdown (Powers Public ROI Calculator)"
        description="Public visitors can test 2, 4, or 5-year tenures to calculate realistic total expenditures against expected starting packages."
      >
        <div className="p-3.5 bg-brand-accent/50 border border-brand-primary/20 rounded-xl flex items-start gap-2.5 text-xs text-brand-primary mb-4">
          <Calculator className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <p className="text-text-secondary">
            These numbers are dynamically multiplied on the public website when students adjust the duration slider on your college’s <strong>ROI & Fee Breakdown</strong> tab.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField
            label="Tuition Fee (Per Year in ₹)"
            required
            helperText="Base annual academic tuition."
          >
            <TextInput
              type="number"
              value={costs.tuitionFeePerYear}
              onChange={(e) => handleCostChange('tuitionFeePerYear', e.target.value)}
              placeholder="200000"
              disabled={isReadOnly}
              prefix="₹"
            />
          </FormField>

          <FormField
            label="Hostel Rent (Per Year in ₹)"
            helperText="Room rental charges per academic year."
          >
            <TextInput
              type="number"
              value={costs.hostelRentYearly}
              onChange={(e) => handleCostChange('hostelRentYearly', e.target.value)}
              placeholder="28000"
              disabled={isReadOnly}
              prefix="₹"
            />
          </FormField>

          <FormField
            label="Mess / Dining Food (Per Year in ₹)"
            helperText="Meal plan charges per academic year."
          >
            <TextInput
              type="number"
              value={costs.messChargesYearly}
              onChange={(e) => handleCostChange('messChargesYearly', e.target.value)}
              placeholder="36000"
              disabled={isReadOnly}
              prefix="₹"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <FormField
            label="Refundable Caution Deposit (One-Time in ₹)"
            helperText="Paid once upon initial registration."
          >
            <TextInput
              type="number"
              value={costs.cautionDepositOneTime}
              onChange={(e) => handleCostChange('cautionDepositOneTime', e.target.value)}
              placeholder="10000"
              disabled={isReadOnly}
              prefix="₹"
            />
          </FormField>

          <FormField
            label="Examination & Misc Fees (Per Year in ₹)"
            helperText="Annual library, sports, examination charges."
          >
            <TextInput
              type="number"
              value={costs.examinationMiscYearly}
              onChange={(e) => handleCostChange('examinationMiscYearly', e.target.value)}
              placeholder="12000"
              disabled={isReadOnly}
              prefix="₹"
            />
          </FormField>
        </div>

        <div className="pt-2">
          <FormField
            label="Hostel & Fee Policy Notes"
            helperText="Clarifications on fee waivers, category concessions, or compulsory residential rules."
          >
            <Textarea
              rows={2}
              value={costs.notes}
              onChange={(e) => handleCostNotesChange(e.target.value)}
              placeholder="e.g. Hostel and mess charges are compulsory for resident B.Tech students..."
              disabled={isReadOnly}
            />
          </FormField>
        </div>
      </SectionCard>
    </div>
  )
}

export default Step8Facilities
