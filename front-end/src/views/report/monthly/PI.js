import React from 'react'
import axios from 'axios'
import CIcon from '@coreui/icons-react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CAlert,
  CCardTitle,
  CContainer,
} from '@coreui/react'
import {
  CTableBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from '@coreui/react'
import { useState, useEffect } from 'react'
import { cilWarning } from '@coreui/icons'

import packageJson from '../../../../package.json'
const { config } = packageJson

function ParticipantInfo() {
  const getData = async (e) => {
    try {
      const getData = await axios.get(`${config.REACT_APP_API_ENDPOINT}/getpd3`)
      setstudent(getData.data)
    } catch (err) {
      console.log(err)
    }
  }
  const [StudentData, setstudent] = useState([])

  const getinstitution = async () => {
    try {
      const getinstitution = await axios.get(`${config.REACT_APP_API_ENDPOINT}/institution`)
      setinstitutiondata(getinstitution.data)
    } catch (err) {
      console.log(err)
    }
  }
  const [institutiondata, setinstitutiondata] = useState([])

  //Login Credential
  axios.defaults.withCredentials = true
  useEffect(() => {
    axios
      .post(`${config.REACT_APP_API_ENDPOINT}/`)
      .then((res) => {
        if (res.data.valid) {
          setrole(res.data.role)
        }
      })
      .catch((err) => console.log(err))
    getData()
    getinstitution()
  })
  const [role, setrole] = useState('')

  //Alert
  useEffect(() => {
    if (role === 'Tutor') {
      setShowAlert(true)
      console.log(role)
    }
  }, [role])
  const [showAlert, setShowAlert] = useState(false)

  if (showAlert) {
    return (
      <CAlert color="danger" closeButton>
        <CIcon icon={cilWarning} className="flex-shrink-0 me-2" width={24} height={24} />
        You dont have permission to view this component.
      </CAlert>
    )
  }

  const today = new Date()
  const options = { day: 'numeric', month: 'long', year: 'numeric' }
  const formattedDate = today.toLocaleDateString('en-US', options)

  if (role === 'Admin') {
    return (
      <div>
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Participants Information</strong>
              </CCardHeader>
              <CCardBody>
                <CCardTitle>As at: {formattedDate}</CCardTitle>
                <CTable className="mt-3" responsive bordered>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell rowSpan={3} color="dark">
                        <center>No</center>
                      </CTableHeaderCell>
                      <CTableHeaderCell rowSpan={3} color="dark">
                        <center>Institution</center>
                      </CTableHeaderCell>
                      <CTableHeaderCell colSpan={8} color="dark">
                        <center>Student Information</center>
                      </CTableHeaderCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableHeaderCell rowSpan={2}>
                        <center>7-12 Year(M)</center>
                      </CTableHeaderCell>
                      <CTableHeaderCell rowSpan={2}>
                        <center>7-12 Year(F)</center>
                      </CTableHeaderCell>
                      <CTableHeaderCell rowSpan={2}>
                        <center>13-17 Year(M)</center>
                      </CTableHeaderCell>
                      <CTableHeaderCell rowSpan={2}>
                        <center>13-17 Year(F)</center>
                      </CTableHeaderCell>
                      <CTableHeaderCell rowSpan={2}>
                        <center>TOTAL</center>
                      </CTableHeaderCell>
                      <CTableHeaderCell rowSpan={2}>
                        <center>ACTIVE</center>
                      </CTableHeaderCell>
                      <CTableHeaderCell colSpan={2}>
                        <center>INACTIVE</center>
                      </CTableHeaderCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableHeaderCell>
                        <center>Completed</center>
                      </CTableHeaderCell>
                      <CTableHeaderCell>
                        <center>Incomplete</center>
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {institutiondata.map((val, key) => {
                      return (
                        <CTableRow key={key}>
                          <CTableDataCell color="dark">{key + 1}</CTableDataCell>
                          <CTableDataCell>{val.learning_training_institutions}</CTableDataCell>
                          <CTableDataCell>
                            <center>
                              {
                                StudentData?.filter(
                                  (idx) =>
                                    idx.institution_id === val.institution_id &&
                                    (idx.level === 'S1' ||
                                      idx.level === 'S2' ||
                                      idx.level === 'S3' ||
                                      idx.level === 'S4' ||
                                      idx.level === 'S5') &&
                                    idx.gender === 'MALE' &&
                                    idx.status_on_programme === 'ACTIVE',
                                ).length
                              }
                            </center>
                          </CTableDataCell>
                          <CTableDataCell>
                            <center>
                              {
                                StudentData?.filter(
                                  (idx) =>
                                    idx.institution_id === val.institution_id &&
                                    (idx.level === 'S1' ||
                                      idx.level === 'S2' ||
                                      idx.level === 'S3' ||
                                      idx.level === 'S4' ||
                                      idx.level === 'S5') &&
                                    idx.gender === 'FEMALE' &&
                                    idx.status_on_programme === 'ACTIVE',
                                ).length
                              }
                            </center>
                          </CTableDataCell>
                          <CTableDataCell>
                            <center>
                              {
                                StudentData?.filter(
                                  (idx) =>
                                    idx.institution_id === val.institution_id &&
                                    (idx.level === 'F1' ||
                                      idx.level === 'F2' ||
                                      idx.level === 'F3' ||
                                      idx.level === 'F4' ||
                                      idx.level === 'F5') &&
                                    idx.gender === 'MALE' &&
                                    idx.status_on_programme === 'ACTIVE',
                                ).length
                              }
                            </center>
                          </CTableDataCell>
                          <CTableDataCell>
                            <center>
                              {
                                StudentData?.filter(
                                  (idx) =>
                                    idx.institution_id === val.institution_id &&
                                    (idx.level === 'F1' ||
                                      idx.level === 'F2' ||
                                      idx.level === 'F3' ||
                                      idx.level === 'F4' ||
                                      idx.level === 'F5') &&
                                    idx.gender === 'FEMALE' &&
                                    idx.status_on_programme === 'ACTIVE',
                                ).length
                              }
                            </center>
                          </CTableDataCell>
                          <CTableDataCell>
                            <center>
                              {
                                StudentData?.filter(
                                  (idx) => idx.institution_id === val.institution_id,
                                ).length
                              }
                            </center>
                          </CTableDataCell>
                          <CTableDataCell>
                            <center>
                              {
                                StudentData?.filter(
                                  (idx) =>
                                    idx.institution_id === val.institution_id &&
                                    idx.status_on_programme === 'ACTIVE',
                                ).length
                              }
                            </center>
                          </CTableDataCell>
                          <CTableDataCell>
                            <center>
                              {
                                StudentData?.filter(
                                  (idx) =>
                                    idx.institution_id === val.institution_id &&
                                    idx.status_on_programme === 'COMPLETED',
                                ).length
                              }
                            </center>
                          </CTableDataCell>
                          <CTableDataCell>
                            <center>
                              {
                                StudentData?.filter(
                                  (idx) =>
                                    idx.institution_id === val.institution_id &&
                                    idx.status_on_programme === 'INCOMPLETE',
                                ).length
                              }
                            </center>
                          </CTableDataCell>
                        </CTableRow>
                      )
                    })}
                    <CTableRow color="dark">
                      <CTableDataCell colSpan={6}>
                        <center>Total</center>
                      </CTableDataCell>
                      <CTableDataCell>
                        <center>{StudentData?.length}</center>
                      </CTableDataCell>
                      <CTableDataCell>
                        <center>
                          {
                            StudentData?.filter((idx) => idx.status_on_programme === 'ACTIVE')
                              .length
                          }
                        </center>
                      </CTableDataCell>
                      <CTableDataCell>
                        <center>
                          {
                            StudentData?.filter((idx) => idx.status_on_programme === 'COMPLETED')
                              .length
                          }
                        </center>
                      </CTableDataCell>
                      <CTableDataCell>
                        <center>
                          {
                            StudentData?.filter((idx) => idx.status_on_programme === 'INCOMPLETE')
                              .length
                          }
                        </center>
                      </CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>
    )
  }
}

export default ParticipantInfo
