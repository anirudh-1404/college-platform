import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import logoImg from '../../assets/logo.png'

const RouteLoadingOverlay = ({ isLoading }) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[9990] flex items-center justify-center bg-white/70 backdrop-blur-md pointer-events-none select-none"
        >
          {/* Ambient luminous glow behind card */}
          <div className="absolute w-72 h-72 bg-gradient-to-tr from-blue-400/20 via-sky-300/25 to-indigo-400/20 rounded-full blur-3xl pointer-events-none" />

          {/* Frosted Loading Card */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: -6 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="relative z-10 flex flex-col items-center gap-4 px-8 py-7 bg-white/85 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(3,60,141,0.12),0_4px_10px_rgba(0,0,0,0.04)] border border-white/90"
          >
            {/* Logo with gentle pulse */}
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-400/20 rounded-2xl blur-md animate-pulse" />
              <img
                src={logoImg}
                alt="VidyaScope"
                className="h-10 sm:h-11 w-auto object-contain relative z-10"
              />
            </div>

            {/* Spinner with glowing brand gradient */}
            <div className="flex items-center gap-3 mt-1">
              <div className="relative w-5 h-5">
                <div className="w-full h-full rounded-full border-2 border-slate-200 border-t-[#033C8D] border-r-[#00A3FF] animate-spin" />
              </div>
              <span className="text-xs font-bold text-slate-700 tracking-wide">
                Loading campus insights...
              </span>
            </div>

            {/* Micro progress line */}
            <div className="w-36 h-1 bg-slate-100 rounded-full overflow-hidden mt-1 relative">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut' }}
                className="w-1/2 h-full bg-gradient-to-r from-[#033C8D] via-[#00A3FF] to-[#6366F1] rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default RouteLoadingOverlay
