import { useState, useEffect } from 'react'

/**
 * Returns active URLs for Public User Website and College Representative Portal.
 * Automatically handles port swapping in local dev (e.g. 5173 vs 5174)
 * and environment variable overrides for production deployments.
 */
export function usePortalUrls() {
  const isLive =
    import.meta.env.PROD ||
    (typeof window !== 'undefined' && window.location.hostname.includes('vidyascope.com'))

  const [urls, setUrls] = useState({
    publicWebsiteUrl:
      import.meta.env.VITE_PUBLIC_WEBSITE_URL ||
      (isLive ? 'https://vidyascope.com' : 'http://localhost:5174'),
    collegePortalUrl:
      import.meta.env.VITE_COLLEGE_PORTAL_URL ||
      (isLive ? 'https://onair.vidyascope.com' : 'http://localhost:5173'),
  })

  useEffect(() => {
    // If in production or on live domain, lock to live URLs
    if (isLive) {
      setUrls({
        publicWebsiteUrl: 'https://vidyascope.com',
        collegePortalUrl: 'https://onair.vidyascope.com',
      })
      return
    }

    // If explicit env vars are configured, use them
    if (import.meta.env.VITE_PUBLIC_WEBSITE_URL && import.meta.env.VITE_COLLEGE_PORTAL_URL) {
      setUrls({
        publicWebsiteUrl: import.meta.env.VITE_PUBLIC_WEBSITE_URL,
        collegePortalUrl: import.meta.env.VITE_COLLEGE_PORTAL_URL,
      })
      return
    }

    // In local dev, probe which port hosts vidyascope-ui (user website)
    // vidyascope-ui serves /logo.png as image/png, whereas college-dashboard returns HTML 200
    const probeImage = (baseUrl) => {
      return new Promise((resolve) => {
        const img = new Image()
        const timer = setTimeout(() => resolve(false), 900)
        img.onload = () => {
          clearTimeout(timer)
          resolve(true)
        }
        img.onerror = () => {
          clearTimeout(timer)
          resolve(false)
        }
        img.src = `${baseUrl}/logo.png?probe=${Date.now()}`
      })
    }

    let isMounted = true
    ;(async () => {
      try {
        const is5173UserApp = await probeImage('http://localhost:5173')
        if (!isMounted) return

        if (is5173UserApp) {
          // 5173 has the user logo, so 5173 is user website and 5174 is college portal
          setUrls({
            publicWebsiteUrl: 'http://localhost:5173',
            collegePortalUrl: 'http://localhost:5174',
          })
        } else {
          // 5174 is user website and 5173 is college portal
          setUrls({
            publicWebsiteUrl: 'http://localhost:5174',
            collegePortalUrl: 'http://localhost:5173',
          })
        }
      } catch (err) {
        // Fallback remains active
      }
    })()

    return () => {
      isMounted = false
    }
  }, [])

  return urls
}
