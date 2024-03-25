import React, { useState, useEffect } from 'react'
import { CRow, CCard, CCardHeader, CCardBody } from '@coreui/react'
import { CModal, CButton } from '@coreui/react'
import { CModalBody } from '@coreui/react'
import { CDropdown, CDropdownMenu, CDropdownToggle, CDropdownItem } from '@coreui/react'
import { CModalFooter, CPagination, CPaginationItem } from '@coreui/react'
import { CModalHeader } from '@coreui/react'
import { CModalTitle } from '@coreui/react'
import { CFormInput } from '@coreui/react'
import { CFormSelect } from '@coreui/react'
import {
  cilOptions,
  cilDelete,
  cilSchool,
  cilChevronDoubleLeft,
  cilChevronDoubleRight,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { cilCalendar } from '@coreui/icons'
import axios from 'axios'
import Scheduleview from './Scheduleview'
import {
  CTable,
  CTableRow,
  CTableDataCell,
  CTableHeaderCell,
  CTableHead,
  CTableBody,
} from '@coreui/react'
import packageJson from '../../../package.json'
const { config } = packageJson

axios.defaults.withCredentials = true
const Module = () => {
  const [visible, setVisible] = useState(false)
  const [Tvisible, TsetVisible] = useState(false)

  //Delete
  const [scheduleIdToDelete, setScheduleIdToDelete] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const onDelete = (id) => {
    setScheduleIdToDelete(id) // Store the schedule ID to delete
    setShowConfirmation(true) // Show the confirmation popup
  }

  const handleDeleteConfirmed = async () => {
    try {
      await axios.post(`${config.REACT_APP_API_ENDPOINT}/deleteschedule`, {
        id: scheduleIdToDelete,
      })
      window.location.reload()
    } catch (err) {
      console.log(err)
    } finally {
      setShowConfirmation(false) // Hide the confirmation popup after deletion
      setScheduleIdToDelete(null) // Reset the schedule ID
    }
  }

  const handleDeleteCanceled = () => {
    setShowConfirmation(false) // Hide the confirmation popup if the user cancels
  }

  //AddForm
  const [login_id, setuser] = useState('')
  const [institution_id, setinstiid] = useState('')
  const [module_id, setmdlid] = useState('')
  const [start_date, setstartdate] = useState('')
  const [end_date, setenddate] = useState('')
  const [scdclass, setscdclass] = useState('')
  const [active, setactive] = useState()
  const [role, setrole] = useState('')
  const [loginuser, setLoggedInUserId] = useState('')

  //insertdata
  const postform = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${config.REACT_APP_API_ENDPOINT}/addform`, {
        data1: login_id,
        data2: institution_id,
        data3: module_id,
        data4: scdclass,
        data6: start_date,
        data7: end_date,
      })
      window.location.reload()
      setVisible(false)
    } catch (err) {
      console.log(err)
    }
  }

  //module
  const getData = async () => {
    try {
      const getData = await axios.get(`${config.REACT_APP_API_ENDPOINT}/module`)
      setmodule(getData.data)
    } catch (err) {
      console.log(err)
    }
  }
  const [ModuleData, setmodule] = useState([])

  //user
  const getuser = async () => {
    try {
      const getuser = await axios.get(`${config.REACT_APP_API_ENDPOINT}/tutor`)
      setuserdata(getuser.data)
    } catch (err) {
      console.log(err)
    }
  }
  const [userdata, setuserdata] = useState([])

  //institution
  const getinstitution = async () => {
    try {
      const getinstitution = await axios.get(`${config.REACT_APP_API_ENDPOINT}/institution`)
      setinstitutiondata(getinstitution.data)
    } catch (err) {
      console.log(err)
    }
  }
  const [institutiondata, setinstitutiondata] = useState([])

  //formschedule
  const getform = async () => {
    try {
      const getform = await axios.get(`${config.REACT_APP_API_ENDPOINT}/schedule`)
      setformdata(getform.data)
    } catch (err) {
      console.log(err)
    }
  }
  const [formdata, setformdata] = useState([])

  const handleViewAttendance = (schedule_id) => {
    TsetVisible(!Tvisible)
    setactive(schedule_id)
  }

  useEffect(() => {
    getData()
    getuser()
    getinstitution()
    getform()
  }, [])

  const updatedformdata = formdata?.filter((itm) =>
    role === 'Admin' ? itm.login_id > 0 : itm.login_id === loginuser,
  )

  const pdate = (idx) => {
    const date = new Date(idx)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const newDate = `${day}-${month}-${year}`
    return newDate
  }

  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const recordsPerPage = 30
  const lastIndex = currentPage * recordsPerPage
  const firstIndex = lastIndex - recordsPerPage
  const records = formdata.slice(firstIndex, lastIndex)
  const npage = Math.ceil(formdata.length / recordsPerPage)
  const numbers = Array.from({ length: npage }, (_, i) => i + 1)
  const updatedformdataa = records.filter((data) =>
    data.module_name.toLowerCase().includes(searchQuery.toLowerCase()) && role === 'Admin'
      ? data.login_id > 0
      : data.login_id === loginuser,
  )

  useEffect(() => {
    axios
      .post(`${config.REACT_APP_API_ENDPOINT}/`) // Assuming this is your authentication route
      .then((res) => {
        if (res.data.valid) {
          setrole(res.data.role)
          setLoggedInUserId(res.data.loginid)
        } else {
          // Handle unauthenticated user
        }
      })
      .catch((err) => console.log(err))
  }, [])

  if (role === 'Admin' || role === 'Tutor') {
    return (
      <>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Schedule</strong>
          </CCardHeader>
          <CCardBody>
            <CRow>
              {role === 'Admin' && ( // Render the button only for Admin
                <CButton onClick={() => setVisible(!visible)}>
                  <CIcon icon={cilCalendar} /> Set Schedule
                </CButton>
              )}
              <CModal visible={visible} onClose={() => setVisible(false)}>
                <CModalHeader>
                  <CModalTitle>Schedule Module</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <CFormSelect
                    aria-label="Default select example"
                    className="mb-3"
                    onChange={(e) => setmdlid(e.target.value)}
                  >
                    <option>Choose Module</option>
                    {ModuleData.map((val, key) => {
                      return (
                        <option key={key} value={val.module_id}>
                          {val.module_name}
                        </option>
                      )
                    })}
                  </CFormSelect>
                  <CFormSelect
                    aria-label="Default select example"
                    className="mb-3"
                    onChange={(e) => setinstiid(e.target.value)}
                  >
                    <option>Choose Institution</option>
                    {institutiondata.map((val, key) => {
                      return (
                        <option key={key} value={val.institution_id}>
                          {val.institution_name}
                        </option>
                      )
                    })}
                  </CFormSelect>
                  <CFormSelect
                    aria-label="Default select example"
                    className="mb-3"
                    onChange={(e) => setuser(e.target.value)}
                  >
                    <option>Choose Tutor</option>
                    {userdata.map((val, key) => {
                      return (
                        <option key={key} value={val.login_id}>
                          {val.name}
                        </option>
                      )
                    })}
                  </CFormSelect>
                  <CFormSelect
                    aria-label="Default select example"
                    className="mb-3"
                    onChange={(e) => setscdclass(e.target.value)}
                    style={{ marginRight: '1rem' }}
                  >
                    <option>Choose Class</option>
                    <option value="1">Class 1</option>
                    <option value="2">Class 2</option>
                    <option value="3">Class 3</option>
                    <option value="4">Class 4</option>
                  </CFormSelect>
                  <CFormInput
                    type="date"
                    placeholder="Date"
                    aria-label="default input example"
                    floatingLabel="Start Date"
                    floatingClassName="mb-3"
                    onChange={(e) => setstartdate(e.target.value)}
                  />
                  <CFormInput
                    type="date"
                    placeholder="Date"
                    aria-label="default input example"
                    floatingLabel="End Date"
                    floatingClassName="mb-3"
                    onChange={(e) => setenddate(e.target.value)}
                  />
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" onClick={() => setVisible(false)}>
                    Close
                  </CButton>
                  <CButton onClick={postform}>Add</CButton>
                </CModalFooter>
              </CModal>
            </CRow>
            <CRow>
              <CTable className="mt-3" responsive bordered>
                <CTableHead color="dark">
                  <CTableRow>
                    <CTableHeaderCell scope="col">
                      <center>No.</center>
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col">Institution</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Module</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Class</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Trainer/Tutor</CTableHeaderCell>
                    <CTableHeaderCell scope="col"></CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {updatedformdataa?.map((val, key) => {
                    return (
                      <CTableRow key={key}>
                        <CTableDataCell>
                          <center>{firstIndex + key + 1}</center>
                        </CTableDataCell>
                        <CTableDataCell>{val.institution_name}</CTableDataCell>
                        <CTableDataCell>{val.module_name}</CTableDataCell>
                        <CTableDataCell>Class {val.class}</CTableDataCell>
                        <CTableDataCell>
                          <b>Start Date:</b> {pdate(val.date)} <br />
                          <b>End Date:</b> {pdate(val.end_date)}
                        </CTableDataCell>
                        <CTableDataCell>{val.name}</CTableDataCell>
                        <CTableDataCell style={{ width: '50px' }}>
                          <CDropdown placement="auto">
                            <CDropdownToggle color="transparent" caret={false}>
                              <CIcon icon={cilOptions} />
                            </CDropdownToggle>
                            <CDropdownMenu>
                              {role === 'Admin' && (
                                <CDropdownItem onClick={() => onDelete(val.schedule_id)}>
                                  <CIcon icon={cilDelete} /> Delete
                                </CDropdownItem>
                              )}
                              <CDropdownItem onClick={() => handleViewAttendance(val.schedule_id)}>
                                <CIcon icon={cilSchool} /> Attendance
                              </CDropdownItem>
                            </CDropdownMenu>
                          </CDropdown>
                        </CTableDataCell>
                      </CTableRow>
                    )
                  })}
                </CTableBody>
              </CTable>
              <CPagination align="center" aria-label="Page navigation example">
                <CPaginationItem onClick={prePage}>
                  <CIcon icon={cilChevronDoubleLeft} />
                </CPaginationItem>
                {numbers.map((n, i) => (
                  <CPaginationItem
                    key={i}
                    active={currentPage === n}
                    onClick={() => changeCPage(n)}
                  >
                    {n}
                  </CPaginationItem>
                ))}
                <CPaginationItem onClick={nextPage}>
                  <CIcon icon={cilChevronDoubleRight} />
                </CPaginationItem>
              </CPagination>
              {showConfirmation && (
                <div
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    padding: '20px',
                    maxWidth: '300px',
                    margin: '0 auto',
                    position: 'relative',
                  }}
                >
                  <p className="confirmation-message">
                    Are you sure you want to delete this schedule?
                  </p>
                  <div style={{ display: 'flex', justifycontent: 'space-between' }}>
                    <button className="confirm-button" onClick={handleDeleteConfirmed}>
                      <span>Yes</span>
                      <i className="fas fa-check"></i>
                    </button>
                    <button className="cancel-button" onClick={handleDeleteCanceled}>
                      <span>No</span>
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              )}
            </CRow>
          </CCardBody>
        </CCard>
        <Scheduleview Tvisible={Tvisible} TsetVisible={TsetVisible} schedule_id={active} />
      </>
    )
  }
  function prePage() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  function changeCPage(key) {
    setCurrentPage(key)
  }

  function nextPage() {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1)
    }
  }
}

export default Module
