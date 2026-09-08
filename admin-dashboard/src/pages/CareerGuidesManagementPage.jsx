import React, { useState, useMemo, useRef } from 'react'
import {
  Compass,
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  Layers,
  ArrowRight,
  Sparkles,
  Upload,
  Image as ImageIcon,
  X,
  Loader2,
} from 'lucide-react'
import { adminService } from '../data/adminService'
import { AdminModal } from '../components/common/AdminModal'

const CATEGORIES = [
  'Engineering & Technology',
  'Management & Finance',
  'Medical & Healthcare',
  'Law & Legal',
  'Design & Architecture',
  'Applied Sciences',
]

const CareerGuidesManagementPage = ({
  guides = [],
  onAddGuide,
  onDeleteGuide,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  // Modals State
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedGuide, setSelectedGuide] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef(null)

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Engineering & Technology',
    image: '',
    shortDescription: '',
    averageSalary: '₹12 - 25 LPA',
    eligibility: '10+2 with relevant subjects',
    requiredDegrees: 'B.Tech Computer Science, M.Tech',
    targetExams: 'JEE Main, JEE Advanced, GATE',
    topRecruiters: 'Google, Microsoft, Amazon, TCS',
    step1Title: 'Complete Foundational Degree (10+2 & Bachelor\'s)',
    step1Desc: 'Pursue a recognized undergraduate degree with strong core fundamentals.',
    step2Title: 'Master Core Practical Skills & Certifications',
    step2Desc: 'Build real-world projects, secure internships, and earn domain credentials.',
    step3Title: 'Target Tier-1 Recruiters & Campus Placements',
    step3Desc: 'Prepare for technical assessments, portfolio reviews, and campus interviews.',
  })

  const filteredGuides = useMemo(() => {
    return guides.filter((g) => {
      const matchSearch =
        g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.category.toLowerCase().includes(searchQuery.toLowerCase())

      const matchCategory = categoryFilter === 'all' || g.category === categoryFilter

      return matchSearch && matchCategory
    })
  }, [guides, searchQuery, categoryFilter])

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WebP, etc.).')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Image size exceeds 10MB limit.')
      return
    }

    setUploadingImage(true)
    try {
      const url = await adminService.uploadImage(file, 'vidyascope/career_guides')
      setFormData((prev) => ({ ...prev, image: url }))
    } catch (err) {
      alert(err.message || 'Image upload failed. Please try pasting a direct image URL.')
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleConfirmAdd = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      alert('Please enter a career title.')
      return
    }

    setIsProcessing(true)
    try {
      await onAddGuide({
        title: formData.title.trim(),
        category: formData.category,
        image: formData.image.trim(),
        shortDescription: formData.shortDescription.trim(),
        averageSalary: formData.averageSalary.trim(),
        eligibility: formData.eligibility.trim(),
        requiredDegrees: formData.requiredDegrees.split(',').map((s) => s.trim()).filter(Boolean),
        targetExams: formData.targetExams.split(',').map((s) => s.trim()).filter(Boolean),
        topRecruiters: formData.topRecruiters.split(',').map((s) => s.trim()).filter(Boolean),
        roadmapSteps: [
          {
            stepNumber: 1,
            title: formData.step1Title.trim() || 'Foundational Degree',
            description: formData.step1Desc.trim(),
            duration: '3-4 Years',
          },
          {
            stepNumber: 2,
            title: formData.step2Title.trim() || 'Skill Acquisition & Projects',
            description: formData.step2Desc.trim(),
            duration: '1-2 Years',
          },
          {
            stepNumber: 3,
            title: formData.step3Title.trim() || 'Placement & Industry Entry',
            description: formData.step3Desc.trim(),
            duration: 'Ongoing',
          },
        ],
        published: true,
      })

      setAddModalOpen(false)
      setFormData({
        title: '',
        category: 'Engineering & Technology',
        image: '',
        shortDescription: '',
        averageSalary: '₹12 - 25 LPA',
        eligibility: '10+2 with relevant subjects',
        requiredDegrees: '',
        targetExams: '',
        topRecruiters: '',
        step1Title: '',
        step1Desc: '',
        step2Title: '',
        step2Desc: '',
        step3Title: '',
        step3Desc: '',
      })
    } catch (err) {
      alert(err.message || 'Failed to add career guide.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedGuide) return
    setIsProcessing(true)
    try {
      await onDeleteGuide(selectedGuide.id)
      setDeleteModalOpen(false)
      setSelectedGuide(null)
    } catch (err) {
      alert(err.message || 'Failed to delete guide.')
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
            Career Roadmaps & Guidance Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Create and curate official career pathways, salary benchmarks, and degree roadmaps for students.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAddModalOpen(true)}
          className="btn btn-primary btn-md text-xs font-semibold cursor-pointer shadow-2xs self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Career Roadmap</span>
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
            placeholder="Search roadmaps by title..."
            className="w-full pl-8.5 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-600"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-auto text-xs font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-purple-600 cursor-pointer"
        >
          <option value="all">All Categories ({guides.length})</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Guides Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                <th className="py-3 px-4 min-w-[200px]">Career Roadmap Title</th>
                <th className="py-3 px-4 min-w-[150px]">Academic Category</th>
                <th className="py-3 px-4 min-w-[120px]">Salary Benchmark</th>
                <th className="py-3 px-4 min-w-[100px]">Roadmap Steps</th>
                <th className="py-3 px-4 min-w-[100px]">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGuides.map((guide) => (
                <tr key={guide.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-9 rounded-md bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                        {guide.image ? (
                          <img
                            src={guide.image}
                            alt={guide.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <Compass className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{guide.title}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {guide.shortDescription || 'Educational roadmap.'}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-slate-700 font-medium">
                    {guide.category}
                  </td>

                  <td className="py-3 px-4 font-semibold text-emerald-600">
                    {guide.averageSalary || '₹12 - 25 LPA'}
                  </td>

                  <td className="py-3 px-4 text-slate-600">
                    {guide.roadmapSteps?.length || 3} Milestones
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
                        setSelectedGuide(guide)
                        setDeleteModalOpen(true)
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                      title="Delete Roadmap"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredGuides.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-slate-400 space-y-2">
                    <Compass className="h-8 w-8 text-slate-300 mx-auto" />
                    <p className="font-semibold text-slate-700">No Career Roadmaps Added Yet</p>
                    <p className="text-slate-400 max-w-sm mx-auto">
                      Click "+ Add Career Roadmap" above to publish your first career roadmap directly to the VidyaScope website.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Career Roadmap Modal */}
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
                  Create New Career Roadmap
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  This roadmap will be published live on the VidyaScope Career Guidance portal.
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
                    Career Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. AI & Machine Learning Engineer"
                    className="w-full border border-slate-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>

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
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Overview of the career path, core responsibilities, and industry impact..."
                  className="w-full border border-slate-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-purple-600"
                />
              </div>

              {/* Cover Picture / Banner Image */}
              <div className="space-y-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-slate-700">
                    Career Cover Picture / Banner
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Displayed on homepage cards & reader view
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-start">
                  {/* Live Image Preview */}
                  {formData.image ? (
                    <div className="relative w-full sm:w-44 aspect-[16/9] rounded-lg overflow-hidden border border-purple-200 bg-white shadow-2xs group shrink-0">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: '' })}
                        className="absolute top-1.5 right-1.5 p-1 bg-slate-900/70 hover:bg-rose-600 text-white rounded-full transition-colors cursor-pointer"
                        title="Remove image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full sm:w-44 aspect-[16/9] rounded-lg border-2 border-dashed border-slate-300 hover:border-purple-400 bg-white flex flex-col items-center justify-center text-slate-400 hover:text-purple-600 transition-colors cursor-pointer shrink-0"
                    >
                      {uploadingImage ? (
                        <div className="flex flex-col items-center gap-1">
                          <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                          <span className="text-[10px] font-semibold text-slate-600">Uploading...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          <Upload className="w-5 h-5 text-slate-400" />
                          <span className="text-[10px] font-semibold">Upload Photo</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* URL and Upload Controls */}
                  <div className="flex-1 w-full space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="Paste image URL (e.g. Unsplash or hosted photo link)..."
                        className="flex-1 border border-slate-300 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-purple-600 bg-white"
                      />
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        disabled={uploadingImage}
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors shrink-0"
                      >
                        {uploadingImage ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Upload className="w-3.5 h-3.5" />
                        )}
                        <span>{uploadingImage ? 'Uploading...' : 'Browse'}</span>
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-400 leading-tight">
                      Supported formats: PNG, JPG, WebP (up to 10MB). Or paste any direct HTTPS image URL.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Average Salary Benchmark
                  </label>
                  <input
                    type="text"
                    value={formData.averageSalary}
                    onChange={(e) => setFormData({ ...formData, averageSalary: e.target.value })}
                    placeholder="e.g. ₹15 - 30 LPA"
                    className="w-full border border-slate-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Basic Eligibility
                  </label>
                  <input
                    type="text"
                    value={formData.eligibility}
                    onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                    placeholder="e.g. 10+2 with PCM (min 60%)"
                    className="w-full border border-slate-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Required Degrees (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.requiredDegrees}
                    onChange={(e) => setFormData({ ...formData, requiredDegrees: e.target.value })}
                    placeholder="B.Tech CSE, M.Tech, MCA"
                    className="w-full border border-slate-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Target Exams (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.targetExams}
                    onChange={(e) => setFormData({ ...formData, targetExams: e.target.value })}
                    placeholder="JEE Advanced, GATE"
                    className="w-full border border-slate-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Top Recruiters (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.topRecruiters}
                    onChange={(e) => setFormData({ ...formData, topRecruiters: e.target.value })}
                    placeholder="Google, Microsoft, Meta"
                    className="w-full border border-slate-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>
              </div>

              {/* Roadmap Milestones */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <span className="font-bold text-slate-900 block">
                  Step-by-Step Educational Pathway (3 Milestones)
                </span>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <span className="font-semibold text-purple-700 block">Milestone 1 (Foundation)</span>
                  <input
                    type="text"
                    value={formData.step1Title}
                    onChange={(e) => setFormData({ ...formData, step1Title: e.target.value })}
                    placeholder="Milestone 1 Title (e.g. Clear 10+2 & Pursue B.Tech in CSE)"
                    className="w-full border border-slate-300 rounded p-1.5 bg-white"
                  />
                  <input
                    type="text"
                    value={formData.step1Desc}
                    onChange={(e) => setFormData({ ...formData, step1Desc: e.target.value })}
                    placeholder="Details (e.g. Build foundation in Calculus, Linear Algebra, and Data Structures)"
                    className="w-full border border-slate-300 rounded p-1.5 bg-white"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <span className="font-semibold text-purple-700 block">Milestone 2 (Skill Acquisition)</span>
                  <input
                    type="text"
                    value={formData.step2Title}
                    onChange={(e) => setFormData({ ...formData, step2Title: e.target.value })}
                    placeholder="Milestone 2 Title (e.g. Master PyTorch, Deep Learning & Projects)"
                    className="w-full border border-slate-300 rounded p-1.5 bg-white"
                  />
                  <input
                    type="text"
                    value={formData.step2Desc}
                    onChange={(e) => setFormData({ ...formData, step2Desc: e.target.value })}
                    placeholder="Details (e.g. Publish open-source models and complete summer research internships)"
                    className="w-full border border-slate-300 rounded p-1.5 bg-white"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <span className="font-semibold text-purple-700 block">Milestone 3 (Industry Entry)</span>
                  <input
                    type="text"
                    value={formData.step3Title}
                    onChange={(e) => setFormData({ ...formData, step3Title: e.target.value })}
                    placeholder="Milestone 3 Title (e.g. Crack Campus Placements & Off-Campus Hiring)"
                    className="w-full border border-slate-300 rounded p-1.5 bg-white"
                  />
                  <input
                    type="text"
                    value={formData.step3Desc}
                    onChange={(e) => setFormData({ ...formData, step3Desc: e.target.value })}
                    placeholder="Details (e.g. Clear system design rounds and join as Associate ML Engineer)"
                    className="w-full border border-slate-300 rounded p-1.5 bg-white"
                  />
                </div>
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
                  {isProcessing ? 'Publishing...' : 'Publish Roadmap'}
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
        title="Delete Career Roadmap"
        description={`Are you sure you want to delete "${selectedGuide?.title}"?`}
        confirmText="Delete Roadmap"
        type="danger"
        isLoading={isProcessing}
      >
        <p className="text-slate-600 text-xs">
          This roadmap will be permanently removed from the public Career Guidance page.
        </p>
      </AdminModal>
    </div>
  )
}

export default CareerGuidesManagementPage
