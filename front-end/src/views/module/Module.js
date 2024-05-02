import React from 'react'
import axios from 'axios'
import CIcon from '@coreui/icons-react'
import {
  CFormInput,
  CFormSelect,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CDropdown,
  CDropdownMenu,
  CDropdownToggle,
  CDropdownItem,
  CTable,
  CTableRow,
  CTableDataCell,
  CTableHeaderCell,
  CTableHead,
  CTableBody,
  CAlert,
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from 'react'
import {
  cilOptions,
  cilBook,
  cilDelete,
  cilWarning,
  cilChevronDoubleRight,
  cilChevronDoubleLeft,
} from '@coreui/icons'
import Updatedata from './Editmodule'
import packageJson from '../../../package.json'
const { config } = packageJson

function Addmdl() {
  const [module_name, setMdlName] = useState('')
  const [type, setType] = useState('')
  const [hour, sethour] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [openedit, setopenedit] = useState(false)
  const [editid, seteditid] = useState()

  const postData = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${config.REACT_APP_API_ENDPOINT}/addmodule`, {
        data2: module_name,
        data3: hour,
        data4: type,
      })
      window.location.reload()
      setVisible(false)
    } catch (err) {
      console.log(err)
    }
  }
  const [visible, setVisible] = useState(false)

  //FetchModuleData
  const getData = async () => {
    try {
      const getData = await axios.get(`${config.REACT_APP_API_ENDPOINT}/module`)
      setmodule(getData.data)
    } catch (err) {
      console.log(err)
    }
  }
  const [ModuleData, setmodule] = useState([])

  //DeleteButton
  const onDelete = async (id) => {
    try {
      await axios.post(`${config.REACT_APP_API_ENDPOINT}/deletemodule`, { id })
      window.location.reload()
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const filteredData = ModuleData.filter((data) =>
    data.module_name.toLowerCase().includes(searchQuery.toLowerCase()),
  )
  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 10
  const lastIndex = currentPage * recordsPerPage
  const firstIndex = lastIndex - recordsPerPage
  const records = filteredData.slice(firstIndex, lastIndex)
  const npage = Math.ceil(ModuleData.length / recordsPerPage)
  const numbers = Array.from({ length: npage }, (_, i) => i + 1)

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
  })
  const [role, setrole] = useState('')

  //Alert
  useEffect(() => {
    if (role === 'Tutor') {
      setShowAlert(true)
    }
  }, [role])
  const [showAlert, setShowAlert] = useState(false)

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
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Module</strong>
            </CCardHeader>
            <CCardBody>
              <CModal visible={visible} onClose={() => setVisible(false)}>
                <CModalHeader>
                  <CModalTitle>Module Name</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <CFormInput
                    onChange={(e) => setMdlName(e.target.value)}
                    type="text"
                    aria-label="default input example"
                    floatingLabel="Module Title"
                    className="mb-3"
                  />
                  <CFormSelect
                    onChange={(e) => setType(e.target.value)}
                    className="mb-3"
                    placeholder="Select an option"
                    options={[
                      { label: 'Choose Type' },
                      { label: 'NDP', value: '1' },
                      { label: 'AAP English', value: '2' },
                      { label: 'AAP Math', value: '3' },
                    ]}
                  />
                  <CFormSelect
                    onChange={(e) => sethour(e.target.value)}
                    className="mb-3"
                    placeholder="Select an option"
                    options={[
                      { label: 'Choose Hour' },
                      { label: '2 Hours', value: '2' },
                      { label: '4 Hours', value: '4' },
                      { label: '6 Hours', value: '6' },
                      { label: '12 Hours', value: '12' },
                    ]}
                  />
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" onClick={() => setVisible(false)}>
                    Cancel
                  </CButton>
                  <CButton onClick={postData} color="primary">
                    Add
                  </CButton>
                </CModalFooter>
              </CModal>
              <CRow>
                <CCol>
                  <CButton onClick={() => setVisible(!visible)}>
                    <CIcon icon={cilBook} /> Add Module
                  </CButton>
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                  <CFormInput
                    className="mt-2"
                    placeholder="Search module name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </CCol>
                <CTable className="mt-3" style={{ overflow: 'hidden' }} responsive bordered>
                  <CTableHead color="dark">
                    <CTableRow>
                      <CTableHeaderCell scope="col">
                        <center>No.</center>
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col">Module Title</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Module Hour</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Module Type</CTableHeaderCell>
                      <CTableHeaderCell scope="col"></CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {records?.map((val, key) => {
                      return (
                        <CTableRow key={key}>
                          <CTableDataCell>
                            <center>{firstIndex + key + 1}</center>
                          </CTableDataCell>
                          <CTableDataCell>{val.module_name}</CTableDataCell>
                          <CTableDataCell>{val.hour} Hours</CTableDataCell>
                          <CTableDataCell>
                            {val.type === '1' ? 'NDP' : ''}
                            {val.type === '2' ? 'AAP English' : ''}
                            {val.type === '3' ? 'AAP Math' : ''}
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
                                  <FontAwesomeIcon icon={faPencil} /> Edit
                                </CDropdownItem>
                                <CDropdownItem onClick={() => onDelete(val.module_id)}>
                                  <CIcon icon={cilDelete} /> Delete
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
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
        <Updatedata
          openedit={openedit}
          setopenedit={setopenedit}
          editid={editid}
          ModuleData={ModuleData}
          seteditid={seteditid}
        />
      </CRow>
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

export default Addmdl
