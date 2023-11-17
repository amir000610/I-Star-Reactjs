import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="main-footer">
      <div>
        <a href="https://coreui.io" target="_blank" rel="noopener noreferrer">
          LTM
        </a>
        <span className="ms-1">&copy; Irshad hr Consulting.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://coreui.io/react" target="_blank" rel="noopener noreferrer">
          Learning Technology & Media
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
