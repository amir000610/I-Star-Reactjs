// ScrollToTopButton.js
import React, { useState, useEffect } from 'react'
import { CButton } from '@coreui/react'

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false)

  // Listen to scroll events to determine when the button should be visible
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > window.innerHeight / 2
      setIsVisible(isScrolled)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Scroll to the top when the button is clicked
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <div>
      {isVisible && (
        <CButton className="scroll-to-top-button" onClick={scrollToTop}>
          Scroll to Top
        </CButton>
      )}
    </div>
  )
}

export default ScrollToTopButton
