import React, { useState, useEffect } from 'react'
import {
  CForm,
  CCol,
  CFormInput,
  CFormLabel,
  CInputGroup,
  CInputGroupText,
  CButton,
  CRow,
  CTable,
  CTableDataCell,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react'
import { cilWarning, cilCheckCircle, cilOptions } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CCard, CCardBody, CCardHeader, CAlert } from '@coreui/react'
import axios from 'axios'
import packageJson from '../../../package.json'
const { config } = packageJson

const Tutoreg = () => {
  const [visible, setVisible] = useState(false)
  const [values, setvalues] = useState({
    name: '',
    email: '',
    password: '',
  })

  axios.defaults.withCredentials = true
  const handleSubmit = (event) => {
    event.preventDefault()
    setVisible(true)
    axios.post(`${config.REACT_APP_API_ENDPOINT}/register`, values).then((res) => {
      if (res.data.Status === 'Success') {
      } else {
        alert('error')
      }
    })
  }

  const regtutor = async (e) => {
    try {
      const regtutor = await axios.get(`${config.REACT_APP_API_ENDPOINT}/tutor`)
      settutor(regtutor.data)
    } catch (err) {
      console.log(err)
    }
  }
  const [tutor, settutor] = useState([])

  const onDelete = async (id) => {
    try {
      await axios.post(`${config.REACT_APP_API_ENDPOINT}/deleteregtutor`, { id })
      setDeleteSuccessVisible(true)
    } catch (err) {
      console.log(err)
    }
  }
  const [deleteSuccessVisible, setDeleteSuccessVisible] = useState(false)

  //Login Credential
  axios.defaults.withCredentials = true
  const [role, setrole] = useState('')

  //Alert
  useEffect(() => {
    regtutor()
    axios
      .post(`${config.REACT_APP_API_ENDPOINT}/`)
      .then((res) => {
        if (res.data.valid) {
          setrole(res.data.role)
        }
      })
      .catch((err) => console.log(err))
    if (role === 'Tutor') {
      setShowAlert(true)
    }
  }, [role, tutor])
  const [showAlert, setShowAlert] = useState(false)

  if (showAlert) {
    return (
      <CAlert color="danger" closeButton>
        <CIcon icon={cilWarning} className="flex-shrink-0 me-2" width={24} height={24} />
        You dont have permission to view this component.
      </CAlert>
    )
  }

  if (role === 'Admin') {
    return (
      <>
        {deleteSuccessVisible && (
          <CAlert color="success" dismissible onShow={() => setDeleteSuccessVisible(false)}>
            <CIcon icon={cilCheckCircle} className="flex-shrink-0 me-2" width={24} height={24} />
            Tutor deleted successfully!
          </CAlert>
        )}
        <CAlert color="success" dismissible visible={visible} onClose={() => setVisible(false)}>
          <CIcon icon={cilCheckCircle} className="flex-shrink-0 me-2" width={24} height={24} />
          Tutor registered successfully!
        </CAlert>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Tutor/Trainer Account</strong>
          </CCardHeader>
          <CCardBody>
            <CForm className="row g-3 needs-validation" onSubmit={handleSubmit}>
              <CCol md={4}>
                <CFormInput
                  type="text"
                  feedbackValid="Looks good!"
                  id="validationCustom01"
                  label="Name"
                  onChange={(e) => setvalues({ ...values, name: e.target.value })}
                  required
                />
              </CCol>
              <CCol md={4}>
                <CFormInput
                  type="text"
                  feedbackValid="Looks good!"
                  id="validationCustom02"
                  label="Passsword"
                  onChange={(e) => setvalues({ ...values, password: e.target.value })}
                  required
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="validationCustomUsername">Email</CFormLabel>
                <CInputGroup className="has-validation">
                  <CInputGroupText>@</CInputGroupText>
                  <CFormInput
                    type="text"
                    aria-describedby="inputGroupPrependFeedback"
                    feedbackValid="Please put your email."
                    id="validationCustomUsername"
                    onChange={(e) => setvalues({ ...values, email: e.target.value })}
                    required
                  />
                </CInputGroup>
              </CCol>
              <CCol xs={12}>
                <CButton color="primary" type="submit">
                  Register
                </CButton>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>List Tutor</strong>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CTable className="mt-3" style={{ overflow: 'hidden' }} responsive bordered>
                <CTableHead color="dark">
                  <CTableRow>
                    <CTableHeaderCell scope="col">
                      <center>No.</center>
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col">
                      <center>Tutor Registered</center>
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col">
                      <center>Email</center>
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col"></CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {tutor
                    ?.filter((idx) => idx.role === 'Tutor')
                    .map((val, key) => {
                      return (
                        <CTableRow key={key}>
                          <center>
                            <CTableDataCell>{key + 1}</CTableDataCell>
                          </center>
                          <CTableDataCell>
                            <center>{val.name}</center>
                          </CTableDataCell>
                          <CTableDataCell>
                            <center>{val.email}</center>
                          </CTableDataCell>
                          <CTableDataCell style={{ width: '50px' }}>
                            <CDropdown>
                              <CDropdownToggle color="transparent" caret={false}>
                                <CIcon icon={cilOptions} />
                              </CDropdownToggle>
                              <CDropdownMenu>
                                <CDropdownItem onClick={() => onDelete(val.login_id)}>
                                  Delete
                                </CDropdownItem>
                              </CDropdownMenu>
                            </CDropdown>
                          </CTableDataCell>
                        </CTableRow>
                      )
                    })}
                </CTableBody>
              </CTable>
            </CRow>
          </CCardBody>
        </CCard>
      </>
    )
  }
}

export default Tutoreg
