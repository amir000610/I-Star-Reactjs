import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CImage,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import logo from 'src/assets/brand/i-star logo (2).png'
import packageJson from '../../../../package.json'
const { config } = packageJson

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [values, setvalues] = useState({
    email: '',
    password: '',
  })

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const checkLoggedIn = () => {
    axios
      .post(`${config.REACT_APP_API_ENDPOINT}/`, { withCredentials: true })
      .then((res) => {
        if (res.data.valid) {
          navigate('/dashboard')
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const navigate = useNavigate()
  axios.defaults.withCredentials = true
  const handleSubmit = (event) => {
    event.preventDefault()
    checkLoggedIn()
    console.log('Check login successful')
    axios.post(`${config.REACT_APP_API_ENDPOINT}/login`, values).then((res) => {
      if (res.data.Status === 'Success') {
        navigate('/dashboard')
      } else {
        console.log('error:' + res.data.Error)
      }
    })
  }

  useEffect(() => {
    const interval = setInterval(() => {}, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <div
        style={{
          content: '"',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'white',
          backgroundImage: `url('https://media.istockphoto.com/photos/business-network-concept-customer-support-shaking-hands-picture-id1256603011?k=20&m=1256603011&s=612x612&w=0&h=ZoZ6LyKdwAqubUtMloUivfG1EYiIDUTJytFX-KK1Xdc=')`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          opacity: 0.9,
        }}
      ></div>
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={12} className="d-flex align-items-center justify-content-center">
            <CCard className="p-2" style={{ width: '30rem' }}>
              <CCardBody>
                <CForm>
                  <CRow className="mb-2">
                    <CCol xs={12} className="d-flex allign-item-center justify-content-center">
                      <CImage src={logo} fluid width={170} />
                    </CCol>
                  </CRow>
                  <h2>Login</h2>
                  <h6>Welcome Back! Please enter your detail.</h6>
                  {/*<FaceRecognition onFaceDetected={handleFaceDetected} />*/}
                  <CInputGroup className="mb-2">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      type="Email"
                      name="email"
                      placeholder="Email"
                      onChange={(e) => setvalues({ ...values, email: e.target.value })}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-2">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Password"
                      value={values.password}
                      onChange={(e) => setvalues({ ...values, password: e.target.value })}
                    />
                    <span
                      onClick={togglePasswordVisibility}
                      style={{
                        cursor: 'pointer',
                        marginLeft: '-25px', // Adjusted margin
                        marginTop: '8px', // Adjusted margin
                        zIndex: '2', // Ensuring the icon is above the input field
                        position: 'relative', // Ensuring the icon stays in position
                      }}
                    >
                      {showPassword ? (
                        <FontAwesomeIcon icon={faEye} />
                      ) : (
                        <FontAwesomeIcon icon={faEyeSlash} />
                      )}
                    </span>
                  </CInputGroup>
                  <CRow>
                    <CCol xs={6}>
                      <CButton color="primary" className="px-4" onClick={handleSubmit}>
                        Login
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
