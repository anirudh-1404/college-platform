import React, { useState, useRef } from 'react'
import { Plus, Trash2, Image as ImageIcon, Upload, Eye, X, Check, Loader2, Link as LinkIcon, AlertCircle } from 'lucide-react'
import { FormField, TextInput, SelectInput, SectionCard } from '../../components/common/FormControls'
import { collegeService } from '../../data/collegeService'

const SAMPLE_IMAGE_OPTIONS = [
  { label: 'Main Academic Quadrangle', url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80', category: 'Campus' },
  { label: 'Central Library Digital Learning Hub', url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80', category: 'Library' },
  { label: 'Advanced Supercomputing Lab', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', category: 'Labs' },
  { label: 'Olympic Sports Turf & Swimming Arena', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80', category: 'Sports' },
  { label: 'Hostel Residential Complex', url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80', category: 'Hostels' },
  { label: 'Convocation Ceremony Auditorium', url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80', category: 'Events' },
]

const Step9Gallery = ({ collegeData, onChange, isReadOnly = false }) => {
  const gallery = Array.isArray(collegeData.gallery) ? collegeData.gallery : []
  const fileInputRef = useRef(null)

  const [newImage, setNewImage] = useState({
    url: '',
    title: '',
    category: 'Campus',
  })
  const [inputMode, setInputMode] = useState('url') // 'url' | 'upload'
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [selectedPreview, setSelectedPreview] = useState(null)

  const handleRemoveImage = (index) => {
    const updated = gallery.filter((_, idx) => idx !== index)
    onChange({ ...collegeData, gallery: updated })
  }

  const handleFileUpload = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setUploadError('Only image files (PNG, JPG, WebP) are allowed.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image file exceeds 10MB limit.')
      return
    }

    setIsUploading(true)
    setUploadError('')
    try {
      const uploadedUrl = await collegeService.uploadImage(file, 'vidyascope/colleges')
      setNewImage((prev) => ({
        ...prev,
        url: uploadedUrl,
        title: prev.title || file.name.replace(/\.[^/.]+$/, ''),
      }))
    } catch (err) {
      console.warn('Cloudinary upload error, using local data URL fallback:', err)
      const reader = new FileReader()
      reader.onload = () => {
        setNewImage((prev) => ({
          ...prev,
          url: reader.result,
          title: prev.title || file.name.replace(/\.[^/.]+$/, ''),
        }))
      }
      reader.readAsDataURL(file)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    if (isUploading) return
    const file = e.dataTransfer.files?.[0]
    if (file) handleFileUpload(file)
  }

  const handleAddImageToGallery = (e) => {
    e.preventDefault()
    if (!newImage.url.trim()) {
      alert('Please provide an image URL or upload a photo from your computer.')
      return
    }

    onChange({
      ...collegeData,
      gallery: [...gallery, newImage.url],
    })

    setNewImage({ url: '', title: '', category: 'Campus' })
    setUploadError('')
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
              onClick={() => {
                setIsAddingNew(true)
                setUploadError('')
              }}
              className="btn btn-primary btn-sm text-xs cursor-pointer flex items-center gap-1.5"
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
                <div>
                  <h4 className="text-xs font-bold text-brand-primary">Add New Campus Photo</h4>
                  <p className="text-[11px] text-text-secondary mt-0.5">
                    Select either direct URL or upload a photo file from your computer.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="text-xs text-text-light hover:text-text-primary cursor-pointer p-1"
                >
                  ✕
                </button>
              </div>

              {/* 2 Options Switcher */}
              <div className="inline-flex items-center p-0.5 rounded-lg bg-white border border-border-color">
                <button
                  type="button"
                  onClick={() => {
                    setInputMode('url')
                    setUploadError('')
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                    inputMode === 'url'
                      ? 'bg-brand-primary text-white shadow-2xs'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <LinkIcon className="h-3.5 w-3.5" />
                  <span>1. Enter Image URL</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInputMode('upload')
                    setUploadError('')
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                    inputMode === 'upload'
                      ? 'bg-brand-primary text-white shadow-2xs'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>2. Upload from Computer</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  {inputMode === 'url' ? (
                    <FormField label="Direct Image URL" required>
                      <TextInput
                        placeholder="https://images.unsplash.com/..."
                        value={newImage.url}
                        onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
                      />
                    </FormField>
                  ) : (
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileUpload(file)
                        }}
                        className="hidden"
                      />
                      <div
                        onDragOver={(e) => {
                          e.preventDefault()
                          setDragOver(true)
                        }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        onClick={() => !isUploading && fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer ${
                          dragOver
                            ? 'border-brand-primary bg-brand-accent/50'
                            : 'border-border-color hover:border-brand-primary/60 hover:bg-white bg-white/70'
                        } ${isUploading ? 'opacity-70 cursor-wait' : ''}`}
                      >
                        {isUploading ? (
                          <div className="flex flex-col items-center justify-center py-2 text-brand-primary">
                            <Loader2 className="h-6 w-6 animate-spin mb-1 text-brand-primary" />
                            <span className="text-xs font-bold">Uploading to Cloudinary CDN...</span>
                            <span className="text-[10px] text-text-light mt-0.5">Please wait</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-1">
                            <div className="w-8 h-8 rounded-full bg-brand-accent text-brand-primary flex items-center justify-center mb-1">
                              <Upload className="h-4 w-4" />
                            </div>
                            <p className="text-xs font-bold text-text-primary">
                              Click or Drag & Drop Photo Here
                            </p>
                            <p className="text-[10px] text-text-light mt-0.5">
                              PNG, JPG, WebP up to 10MB
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {uploadError && (
                    <div className="mt-2 p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-1.5">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0 text-rose-600" />
                      <span>{uploadError}</span>
                    </div>
                  )}
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
                <div className="p-3 bg-white rounded-xl border border-border-color flex items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={newImage.url}
                      alt="Preview"
                      className="w-16 h-12 object-cover rounded-lg border border-border-color shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                        <Check className="h-3.5 w-3.5" /> Photo Loaded & Ready
                      </span>
                      <p className="text-[10px] text-text-light font-mono truncate max-w-xs mt-0.5">
                        {newImage.url}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setNewImage((prev) => ({ ...prev, url: '' }))}
                    className="text-xs text-rose-600 font-bold hover:underline cursor-pointer"
                  >
                    Clear Photo
                  </button>
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
                  disabled={!newImage.url || isUploading}
                  onClick={handleAddImageToGallery}
                  className="btn btn-primary btn-sm text-xs cursor-pointer font-bold disabled:opacity-50"
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
