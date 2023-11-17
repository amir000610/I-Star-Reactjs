import React from 'react'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { CFormInput } from '@coreui/react'
import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { CDropdown, CDropdownMenu, CDropdownToggle, CDropdownItem } from '@coreui/react'
import {
  CTable,
  CTableRow,
  CTableDataCell,
  CTableHeaderCell,
  CTableHead,
  CTableBody,
} from '@coreui/react'
import { useState } from 'react'
import { cilOptions } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const Accordion = () => {
  const usersData = [
    { id: 1, name: 'Mengenggam Bara' },
    {
      id: 2,
      name: 'Menangani Stress',
    },
    {
      id: 3,
      name: 'Cita-Citaku',
    },
  ]

  const [visible, setVisible] = useState(false)

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Register Module</strong>
          </CCardHeader>
          <CCardBody>
            <CButton onClick={() => setVisible(!visible)}>Add Module</CButton>
            <CModal visible={visible} onClose={() => setVisible(false)}>
              <CModalHeader>
                <CModalTitle>Module Name</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CFormInput
                  type="text"
                  aria-label="default input example"
                  floatingLabel="Module Title"
                />
              </CModalBody>
              <CModalFooter>
                <CButton color="secondary" onClick={() => setVisible(false)}>
                  Cancel
                </CButton>
                <CButton color="primary">Add</CButton>
              </CModalFooter>
            </CModal>
            <CRow>
              <CTable className="mt-3">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Module Registered</CTableHeaderCell>
                    <CTableHeaderCell scope="col"></CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {usersData.map((val, key) => {
                    return (
                      <CTableRow key={key}>
                        <CTableDataCell>{val.id}</CTableDataCell>
                        <CTableDataCell>{val.name}</CTableDataCell>
                        <CTableDataCell style={{ width: '50px' }}>
                          <CDropdown>
                            <CDropdownToggle color="transparent" caret={false}>
                              <CIcon icon={cilOptions} />
                            </CDropdownToggle>
                            <CDropdownMenu>
                              <CDropdownItem href="#">Edit</CDropdownItem>
                              <CDropdownItem href="#">Delete</CDropdownItem>
                              <CDropdownItem href="#"></CDropdownItem>
                            </CDropdownMenu>
                          </CDropdown>
                        </CTableDataCell>
                      </CTableRow>
                    )
                  })}
                </CTableBody>
              </CTable>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Accordion
