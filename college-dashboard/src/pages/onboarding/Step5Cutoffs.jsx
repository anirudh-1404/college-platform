import React, { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { TextInput, SectionCard } from '../../components/common/FormControls'

const Step5Cutoffs = ({ collegeData, onChange, isReadOnly = false }) => {
  const cutoffs = collegeData.admissionCutoffs || []

  const [newRow, setNewRow] = useState({
    exam: 'JEE Advanced 2025',
    course: '',
    generalCutoff: '',
    obcCutoff: '',
    scStCutoff: '',
  })
  const [isAddingInline, setIsAddingInline] = useState(false)

  const handleUpdateCutoff = (index, field, value) => {
    const updated = cutoffs.map((item, idx) =>
      idx === index ? { ...item, [field]: value } : item
    )
    onChange({ ...collegeData, admissionCutoffs: updated })
  }

  const handleRemoveCutoff = (index) => {
    const updated = cutoffs.filter((_, idx) => idx !== index)
    onChange({ ...collegeData, admissionCutoffs: updated })
  }

  const handleAddCutoff = (e) => {
    e.preventDefault()
    if (!newRow.course.trim()) {
      alert('Please enter course / branch name.')
      return
    }

    const row = {
      ...newRow,
      id: `cutoff_${Date.now()}`,
    }
    onChange({
      ...collegeData,
      admissionCutoffs: [...cutoffs, row],
    })

    setNewRow({
      exam: 'JEE Advanced 2025',
      course: '',
      generalCutoff: '',
      obcCutoff: '',
      scStCutoff: '',
    })
    setIsAddingInline(false)
  }

  return (
    <div className="space-y-6">
      <SectionCard
        title="Entrance Exam Cutoff Ranks (Cutoffs Matrix)"
        description="Opening and closing ranks for general, OBC, and SC/ST categories rendered in the public Cutoff & Eligibility table."
        action={
          !isReadOnly && !isAddingInline && (
            <button
              type="button"
              onClick={() => setIsAddingInline(true)}
              className="btn btn-primary btn-sm text-xs cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Cutoff Record</span>
            </button>
          )
        }
      >
        <div className="space-y-4">
          {/* Cutoffs Table */}
          <div className="overflow-x-auto border border-border-color rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-border-color text-text-primary font-bold">
                  <th className="py-3 px-3.5 min-w-[140px]">Entrance Exam</th>
                  <th className="py-3 px-3.5 min-w-[180px]">Branch / Course</th>
                  <th className="py-3 px-3.5 min-w-[120px]">General Cutoff</th>
                  <th className="py-3 px-3.5 min-w-[120px]">OBC Cutoff</th>
                  <th className="py-3 px-3.5 min-w-[120px]">SC / ST Cutoff</th>
                  {!isReadOnly && <th className="py-3 px-3 text-right">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                {cutoffs.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3.5">
                      <input
                        type="text"
                        value={item.exam}
                        onChange={(e) => handleUpdateCutoff(idx, 'exam', e.target.value)}
                        disabled={isReadOnly}
                        className="w-full text-xs font-bold text-brand-primary bg-transparent focus:bg-white focus:ring-1 focus:ring-brand-primary rounded px-1.5 py-1 border border-transparent focus:border-border-color disabled:opacity-90"
                      />
                    </td>
                    <td className="py-2.5 px-3.5">
                      <input
                        type="text"
                        value={item.course}
                        onChange={(e) => handleUpdateCutoff(idx, 'course', e.target.value)}
                        disabled={isReadOnly}
                        className="w-full text-xs font-semibold text-text-primary bg-transparent focus:bg-white focus:ring-1 focus:ring-brand-primary rounded px-1.5 py-1 border border-transparent focus:border-border-color disabled:opacity-90"
                      />
                    </td>
                    <td className="py-2.5 px-3.5">
                      <input
                        type="text"
                        value={item.generalCutoff}
                        onChange={(e) => handleUpdateCutoff(idx, 'generalCutoff', e.target.value)}
                        disabled={isReadOnly}
                        placeholder="e.g. AIR 1 - 67"
                        className="w-full text-xs font-bold text-emerald-600 bg-transparent focus:bg-white focus:ring-1 focus:ring-brand-primary rounded px-1.5 py-1 border border-transparent focus:border-border-color disabled:opacity-90"
                      />
                    </td>
                    <td className="py-2.5 px-3.5">
                      <input
                        type="text"
                        value={item.obcCutoff}
                        onChange={(e) => handleUpdateCutoff(idx, 'obcCutoff', e.target.value)}
                        disabled={isReadOnly}
                        placeholder="e.g. AIR 1 - 32"
                        className="w-full text-xs text-text-secondary bg-transparent focus:bg-white focus:ring-1 focus:ring-brand-primary rounded px-1.5 py-1 border border-transparent focus:border-border-color disabled:opacity-90"
                      />
                    </td>
                    <td className="py-2.5 px-3.5">
                      <input
                        type="text"
                        value={item.scStCutoff}
                        onChange={(e) => handleUpdateCutoff(idx, 'scStCutoff', e.target.value)}
                        disabled={isReadOnly}
                        placeholder="e.g. AIR 1 - 15"
                        className="w-full text-xs text-text-secondary bg-transparent focus:bg-white focus:ring-1 focus:ring-brand-primary rounded px-1.5 py-1 border border-transparent focus:border-border-color disabled:opacity-90"
                      />
                    </td>
                    {!isReadOnly && (
                      <td className="py-2.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveCutoff(idx)}
                          className="p-1 text-text-light hover:text-rose-600 rounded transition-colors cursor-pointer"
                          title="Remove row"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}

                {cutoffs.length === 0 && !isAddingInline && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-text-light">
                      No cutoff rows added yet. Click &quot;Add Cutoff Record&quot; to define entrance ranks.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Inline Add Row Form */}
          {isAddingInline && (
            <div className="p-4 rounded-xl border border-brand-primary/30 bg-purple-50/40 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-brand-primary">
                  Add New Cutoff Rank Record
                </h4>
                <button
                  type="button"
                  onClick={() => setIsAddingInline(false)}
                  className="text-xs text-text-light hover:text-text-primary cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                <TextInput
                  placeholder="Exam (e.g. JEE Advanced 2025)"
                  value={newRow.exam}
                  onChange={(e) => setNewRow({ ...newRow, exam: e.target.value })}
                />
                <TextInput
                  placeholder="Branch / Course Name"
                  value={newRow.course}
                  onChange={(e) => setNewRow({ ...newRow, course: e.target.value })}
                />
                <TextInput
                  placeholder="General Cutoff (e.g. AIR 1 - 67)"
                  value={newRow.generalCutoff}
                  onChange={(e) => setNewRow({ ...newRow, generalCutoff: e.target.value })}
                />
                <TextInput
                  placeholder="OBC Cutoff (e.g. AIR 1 - 32)"
                  value={newRow.obcCutoff}
                  onChange={(e) => setNewRow({ ...newRow, obcCutoff: e.target.value })}
                />
                <TextInput
                  placeholder="SC/ST Cutoff (e.g. AIR 1 - 15)"
                  value={newRow.scStCutoff}
                  onChange={(e) => setNewRow({ ...newRow, scStCutoff: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingInline(false)}
                  className="btn btn-outline btn-sm text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddCutoff}
                  className="btn btn-primary btn-sm text-xs cursor-pointer font-bold"
                >
                  Save Cutoff Row
                </button>
              </div>
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  )
}

export default Step5Cutoffs
