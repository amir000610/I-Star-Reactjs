import React, { useState, useEffect } from 'react'
import { CFormLabel, CFormInput, CCard, CCardBody, CButton, CAlert } from '@coreui/react'
import test1 from '../../assets/template/Institution Template.xlsx'
import axios from 'axios'
import * as XLSX from 'xlsx'
import { cilWarning } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileImport } from '@fortawesome/free-solid-svg-icons'
import { cilCheckCircle } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import packageJson from '../../../package.json'
const { config } = packageJson

const AddInsti = () => {
  const [excelFile, setExcelFile] = useState()
  const [excelArray, setExcelArray] = useState([])
  const [visible, setvisible] = useState(false)

  const processExcel = (workbook) => {
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const dataArray = XLSX.utils.sheet_to_json(sheet, { header: 1 })

    if (dataArray.length > 0) {
      const headers = dataArray[0]
      const newArray = dataArray.slice(1).map((row) => {
        const eachObject = headers.reduce((obj, header, i) => {
          obj[header] = row[i]
          return obj
        }, {})
        return eachObject
      })
      setExcelArray(newArray)
    }
  }

  const postData = async (data) => {
    try {
      await axios.post(`${config.REACT_APP_API_ENDPOINT}/addinsti`, {
        data1: JSON.parse(JSON.stringify(data.institution_name)),
        data2: JSON.parse(JSON.stringify(data.cost_center_code)),
        data3: JSON.parse(JSON.stringify(data.programme_partner_manager)),
        data4: JSON.parse(JSON.stringify(data.learning_training_institutions)),
        data5: JSON.parse(JSON.stringify(data.programme_name)),
        data6: JSON.parse(JSON.stringify(data.sponsorship_model)),
        data7: JSON.parse(JSON.stringify(data.sector_industry)),
      })
      console.log('Data posted successfully')
      setvisible(true)
      window.location.reload()
    } catch (err) {
      alert('Data posted successfully')
    }
  }

  const submit = () => {
    if (excelFile) {
      const file = excelFile
      const reader = new FileReader()

      reader.onload = function (e) {
        const data = e.target.result
        const workbook = XLSX.read(data, { type: 'binary' })
        processExcel(workbook)

        for (let x = 0; x < excelArray.length; x++) {
          postData(excelArray[x])
        }
      }

      reader.readAsBinaryString(file) // Read file as binary string
    }
  }
  axios.defaults.withCredentials = true
  //Login Credential
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
  }, [])
  const navigate = useNavigate()

  const [role, setrole] = useState('')
  const [showAlert, setShowAlert] = useState(false)
  useEffect(() => {
    if (role === 'Tutor') {
      setShowAlert(true)
      console.log(role)
    }
  }, [])

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
      <CCard>
        <CCardBody>
          <div className="mb-3">
            <CFormLabel htmlFor="formFile">
              <strong>Register Institution</strong>
            </CFormLabel>
            <CAlert color="success" dismissible visible={visible} onClose={() => setvisible(false)}>
              <CIcon icon={cilCheckCircle} className="flex-shrink-0 me-2" width={24} height={24} />
              File uploaded successfully!
            </CAlert>
            <CFormInput
              type={'file'}
              accept={'.xlsx'}
              id={'excelFile'}
              onChange={(e) => {
                setExcelFile(e.target.files[0])
              }}
            />
            <br />
            <CButton
              style={{ marginRight: '10px' }}
              onClick={(e) => {
                e.preventDefault()
                if (excelFile) submit()
              }}
            >
              <FontAwesomeIcon icon={faFileImport} /> Import File
            </CButton>
            <a href={test1} download="Institution Template">
              Download Template
            </a>
          </div>
        </CCardBody>
      </CCard>
    )
  }
}
export default AddInsti
