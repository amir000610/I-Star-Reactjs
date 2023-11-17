import React from 'react'
import GenerateQRCode from './Qrcode'
import PropTypes from 'prop-types'

const AttendeeList = ({ names }) => {
  return (
    <div>
      {names.map((name, index) => (
        <GenerateQRCode key={index} name={name} />
      ))}
    </div>
  )
}

AttendeeList.propTypes = {
  names: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default AttendeeList
