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
  CButton,
} from '@coreui/react'
import {
  CTableBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from '@coreui/react'
import * as XLSX from 'xlsx'
import { useState, useEffect } from 'react'
import { cilWarning } from '@coreui/icons'

import packageJson from '../../../../../package.json'
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

  const newdate = (datee) => {
    const date = new Date(datee)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const newDate = `${year}-${month}-${day}`
    return newDate
  }

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
  }, [])
  const [role, setrole] = useState('')

  //Alert
  useEffect(() => {
    if (role === 'Tutor') {
      setShowAlert(true)
    }
    console.log(formdata)
  }, [formdata])
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

  const uniqueStatus = (x) => {
    const uniqueStatus =
      formdata?.filter((idx) => idx.institution_id === x && idx.type === '1').length > 0
        ? 'Delivered'
        : 'Not Delivered'
    return uniqueStatus
  }

  const exportNDPToExcel = () => {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.table_to_sheet(document.getElementById('ndpTable'))
    XLSX.utils.book_append_sheet(wb, ws, 'NDP')
    XLSX.writeFile(wb, 'NDP_program_status.xlsx')
  }

  const exportAAPToExcel = () => {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.table_to_sheet(document.getElementById('aapTable'))
    XLSX.utils.book_append_sheet(wb, ws, 'AAP')
    XLSX.writeFile(wb, 'AAP_program_status.xlsx')
  }

  if (role === 'Admin') {
    return (
      <div>
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>PROGRAMME STATUS</strong>
              </CCardHeader>
              <CCardBody>
                <CCardTitle style={{ display: 'flex', justifyContent: 'space-between' }}>
                  As at: {formattedDate}
                  {''} <CButton onClick={exportNDPToExcel}>Export To Excel</CButton>
                </CCardTitle>
                <h4>Nurture and Development Programme (NDP)</h4>
                <CTable id="ndpTable" style={{ overflow: 'hidden' }} responsive bordered>
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
                    {institutiondata
                      .filter((idx) => idx.institution_id !== 8)
                      .map((val, key) => {
                        return (
                          <CTableRow key={key}>
                            <CTableDataCell>
                              <center>{key + 1}</center>
                            </CTableDataCell>
                            <CTableDataCell>{val.learning_training_institutions}</CTableDataCell>
                            <CTableDataCell>
                              {[
                                ...new Map(
                                  formdata
                                    ?.filter(
                                      (idx) =>
                                        idx.institution_id === val.institution_id &&
                                        idx.type === '1',
                                    )
                                    .map((val) => [val.module_name, val]), // Convert array to key-value pairs
                                ).values(),
                              ] // Get the values from the Map to retain unique modules
                                .map((val, key) => (
                                  <div key={key}> {val.module_name}</div>
                                ))}
                            </CTableDataCell>
                            <CTableDataCell>
                              {formdata
                                ?.filter(
                                  (idx) =>
                                    idx.institution_id === val.institution_id && idx.type === '1',
                                )
                                .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort the dates in ascending order
                                .reduce((acc, curr) => {
                                  const lastEntry = acc[acc.length - 1]

                                  if (
                                    lastEntry &&
                                    new Date(curr.date).getTime() -
                                      new Date(lastEntry.endDate).getTime() <=
                                      86400000 // Check if current date is within 1 day of the last entry's endDate
                                  ) {
                                    // If the current date is consecutive to the last entry, update the endDate
                                    lastEntry.endDate = curr.end_date // Assuming the end_date attribute is 'end_date' in your database
                                  } else {
                                    // If not consecutive, push a new object into the accumulator array
                                    acc.push({
                                      startDate: curr.date,
                                      endDate: curr.end_date, // Assuming the end_date attribute is 'end_date' in your database
                                    })
                                  }
                                  return acc
                                }, [])
                                .map((val, key) => {
                                  const startDate = new Date(val.startDate)
                                  const endDate = new Date(val.endDate)
                                  const startDay = startDate.getDate()
                                  const startMonth = startDate.toLocaleString('default', {
                                    month: 'long',
                                  })
                                  const endDay = endDate.getDate()
                                  const endMonth = endDate.toLocaleString('default', {
                                    month: 'long',
                                  })
                                  const year = startDate.getFullYear()

                                  const displayDate =
                                    startDay !== endDay
                                      ? `${startDay} - ${endDay} ${startMonth} ${year}`
                                      : `${startDay} ${startMonth} ${year}`

                                  return (
                                    <div key={key}>
                                      <b>-</b> {displayDate}
                                    </div>
                                  )
                                })}
                            </CTableDataCell>
                            <CTableDataCell>
                              {[
                                ...new Set(
                                  formdata
                                    ?.filter(
                                      (idx) =>
                                        idx.institution_id === val.institution_id &&
                                        idx.type === '1',
                                    )
                                    .map((val) => val.hour),
                                ),
                              ].map((hour, key) => (
                                <div key={key}>{hour} Hours</div>
                              ))}
                            </CTableDataCell>
                            <CTableDataCell>{uniqueStatus(val.institution_id)}</CTableDataCell>
                          </CTableRow>
                        )
                      })}
                  </CTableBody>
                </CTable>
              </CCardBody>
              <CCardBody>
                <CCardTitle style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h4>Academic Assistance Programme (AAP)</h4>
                  {''} <CButton onClick={exportAAPToExcel}>Export To Excel</CButton>
                </CCardTitle>
                <CTable id="aapTable" style={{ overflow: 'hidden' }} responsive bordered>
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
                    {institutiondata
                      .filter((i) => i.institution_id !== 8)
                      .map((val1, key1) => {
                        let previousModule = null
                        let rowspanCounter = 0
                        return formdata
                          .filter((i) => i.institution_id === val1.institution_id && i.type !== '1')
                          .map((val2, key2, arr) => {
                            const displayModule =
                              val2.module_name !== previousModule ? val2.module_name : null
                            previousModule = val2.module_name
                            if (displayModule) {
                              rowspanCounter = arr.filter(
                                (item) => item.module_name === val2.module_name,
                              ).length
                            }
                            return (
                              <CTableRow key={`${key1}-${key2}`}>
                                {key2 === 0 && (
                                  <>
                                    <CTableDataCell
                                      rowSpan={
                                        formdata.filter(
                                          (i) =>
                                            i.institution_id === val1.institution_id &&
                                            i.type !== '1',
                                        ).length
                                      }
                                    >
                                      {key1 + 1}
                                    </CTableDataCell>
                                    <CTableDataCell
                                      rowSpan={
                                        formdata.filter(
                                          (i) =>
                                            i.institution_id === val1.institution_id &&
                                            i.type !== '1',
                                        ).length
                                      }
                                    >
                                      {key2 === 0 && val1.learning_training_institutions}
                                    </CTableDataCell>
                                  </>
                                )}
                                {displayModule && (
                                  <CTableDataCell rowSpan={rowspanCounter}>
                                    {displayModule}
                                  </CTableDataCell>
                                )}
                                {!displayModule && key2 === 0 && (
                                  <CTableDataCell
                                    rowSpan={
                                      formdata.filter(
                                        (i) =>
                                          i.institution_id === val1.institution_id &&
                                          i.type !== '1',
                                      ).length
                                    }
                                  >
                                    {val1.learning_training_institutions}
                                  </CTableDataCell>
                                )}
                                <CTableDataCell style={{ width: '25%' }}>
                                  {newdate(val2.date)} <b>until</b> {newdate(val2.end_date)}
                                </CTableDataCell>
                                <CTableDataCell>{val2.hour} Hours</CTableDataCell>
                                <CTableDataCell>
                                  {val2.complete ? 'Delivered' : 'Not Delivered'}
                                </CTableDataCell>
                              </CTableRow>
                            )
                          })
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
