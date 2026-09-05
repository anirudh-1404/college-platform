import React, { useRef, useState } from 'react'
import { Upload, FileText, Image as ImageIcon, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
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

// 2. Single Image Uploader with Cloudinary Pipeline & Preview
export const ImageUploader = ({
  imageUrl,
  onChange,
  onRemove,
  label,
  aspectRatio = 'square', // 'square' | 'video' | 'banner'
  helperText,
  disabled = false,
}) => {
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 8 * 1024 * 1024) {
      alert('Image size exceeds 8MB limit.')
      return
    }

    setUploading(true)
    try {
      // Direct upload to backend Cloudinary endpoint
      const uploadedUrl = await collegeService.uploadImage(file, 'vidyascope/colleges')
      onChange(uploadedUrl)
    } catch (err) {
      console.warn('Direct upload failed, falling back to local base64:', err)
      // Graceful fallback: local Data URI
      const reader = new FileReader()
      reader.onload = () => {
        onChange(reader.result)
      }
      reader.readAsDataURL(file)
    } finally {
      setUploading(false)
    }
  }

  const aspectClass =
    aspectRatio === 'square'
      ? 'w-24 h-24 rounded-xl'
      : aspectRatio === 'banner'
      ? 'w-full h-36 rounded-xl'
      : 'w-48 h-32 rounded-xl'

  return (
    <div className="space-y-2">
      {label && <label className="block text-xs font-semibold text-text-primary">{label}</label>}

      <div className="flex flex-wrap items-center gap-4">
        <div
          className={`${aspectClass} overflow-hidden bg-slate-100 border border-border-color flex items-center justify-center relative group flex-shrink-0`}
        >
          {uploading ? (
            <div className="flex flex-col items-center justify-center p-2 text-brand-primary">
              <Loader2 className="h-6 w-6 animate-spin mb-1" />
              <span className="text-[10px] font-bold">Uploading...</span>
            </div>
          ) : imageUrl ? (
            <img src={imageUrl} alt="Uploaded preview" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-2 text-text-light">
              <ImageIcon className="h-6 w-6 mx-auto mb-1 opacity-60" />
              <span className="text-[10px]">No image</span>
            </div>
          )}
        </div>

        {!disabled && (
          <div className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              disabled={uploading}
              className="hidden"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="btn btn-sm btn-outline text-xs cursor-pointer flex items-center gap-1.5"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-primary" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-3.5 w-3.5" />
                    <span>{imageUrl ? 'Change Image' : 'Upload Image'}</span>
                  </>
                )}
              </button>
              {imageUrl && !uploading && (
                <button
                  type="button"
                  onClick={onRemove}
                  className="btn btn-sm text-xs text-rose-600 hover:bg-rose-50 cursor-pointer"
                >
                  Remove
                </button>
              )}
            </div>
            {helperText && <p className="text-[11px] text-text-light">{helperText}</p>}
          </div>
        )}
      </div>
    </div>
  )
}

