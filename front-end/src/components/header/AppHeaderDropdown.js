import React, { useEffect, useState, useRef } from 'react'
import {
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CButton,
} from '@coreui/react'
import { cilAccountLogout, cilList } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useNavigate } from 'react-router-dom'
//import avatar10 from './../../assets/images/avatars/10.jpg'
import axios from 'axios'
import { CToaster, CToast, CToastHeader, CToastBody } from '@coreui/react'
import packageJson from '../../../package.json'
const { config } = packageJson

const AppHeaderDropdown = () => {
  const [userName, setUserName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toast, addToast] = useState(null)
  const toaster = useRef()

  useEffect(() => {
    axios
      .post(`${config.REACT_APP_API_ENDPOINT}/`)
      .then((res) => {
        setLoading(false)
        if (res.data.valid) {
          setUserName(res.data.name)
        } else {
          navigate('/login')
        }
      })
      .catch((err) => {
        setLoading(false) // Set loading to false in case of an error
        setError('Error fetching user data')
        console.error(err)
      })
  }, [])
  const navigate = useNavigate()

  const handleDelete = () => {
    axios
      .get(`${config.REACT_APP_API_ENDPOINT}/logout`)
      .then((res) => {
        const deleteCookie = () => {
          document.cookie =
            'connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost'
        }
        deleteCookie('connect.sid')
        addToast(
          <CToast>
            <CToastHeader closeButton>{/* Icon and header content */}</CToastHeader>
            <CToastBody>Logged out successfully!</CToastBody>
          </CToast>,
        )
        window.location.reload()
        window.location.href = '#/login'
      })
      .catch((err) => console.log(err))
  }
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <CIcon icon={cilList} className="me-2" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        {loading ? (
          <CDropdownItem disabled>Loading...</CDropdownItem>
        ) : error ? (
          <CDropdownItem disabled>Error: {error}</CDropdownItem>
        ) : (
          <>
            <CDropdownHeader className="bg-light fw-semibold py-2">
              Account: {userName}
            </CDropdownHeader>
            <CDropdownDivider />
            <CDropdownItem>
              <CButton color="transparent" onClick={handleDelete}>
                <CIcon icon={cilAccountLogout} /> Log Out
              </CButton>
            </CDropdownItem>
            {toast && <CToaster ref={toaster} push={toast} placement="top-end" />}{' '}
            {/* Display the toast when there's a message */}
          </>
        )}
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
