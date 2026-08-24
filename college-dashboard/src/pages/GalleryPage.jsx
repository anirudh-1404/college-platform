import React, { useState } from 'react'
import {
  PageHeader,
  SectionCard,
  SaveBar,
  StatusBadge,
} from '../components/common/UIComponents'
import { Image as ImageIcon, Plus, Trash2, X, Upload } from 'lucide-react'

const GalleryPage = ({
  collegeData,
  onUpdateGallery,
  onPreviewPublic,
}) => {
  const [gallery, setGallery] = useState([...collegeData.gallery])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const [modalForm, setModalForm] = useState({
    title: '',
    category: 'Campus',
    url: '',
  })

  const categories = ['all', 'Campus', 'Library', 'Labs', 'Sports', 'Hostels', 'Events']

  const filteredImages = gallery.filter((img) =>
    selectedCategory === 'all' ? true : img.category === selectedCategory
  )

  const handleOpenAdd = () => {
    setModalForm({
      title: '',
      category: 'Campus',
      url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&h=500&q=80',
    })
    setIsModalOpen(true)
  }

  const handleSaveModal = (e) => {
    e.preventDefault()
    if (!modalForm.title.trim() || !modalForm.url.trim()) return

    const newPhoto = {
      id: `gal-${Date.now()}`,
      title: modalForm.title.trim(),
      category: modalForm.category,
      url: modalForm.url.trim(),
    }

    setGallery([newPhoto, ...gallery])
    setIsModalOpen(false)
    setHasUnsavedChanges(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this photo from the campus gallery?')) {
      setGallery(gallery.filter((img) => img.id !== id))
      setHasUnsavedChanges(true)
    }
  }

  const handleSaveAll = () => {
    if (onUpdateGallery) {
      onUpdateGallery(gallery)
    }
    setHasUnsavedChanges(false)
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  const handleReset = () => {
    setGallery([...collegeData.gallery])
    setHasUnsavedChanges(false)
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Campus Photo Gallery & Media"
        subtitle="Manage official campus photographs, laboratory equipment, auditorium, and student life images."
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
            <span>Upload New Photo</span>
          </button>
        }
      />

      <SectionCard
        title={`Campus Gallery Images (${gallery.length})`}
        description="High-resolution imagery rendered in the public college detail photos tab."
      >
        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                selectedCategory === cat
                  ? 'bg-brand-primary text-white font-bold'
                  : 'bg-slate-100 text-text-secondary hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Photos' : cat}
            </button>
          ))}
        </div>

        {/* Visual Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              className="bg-white border border-border-color rounded-xl overflow-hidden group shadow-2xs hover:shadow-sm transition-shadow flex flex-col justify-between"
            >
              <div className="relative h-44 bg-slate-100 overflow-hidden">
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 text-white text-[10px] font-bold uppercase tracking-wider">
                  {img.category}
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(img.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600/90 text-white hover:bg-red-700 transition-colors shadow-xs cursor-pointer opacity-90 group-hover:opacity-100"
                  title="Delete image"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="p-3">
                <h4 className="font-serif text-xs font-bold text-text-primary line-clamp-1">
                  {img.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Upload Photo Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-border-color p-6 z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-color">
              <h3 className="font-serif text-lg font-bold text-text-primary">
                Add Campus Photograph
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
                  Photo Caption / Title *
                </label>
                <input
                  type="text"
                  required
                  value={modalForm.title}
                  onChange={(e) => setModalForm({ ...modalForm, title: e.target.value })}
                  placeholder="e.g. Nanotechnology Research Laboratory Complex"
                  className="w-full px-3 py-2 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                  Category *
                </label>
                <select
                  value={modalForm.category}
                  onChange={(e) => setModalForm({ ...modalForm, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
                >
                  <option value="Campus">Campus & Lawns</option>
                  <option value="Library">Library</option>
                  <option value="Labs">Laboratories & Tech</option>
                  <option value="Sports">Sports & Arena</option>
                  <option value="Hostels">Hostel Accommodation</option>
                  <option value="Events">Annual Events & Fests</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                  Image Web URL *
                </label>
                <input
                  type="url"
                  required
                  value={modalForm.url}
                  onChange={(e) => setModalForm({ ...modalForm, url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center text-xs text-text-secondary">
                <Upload className="h-5 w-5 text-brand-primary mx-auto mb-1" />
                <span>Drag & drop asset or enter URL above</span>
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
                  <span>Upload to Gallery</span>
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

export default GalleryPage
