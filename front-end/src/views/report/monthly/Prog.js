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

function Programme() {
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
                <strong>Program Delivery Status</strong>
              </CCardHeader>
              <CCardBody>
                <CCardTitle>As at: {formattedDate}</CCardTitle>
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
                        <center>AAP English</center>
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col">
                        <center>AAP Math</center>
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col">
                        <center>NDP</center>
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
                          <CTableDataCell>
                            <center>{val.institution_name}</center>
                          </CTableDataCell>
                          <CTableDataCell>
                            <center>
                              {
                                formdata
                                  .filter(
                                    (idx) =>
                                      idx.institution_id === val.institution_id &&
                                      idx.complete === 1 &&
                                      idx.type === '2',
                                  )
                                  .map((val, key) => Number(val.hour)) // Convert values to numbers
                                  .reduce((acc, currentValue) => acc + currentValue, 0) // Calculate the total
                              }{' '}
                              / 30
                            </center>
                          </CTableDataCell>
                          <CTableDataCell>
                            <center>
                              {
                                formdata
                                  .filter(
                                    (idx) =>
                                      idx.institution_id === val.institution_id &&
                                      idx.complete === 1 &&
                                      idx.type === '3',
                                  )
                                  .map((val, key) => Number(val.hour)) // Convert values to numbers
                                  .reduce((acc, currentValue) => acc + currentValue, 0) // Calculate the total
                              }{' '}
                              / 30{' '}
                            </center>
                          </CTableDataCell>
                          <CTableDataCell>
                            <center>
                              {
                                formdata
                                  .filter(
                                    (idx) =>
                                      idx.institution_id === val.institution_id &&
                                      idx.complete === 1 &&
                                      idx.type === '1',
                                  )
                                  .map((val, key) => Number(val.hour)) // Convert values to numbers
                                  .reduce((acc, currentValue) => acc + currentValue, 0) // Calculate the total
                              }{' '}
                              / 90{' '}
                            </center>
                          </CTableDataCell>
                        </CTableRow>
                      )
                    })}
                  </CTableBody>
                </CTable>
                <h6>*AAP English = 30 hours/year</h6>
                <h6>*AAP Math = 30 hours/year</h6>
                <h6>*NDP = 90 hours/year</h6>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>
    )
  }
}

export default Programme
