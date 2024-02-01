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

  const today = new Date()
  const options = { day: 'numeric', month: 'long', year: 'numeric' }
  const formattedDate = today.toLocaleDateString('en-US', options)

  const uniqueStatus = (x) => {
    const uniqueStatus =
      formdata?.filter(
        (idx) =>
          idx.institution_id === x && idx.type === '1' && idx.type === '2' && idx.type === '3',
      ).length > 0
        ? 'Delivered'
        : 'Not Delivered'
    return uniqueStatus
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
                                    .map((val) => [val.module_code, val]), // Convert array to key-value pairs
                                ).values(),
                              ] // Get the values from the Map to retain unique modules
                                .map((val, key) => (
                                  <div key={key}>
                                    {val.module_code} - {val.module_name}
                                  </div>
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

                                  return <div key={key}>{displayDate}</div>
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
                                        idx.type === '2' &&
                                        idx.type === '3',
                                    )
                                    .map((val) => [val.module_code, val]), // Convert array to key-value pairs
                                ).values(),
                              ] // Get the values from the Map to retain unique modules
                                .map((val, key) => (
                                  <div key={key}>
                                    {val.module_code} - {val.module_name}
                                  </div>
                                ))}
                            </CTableDataCell>
                            <CTableDataCell>
                              {formdata
                                ?.filter(
                                  (idx) =>
                                    idx.institution_id === val.institution_id &&
                                    idx.type === '2' &&
                                    idx.type === '3',
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

                                  return <div key={key}>{displayDate}</div>
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
