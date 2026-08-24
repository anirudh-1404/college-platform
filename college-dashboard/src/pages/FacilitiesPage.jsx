import React, { useState } from 'react'
import {
  PageHeader,
  SectionCard,
  SaveBar,
  StatusBadge,
} from '../components/common/UIComponents'
import {
  BookOpen,
  Wifi,
  FlaskConical,
  Trophy,
  Stethoscope,
  Home,
  Utensils,
  Building2,
  Rocket,
  Landmark,
  CheckCircle,
} from 'lucide-react'

const iconMap = {
  BookOpen: BookOpen,
  Wifi: Wifi,
  FlaskConical: FlaskConical,
  Trophy: Trophy,
  Stethoscope: Stethoscope,
  Home: Home,
  Utensils: Utensils,
  Building2: Building2,
  Rocket: Rocket,
  Landmark: Landmark,
}

const FacilitiesPage = ({
  collegeData,
  onUpdateFacilities,
  onPreviewPublic,
}) => {
  const [facilities, setFacilities] = useState([...collegeData.facilities])
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleToggleAvailable = (id) => {
    setFacilities((prev) =>
      prev.map((f) => (f.id === id ? { ...f, available: !f.available } : f))
    )
    setHasUnsavedChanges(true)
    setSavedSuccess(false)
  }

  const handleDescChange = (id, newDesc) => {
    setFacilities((prev) =>
      prev.map((f) => (f.id === id ? { ...f, desc: newDesc } : f))
    )
    setHasUnsavedChanges(true)
  }

  const handleSave = () => {
    if (onUpdateFacilities) {
      onUpdateFacilities(facilities)
    }
    setHasUnsavedChanges(false)
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  const handleReset = () => {
    setFacilities([...collegeData.facilities])
    setHasUnsavedChanges(false)
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Campus Infrastructure & Facilities"
        subtitle="Manage the campus facilities, laboratory descriptions, sports amenities, and medical centers shown on the public site."
        badge={<StatusBadge status={collegeData.status} />}
        onSave={handleSave}
        onPreview={onPreviewPublic}
        savedSuccess={savedSuccess}
      />

      <SectionCard
        title="Selectable Campus Amenities & Infrastructure"
        description="Toggle availability and edit description for each verified institutional facility."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {facilities.map((facility) => {
            const IconComponent = iconMap[facility.icon] || Building2

            return (
              <div
                key={facility.id}
                className={`p-4 rounded-xl border transition-all ${
                  facility.available
                    ? 'bg-white border-border-color shadow-2xs'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        facility.available
                          ? 'bg-brand-accent text-brand-primary'
                          : 'bg-slate-200 text-text-light'
                      }`}
                    >
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <h3 className="font-serif text-sm font-bold text-text-primary">
                      {facility.name}
                    </h3>
                  </div>

                  {/* Toggle Checkbox */}
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold select-none">
                    <input
                      type="checkbox"
                      checked={facility.available}
                      onChange={() => handleToggleAvailable(facility.id)}
                      className="w-4 h-4 rounded text-brand-primary accent-brand-primary cursor-pointer"
                    />
                    <span className={facility.available ? 'text-brand-primary font-bold' : 'text-text-light'}>
                      {facility.available ? 'Active' : 'Disabled'}
                    </span>
                  </label>
                </div>

                {/* Editable Description */}
                <div>
                  <textarea
                    rows={2}
                    value={facility.desc}
                    disabled={!facility.available}
                    onChange={(e) => handleDescChange(facility.id, e.target.value)}
                    placeholder="Describe facility capacity, operating hours, equipment..."
                    className="w-full p-2.5 rounded-lg border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white disabled:bg-slate-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            )
          })}
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

export default FacilitiesPage
