import React, { useState, useEffect, useRef } from 'react'
import * as XLSX from 'xlsx'
import test2 from '../../assets/template2/NewStudent.template (excel).xlsx'
import { cilOptions, cilCheckCircle, cilWarning } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileImport, faFileExport } from '@fortawesome/free-solid-svg-icons'
import ExcelJS from 'exceljs'
import {
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CFormSelect,
  CAlert,
  CFormCheck,
  CCard,
  CBadge,
  CFormInput,
  CCardBody,
  CCol,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTable,
  CButton,
  CRow,
  CAccordion,
  CAccordionBody,
  CAccordionHeader,
  CAccordionItem,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import UpdateStudent from './Edit'
import packageJson from '../../../package.json'
const { config } = packageJson

const PDregister = () => {
  const [excelFile, setExcelFile] = useState()
  const [excelArray, setExcelArray] = useState([])
  const [visible, setvisible] = useState(false)
  const tableRef = useRef(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isChecked, setIsChecked] = useState(false)
  const [otherres, setotherres] = useState([{ checkstd: '', stdid: '' }])
  const [bool, setbool] = useState(false)
  const navigate = useNavigate()
  const [role, setrole] = useState('')
  const [StudentData, setstudent] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [currentIns, setCurrentIns] = useState('1')
  const [institution, setInstitution] = useState([])
  const [showAlert, setShowAlert] = useState(false)
  const [openedit, setopenedit] = useState(false)
  const [editid, seteditid] = useState()

  //fetchDataStudent
  const getData = async (e) => {
    try {
      const getData = await axios.get(`${config.REACT_APP_API_ENDPOINT}/getpd3`)
      setstudent(getData.data)
    } catch (err) {
      console.log(err)
    }
  }

  //FetchDataInstitution
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

  //InsertData
  const postData = async (data) => {
    try {
      await axios.post(`${config.REACT_APP_API_ENDPOINT}/addpd`, {
        data1: data.institution_name,
        data2: data.scholar_id,
        data3: isValidDate(data.commencement_date)
          ? excelDateToJSDate(data.commencement_date)
          : null,
        data4: isValidDate(data.completion_date) ? excelDateToJSDate(data.completion_date) : null,
        data5: data.full_name,
        data6: data.ic_number?.toString(),
        data7: data.age,
        data8: data.level,
        data9: data.ic_state,
        data10: data.status_on_programme,
        data11: isValidDate(data.date_of_birth) ? excelDateToJSDate(data.date_of_birth) : null,
        data12: data.gender,
        data13: data.ethnicity,
        data14: data.scholar_school,
        data15: data.qualification,
        data16: data.academic_result,
        data17: data.scholar_martial,
        data18: data.scholar_employer,
        data19: data.scholar_job_position,
        data20: data.monthly_income,
        data21: data.home_address_line_1,
        data22: data.home_address_line_2,
        data23: data.home_address_line_3,
        data24: data.home_address_city,
        data25: data.home_address_postcode,
        data26: data.home_address_state,
        data27: data.mailing_address_line_1,
        data28: data.mailing_address_line_2,
        data29: data.mailing_address_line_3,
        data30: data.mailing_address_city,
        data31: data.mailing_address_postcode,
        data32: data.mailing_address_state,
        data33: data.house_tel_number,
        data34: data.mobile_number,
        data35: data.email,
        data36: data.bank_name,
        data37: data.bank_accouont_no,
        data38: data.emergency_contact_name,
        data39: data.emergency_contact_number,
        data40: data.emergency_contact_number_alt,
        data41: data.emergency_contact_relationship,
        data42: data.father_guardian,
        data43: data.father_guardian_ic,
        data44: data.father_guardian_occupation,
        data45: data.father_guardian_employer,
        data46: data.mother_guardian_name,
        data47: data.mother_guardian_ic,
        data48: data.mother_guardian_occupation,
        data49: data.mother_guardian_employers,
        data50: data.number_of_household,
        data51: data.number_of_household_member_employed,
        data52: data.total_of_household_income,
        data53: data.cohort,
        data54: data.class_AAP_eng,
        data55: data.class_AAP_math,
        data56: data.class_Ndp,
      })
      console.log('Data posted successfully')
      setvisible(true)
      window.location.reload()
    } catch (err) {
      alert(err)
    }
  }

  //submitFile
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

  const excelDateToJSDate = (excelDate) => {
    const date = new Date((excelDate - 25569) * 86400 * 1000)
    return date.toISOString().split('T')[0]
  }

  const isValidDate = (value) => {
    return !isNaN(new Date(value).getTime())
  }

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

  //View with filterData
  const handleView = () => {
    const filteredData = StudentData?.filter((val) => val.institution_id.toString() === currentIns)
    setFilteredData(filteredData)
    StudentData?.filter((val) => val.institution_id.toString() === currentIns).forEach(
      (val, index) => {
        const var1 = 'checkstd'
        const var2 = 'stdid'
        const newarray = [...otherres]
        newarray[index] = { ...newarray[index], [var1]: '' }
        newarray[index] = { ...newarray[index], [var2]: val.scholar_id }
        console.log(newarray)
        setotherres(newarray)
      },
    )
  }

  const [ischange, setischange] = useState(false)

  //DeleteButton
  const onDelete = async (id) => {
    try {
      await axios.post(`${config.REACT_APP_API_ENDPOINT}/deletestudent`, { id })
      setischange(!ischange)
    } catch (err) {
      console.log(err)
    }
  }

  //Badge Status
  const getColorByStatus = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'success'
      case 'ACTIVE':
        return 'primary'
      case 'INCOMPLETE':
        return 'danger'
      default:
        return 'primary'
    }
  }

  //generate Excel
  const generateExcel = () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('List Name') // Sheet name

    // Add headers
    const headers = [
      'No.',
      'Full Name',
      'Registered',
      'Status',
      'Institution',
      'Class NDP',
      'Class AAP Math',
      'Class AAP English',
    ]
    worksheet.addRow(headers)

    // Add data from filteredDataa
    filteredData.forEach((val, index) => {
      const date = new Date(val.commencement_date)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const newDate = `${year}-${month}-${day}`

      const rowData = [
        index + 1,
        val.full_name,
        newDate,
        val.status_on_programme,
        val.institution_name,
        val.class_Ndp,
        val.class_AAP_math,
        val.class_AAP_eng,
      ]

      worksheet.addRow(rowData)
    })

    // Generate a Blob from the workbook
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const url = URL.createObjectURL(blob)

      // Create a link element to trigger the download
      const link = document.createElement('a')
      link.href = url
      link.download = 'List_Name.xlsx'
      document.body.appendChild(link)
      link.click()

      // Clean up
      document.body.removeChild(link)
    })
  }

  const searchdata = filteredData.filter((data) =>
    data.full_name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
  })

  axios.defaults.withCredentials = true
  //Alert
  useEffect(() => {
    if (role === 'Tutor') {
      setShowAlert(true)
    }
    getData()
    fetchInstitution()
  }, [ischange])

  useEffect(() => {
    console.log(otherres)
  })

  if (showAlert) {
    return (
      <CAlert color="danger" closeButton>
        <CIcon icon={cilWarning} className="flex-shrink-0 me-2" width={24} height={24} />
        You dont have permission to view this component.
      </CAlert>
    )
  }

  const checkattnd = (index, newcheck, newStdId) => {
    const checkstd = 'checkstd'
    const stdid = 'stdid'
    const newArray = [...otherres]
    newArray[index] = { ...newArray[index], [stdid]: newStdId }
    newArray[index] = { ...newArray[index], [checkstd]: newcheck }
    console.log(newArray)
    setotherres(newArray)
  }

  if (role === 'Admin') {
    return (
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardBody>
              <CAccordion>
                <CAccordionItem itemKey={1}>
                  <CAccordionHeader>
                    <strong>Register New Student</strong>
                  </CAccordionHeader>
                  <CAccordionBody>
                    <div className="mb-3">
                      <CAlert
                        color="success"
                        dismissible
                        visible={visible}
                        onClose={() => setvisible(false)}
                      >
                        <CIcon
                          icon={cilCheckCircle}
                          className="flex-shrink-0 me-2"
                          width={24}
                          height={24}
                        />
                        File uploaded successfully!
                      </CAlert>
                      <CFormInput
                        type={'file'}
                        accept={'.xlsx'}
                        id={'csvFile'}
                        label="Import File"
                        onChange={(e) => {
                          setExcelFile(e.target.files[0])
                        }}
                      />
                      <br />
                      <CButton
                        style={{ marginRight: '10px' }}
                        onClick={(e) => {
                          e.preventDefault()
                          submit()
                        }}
                      >
                        <FontAwesomeIcon icon={faFileImport} /> Import File
                      </CButton>
                      <a href={test2} download="Student Template">
                        Download Template
                      </a>
                    </div>
                  </CAccordionBody>
                </CAccordionItem>
                <CAccordionItem itemKey={2}>
                  <CAccordionHeader>
                    <strong>Student Detail</strong>
                  </CAccordionHeader>
                  <CAccordionBody>
                    <CRow>
                      <CCol>
                        <CFormSelect
                          aria-label="Default select example"
                          className="mb-3"
                          onChange={(e) => setCurrentIns(e.target.value)}
                        >
                          <option>..Choose Institution..</option>
                          {institution?.map((val, key) => {
                            return (
                              <option key={key} value={val.institution_id}>
                                {val.institution_name}
                              </option>
                            )
                          })}
                        </CFormSelect>
                        <CButton onClick={handleView}>View Student</CButton>
                      </CCol>
                    </CRow>
                    {filteredData?.length > 0 ? (
                      <CTable borderless>
                        <CTableBody>
                          <CTableRow>
                            <CTableDataCell>
                              <CButton onClick={generateExcel}>
                                <FontAwesomeIcon icon={faFileExport} style={{ color: '#e4e7ec' }} />{' '}
                                Export List Name
                              </CButton>
                            </CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableDataCell>
                              <CFormInput
                                className="mt-2"
                                placeholder="Search Student Name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                              />
                            </CTableDataCell>
                          </CTableRow>
                          {/*<CTableRow>
                            <CTableDataCell colSpan={3}>
                              <CButton>Select All</CButton>
                              <CButton style={{ marginLeft: '10px' }}>Unselect All</CButton>
                              {bool === true ? (
                                <CButton style={{ marginLeft: '10px' }} onClick>
                                  Delete
                                </CButton>
                              ) : (
                                ''
                              )}
                            </CTableDataCell>
                              </CTableRow>*/}
                        </CTableBody>
                      </CTable>
                    ) : (
                      ''
                    )}
                    <CTable className="mt-3" responsive ref={tableRef} bordered>
                      <CTableHead color="dark">
                        {filteredData?.length > 0 ? (
                          <>
                            <CTableRow>
                              <CTableHeaderCell scope="col" rowSpan={2}>
                                No.
                              </CTableHeaderCell>
                              <CTableHeaderCell scope="col" rowSpan={2}>
                                <center>Full Name</center>
                              </CTableHeaderCell>
                              <CTableHeaderCell scope="col" rowSpan={2}>
                                <center>Student ID</center>
                              </CTableHeaderCell>
                              <CTableHeaderCell scope="col" rowSpan={2}>
                                <center>Status</center>
                              </CTableHeaderCell>
                              <CTableHeaderCell scope="col" colSpan={3}>
                                <center>Class</center>
                              </CTableHeaderCell>
                              <CTableHeaderCell scope="col"></CTableHeaderCell>
                            </CTableRow>
                            <CTableRow>
                              <CTableHeaderCell scope="col">
                                <center>NDP</center>
                              </CTableHeaderCell>
                              <CTableHeaderCell scope="col">
                                <center>AAP Math</center>
                              </CTableHeaderCell>
                              <CTableHeaderCell scope="col">
                                <center>AAP English</center>
                              </CTableHeaderCell>
                              <CTableHeaderCell scope="col"></CTableHeaderCell>
                              {/*<CTableHeaderCell scope="col"></CTableHeaderCell>*/}
                            </CTableRow>
                          </>
                        ) : (
                          ''
                        )}
                      </CTableHead>
                      <CTableBody>
                        {searchdata?.map((val, key) => {
                          const date = new Date(val.commencement_date)
                          const year = date.getFullYear()
                          const month = String(date.getMonth() + 1).padStart(2, '0')
                          const day = String(date.getDate()).padStart(2, '0')
                          const newDate = `${year}-${month}-${day}`
                          return (
                            <CTableRow key={key}>
                              <CTableDataCell>
                                <center>{key + 1}</center>
                              </CTableDataCell>
                              <CTableDataCell>
                                <center>{val.full_name}</center>
                              </CTableDataCell>
                              <CTableDataCell style={{ Width: '200px' }}>
                                {val.scholar_id}
                              </CTableDataCell>
                              <CTableDataCell>
                                <center>
                                  <CBadge color={getColorByStatus(val.status_on_programme)}>
                                    {val.status_on_programme}
                                  </CBadge>
                                </center>
                              </CTableDataCell>
                              <CTableDataCell>
                                <center>{val.class_Ndp}</center>
                              </CTableDataCell>
                              <CTableDataCell>
                                <center>{val.class_AAP_math}</center>
                              </CTableDataCell>
                              <CTableDataCell>
                                <center>{val.class_AAP_eng}</center>
                              </CTableDataCell>
                              <CTableDataCell style={{ width: '50px' }}>
                                <CDropdown>
                                  <CDropdownToggle color="transparent" caret={false}>
                                    <CIcon icon={cilOptions} />
                                  </CDropdownToggle>
                                  <CDropdownMenu>
                                    <CDropdownItem
                                      onClick={(e) => {
                                        seteditid(filteredData[key])
                                        setopenedit(!openedit)
                                      }}
                                    >
                                      Edit
                                    </CDropdownItem>
                                    <CDropdownItem onClick={() => onDelete(val.scholar_id)}>
                                      Delete
                                    </CDropdownItem>
                                  </CDropdownMenu>
                                </CDropdown>
                              </CTableDataCell>
                              {/*<CTableDataCell>
                                <div>
                                  <CFormCheck
                                    type="checkbox"
                                    defaultChecked={isChecked[key] === 1} // For "Attend"
                                    onChange={() => {}}
                                    label=""
                                  />
                                </div>
                                    </CTableDataCell>*/}
                            </CTableRow>
                          )
                        })}
                      </CTableBody>
                    </CTable>
                  </CAccordionBody>
                </CAccordionItem>
              </CAccordion>
            </CCardBody>
          </CCard>
        </CCol>
        <UpdateStudent
          openedit={openedit}
          setopenedit={setopenedit}
          editid={editid}
          StudentData={StudentData}
          seteditid={seteditid}
        />
      </CRow>
    )
  }
}

export default PDregister
