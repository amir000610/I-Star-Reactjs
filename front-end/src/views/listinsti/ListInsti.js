import React from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { CFormInput } from '@coreui/react'
import { CDropdown, CDropdownMenu, CDropdownToggle, CDropdownItem } from '@coreui/react'
import axios from 'axios'
import { CPagination, CPaginationItem } from '@coreui/react'
import {
  CTable,
  CTableRow,
  CTableDataCell,
  CTableHeaderCell,
  CTableHead,
  CTableBody,
} from '@coreui/react'
import { useState, useEffect } from 'react'
import { cilOptions, cilChevronDoubleRight, cilChevronDoubleLeft } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import packageJson from '../../../package.json'
const { config } = packageJson

const Addmdl = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const getData = async () => {
    try {
      const getData = await axios.get(`${config.REACT_APP_API_ENDPOINT}/institution`)
      setinsti(getData.data)
    } catch (err) {
      console.log(err)
    }
  }

  const onDelete = async (id) => {
    try {
      await axios.post(`${config.REACT_APP_API_ENDPOINT}/deletemodule`, { id })
      window.location.reload()
    } catch (err) {
      console.log(err)
    }
  }

  axios.defaults.withCredentials = true
  const [listinsti, setinsti] = useState([])
  useEffect(() => {
    getData()
  }, [])

  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 5
  const lastIndex = currentPage * recordsPerPage
  const firstIndex = lastIndex - recordsPerPage
  const records = listinsti.slice(firstIndex, lastIndex)
  const npage = Math.ceil(listinsti.length / recordsPerPage)
  const numbers = Array.from({ length: npage }, (_, i) => i + 1)
  const filteredData = records.filter((data) =>
    data.institution_name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>List Institution</strong>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol>
                <CFormInput
                  responsive
                  className="mt-2"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </CCol>
              <CTable className="mt-3" style={{ overflow: 'hidden' }} responsive bordered>
                <CTableHead color="dark">
                  <CTableRow responsive>
                    <CTableHeaderCell scope="col">
                      <center>No.</center>
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col">Institution Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Code</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Programme Partner</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Learning Training Institution</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Programme Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Sponsorship Model</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Sector Industry</CTableHeaderCell>
                    <CTableHeaderCell scope="col"></CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredData?.map((val, key) => {
                    return (
                      <CTableRow key={key}>
                        <CTableDataCell>
                          <center>{firstIndex + key + 1}</center>
                        </CTableDataCell>
                        <CTableDataCell>{val.institution_name}</CTableDataCell>
                        <CTableDataCell>{val.cost_center_code}</CTableDataCell>
                        <CTableDataCell>{val.programme_partner_manager}</CTableDataCell>
                        <CTableDataCell>{val.learning_training_institutions}</CTableDataCell>
                        <CTableDataCell>{val.programme_name}</CTableDataCell>
                        <CTableDataCell>{val.sponsorship_model}</CTableDataCell>
                        <CTableDataCell>{val.sector_industry}</CTableDataCell>
                        <CTableDataCell style={{ width: '50px' }}>
                          <CDropdown>
                            <CDropdownToggle color="transparent" caret={false}>
                              <CIcon icon={cilOptions} />
                            </CDropdownToggle>
                            <CDropdownMenu>
                              <CDropdownItem onClick={() => onDelete(val.module_id)}>
                                Delete
                              </CDropdownItem>
                              <CDropdownItem href="#"></CDropdownItem>
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
    </CRow>
  )

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
