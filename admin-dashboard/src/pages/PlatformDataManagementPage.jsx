import React, { useState } from 'react'
import {
  Star,
  Plus,
  Trash2,
  CheckCircle2,
} from 'lucide-react'

const PlatformDataManagementPage = ({
  profiles = [],
  onUpdatePlatformData,
}) => {
  const [selectedCollegeId, setSelectedCollegeId] = useState(profiles[0]?.id || 'iit-bombay')
  const [saveSuccess, setSaveSuccess] = useState(false)

  const currentProfile = profiles.find((p) => p.id === selectedCollegeId) || profiles[0]

  const [rating, setRating] = useState(currentProfile?.rating || 4.9)
  const [reviewsCount, setReviewsCount] = useState(currentProfile?.reviewsCount || 2450)
  const [pros, setPros] = useState(
    currentProfile?.prosAndCons?.pros || [
      'Unmatched peer group and research culture',
      'Top placement packages across tech and finance',
      '550-acre lush green campus',
    ]
  )
  const [cons, setCons] = useState(
    currentProfile?.prosAndCons?.cons || [
      'High academic rigor and semester workload',
      'Strict relative grading policy in core courses',
    ]
  )

  const [newPro, setNewPro] = useState('')
  const [newCon, setNewCon] = useState('')

  const handleSelectCollege = (id) => {
    setSelectedCollegeId(id)
    const prof = profiles.find((p) => p.id === id)
    if (prof) {
      setRating(prof.rating || 4.8)
      setReviewsCount(prof.reviewsCount || 1500)
      setPros(prof.prosAndCons?.pros || ['Strong academic culture', 'Top recruiters'])
      setCons(prof.prosAndCons?.cons || ['Demanding coursework'])
    }
  }

  const handleAddPro = () => {
    if (!newPro.trim()) return
    setPros([...pros, newPro.trim()])
    setNewPro('')
  }

  const handleRemovePro = (index) => {
    setPros(pros.filter((_, i) => i !== index))
  }

  const handleAddCon = () => {
    if (!newCon.trim()) return
    setCons([...cons, newCon.trim()])
    setNewCon('')
  }

  const handleRemoveCon = (index) => {
    setCons(cons.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    onUpdatePlatformData(selectedCollegeId, {
      rating: parseFloat(rating) || 4.9,
      reviewsCount: parseInt(reviewsCount, 10) || 2450,
      prosAndCons: {
        pros,
        cons,
      },
    })
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Platform Data & Ratings
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage student star ratings, reviews count, and verified pros/cons.
          </p>
        </div>

        {/* College Selector */}
        <select
          value={selectedCollegeId}
          onChange={(e) => handleSelectCollege(e.target.value)}
          className="text-xs font-medium text-slate-900 bg-white border border-slate-200 rounded-lg py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-purple-600 cursor-pointer"
        >
          {profiles.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Editor Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-2xs">
        
        {/* Rating & Reviews */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Student Star Rating (1.0 to 5.0)
            </label>
            <input
              type="number"
              step="0.1"
              min="1.0"
              max="5.0"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full text-xs font-medium text-slate-900 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Verified Reviews Count
            </label>
            <input
              type="number"
              value={reviewsCount}
              onChange={(e) => setReviewsCount(e.target.value)}
              className="w-full text-xs font-medium text-slate-900 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-600"
            />
          </div>
        </div>

        {/* Pros and Cons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Pros */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-emerald-800 block">
              Verified Advantages (Pros)
            </span>

            <div className="space-y-1.5">
              {pros.map((pro, idx) => (
                <div key={idx} className="p-2 rounded bg-slate-50 border border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <span className="text-slate-700">{pro}</span>
                  <button
                    type="button"
                    onClick={() => handleRemovePro(idx)}
                    className="text-slate-400 hover:text-red-600 p-0.5 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={newPro}
                onChange={(e) => setNewPro(e.target.value)}
                placeholder="Add positive point..."
                className="flex-1 text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
              <button
                type="button"
                onClick={handleAddPro}
                className="btn btn-secondary btn-sm text-xs cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Cons */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-amber-800 block">
              Points to Consider (Cons)
            </span>

            <div className="space-y-1.5">
              {cons.map((con, idx) => (
                <div key={idx} className="p-2 rounded bg-slate-50 border border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <span className="text-slate-700">{con}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCon(idx)}
                    className="text-slate-400 hover:text-red-600 p-0.5 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={newCon}
                onChange={(e) => setNewCon(e.target.value)}
                placeholder="Add consideration..."
                className="flex-1 text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-600"
              />
              <button
                type="button"
                onClick={handleAddCon}
                className="btn btn-secondary btn-sm text-xs cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            {saveSuccess && (
              <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Saved successfully</span>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="btn btn-primary btn-md text-xs font-semibold cursor-pointer"
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  )
}

export default PlatformDataManagementPage
