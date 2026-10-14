import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const SPARKS = [
  { id: 1, x: -45, y: -45, delay: 0.1, size: 14 },
  { id: 2, x: 50, y: -40, delay: 0.15, size: 18 },
  { id: 3, x: -55, y: 35, delay: 0.2, size: 16 },
  { id: 4, x: 55, y: 30, delay: 0.12, size: 14 },
  { id: 5, x: 0, y: -65, delay: 0.18, size: 20 },
  { id: 6, x: 0, y: 60, delay: 0.22, size: 16 },
]

export const HeartSaveAnimation = ({ triggerKey, onComplete }) => {
  const [targetCoords, setTargetCoords] = useState({ x: 350, y: -350 })

  useEffect(() => {
    // Dynamically calculate vector towards top-right navbar Saved button
    const updateTarget = () => {
      const screenW = window.innerWidth
      const screenH = window.innerHeight
      // Distance from center to approximate top-right Saved button area
      setTargetCoords({
        x: Math.min(screenW * 0.38, 520),
        y: -screenH * 0.44,
      })
    }

    updateTarget()
    window.addEventListener('resize', updateTarget)
    return () => window.removeEventListener('resize', updateTarget)
  }, [])

  if (!triggerKey) return null

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden flex items-center justify-center">
      <AnimatePresence>
        <div key={triggerKey} className="relative flex items-center justify-center">
          
          {/* Radial Bloom Glow Aura behind Heart */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.8, 2.2, 0],
              opacity: [0, 0.7, 0.4, 0],
            }}
            transition={{
              duration: 0.85,
              times: [0, 0.3, 0.6, 1],
              ease: 'easeOut',
            }}
            className="absolute w-44 h-44 rounded-full bg-gradient-to-r from-rose-500/40 via-pink-500/30 to-amber-400/20 blur-2xl"
          />

          {/* Radiating Sparkles */}
          {SPARKS.map((spark) => (
            <motion.div
              key={spark.id}
              initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.4, 0],
                x: [0, spark.x * 1.5],
                y: [0, spark.y * 1.5],
                opacity: [0, 1, 0],
                rotate: [0, 180],
              }}
              transition={{
                duration: 0.65,
                delay: spark.delay,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]"
            >
              <Sparkles style={{ width: spark.size, height: spark.size }} />
            </motion.div>
          ))}

          {/* Golden Light Ring Wave */}
          <motion.div
            initial={{ scale: 0.2, opacity: 0.9 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="absolute w-28 h-28 rounded-full border-2 border-amber-300/80 shadow-[0_0_20px_rgba(251,191,36,0.6)]"
          />

          {/* Main 3D Glossy Heart flying to Navbar */}
          <motion.div
            initial={{ scale: 0, x: 0, y: 0, opacity: 0, rotate: -15 }}
            animate={{
              // Keyframes: Pop in center -> shimmer pause -> fly to top right navbar
              scale: [0, 1.4, 1.15, 1.15, 0.3, 0],
              x: [0, 0, 0, 0, targetCoords.x * 0.85, targetCoords.x],
              y: [0, 0, 0, 0, targetCoords.y * 0.85, targetCoords.y],
              opacity: [0, 1, 1, 1, 0.9, 0],
              rotate: [-15, 8, -4, 0, 25, 45],
            }}
            transition={{
              duration: 1.15,
              times: [0, 0.25, 0.45, 0.58, 0.9, 1],
              ease: [0.22, 1, 0.36, 1],
            }}
            onAnimationComplete={onComplete}
            className="relative flex items-center justify-center filter drop-shadow-[0_12px_30px_rgba(244,63,94,0.65)]"
          >
            {/* Rich SVG Heart with Multi-Stop Gradient and Specular Highlight */}
            <svg
              viewBox="0 0 24 24"
              className="w-20 h-20 sm:w-24 sm:h-24 fill-[url(#heartGrad)] stroke-rose-300 stroke-[0.8]"
            >
              <defs>
                <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FB7185" />
                  <stop offset="45%" stopColor="#F43F5E" />
                  <stop offset="100%" stopColor="#BE123C" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>

            {/* Inner Shimmer Specular Light */}
            <div className="absolute top-4 left-6 w-3 h-3 rounded-full bg-white/70 blur-[1px]" />
          </motion.div>

        </div>
      </AnimatePresence>
    </div>
  )
}

export default HeartSaveAnimation
