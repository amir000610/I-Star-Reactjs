import React from 'react'
import QRCode from 'qrcode.react'
import PropTypes from 'prop-types'

const QRCodeGenerator = ({ url }) => {
  return (
    <div>
      <h2>QR Code Generator</h2>
      <QRCode value={url} />
    </div>
  )
}

QRCodeGenerator.propTypes = {
  url: PropTypes.string.isRequired,
}

export default QRCodeGenerator
