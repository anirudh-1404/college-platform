import React, { useState } from 'react'
import { Plus, Trash2, Award, ShieldCheck } from 'lucide-react'
import { FormField, TextInput, TagInput, SectionCard } from '../../components/common/FormControls'

const Step7Rankings = ({ collegeData, onChange, isReadOnly = false }) => {
  // Always resolve an array for the table repeater to prevent rankings.map is not a function runtime crash
  const rankings = Array.isArray(collegeData.additionalRankings)
    ? collegeData.additionalRankings
    : (Array.isArray(collegeData.rankings)
        ? collegeData.rankings
        : (Array.isArray(collegeData.rankings?.otherRankings)
            ? collegeData.rankings.otherRankings.map((item, idx) => {
                if (typeof item === 'object' && item !== null) return item
                const parts = String(item).split(':')
                const agency = parts[0]?.trim() || String(item)
                let rest = parts.slice(1).join(':').trim()
                let category = 'General'
                const catMatch = rest.match(/\(([^)]+)\)$/)
                if (catMatch) {
                  category = catMatch[1]
                  rest = rest.replace(/\s*\([^)]+\)$/, '').trim()
                }
                return {
                  id: `rank_${idx}_${Date.now()}`,
                  agency,
                  year: '2025',
                  rank: rest || '',
                  category,
                }
              })
            : []
          )
      )

  const [newRanking, setNewRanking] = useState({
    agency: '',
    year: '2025',
    rank: '',
    category: '',
  })
  const [isAddingRow, setIsAddingRow] = useState(false)

  const handleChange = (field, value) => {
    onChange({
      ...collegeData,
      additionalRankings: rankings,
      [field]: value,
    })
  }

  const handleUpdateRanking = (index, field, value) => {
    const updated = rankings.map((r, idx) =>
      idx === index ? { ...r, [field]: value } : r
    )
    onChange({
      ...collegeData,
      additionalRankings: updated,
      ...(Array.isArray(collegeData.rankings) ? { rankings: updated } : {}),
    })
  }

  const handleRemoveRanking = (index) => {
    const updated = rankings.filter((_, idx) => idx !== index)
    onChange({
      ...collegeData,
      additionalRankings: updated,
      ...(Array.isArray(collegeData.rankings) ? { rankings: updated } : {}),
    })
  }

  const handleAddRanking = (e) => {
    e.preventDefault()
    if (!newRanking.agency.trim() || !newRanking.rank.trim()) {
      alert('Please fill ranking agency and rank.')
      return
    }

    const row = {
      ...newRanking,
      id: `rank_${Date.now()}`,
    }
    const updated = [...rankings, row]
    onChange({
      ...collegeData,
      additionalRankings: updated,
      ...(Array.isArray(collegeData.rankings) ? { rankings: updated } : {}),
    })
    setNewRanking({ agency: '', year: '2025', rank: '', category: '' })
    setIsAddingRow(false)
  }

  const handleNirfRankChange = (val) => {
    const parsed = parseInt(val, 10) || ''
    const currentRankingsObj = (typeof collegeData.rankings === 'object' && !Array.isArray(collegeData.rankings))
      ? collegeData.rankings
      : {}
    onChange({
      ...collegeData,
      nirfRank: parsed,
      additionalRankings: rankings,
      rankings: {
        ...currentRankingsObj,
        nirfRank: parsed,
      },
    })
  }

  const handleNirfCategoryChange = (val) => {
    const currentRankingsObj = (typeof collegeData.rankings === 'object' && !Array.isArray(collegeData.rankings))
      ? collegeData.rankings
      : {}
    onChange({
      ...collegeData,
      nirfCategory: val,
      additionalRankings: rankings,
      rankings: {
        ...currentRankingsObj,
        nirfCategory: val,
      },
    })
  }

  const handleNaacGradeChange = (val) => {
    const currentRankingsObj = (typeof collegeData.rankings === 'object' && !Array.isArray(collegeData.rankings))
      ? collegeData.rankings
      : {}
    onChange({
      ...collegeData,
      naacGrade: val,
      additionalRankings: rankings,
      rankings: {
        ...currentRankingsObj,
        naacGrade: val,
      },
    })
  }

  const nirfRankValue = collegeData.nirfRank ?? (typeof collegeData.rankings === 'object' && !Array.isArray(collegeData.rankings) ? collegeData.rankings?.nirfRank : '') ?? ''
  const nirfCategoryValue = collegeData.nirfCategory || (typeof collegeData.rankings === 'object' && !Array.isArray(collegeData.rankings) ? collegeData.rankings?.nirfCategory : '') || ''
  const naacGradeValue = collegeData.naacGrade || (typeof collegeData.rankings === 'object' && !Array.isArray(collegeData.rankings) ? collegeData.rankings?.naacGrade : '') || ''

  return (
    <div className="space-y-6">
      {/* 1. Primary Government & Regulatory Accreditations */}
      <SectionCard
        title="Primary Government Accreditations & NIRF"
        description="Core institutional certifications rendered across header badges and listings."
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Primary NIRF Rank"
              required
              helperText="e.g. 3 (Powers the NIRF #3 badge and sort filters)"
            >
              <TextInput
                type="number"
                value={nirfRankValue}
                onChange={(e) => handleNirfRankChange(e.target.value)}
                placeholder="3"
                disabled={isReadOnly}
                icon={Award}
                prefix="#"
              />
            </FormField>

            <FormField
              label="NIRF Stream / Category"
              helperText="e.g. Engineering, Management, Medical"
            >
              <TextInput
                value={nirfCategoryValue}
                onChange={(e) => handleNirfCategoryChange(e.target.value)}
                placeholder="Engineering"
                disabled={isReadOnly}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="NAAC Accreditation Grade"
              helperText="e.g. A++ (3.88 CGPA)"
            >
              <TextInput
                value={naacGradeValue}
                onChange={(e) => handleNaacGradeChange(e.target.value)}
                placeholder="A++ (3.88 CGPA)"
                disabled={isReadOnly}
                icon={ShieldCheck}
              />
            </FormField>

            <FormField
              label="Affiliation / University Body"
              helperText="e.g. Autonomous (Ministry of Education, GoI)"
            >
              <TextInput
                value={collegeData.affiliation || ''}
                onChange={(e) => handleChange('affiliation', e.target.value)}
                placeholder="Autonomous National University"
                disabled={isReadOnly}
              />
            </FormField>
          </div>

          <FormField
            label="College Feature Badges / Tags"
            helperText="Badges displayed on public cards. Type and press enter."
          >
            <TagInput
              tags={Array.isArray(collegeData.tags) ? collegeData.tags : []}
              onChange={(tags) => handleChange('tags', tags)}
              placeholder="e.g. Government, NIRF #3, NAAC A++, IoE..."
              disabled={isReadOnly}
            />
          </FormField>
        </div>
      </SectionCard>

      {/* 2. Additional Agency Rankings List */}
      <SectionCard
        title="National & Global Ranking Accreditations"
        description="Add performance rankings from QS World Rankings, NIRF, Times Higher Education, India Today, etc."
        action={
          !isReadOnly && !isAddingRow && (
            <button
              type="button"
              onClick={() => setIsAddingRow(true)}
              className="btn btn-primary btn-sm text-xs cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Ranking</span>
            </button>
          )
        }
      >
        <div className="space-y-4">
          <div className="overflow-x-auto border border-border-color rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-border-color text-text-primary font-bold">
                  <th className="py-3 px-3.5 min-w-[160px]">Ranking Agency</th>
                  <th className="py-3 px-3.5 min-w-[80px]">Year</th>
                  <th className="py-3 px-3.5 min-w-[140px]">Rank Conferred</th>
                  <th className="py-3 px-3.5 min-w-[160px]">Discipline / Category</th>
                  {!isReadOnly && <th className="py-3 px-3 text-right">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                {rankings.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-slate-50/50">
                    <td className="py-2 px-3.5 font-bold text-brand-primary">
                      <input
                        type="text"
                        value={item.agency}
                        onChange={(e) => handleUpdateRanking(idx, 'agency', e.target.value)}
                        disabled={isReadOnly}
                        className="w-full bg-transparent text-xs font-bold text-brand-primary rounded p-1 border border-transparent focus:border-border-color focus:bg-white"
                      />
                    </td>
                    <td className="py-2 px-3.5">
                      <input
                        type="text"
                        value={item.year}
                        onChange={(e) => handleUpdateRanking(idx, 'year', e.target.value)}
                        disabled={isReadOnly}
                        className="w-full bg-transparent text-xs text-text-secondary rounded p-1 border border-transparent focus:border-border-color focus:bg-white"
                      />
                    </td>
                    <td className="py-2 px-3.5">
                      <input
                        type="text"
                        value={item.rank}
                        onChange={(e) => handleUpdateRanking(idx, 'rank', e.target.value)}
                        disabled={isReadOnly}
                        className="w-full bg-transparent text-xs font-bold text-emerald-600 rounded p-1 border border-transparent focus:border-border-color focus:bg-white"
                      />
                    </td>
                    <td className="py-2 px-3.5">
                      <input
                        type="text"
                        value={item.category}
                        onChange={(e) => handleUpdateRanking(idx, 'category', e.target.value)}
                        disabled={isReadOnly}
                        className="w-full bg-transparent text-xs text-text-primary rounded p-1 border border-transparent focus:border-border-color focus:bg-white"
                      />
                    </td>
                    {!isReadOnly && (
                      <td className="py-2 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveRanking(idx)}
                          className="p-1 text-text-light hover:text-rose-600 rounded cursor-pointer"
                          title="Remove ranking"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}

                {rankings.length === 0 && !isAddingRow && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-xs text-text-light">
                      No additional rankings recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Inline Add Ranking Form */}
          {isAddingRow && (
            <div className="p-4 rounded-xl border border-brand-primary/30 bg-purple-50/40 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-brand-primary">Add Ranking Entry</h4>
                <button
                  type="button"
                  onClick={() => setIsAddingRow(false)}
                  className="text-xs text-text-light hover:text-text-primary cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <TextInput
                  placeholder="Agency (e.g. QS World Rankings)"
                  value={newRanking.agency}
                  onChange={(e) => setNewRanking({ ...newRanking, agency: e.target.value })}
                />
                <TextInput
                  placeholder="Year (e.g. 2025)"
                  value={newRanking.year}
                  onChange={(e) => setNewRanking({ ...newRanking, year: e.target.value })}
                />
                <TextInput
                  placeholder="Rank (e.g. #118 Worldwide)"
                  value={newRanking.rank}
                  onChange={(e) => setNewRanking({ ...newRanking, rank: e.target.value })}
                />
                <TextInput
                  placeholder="Category (e.g. Top in India)"
                  value={newRanking.category}
                  onChange={(e) => setNewRanking({ ...newRanking, category: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingRow(false)}
                  className="btn btn-outline btn-sm text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddRanking}
                  className="btn btn-primary btn-sm text-xs cursor-pointer font-bold"
                >
                  Save Ranking
                </button>
              </div>
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  )
}

export default Step7Rankings
