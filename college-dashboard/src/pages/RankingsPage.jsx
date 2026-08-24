import React, { useState } from 'react'
import {
  PageHeader,
  SectionCard,
  SaveBar,
  StatusBadge,
} from '../components/common/UIComponents'
import { Award, Plus, Trash2, Edit2, X } from 'lucide-react'

const RankingsPage = ({
  collegeData,
  onUpdateRankings,
  onPreviewPublic,
}) => {
  const [rankings, setRankings] = useState([...collegeData.rankings])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const [modalForm, setModalForm] = useState({
    agency: '',
    year: '2025',
    rank: '',
    category: '',
  })

  const handleOpenAdd = () => {
    setEditingIndex(null)
    setModalForm({
      agency: '',
      year: '2025',
      rank: '#1 in India',
      category: 'Engineering & Technology',
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (index) => {
    setEditingIndex(index)
    setModalForm({ ...rankings[index] })
    setIsModalOpen(true)
  }

  const handleSaveModal = (e) => {
    e.preventDefault()
    if (editingIndex !== null) {
      const updated = rankings.map((r, idx) => (idx === editingIndex ? { ...modalForm } : r))
      setRankings(updated)
    } else {
      setRankings([...rankings, { ...modalForm }])
    }
    setIsModalOpen(false)
    setHasUnsavedChanges(true)
  }

  const handleDeleteRanking = (index) => {
    if (window.confirm('Delete this ranking entry?')) {
      setRankings(rankings.filter((_, idx) => idx !== index))
      setHasUnsavedChanges(true)
    }
  }

  const handleSaveAll = () => {
    if (onUpdateRankings) {
      onUpdateRankings(rankings)
    }
    setHasUnsavedChanges(false)
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  const handleReset = () => {
    setRankings([...collegeData.rankings])
    setHasUnsavedChanges(false)
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Rankings, NIRF & Accreditations"
        subtitle="Manage government rankings, global benchmarking (QS/THE), and media ranking recognitions."
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
            <span>Add Ranking Entry</span>
          </button>
        }
      />

      <SectionCard
        title={`Institutional Rankings (${rankings.length})`}
        description="Public ranking badges displayed on the college profile rankings tab."
      >
        <div className="overflow-x-auto custom-scrollbar border border-border-color rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-border-color text-text-secondary font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Ranking Body / Agency</th>
                <th className="py-3 px-4">Evaluation Year</th>
                <th className="py-3 px-4">Rank Secured</th>
                <th className="py-3 px-4">Category / Domain</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color bg-white">
              {rankings.map((ranking, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-serif font-bold text-text-primary text-xs sm:text-sm">
                    {ranking.agency}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-text-secondary">
                    {ranking.year}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-brand-primary">
                    <span className="px-2 py-0.5 rounded bg-brand-accent text-brand-primary">
                      {ranking.rank}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-text-secondary">
                    {ranking.category}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(idx)}
                      className="p-1.5 rounded-lg text-text-secondary hover:text-brand-primary hover:bg-brand-accent transition-colors cursor-pointer"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteRanking(idx)}
                      className="p-1.5 rounded-lg text-text-secondary hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-border-color p-6 z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-color">
              <h3 className="font-serif text-lg font-bold text-text-primary">
                {editingIndex !== null ? 'Edit Ranking' : 'Add Ranking Entry'}
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
                  Ranking Agency / Body *
                </label>
                <input
                  type="text"
                  required
                  value={modalForm.agency}
                  onChange={(e) => setModalForm({ ...modalForm, agency: e.target.value })}
                  placeholder="e.g. NIRF Engineering / QS World Rankings"
                  className="w-full px-3 py-2 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                    Evaluation Year *
                  </label>
                  <input
                    type="text"
                    required
                    value={modalForm.year}
                    onChange={(e) => setModalForm({ ...modalForm, year: e.target.value })}
                    placeholder="e.g. 2025"
                    className="w-full px-3 py-2 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                    Rank Secured *
                  </label>
                  <input
                    type="text"
                    required
                    value={modalForm.rank}
                    onChange={(e) => setModalForm({ ...modalForm, rank: e.target.value })}
                    placeholder="e.g. #3 in India"
                    className="w-full px-3 py-2 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                  Category / Domain *
                </label>
                <input
                  type="text"
                  required
                  value={modalForm.category}
                  onChange={(e) => setModalForm({ ...modalForm, category: e.target.value })}
                  placeholder="e.g. Engineering & Technology"
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
                  <span>Save Entry</span>
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

export default RankingsPage
