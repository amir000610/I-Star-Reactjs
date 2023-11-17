import React from 'react'
import axios from 'axios'
import CIcon from '@coreui/icons-react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CAlert, CCardTitle } from '@coreui/react'
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

function ProgrammeStatus() {
  const getform = async () => {
    try {
      const getform = await axios.get(`${config.REACT_APP_API_ENDPOINT}/schedule`)
      setformdata(getform.data)
    } catch (err) {
      console.log(err)
    }
  }
  const [formdata, setformdata] = useState([])

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
    getform()
    getinstitution()
    console.log(formdata)
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
                <strong>Programme Status</strong>
              </CCardHeader>
              <CCardBody>
                <CCardTitle>As at: {formattedDate}</CCardTitle>
                <h4>Nurture and Development Programme (NDP)</h4>
                <CTable style={{ overflow: 'hidden' }} responsive bordered>
                  <CTableHead color="dark">
                    <CTableRow>
                      <CTableHeaderCell scope="col">
                        <center>No.</center>
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col">
                        <center>Institution</center>
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col">
                        <center>Module</center>
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col">
                        <center>Date</center>
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col">
                        <center>Duration</center>
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col">
                        <center>Status</center>
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {institutiondata.map((val, key) => {
                      return (
                        <CTableRow key={key}>
                          <CTableDataCell>
                            <center>{key + 1}</center>
                          </CTableDataCell>
                          <CTableDataCell>{val.learning_training_institutions}</CTableDataCell>
                          <CTableDataCell>
                            {formdata
                              ?.filter(
                                (idx) =>
                                  idx.institution_id === val.institution_id && idx.type === '1',
                              )
                              .map((val, key) => {
                                return (
                                  <div key={key}>
                                    {val.module_code} - {val.module_name}
                                  </div>
                                )
                              })}
                          </CTableDataCell>
                          <CTableDataCell>
                            {formdata
                              ?.filter(
                                (idx) =>
                                  idx.institution_id === val.institution_id && idx.type === '1',
                              )
                              .map((val, key) => {
                                const date = new Date(val.date)
                                const year = date.getFullYear()
                                const month = String(date.getMonth() + 1).padStart(2, '0')
                                const day = String(date.getDate()).padStart(2, '0')
                                const newDate = `${year}-${month}-${day}`
                                return <div key={key}>{newDate}</div>
                              })}
                          </CTableDataCell>
                          <CTableDataCell>
                            {formdata
                              ?.filter(
                                (idx) =>
                                  idx.institution_id === val.institution_id && idx.type === '1',
                              )
                              .map((val, key) => {
                                return <div key={key}>{val.hour} Hours</div>
                              })}
                          </CTableDataCell>
                          <CTableDataCell>
                            {formdata
                              ?.filter(
                                (idx) =>
                                  idx.institution_id === val.institution_id && idx.type === '1',
                              )
                              .map((val, key) => {
                                return (
                                  <div key={key}>
                                    {val.complete === 1 ? 'Delivered' : 'Not Delivered'}
                                  </div>
                                )
                              })}
                          </CTableDataCell>
                        </CTableRow>
                      )
                    })}
                  </CTableBody>
                </CTable>
              </CCardBody>
              <CCardBody>
                <h4>Academic Assistance Programme (AAP)</h4>
                <CTable style={{ overflow: 'hidden' }} responsive bordered>
                  <CTableHead color="dark">
                    <CTableRow>
                      <CTableHeaderCell scope="col">
                        <center>No.</center>
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col">
                        <center>Institution</center>
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col">
                        <center>Module</center>
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col">
                        <center>Date</center>
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col">
                        <center>Duration</center>
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col">
                        <center>Status</center>
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {institutiondata.map((val, key) => {
                      return (
                        <CTableRow key={key}>
                          <CTableDataCell>
                            <center>{key + 1}</center>
                          </CTableDataCell>
                          <CTableDataCell>{val.learning_training_institutions}</CTableDataCell>
                          <CTableDataCell>
                            {formdata
                              ?.filter(
                                (idx) =>
                                  idx.institution_id === val.institution_id &&
                                  (idx.type === '2' || idx.type === '3'),
                              )
                              .map((val, key) => {
                                return (
                                  <div key={key}>
                                    {val.module_code} - {val.module_name}
                                  </div>
                                )
                              })}
                          </CTableDataCell>
                          <CTableDataCell>
                            {formdata
                              ?.filter(
                                (idx) =>
                                  idx.institution_id === val.institution_id &&
                                  (idx.type === '2' || idx.type === '3'),
                              )
                              .map((val, key) => {
                                const date = new Date(val.date)
                                const year = date.getFullYear()
                                const month = String(date.getMonth() + 1).padStart(2, '0')
                                const day = String(date.getDate()).padStart(2, '0')
                                const newDate = `${year}-${month}-${day}`
                                return <div key={key}>{newDate}</div>
                              })}
                          </CTableDataCell>
                          <CTableDataCell>
                            {formdata
                              ?.filter(
                                (idx) =>
                                  idx.institution_id === val.institution_id &&
                                  (idx.type === '2' || idx.type === '3'),
                              )
                              .map((val, key) => {
                                return <div key={key}>{val.hour} Hours</div>
                              })}
                          </CTableDataCell>
                          <CTableDataCell>
                            {formdata
                              ?.filter(
                                (idx) =>
                                  idx.institution_id === val.institution_id &&
                                  (idx.type === '2' || idx.type === '3'),
                              )
                              .map((val, key) => {
                                return (
                                  <div key={key}>
                                    {val.complete === 1 ? 'Delivered' : 'Not Delivered'}
                                  </div>
                                )
                              })}
                          </CTableDataCell>
                        </CTableRow>
                      )
                    })}
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

export default ProgrammeStatus
