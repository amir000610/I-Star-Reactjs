import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CRow,
  CPopover,
  CAlert,
  CCallout,
} from '@coreui/react'
import { cilWarning } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays, faHourglassHalf } from '@fortawesome/free-solid-svg-icons'
import packageJson from '../../../package.json'
const { config } = packageJson

const Dashboard = () => {
  const [role, setrole] = useState('')
  const navigate = useNavigate()
  const [takwim, settakwim] = useState([])
  const [insti, setInsti] = useState([])

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
  })

  const getData = async () => {
    try {
      const getData = await axios.get(`${config.REACT_APP_API_ENDPOINT}/schedule`)
      settakwim(getData.data)
    } catch (err) {
      console.log(err)
    }
  }

  const getInstitution = async () => {
    try {
      await axios.get(`${config.REACT_APP_API_ENDPOINT}/institution`).then((response) => {
        if (response) {
          setInsti(response.data)
        } else {
          console.log('No Data')
        }
      })
    } catch (err) {
      console.log(err)
    }
  }

  const color = (num) => {
    if (num === 1) {
      return 'primary'
    } else if (num === 2) {
      return 'secondary'
    } else if (num === 3) {
      return 'warning'
    } else if (num === 4) {
      return 'danger'
    } else if (num === 5) {
      return 'dark'
    } else if (num === 6) {
      return 'light'
    } else if (num === 7) {
      return 'success'
    } else if (num === 8) {
      return 'info'
    }
  }

  const [showAlert, setShowAlert] = useState(false)

  useEffect(() => {
    axios
      .post(`${config.REACT_APP_API_ENDPOINT}/`)
      .then((res) => {
        if (res.data.valid) {
          setrole(res.data.role)
          if (res.data.role === 'Admin') {
            getData() // Call getData here for Admin role
          } else if (res.data.role === 'Tutor') {
            setShowAlert(true)
          }
        } else {
          navigate('/login')
        }
      })
      .catch((err) => console.log(err))

    getInstitution()
  }, [navigate, takwim])

  if (showAlert) {
    return (
      <CAlert color="danger" closeButton>
        <CIcon icon={cilWarning} className="flex-shrink-0 me-2" width={24} height={24} />
        You dont have permission to view this component.
      </CAlert>
    )
  }

  if (role === 'Admin') {
    return (
      <>
        <WidgetsDropdown />
        <CCard className="mb-14" style={{ marginTop: '1rem', marginBottom: '1rem' }}>
          <CCardHeader>
            <FontAwesomeIcon icon={faCalendarDays} /> <strong>Takwim Per Week</strong>
          </CCardHeader>
          <CCardBody>
            <CRow>
              {insti?.map((idx, key) => {
                // Filter the upcoming programs for the current institution
                const upcomingPrograms = takwim
                  .filter((val) => val.institution_id.toString() === idx.institution_id.toString())
                  .filter((val) => {
                    const todaydate = new Date()
                    todaydate.setHours(0, 0, 0, 0)
                    const oneWeekFromNow = new Date(todaydate.getTime() + 7 * 24 * 60 * 60 * 1000)
                    oneWeekFromNow.setHours(0, 0, 0, 0)
                    const date = new Date(val.date)
                    return (
                      date >= todaydate &&
                      date <= oneWeekFromNow &&
                      date.getDay() >= 0 && // Monday (0 is Sunday, 1 is Monday)
                      date.getDay() <= 6 // Friday (6 is Saturday, 5 is Friday)
                    )
                  })
                  .sort((a, b) => {
                    const dateA = new Date(a.date)
                    const dateB = new Date(b.date)
                    return dateB - dateA // Sort in descending order to get the latest date first
                  })

                return (
                  <CCol sm={6} lg={3} key={key}>
                    <CCallout color={color(idx.institution_id)}>
                      <h6>{idx.institution_name}</h6>
                      {`Total Program = ${upcomingPrograms.length}`}
                      {upcomingPrograms.length > 0 ? (
                        <CPopover
                          responsive
                          title="Detail Program"
                          content={
                            <div style={{ whiteSpace: 'pre-wrap' }}>
                              {upcomingPrograms.map((val, key) => {
                                const date = new Date(val.date)
                                const year = date.getFullYear()
                                const month = String(date.getMonth() + 1).padStart(2, '0')
                                const day = String(date.getDate()).padStart(2, '0')
                                const newDate = `${year}-${month}-${day}`
                                return (
                                  <div style={{ marginBottom: '10px' }} key={key}>
                                    Module: {val.module_name}
                                    <br />
                                    Tutor: {val.name}
                                    <br />
                                    Date: {newDate}
                                    <hr />
                                  </div>
                                )
                              })}
                            </div>
                          }
                          placement="right"
                        >
                          <CButton color="secondary" size="sm" className="btn-rounded">
                            <FontAwesomeIcon icon={faHourglassHalf} shake /> Upcoming Program
                          </CButton>
                        </CPopover>
                      ) : (
                        <CAlert color="warning" closeButton>
                          No upcoming programs for this institution.
                        </CAlert>
                      )}
                    </CCallout>
                  </CCol>
                )
              })}
            </CRow>
          </CCardBody>
          <CCardFooter></CCardFooter>
        </CCard>
      </>
    )
  }
}

export default Dashboard
