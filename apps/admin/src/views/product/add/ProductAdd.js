import React, { useEffect, useMemo, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormFeedback,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
  CRow,
  CCollapse,
  CSpinner,
} from '@coreui/react'

import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import axios from 'axios'
import { useSelector } from 'react-redux'

import { toast } from 'react-toastify'

const ProductAdd = ({
  loading = undefined,
  setIsUpdateLoading = undefined,
  fetchProductData = undefined,
  setVisible = undefined,
}) => {
  const [updateProductId, setUpdateProductId] = useState(null)

  const [variantQuantity, setVariantQuantity] = useState(1)

  const [productData, setProductData] = useState({
    title: '',
    previewImage: [],
    slideImages: [],
    description: '',
    category: '',
    productType: '',
    rentingPrice: '',
    discountedPrice: '',
    originalPrice: '',
    shippingPrice: '',
    availableStocks: 0,
    isVariantAvailable: false,
    productVariant: {},
  })

  const [categoryList, setCategoryList] = useState([])

  // ! Fetch category logic
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await axios.get(`${process.env.VITE_APP_API_URL}/categories`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        })
        setCategoryList(response.data.categories)
      } catch (error) {
        console.error(error)
        toast.error(error.response.data?.message || 'Some unknown error occured')
      }
    }

    fetchCategoryData()
  }, [])

  // ! Update product logic
  useEffect(() => {
    const id = sessionStorage.getItem('productId') || null
    setUpdateProductId(id)

    if (!!id) {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `${process.env.VITE_APP_API_URL}/products/admin-view/${id}`,
            {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
            },
          )

          const product = response.data.product

          setProductData({
            title: product.title,
            previewImage: [],
            slideImages: [],
            description: product.description,
            category: product.category,
            productType: product.productType,
            rentingPrice: product.rentingPrice,
            discountedPrice: product.discountedPrice,
            originalPrice: product.originalPrice,
            shippingPrice: product.shippingPrice,
            availableStocks: product.availableStocks,
            isVariantAvailable: product.isVariantAvailable,
            productVariant:
              product.productVariant.length > 0
                ? product.productVariant.reduce((acc, variant, index) => {
                    variant.previewImage = []
                    variant.slideImages = []
                    return { ...acc, [`variant_no_${index}`]: variant }
                  }, {})
                : {},
          })

          setVariantQuantity(product?.productVariant?.length || 0)
          if (typeof setIsFormSubmitting !== undefined) setIsUpdateLoading(false)
        } catch (error) {
          console.error(error)
        }
      }
      fetchData()
    }
  }, [])

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true)

  useEffect(() => {
    let isEverythingOk =
      !!productData?.title &&
      productData.title.length >= 10 &&
      productData.previewImage.length > 0 &&
      productData.slideImages.length > 0 &&
      productData.description?.length > 5 &&
      !!productData.category &&
      !!productData.productType &&
      !isNaN(Number(productData.rentingPrice)) &&
      !isNaN(Number(productData.discountedPrice)) &&
      !isNaN(Number(productData.originalPrice)) &&
      +productData.discountedPrice < +productData.originalPrice

    // if (productData.isVariantAvailable) {
    //   isEverythingOk =
    //     isEverythingOk && Object.keys(productData.productVariant).length === variantQuantity
    // }

    setIsSubmitDisabled(!isEverythingOk)
  }, [productData])

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

  const handleAddProduct = async () => {
    try {
      productData.previewImage = await convertImagesToBase64(productData.previewImage)

      if (productData.slideImages.length > 0) {
        const slideImages = await convertImagesToBase64(productData.slideImages)
        productData.slideImages = slideImages
      }

      const variants = Object.values(productData.productVariant)

      for (let i = 0; i < variants.length; i++) {
        variants[i].previewImage = await convertImagesToBase64(variants[i].previewImage)
        if (variants[i].slideImages.length > 0) {
          const slideImages = await convertImagesToBase64(variants[i].slideImages)
          variants[i].slideImages = slideImages
        }
      }
    } catch (error) {
      console.error(error)
    }

    // console.log(productData)

    const response = await axios.post(
      `${process.env.VITE_APP_API_URL}/products`,
      {
        productData,
      },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    )
  }

  const handleUpdateProduct = async () => {
    try {
      if (!!productData.previewImage.length) {
        productData.previewImage = await convertImagesToBase64(productData.previewImage)
      }

      if (productData.slideImages.length) {
        const slideImages = await convertImagesToBase64(productData.slideImages)
        productData.slideImages = slideImages
      }

      const variants = Object.values(productData.productVariant)

      for (let i = 0; i < variants.length; i++) {
        if (variants[i].previewImage.length) {
          variants[i].previewImage = await convertImagesToBase64(variants[i].previewImage)
        }

        if (variants[i].slideImages.length > 0) {
          const slideImages = await convertImagesToBase64(variants[i].slideImages)
          variants[i].slideImages = slideImages
        }
      }
    } catch (error) {
      console.error(error)
    }

    console.log(productData)

    const response = await axios.patch(
      `${process.env.VITE_APP_API_URL}/products/update/${updateProductId}`,
      {
        productData,
      },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    )
    if (typeof fetchProductData !== undefined) {
      fetchProductData()
    }

    if (typeof setVisible !== undefined) {
      setVisible(false)
    }
    sessionStorage.removeItem('productId')
  }

  const handleProductSubmit = async (e) => {
    e.preventDefault()
    const id = toast.loading('Sending your request.. Please wait..')
    try {
      setIsFormSubmitting(true)
      if (!!updateProductId) {
        await handleUpdateProduct()
        toast.update(id, {
          render: 'Product Updated',
          type: 'success',
          isLoading: false,
          autoClose: 5000,
        })
      } else {
        await handleAddProduct()
        toast.update(id, {
          render: 'Product Created',
          type: 'success',
          isLoading: false,
          autoClose: 5000,
        })
      }
    } catch (error) {
      console.error(error)
      toast.error()
      toast.update(id, {
        render: error.response?.data?.message || error.message || 'Opps, Some error occured',
        type: 'error',
        isLoading: false,
        closeOnClick: true,
      })
    } finally {
      setIsFormSubmitting(false)
    }
  }

  return (
    <CRow>
      {loading ? (
        <CSpinner size={15} />
      ) : (
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>{!updateProductId ? 'Add' : 'Update'} Product</strong>
              {/* <small>List one new product item to database</small> */}
            </CCardHeader>
            <CCardBody>
              <p className="text-body-secondary small">
                {!updateProductId ? 'List one  new' : 'Update'} product.
              </p>
              {!updateProductId ? (
                <ul>
                  <li>
                    <code>&lt;All fields are required and strictly need to be filled&gt;</code>
                  </li>
                </ul>
              ) : (
                <ul>
                  <li>
                    <code>
                      &lt;All fields are required, You can leave the image upload boxes blank if you
                      don't want to update the images.&gt;
                    </code>
                  </li>
                </ul>
              )}

              <CForm onSubmit={handleProductSubmit} validated={!updateProductId}>
                <div className="mb-3">
                  <div className="mb-3">
                    <CFormLabel htmlFor="productTitle">Product Title</CFormLabel>
                    <CFormInput
                      type="text"
                      id="productTitle"
                      placeholder="Required product title"
                      value={productData.title}
                      onChange={(e) => {
                        setProductData((prev) => {
                          return { ...prev, title: e.target.value }
                        })
                      }}
                      minLength={10}
                      required={!updateProductId}
                    />
                    <CFormFeedback invalid>
                      Please provide a valid title with minimum length of 10 characters.
                    </CFormFeedback>
                  </div>

                  <div className="mb-3">
                    <CFormLabel htmlFor="previewImage">Preview Image</CFormLabel>
                    <CFormInput
                      type="file"
                      id="previewImage"
                      aria-label="Preview Image"
                      accept="image/*"
                      onChange={(e) => {
                        setProductData((prev) => {
                          return { ...prev, previewImage: e.target.files }
                        })
                      }}
                      required={!updateProductId}
                    />
                    <CFormFeedback invalid>Select preview image</CFormFeedback>
                  </div>

                  <div className="mb-3">
                    <CFormLabel htmlFor="slideImages">Slide Images</CFormLabel>
                    <CFormInput
                      onChange={(e) => {
                        setProductData((prev) => {
                          return { ...prev, slideImages: e.target.files }
                        })
                      }}
                      type="file"
                      id="slideImages"
                      multiple
                      aria-label="Slide Images"
                      accept="image/*"
                      required={!updateProductId}
                    />
                    <CFormFeedback invalid>Select slide images</CFormFeedback>
                  </div>

                  <CFormLabel htmlFor="validationTextarea" className="form-label">
                    Description
                  </CFormLabel>
                  <CKEditor
                    editor={ClassicEditor}
                    data={
                      productData?.description ||
                      '<p>Start editing your product description here.</p>'
                    }
                    onReady={(editor) => {
                      // You can store the "editor" and use when it is needed.
                      console.log('Editor is ready to use!', editor)
                    }}
                    onChange={(e, editor) => {
                      setProductData((prev) => {
                        return { ...prev, description: editor.getData() }
                      })
                    }}
                  />
                  <CFormFeedback invalid>
                    Please enter the description for the product in the textarea.
                  </CFormFeedback>
                </div>

                <div className="mb-3">
                  <CFormLabel htmlFor="validationTextarea" className="form-label">
                    Category
                  </CFormLabel>
                  <CFormSelect
                    value={productData?.category?._id}
                    onChange={(e) => {
                      setProductData((prev) => {
                        return { ...prev, category: e.target.value }
                      })
                    }}
                    required={!updateProductId}
                    aria-label="select example"
                  >
                    <option>Select Category</option>
                    {categoryList?.map((category) => (
                      <option key={category?._id?.toString()} value={category._id}>
                        {category.categoryName}
                      </option>
                    ))}
                  </CFormSelect>
                </div>

                <div className="mb-3">
                  <CFormLabel htmlFor="validationTextarea" className="form-label">
                    Product Type
                  </CFormLabel>
                  <CFormSelect
                    value={productData.productType}
                    onChange={(e) => {
                      setProductData((prev) => {
                        return { ...prev, productType: e.target.value }
                      })
                    }}
                    required={!updateProductId}
                    aria-label="select example"
                  >
                    <option>Select Product Type</option>
                    <option value="rent">Rent</option>
                    <option value="buy">Buy</option>
                    <option value="both">Both Rent and Buy</option>
                  </CFormSelect>
                </div>

                <p className="text-body-secondary small">
                  Below are the instructions how to fill the pricing fields.
                </p>
                <ul>
                  <li>
                    <code>&lt;Rent Price is the default rent price&gt;</code>
                  </li>
                  <li>
                    <code>&lt;Buy price is the discounted buying price of the product&gt;</code>
                  </li>
                  <li>
                    <code>
                      &lt;Original Price is the original price or MRP price of the product&gt;
                    </code>
                  </li>
                  <li>
                    <code>
                      &lt;Shipping price is the shipping price for an product, shipping price will
                      only be applied to buy products. Rent products will have 0 as shipping price
                      as it is going to be picked by user from `Center`&gt;
                    </code>
                  </li>
                </ul>
                <CRow className="mb-3">
                  <CCol md={3}>
                    <CFormLabel htmlFor="validationDefault05">Rent Price</CFormLabel>
                    <CFormInput
                      value={productData.rentingPrice}
                      onChange={(e) => {
                        setProductData((prev) => {
                          return { ...prev, rentingPrice: +e.target.value }
                        })
                      }}
                      onWheel={(e) => {
                        e.preventDefault()
                      }}
                      type="number"
                      id="validationDefault05"
                      required={!updateProductId}
                    />
                    <CFormFeedback invalid>Please provide a valid non zero number.</CFormFeedback>
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel htmlFor="validationDefault05">Buying Price</CFormLabel>
                    <CFormInput
                      value={productData.discountedPrice}
                      onWheel={(e) => {
                        e.preventDefault()
                      }}
                      onChange={(e) => {
                        setProductData((prev) => {
                          return { ...prev, discountedPrice: +e.target.value }
                        })
                      }}
                      type="number"
                      id="validationDefault05"
                      required={!updateProductId}
                    />
                    <CFormFeedback invalid>Please provide a valid non zero number.</CFormFeedback>
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel htmlFor="validationDefault05">Original Price</CFormLabel>
                    <CFormInput
                      value={productData.originalPrice}
                      onWheel={(e) => {
                        e.preventDefault()
                      }}
                      onChange={(e) => {
                        setProductData((prev) => {
                          return { ...prev, originalPrice: +e.target.value }
                        })
                      }}
                      type="number"
                      id="validationDefault05"
                      required={!updateProductId}
                    />
                    <CFormFeedback invalid>Please provide a valid non zero number.</CFormFeedback>
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel htmlFor="validationDefault05">Shipping Price</CFormLabel>
                    <CFormInput
                      value={productData.shippingPrice}
                      onWheel={(e) => {
                        e.preventDefault()
                      }}
                      onChange={(e) => {
                        setProductData((prev) => {
                          return { ...prev, shippingPrice: +e.target.value }
                        })
                      }}
                      type="number"
                      id="validationDefault05"
                      required={!updateProductId}
                    />
                    <CFormFeedback invalid>Please provide a valid non zero number.</CFormFeedback>
                  </CCol>
                </CRow>

                <div className="mb-3">
                  <CFormLabel htmlFor="availableStocks" className="form-label">
                    Available Stocks
                  </CFormLabel>
                  <CFormInput
                    value={productData.availableStocks}
                    onChange={(e) => {
                      setProductData((prev) => {
                        return { ...prev, availableStocks: +e.target.value }
                      })
                    }}
                    type="text"
                    id="availableStocks"
                    placeholder="1000"
                    required={!updateProductId}
                  />
                  <CFormFeedback invalid>Should be greater than 0</CFormFeedback>
                </div>

                <div className="mb-3">
                  <p className="text-body-secondary ">
                    Product variants are different product sizes and colors. Each different product
                    variant has different pricing infomation and has different preview images
                  </p>
                  <ul>
                    <li>
                      <code>Click the chekbox if you want to add variants</code>
                    </li>
                    <li>
                      <code>
                        Enter the number of variants you need beside the checkbox to populate
                        variant filling boxes
                      </code>
                    </li>
                  </ul>
                  {/* <CFormCheck type="checkbox" id="productVariantCheck" label="" /> */}
                  {!updateProductId && (
                    <>
                      <CFormLabel htmlFor="availableStocks" className="form-label">
                        Variant Required
                      </CFormLabel>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CFormCheck
                            onChange={(e) => {
                              setProductData((prev) => {
                                return { ...prev, isVariantAvailable: e.target.checked }
                              })
                            }}
                            type="checkbox"
                            checked={!!productData?.isVariantAvailable}
                            aria-label="Product has variants"
                            disabled={!!updateProductId}
                          />
                        </CInputGroupText>
                        <CFormInput
                          onChange={(e) => {
                            setVariantQuantity(e.target.value)
                          }}
                          value={variantQuantity}
                          onWheel={(e) => {
                            e.preventDefault()
                          }}
                          type="number"
                          min={0}
                          placeholder={1}
                          aria-label="Variant quantity"
                        />
                      </CInputGroup>
                    </>
                  )}
                </div>

                {/* VARIANT POPULATION  */}

                {!!productData?.isVariantAvailable && (
                  <p className="text-body-secondary ">Fill the variant details:</p>
                )}
                {!!productData?.isVariantAvailable &&
                  Array.from({ length: variantQuantity }).map((item, index) => {
                    return (
                      <CCol xs={12}>
                        <CCard className="mb-4">
                          <CCardHeader>
                            <strong>Variant {index + 1}</strong>
                            {/* <small>List one new product item to database</small> */}
                          </CCardHeader>
                          <CCardBody>
                            <p className="text-body-secondary">
                              Before submitting variant details you need to create one product. So
                              before creating variant click on the submit button so that you can
                              create variant for the product
                            </p>

                            <CForm validated={true}>
                              <div className="mb-3">
                                <div className="mb-3">
                                  <CFormLabel htmlFor="previewImage">Preview Image</CFormLabel>
                                  <CFormInput
                                    onChange={(e) => {
                                      setProductData((prev) => {
                                        return {
                                          ...prev,
                                          productVariant: {
                                            ...prev.productVariant,
                                            [`variant_no_${index}`]: {
                                              ...prev.productVariant[`variant_no_${index}`],
                                              previewImage: Array.from(e.target.files),
                                            },
                                          },
                                        }
                                      })
                                    }}
                                    type="file"
                                    id="previewImage"
                                    aria-label="Preview Image"
                                    accept="image/*"
                                    required={!updateProductId}
                                  />
                                  <CFormFeedback invalid>Select preview image</CFormFeedback>
                                </div>

                                <div className="mb-3">
                                  <CFormLabel htmlFor="slideImages">Slide Images</CFormLabel>
                                  <CFormInput
                                    onChange={(e) => {
                                      setProductData((prev) => {
                                        return {
                                          ...prev,
                                          productVariant: {
                                            ...prev.productVariant,
                                            [`variant_no_${index}`]: {
                                              ...prev.productVariant[`variant_no_${index}`],
                                              slideImages: Array.from(e.target.files),
                                            },
                                          },
                                        }
                                      })
                                    }}
                                    type="file"
                                    id="slideImages"
                                    multiple
                                    aria-label="Slide Images"
                                    accept="image/*"
                                    required={!updateProductId}
                                  />
                                  <CFormFeedback invalid>Select slide images</CFormFeedback>
                                </div>
                              </div>

                              <CRow className="mb-3">
                                <CCol md={3}>
                                  <CFormLabel htmlFor="validationDefault05">Rent Price</CFormLabel>
                                  <CFormInput
                                    value={
                                      productData?.productVariant[`variant_no_${index}`]
                                        ?.rentingPrice
                                    }
                                    onChange={(e) => {
                                      setProductData((prev) => {
                                        return {
                                          ...prev,
                                          productVariant: {
                                            ...prev.productVariant,
                                            [`variant_no_${index}`]: {
                                              ...prev.productVariant[`variant_no_${index}`],
                                              rentingPrice: +e.target.value,
                                            },
                                          },
                                        }
                                      })
                                    }}
                                    onWheel={(e) => {
                                      e.preventDefault()
                                    }}
                                    type="number"
                                    id="validationDefault05"
                                    required={!updateProductId}
                                  />
                                  <CFormFeedback invalid>
                                    Please provide a valid non zero number.
                                  </CFormFeedback>
                                </CCol>
                                <CCol md={3}>
                                  <CFormLabel htmlFor="validationDefault05">
                                    Buying Price
                                  </CFormLabel>
                                  <CFormInput
                                    value={
                                      productData?.productVariant[`variant_no_${index}`]
                                        ?.discountedPrice
                                    }
                                    onChange={(e) => {
                                      setProductData((prev) => {
                                        return {
                                          ...prev,
                                          productVariant: {
                                            ...prev.productVariant,
                                            [`variant_no_${index}`]: {
                                              ...prev.productVariant[`variant_no_${index}`],
                                              discountedPrice: +e.target.value,
                                            },
                                          },
                                        }
                                      })
                                    }}
                                    onWheel={(e) => {
                                      e.preventDefault()
                                    }}
                                    type="number"
                                    id="validationDefault05"
                                    required={!updateProductId}
                                  />
                                  <CFormFeedback invalid>
                                    Please provide a valid non zero number.
                                  </CFormFeedback>
                                </CCol>
                                <CCol md={3}>
                                  <CFormLabel htmlFor="validationDefault05">
                                    Original Price
                                  </CFormLabel>
                                  <CFormInput
                                    value={
                                      productData?.productVariant[`variant_no_${index}`]
                                        ?.originalPrice
                                    }
                                    onChange={(e) => {
                                      setProductData((prev) => {
                                        return {
                                          ...prev,
                                          productVariant: {
                                            ...prev.productVariant,
                                            [`variant_no_${index}`]: {
                                              ...prev.productVariant[`variant_no_${index}`],
                                              originalPrice: +e.target.value,
                                            },
                                          },
                                        }
                                      })
                                    }}
                                    onWheel={(e) => {
                                      e.preventDefault()
                                    }}
                                    type="number"
                                    id="validationDefault05"
                                    required={!updateProductId}
                                  />
                                  <CFormFeedback invalid>
                                    Please provide a valid non zero number.
                                  </CFormFeedback>
                                </CCol>
                                <CCol md={3}>
                                  <CFormLabel htmlFor="shippingPrice">Shipping Price</CFormLabel>
                                  <CFormInput
                                    value={
                                      productData?.productVariant[`variant_no_${index}`]
                                        ?.shippingPrice
                                    }
                                    onChange={(e) => {
                                      setProductData((prev) => {
                                        return {
                                          ...prev,
                                          productVariant: {
                                            ...prev.productVariant,
                                            [`variant_no_${index}`]: {
                                              ...prev.productVariant[`variant_no_${index}`],
                                              shippingPrice: +e.target.value,
                                            },
                                          },
                                        }
                                      })
                                    }}
                                    onWheel={(e) => {
                                      e.preventDefault()
                                    }}
                                    type="number"
                                    id="shippingPrice"
                                    required={!updateProductId}
                                  />
                                  <CFormFeedback invalid>
                                    Please provide a valid non zero number.
                                  </CFormFeedback>
                                </CCol>
                              </CRow>

                              <p className="text-body-secondary ">
                                Each variant should have its own stocks, color and size
                              </p>

                              <CRow className="mb-3">
                                <CCol md={3}>
                                  <CFormLabel htmlFor={`variantColor-${index + 1}`}>
                                    Color
                                  </CFormLabel>
                                  <CFormInput
                                    value={
                                      productData?.productVariant[`variant_no_${index}`]?.color
                                    }
                                    onChange={(e) => {
                                      setProductData((prev) => {
                                        return {
                                          ...prev,
                                          productVariant: {
                                            ...prev.productVariant,
                                            [`variant_no_${index}`]: {
                                              ...prev.productVariant[`variant_no_${index}`],
                                              color: e.target.value,
                                            },
                                          },
                                        }
                                      })
                                    }}
                                    type="text"
                                    id={`variantColor-${index + 1}`}
                                    placeholder="Black | White | Red etc."
                                    required={!updateProductId}
                                  />
                                  <CFormFeedback invalid>
                                    Please provide a color for the variant.
                                  </CFormFeedback>
                                </CCol>
                                <CCol md={3}>
                                  <CFormLabel htmlFor={`variantSize-${index + 1}`}>Size</CFormLabel>
                                  <CFormInput
                                    value={productData?.productVariant[`variant_no_${index}`]?.size}
                                    onChange={(e) => {
                                      setProductData((prev) => {
                                        return {
                                          ...prev,
                                          productVariant: {
                                            ...prev.productVariant,
                                            [`variant_no_${index}`]: {
                                              ...prev.productVariant[`variant_no_${index}`],
                                              size: e.target.value,
                                            },
                                          },
                                        }
                                      })
                                    }}
                                    type="text"
                                    id={`variantSize-${index + 1}`}
                                    placeholder="S | L | XL | 8 etc."
                                    required={!updateProductId}
                                  />
                                  <CFormFeedback invalid>
                                    Please provide a size for the variant.
                                  </CFormFeedback>
                                </CCol>
                              </CRow>

                              <div className="mb-3">
                                <CFormLabel
                                  htmlFor={`variantAvailableStocks-${index + 1}`}
                                  className="form-label"
                                >
                                  Available Variant Stocks
                                </CFormLabel>
                                <CFormInput
                                  value={
                                    productData?.productVariant[`variant_no_${index}`]
                                      ?.availableStocks
                                  }
                                  onChange={(e) => {
                                    setProductData((prev) => {
                                      return {
                                        ...prev,
                                        productVariant: {
                                          ...prev.productVariant,
                                          [`variant_no_${index}`]: {
                                            ...prev.productVariant[`variant_no_${index}`],
                                            availableStocks: +e.target.value,
                                          },
                                        },
                                      }
                                    })
                                  }}
                                  type="number"
                                  id={`variantAvailableStocks-${index + 1}`}
                                  placeholder="1000"
                                  required={!updateProductId}
                                />
                                <CFormFeedback invalid>Should be greater than 0</CFormFeedback>
                              </div>
                            </CForm>
                          </CCardBody>
                        </CCard>
                      </CCol>
                    )
                  })}

                <div className="mb-3">
                  <CButton
                    type="submit"
                    color="primary"
                    disabled={!(updateProductId || (!isSubmitDisabled && !isFormSubmitting))}
                  >
                    {updateProductId ? 'Update Product' : 'Submit form'}
                  </CButton>
                  {/* <CButton
                  type="submit"
                  color="primary"
                  disabled={isSubmitDisabled || isFormSubmitting}
                >
                  Submit form
                </CButton> */}
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      )}
    </CRow>
  )
}

export default ProductAdd
