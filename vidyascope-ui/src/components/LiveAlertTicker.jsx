import React, { useState, useEffect } from 'react'
import { publicApi } from '../api/publicApi'

const LiveAlertTicker = () => {
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    let isMounted = true

    const fetchLiveIntel = async () => {
      try {
        const liveItems = await publicApi.getLiveIntel()
        if (isMounted) {
          setAlerts(Array.isArray(liveItems) ? liveItems : [])
        }
      } catch (err) {
        console.warn('Failed to load dynamic live intel:', err)
        if (isMounted) setAlerts([])
      }
    }

    fetchLiveIntel()

    // Listen to admin sync events across browser tabs
    const handleStorage = (e) => {
      if (e.key === 'vidyascope_admin_data_change') {
        fetchLiveIntel()
      }
    }
    const handleCustomEvent = () => fetchLiveIntel()

    window.addEventListener('storage', handleStorage)
    window.addEventListener('vidyascope_admin_data_change', handleCustomEvent)

    return () => {
      isMounted = false
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('vidyascope_admin_data_change', handleCustomEvent)
    }
  }, [])

  // If there are no alerts published from admin, do not render static/dummy data
  if (!alerts || alerts.length === 0) {
    return null
  }

  // Double list to create seamless infinite scroll loop
  const displayAlerts = alerts.concat(alerts)

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 text-xs py-2 px-4 overflow-hidden relative select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left Badge */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold uppercase tracking-wider border border-rose-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            Live Intel
          </span>
        </div>

        {/* Scrolling Ticker Text - Completely Non-Clickable */}
        <div className="flex-1 overflow-hidden whitespace-nowrap mask-gradient">
          <div className="inline-flex items-center gap-8 animate-ticker">
            {displayAlerts.map((alert, idx) => (
              <span
                key={`${alert.id || alert._id || 'alert'}-${idx}`}
                className="inline-flex items-center gap-2 text-[11px] font-medium text-slate-300 cursor-default select-none"
              >
                {alert.category && (
                  <span className="font-mono text-[10px] font-bold uppercase text-rose-400 tracking-wider">
                    {alert.category}:
                  </span>
                )}
                <span className="text-slate-200">
                  {alert.text}
                </span>
                <span className="text-slate-600 font-serif ml-3 select-none">•</span>
              </span>
            ))}
          </div>
        </div>

        {/* Right Status Badge (Non-clickable verified broadcast indicator) */}
        <div className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono text-slate-400 flex-shrink-0 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Verified Feed</span>
        </div>

      </div>
    </div>
  )
}

export default LiveAlertTicker

