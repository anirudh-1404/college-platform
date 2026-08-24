import React, { useState } from 'react'
import {
  PageHeader,
  SectionCard,
  SaveBar,
  StatusBadge,
} from '../components/common/UIComponents'
import { HelpCircle, Plus, Trash2, Edit2, X, ChevronDown } from 'lucide-react'

const FAQsPage = ({
  collegeData,
  onUpdateFaqs,
  onPreviewPublic,
}) => {
  const [faqs, setFaqs] = useState([...collegeData.faqs])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState(null)
  const [expandedIndex, setExpandedIndex] = useState(0)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const [modalForm, setModalForm] = useState({
    question: '',
    category: 'Admissions',
    answer: '',
  })

  const handleOpenAdd = () => {
    setEditingIndex(null)
    setModalForm({
      question: '',
      category: 'Admissions',
      answer: '',
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (index) => {
    setEditingIndex(index)
    setModalForm({ ...faqs[index] })
    setIsModalOpen(true)
  }

  const handleSaveModal = (e) => {
    e.preventDefault()
    if (!modalForm.question.trim() || !modalForm.answer.trim()) return

    if (editingIndex !== null) {
      const updated = faqs.map((f, idx) => (idx === editingIndex ? { ...modalForm } : f))
      setFaqs(updated)
    } else {
      setFaqs([...faqs, { id: `faq-${Date.now()}`, ...modalForm }])
    }

    setIsModalOpen(false)
    setHasUnsavedChanges(true)
  }

  const handleDelete = (index) => {
    if (window.confirm('Delete this frequently asked question?')) {
      setFaqs(faqs.filter((_, idx) => idx !== index))
      setHasUnsavedChanges(true)
    }
  }

  const handleSaveAll = () => {
    if (onUpdateFaqs) {
      onUpdateFaqs(faqs)
    }
    setHasUnsavedChanges(false)
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  const handleReset = () => {
    setFaqs([...collegeData.faqs])
    setHasUnsavedChanges(false)
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Frequently Asked Questions (FAQs)"
        subtitle="Manage official answers to student inquiries regarding cutoff ranks, hostel guarantees, fee waivers, and academic research."
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
            <span>Add New FAQ</span>
          </button>
        }
      />

      <SectionCard
        title={`Managed FAQs (${faqs.length})`}
        description="Accordion questions displayed on the public college profile FAQs section."
      >
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isExpanded = expandedIndex === idx

            return (
              <div
                key={faq.id || idx}
                className="border border-border-color rounded-xl overflow-hidden bg-white shadow-2xs"
              >
                <div
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="p-4 bg-slate-50/50 hover:bg-slate-100/60 transition-colors flex items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className="w-6 h-6 rounded-full bg-brand-accent text-brand-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
                      Q{idx + 1}
                    </span>
                    <span className="font-serif text-xs sm:text-sm font-bold text-text-primary truncate">
                      {faq.question}
                    </span>
                    <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-text-secondary flex-shrink-0">
                      {faq.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenEdit(idx)
                      }}
                      className="p-1.5 rounded-lg text-text-secondary hover:text-brand-primary hover:bg-white transition-colors"
                      title="Edit FAQ"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(idx)
                      }}
                      className="p-1.5 rounded-lg text-text-secondary hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete FAQ"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>

                    <ChevronDown
                      className={`h-4 w-4 text-text-light transition-transform ${
                        isExpanded ? 'rotate-180 text-brand-primary' : ''
                      }`}
                    />
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 border-t border-border-color bg-white text-xs sm:text-sm text-text-secondary leading-relaxed space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-light block">
                      Published Official Answer
                    </span>
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </SectionCard>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-border-color p-6 z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-color">
              <h3 className="font-serif text-lg font-bold text-text-primary">
                {editingIndex !== null ? 'Edit FAQ' : 'Add New FAQ'}
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
                  Topic Category *
                </label>
                <select
                  value={modalForm.category}
                  onChange={(e) => setModalForm({ ...modalForm, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
                >
                  <option value="Admissions">Admissions & Cutoffs</option>
                  <option value="Academics">Academics & Faculty</option>
                  <option value="Fees & Aid">Fees, Aid & Scholarships</option>
                  <option value="Campus Life">Hostels & Campus Life</option>
                  <option value="Placements">Placements & Internships</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                  Question *
                </label>
                <input
                  type="text"
                  required
                  value={modalForm.question}
                  onChange={(e) => setModalForm({ ...modalForm, question: e.target.value })}
                  placeholder="e.g. Is hostel accommodation mandatory for all students?"
                  className="w-full px-3 py-2 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                  Detailed Answer *
                </label>
                <textarea
                  rows={4}
                  required
                  value={modalForm.answer}
                  onChange={(e) => setModalForm({ ...modalForm, answer: e.target.value })}
                  placeholder="Write clear, informative response..."
                  className="w-full px-3 py-2 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white leading-relaxed"
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
                  <span>Save FAQ</span>
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

export default FAQsPage
