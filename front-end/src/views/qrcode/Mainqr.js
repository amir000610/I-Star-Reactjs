import React, { useState, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import QrReader from 'react-qr-reader'

const App = () => {
  const [url, setUrl] = useState('')
  const qrRef = useRef(null)

  const handleInputChange = (e) => {
    setUrl(e.target.value)
  }

  const handleDownload = () => {
    const svgElement = document.getElementById('qrcode-svg')
    const svgString = new XMLSerializer().serializeToString(svgElement)
    const dataUri = 'data:image/svg+xml;base64,' + btoa(svgString)

    const link = document.createElement('a')
    link.href = dataUri
    link.download = 'qrcode.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="App">
      <h1>Generate QR Code</h1>
      <input type="text" value={url} onChange={handleInputChange} placeholder="Enter URL" />
      <br />
      <br />
      {url && <QRCodeSVG id="qrcode-svg" value={url} />}
      <br />
      <br />
      {url && <button onClick={handleDownload}>Download QR Code</button>}
    </div>
  )
}

export default App
