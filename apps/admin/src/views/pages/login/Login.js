import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useDispatch } from 'react-redux'

// custom redux package
import { setUserAuthData } from '@store/rtk'
import { isValidEmail } from 'custom-validator-renting'

import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
  const [formData, setFormData] = useState({
    email: { value: null, isTouched: null, isError: null },
    password: { value: null, isTouched: null, isError: null },
  })

  console.log(formData)

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true)

  const dispatch = useDispatch()
  const navigator = useNavigate()

  const [isPending, setIsPending] = useState(false)

  const handleLogin = async () => {
    try {
      setIsPending(true)
      const extractedData = Object.keys(formData).reduce(
        (newFormData, keyName) => {
          return { ...newFormData, [keyName]: formData[keyName].value }
        },
        { email: '', password: '' },
      ) // postable form data

      const response = await axios.post(
        `${process.env.VITE_APP_API_URL}/auth/admin-login`,
        extractedData,
      )

      dispatch(setUserAuthData({ ...response.data.user }))
      navigator('/')
    } catch (error) {
      toast.error(error.response?.data.message || 'Opps, some error occured. Please try again')
      console.log(error)
    } finally {
      setIsPending(false)
    }
  }

  useEffect(() => {
    setIsSubmitDisabled(
      !formData.email.isTouched ||
        formData.email.isError ||
        !formData.password.isTouched ||
        formData.password.isError,
    )
  }, [formData])

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        onKeyUp={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            email: {
                              ...prev['email'],
                              value: e.target.value,
                              isTouched: true,
                              isError: !isValidEmail(e.target?.value),
                            },
                          }))
                        }}
                        placeholder="Email"
                        autoComplete="email"
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        onKeyUp={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            password: {
                              ...prev['password'],
                              value: e.target.value,
                              isTouched: true,
                              isError: !e.target.value || e.target.value.length < 5,
                            },
                          }))
                        }}
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton
                          onClick={handleLogin}
                          disabled={isPending || isSubmitDisabled}
                          color="primary"
                          className="px-4"
                        >
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
