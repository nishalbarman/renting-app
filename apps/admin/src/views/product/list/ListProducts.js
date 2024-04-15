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
  //   const [categoryData, setCategoryData] = useState({
  //     categoryName: '',
  //     categoryImageUrl: [],
  //   })

  //   const categoryImageRef = useRef(null)

  //   const [isSubmitDisabled, setIsSubmitDisabled] = useState(true)

  //   useEffect(() => {
  //     let isEverythingOk =
  //       !!categoryData?.categoryName &&
  //       categoryData.categoryName.length >= 3 &&
  //       categoryData.categoryImageUrl.length > 0
  //     setIsSubmitDisabled(!isEverythingOk)
  //   }, [categoryData])

  const [isFormSubmitting, setIsFormSubmitting] = useState(false)

  const { jwtToken } = useSelector((state) => state.auth)

  const [productsList, setproductsList] = useState([])
  const [paginationPage, setPaginationPage] = useState(1)
  const [paginationLimit, setPaginationLimit] = useState(10)

  const [isCategoriesLoading, sestIsCategoriesLoading] = useState(true)

  const getCategories = async () => {
    try {
      sestIsCategoriesLoading(true)
      const response = await axios.get(`${process.env.VITE_APP_API_URL}/products`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
      setproductsList(response.data?.data)
      setPaginationPage(response.data?.totalPages)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      sestIsCategoriesLoading(false)
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

  return (
    <>
      <CRow>
        <CCol>
          <CCard className="mb-4">
            <CCardHeader>List of products</CCardHeader>
            <CCardBody>
              {isCategoriesLoading ? (
                <CSpinner className="text-center" />
              ) : (
                <CTable align="middle" className="mb-0 ml-2 border" hover responsive>
                  <CTableHead className="text-nowrap">
                    <CTableRow>
                      <CTableHeaderCell className="bg-body-tertiary text-center">
                        #
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary text-center">
                        <CIcon icon={cilApps} size="s" />
                      </CTableHeaderCell>

                      <CTableHeaderCell className="bg-body-tertiary">
                        Product Title
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Category</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Type</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary text-center">
                        Average Rating
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary text-center">
                        Total Feedbacks
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary text-center">
                        Discounted Price
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary text-center">
                        Original Price
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary text-center">
                        Renting Price
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary text-center">
                        Shipping Price
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Variant</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Dates</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary text-center">
                        Activity
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {productsList?.map((item, index) => (
                      <CTableRow v-for="item in tableItems gap-2" key={index}>
                        <CTableDataCell>
                          <div className="text-center">{index + 1}</div>
                        </CTableDataCell>

                        <CTableDataCell>
                          <CAvatar shape="rounded-0" src={item.previewImage} size="xl" />
                        </CTableDataCell>

                        <CTableDataCell>
                          <div className="text-nowrap" title={item.title}>
                            {item.title.length > 15
                              ? item.title.substring(0, 15) + '...'
                              : item.title}
                          </div>
                        </CTableDataCell>

                        <CTableDataCell>
                          <div className="d-flex justify-content-between text-nowrap">
                            <div className="fw-semibold text-center">
                              {item.category?.categoryName || 'N/A'}
                            </div>
                          </div>
                        </CTableDataCell>

                        <CTableDataCell>
                          <div>{item.productType}</div>
                        </CTableDataCell>

                        <CTableDataCell>
                          <div className="text-center">{item.stars}</div>
                        </CTableDataCell>

                        <CTableDataCell>
                          <div className="text-center">{item.totalFeedbacks}</div>
                        </CTableDataCell>

                        <CTableDataCell>
                          <div className="text-center">{item.discountedPrice}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="text-center">{item.originalPrice}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="text-center">{item.rentingPrice}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="text-center">{item.shippingPrice}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="text-center">
                            {item.isVariantAvailable ? (
                              <CButton
                                disabled={deleteButtonLoading}
                                onClick={handleDeleteCategory}
                                color="primary"
                              >
                                {'View'}
                              </CButton>
                            ) : (
                              <div>N/A</div>
                            )}
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
