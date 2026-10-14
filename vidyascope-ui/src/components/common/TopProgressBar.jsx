import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const TopProgressBar = () => {
  const location = useLocation()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Trigger on route change
    setVisible(true)
    setProgress(20)

    const timer1 = setTimeout(() => {
      setProgress(65)
    }, 80)

    const timer2 = setTimeout(() => {
      setProgress(90)
    }, 180)

    const timer3 = setTimeout(() => {
      setProgress(100)
    }, 280)

    const timer4 = setTimeout(() => {
      setVisible(false)
      setProgress(0)
    }, 450)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
    }
  }, [location.pathname, location.search])

  if (!visible && progress === 0) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none h-[3.5px] bg-transparent overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-[#033C8D] via-[#00A3FF] to-[#6366F1] transition-all ease-out relative"
        style={{
          width: `${progress}%`,
          transitionDuration: progress === 100 ? '120ms' : '200ms',
          opacity: visible ? 1 : 0,
        }}
      >
        {/* Leading edge radiant neon glow */}
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-r from-transparent to-white/90 shadow-[0_0_15px_#00A3FF,0_0_30px_#033C8D]" />
      </div>
    </div>
  )
}

export default TopProgressBar
