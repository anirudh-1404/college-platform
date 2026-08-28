import React, { useState, useMemo } from 'react'
import {
  FileText,
  Search,
  Plus,
  Trash2,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react'
import { AdminModal } from '../components/common/AdminModal'

const CATEGORIES = [
  { id: 'engineering', label: 'Engineering' },
  { id: 'management', label: 'Management' },
  { id: 'medical', label: 'Medical' },
  { id: 'law', label: 'Law' },
  { id: 'design', label: 'Design' },
  { id: 'applied-sciences', label: 'Central Universities / Applied Sciences' },
]

const ExamManagementPage = ({
  exams = [],
  onAddExam,
  onDeleteExam,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedExam, setSelectedExam] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    category: 'engineering',
    conductingBody: 'National Testing Agency (NTA)',
    level: 'National Level',
    mode: 'Computer Based Test (CBT)',
    frequency: 'Once a year',
    duration: '180 Minutes (3 Hours)',
    totalMarks: '300 Marks',
    eligibility: '10+2 with Physics, Chemistry & Mathematics (min 75%)',
    applicationStart: 'November 2025',
    applicationEnd: 'January 2026',
    admitCardDate: 'April 2026',
    examDate: 'May 2026',
    resultDate: 'June 2026',
    targetCollegesCount: 'All 23 IITs, 31 NITs, IIITs & GFTIs',
    overview: 'National standard entrance exam for undergraduate admissions.',
    syllabusHighlights: 'Physics (Mechanics, Optics), Chemistry (Physical, Organic), Mathematics (Calculus, Vectors)',
  })

  const filteredExams = useMemo(() => {
    return exams.filter((e) => {
      const matchSearch =
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.conductingBody.toLowerCase().includes(searchQuery.toLowerCase())

      const matchCategory = categoryFilter === 'all' || e.category === categoryFilter

      return matchSearch && matchCategory
    })
  }, [exams, searchQuery, categoryFilter])

  const handleConfirmAdd = async (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.shortName.trim()) {
      alert('Please enter Exam Name and Short Name.')
      return
    }

    setIsProcessing(true)
    try {
      await onAddExam({
        name: formData.name.trim(),
        shortName: formData.shortName.trim(),
        category: formData.category,
        conductingBody: formData.conductingBody.trim(),
        level: formData.level.trim(),
        mode: formData.mode.trim(),
        frequency: formData.frequency.trim(),
        duration: formData.duration.trim(),
        totalMarks: formData.totalMarks.trim(),
        eligibility: formData.eligibility.trim(),
        examDates: {
          applicationStart: formData.applicationStart.trim(),
          applicationEnd: formData.applicationEnd.trim(),
          admitCardDate: formData.admitCardDate.trim(),
          examDate: formData.examDate.trim(),
          resultDate: formData.resultDate.trim(),
        },
        targetCollegesCount: formData.targetCollegesCount.trim(),
        overview: formData.overview.trim(),
        syllabusHighlights: formData.syllabusHighlights
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        published: true,
      })

      setAddModalOpen(false)
      setFormData({
        name: '',
        shortName: '',
        category: 'engineering',
        conductingBody: '',
        level: 'National Level',
        mode: 'Computer Based Test (CBT)',
        frequency: 'Once a year',
        duration: '',
        totalMarks: '',
        eligibility: '',
        applicationStart: '',
        applicationEnd: '',
        admitCardDate: '',
        examDate: '',
        resultDate: '',
        targetCollegesCount: '',
        overview: '',
        syllabusHighlights: '',
      })
    } catch (err) {
      alert(err.message || 'Failed to create entrance exam.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedExam) return
    setIsProcessing(true)
    try {
      await onDeleteExam(selectedExam.id)
      setDeleteModalOpen(false)
      setSelectedExam(null)
    } catch (err) {
      alert(err.message || 'Failed to delete entrance exam.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Entrance & Competitive Examinations Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, update, and manage official entrance exam guides, schedules, and eligibility rules.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAddModalOpen(true)}
          className="btn btn-primary btn-md text-xs font-semibold cursor-pointer shadow-2xs self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Entrance Exam</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 border border-slate-200 rounded-xl shadow-2xs">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exams by name, conducting body..."
            className="w-full pl-8.5 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-600"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-auto text-xs font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-purple-600 cursor-pointer"
        >
          <option value="all">All Categories ({exams.length})</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Exams Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                <th className="py-3 px-4 min-w-[200px]">Examination Name</th>
                <th className="py-3 px-4 min-w-[130px]">Category</th>
                <th className="py-3 px-4 min-w-[160px]">Conducting Body</th>
                <th className="py-3 px-4 min-w-[120px]">Exam Mode & Time</th>
                <th className="py-3 px-4 min-w-[110px]">Exam Date</th>
                <th className="py-3 px-4 min-w-[90px]">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExams.map((exam) => (
                <tr key={exam.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-900">{exam.name}</p>
                    <p className="text-[11px] text-purple-700 font-bold mt-0.5">
                      {exam.shortName}
                    </p>
                  </td>

                  <td className="py-3 px-4 text-slate-700 font-medium capitalize">
                    {exam.category}
                  </td>

                  <td className="py-3 px-4 text-slate-600">
                    {exam.conductingBody || 'National Agency'}
                  </td>

                  <td className="py-3 px-4 text-slate-600">
                    <p className="font-medium text-slate-800">{exam.mode}</p>
                    <p className="text-[11px] text-slate-400">{exam.duration}</p>
                  </td>

                  <td className="py-3 px-4 font-semibold text-purple-700">
                    {exam.examDates?.examDate || 'May 2026'}
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Live Active
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedExam(exam)
                        setDeleteModalOpen(true)
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                      title="Delete Exam"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredExams.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-slate-400 space-y-2">
                    <FileText className="h-8 w-8 text-slate-300 mx-auto" />
                    <p className="font-semibold text-slate-700">No Entrance Exams Added Yet</p>
                    <p className="text-slate-400 max-w-sm mx-auto">
                      Click "+ Add Entrance Exam" above to publish your first entrance examination guide live on the VidyaScope portal.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Entrance Exam Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setAddModalOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
          />

          <div className="relative bg-white rounded-xl border border-slate-200 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar p-6 z-10 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Add New Entrance Examination
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  This examination will be published live on the VidyaScope Exams portal.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmAdd} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Exam Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Joint Entrance Examination (Advanced) 2026"
                    className="w-full border border-slate-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Short Name / Acronym *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.shortName}
                    onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                    placeholder="e.g. JEE Advanced"
                    className="w-full border border-slate-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Academic Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Conducting Authority
                  </label>
                  <input
                    type="text"
                    value={formData.conductingBody}
                    onChange={(e) => setFormData({ ...formData, conductingBody: e.target.value })}
                    placeholder="e.g. IIT Joint Admission Board (JAB)"
                    className="w-full border border-slate-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Exam Mode
                  </label>
                  <input
                    type="text"
                    value={formData.mode}
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                    placeholder="e.g. Computer Based Test (CBT)"
                    className="w-full border border-slate-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 180 Minutes"
                    className="w-full border border-slate-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Total Marks
                  </label>
                  <input
                    type="text"
                    value={formData.totalMarks}
                    onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                    placeholder="e.g. 360 Marks"
                    className="w-full border border-slate-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Eligibility Criteria
                </label>
                <textarea
                  rows={2}
                  value={formData.eligibility}
                  onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                  placeholder="e.g. Top 2,50,000 in JEE Main + 75% in 10+2 with Physics, Chemistry & Math"
                  className="w-full border border-slate-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-purple-600"
                />
              </div>

              {/* Exam Schedule */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-900 block">
                  Important Dates & Schedule Timeline
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-500 font-medium mb-1">
                      App Window
                    </label>
                    <input
                      type="text"
                      value={formData.applicationStart}
                      onChange={(e) => setFormData({ ...formData, applicationStart: e.target.value })}
                      placeholder="e.g. Nov 2025"
                      className="w-full border border-slate-300 rounded p-1.5 bg-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 font-medium mb-1">
                      Admit Card
                    </label>
                    <input
                      type="text"
                      value={formData.admitCardDate}
                      onChange={(e) => setFormData({ ...formData, admitCardDate: e.target.value })}
                      placeholder="e.g. April 2026"
                      className="w-full border border-slate-300 rounded p-1.5 bg-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 font-medium mb-1">
                      Exam Date
                    </label>
                    <input
                      type="text"
                      value={formData.examDate}
                      onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                      placeholder="e.g. May 2026"
                      className="w-full border border-slate-300 rounded p-1.5 bg-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 font-medium mb-1">
                      Results
                    </label>
                    <input
                      type="text"
                      value={formData.resultDate}
                      onChange={(e) => setFormData({ ...formData, resultDate: e.target.value })}
                      placeholder="e.g. June 2026"
                      className="w-full border border-slate-300 rounded p-1.5 bg-white text-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Target Colleges Scope
                </label>
                <input
                  type="text"
                  value={formData.targetCollegesCount}
                  onChange={(e) => setFormData({ ...formData, targetCollegesCount: e.target.value })}
                  placeholder="e.g. 23 IITs, IISc Bangalore, and IIST"
                  className="w-full border border-slate-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Syllabus Highlights (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.syllabusHighlights}
                  onChange={(e) => setFormData({ ...formData, syllabusHighlights: e.target.value })}
                  placeholder="e.g. Physics (Mechanics, Optics), Chemistry, Mathematics (Calculus)"
                  className="w-full border border-slate-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-purple-600"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="btn btn-outline btn-sm text-xs cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="btn btn-primary btn-sm text-xs font-semibold cursor-pointer"
                >
                  {isProcessing ? 'Publishing...' : 'Publish Exam Guide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AdminModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Entrance Exam"
        description={`Are you sure you want to delete "${selectedExam?.name}"?`}
        confirmText="Delete Exam"
        type="danger"
        isLoading={isProcessing}
      >
        <p className="text-slate-600 text-xs">
          This exam guide will be permanently removed from the public Exams directory.
        </p>
      </AdminModal>
    </div>
  )
}

export default ExamManagementPage
