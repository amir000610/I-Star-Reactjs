import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import packageJson from '../../../package.json'
import CIcon from '@coreui/icons-react'
import { cilInfo, cilCheckCircle } from '@coreui/icons'
import Tutor from './Tutor'
import {
  CTable,
  CTableRow,
  CTableDataCell,
  CTableHeaderCell,
  CTableHead,
  CRow,
  CCol,
  CTableBody,
  CFormSelect,
  CCard,
  CCardHeader,
  CCardBody,
  CCardFooter,
  CButton,
  CFormTextarea,
  CFormInput,
  CAlert,
  CFormCheck,
} from '@coreui/react'
const { config } = packageJson

const Attnd = () => {
  const navigate = useNavigate()
  const [StudentData, setstudent] = useState([])
  const [institution, setInstitution] = useState([])
  const [currentIns, setCurrentIns] = useState('')
  const [currentdate, setCurrentdate] = useState()
  const [currenttype, setCurrenttype] = useState('')
  const [currentclass, setCurrentclass] = useState()
  const [currenthst, setCurrenthst] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [formdata, setformdata] = useState([])
  const [role, setrole] = useState('')
  const [comment, setComment] = useState('')
  const [commentid, setCommentId] = useState('')
  const [visible, setVisible] = useState(false)
  const [isChecked, setIsChecked] = useState({})

  //AllData
  const getData = async (e) => {
    try {
      const getData = await axios.get(`${config.REACT_APP_API_ENDPOINT}/getpd`)
      setstudent(getData.data)
    } catch (err) {
      console.log(err)
    }
  }

  //fetchDataInstitution
  const fetchInstitution = async () => {
    try {
      await axios.get(`${config.REACT_APP_API_ENDPOINT}/institution`).then((response) => {
        if (response) {
          setInstitution(response.data)
        } else {
          console.log(response.data)
        }
      })
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
  const [TutorData, setTutorData] = useState([])

  //Schedule Data
  const getform = async () => {
    try {
      const getform = await axios.get(`${config.REACT_APP_API_ENDPOINT}/schedule`)
      setformdata(getform.data)
    } catch (err) {
      console.log(err)
    }
  }

  //Save Array
  const saveOtherRes = async () => {
    try {
      await axios
        .post(`${config.REACT_APP_API_ENDPOINT}/saveOtherRes`, { otherres, comment, commentid })
        .then((response) => {
          if (response) {
            console.log(response.data)
            setVisible(true)
          }
        })

      window.location.reload()
    } catch (error) {
      console.error(error)
    }
  }

  //FormatDate
  const newDate = (data) => {
    const date = new Date(data)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const newDate = `${year}-${month}-${day}`
    return newDate
  }

  const [otherres, setotherres] = useState([])

  const checkattnd = (index, newcheck, newSchId, newStdId) => {
    const checkstd = 'checkstd'
    const schid = 'schid'
    const stdid = 'stdid'
    const newArray = [...otherres]
    newArray[index] = { ...newArray[index], [schid]: newSchId }
    newArray[index] = { ...newArray[index], [stdid]: newStdId }
    newArray[index] = { ...newArray[index], [checkstd]: newcheck }
    console.log(newArray)
    setotherres(newArray)
  }

  const toggleCheckbox = (key, value) => {
    setIsChecked((prevState) => {
      const updatedState = { ...prevState, [key]: value }
      return updatedState
    })
  }

  const checkAll = () => {
    console.log('Checking all...')
    const updatedState = {}
    const newArray = [...otherres]
    filteredData.forEach((val, key) => {
      //console.log(key + 1)
      updatedState[key] = 1 // Set value to 1 (Attend)
      const checkstd = 'checkstd'
      const schid = 'schid'
      const stdid = 'stdid'
      newArray[key] = {
        ...newArray[key],
        [schid]: val.schedule_id,
        [stdid]: val.scholar_id,
        [checkstd]: 1,
      }
      console.log(newArray)
      setotherres(newArray)
    })
    //console.log('Checked all items')
    setIsChecked(updatedState)
  }

  const uncheckAll = () => {
    setIsChecked({})
    filteredData.forEach((val, key) => {
      checkattnd(key, 0, val.schedule_id, val.scholar_id) // Assuming 0 represents unselected
    })
  }

  const todaydate = new Date()
  //ViewButton with filter Data
  const handleView = () => {
    let filteredByDate

    if (currenthst === '1') {
      // Filter active data: dates that are greater than or equal to the current date
      filteredByDate = StudentData?.filter((val) =>
        currenttype === '1'
          ? newDate(val.date) === newDate(currentdate) &&
            newDate(val.date) >= newDate(todaydate) &&
            val.institution_id.toString() === currentIns &&
            val.type === currenttype &&
            val.class_Ndp?.toString() === currentclass?.toString() &&
            val.class_Ndp?.toString() === val.class?.toString()
          : currenttype === '2'
          ? newDate(val.date) === newDate(currentdate) &&
            newDate(val.date) >= newDate(todaydate) &&
            val.institution_id.toString() === currentIns &&
            val.type === currenttype &&
            val.class_AAP_eng?.toString() === currentclass?.toString() &&
            val.class_AAP_eng?.toString() === val.class?.toString()
          : newDate(val.date) === newDate(currentdate) &&
            newDate(val.date) >= newDate(todaydate) &&
            val.institution_id.toString() === currentIns &&
            val.type === currenttype &&
            val.class_AAP_math?.toString() === currentclass?.toString() &&
            val.class_AAP_math?.toString() === val.class?.toString(),
      )
    } else if (currenthst === '2') {
      // Filter past data: dates that are less than the current date
      filteredByDate = StudentData?.filter((val) =>
        currenttype === '1'
          ? newDate(val.date) === newDate(currentdate) &&
            newDate(val.date) < newDate(todaydate) &&
            val.institution_id.toString() === currentIns &&
            val.type === currenttype &&
            val.class_Ndp?.toString() === currentclass?.toString() &&
            val.class_Ndp?.toString() === val.class?.toString()
          : currenttype === '2'
          ? newDate(val.date) === newDate(currentdate) &&
            newDate(val.date) < newDate(todaydate) &&
            val.institution_id.toString() === currentIns &&
            val.type === currenttype &&
            val.class_AAP_eng?.toString() === currentclass?.toString() &&
            val.class_AAP_eng?.toString() === val.class?.toString()
          : newDate(val.date) === newDate(currentdate) &&
            newDate(val.date) < newDate(todaydate) &&
            val.institution_id.toString() === currentIns &&
            val.type === currenttype &&
            val.class_AAP_math?.toString() === currentclass?.toString() &&
            val.class_AAP_math?.toString() === val.class?.toString(),
      )
    } else {
      filteredByDate = null
    }
    setFilteredData(filteredByDate)
  }

  const handleHistoryChange = (e) => {
    setCurrenthst(e.target.value)
  }

  //Login Credential
  axios.defaults.withCredentials = true
  useEffect(() => {
    axios
      .post(`${config.REACT_APP_API_ENDPOINT}/`)
      .then((res) => {
        if (res.data.valid) {
          setrole(res.data.role)
        } else {
          navigate('/login')
        }
      })
      .catch((err) => console.log(err))
    fetchInstitution()
    getData()
    getform()
    gettutor()
    //console.log(otherres)
  }, [navigate, otherres])

  if (role === 'Admin') {
    return (
      <>
        <CCard className="mb-3">
          <CRow>
            <CCol xs={12}>
              <CCardHeader>
                <CTable borderless responsive>
                  <CTableBody responsive>
                    {filteredData?.slice(0, 1).map((val, key) => {
                      const date = new Date(val.date)
                      const year = date.getFullYear()
                      const month = String(date.getMonth() + 1).padStart(2, '0')
                      const day = String(date.getDate()).padStart(2, '0')
                      const newDate = `${year}-${month}-${day}`
                      return (
                        <CTableRow key={key}>
                          <CTableDataCell>Attendance</CTableDataCell>
                          <CTableDataCell>Date: {newDate}</CTableDataCell>
                          <CTableDataCell>Institution: {val.institution_name}</CTableDataCell>
                          <CTableDataCell>Module: {val.module_name}</CTableDataCell>
                          <CTableDataCell>Total Student: {filteredData.length}</CTableDataCell>
                        </CTableRow>
                      )
                    })}
                  </CTableBody>
                </CTable>
              </CCardHeader>
              <CCardBody>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <CFormSelect
                      aria-label="Default select example"
                      className="mb-3"
                      onChange={handleHistoryChange}
                      style={{ marginRight: '1rem' }}
                    >
                      <option value="">..Choose Timeline..</option>
                      <option value="1">Upcoming</option>
                      <option value="2">Past</option>
                    </CFormSelect>
                    {currenthst && (
                      <CFormSelect
                        aria-label="Default select example"
                        className="mb-3"
                        onChange={(e) => setCurrentIns(e.target.value)}
                        style={{ marginRight: '1rem' }}
                      >
                        <option>..Choose Institution..</option>
                        {StudentData.filter((val) =>
                          currenthst === '1'
                            ? newDate(val.date) >= newDate(todaydate)
                            : newDate(val.date) < newDate(todaydate),
                        )
                          .reduce((accumulator, currentitem) => {
                            if (
                              !accumulator.some(
                                (item) => item.institution_id === currentitem.institution_id,
                              )
                            ) {
                              accumulator.push(currentitem)
                            }
                            return accumulator
                          }, [])
                          .map((val, key) => {
                            return (
                              <option key={key} value={val.institution_id}>
                                {val.institution_name}
                              </option>
                            )
                          })}
                      </CFormSelect>
                    )}
                    {currentIns && (
                      <CFormSelect
                        aria-label="Default select example"
                        className="mb-3"
                        onChange={(e) => setCurrenttype(e.target.value)}
                        style={{ marginRight: '1rem' }}
                      >
                        <option>..Choose Type..</option>
                        <option value={'1'}>NDP</option>
                        <option value={'2'}>AAP English</option>
                        <option value={'3'}>AAP Math</option>
                      </CFormSelect>
                    )}
                    {currenttype && (
                      <CFormSelect
                        aria-label="Default select example"
                        className="mb-3"
                        onChange={(e) => setCurrentclass(e.target.value)}
                        style={{ marginRight: '1rem' }}
                      >
                        <option>..Choose Class..</option>
                        <option value="1">Class 1</option>
                        <option value="2">Class 2</option>
                        <option value="3">Class 3</option>
                      </CFormSelect>
                    )}
                    {currentclass && (
                      <CFormSelect
                        aria-label="Default select example"
                        className="mb-3"
                        onChange={(e) => setCurrentdate(e.target.value)}
                        style={{ marginRight: '1rem' }}
                      >
                        <option>..Choose Date..</option>
                        {StudentData?.filter((val) =>
                          currenthst === '1'
                            ? newDate(val.date) >= newDate(todaydate) &&
                              val.institution_id.toString() === currentIns
                            : newDate(val.date) < newDate(todaydate) &&
                              val.institution_id.toString() === currentIns,
                        )
                          .reduce((uniqueDates, val) => {
                            const date = newDate(val.date) // Extract date part
                            if (!uniqueDates.includes(date)) {
                              uniqueDates.push(date)
                              return uniqueDates
                            }
                            return uniqueDates
                          }, [])
                          .map((date, key) => (
                            <option key={key} value={date}>
                              {newDate(date)}
                            </option>
                          ))}
                      </CFormSelect>
                    )}
                  </div>
                  <CButton onClick={handleView} style={{ marginBottom: '20px' }}>
                    View
                  </CButton>
                </div>
                {filteredData?.filter(
                  (itm1) =>
                    !TutorData.some(
                      (itm2) =>
                        itm2.schedule_id === itm1.schedule_id &&
                        itm2.class_Ndp === itm1.class_Ndp &&
                        itm2.class_AAP_eng === itm1.class_AAP_eng &&
                        itm2.class_AAP_math === itm1.class_AAP_math,
                    ),
                ).length > 0 ? (
                  filteredData?.length > 0 ? (
                    <div>
                      <CTable className="mt-3" responsive>
                        <CTableHead>
                          <CTableRow>
                            <CTableDataCell colSpan={3}>
                              <CButton onClick={checkAll}>Select All</CButton>
                              <CButton style={{ marginLeft: '10px' }} onClick={uncheckAll}>
                                Unselect All
                              </CButton>
                            </CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableHeaderCell scope="col">#</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Full Name</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Check</CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>
                          {filteredData
                            ?.filter(
                              (itm1) =>
                                !TutorData.some(
                                  (itm2) =>
                                    itm2.schedule_id === itm1.schedule_id &&
                                    itm2.class_Ndp === itm1.class_Ndp &&
                                    itm2.class_AAP_eng === itm1.class_AAP_eng &&
                                    itm2.class_AAP_math === itm1.class_AAP_math,
                                ),
                            )
                            .map((val, key) => {
                              return val.att_bool ? (
                                ''
                              ) : (
                                <CTableRow key={key}>
                                  <CTableDataCell>{key + 1}</CTableDataCell>
                                  <CTableDataCell>{val.full_name}</CTableDataCell>
                                  <CTableDataCell>
                                    <div>
                                      <CFormCheck
                                        type="checkbox"
                                        checked={isChecked[key] === 1} // For "Attend"
                                        onChange={() => {
                                          toggleCheckbox(key, 1)
                                          checkattnd(key, 1, val.schedule_id, val.scholar_id)
                                        }}
                                        label="Attend"
                                      />
                                    </div>
                                    <div>
                                      <CFormCheck
                                        type="checkbox"
                                        checked={isChecked[key] === 2} // For "Not Attend"
                                        onChange={() => {
                                          toggleCheckbox(key, 2)
                                          checkattnd(key, 2, val.schedule_id, val.scholar_id)
                                        }}
                                        label="Not Attend"
                                      />
                                    </div>
                                  </CTableDataCell>
                                </CTableRow>
                              )
                            })}
                          <CTableRow>
                            <CTableDataCell colSpan={4}>
                              <CRow>
                                <CCol>
                                  <CFormTextarea
                                    placeholder="Leave a comment here"
                                    id="floatingTextarea2"
                                    floatingLabel="Comments"
                                    style={{ height: '100px', width: '1000px' }}
                                    onChange={(e) => {
                                      setComment(e.target.value)
                                      setCommentId(filteredData[0]?.schedule_id)
                                    }}
                                  ></CFormTextarea>
                                </CCol>
                              </CRow>
                            </CTableDataCell>
                          </CTableRow>
                        </CTableBody>
                      </CTable>
                      <CRow>
                        <CCol xs="auto" style={{ width: '100%' }}>
                          <center>
                            <CButton onClick={saveOtherRes} color="primary">
                              Submit
                            </CButton>
                          </center>
                        </CCol>
                      </CRow>
                    </div>
                  ) : (
                    <CAlert color="primary" className="d-flex align-items-center">
                      <CIcon icon={cilInfo} className="flex-shrink-0 me-2" width={24} height={24} />
                      <strong>Please filter the data above</strong>
                    </CAlert>
                  )
                ) : (
                  <CAlert
                    color="success"
                    dismissible
                    visible={visible}
                    onClose={() => setVisible(false)}
                  >
                    <CIcon
                      icon={cilCheckCircle}
                      className="flex-shrink-0 me-2"
                      width={24}
                      height={24}
                    />
                    Attendance has been successfully submitted!
                  </CAlert>
                )}
              </CCardBody>
              <CCardFooter></CCardFooter>
            </CCol>
          </CRow>
        </CCard>
      </>
    )
  } else {
    return <Tutor />
  }
}

export default Attnd
