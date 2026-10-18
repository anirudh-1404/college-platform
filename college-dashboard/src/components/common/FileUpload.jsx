import React, { useRef, useState, useEffect } from 'react'
import { Upload, FileText, Image as ImageIcon, X, CheckCircle2, AlertCircle, Loader2, Link as LinkIcon, ExternalLink } from 'lucide-react'
import { collegeService } from '../../data/collegeService'

// 1. Document / Verification Proof Uploader (PDF or Image)
export const DocumentUploader = ({
  fileData,
  onChange,
  onRemove,
  label = 'Upload Verification Proof (PDF or Image)',
  description = 'Upload official college recognition certificate, UGC/AICTE affiliation order, or state gazette notification (Max 10MB).',
  disabled = false,
  error,
}) => {
  const fileInputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    processFile(file)
  }

  const processFile = (file) => {
    // 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      onChange({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        type: file.type,
        uploadedAt: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        previewUrl: file.type.startsWith('image/') ? reader.result : null,
      })
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    if (disabled) return
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  return (
    <div className="space-y-2">
      {label && <label className="block text-xs font-semibold text-text-primary">{label}</label>}

      {fileData && fileData.name ? (
        <div className="p-3.5 bg-slate-50 border border-border-color rounded-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-brand-accent text-brand-primary flex items-center justify-center flex-shrink-0">
              {fileData.type?.includes('image') ? (
                <ImageIcon className="h-5 w-5" />
              ) : (
                <FileText className="h-5 w-5" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-text-primary truncate">{fileData.name}</p>
              <p className="text-[11px] text-text-light flex items-center gap-2">
                <span>{fileData.size}</span>
                <span>•</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Ready for verification
                </span>
              </p>
            </div>
          </div>

          {!disabled && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn btn-sm btn-outline text-xs cursor-pointer"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={onRemove}
                className="p-1.5 text-text-light hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                title="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
            dragOver
              ? 'border-brand-primary bg-brand-accent/30'
              : error
              ? 'border-rose-300 bg-rose-50/40'
              : 'border-border-color hover:border-brand-primary/50 hover:bg-slate-50/50'
          } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            onChange={handleFileChange}
            disabled={disabled}
            className="hidden"
          />
          <div className="w-10 h-10 rounded-full bg-slate-100 text-brand-primary mx-auto flex items-center justify-center mb-2">
            <Upload className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold text-text-primary">
            Click to upload document or drag and drop
          </p>
          <p className="text-[11px] text-text-light mt-1">{description}</p>
        </div>
      )}

      {error && (
        <p className="flex items-center gap-1 text-[11px] font-medium text-rose-600">
          <AlertCircle className="h-3 w-3 flex-shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}

// 2. Dual-Option Image Uploader (Option 1: URL | Option 2: Upload from Device/Computer)
export const ImageUploader = ({
  imageUrl,
  onChange,
  onRemove,
  label,
  required = false,
  aspectRatio = 'square', // 'square' | 'video' | 'banner'
  helperText,
  disabled = false,
}) => {
  const fileInputRef = useRef(null)
  const [mode, setMode] = useState('url') // 'url' | 'upload'
  const [urlInput, setUrlInput] = useState(imageUrl || '')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [dragOver, setDragOver] = useState(false)

  useEffect(() => {
    setUrlInput(imageUrl || '')
  }, [imageUrl])

  const handleApplyUrl = (val) => {
    setUrlInput(val)
    setUploadError('')
    onChange(val.trim())
  }

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setUploadError('Only image files (PNG, JPG, WebP) are allowed.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size exceeds 10MB limit.')
      return
    }

    setUploading(true)
    setUploadError('')
    try {
      // Direct upload to backend Cloudinary endpoint
      const uploadedUrl = await collegeService.uploadImage(file, 'vidyascope/colleges')
      setUrlInput(uploadedUrl)
      onChange(uploadedUrl)
    } catch (err) {
      console.warn('Direct upload failed, falling back to local base64:', err)
      // Graceful fallback: local Data URI
      const reader = new FileReader()
      reader.onload = () => {
        setUrlInput(reader.result)
        onChange(reader.result)
      }
      reader.readAsDataURL(file)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    if (disabled || uploading) return
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFile({ target: { files: [file] } })
    }
  }

  const handleClear = () => {
    setUrlInput('')
    setUploadError('')
    if (onRemove) onRemove()
    else onChange('')
  }

  return (
    <div className="space-y-2.5">
      {/* Header with Title & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        {label && (
          <label className="block text-xs font-semibold text-text-primary">
            {label}
            {required && <span className="text-rose-500 ml-1 font-bold">*</span>}
          </label>
        )}

        {/* 2 Options Switcher */}
        {!disabled && (
          <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-100 border border-border-color">
            <button
              type="button"
              onClick={() => {
                setMode('url')
                setUploadError('')
              }}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === 'url'
                  ? 'bg-white text-brand-primary shadow-2xs'
                  : 'text-text-secondary hover:text-text-primary'
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
                  ? 'bg-white text-brand-primary shadow-2xs'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Upload className="h-3 w-3" />
              <span>2. Upload from Computer</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Container */}
      <div className="p-3.5 bg-slate-50/70 border border-border-color rounded-xl space-y-3">
        {/* Option 1: URL Input */}
        {mode === 'url' && !disabled && (
          <div className="space-y-1.5">
            <div className="relative flex items-center">
              <LinkIcon className="absolute left-3 h-3.5 w-3.5 text-text-light" />
              <input
                type="url"
                value={urlInput}
                onChange={(e) => handleApplyUrl(e.target.value)}
                placeholder="Paste direct image link (e.g. https://images.unsplash.com/...)"
                className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-border-color rounded-lg focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none text-text-primary font-medium"
              />
              {urlInput && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-2.5 p-1 text-text-light hover:text-rose-600 rounded cursor-pointer"
                  title="Clear URL"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <p className="text-[10px] text-text-light">
              Enter any direct image URL. It will automatically load and preview below.
            </p>
          </div>
        )}

        {/* Option 2: Upload from Device / Computer */}
        {mode === 'upload' && !disabled && (
          <div className="space-y-1.5">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              disabled={uploading || disabled}
              className="hidden"
            />
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => !uploading && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer ${
                dragOver
                  ? 'border-brand-primary bg-brand-accent/40'
                  : 'border-border-color hover:border-brand-primary/60 hover:bg-white bg-white/70'
              } ${uploading ? 'opacity-70 cursor-wait' : ''}`}
            >
              {uploading ? (
                <div className="flex flex-col items-center justify-center py-2 text-brand-primary">
                  <Loader2 className="h-6 w-6 animate-spin mb-1 text-brand-primary" />
                  <span className="text-xs font-bold">Uploading to Cloudinary CDN...</span>
                  <span className="text-[10px] text-text-light mt-0.5">Please wait a moment</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-1">
                  <div className="w-9 h-9 rounded-full bg-brand-accent text-brand-primary flex items-center justify-center mb-1.5">
                    <Upload className="h-4 w-4" />
                  </div>
                  <p className="text-xs font-bold text-text-primary">
                    Click to browse or drag & drop photo from your computer
                  </p>
                  <p className="text-[10px] text-text-light mt-0.5">
                    Supports PNG, JPG, JPEG, WebP up to 10MB
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Upload error banner */}
        {uploadError && (
          <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Visual Preview */}
        {imageUrl ? (
          <div className="space-y-2 pt-1 border-t border-border-color">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Image Active & Saved</span>
              </span>
              {!disabled && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-rose-600 hover:text-rose-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  <span>Remove</span>
                </button>
              )}
            </div>

            {aspectRatio === 'square' ? (
              /* Square / Circle Logo Preview */
              <div className="flex items-center gap-4 p-2 bg-white rounded-xl border border-border-color">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-border-color bg-slate-50 p-1.5 overflow-hidden shrink-0 flex items-center justify-center shadow-2xs">
                  <img
                    src={imageUrl}
                    alt="Logo Preview"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/150x150?text=Invalid+Image'
                    }}
                  />
                </div>
                <div className="min-w-0 space-y-1">
                  <p className="text-xs font-bold text-text-primary truncate">Circle Logo Avatar</p>
                  <p className="text-[10px] text-text-light font-mono truncate">{imageUrl}</p>
                  <a
                    href={imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-brand-primary font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <span>View Full Size</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ) : (
              /* Banner / Card Preview */
              <div className="relative w-full h-32 sm:h-40 rounded-xl overflow-hidden border border-border-color bg-slate-900 group">
                <img
                  src={imageUrl}
                  alt="Banner Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/600x200?text=Invalid+Image+URL'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white text-[11px]">
                  <span className="font-semibold bg-slate-900/70 px-2 py-0.5 rounded backdrop-blur-xs font-mono text-[10px] truncate max-w-[70%]">
                    {imageUrl}
                  </span>
                  <a
                    href={imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2 py-0.5 rounded bg-white/20 hover:bg-white text-white hover:text-text-primary backdrop-blur-xs font-bold transition-colors"
                  >
                    View Original
                  </a>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-3 bg-white rounded-lg border border-dashed border-border-color text-center">
            <ImageIcon className="h-5 w-5 text-text-light/50 mx-auto mb-1" />
            <p className="text-[11px] text-text-light">
              No image set. Choose Option 1 (Enter URL) or Option 2 (Upload from Computer).
            </p>
          </div>
        )}
      </div>

      {helperText && (
        <p className="text-[11px] text-text-light leading-snug whitespace-pre-line">
          {helperText}
        </p>
      )}
    </div>
  )
}

