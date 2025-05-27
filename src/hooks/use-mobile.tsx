
import * as React from "react"

const MOBILE_BREAKPOINT = 640 // Changed from 768 to match Tailwind's sm breakpoint

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Set initial value
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Create media query list and listener function
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    const handleResize = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches)
    }
    
    // Modern approach for adding listener
    if (mql.addEventListener) {
      mql.addEventListener("change", handleResize)
    } else {
      // Fallback for older browsers
      window.addEventListener("resize", () => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      })
    }
    
    // Initial check
    handleResize(mql)
    
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", handleResize)
      } else {
        window.removeEventListener("resize", () => {
          setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
        })
      }
    }
  }, [])

  return isMobile
}
