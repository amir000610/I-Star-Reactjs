import axios from 'axios'
import React, { useState } from 'react'
import {
  CModal,
  CModalBody,
  CFormInput,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CFormSelect,
} from '@coreui/react'
import { CButton } from '@coreui/react'
import propTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import packageJson from '../../../package.json'
const { config } = packageJson

function Updatedata({ openedit, setopenedit, editid, ModuleData, seteditid }) {
  const [visible, setVisible] = useState(false)

  const postData = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${config.REACT_APP_API_ENDPOINT}/editmodule`, {
        editid,
      })
      setVisible(false)
      window.location.reload()
    } catch (err) {
      console.log(err)
    }
  }
  axios.defaults.withCredentials = true

  const onChange = (e) => {
    const { name, value } = e.target
    var newmodule = { ...editid }
    newmodule = { ...editid, [name]: value }
    seteditid(newmodule)
  }

  return (
    <CModal visible={openedit} onClose={() => setopenedit(false)}>
      <CModalHeader>
        <CModalTitle>Edit Module</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CFormInput
          onChange={onChange}
          type="text"
          aria-label="default input example"
          floatingLabel="Module Title"
          name="module_name"
          defaultValue={editid?.module_name}
          className="mb-3"
        />
        <CFormSelect
          onChange={onChange}
          className="mb-3"
          placeholder="Select an option"
          name="type"
        >
          <option>..choose type..</option>
          <option value="1" selected={editid?.type === '1' ? true : false}>
            NDP
          </option>
          <option value="2" selected={editid?.type === '2' ? true : false}>
            AAP English
          </option>
          <option value="3" selected={editid?.type === '3' ? true : false}>
            AAP Math
          </option>
        </CFormSelect>
      </CModalBody>
      <CModalFooter>
        <CButton onClick={postData} color="primary">
          <FontAwesomeIcon icon={faCircleCheck} /> Update
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

Updatedata.propTypes = {
  openedit: propTypes.bool,
  setopenedit: propTypes.bool,
  editid: propTypes.array,
  ModuleData: propTypes.array,
  seteditid: propTypes.array,
}

export default Updatedata
