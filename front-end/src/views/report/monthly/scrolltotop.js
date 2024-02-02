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

  const buttonStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 15px',
    cursor: 'pointer',
    outline: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    zIndex: '999',
  }

  return (
    <div>
      {isVisible && (
        <CButton className="scroll-to-top-button" style={buttonStyle} onClick={scrollToTop}>
          Go to Top
        </CButton>
      )}
    </div>
  )
}

export default ScrollToTopButton
