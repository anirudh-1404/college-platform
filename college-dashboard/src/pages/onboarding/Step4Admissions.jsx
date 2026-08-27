import React from 'react'
import { Plus, Trash2, Compass, Calendar, Link as LinkIcon } from 'lucide-react'
import { FormField, TextInput, Textarea, TagInput, SectionCard } from '../../components/common/FormControls'
import { COMMON_ENTRANCE_EXAMS } from '../../data/collegeModel'

const Step4Admissions = ({ collegeData, onChange, isReadOnly = false }) => {
  const steps = collegeData.admissionProcessSteps || []

  const handleChange = (field, value) => {
    onChange({
      ...collegeData,
      [field]: value,
    })
  }

  // Handle Admission Process Steps Repeater
  const handleAddStep = () => {
    const nextStepNum = steps.length + 1
    const newStep = {
      step: String(nextStepNum),
      title: '',
      desc: '',
    }
    handleChange('admissionProcessSteps', [...steps, newStep])
  }

  const handleUpdateStep = (index, field, value) => {
    const updated = steps.map((s, idx) =>
      idx === index ? { ...s, [field]: value } : s
    )
    handleChange('admissionProcessSteps', updated)
  }

  const handleRemoveStep = (index) => {
    const updated = steps
      .filter((_, idx) => idx !== index)
      .map((s, idx) => ({ ...s, step: String(idx + 1) }))
    handleChange('admissionProcessSteps', updated)
  }

  return (
    <div className="space-y-6">
      {/* 1. Admission Cycle & Dates */}
      <SectionCard
        title="Admission Cycle & Timeline"
        description="Configure the active academic year, application deadlines, and admission status."
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Admission Status Headline"
              required
              helperText="e.g. Admissions Open (Session 2026-27)"
            >
              <TextInput
                value={collegeData.admissionStatus}
                onChange={(e) => handleChange('admissionStatus', e.target.value)}
                placeholder="e.g. Admissions Open (Session 2026-27)"
                disabled={isReadOnly}
                icon={Compass}
              />
            </FormField>

            <FormField
              label="Academic Session Year"
              required
              helperText="e.g. 2026 - 2027"
            >
              <TextInput
                value={collegeData.academicYear}
                onChange={(e) => handleChange('academicYear', e.target.value)}
                placeholder="e.g. 2026 - 2027"
                disabled={isReadOnly}
                icon={Calendar}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Application Start Date"
              optional
            >
              <TextInput
                type="date"
                value={collegeData.applicationStartDate}
                onChange={(e) => handleChange('applicationStartDate', e.target.value)}
                disabled={isReadOnly}
              />
            </FormField>

            <FormField
              label="Application Closing Deadline"
              optional
            >
              <TextInput
                type="date"
                value={collegeData.applicationEndDate}
                onChange={(e) => handleChange('applicationEndDate', e.target.value)}
                disabled={isReadOnly}
              />
            </FormField>
          </div>

          <FormField
            label="Central Counseling / Application Portal URL"
            helperText="Direct URL for students to apply or register for counseling (e.g. JoSAA / State Portal)."
          >
            <TextInput
              type="url"
              value={collegeData.admissionPortalUrl}
              onChange={(e) => handleChange('admissionPortalUrl', e.target.value)}
              placeholder="https://josaa.nic.in"
              disabled={isReadOnly}
              icon={LinkIcon}
            />
          </FormField>
        </div>
      </SectionCard>

      {/* 2. Accepted Entrance Exams */}
      <SectionCard
        title="Accepted Entrance Exams"
        description="Select and manage entrance tests accepted for undergraduate and postgraduate admissions."
      >
        <div className="space-y-3">
          <FormField
            label="Accepted Exam Tags (Add Multiple)"
            required
            helperText="These exam tags power the public filters on the college directory."
          >
            <TagInput
              tags={collegeData.examAccepted || []}
              onChange={(tags) => handleChange('examAccepted', tags)}
              placeholder="e.g. JEE Advanced, JEE Main, GATE, CAT, NEET..."
              disabled={isReadOnly}
            />
          </FormField>

          {/* Quick Common Exam Suggestions */}
          {!isReadOnly && (
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-text-light mr-2">
                Quick Add Common Exams:
              </span>
              <div className="inline-flex flex-wrap gap-1.5 mt-1">
                {COMMON_ENTRANCE_EXAMS.map((exam) => {
                  const isAdded = (collegeData.examAccepted || []).includes(exam)
                  return (
                    <button
                      key={exam}
                      type="button"
                      onClick={() => {
                        if (!isAdded) {
                          handleChange('examAccepted', [...(collegeData.examAccepted || []), exam])
                        }
                      }}
                      disabled={isAdded}
                      className={`text-[10px] font-medium px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                        isAdded
                          ? 'bg-slate-100 text-text-light border-slate-200 cursor-default'
                          : 'bg-white text-text-secondary border-border-color hover:border-brand-primary hover:text-brand-primary'
                      }`}
                    >
                      {isAdded ? `✓ ${exam}` : `+ ${exam}`}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </SectionCard>

      {/* 3. General Eligibility Overview */}
      <SectionCard
        title="Institutional Eligibility Overview"
        description="Summary of minimum educational qualification, category relaxations, and board criteria."
      >
        <FormField
          label="Eligibility Overview Narrative"
          helperText="General guidelines displayed under admission overview."
        >
          <Textarea
            rows={3}
            value={collegeData.admissionOverview}
            onChange={(e) => handleChange('admissionOverview', e.target.value)}
            placeholder="Undergraduate admissions strictly through JoSAA Centralized Counseling based on JEE Advanced All India Rank..."
            disabled={isReadOnly}
          />
        </FormField>
      </SectionCard>

      {/* 4. Step-by-Step Admission Process Flow */}
      <SectionCard
        title="Step-by-Step Admission Process"
        description="Structured sequence of steps guide students through the registration, counseling, and document verification process."
        action={
          !isReadOnly && (
            <button
              type="button"
              onClick={handleAddStep}
              className="btn btn-outline btn-sm text-xs cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Stage</span>
            </button>
          )
        }
      >
        <div className="space-y-3">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-border-color bg-slate-50/60 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-primary text-white text-xs font-bold flex items-center justify-center">
                    {item.step || idx + 1}
                  </span>
                  <span className="text-xs font-bold text-text-primary">
                    Stage {item.step || idx + 1}
                  </span>
                </div>

                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(idx)}
                    className="p-1 text-text-light hover:text-rose-600 rounded cursor-pointer"
                    title="Remove step"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <TextInput
                    placeholder="Step Title (e.g. Appear for JEE Main)"
                    value={item.title}
                    onChange={(e) => handleUpdateStep(idx, 'title', e.target.value)}
                    disabled={isReadOnly}
                  />
                </div>
                <div className="sm:col-span-2">
                  <TextInput
                    placeholder="Step Description (e.g. Register on central portal...)"
                    value={item.desc}
                    onChange={(e) => handleUpdateStep(idx, 'desc', e.target.value)}
                    disabled={isReadOnly}
                  />
                </div>
              </div>
            </div>
          ))}

          {!isReadOnly && steps.length === 0 && (
            <div className="text-center py-6 border border-dashed border-border-color rounded-xl">
              <p className="text-xs text-text-light">No process steps added.</p>
              <button
                type="button"
                onClick={handleAddStep}
                className="btn btn-outline btn-sm text-xs mt-2 cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                <span>Add First Step</span>
              </button>
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  )
}

export default Step4Admissions
