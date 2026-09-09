import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const RouteScroll = () => {
  const location = useLocation()

  useEffect(() => {
    // Wait until the destination page and menu scroll-lock effects have settled.
    const frame = window.requestAnimationFrame(() => {
      if (location.hash) {
        document.getElementById(location.hash.slice(1))?.scrollIntoView()
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' })
      }
    })

    return () => window.cancelAnimationFrame(frame)
  }, [location])

  return null
}

export default RouteScroll
