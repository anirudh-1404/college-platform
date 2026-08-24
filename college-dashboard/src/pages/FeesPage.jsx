import React, { useState } from 'react'
import {
  PageHeader,
  SectionCard,
  SaveBar,
  StatusBadge,
} from '../components/common/UIComponents'
import { IndianRupee, ShieldCheck, Calculator } from 'lucide-react'

const FeesPage = ({
  collegeData,
  onUpdateFees,
  onPreviewPublic,
}) => {
  const [formData, setFormData] = useState({ ...collegeData.fees })
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setHasUnsavedChanges(true)
    setSavedSuccess(false)
  }

  const handleSave = () => {
    if (onUpdateFees) {
      onUpdateFees(formData)
    }
    setHasUnsavedChanges(false)
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  const handleReset = () => {
    setFormData({ ...collegeData.fees })
    setHasUnsavedChanges(false)
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Fees Structure & Expenditure Calculator"
        subtitle="Manage semester tuition, hostel charges, refundable deposits, and government fee waiver policies."
        badge={<StatusBadge status={collegeData.status} />}
        onSave={handleSave}
        onPreview={onPreviewPublic}
        savedSuccess={savedSuccess}
      />

      {/* 1. Academic Tuition Fees */}
      <SectionCard
        title="Academic & Tuition Fee Breakdown"
        description="Standard semester and annual charges for general category students."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              Tuition Fee (Per Semester) *
            </label>
            <input
              type="text"
              value={formData.tuitionFeePerSem}
              onChange={(e) => handleChange('tuitionFeePerSem', e.target.value)}
              placeholder="e.g. ₹1,00,000"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              Other Academic Charges (Per Sem)
            </label>
            <input
              type="text"
              value={formData.otherAcademicPerSem}
              onChange={(e) => handleChange('otherAcademicPerSem', e.target.value)}
              placeholder="e.g. ₹12,000"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              One-Time Admission Charge
            </label>
            <input
              type="text"
              value={formData.oneTimeAdmissionFee}
              onChange={(e) => handleChange('oneTimeAdmissionFee', e.target.value)}
              placeholder="e.g. ₹10,500"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              Refundable Caution Deposit
            </label>
            <input
              type="text"
              value={formData.refundableCautionDeposit}
              onChange={(e) => handleChange('refundableCautionDeposit', e.target.value)}
              placeholder="e.g. ₹10,000"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
            />
          </div>
        </div>
      </SectionCard>

      {/* 2. Living & Overall Four-Year Estimate */}
      <SectionCard
        title="Residential Living & Total Estimated Expense"
        description="Hostel, mess charges and 4-year total cost displayed on public calculator."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              Hostel & Mess Charges (Annual) *
            </label>
            <input
              type="text"
              value={formData.hostelMessAnnual}
              onChange={(e) => handleChange('hostelMessAnnual', e.target.value)}
              placeholder="e.g. ₹68,000"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              Estimated 4-Year Total Budget *
            </label>
            <input
              type="text"
              value={formData.estimatedTotalFourYears}
              onChange={(e) => handleChange('estimatedTotalFourYears', e.target.value)}
              placeholder="e.g. ₹11.60 Lakhs (Including Hostel & Mess)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white font-bold text-brand-primary"
            />
          </div>
        </div>
      </SectionCard>

      {/* 3. Fee Waiver & Concession Policy */}
      <SectionCard
        title="Fee Waiver, Concession & Category Policy"
        description="Government regulations and institutional scholarships for economically weaker or reserved categories."
      >
        <textarea
          rows={4}
          value={formData.waiverPolicy}
          onChange={(e) => handleChange('waiverPolicy', e.target.value)}
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

export default FeesPage
