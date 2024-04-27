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

import ViewOrderDetails from './ViewOrderDetails'

import { attachComma } from '../../../../helper/utils'

const OrderList = () => {
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

  console.log(data)

  const fetchOrderData = async () => {
    if (!data.length) {
      setIsLoading(true)
    } else {
      setIsRefetching(true)
    }

    const url = new URL('/orders/list', process.env.VITE_APP_API_URL)

    url.searchParams.set('page', `${pagination.pageIndex}`)
    url.searchParams.set('limit', `${pagination.pageSize}`)

    try {
      const res = await axios.get(url.href, {
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
      })

      console.log(res.data?.groupedOrders)

      setData(res.data?.groupedOrders || [])
      setRowCount(res.data?.globalTotalDocumentCount || 0)
    } catch (error) {
      setIsError(true)
      console.error(error)
    }
    setIsError(false)
    setIsLoading(false)
    setIsRefetching(false)
  }

  //if you want to avoid useEffect, look at the React Query example instead
  useEffect(() => {
    fetchOrderData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.pageIndex, pagination.pageSize])

  const columns = useMemo(
    () => [
      {
        id: 'payment_info',
        header: 'Payment Info',
        columns: [
          {
            header: 'Gateway Transaction ID',
            accessorKey: 'paymentTransactionId',
            enableClickToCopy: true,
            size: 200,
            //custom conditional format and styling
            Cell: ({ renderedCellValue, cell }) => (
              <Box component="span">{renderedCellValue || 'Not Applicable'}</Box>
            ),
          },
          {
            header: 'Total Price',
            accessorKey: 'totalPrice',
            size: 200,
            //custom conditional format and styling
            Cell: ({ renderedCellValue, cell }) => (
              <Box component="span">
                <strong>{attachComma(+renderedCellValue)}</strong>
              </Box>
            ),
          },
        ],
      },

      {
        id: 'order_info',
        header: 'Order Info',
        columns: [
          {
            header: 'Order Group ID',
            accessorKey: 'orderGroupID',
            size: 200,
            //custom conditional format and styling
            Cell: ({ renderedCellValue, cell }) => <Box component="span">{renderedCellValue}</Box>,
          },
          {
            header: 'Order Count',
            accessorKey: 'totalDocumentCount',
            size: 200,
            //custom conditional format and styling
            Cell: ({ renderedCellValue, cell }) => (
              <Box component="span">
                <strong>{renderedCellValue}</strong>
              </Box>
            ),
          },
          // {
          //   header: 'Order Type',
          //   accessorKey: 'orderType',
          //   size: 200,
          //   //custom conditional format and styling
          //   Cell: ({ renderedCellValue, cell }) => (
          //     <Box component="span">
          //       <strong>{renderedCellValue}</strong>
          //     </Box>
          //   ),
          // },

          {
            accessorFn: (row) => `${row.orderType}`,
            // accessorKey: 'category', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            filterVariant: 'autocomplete',
            header: 'Order Type',
            size: 300,
            Cell: ({ renderedCellValue, row }) => (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  // alignItems: 'center',
                  gap: '5px',
                }}
              >
                <div>
                  <span>
                    <b>{renderedCellValue === 'buy' ? 'Bought' : 'Rented'}</b>
                  </span>
                </div>
                {row.original.paymentTxnId && (
                  <div
                    style={{
                      fontSize: '12px',
                    }}
                  >
                    <span>Txn ID: {row.original.paymentTxnId}</span>
                  </div>
                )}
              </Box>
            ),
          },
        ],
      },

      {
        id: 'Date', //id used to define `group` column
        header: 'Date',
        columns: [
          {
            accessorKey: 'createdAt', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            header: 'Order Date',
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
                {renderedCellValue?.toLocaleString()}
              </Box>
            ),
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

    muiTableBodyRowProps: ({ row, table }) => {
      console.log(row)
      return {
        sx: {
          backgroundColor: row.original.orderType === 'rent' ? '#ffd7d4' : '#f0fff0',
        },
      }
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
          setViewOrder(row)
          closeMenu()
        }}
        sx={{ m: 0 }}
      >
        <CIcon icon={cilFile} />
        <span style={{ marginLeft: '9px' }}>View Order</span>
      </MenuItem>,
      // <MenuItem
      //   key={0}
      //   onClick={() => {
      //     // View profile logic...
      //     // navigate(`/product/add?id=${row.original._id}`)
      //     sessionStorage.setItem('productId', row.original._id)
      //     setUpdateModalVisible(true)
      //     closeMenu()
      //   }}
      //   sx={{ m: 0 }}
      // >
      //   <CIcon icon={cilPen} />
      //   <span style={{ marginLeft: '9px' }}>Update</span>
      // </MenuItem>,
      // <MenuItem
      //   key={1}
      //   onClick={() => {
      //     console.log(row)
      //     // Send email logic...
      //     setDeleteProductId([row.original._id])
      //     closeMenu()
      //   }}
      //   sx={{ m: 0 }}
      // >
      //   <CIcon icon={cilTrash} />
      //   <span style={{ marginLeft: '9px' }}>Delete</span>
      // </MenuItem>,
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

  const [viewOrder, setViewOrder] = useState(null)

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

      fetchOrderData()
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
            <CCardHeader>List of orders</CCardHeader>
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
      {!!viewOrder && (
        <ViewOrderDetails visible={!!viewOrder} setVisible={setViewOrder} row={viewOrder} />
      )}
    </>
  )
}

export default OrderList
