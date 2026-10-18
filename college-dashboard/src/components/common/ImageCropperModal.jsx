import React, { useState, useRef, useEffect } from 'react'
import {
  X,
  Check,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Crop as CropIcon,
  RefreshCw,
  Loader2,
} from 'lucide-react'

export const ImageCropperModal = ({
  isOpen,
  imageSrc,
  aspectRatio = 'banner', // 'banner' (16:9 or 3:1) | 'square' (1:1) | 'free'
  onClose,
  onCropComplete,
}) => {
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [selectedRatio, setSelectedRatio] = useState(
    aspectRatio === 'square' ? '1:1' : aspectRatio === 'banner' ? '16:9' : '16:9'
  )
  const [isProcessing, setIsProcessing] = useState(false)

  const containerRef = useRef(null)
  const imageRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setZoom(1)
      setRotation(0)
      setPan({ x: 0, y: 0 })
      setSelectedRatio(
        aspectRatio === 'square' ? '1:1' : aspectRatio === 'banner' ? '16:9' : '16:9'
      )
    }
  }, [isOpen, imageSrc, aspectRatio])

  if (!isOpen || !imageSrc) return null

  const getAspectRatioValue = () => {
    switch (selectedRatio) {
      case '1:1':
        return 1
      case '16:9':
        return 16 / 9
      case '3:1':
        return 3 / 1
      case '4:3':
        return 4 / 3
      default:
        return 16 / 9
    }
  }

  const handleMouseDown = (e) => {
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

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      const targetWidth = selectedRatio === '1:1' ? 800 : selectedRatio === '3:1' ? 1500 : 1200
      const targetHeight = Math.round(targetWidth / getAspectRatioValue())

      canvas.width = targetWidth
      canvas.height = targetHeight

      ctx.clearRect(0, 0, targetWidth, targetHeight)

      ctx.save()
      ctx.translate(targetWidth / 2, targetHeight / 2)
      ctx.rotate((rotation * Math.PI) / 180)

      const imgAspect = img.width / img.height
      const targetAspect = targetWidth / targetHeight

      let drawWidth, drawHeight
      if (imgAspect > targetAspect) {
        drawHeight = targetHeight * zoom
        drawWidth = drawHeight * imgAspect
      } else {
        drawWidth = targetWidth * zoom
        drawHeight = drawWidth / imgAspect
      }

      const containerRect = containerRef.current
        ? containerRef.current.getBoundingClientRect()
        : { width: 400, height: 300 }
      const scaleX = targetWidth / containerRect.width
      const scaleY = targetHeight / containerRect.height

      const scaledPanX = pan.x * scaleX
      const scaledPanY = pan.y * scaleY

      ctx.drawImage(
        img,
        -drawWidth / 2 + scaledPanX,
        -drawHeight / 2 + scaledPanY,
        drawWidth,
        drawHeight
      )
      ctx.restore()

      const dataUrl = canvas.toDataURL('image/jpeg', 0.92)

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
        0.92
      )
    } catch (err) {
      console.error('Crop export error:', err)
      alert('Could not crop external image. Uploading the file directly from your computer enables unrestricted high-res cropping.')
      setIsProcessing(false)
    }
  }

  const isSquare = selectedRatio === '1:1'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative bg-slate-900 border border-slate-700/80 w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100 max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-primary text-white flex items-center justify-center shadow-xs">
              <CropIcon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Crop & Position Photo</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Drag to position • Scroll or slider to zoom • Select framing ratio
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
              { id: '1:1', label: '1:1 Square (Logo Avatar)' },
              { id: '16:9', label: '16:9 Standard Card' },
              { id: '3:1', label: '3:1 Wide Banner' },
              { id: '4:3', label: '4:3 Classic' },
            ].map((ratio) => (
              <button
                key={ratio.id}
                type="button"
                onClick={() => {
                  setSelectedRatio(ratio.id)
                  setPan({ x: 0, y: 0 })
                }}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  selectedRatio === ratio.id
                    ? 'bg-brand-primary text-white shadow-xs'
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
          className="relative flex-1 bg-black min-h-[260px] sm:min-h-[340px] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing select-none"
        >
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) rotate(${rotation}deg) scale(${zoom})`,
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
            }}
            className="pointer-events-none flex items-center justify-center"
          >
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Crop Source"
              className="max-w-[85vw] sm:max-w-[460px] max-h-[280px] sm:max-h-[320px] object-contain shadow-2xl"
              draggable={false}
            />
          </div>

          <div
            style={{
              aspectRatio: `${getAspectRatioValue()}`,
            }}
            className={`absolute pointer-events-none w-[82%] sm:w-[75%] max-h-[82%] border-2 border-white/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.65)] ${
              isSquare ? 'rounded-full' : 'rounded-xl'
            }`}
          >
            {!isSquare && (
              <div className="w-full h-full grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
                <div className="border-r border-b border-white/40" />
                <div className="border-r border-b border-white/40" />
                <div className="border-b border-white/40" />
                <div className="border-r border-b border-white/40" />
                <div className="border-r border-b border-white/40" />
                <div className="border-b border-white/40" />
                <div className="border-r border-b border-white/40" />
                <div className="border-r border-b border-white/40" />
                <div />
              </div>
            )}
          </div>

          <div className="absolute top-3 left-3 bg-slate-900/80 text-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-xs border border-white/10 pointer-events-none">
            Drag to pan position
          </div>
        </div>

        {/* Toolbar & Zoom Slider Controls */}
        <div className="px-5 py-3.5 bg-slate-900 border-t border-slate-800 space-y-3 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#033C8D]"
              />

              <button
                type="button"
                onClick={() => setZoom((prev) => Math.min(3, prev + 0.2))}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </button>

              <span className="text-[11px] font-mono text-slate-400 w-10 text-right">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRotation((prev) => (prev + 90) % 360)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-slate-700 transition-colors"
                title="Rotate 90 degrees"
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
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-slate-700 transition-colors"
                title="Reset Position"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleApplyCrop}
              disabled={isProcessing}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-brand-primary hover:bg-brand-primary/90 shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Cropping & Processing...</span>
                </>
              ) : (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Crop & Apply Photo</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageCropperModal
