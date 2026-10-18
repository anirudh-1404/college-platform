import React, { useState, useRef, useEffect } from 'react'
import {
  X,
  Check,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Crop as CropIcon,
  Sparkles,
  Loader2,
  Maximize2,
  Move,
  RefreshCw,
} from 'lucide-react'

export const ImageCropperModal = ({
  isOpen,
  imageSrc,
  aspectRatio = 'banner', // 'banner' (16:9 or 3:1) | 'square' (1:1)
  onClose,
  onCropComplete,
}) => {
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [selectedRatio, setSelectedRatio] = useState(
    aspectRatio === 'square' ? '1:1' : '4:1'
  )
  const [isProcessing, setIsProcessing] = useState(false)
  const [naturalSize, setNaturalSize] = useState({ w: 1200, h: 800 })

  const containerRef = useRef(null)

  // Load natural image dimensions
  useEffect(() => {
    if (!imageSrc) return
    const img = new Image()
    img.src = imageSrc
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight })
      }
    }
  }, [imageSrc])

  // Reset controls when opened with new image
  useEffect(() => {
    if (isOpen) {
      setZoom(1)
      setRotation(0)
      setPan({ x: 0, y: 0 })
      setSelectedRatio(
        aspectRatio === 'square' ? '1:1' : '4:1'
      )
    }
  }, [isOpen, imageSrc, aspectRatio])

  if (!isOpen || !imageSrc) return null

  // Aspect ratio value helper
  const getAspectRatioValue = () => {
    switch (selectedRatio) {
      case '1:1':
        return 1
      case '4:1':
        return 4 / 1
      case '3:1':
        return 3 / 1
      case '16:9':
        return 16 / 9
      case '4:3':
        return 4 / 3
      default:
        return 4 / 1
    }
  }

  // Calculate box dimensions that fit cleanly inside viewport
  const getBoxDimensions = () => {
    const R = getAspectRatioValue()
    const maxW = 500
    const maxH = 260
    let w = maxW
    let h = Math.round(w / R)
    if (h > maxH) {
      h = maxH
      w = Math.round(h * R)
    }
    return { w, h }
  }

  const { w: boxW, h: boxH } = getBoxDimensions()
  const baseScale = Math.max(boxW / naturalSize.w, boxH / naturalSize.h)
  const displayW = Math.round(naturalSize.w * baseScale * zoom)
  const displayH = Math.round(naturalSize.h * baseScale * zoom)

  // Mouse pan handlers
  const handleMouseDown = (e) => {
    e.preventDefault()
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Touch pan handlers for mobile/touch
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true)
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      })
    }
  }

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    })
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  // Wheel zoom handler
  const handleWheel = (e) => {
    e.preventDefault()
    const zoomDelta = e.deltaY * -0.002
    setZoom((prev) => Math.min(Math.max(1, prev + zoomDelta), 3.5))
  }

  const getSafeImageSrc = () => {
    if (!imageSrc) return ''
    if (imageSrc.startsWith('data:') || imageSrc.startsWith('blob:')) return imageSrc
    if (imageSrc.startsWith('http')) {
      const apiBase =
        import.meta.env.VITE_API_URL ||
        (import.meta.env.PROD
          ? 'https://vidyascope-backend.onrender.com/api'
          : 'http://localhost:8080/api')
      const cleanBase = apiBase.replace(/\/colleges\/?$/, '').replace(/\/api\/?$/, '')
      return `${cleanBase}/api/upload/proxy?url=${encodeURIComponent(imageSrc)}`
    }
    return imageSrc
  }

  // WYSIWYG Pixel-Perfect Canvas Export
  const handleApplyCrop = async () => {
    setIsProcessing(true)
    try {
      const safeSrc = getSafeImageSrc()
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = safeSrc

      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = () => {
          const imgDirect = new Image()
          imgDirect.crossOrigin = 'anonymous'
          imgDirect.onload = resolve
          imgDirect.onerror = () => {
            const imgLast = new Image()
            imgLast.onload = resolve
            imgLast.onerror = reject
            imgLast.src = imageSrc
          }
          imgDirect.src = imageSrc
        }
      })

      // Target export dimensions
      const targetW =
        selectedRatio === '1:1'
          ? 800
          : selectedRatio === '4:1'
          ? 1600
          : selectedRatio === '3:1'
          ? 1500
          : 1600
      const targetH = Math.round(targetW / getAspectRatioValue())

      const canvas = document.createElement('canvas')
      canvas.width = targetW
      canvas.height = targetH
      const ctx = canvas.getContext('2d')
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'

      ctx.clearRect(0, 0, targetW, targetH)
      ctx.save()

      // Exact scale factor from on-screen crop box to canvas
      const exportScale = targetW / boxW

      // 1. Center of canvas
      ctx.translate(targetW / 2, targetH / 2)

      // 2. User's exact pan translation in canvas coordinates
      ctx.translate(pan.x * exportScale, pan.y * exportScale)

      // 3. User's rotation around center
      ctx.rotate((rotation * Math.PI) / 180)

      // 4. Draw image at exact proportional size
      const drawW = displayW * exportScale
      const drawH = displayH * exportScale
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH)

      ctx.restore()

      // High-res JPEG dataUrl
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95)

      canvas.toBlob(
        (blob) => {
          const croppedFile = new File([blob], `cropped_${Date.now()}.jpg`, {
            type: 'image/jpeg',
          })
          onCropComplete(dataUrl, croppedFile)
          onClose()
          setIsProcessing(false)
        },
        'image/jpeg',
        0.95
      )
    } catch (err) {
      console.error('Crop export error:', err)
      alert('Could not crop image: ' + (err.message || 'Error'))
      setIsProcessing(false)
    }
  }

  const isSquare = selectedRatio === '1:1'

  // Live thumbnail preview dimensions & scale factor
  const thumbW = isSquare ? 36 : selectedRatio === '4:1' ? 72 : 54
  const thumbH = Math.round(thumbW / getAspectRatioValue())
  const thumbScale = thumbW / boxW

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative bg-slate-900 border border-slate-700/80 w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100 max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <CropIcon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Crop & Position Photo</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Drag to frame • Zoom with slider or scroll • What you see is what you get
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Framing Ratio Selector Strip */}
        <div className="px-5 py-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between gap-2 overflow-x-auto shrink-0">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
            Aspect Ratio:
          </span>
          <div className="flex items-center gap-1.5">
            {[
              { id: '4:1', label: '4:1 LinkedIn Banner' },
              { id: '3:1', label: '3:1 Panoramic' },
              { id: '16:9', label: '16:9 Landscape' },
              { id: '1:1', label: '1:1 Square (Logo)' },
              { id: '4:3', label: '4:3 Standard' },
            ].map((ratio) => (
              <button
                key={ratio.id}
                type="button"
                onClick={() => {
                  setSelectedRatio(ratio.id)
                  setPan({ x: 0, y: 0 })
                  setZoom(1)
                }}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  selectedRatio === ratio.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {ratio.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Viewport Canvas Area */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
          className="relative flex-1 bg-slate-950 min-h-[300px] sm:min-h-[350px] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing select-none"
        >
          {/* WYSIWYG Crop Window Frame */}
          <div
            style={{
              width: `${boxW}px`,
              height: `${boxH}px`,
            }}
            className={`relative shadow-[0_0_0_9999px_rgba(2,6,23,0.85)] border-2 border-white overflow-hidden pointer-events-none ${
              isSquare ? 'rounded-full' : 'rounded-xl'
            }`}
          >
            {/* The Image inside the frame */}
            <img
              src={imageSrc}
              alt="Crop Target"
              draggable={false}
              style={{
                width: `${displayW}px`,
                height: `${displayH}px`,
                maxWidth: 'none',
                maxHeight: 'none',
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) translate(${pan.x}px, ${pan.y}px) rotate(${rotation}deg)`,
                transformOrigin: 'center center',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            />

            {/* Rule of thirds grid lines */}
            {!isSquare && (
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-25">
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div />
              </div>
            )}
          </div>

          {/* Helpful Drag Indicator Badge */}
          <div className="absolute top-3 left-3 bg-slate-900/90 text-white text-[10px] font-semibold px-2.5 py-1 rounded-md backdrop-blur-md border border-white/10 pointer-events-none flex items-center gap-1.5 shadow-sm">
            <Move className="h-3 w-3 text-indigo-400" />
            <span>Click & Drag to position image</span>
          </div>

          <div className="absolute top-3 right-3 bg-slate-900/90 text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded-md backdrop-blur-md border border-white/10 pointer-events-none">
            {selectedRatio} • {Math.round(zoom * 100)}%
          </div>
        </div>

        {/* Toolbar & Zoom Slider Controls */}
        <div className="px-5 py-3.5 bg-slate-900 border-t border-slate-800 space-y-3 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Zoom Slider */}
            <div className="flex items-center gap-2.5 flex-1 max-w-sm">
              <button
                type="button"
                onClick={() => setZoom((prev) => Math.max(1, prev - 0.2))}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <input
                type="range"
                min="1"
                max="3.5"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <button
                type="button"
                onClick={() => setZoom((prev) => Math.min(3.5, prev + 0.2))}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <span className="text-xs text-slate-400 font-mono w-10 text-right">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            {/* Quick Action Tools */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={() => setRotation((prev) => (prev + 90) % 360)}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
                title="Rotate 90° Clockwise"
              >
                <RotateCw className="h-3.5 w-3.5" />
                <span>Rotate</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setZoom(1)
                  setRotation(0)
                  setPan({ x: 0, y: 0 })
                }}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-all cursor-pointer flex items-center gap-1"
                title="Reset crop adjustments"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Action Buttons & Live Preview Strip */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 gap-3">
            {/* Live Crop Mini-Preview */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Preview:
              </span>
              <div
                style={{
                  width: `${thumbW}px`,
                  height: `${thumbH}px`,
                }}
                className={`relative overflow-hidden bg-black border border-white/40 shrink-0 ${
                  isSquare ? 'rounded-full' : 'rounded-md'
                }`}
              >
                <img
                  src={imageSrc}
                  alt="Live Preview"
                  draggable={false}
                  style={{
                    width: `${displayW * thumbScale}px`,
                    height: `${displayH * thumbScale}px`,
                    maxWidth: 'none',
                    maxHeight: 'none',
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) translate(${pan.x * thumbScale}px, ${pan.y * thumbScale}px) rotate(${rotation}deg)`,
                    transformOrigin: 'center center',
                  }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="px-4 py-2 text-xs font-bold rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyCrop}
                disabled={isProcessing}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Processing Crop...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Apply & Save Crop</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ImageCropperModal
