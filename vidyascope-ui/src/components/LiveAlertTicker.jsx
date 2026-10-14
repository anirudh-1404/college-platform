import React, { useState, useEffect } from 'react'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { publicApi } from '../api/publicApi'

const DEFAULT_ALERTS = [
  {
    category: 'LIVE AUDIT',
    text: 'IIT Bombay 2025-26 Median CTC Audited & Verified at ₹21.8 LPA',
    link: '/colleges/iit-bombay',
  },
  {
    category: 'GATEWAY UPDATE',
    text: 'JEE Advanced 2026 Examination Schedule & Eligibility Released',
    link: '/exams',
  },
  {
    category: 'COST OF LIVING',
    text: 'Updated 4-Year Hostel & Mess Expense Breakdown for 85 Premier Campuses',
    link: '/colleges',
  },
  {
    category: 'MANAGEMENT INTELLIGENCE',
    text: 'CAT 2025 Composite Cutoffs & IIM Interview Predictor Live',
    link: '/exams',
  },
  {
    category: 'CONSUMER ADVISORY',
    text: '14 Unaccredited Private Deemed Universities Flagged by Regulatory Audit',
    link: '/colleges',
  },
]

const LiveAlertTicker = ({ onNavigateExams, onNavigateColleges }) => {
  const [alerts, setAlerts] = useState(DEFAULT_ALERTS)
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    const fetchLiveIntel = async () => {
      try {
        const liveItems = await publicApi.getLiveIntel()
        if (isMounted && Array.isArray(liveItems) && liveItems.length > 0) {
          setAlerts(liveItems)
        }
      } catch (err) {
        console.warn('Failed to load dynamic live intel, using fallback:', err)
      }
    }

    fetchLiveIntel()

    // Listen to admin sync events across browser tabs
    const handleStorage = (e) => {
      if (e.key === 'vidyascope_admin_data_change') {
        fetchLiveIntel()
      }
    }
    window.addEventListener('storage', handleStorage)

    return () => {
      isMounted = false
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  const handleAlertClick = (link) => {
    if (!link) return
    if (link.startsWith('http://') || link.startsWith('https://')) {
      window.open(link, '_blank', 'noopener,noreferrer')
    } else {
      navigate(link)
    }
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

        {/* Scrolling Ticker Text */}
        <div className="flex-1 overflow-hidden whitespace-nowrap mask-gradient">
          <div className="inline-flex items-center gap-8 animate-ticker">
            {displayAlerts.map((alert, idx) => (
              <span
                key={`${alert.id || alert._id || 'alert'}-${idx}`}
                onClick={() => handleAlertClick(alert.link)}
                className={`inline-flex items-center gap-2 text-[11px] font-medium transition-colors ${
                  alert.link
                    ? 'text-slate-300 hover:text-white cursor-pointer group'
                    : 'text-slate-300 cursor-default'
                }`}
              >
                {alert.category && (
                  <span className="font-mono text-[10px] font-bold uppercase text-rose-400">
                    {alert.category}:
                  </span>
                )}
                <span className={alert.link ? 'group-hover:underline' : ''}>
                  {alert.text}
                </span>
                <span className="text-slate-600 font-serif ml-3">•</span>
              </span>
            ))}
          </div>
        </div>

        {/* Right CTA */}
        <button
          type="button"
          onClick={onNavigateExams || (() => navigate('/exams'))}
          className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-slate-300 hover:text-white transition-colors flex-shrink-0 cursor-pointer"
        >
          <span>Exams Bulletin</span>
          <ArrowRight className="h-3 w-3" />
        </button>

      </div>
    </div>
  )
}

export default LiveAlertTicker
