import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import packageJson from '../../../../package.json'
const { config } = packageJson

const Register = () => {
  const [values, setvalues] = useState({
    name: '',
    email: '',
    password: '',
  })

  axios.defaults.withCredentials = true
  const navigate = useNavigate()
  const handleSubmit = (event) => {
    event.preventDefault()
    axios.post(`${config.REACT_APP_API_ENDPOINT}/register`, values).then((res) => {
      if (res.data.Status === 'Success') {
        navigate('/login')
      } else {
        alert('error')
      }
    })
  }

  return (
    <div className="d-flex justify-content-center align-items-center bg primary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Sign-Up</h2>
        <form action="" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name">
              <strong>Name</strong>
            </label>
            <input
              type="text"
              placeholder="Enter Name:"
              name="name"
              onChange={(e) => setvalues({ ...values, name: e.target.value })}
              className="form-control rounded-0"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="name">
              <strong>Email</strong>
            </label>
            <input
              type="Email"
              placeholder="Enter Email"
              name="email"
              onChange={(e) => setvalues({ ...values, email: e.target.value })}
              className="form-control rounded-0"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="name">
              <strong>Password</strong>
            </label>
            <input
              type="passwordt"
              placeholder="Enter password"
              name="password"
              onChange={(e) => setvalues({ ...values, password: e.target.value })}
              className="form-control rounded-0"
            />
          </div>
          <button type="submit" className="btn btn-success w- 100 rounded-0">
            Sign-up
          </button>
          <p>You agree to our terms and policies</p>
          <Link
            to="/Login"
            classname="btn btn-default border w-100 bg-light rounded-0 text-decoration-none"
          >
            Login
          </Link>
        </form>
      </div>
    </div>
  )
}

export default Register
