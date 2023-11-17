import React, { useEffect, useState } from 'react'
import axios from 'axios'
import propTypes from 'prop-types'
import { CChart } from '@coreui/react-chartjs'
import packageJson from '../../../package.json'
const { config } = packageJson

const ChartComponent = ({ data }) => {
  const [studentTotals, setStudentTotals] = useState([])

  useEffect(() => {
    // Make an HTTP GET request to your API endpoint
    axios
      .get(`${config.REACT_APP_API_ENDPOINT}/jkm`)
      .then((response) => {
        const totalsData = response.data
        setStudentTotals(totalsData)
      })
      .catch((error) => {
        console.error('Error fetching student totals:', error)
      })
  }, []) // Empty dependency array to run the effect only once

  // Extract labels and datasets from studentTotals data
  const institutionData = {}

  studentTotals.forEach((item) => {
    const institutionId = item.institution_id
    const status = item.status
    const total = item.total

    if (!institutionData[institutionId]) {
      institutionData[institutionId] = {}
    }

    institutionData[institutionId][status] = total
  })

  const labels = Object.keys(institutionData).map((institutionId) => `${institutionId}`)
  const datasets = [
    {
      label: 'Completed',
      backgroundColor: 'limegreen',
      data: Object.values(institutionData).map((data) => data.COMPLETED || 0),
    },
    {
      label: 'Incomplete',
      backgroundColor: 'red',
      data: Object.values(institutionData).map((data) => data.INCOMPLETE || 0),
    },
    {
      label: 'Active',
      backgroundColor: 'blue',
      data: Object.values(institutionData).map((data) => data.ACTIVE || 0),
    },
  ]

  return (
    <CChart
      type="bar"
      data={{
        labels: labels,
        datasets: datasets,
      }}
    />
  )
}
ChartComponent.propTypes = {
  data: propTypes.array,
}
export default ChartComponent
