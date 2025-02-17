import React, { useEffect, useMemo, useRef, useState } from 'react'
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
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CProgress,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CSpinner,
  CButtonGroup,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CAvatar,
} from '@coreui/react'

import axios from 'axios'
import { useSelector } from 'react-redux'

import { toast } from 'react-toastify'
import CIcon from '@coreui/icons-react'
import { cilApps } from '@coreui/icons'

const ProductAdd = () => {
  const [categoryData, setCategoryData] = useState({
    categoryName: '',
    categoryImageUrl: [],
  })

  const categoryImageRef = useRef(null)

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true)

  useEffect(() => {
    let isEverythingOk =
      !!categoryData?.categoryName &&
      categoryData.categoryName.length >= 3 &&
      categoryData.categoryImageUrl.length > 0
    setIsSubmitDisabled(!isEverythingOk)
  }, [categoryData])

  const [isFormSubmitting, setIsFormSubmitting] = useState(false)

  const { jwtToken } = useSelector((state) => state.auth)

  const convertImagesToBase64 = (imageFiles) => {
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

  const [categoryList, setCategoryList] = useState([])
  const [paginationPage, setPaginationPage] = useState(1)
  const [paginationLimit, setPaginationLimit] = useState(10)

  const [isCategoriesLoading, sestIsCategoriesLoading] = useState(true)

  const getCategories = async () => {
    try {
      sestIsCategoriesLoading(true)
      const response = await axios.get(`${process.env.VITE_APP_API_URL}/categories`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
      setCategoryList(response.data?.categories)
      setPaginationPage(response.data?.totalPages)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      sestIsCategoriesLoading(false);
    }
  }

  useEffect(() => {
    getCategories()
  }, [])

  const [deleteCategoryId, setDeleteCategoryId] = useState(null)
  const [deleteButtonLoading, setDeleteButtonLoading] = useState(false)

  const handleDeleteCategory = async () => {
    try {
      setDeleteButtonLoading(true)
      const response = await axios.delete(
        `${process.env.VITE_APP_API_URL}/categories/${deleteCategoryId}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        },
      )
      toast.success('Category deleted')
      setDeleteCategoryId(null)
      getCategories()
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setDeleteButtonLoading(false)
    }
  }

  const handleAddCategory = async () => {
    // e.preventDefault()
    try {
      setIsFormSubmitting(true)
      let categoryImageUrl
      try {
        categoryImageUrl = await convertImagesToBase64(categoryData.categoryImageUrl)
      } catch (error) {
        console.error(error)
        return toast.error(error.message)
      }

      const response = await axios.post(
        `${process.env.VITE_APP_API_URL}/categories`,
        {
          categoryData: { ...categoryData, categoryImageUrl },
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        },
      )

      toast.success(response?.data?.message)
      setCategoryData({
        categoryName: '',
        categoryImageUrl: [],
      })
      getCategories()
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || error.message || 'Opps, Some error occured')
    } finally {
      setIsFormSubmitting(false)
    }
  }

  const [updateCategoryId, setUpdateCategoryId] = useState(undefined)

  const handleUpdateCategory = async () => {
    // e.preventDefault()
    try {
      setIsFormSubmitting(true)

      if (!!categoryData?.categoryImageUrl) {
        try {
          categoryData.categoryImageUrl = await convertImagesToBase64(categoryData.categoryImageUrl)
        } catch (error) {
          console.error(error)
          toast.error(error.message)
        }
      }

      const response = await axios.patch(
        `${process.env.VITE_APP_API_URL}/categories/update/${updateCategoryId}`,
        {
          categoryData,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        },
      )
      toast.success(response?.data?.message)
      setCategoryData({
        categoryName: '',
        categoryImageUrl: [],
      })

      setUpdateCategoryId(null)
      getCategories()
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || error.message || 'Opps, Some error occured')
    } finally {
      setIsFormSubmitting(false)
    }
  }

  const handleCategorySubmit = (e) => {
    e.preventDefault()
    if (!!updateCategoryId) {
      handleUpdateCategory()
    } else {
      handleAddCategory()
    }
  }

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Add Category</strong>
              {/* <small>List one new product item to database</small> */}
            </CCardHeader>
            <CCardBody>
              {!updateCategoryId ? (
                <>
                  <p className="text-body-secondary small">List one new category to database</p>
                  {/* <ul>
                    <li>
                      <code>&lt;Form will not be cleared automatically&gt;</code>
                    </li>
                  </ul> */}
                </>
              ) : (
                <>
                  <p className="text-body-secondary large">
                    Update information: <b>{categoryData.categoryName}</b>
                  </p>
                  <ul>
                    <li>
                      <code>
                        &lt;You can update the category name or category image both or anyone of
                        them. name&gt;
                      </code>
                      <code>
                        &lt;Click on the submit button after filling the required updated details,
                        It's done!&gt;
                      </code>
                    </li>
                  </ul>
                </>
              )}

              <CForm onSubmit={handleCategorySubmit} validated={!updateCategoryId}>
                <div className="mb-3">
                  <div className="mb-3">
                    <CFormLabel htmlFor="categoryName">Category Name</CFormLabel>
                    <CFormInput
                      type="text"
                      id="categoryName"
                      placeholder={!!updateCategoryId ? 'Updated name' : 'Category'}
                      value={categoryData.categoryName}
                      onChange={(e) => {
                        setCategoryData((prev) => {
                          return { ...prev, categoryName: e.target.value }
                        })
                      }}
                      minLength={3}
                      required
                    />
                    <CFormFeedback invalid>
                      Please provide a valid category name with minimum length of 3 characters.
                    </CFormFeedback>
                  </div>

                  <div className="mb-3">
                    <CFormLabel htmlFor="previewImage">Category Image</CFormLabel>
                    <CFormInput
                      type="file"
                      id="previewImage"
                      aria-label="Preview Image"
                      files={[]}
                      accept="image/*"
                      onChange={(e) => {
                        setCategoryData((prev) => {
                          return { ...prev, categoryImageUrl: e.target.files }
                        })
                      }}
                      required={!updateCategoryId}
                    />
                    <CFormFeedback invalid>
                      Only image files are allowed (.jpg, .jpeg, .png, .gif)
                    </CFormFeedback>
                  </div>
                </div>

                <div className="mb-3">
                  <CButton
                    type="submit"
                    color="primary"
                    disabled={!updateCategoryId && (isSubmitDisabled || isFormSubmitting)}
                  >
                    {!!updateCategoryId ? 'Update Category' : 'Submit'}
                  </CButton>

                  <CButton
                    onClick={() => {
                      setCategoryData({
                        categoryName: '',
                        categoryImageUrl: [],
                      })
                      setUpdateCategoryId(undefined)
                    }}
                    style={{
                      marginLeft: 5,
                      color: 'white',
                    }}
                    type="button"
                    color="danger"
                    disabled={!updateCategoryId && (isSubmitDisabled || isFormSubmitting)}
                  >
                    Clear
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Categories</CCardHeader>
            <CCardBody>
              {isCategoriesLoading ? (
                <CSpinner className="text-center" />
              ) : (
                <CTable align="middle" className="mb-0 border" hover responsive>
                  <CTableHead className="text-nowrap">
                    <CTableRow>
                      <CTableHeaderCell className="bg-body-tertiary text-center">
                        SL.
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary text-center">
                        <CIcon icon={cilApps} size="s" />
                      </CTableHeaderCell>

                      <CTableHeaderCell className="bg-body-tertiary">Name</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Key</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Dates</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary text-center">
                        Activity
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {categoryList?.map((item, index) => (
                      <CTableRow v-for="item in tableItems" key={index}>
                        <CTableDataCell>
                          <div className="text-center">{index + 1}</div>
                        </CTableDataCell>

                        <CTableDataCell>
                          <CAvatar src={item.categoryImageUrl} size="xl" />
                        </CTableDataCell>

                        <CTableDataCell>
                          <div>{item.categoryName}</div>
                        </CTableDataCell>

                        <CTableDataCell>
                          <div className="d-flex justify-content-between text-nowrap">
                            <div className="fw-semibold text-center">{item.categoryKey}</div>
                          </div>
                        </CTableDataCell>

                        <CTableDataCell>
                          <div className="small text-body-secondary text-nowrap">
                            Created: {item.createdAt}
                          </div>
                          <div className="small text-body-secondary text-nowrap">
                            Last Updated: {item.updatedAt}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div
                            style={{
                              zIndex: 10,
                            }}
                            className="text-center"
                          >
                            <CButtonGroup role="group" aria-label="Basic mixed styles example">
                              <CButton
                                onClick={() => {
                                  setUpdateCategoryId(item._id)
                                  setCategoryData((prev) => {
                                    return { ...prev, categoryName: item.categoryName }
                                  })
                                }}
                                type="button"
                                color="primary"
                              >
                                Edit
                              </CButton>
                              <CButton
                                onClick={() => {
                                  setDeleteCategoryId(item._id)
                                }}
                                style={{
                                  color: 'white',
                                }}
                                color="danger"
                                type="button"
                              >
                                Delete
                              </CButton>
                            </CButtonGroup>
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CModal
        visible={!!deleteCategoryId}
        onClose={() => setDeleteCategoryId(null)}
        aria-labelledby="LiveDemoExampleLabel"
      >
        <CModalHeader onClose={() => setDeleteCategoryId(null)}>
          <CModalTitle id="LiveDemoExampleLabel">Are you sure about that?</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Deleting this category will remove this category from database</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteCategoryId(null)}>
            Close
          </CButton>
          <CButton disabled={deleteButtonLoading} onClick={handleDeleteCategory} color="primary">
            {deleteButtonLoading ? <CSpinner /> : 'Delete'}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default ProductAdd
