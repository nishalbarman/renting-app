import React, { useEffect, useMemo, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormFeedback,
  CFormLabel,
  CRow,
} from '@coreui/react'

import axios from 'axios'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const ProductAdd = () => {
  const [centerData, setCenterData] = useState({
    name: '',
    email: [],
    password: [],
    mobileNo: '',
    centerName: '',
    streetName: '',
    locality: '',
    postalCode: '',
    city: '',
    country: '',
    longitude: '',
    latitude: '',
    addressProof: false,
    identityProof: {},
    centerImages: {},
  })

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true)

  useEffect(() => {
    let isEverythingOk =
      !!centerData?.name &&
      !!centerData?.email &&
      !!centerData?.password &&
      !!centerData?.centerName &&
      !!centerData?.streetName &&
      !!centerData?.locality &&
      !!centerData?.city &&
      !!centerData?.country &&
      !!centerData?.postalCode &&
      centerData.addressProof.length > 0 &&
      centerData.identityProof.length > 0 &&
      centerData.centerImages.length > 0 &&
      !isNaN(Number(centerData.longitude)) &&
      !isNaN(Number(centerData.latitude))
    setIsSubmitDisabled(!isEverythingOk)
  }, [centerData])

  const [isFormSubmitting, setIsFormSubmitting] = useState(false)

  const { jwtToken } = useSelector((state) => state.auth)

  function convertImagesToBase64(imageFiles) {
    const promises = Array.from(imageFiles).map((file) => {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.readAsDataURL(file)
        fileReader.onload = () => resolve({ base64String: fileReader.result, type: file.type })
        fileReader.onerror = (error) => reject(error)
      })
    })

    return Promise.all(promises)
  }

  const handleAddCenter = async (e) => {
    e.preventDefault()
    const id = toast.loading('Sending your request.. Please wait..')

    try {
      setIsFormSubmitting(true)

      try {
        centerData.identityProof = await convertImagesToBase64(centerData.identityProof)

        centerData.addressProof = await convertImagesToBase64(centerData.addressProof)

        if (centerData.centerImages.length > 0) {
          const centerImages = await convertImagesToBase64(centerData.centerImages)
          centerData.centerImages = centerImages
        }
      } catch (error) {
        console.error(error)
      }

      const response = await axios.post(
        `${process.env.VITE_APP_API_URL}/center/add`,
        {
          centerData,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        },
      )
      setCenterData({
        name: '',
        email: [],
        password: [],
        mobileNo: '',
        centerName: '',
        streetName: '',
        locality: '',
        postalCode: '',
        city: '',
        country: '',
        longitude: '',
        latitude: 0,
        addressProof: false,
        identityProof: {},
        centerImages: {},
      })
      toast.update(id, {
        render: 'Center Created',
        type: 'success',
        isLoading: false,
        autoClose: 5000,
      })
    } catch (error) {
      console.error(error)

      toast.update(id, {
        render: error.response?.data?.message || error.message || 'Opps, Some error occured',
        type: 'error',
        isLoading: false,
        closeOnClick: true,
        autoClose: false,
      })
    } finally {
      setIsFormSubmitting(false)
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Add Center</strong>
            {/* <small>List one new product item to database</small> */}
          </CCardHeader>
          <CCardBody>
            <p className="text-body-secondary small">List one new center to database</p>
            <ul>
              <li>
                <code>&lt;All fields are required and strictly need to be filled&gt;</code>
              </li>
            </ul>

            <CForm onSubmit={handleAddCenter} validated={true}>
              <div className="mb-3">
                <CCard>
                  <CCardHeader>
                    <strong>Owner Details</strong>
                  </CCardHeader>
                  <CCardBody>
                    <div className="mb-3">
                      <CFormLabel htmlFor="ownername">Owner Name</CFormLabel>
                      <CFormInput
                        type="text"
                        id="ownername"
                        placeholder="Ramesh"
                        value={centerData.name}
                        onChange={(e) => {
                          setCenterData((prev) => {
                            return { ...prev, name: e.target.value }
                          })
                        }}
                        minLength={4}
                        required
                      />
                      <CFormFeedback invalid>
                        Please provide a valid name with minimum length of 4 characters.
                      </CFormFeedback>
                    </div>

                    <div className="mb-3">
                      <CFormLabel htmlFor="userEmail">Email</CFormLabel>
                      <CFormInput
                        type="email"
                        id="userEmail"
                        placeholder="example@gmail.com"
                        value={centerData.email}
                        onChange={(e) => {
                          setCenterData((prev) => {
                            return { ...prev, email: e.target.value }
                          })
                        }}
                        required
                      />
                      <CFormFeedback invalid>Please provide a valid email address.</CFormFeedback>
                    </div>

                    <div className="mb-3">
                      <CFormLabel htmlFor="userPassword">Password</CFormLabel>
                      <CFormInput
                        type="password"
                        id="userPassword"
                        placeholder="Strong Password"
                        value={centerData.password}
                        onChange={(e) => {
                          setCenterData((prev) => {
                            return { ...prev, password: e.target.value }
                          })
                        }}
                        minLength={8}
                        required
                      />
                      <CFormFeedback invalid>
                        Please provide a strong password with 8 characters of minimum length.
                      </CFormFeedback>
                    </div>

                    <div className="mb-3">
                      <CFormLabel htmlFor="userMobileNo">Mobile No.</CFormLabel>
                      <CFormInput
                        inputMode="numeric"
                        id="userMobileNo"
                        placeholder="Mobile No."
                        value={centerData.mobileNo}
                        onChange={(e) => {
                          setCenterData((prev) => {
                            return { ...prev, mobileNo: e.target.value }
                          })
                        }}
                        minLength={8}
                        required
                      />
                      <CFormFeedback invalid>Please provide a valid mobile no.</CFormFeedback>
                    </div>
                  </CCardBody>
                </CCard>
              </div>
              <div className="mb-3">
                <CCard>
                  <CCardHeader>
                    <strong>Center Details</strong>
                  </CCardHeader>
                  <CCardBody>
                    <div className="mb-3">
                      <CFormLabel htmlFor="centerName">Center Name</CFormLabel>
                      <CFormInput
                        type="text"
                        id="centerName"
                        placeholder="My Center"
                        value={centerData.centerName}
                        onChange={(e) => {
                          setCenterData((prev) => {
                            return { ...prev, centerName: e.target.value }
                          })
                        }}
                        minLength={3}
                        required
                      />
                      <CFormFeedback invalid>
                        Please provide a name with minimum of 3 characters.
                      </CFormFeedback>
                    </div>

                    <div className="mb-3">
                      <CFormLabel htmlFor="centerStreetName">Street Name</CFormLabel>
                      <CFormInput
                        type="text"
                        id="centerStreetName"
                        placeholder="Street Name"
                        value={centerData.streetName}
                        onChange={(e) => {
                          setCenterData((prev) => {
                            return { ...prev, streetName: e.target.value }
                          })
                        }}
                        minLength={5}
                        required
                      />
                      <CFormFeedback invalid>
                        Please provide a street name with minimum of 5 characters.
                      </CFormFeedback>
                    </div>

                    <div className="mb-3">
                      <CFormLabel htmlFor="centerLocality">Locality</CFormLabel>
                      <CFormInput
                        type="text"
                        id="centerLocality"
                        placeholder="Locality"
                        value={centerData.locality}
                        onChange={(e) => {
                          setCenterData((prev) => {
                            return { ...prev, locality: e.target.value }
                          })
                        }}
                        minLength={5}
                        required
                      />
                      <CFormFeedback invalid>
                        Please provide a locality with minimum of 5 characters.
                      </CFormFeedback>
                    </div>

                    <div className="mb-3">
                      <CFormLabel htmlFor="centerCity">City</CFormLabel>
                      <CFormInput
                        type="text"
                        id="centerCity"
                        placeholder="City"
                        value={centerData.city}
                        onChange={(e) => {
                          setCenterData((prev) => {
                            return { ...prev, city: e.target.value }
                          })
                        }}
                        minLength={5}
                        required
                      />
                      <CFormFeedback invalid>
                        Please provide a city name with minimum of 5 characters.
                      </CFormFeedback>
                    </div>

                    <div className="mb-3">
                      <CFormLabel htmlFor="centerPostalCode">Postal Code</CFormLabel>
                      <CFormInput
                        type="number"
                        id="centerPostalCode"
                        placeholder="781456"
                        value={centerData.postalCode}
                        onChange={(e) => {
                          setCenterData((prev) => {
                            return { ...prev, postalCode: e.target.value }
                          })
                        }}
                        minLength={7}
                        maxLength={7}
                        required
                      />
                      <CFormFeedback invalid>
                        Please provide a city name with minimum of 5 characters.
                      </CFormFeedback>
                    </div>

                    <div className="mb-3">
                      <CFormLabel htmlFor="centerCountry">Country</CFormLabel>
                      <CFormInput
                        type="text"
                        id="centerCountry"
                        placeholder="Country"
                        value={centerData.country}
                        onChange={(e) => {
                          setCenterData((prev) => {
                            return { ...prev, country: e.target.value }
                          })
                        }}
                        minLength={2}
                        required
                      />
                      <CFormFeedback invalid>Please provide a country name.</CFormFeedback>
                    </div>

                    <div className="mb-3">
                      <CFormLabel htmlFor="centerLongitude">Longitude</CFormLabel>
                      <CFormInput
                        type="number"
                        id="centerLongitude"
                        placeholder="Longitude"
                        step="any"
                        value={centerData.longitude}
                        onChange={(e) => {
                          setCenterData((prev) => {
                            return { ...prev, longitude: +e.target.value }
                          })
                        }}
                        minLength={2}
                        required
                      />
                      <CFormFeedback invalid>Please provide a valid latitude number.</CFormFeedback>
                    </div>

                    <div className="mb-3">
                      <CFormLabel htmlFor="centerLatitude">Latitude</CFormLabel>
                      <CFormInput
                        type="number"
                        id="centerLatitude"
                        placeholder="Latitude"
                        step="any"
                        value={centerData.latitude}
                        onChange={(e) => {
                          setCenterData((prev) => {
                            return { ...prev, latitude: +e.target.value }
                          })
                        }}
                        required
                      />
                      <CFormFeedback invalid>
                        Please provide a valid longitude number.
                      </CFormFeedback>
                    </div>

                    <div className="mb-3">
                      <CFormLabel htmlFor="addressProof">Address Proof</CFormLabel>
                      <CFormInput
                        type="file"
                        id="addressProof"
                        aria-label="Address Proof"
                        accept="image/*"
                        onChange={(e) => {
                          setCenterData((prev) => {
                            return { ...prev, addressProof: e.target.files }
                          })
                        }}
                        required
                      />
                      <CFormFeedback invalid>Upload any gov approved address proof</CFormFeedback>
                    </div>

                    <div className="mb-3">
                      <CFormLabel htmlFor="identityProof">Identity Proof</CFormLabel>
                      <CFormInput
                        type="file"
                        id="identityProof"
                        aria-label="Identity Proof"
                        accept="image/*"
                        onChange={(e) => {
                          setCenterData((prev) => {
                            return { ...prev, identityProof: e.target.files }
                          })
                        }}
                        required
                      />
                      <CFormFeedback invalid>Upload any gov approved identity proof</CFormFeedback>
                    </div>

                    <div className="mb-3">
                      <CFormLabel htmlFor="centerImages">Center Images</CFormLabel>
                      <CFormInput
                        type="file"
                        id="centerImages"
                        aria-label="Center Images"
                        accept="image/*"
                        onChange={(e) => {
                          setCenterData((prev) => {
                            return { ...prev, centerImages: e.target.files }
                          })
                        }}
                        multiple
                        required
                      />
                      <CFormFeedback invalid>Provide a clear picture of your center</CFormFeedback>
                    </div>
                  </CCardBody>
                </CCard>
              </div>

              <div className="mb-3">
                <CButton
                  type="submit"
                  color="primary"
                  disabled={isSubmitDisabled || isFormSubmitting}
                >
                  Submit form
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ProductAdd
