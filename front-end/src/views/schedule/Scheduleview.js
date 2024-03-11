import React from 'react'
import {
  CModal,
  CButton,
  CModalFooter,
  CCallout,
  CRow,
  CCol,
  CAlert,
  CContainer,
} from '@coreui/react'
import { CModalBody, CCardHeader } from '@coreui/react'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faXmark, faFileExport } from '@fortawesome/free-solid-svg-icons'
import propTypes from 'prop-types'
import axios from 'axios'
import { useState, useEffect } from 'react'
import packageJson from '../../../package.json'
import { useNavigate } from 'react-router-dom'
const { config } = packageJson

const Scheduleview = ({ Tvisible, TsetVisible, schedule_id }) => {
  const [StudentData, setstudent] = useState([])
  const [TutorData, setTutorData] = useState([])
  const [role, setrole] = useState('')
  const navigate = useNavigate()

  const getData = async () => {
    try {
      const getData = await axios.get(`${config.REACT_APP_API_ENDPOINT}/getpd`)
      setstudent(getData.data)
    } catch (err) {
      console.log(err)
    }
  }

  const gettutor = async (e) => {
    try {
      const gettutor = await axios.get(`${config.REACT_APP_API_ENDPOINT}/getpdttr`)
      setTutorData(gettutor.data)
    } catch (err) {
      console.log(err)
    }
  }

  axios.defaults.withCredentials = true

  const exportData = TutorData?.filter((idx) => idx.schedule_id === schedule_id).map((val, key) => {
    const date = new Date(val.date)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const newDate = `${year}-${month}-${day}`
    return {
      No: key + 1,
      Name: val.full_name,
      Attendance_Admin: val.att_bool === 1 ? 'Yes' : val.att_bool === 2 ? 'No' : 'Not Available',
      Attendance_Tutor:
        val.ttr_bool === 1 ? 'Yes' : val.reason === 'Other' ? val.other_reason : val.reason,
      Date: newDate,
      Institution: val.institution_name,
      Module: val.module_name,
      AdminNote: val.comment,
      TutorNote: val.comment_ttr,
    }
  })

  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('AttendanceData')

    // Add headers
    worksheet.columns = [
      { header: 'No.', key: 'No', width: 10 },
      { header: 'Institution', key: 'Institution', width: 20 },
      { header: 'Date', key: 'Date', width: 15 },
      { header: 'Module', key: 'Module', width: 20 },
      { header: 'Name', key: 'Name', width: 20 },
      { header: 'Attendance(Admin)', key: 'Attendance_Admin', width: 20 },
      { header: 'Attendance(Tutor)', key: 'Attendance_Tutor', width: 20 },
    ]

    // Add data rows
    exportData.forEach((row) => worksheet.addRow(row))

    // Add Admin Note
    worksheet.addRow(['Admin Note:', exportData[0].AdminNote])

    // Add Tutor Note
    worksheet.addRow(['Tutor Note:', exportData[0].TutorNote])

    workbook.xlsx.writeBuffer().then((buffer) => {
      const data = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      saveAs(data, 'AttendanceData.xlsx')
    })
  }

  const complete = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${config.REACT_APP_API_ENDPOINT}/addform2`, {
        data7: schedule_id,
      })
      window.location.reload()
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    axios
      .post(`${config.REACT_APP_API_ENDPOINT}/`)
      .then((res) => {
        if (res.data.valid) {
          setrole(res.data.role)
          if (res.data.role === 'Admin') {
            getData() // Call getData here for Admin role
          }
        } else {
          navigate('/login')
        }
      })
      .catch((err) => console.log(err))
    getData()
    gettutor()
  }, [])

  return (
    <CModal visible={Tvisible} onClose={() => TsetVisible(false)} size="lg">
      <CCardHeader>
        {TutorData?.filter((idx) => idx.schedule_id === schedule_id)
          .slice(0, 1)
          .map((val, key) => {
            const date = new Date(val.date)
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0')
            const newDate = `${year}-${month}-${day}`
            return (
              <>
                <CRow className=" p-2">
                  <CCol md={3} style={{ marginLeft: '50px' }}>
                    <strong>Date: {newDate}</strong>
                  </CCol>
                  <CCol md={3} style={{ marginLeft: '50px' }}>
                    <strong>Institution: {val.institution_name}</strong>
                  </CCol>
                  <CCol md={3} style={{ marginLeft: '50px' }}>
                    <strong>Module: {val.module_name}</strong>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CContainer>
                      <CCallout color="primary">
                        <b>ADMIN</b> Note :
                        <CAlert color="warning" closeButton>
                          {val.comment}
                        </CAlert>
                      </CCallout>
                      <CCallout color="primary">
                        <b>TUTOR</b> Note :
                        <CAlert color="warning" closeButton>
                          {val.comment_ttr}
                        </CAlert>
                      </CCallout>
                    </CContainer>
                  </CCol>
                </CRow>
              </>
            )
          })}
      </CCardHeader>
      <CModalBody responsive>
        <CButton onClick={exportToExcel}>
          <FontAwesomeIcon icon={faFileExport} style={{ color: '#e4e7ec' }} /> Export Attendance
        </CButton>
        <CTable responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">No.</CTableHeaderCell>
              <CTableHeaderCell scope="col">Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Attendance(Admin)</CTableHeaderCell>
              <CTableHeaderCell scope="col">Attendance(Tutor)</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {TutorData?.filter((idx) => idx.schedule_id === schedule_id).map((val, key) => {
              return (
                <CTableRow key={key}>
                  <CTableDataCell>{key + 1}</CTableDataCell>
                  <CTableDataCell>{val.full_name}</CTableDataCell>
                  <CTableDataCell>
                    <center>
                      {val.att_bool === 1 ? (
                        <FontAwesomeIcon icon={faCheck} style={{ color: '#2fbe2d' }} />
                      ) : val.att_bool === 2 ? (
                        <FontAwesomeIcon icon={faXmark} style={{ color: '#ee1111' }} />
                      ) : (
                        'Not Available'
                      )}
                    </center>
                  </CTableDataCell>
                  <CTableDataCell>
                    <center>
                      {val.ttr_bool === 1 ? (
                        <FontAwesomeIcon icon={faCheck} style={{ color: '#2fbe2d' }} />
                      ) : val.reason === 'Other' ? (
                        val.other_reason
                      ) : (
                        val.reason
                      )}
                    </center>
                  </CTableDataCell>
                </CTableRow>
              )
            })}
          </CTableBody>
        </CTable>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => TsetVisible(false)}>
          Close
        </CButton>
        {role === 'Admin' &&
          (TutorData?.filter(
            (idx) => idx.schedule_id === schedule_id && idx.class_Ndp === idx.class,
          ).slice(0, 1)[0]?.complete === 1 ? (
            <CButton color="secondary" disabled>
              Completed <FontAwesomeIcon icon={faCheck} style={{ color: '#0c0d0d' }} />
            </CButton>
          ) : (
            <CButton color="secondary" onClick={complete}>
              Complete
            </CButton>
          ))}
      </CModalFooter>
    </CModal>
  )
}

Scheduleview.propTypes = {
  Tvisible: propTypes.bool,
  TsetVisible: propTypes.bool,
  schedule_id: propTypes.number,
}

export default Scheduleview

//<CTableRow>CBadge color={getBadge(val.status_on_programme)}>
// {val.status_on_programme}
//</CBadge>
