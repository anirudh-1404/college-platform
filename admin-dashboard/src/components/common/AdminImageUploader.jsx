import React, { useState, useRef } from 'react'
import {
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  RefreshCw,
  ExternalLink,
  Crop as CropIcon,
  Sparkles,
} from 'lucide-react'
import { adminService } from '../../data/adminService'
import { ImageCropperModal } from './ImageCropperModal'

export const AdminImageUploader = ({
  value = '',
  onChange,
  label = 'Image',
  required = false,
  aspectRatio = 'banner', // 'banner' | 'square'
  helperText = '',
  folder = 'vidyascope/colleges',
  disabled = false,
}) => {
  const [mode, setMode] = useState('url') // 'url' | 'upload'
  const [urlInput, setUrlInput] = useState(value || '')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [isCropperOpen, setIsCropperOpen] = useState(false)
  const [cropperSource, setCropperSource] = useState('')
  const fileInputRef = useRef(null)

  // Keep internal URL state synced with incoming value
  React.useEffect(() => {
    setUrlInput(value || '')
  }, [value])

  const handleApplyUrl = (val) => {
    setUrlInput(val)
    setUploadError('')
    onChange(val.trim())
  }

  const handleFileUpload = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setUploadError('Only image files (PNG, JPG, WebP, GIF) are allowed.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image file exceeds 10MB limit.')
      return
    }

    // Read file and immediately open the Cropper Modal so user can adjust the crop
    const reader = new FileReader()
    reader.onload = () => {
      setCropperSource(reader.result)
      setIsCropperOpen(true)
    }
    reader.readAsDataURL(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleCropComplete = async (croppedDataUrl, croppedFile) => {
    setIsUploading(true)
    setUploadError('')
    try {
      const uploadedUrl = await adminService.uploadImage(croppedFile, folder)
      setUrlInput(uploadedUrl)
      onChange(uploadedUrl)
    } catch (err) {
      console.warn('Direct Cloudinary upload failed for cropped image, falling back to data URL:', err)
      setUrlInput(croppedDataUrl)
      onChange(croppedDataUrl)
    } finally {
      setIsUploading(false)
      setIsCropperOpen(false)
    }
  }

  const handleOpenCropper = () => {
    if (!value && !urlInput) return
    setCropperSource(value || urlInput)
    setIsCropperOpen(true)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    if (disabled || isUploading) return
    const file = e.dataTransfer.files?.[0]
    if (file) handleFileUpload(file)
  }

  const handleRemove = () => {
    setUrlInput('')
    setUploadError('')
    onChange('')
  }

  return (
    <div className="space-y-2">
      {/* Label & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="block text-xs font-bold text-slate-700">
          {label}
          {required && <span className="text-rose-500 ml-1 font-bold">*</span>}
        </label>

        {/* 2 Options Tab Switcher */}
        {!disabled && (
          <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setMode('url')
                setUploadError('')
              }}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === 'url'
                  ? 'bg-white text-[#033C8D] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LinkIcon className="h-3 w-3" />
              <span>1. Enter URL</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('upload')
                setUploadError('')
              }}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === 'upload'
                  ? 'bg-white text-[#033C8D] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Upload className="h-3 w-3" />
              <span>2. Upload from Computer</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Container */}
      <div className="p-3 bg-slate-50/60 border border-slate-200 rounded-xl space-y-3">
        {/* Mode 1: URL Input */}
        {mode === 'url' && !disabled && (
          <div className="space-y-1.5">
            <div className="relative flex items-center">
              <LinkIcon className="absolute left-3 h-3.5 w-3.5 text-slate-400" />
              <input
                type="url"
                value={urlInput}
                onChange={(e) => handleApplyUrl(e.target.value)}
                placeholder="Paste direct image URL (https://...)"
                className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none text-slate-800 font-medium"
              />
              {urlInput && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="absolute right-2.5 p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                  title="Clear URL"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <p className="text-[10px] text-slate-400">
              Paste any secure online image link (Unsplash, official college site, Wikimedia, etc.)
            </p>
          </div>
        )}

        {/* Mode 2: Computer File Upload */}
        {mode === 'upload' && !disabled && (
          <div className="space-y-1.5">
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
                  ? 'border-[#033C8D] bg-blue-50/50'
                  : 'border-slate-200 hover:border-[#033C8D]/60 hover:bg-white bg-white/70'
              } ${isUploading ? 'opacity-70 cursor-wait' : ''}`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center justify-center py-2 text-[#033C8D]">
                  <Loader2 className="h-6 w-6 animate-spin mb-1 text-[#033C8D]" />
                  <span className="text-xs font-bold">Uploading to Cloudinary CDN...</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Please wait a moment</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-1">
                  <div className="w-9 h-9 rounded-full bg-blue-50 text-[#033C8D] flex items-center justify-center mb-1.5">
                    <Upload className="h-4 w-4" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    Click to browse or drag & drop photo from your computer
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Supports PNG, JPG, JPEG, WebP up to 10MB
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Notice */}
        {uploadError && (
          <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Live Visual Preview Container */}
        {value ? (
          <div className="space-y-2 pt-1 border-t border-slate-200/80">
            <div className="flex items-center justify-between text-[11px] flex-wrap gap-2">
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Active Image Loaded</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenCropper}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg text-[#033C8D] bg-blue-50 hover:bg-blue-100 border border-blue-200/60 shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Crop, rotate and position this photo"
                >
                  <CropIcon className="h-3.5 w-3.5 text-[#033C8D]" />
                  <span>Crop / Adjust Image</span>
                </button>
                {!disabled && (
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="text-rose-600 hover:text-rose-700 font-bold hover:underline cursor-pointer flex items-center gap-1 px-1.5 py-1"
                  >
                    <X className="h-3 w-3" />
                    <span>Remove Photo</span>
                  </button>
                )}
              </div>
            </div>

            {/* Square Logo Preview */}
            {aspectRatio === 'square' ? (
              <div className="flex items-center gap-4 p-2 bg-white rounded-xl border border-slate-200">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-slate-200 bg-slate-50 p-1 overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                  <img
                    src={value}
                    alt="Logo Preview"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/150x150?text=Invalid+Image'
                    }}
                  />
                </div>
                <div className="min-w-0 space-y-1">
                  <p className="text-xs font-bold text-slate-800 truncate">Circle Logo Preview</p>
                  <p className="text-[10px] text-slate-500 font-mono truncate">{value}</p>
                  <a
                    href={value}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-[#033C8D] font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <span>Open in new tab</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ) : (
              /* Banner / Card Preview */
              <div className="relative w-full h-32 sm:h-40 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 group">
                <img
                  src={value}
                  alt="Banner Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/600x200?text=Invalid+Image+URL'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white text-[11px]">
                  <span className="font-semibold bg-slate-900/70 px-2 py-0.5 rounded backdrop-blur-xs font-mono text-[10px] truncate max-w-[70%]">
                    {value}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleOpenCropper}
                      className="px-2 py-0.5 rounded bg-blue-600/80 hover:bg-blue-600 text-white backdrop-blur-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <CropIcon className="h-3 w-3" />
                      <span>Crop</span>
                    </button>
                    <a
                      href={value}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2 py-0.5 rounded bg-white/20 hover:bg-white text-white hover:text-slate-900 backdrop-blur-xs font-bold transition-colors"
                    >
                      View Original
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-3 bg-white rounded-lg border border-dashed border-slate-200 text-center">
            <ImageIcon className="h-5 w-5 text-slate-300 mx-auto mb-1" />
            <p className="text-[11px] text-slate-400">
              No image specified yet. Select either 'Enter URL' or 'Upload from Computer' above.
            </p>
          </div>
        )}
      </div>

      {helperText && <p className="text-[11px] text-slate-500">{helperText}</p>}

      {/* Interactive Image Cropper Modal */}
      <ImageCropperModal
        isOpen={isCropperOpen}
        imageSrc={cropperSource}
        aspectRatio={aspectRatio}
        onClose={() => setIsCropperOpen(false)}
        onCropComplete={handleCropComplete}
      />
    </div>
  )
}
export default AdminImageUploader
