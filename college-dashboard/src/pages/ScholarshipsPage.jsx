import React, { useState } from 'react'
import {
  PageHeader,
  SectionCard,
  SaveBar,
  StatusBadge,
} from '../components/common/UIComponents'
import { GraduationCap, Plus, Trash2, Edit2, X } from 'lucide-react'

const ScholarshipsPage = ({
  collegeData,
  onUpdateScholarships,
  onPreviewPublic,
}) => {
  const [scholarships, setScholarships] = useState([...collegeData.scholarships])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const [modalForm, setModalForm] = useState({
    title: '',
    eligibility: '',
    benefit: '',
    category: 'Need-based Merit',
  })

  const handleOpenAdd = () => {
    setEditingIndex(null)
    setModalForm({
      title: '',
      eligibility: '',
      benefit: '100% Tuition Fee Waiver + Monthly Stipend',
      category: 'Need-based Merit',
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (index) => {
    setEditingIndex(index)
    setModalForm({ ...scholarships[index] })
    setIsModalOpen(true)
  }

  const handleSaveModal = (e) => {
    e.preventDefault()
    if (editingIndex !== null) {
      const updated = scholarships.map((s, idx) => (idx === editingIndex ? { ...modalForm } : s))
      setScholarships(updated)
    } else {
      setScholarships([...scholarships, { id: `sch-${Date.now()}`, ...modalForm }])
    }
    setIsModalOpen(false)
    setHasUnsavedChanges(true)
  }

  const handleDelete = (index) => {
    if (window.confirm('Remove this scholarship entry?')) {
      setScholarships(scholarships.filter((_, idx) => idx !== index))
      setHasUnsavedChanges(true)
    }
  }

  const handleSaveAll = () => {
    if (onUpdateScholarships) {
      onUpdateScholarships(scholarships)
    }
    setHasUnsavedChanges(false)
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  const handleReset = () => {
    setScholarships([...collegeData.scholarships])
    setHasUnsavedChanges(false)
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Scholarships & Financial Aid Schemes"
        subtitle="Manage institute merit-cum-means waivers, SC/ST social assistance, and alumni endowment awards."
        badge={<StatusBadge status={collegeData.status} />}
        onSave={handleSaveAll}
        onPreview={onPreviewPublic}
        savedSuccess={savedSuccess}
        extraActions={
          <button
            type="button"
            onClick={handleOpenAdd}
            className="btn btn-primary btn-md cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Scholarship</span>
          </button>
        }
      />

      <SectionCard
        title={`Active Financial Aid Schemes (${scholarships.length})`}
        description="Public scholarship programs shown in the fees & scholarships section."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scholarships.map((sch, idx) => (
            <div
              key={sch.id || idx}
              className="p-4 rounded-xl border border-border-color bg-slate-50/50 hover:bg-white hover:border-brand-primary/40 hover:shadow-xs transition-all space-y-2.5 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-serif text-sm font-bold text-text-primary">
                    {sch.title}
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-accent text-brand-primary flex-shrink-0">
                    {sch.category}
                  </span>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed">
                  <strong className="text-text-primary">Eligibility:</strong> {sch.eligibility}
                </p>

                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200/60 text-xs font-semibold text-emerald-800">
                  <span className="text-[10px] font-bold uppercase block text-emerald-900">
                    Financial Benefit / Coverage
                  </span>
                  {sch.benefit}
                </div>
              </div>

              <div className="pt-2 border-t border-border-color flex items-center justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(idx)}
                  className="btn btn-secondary btn-sm"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(idx)}
                  className="p-1.5 rounded-lg text-text-secondary hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-border-color p-6 z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-color">
              <h3 className="font-serif text-lg font-bold text-text-primary">
                {editingIndex !== null ? 'Edit Scholarship' : 'Add New Scholarship'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-text-light hover:text-text-primary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                  Scholarship Scheme Title *
                </label>
                <input
                  type="text"
                  required
                  value={modalForm.title}
                  onChange={(e) => setModalForm({ ...modalForm, title: e.target.value })}
                  placeholder="e.g. Merit-cum-Means (MCM) Scholarship"
                  className="w-full px-3 py-2 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                  Scheme Category *
                </label>
                <select
                  value={modalForm.category}
                  onChange={(e) => setModalForm({ ...modalForm, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
                >
                  <option value="Need-based Merit">Need-based Merit</option>
                  <option value="Tuition Waiver">Tuition Waiver</option>
                  <option value="Social Category">Social Category (SC/ST/PwD)</option>
                  <option value="Merit Award">Merit / Topper Award</option>
                  <option value="Alumni Endowment">Alumni Endowment</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                  Eligibility Criteria *
                </label>
                <textarea
                  rows={2}
                  required
                  value={modalForm.eligibility}
                  onChange={(e) => setModalForm({ ...modalForm, eligibility: e.target.value })}
                  placeholder="e.g. Family gross income < ₹5 Lakhs/year + min 7.0 CGPA"
                  className="w-full px-3 py-2 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                  Financial Benefit / Award Amount *
                </label>
                <input
                  type="text"
                  required
                  value={modalForm.benefit}
                  onChange={(e) => setModalForm({ ...modalForm, benefit: e.target.value })}
                  placeholder="e.g. 100% Tuition Fee Waiver + ₹1,000/mo allowance"
                  className="w-full px-3 py-2 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
                />
              </div>

              <div className="pt-3 border-t border-border-color flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                >
                  <span>Save Scholarship</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Save Bar */}
      <SaveBar
        show={hasUnsavedChanges}
        onSave={handleSaveAll}
        onReset={handleReset}
      />
    </div>
  )
}

export default ScholarshipsPage
