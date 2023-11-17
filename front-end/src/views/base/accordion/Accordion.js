import React from 'react'
import {
  CCard,
  CFormInput,
  CCardBody,
  CCardHeader,
  CCol,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormSelect,
  CTableBody,
  CTableDataCell,
  CTable,
  CRow,
  CAccordion,
  CAccordionBody,
  CAccordionHeader,
  CAccordionItem,
} from '@coreui/react'

const Accordion = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Menu</strong>
          </CCardHeader>
          <CCardBody>
            <CAccordion activeItemKey={2}>
              <CAccordionItem itemKey={1}>
                <CAccordionHeader>Register</CAccordionHeader>
                <CAccordionBody>
                  <div className="mb-3">
                    <CFormInput type="file" id="formFile" label="Import File" />
                  </div>
                </CAccordionBody>
              </CAccordionItem>
              <CAccordionItem itemKey={2}>
                <CAccordionHeader>List Of Registered</CAccordionHeader>
                <CAccordionBody>
                  <CTable className="mt-3">
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell scope="col">#</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Registed</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Role</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Reason</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      <CTableRow>
                        <CTableDataCell>1</CTableDataCell>
                        <CTableDataCell>Syamsul</CTableDataCell>
                        <CTableDataCell>12/3/23</CTableDataCell>
                        <CTableDataCell>Active</CTableDataCell>
                        <CTableDataCell>RKKDA</CTableDataCell>
                        <CTableDataCell>
                          <CFormSelect
                            aria-label="Default select example"
                            className="mb-3"
                            options={[
                              { label: 'Bebas', value: '1' },
                              { label: 'Sakit', value: '2' },
                              { label: 'Sekolah', value: '2' },
                              { label: 'Mahkamah', value: '3', disabled: false },
                              { label: 'Balik Cuti', value: '3', disabled: false },
                              { label: 'Lain2', value: '3', disabled: false },
                            ]}
                          />
                        </CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
                </CAccordionBody>
              </CAccordionItem>
            </CAccordion>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Accordion
