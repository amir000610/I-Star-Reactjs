import React, { useEffect } from 'react'
import { CRow, CCol, CCardBody, CCard, CButtonGroup, CCardFooter, CCardTitle } from '@coreui/react'
import { CCollapse, CButton, CCardHeader } from '@coreui/react'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquarePollVertical } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import ChartComponent from './Chart'
import { CChart } from '@coreui/react-chartjs'
import packageJson from '../../../package.json'
const { config } = packageJson

const WidgetsDropdown = () => {
  const getInfo = async () => {
    try {
      const getInfo = await axios.get(`${config.REACT_APP_API_ENDPOINT}/getinfo`)
      setstd(getInfo.data)
    } catch (err) {
      console.log(err)
    }
  }
  const [infostd, setstd] = useState([])

  const getinfo3 = async () => {
    try {
      const getInfo = await axios.get(`${config.REACT_APP_API_ENDPOINT}/getinfo3`)
      setstd3(getInfo.data)
    } catch (err) {
      console.log(err)
    }
  }
  const [infostd3, setstd3] = useState([])
  axios.defaults.withCredentials = true

  useEffect(() => {
    getInfo()
    getinfo3()
  }, [])

  const [visibleA, setVisibleA] = useState(false)
  const [visibleB, setVisibleB] = useState(false)
  return (
    <CCard>
      <CCardHeader>
        <FontAwesomeIcon icon={faSquarePollVertical} size="lg" />{' '}
        <strong>Status Student In Institution</strong>
      </CCardHeader>
      <CCardBody>
        <>
          <CButtonGroup>
            <CButton variant="ghost" onClick={() => setVisibleA(!visibleA)}>
              RKDA
            </CButton>
            <CButton variant="ghost" onClick={() => setVisibleB(!visibleB)}>
              JKM
            </CButton>
          </CButtonGroup>
          <CRow>
            <CCol xs={5}>
              <CCollapse visible={visibleA}>
                <CCard className="mt-3">
                  <CCardBody>
                    <CCardTitle>RKDA</CCardTitle>
                    <CChart
                      type="pie"
                      data={{
                        labels: ['Active', 'Completed'],
                        datasets: [
                          {
                            backgroundColor: ['blue', 'green'],
                            data: infostd.map((val) => val.total),
                          },
                        ],
                      }}
                    />
                  </CCardBody>
                </CCard>
              </CCollapse>
            </CCol>
            <CCol xs={5}>
              <CCollapse visible={visibleB}>
                <CCard className="mt-3">
                  <CCardBody>
                    <CCardTitle>JKM</CCardTitle>
                    <CChart
                      type="pie"
                      data={{
                        labels: ['Active', 'Completed', 'Incomplete'],
                        datasets: [
                          {
                            backgroundColor: ['blue', 'green', 'red'],
                            data: infostd3.map((val) => val.total),
                          },
                        ],
                      }}
                    />
                  </CCardBody>
                </CCard>
              </CCollapse>
            </CCol>
          </CRow>
          <hr />
          <CCardTitle>OVERALL JKM</CCardTitle>
          <ChartComponent data={infostd} />
        </>
      </CCardBody>
      <CCardFooter></CCardFooter>
    </CCard>
  )
}

export default WidgetsDropdown
