import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import * as faceapi from 'face-api.js'
import PropTypes from 'prop-types'

const FaceRecognition = ({ onFaceDetected }) => {
  const [webcamEnabled, setWebcamEnabled] = useState(false)

  useEffect(() => {
    // Enable webcam access when component mounts
    setWebcamEnabled(true)

    // Load face-api.js models and start face detection
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    ]).then(startFaceDetection)

    // Clean up function to disable webcam access when component unmounts
    return () => {
      setWebcamEnabled(false)
    }
  }, [])

  const startFaceDetection = () => {
    // Start face detection
    const video = document.getElementById('video')
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => {
        video.srcObject = stream
        setInterval(async () => {
          const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptors()
          onFaceDetected(detections) // Pass detections to parent component
        }, 100)
      })
      .catch((err) => console.error(err))
  }

  return (
    <div className="webcam-container">
      {webcamEnabled && (
        <Webcam className="webcam" id="video" audio={false} screenshotFormat="image/jpeg" />
      )}
    </div>
  )
}

FaceRecognition.propTypes = {
  onFaceDetected: PropTypes.func.isRequired,
}

export default FaceRecognition
