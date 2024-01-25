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
  CButton,
} from '@coreui/react'
import * as XLSX from 'xlsx'
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

import packageJson from '../../../../../package.json'
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
      const getinstitution = await axios.get(`${config.REACT_APP_API_ENDPOINT}/Xinstitution`)
      setinstitutiondata(getinstitution.data)
    } catch (err) {
      console.log(err)
    }
  }
  const [institutiondata, setinstitutiondata] = useState([])

  const RKDAinstitution = async () => {
    try {
      const RKDAinstitution = await axios.get(`${config.REACT_APP_API_ENDPOINT}/RKDAinstitution`)
      setXinstitutiondata(RKDAinstitution.data)
    } catch (err) {
      console.log(err)
    }
  }
  const [Xinstitutiondata, setXinstitutiondata] = useState([])

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
    RKDAinstitution()
  }, [])
  const [role, setrole] = useState('')

  //Alert
  useEffect(() => {
    if (role === 'Tutor') {
      setShowAlert(true)
      console.log(role)
    }
  }, [])
  const [showAlert, setShowAlert] = useState(false)

  if (showAlert) {
    return (
      <CAlert color="danger" closeButton>
        <CIcon icon={cilWarning} className="flex-shrink-0 me-2" width={24} height={24} />
        You dont have permission to view this component.
      </CAlert>
    )
  }

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new()
    const tableData = []

    // Constructing the table data array
    const headers = [
      'Institution',
      '7-12 Year(M)',
      '7-12 Year(F)',
      '13-17 Year(M)',
      '13-17 Year(F)',
      'TOTAL',
      'ACTIVE',
      'Completed',
      'Incomplete',
    ]
    tableData.push(headers)

    // Pushing rows of data
    institutiondata.forEach((val) => {
      const rowData = [val.learning_training_institutions]

      // Push individual cell data based on your table structure
      // Modify this according to your data structure
      rowData.push(
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
        ).length,
      )
      rowData.push(
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
        ).length,
      )
      rowData.push(
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
        ).length,
      )
      rowData.push(
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
        ).length,
      )
      rowData.push(StudentData?.filter((idx) => idx.institution_id === val.institution_id).length)
      rowData.push(
        StudentData?.filter(
          (idx) =>
            idx.institution_id === val.institution_id && idx.status_on_programme === 'ACTIVE',
        ).length,
      )
      rowData.push(
        StudentData?.filter(
          (idx) =>
            idx.institution_id === val.institution_id && idx.status_on_programme === 'COMPLETED',
        ).length,
      )
      rowData.push(
        StudentData?.filter(
          (idx) =>
            idx.institution_id === val.institution_id && idx.status_on_programme === 'INCOMPLETE',
        ).length,
      )

      // Push the rowData to the tableData array
      tableData.push(rowData)
    })

    const footer = [
      'Total',
      '',
      '',
      '',
      '',
      StudentData?.filter((idx) => idx.institution_id !== 8).length,
      StudentData?.filter((idx) => idx.status_on_programme === 'ACTIVE' && idx.institution_id !== 8)
        .length,
      StudentData?.filter(
        (idx) => idx.status_on_programme === 'COMPLETED' && idx.institution_id !== 8,
      ).length,
      StudentData?.filter(
        (idx) => idx.status_on_programme === 'INCOMPLETE' && idx.institution_id !== 8,
      ).length,
    ]
    tableData.push(footer)

    // Creating a worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(tableData)
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1')

    // Save the workbook as an Excel file
    XLSX.writeFile(workbook, 'Participant_Info.xlsx')
  }

  const today = new Date()
  const options = { day: 'numeric', month: 'long', year: 'numeric' }
  const formattedDate = today.toLocaleDateString('en-US', options)

  console.log(StudentData.filter((idx) => idx.institution_id === 8))

  if (role === 'Admin') {
    return (
      <div>
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>PARTICIPANTS INFORMATION</strong>
              </CCardHeader>
              <CCardBody>
                <CCardTitle style={{ display: 'flex', justifyContent: 'space-between' }}>
                  As at: {formattedDate}
                  {''} <CButton onClick={exportToExcel}>Export to Excel</CButton>
                </CCardTitle>
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
                        <center>
                          {StudentData?.filter((idx) => idx.institution_id !== 8).length}
                        </center>
                      </CTableDataCell>
                      <CTableDataCell>
                        <center>
                          {
                            StudentData?.filter(
                              (idx) =>
                                idx.status_on_programme === 'ACTIVE' && idx.institution_id !== 8,
                            ).length
                          }
                        </center>
                      </CTableDataCell>
                      <CTableDataCell>
                        <center>
                          {
                            StudentData?.filter(
                              (idx) =>
                                idx.status_on_programme === 'COMPLETED' && idx.institution_id !== 8,
                            ).length
                          }
                        </center>
                      </CTableDataCell>
                      <CTableDataCell>
                        <center>
                          {
                            StudentData?.filter(
                              (idx) =>
                                idx.status_on_programme === 'INCOMPLETE' &&
                                idx.institution_id !== 8,
                            ).length
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
