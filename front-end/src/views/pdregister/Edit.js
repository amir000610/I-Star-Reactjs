import axios from 'axios'
import React, { useState } from 'react'
import {
  CModal,
  CModalBody,
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

function UpdateStudent({ openedit, setopenedit, editid, ModuleData, seteditid }) {
  const [visible, setVisible] = useState(false)

  const postData = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${config.REACT_APP_API_ENDPOINT}/editstudent`, {
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
    <CModal visible={openedit} onClose={() => setopenedit(false)} backdrop="static">
      <CModalHeader>
        <CModalTitle>Edit Student</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CFormSelect
          onChange={onChange}
          className="mb-3"
          placeholder="Select an option"
          name="status_on_programme"
          defaultValue={editid?.status_on_programme}
        >
          <option>..choose status..</option>
          <option
            value="COMPLETED"
            selected={editid?.status_on_programme === 'COMPLETED' ? true : false}
          >
            COMPLETED
          </option>
          <option
            value="INCOMPLETE"
            selected={editid?.status_on_programme === 'INCOMPLETE' ? true : false}
          >
            INCOMPLETE
          </option>
          <option value="ACTIVE" selected={editid?.status_on_programme === 'ACTIVE' ? true : false}>
            ACTIVE
          </option>
        </CFormSelect>
        <CFormSelect
          onChange={onChange}
          className="mb-3"
          placeholder="Select an option"
          name="class_Ndp"
          defaultValue={editid?.class_Ndp}
        >
          <option>..Choose Class NDP..</option>
          <option value="0" selected={editid?.class_Ndp === '0' ? true : false}>
            Completed
          </option>
          <option value="1" selected={editid?.class_Ndp === '1' ? true : false}>
            1
          </option>
          <option value="2" selected={editid?.class_Ndp === '2' ? true : false}>
            2
          </option>
          <option value="3" selected={editid?.class_Ndp === '3' ? true : false}>
            3
          </option>
          <option value="3" selected={editid?.class_Ndp === '4' ? true : false}>
            4
          </option>
        </CFormSelect>
        <CFormSelect
          onChange={onChange}
          className="mb-3"
          placeholder="Select an option"
          name="class_AAP_math"
          defaultValue={editid?.class_AAP_math}
        >
          <option>..Choose Class AAP_Math..</option>
          <option value="0" selected={editid?.class_AAP_math === '0' ? true : false}>
            Completed
          </option>
          <option value="1" selected={editid?.class_AAP_math === '1' ? true : false}>
            1
          </option>
          <option value="2" selected={editid?.class_AAP_math === '2' ? true : false}>
            2
          </option>
          <option value="3" selected={editid?.class_AAP_math === '3' ? true : false}>
            3
          </option>
          <option value="4" selected={editid?.class_AAP_math === '4' ? true : false}>
            4
          </option>
        </CFormSelect>
        <CFormSelect
          onChange={onChange}
          className="mb-3"
          placeholder="Select an option"
          name="class_AAP_eng"
          defaultValue={editid?.class_AAP_eng}
        >
          <option>..Choose Class AAP_ENG..</option>
          <option value="0" selected={editid?.class_AAP_eng === '0' ? true : false}>
            Completed
          </option>
          <option value="1" selected={editid?.class_AAP_eng === '1' ? true : false}>
            1
          </option>
          <option value="2" selected={editid?.class_AAP_eng === '2' ? true : false}>
            2
          </option>
          <option value="3" selected={editid?.class_AAP_eng === '3' ? true : false}>
            3
          </option>
          <option value="4" selected={editid?.class_AAP_eng === '4' ? true : false}>
            4
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

UpdateStudent.propTypes = {
  openedit: propTypes.bool,
  setopenedit: propTypes.bool,
  editid: propTypes.array,
  ModuleData: propTypes.array,
  seteditid: propTypes.array,
}

export default UpdateStudent
