import { useEffect, useMemo, useState } from 'react'
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from 'material-react-table'
import { useSelector } from 'react-redux'

//Date Picker Imports - these should just be in your Context Provider
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import CIcon from '@coreui/icons-react'
import { cilFile, cilPen, cilTrash } from '@coreui/icons'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CSpinner,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CCarousel,
  CCarouselItem,
  CImage,
} from '@coreui/react'
import axios from 'axios'
import { Box, Button, MenuItem, lighten } from '@mui/material'

import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

import UpdateModal from './UpdateModal'
import ViewProductDetailsModal from './ViewProductDetailsModal'

const ListProduct = () => {
  const navigate = useNavigate()

  const { jwtToken } = useSelector((state) => state.auth)

  //data and fetching state
  const [data, setData] = useState([])
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isRefetching, setIsRefetching] = useState(false)
  const [rowCount, setRowCount] = useState(0)

  //table state
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const fetchProductData = async () => {
    if (!data.length) {
      setIsLoading(true)
    } else {
      setIsRefetching(true)
    }

    const url = new URL('/products', process.env.VITE_APP_API_URL)

    url.searchParams.set('page', `${pagination.pageIndex}`)
    url.searchParams.set('limit', `${pagination.pageSize}`)

    try {
      const res = await axios.get(url.href, {
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
      })
      setData(res.data?.data || [])
      setRowCount(res.data?.totalProductCount || 0)
    } catch (error) {
      setIsError(true)
      console.error(error)
      return
    }
    setIsError(false)
    setIsLoading(false)
    setIsRefetching(false)
  }

  //if you want to avoid useEffect, look at the React Query example instead
  useEffect(() => {
    fetchProductData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.pageIndex, pagination.pageSize])

  const columns = useMemo(
    () => [
      {
        id: 'prodcut_info', //id used to define `group` column
        header: 'Product Information',
        columns: [
          {
            accessorKey: 'previewImage', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            header: 'Preview Image',
            size: 50,
            enableColumnFilter: false,
            enableColumnFilterModes: false,
            enableFilters: false,
            Cell: ({ cell, renderedCellValue, row }) => (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <img
                  alt="avatar"
                  height={30}
                  src={cell.getValue()}
                  loading="lazy"
                  style={{
                    borderRadius: '10px',
                    border: '1px solid black',
                    width: 50,
                    height: 50,
                    objectFit: 'cover',
                  }}
                />
              </Box>
            ),
          },
          {
            accessorFn: (row) => `${row.title}`, //accessorFn used to join multiple data into a single cell
            id: 'title', //id is still required when using accessorFn instead of accessorKey
            header: 'Title',
            size: 250,
            Cell: ({ renderedCellValue, row }) => (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <span>{renderedCellValue}</span>
              </Box>
            ),
          },
          {
            accessorFn: (row) => `${row.category}`,
            // accessorKey: 'category', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            enableClickToCopy: true,
            filterVariant: 'autocomplete',
            header: 'Category',
            size: 300,
            Cell: ({ renderedCellValue, row }) => (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <span>{renderedCellValue.category?.categoryName || 'NA'}</span>
              </Box>
            ),
          },

          {
            accessorKey: 'productType',
            enableClickToCopy: false,
            header: 'Product Type',
            size: 300,
            Cell: ({ renderedCellValue, row }) => (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <span>
                  <b>
                    {renderedCellValue == 'both' ? 'RENT/BUY' : renderedCellValue?.toUpperCase()}
                  </b>
                </span>
              </Box>
            ),
          },
        ],
      },

      {
        id: 'feedback',
        header: 'Feedback Info',
        columns: [
          {
            accessorKey: 'stars',
            // filterVariant: 'range', //if not using filter modes feature, use this instead of filterFn
            filterFn: 'between',
            header: 'Average Rating',
            size: 200,
            //custom conditional format and styling
            Cell: ({ cell }) => (
              <Box
                component="span"
                sx={(theme) => ({
                  color: 'black',
                  maxWidth: '9ch',
                  p: '0.25rem',
                })}
              >
                {cell.getValue()}
              </Box>
            ),
          },
          {
            accessorKey: 'totalFeedbacks', //hey a simple column for once
            header: 'Total Feedbacks',
            size: 350,
            Cell: ({ cell }) => (
              <Box
                component="span"
                sx={(theme) => ({
                  color: 'black',
                  maxWidth: '9ch',
                  p: '0.25rem',
                })}
              >
                {cell.getValue()}
              </Box>
            ),
          },
        ],
      },

      {
        id: 'pricing',
        header: 'Product Pricing',
        columns: [
          {
            accessorKey: 'discountedPrice',
            // filterVariant: 'range', //if not using filter modes feature, use this instead of filterFn
            filterFn: 'between',
            header: 'Discounted Price',
            size: 200,
            //custom conditional format and styling
            Cell: ({ cell }) => <Box component="span">{cell.getValue()}</Box>,
          },
          {
            accessorKey: 'originalPrice',
            // filterVariant: 'range', //if not using filter modes feature, use this instead of filterFn
            filterFn: 'between',
            header: 'Original Price',
            size: 200,
            //custom conditional format and styling
            Cell: ({ cell }) => <Box component="span">{cell.getValue()}</Box>,
          },
          {
            accessorKey: 'rentingPrice',
            // filterVariant: 'range', //if not using filter modes feature, use this instead of filterFn
            filterFn: 'between',
            header: 'Renting Price',
            size: 200,
            //custom conditional format and styling
            Cell: ({ cell }) => <Box component="span">{cell.getValue()}</Box>,
          },
          {
            accessorKey: 'shippingPrice',
            // filterVariant: 'range', //if not using filter modes feature, use this instead of filterFn
            filterFn: 'between',
            header: 'Shipping Price',
            size: 200,
            //custom conditional format and styling
            Cell: ({ cell }) => <Box component="span">{cell.getValue()}</Box>,
          },
        ],
      },

      {
        id: 'date',
        header: 'Date',
        columns: [
          {
            accessorFn: (row) => new Date(row.createdAt), //convert to Date for sorting and filtering
            id: 'createdAt',
            header: 'Created Date',
            filterVariant: 'date',
            filterFn: 'lessThan',
            sortingFn: 'datetime',
            Cell: ({ cell }) => cell.getValue()?.toLocaleDateString(), //render Date as a string
            Header: ({ column }) => <em>{column.columnDef.header}</em>, //custom header markup
            muiFilterTextFieldProps: {
              sx: {
                minWidth: '250px',
              },
            },
          },
          {
            accessorFn: (row) => new Date(row.createdAt), //convert to Date for sorting and filtering
            id: 'updatedAt',
            header: 'Updated Date',
            filterVariant: 'date',
            filterFn: 'lessThan',
            sortingFn: 'datetime',
            Cell: ({ cell }) => cell.getValue()?.toLocaleDateString(), //render Date as a string
            Header: ({ column }) => <em>{column.columnDef.header}</em>, //custom header markup
            muiFilterTextFieldProps: {
              sx: {
                minWidth: '250px',
              },
            },
          },
        ],
      },
    ],
    [],
  )

  const table = useMaterialReactTable({
    columns,
    data,
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableGrouping: true,
    enableColumnPinning: false,
    enableFacetedValues: true,
    enableRowActions: true,
    enableRowSelection: true,
    getRowId: (row) => row._id,
    initialState: {
      showColumnFilters: true,
      showGlobalFilter: true,
      columnPinning: {
        left: ['mrt-row-expand', 'mrt-row-select'],
        right: ['mrt-row-actions'],
      },
    },
    manualFiltering: false,
    manualPagination: true,
    manualSorting: false,
    muiToolbarAlertBannerProps: isError
      ? {
          color: 'error',
          children: 'Error loading data',
        }
      : undefined,
    // onColumnFiltersChange: setColumnFilters,
    // onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    // onSortingChange: setSorting,
    rowCount,
    state: {
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
    },

    // renderDetailPanel: ({ row }) => (
    //   <CCol>
    //     <CCard>
    //       <CCardBody>
    //         <CCarousel
    //           style={{
    //             width: '500px',
    //             height: '400px',
    //             marginBottom: '30px',
    //           }}
    //           controls
    //           indicators
    //           dark
    //         >
    //           {row.original.slideImages?.map((imageUrl, index) => (
    //             <CCarouselItem
    //               style={{
    //                 width: '500px',
    //                 height: '400px',
    //               }}
    //               key={index}
    //             >
    //               <img
    //                 style={{
    //                   width: '500px',
    //                   height: '400px',
    //                   objectFit: 'cover',
    //                   objectPosition: 'center',
    //                 }}
    //                 src={imageUrl}
    //                 alt="slide 1"
    //               />
    //             </CCarouselItem>
    //           ))}
    //         </CCarousel>

    //         <div
    //           style={{
    //             marginBottom: '15px',
    //           }}
    //         >
    //           <h4>
    //             <b>Description</b>
    //           </h4>
    //         </div>
    //         <div dangerouslySetInnerHTML={{ __html: row.original.description }}></div>
    //         {row.original.isVariantAvailable && (
    //           <>
    //             <div
    //               style={{
    //                 marginBottom: '15px',
    //               }}
    //             >
    //               <h4>
    //                 <b>Variants</b>
    //               </h4>
    //             </div>

    //             <div>
    //               <CCard>
    //                 <CCardBody>
    //                   {row.original.productVariant.map((item) =>
    //                     Object.entries(item).map(([key, value]) => {
    //                       return (
    //                         <p>
    //                           {key}: {value}
    //                         </p>
    //                       )
    //                     }),
    //                   )}
    //                 </CCardBody>
    //               </CCard>
    //             </div>
    //           </>
    //         )}
    //       </CCardBody>
    //     </CCard>
    //   </CCol>
    // ),

    renderRowActionMenuItems: ({ row, closeMenu }) => [
      <MenuItem
        key={0}
        onClick={() => {
          // View profile logic...
          setViewProduct(row)
          closeMenu()
        }}
        sx={{ m: 0 }}
      >
        <CIcon icon={cilFile} />
        <span style={{ marginLeft: '9px' }}>View</span>
      </MenuItem>,
      <MenuItem
        key={0}
        onClick={() => {
          // View profile logic...
          // navigate(`/product/add?id=${row.original._id}`)
          sessionStorage.setItem('productId', row.original._id)
          setUpdateModalVisible(true)
          closeMenu()
        }}
        sx={{ m: 0 }}
      >
        <CIcon icon={cilPen} />
        <span style={{ marginLeft: '9px' }}>Update</span>
      </MenuItem>,
      <MenuItem
        key={1}
        onClick={() => {
          console.log(row)
          // Send email logic...
          setDeleteProductId([row.original._id])
          closeMenu()
        }}
        sx={{ m: 0 }}
      >
        <CIcon icon={cilTrash} />
        <span style={{ marginLeft: '9px' }}>Delete</span>
      </MenuItem>,
    ],
    renderTopToolbar: ({ table }) => {
      const handleDeleted = () => {
        setDeleteProductId(table.getSelectedRowModel().flatRows.map((row) => row.original._id))
      }

      return (
        <Box
          sx={(theme) => ({
            backgroundColor: lighten(theme.palette.background.default, 0.05),
            display: 'flex',
            gap: '0.5rem',
            p: '8px',
            justifyContent: 'space-between',
          })}
        >
          <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {/* import MRT sub-components */}
            <MRT_GlobalFilterTextField table={table} />
            <MRT_ToggleFiltersButton table={table} />
          </Box>
          <Box>
            <Box sx={{ display: 'flex', gap: '0.5rem' }}>
              <Button
                color="error"
                disabled={!(table.getIsSomePageRowsSelected() || table.getIsAllRowsSelected())}
                onClick={handleDeleted}
                variant="contained"
              >
                Delete
              </Button>
            </Box>
          </Box>
        </Box>
      )
    },
  })

  const [viewProduct, setViewProduct] = useState(null)

  const [deleteProductId, setDeleteProductId] = useState(null)
  const [deleteButtonLoading, setDeleteButtonLoading] = useState(false)

  const handleDeleteProudct = async () => {
    try {
      setDeleteButtonLoading(true)
      const response = await axios.post(
        `${process.env.VITE_APP_API_URL}/products/delete`,
        {
          deletableProductIds: deleteProductId,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        },
      )

      toast.success('Product deleted')
      setDeleteProductId(null)

      fetchProductData()
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setDeleteButtonLoading(false)
    }
  }

  const [updateModalVisible, setUpdateModalVisible] = useState(false)

  return (
    <>
      {' '}
      <CRow>
        <CCol>
          <CCard className="mb-4">
            <CCardHeader>List of products</CCardHeader>
            <CCardBody>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MaterialReactTable table={table} />
              </LocalizationProvider>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CModal
        visible={!!deleteProductId && !!deleteProductId.length}
        onClose={() => setDeleteProductId(null)}
        aria-labelledby="LiveDemoExampleLabel"
      >
        <CModalHeader onClose={() => setDeleteProductId(null)}>
          <CModalTitle id="LiveDemoExampleLabel">Are you sure about that?</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <strong>Warning: Permanent Deletion of Product Information</strong>
          <p>
            Deleting this product will permanently remove all associated information from the server
            and erase any related data from the database, including variants.
          </p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteProductId(null)}>
            Close
          </CButton>
          <CButton
            disabled={deleteButtonLoading}
            onClick={handleDeleteProudct}
            color="danger"
            style={{ color: 'white' }}
          >
            {deleteButtonLoading ? <CSpinner size="sm" /> : 'Delete'}
          </CButton>
        </CModalFooter>
      </CModal>
      {updateModalVisible && (
        <UpdateModal
          visible={updateModalVisible}
          setVisible={setUpdateModalVisible}
          fetchProductData={fetchProductData}
        />
      )}
      {!!viewProduct && (
        <ViewProductDetailsModal
          visible={!!viewProduct}
          setVisible={setViewProduct}
          row={viewProduct}
        />
      )}
    </>
  )
}

export default ListProduct
