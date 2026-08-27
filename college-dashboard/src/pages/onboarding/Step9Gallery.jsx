import React, { useState, useRef } from 'react'
import { Plus, Trash2, Image as ImageIcon, Upload, Eye, X, Check } from 'lucide-react'
import { FormField, TextInput, SelectInput, SectionCard } from '../../components/common/FormControls'

const SAMPLE_IMAGE_OPTIONS = [
  { label: 'Main Academic Quadrangle', url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80', category: 'Campus' },
  { label: 'Central Library Digital Learning Hub', url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80', category: 'Library' },
  { label: 'Advanced Supercomputing Lab', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', category: 'Labs' },
  { label: 'Olympic Sports Turf & Swimming Arena', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80', category: 'Sports' },
  { label: 'Hostel Residential Complex', url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80', category: 'Hostels' },
  { label: 'Convocation Ceremony Auditorium', url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80', category: 'Events' },
]

const Step9Gallery = ({ collegeData, onChange, isReadOnly = false }) => {
  const gallery = collegeData.gallery || []
  const fileInputRef = useRef(null)

  const [newImage, setNewImage] = useState({
    url: '',
    title: '',
    category: 'Campus',
  })
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [selectedPreview, setSelectedPreview] = useState(null)

  const handleRemoveImage = (index) => {
    const updated = gallery.filter((_, idx) => idx !== index)
    onChange({ ...collegeData, gallery: updated })
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      alert('Image file exceeds 5MB limit.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setNewImage((prev) => ({
        ...prev,
        url: reader.result,
        title: prev.title || file.name.replace(/\.[^/.]+$/, ''),
      }))
    }
    reader.readAsDataURL(file)
  }

  const handleAddImageToGallery = (e) => {
    e.preventDefault()
    if (!newImage.url.trim()) {
      alert('Please provide an image URL or upload a file.')
      return
    }

    onChange({
      ...collegeData,
      gallery: [...gallery, newImage.url],
    })

    setNewImage({ url: '', title: '', category: 'Campus' })
    setIsAddingNew(false)
  }

  const handleQuickAddSample = (sampleUrl) => {
    if (gallery.includes(sampleUrl)) return
    onChange({
      ...collegeData,
      gallery: [...gallery, sampleUrl],
    })
  }

  return (
    <div className="space-y-6">
      <SectionCard
        title="Campus Photo & Media Manager"
        description="High-definition campus photography displayed in the 'Campus Gallery' tab on the public website."
        action={
          !isReadOnly && (
            <button
              type="button"
              onClick={() => setIsAddingNew(true)}
              className="btn btn-primary btn-sm text-xs cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Campus Photo</span>
            </button>
          )
        }
      >
        <div className="space-y-5">
          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.map((imgUrl, idx) => (
              <div
                key={idx}
                className="group relative rounded-xl overflow-hidden border border-border-color bg-slate-100 aspect-video shadow-2xs"
              >
                <img
                  src={imgUrl}
                  alt={`Campus Photo ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Overlay controls */}
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPreview(imgUrl)}
                    className="p-2 rounded-lg bg-white/20 hover:bg-white text-white hover:text-text-primary transition-colors cursor-pointer"
                    title="Enlarge preview"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="p-2 rounded-lg bg-rose-500/80 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                  Photo #{idx + 1}
                </div>
              </div>
            ))}

            {gallery.length === 0 && !isAddingNew && (
              <div className="col-span-full py-10 text-center border-2 border-dashed border-border-color rounded-xl space-y-2">
                <ImageIcon className="h-8 w-8 text-brand-primary mx-auto opacity-70" />
                <p className="text-xs font-bold text-text-primary">No Campus Photos in Gallery</p>
                <p className="text-[11px] text-text-light">
                  Upload campus photos to visually present your facilities to prospective students.
                </p>
              </div>
            )}
          </div>

          {/* Add Image Form */}
          {isAddingNew && (
            <div className="p-4 rounded-xl border border-brand-primary/30 bg-purple-50/40 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-brand-primary">Upload or Link New Campus Photo</h4>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="text-xs text-text-light hover:text-text-primary cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <FormField label="Image URL (or upload below)" required>
                    <TextInput
                      placeholder="https://images.unsplash.com/..."
                      value={newImage.url}
                      onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
                    />
                  </FormField>

                  <div className="mt-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn btn-outline btn-sm text-xs w-full cursor-pointer"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>Or Browse Local Image File (Max 5MB)</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <FormField label="Category">
                    <SelectInput
                      value={newImage.category}
                      onChange={(e) => setNewImage({ ...newImage, category: e.target.value })}
                      options={['Campus', 'Library', 'Labs', 'Sports', 'Hostels', 'Events', 'Classrooms']}
                    />
                  </FormField>

                  <FormField label="Caption / Title" optional>
                    <TextInput
                      placeholder="e.g. Central Computing Facility"
                      value={newImage.title}
                      onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                    />
                  </FormField>
                </div>
              </div>

              {/* Preview Box if selected */}
              {newImage.url && (
                <div className="p-2 bg-white rounded-lg border border-border-color flex items-center gap-3">
                  <img
                    src={newImage.url}
                    alt="Preview"
                    className="w-16 h-12 object-cover rounded"
                  />
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" /> Image ready to save
                  </span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-purple-200">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="btn btn-outline btn-sm text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddImageToGallery}
                  className="btn btn-primary btn-sm text-xs cursor-pointer font-bold"
                >
                  Save Photo to Gallery
                </button>
              </div>
            </div>
          )}

          {/* Quick Demo Gallery Stock Samples */}
          {!isReadOnly && (
            <div className="pt-2 border-t border-border-color">
              <span className="text-[11px] font-semibold text-text-light block mb-2">
                Quick Add High-Quality Demo Infrastructure Photos:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {SAMPLE_IMAGE_OPTIONS.map((sample, idx) => {
                  const isAdded = gallery.includes(sample.url)
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleQuickAddSample(sample.url)}
                      disabled={isAdded}
                      className={`text-left p-1.5 rounded-lg border text-[10px] transition-all cursor-pointer ${
                        isAdded
                          ? 'bg-slate-100 border-slate-200 text-text-light cursor-default opacity-60'
                          : 'bg-white border-border-color hover:border-brand-primary hover:bg-brand-accent/20'
                      }`}
                    >
                      <img
                        src={sample.url}
                        alt={sample.label}
                        className="w-full h-12 object-cover rounded mb-1"
                      />
                      <p className="font-semibold text-text-primary truncate">{sample.label}</p>
                      <span className="text-[9px] text-text-light">{isAdded ? '✓ Added' : '+ Add Photo'}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </SectionCard>

      {/* Image Modal Lightbox */}
      {selectedPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedPreview(null)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
          />
          <div className="relative max-w-3xl w-full z-10">
            <button
              onClick={() => setSelectedPreview(null)}
              className="absolute -top-10 right-0 text-white hover:text-slate-300 cursor-pointer p-1"
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={selectedPreview}
              alt="Enlarged campus preview"
              className="w-full rounded-2xl max-h-[80vh] object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Step9Gallery
