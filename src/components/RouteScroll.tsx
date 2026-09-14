import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const RouteScroll = () => {
  const location = useLocation()

  useEffect(() => {
    // Wait until the destination page and menu scroll-lock effects have settled.
    const frame = window.requestAnimationFrame(() => {
      if (location.hash) {
        let id = location.hash.slice(1)
        try { id = decodeURIComponent(id) } catch { /* Keep malformed external hashes harmless. */ }
        document.getElementById(id)?.scrollIntoView()
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' })
      }
    })

    return () => window.cancelAnimationFrame(frame)
  }, [location])

  return null
}

export default RouteScroll
