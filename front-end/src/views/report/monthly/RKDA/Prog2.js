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
  CButton,
  CContainer,
  CCallout,
} from '@coreui/react'
import { useState, useEffect } from 'react'
import { cilWarning } from '@coreui/icons'
import * as XLSX from 'xlsx'

import packageJson from '../../../../../package.json'
const { config } = packageJson

function Programme2() {
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
  })
  const [role, setrole] = useState('')

  //Alert
  useEffect(() => {
    if (role === 'Tutor') {
      setShowAlert(true)
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

  // Function to handle export to Excel
  const handleExportToExcel = () => {
    // Prepare data for export (similar to what you display in the table)
    const data = [
      {
        No: 1,
        Institution: 'RKDA Putera',
        'AAP English': `${formdata
          .filter((idx) => idx.institution_id === 8 && idx.complete === 1 && idx.type === '2')
          .map((val) => Number(val.hour))
          .reduce((acc, currentValue) => acc + currentValue, 0)} / 60`,
        NDP: `${formdata
          .filter((idx) => idx.institution_id === 8 && idx.complete === 1 && idx.type === '1')
          .map((val) => Number(val.hour))
          .reduce((acc, currentValue) => acc + currentValue, 0)} / 60`,
      },
      {
        No: 2,
        Institution: 'RKDA Puteri',
        'AAP English': `${formdata
          .filter((idx) => idx.institution_id === 8 && idx.complete === 1 && idx.type === '2')
          .map((val) => Number(val.hour))
          .reduce((acc, currentValue) => acc + currentValue, 0)} / 60`,
        NDP: `${formdata
          .filter((idx) => idx.institution_id === 8 && idx.complete === 1 && idx.type === '1')
          .map((val) => Number(val.hour))
          .reduce((acc, currentValue) => acc + currentValue, 0)} / 60`,
      },
    ]
    // Create a new workbook
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(data)

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

    // Generate a downloadable Excel file
    XLSX.writeFile(workbook, 'Delivery_status_RKDA.xlsx')
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
                <strong>PROGRAM DELIVERY STATUS</strong>
              </CCardHeader>
              {/*RKDA*/}
              <CCardBody>
                <CCardTitle style={{ display: 'flex', justifyContent: 'space-between' }}>
                  As at: {formattedDate}
                  {''} <CButton onClick={handleExportToExcel}>Export to Excel</CButton>
                </CCardTitle>
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
                        <center>NDP</center>
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {institutiondata
                      .filter((idx) => idx.institution_id === 8)
                      .map((val, key) => {
                        return (
                          <CTableRow key={key}>
                            <CTableDataCell>
                              <center>{key + 1}</center>
                            </CTableDataCell>
                            <CTableDataCell>
                              <center>{val.learning_training_institutions}(Putera)</center>
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
                                {val.institution_id === 8 ? '/60' : '/30'}
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
                                {val.institution_id === 8 ? '/60' : '/90'}
                              </center>
                            </CTableDataCell>
                          </CTableRow>
                        )
                      })}
                    {institutiondata
                      .filter((idx) => idx.institution_id === 8)
                      .map((val, key) => {
                        return (
                          <CTableRow key={key}>
                            <CTableDataCell>
                              <center>{key + 2}</center>
                            </CTableDataCell>
                            <CTableDataCell>
                              <center>{val.learning_training_institutions}(puteri)</center>
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
                                {val.institution_id === 8 ? '/60' : '/30'}
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
                                {val.institution_id === 8 ? '/60' : '/90'}
                              </center>
                            </CTableDataCell>
                          </CTableRow>
                        )
                      })}
                  </CTableBody>
                </CTable>
                <h6>*AAP English = 60 hours/year</h6>
                <h6>*NDP = 60 hours/year</h6>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>
    )
  }
}

export default Programme2
