import React from 'react'
import axios from 'axios'
import CIcon from '@coreui/icons-react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CCallout,
  CAlert,
  CCardTitle,
  CCardText,
  CContainer,
} from '@coreui/react'
import { CChart } from '@coreui/react-chartjs'
import { useState, useEffect } from 'react'
import { cilWarning } from '@coreui/icons'

import packageJson from '../../../../../package.json'
const { config } = packageJson

function Chart() {
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
  }, [])
  const [role, setrole] = useState('')

  const getinfo5 = async () => {
    try {
      const getInfo = await axios.get(`${config.REACT_APP_API_ENDPOINT}/getinfo6`)
      setstd5(getInfo.data)
    } catch (err) {
      console.log(err)
    }
  }
  const [infostd5, setstd5] = useState([])

  //Alert
  useEffect(() => {
    if (role === 'Tutor') {
      setShowAlert(true)
    }
    getinfo5()
    console.log(infostd5)
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

  const total = infostd5.reduce((sum, val) => sum + val.total, 0)

  const data = {
    labels: ['Current Active Participants', 'Total Inactive Participants'],
    datasets: [
      {
        backgroundColor: ['blue', 'orange'],
        data: infostd5.map((val) => val.total),
      },
    ],
  }

  const percentageData = {
    labels: ['Current Active Participants', 'Total Inactive Participants'],
    datasets: [
      {
        backgroundColor: ['blue', 'orange'],
        data: infostd5.map((val) => ((val.total / total) * 100).toFixed(2)),
      },
    ],
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
                <strong>CURRENT NUMBERS</strong>
              </CCardHeader>
              <CCardBody>
                <CCardTitle>TBGJ21 TOTAL REGISTERED</CCardTitle>
                <span>As at: {formattedDate}</span>
                <CRow>
                  <CCol xs={4}>
                    <CCallout>
                      <CCardText>Participants:</CCardText>
                      <CCardTitle>{infostd5[0]?.total + infostd5[1]?.total}</CCardTitle>
                    </CCallout>
                  </CCol>
                  {infostd5?.map((val, key) => {
                    return (
                      <CCol xs={4} key={key}>
                        <CCallout>
                          {val.combined_status === 'ACTIVE' ? (
                            <CCardText>Current Active Participants:</CCardText>
                          ) : (
                            <CCardText>Total Inactive Participants:</CCardText>
                          )}{' '}
                          <CCardTitle>{val.total}</CCardTitle>
                        </CCallout>
                      </CCol>
                    )
                  })}
                </CRow>
                <CRow>
                  <CCol xs={6}>
                    <CChart
                      type="pie"
                      data={data}
                      options={{
                        plugins: {
                          title: {
                            display: true,
                            text: 'Current Number',
                          },
                        },
                      }}
                    />
                  </CCol>
                  <CCol xs={6}>
                    <CChart
                      type="pie"
                      data={percentageData}
                      options={{
                        plugins: {
                          title: {
                            display: true,
                            text: 'Percentage (%)',
                          },
                        },
                      }}
                    />
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>
    )
  }
}

export default Chart
