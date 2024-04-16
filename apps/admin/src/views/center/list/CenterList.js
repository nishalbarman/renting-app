import React, { useCallback, useEffect, useMemo, useState } from 'react'
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

import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import CenterModal from './CenterModal'

const ListProduct = () => {
  const { jwtToken } = useSelector((state) => state.auth)

  //data and fetching state
  const [data, setData] = useState([])
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isRefetching, setIsRefetching] = useState(false)
  const [rowCount, setRowCount] = useState(0)

  //table state
  const [columnFilters, setColumnFilters] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState([])
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const fetchData = useCallback(async () => {
    if (!data.length) {
      setIsLoading(true)
    } else {
      setIsRefetching(true)
    }

    const url = new URL(
      '/center/list',
      process.env.NODE_ENV === 'production'
        ? 'https://www.material-react-table.com'
        : 'http://localhost:8000',
    )
    url.searchParams.set('page', `${pagination.pageIndex}`)
    url.searchParams.set('limit', `${pagination.pageSize}`)

    try {
      const res = await axios.get(url.href, {
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
      })
      setData(res.data?.centers || [])
      setRowCount(res.data?.totalDocumentCount || 0)
    } catch (error) {
      setIsError(true)
      console.error(error)
      return
    }
    setIsError(false)
    setIsLoading(false)
    setIsRefetching(false)
  }, [pagination.pageIndex, pagination.pageSize, data])

  //if you want to avoid useEffect, look at the React Query example instead
  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.pageIndex, pagination.pageSize])

  const [approveCenterIds, setApproveCenterId] = useState([])
  const [rejectedCenterId, setRejectCenterId] = useState([])

  const [viewDocuments, setViewDocuments] = useState([])

  const columns = useMemo(
    () => [
      {
        id: 'center_info', //id used to define `group` column
        header: 'Center Information',
        columns: [
          {
            accessorKey: 'centerName', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            header: 'Center Name',
            enableEditing: false,
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
                {/* <img
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
                /> */}
                <span>{renderedCellValue}</span>
              </Box>
            ),
          },
          {
            accessorKey: 'approvedStatus', //id is still required when using accessorFn instead of accessorKey
            header: 'Approved Status',
            id: `_id`,
            enableEditing: false,
            editVariant: 'select',
            editSelectOptions: [
              { value: 'pending', label: 'Pending' },
              { value: 'approved', label: 'Approved' },
              { value: 'reject', label: 'Reject' },
            ],
            muiEditTextFieldProps: ({ row }) => ({
              select: true,
              onChange: (event) => {
                setEditedCenter((prev) => [
                  ...prev,
                  { ...row.original, approvedStatus: event.target.value },
                ])
              },
            }),

            Cell: ({ renderedCellValue, row }) => (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <span
                  style={{
                    textTransform: 'capitalize',
                  }}
                >
                  {renderedCellValue}
                </span>
              </Box>
            ),
          },
        ],
      },

      {
        id: 'user',
        header: 'User Information',
        columns: [
          {
            accessorKey: 'user.name', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            filterVariant: 'autocomplete',
            header: 'Owner Name',
            enableEditing: false,
            size: 300,
            Cell: ({ renderedCellValue, row }) => (
              <Box>
                <span>{renderedCellValue}</span>
              </Box>
            ),
          },
          {
            accessorKey: 'user.email', //hey a simple column for once
            header: 'Owner Email',
            enableEditing: false,
            size: 350,
            Cell: ({ renderedCellValue, cell }) => (
              <Box
                component="span"
                sx={(theme) => ({
                  color: 'black',
                  maxWidth: '9ch',
                  p: '0.25rem',
                })}
              >
                {renderedCellValue}
              </Box>
            ),
          },
          {
            accessorKey: 'user.mobileNo', //hey a simple column for once
            header: 'Mobile No',
            enableEditing: false,
            size: 350,
            Cell: ({ renderedCellValue, cell }) => (
              <Box
                component="span"
                sx={(theme) => ({
                  color: 'black',
                  maxWidth: '9ch',
                  p: '0.25rem',
                })}
              >
                {renderedCellValue}
              </Box>
            ),
          },
        ],
      },

      // {
      //   id: 'pricing',
      //   header: 'Product Pricing',
      //   columns: [
      //     {
      //       accessorKey: 'discountedPrice',
      //       // filterVariant: 'range', //if not using filter modes feature, use this instead of filterFn
      //       filterFn: 'between',
      //       header: 'Discounted Price',
      //       size: 200,
      //       //custom conditional format and styling
      //       Cell: ({ cell }) => <Box component="span">{cell.getValue()}</Box>,
      //     },
      //     {
      //       accessorKey: 'originalPrice',
      //       // filterVariant: 'range', //if not using filter modes feature, use this instead of filterFn
      //       filterFn: 'between',
      //       header: 'Original Price',
      //       size: 200,
      //       //custom conditional format and styling
      //       Cell: ({ cell }) => <Box component="span">{cell.getValue()}</Box>,
      //     },
      //     {
      //       accessorKey: 'rentingPrice',
      //       // filterVariant: 'range', //if not using filter modes feature, use this instead of filterFn
      //       filterFn: 'between',
      //       header: 'Renting Price',
      //       size: 200,
      //       //custom conditional format and styling
      //       Cell: ({ cell }) => <Box component="span">{cell.getValue()}</Box>,
      //     },
      //     {
      //       accessorKey: 'shippingPrice',
      //       // filterVariant: 'range', //if not using filter modes feature, use this instead of filterFn
      //       filterFn: 'between',
      //       header: 'Shipping Price',
      //       size: 200,
      //       //custom conditional format and styling
      //       Cell: ({ cell }) => <Box component="span">{cell.getValue()}</Box>,
      //     },
      //   ],
      // },

      // {
      //   id: 'date',
      //   header: 'Date',
      //   columns: [
      //     {
      //       accessorFn: (row) => new Date(row.createdAt), //convert to Date for sorting and filtering
      //       id: 'createdAt',
      //       header: 'Created Date',
      //       filterVariant: 'date',
      //       filterFn: 'lessThan',
      //       sortingFn: 'datetime',
      //       Cell: ({ cell }) => cell.getValue()?.toLocaleDateString(), //render Date as a string
      //       Header: ({ column }) => <em>{column.columnDef.header}</em>, //custom header markup
      //       muiFilterTextFieldProps: {
      //         sx: {
      //           minWidth: '250px',
      //         },
      //       },
      //     },
      //     {
      //       accessorFn: (row) => new Date(row.createdAt), //convert to Date for sorting and filtering
      //       id: 'updatedAt',
      //       header: 'Updated Date',
      //       filterVariant: 'date',
      //       filterFn: 'lessThan',
      //       sortingFn: 'datetime',
      //       Cell: ({ cell }) => cell.getValue()?.toLocaleDateString(), //render Date as a string
      //       Header: ({ column }) => <em>{column.columnDef.header}</em>, //custom header markup
      //       muiFilterTextFieldProps: {
      //         sx: {
      //           minWidth: '250px',
      //         },
      //       },
      //     },
      //   ],
      // },
    ],
    [],
  )

  const table = useMaterialReactTable({
    columns,
    data,
    editDisplayMode: 'table', // ('modal', 'row', 'cell', and 'custom' are also
    enableEditing: true,
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableGrouping: true,
    // enableColumnPinning: true,
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

    renderDetailPanel: ({ row }) => {
      const center = {
        lat: +row.original.address.latitude,
        lng: +row.original.address.longitude,
      }

      return (
        <CCol>
          <CCard>
            <CCardHeader>Center Address</CCardHeader>
            <CCardBody>
              <div>
                {isLoaded ? (
                  <GoogleMap
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={10}
                    onLoad={(map) => {
                      // This is just an example of getting and using the map instance!!! don't just blindly copy!
                      const bounds = new window.google.maps.LatLngBounds(center)
                      map.fitBounds(bounds)

                      setMap(map)
                    }}
                    onUnmount={(map) => {
                      setMap(null)
                    }}
                  >
                    {/* Child components, such as markers, info windows, etc. */}
                    <Marker position={center} />
                  </GoogleMap>
                ) : (
                  <></>
                )}
              </div>

              <div
                style={{
                  marginTop: '20px',
                  marginBottom: '15px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 7,
                  }}
                >
                  <strong>Street: </strong>
                  <p>
                    {row.original.address.name}, {row.original.address.streetName}
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 7,
                  }}
                >
                  <strong>Locality: </strong>
                  <p>{row.original.address.locality}</p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 7,
                  }}
                >
                  <strong>City: </strong>
                  <p>{row.original.address.city || 'N/A'}</p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 7,
                  }}
                >
                  <strong>strongostal Code: </strong>
                  <p>{row.original.address.postalCode}</p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 7,
                  }}
                >
                  <strong>Country:</strong>
                  <p>{row.original.address.country}</p>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      )
    },
    renderRowActionMenuItems: ({ row, closeMenu }) => [
      <MenuItem
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
        key={0}
        onClick={() => {
          // View profile logic...
          console.log(row.original)
          setViewDocuments([
            { uri: row.original.centerImage },
            { uri: row.original.addressProofImage },
            { uri: row.original.idProofImage },
          ])
          closeMenu()
        }}
        sx={{ m: 0 }}
      >
        <CIcon icon={cilFile} />
        <span style={{ marginLeft: '9px' }}>View Documents</span>
      </MenuItem>,
      <MenuItem
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
        key={1}
        onClick={() => {
          console.log(row)
          // Send email logic...
          setDeleteCenterId([row.original._id])
          closeMenu()
        }}
        sx={{ m: 0 }}
      >
        <CIcon icon={cilTrash} />
        <span style={{ marginLeft: '9px' }}>Delete</span>
      </MenuItem>,
    ],
    renderTopToolbar: ({ table }) => {
      console.log(table.getIsAllRowsSelected())

      const handleTableSelectDelete = () => {
        const centerIds = table.getSelectedRowModel().flatRows.map((row) => row.original._id)
        setDeleteCenterId(centerIds)
      }

      const handleTableSelectApprove = () => {
        const centerIds = table.getSelectedRowModel().flatRows.map((row) => row.original._id)
        setApproveCenterId(centerIds)
      }

      const handleTableSelectReject = () => {
        const centerIds = table.getSelectedRowModel().flatRows.map((row) => row.original._id)
        setRejectCenterId(centerIds)
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
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                color="error"
                disabled={!(table.getIsSomePageRowsSelected() || table.getIsAllRowsSelected())}
                onClick={handleTableSelectDelete}
                variant="contained"
              >
                Delete
              </Button>

              <Button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                color="success"
                disabled={!(table.getIsSomePageRowsSelected() || table.getIsAllRowsSelected())}
                onClick={handleTableSelectApprove}
                variant="contained"
              >
                Approve
              </Button>

              <Button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                color="info"
                disabled={!(table.getIsSomePageRowsSelected() || table.getIsAllRowsSelected())}
                onClick={handleTableSelectReject}
                variant="contained"
              >
                Reject
              </Button>
            </Box>
          </Box>
        </Box>
      )
    },
  })

  const [deleteCenterId, setDeleteCenterId] = useState(null)
  const [deleteButtonLoading, setDeleteButtonLoading] = useState(false)

  const handleDeleteCenter = async () => {
    try {
      setDeleteButtonLoading(true)
      const response = await axios.post(
        `${process.env.VITE_APP_API_URL}/center/delete`,
        { centerIds: deleteCenterId },
        {
          headers: {
            authorization: `Bearer ${jwtToken}`,
          },
        },
      )

      toast.success('Center deleted')
      setDeleteCenterId(null)
      fetchData()
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setDeleteButtonLoading(false)
    }
  }

  const handleApproveCenter = async () => {
    try {
      setDeleteButtonLoading(true)
      const response = await axios.patch(
        `${process.env.VITE_APP_API_URL}/center/update/status`,
        { centerIds: approveCenterIds, approvedStatus: 'approved' },
        {
          headers: {
            authorization: `Bearer ${jwtToken}`,
          },
        },
      )

      toast.success('Center approved.')
      setApproveCenterId(null)
      fetchData()
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setDeleteButtonLoading(false)
    }
  }

  const handleRejectCenter = async () => {
    try {
      setDeleteButtonLoading(true)
      const response = await axios.patch(
        `${process.env.VITE_APP_API_URL}/center/update/status`,
        { centerIds: rejectedCenterId, approvedStatus: 'reject' },
        {
          headers: {
            authorization: `Bearer ${jwtToken}`,
          },
        },
      )

      toast.success('Center rejected.')
      setRejectCenterId(null)
      fetchData()
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setDeleteButtonLoading(false)
    }
  }

  const containerStyle = {
    width: '400px',
    height: '400px',
  }

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyAEWQ-_fgz6IhfsVTAQwSytF9ZbibBX7dU',
  })

  const [map, setMap] = React.useState(null)

  const [imageViewModalVisible, setImageViewModalVisible] = useState(false)

  return (
    <>
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
        visible={!!deleteCenterId && !!deleteCenterId.length}
        onClose={() => setDeleteCenterId(null)}
        aria-labelledby="LiveDemoExampleLabel"
      >
        <CModalHeader onClose={() => setDeleteCenterId(null)}>
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
          <CButton color="secondary" onClick={() => setDeleteCenterId(null)}>
            Close
          </CButton>
          <CButton
            disabled={deleteButtonLoading}
            onClick={handleDeleteCenter}
            color="danger"
            style={{ color: 'white' }}
          >
            {deleteButtonLoading ? <CSpinner size="sm" /> : 'Delete'}
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal
        visible={!!approveCenterIds && !!approveCenterIds.length}
        onClose={() => setApproveCenterId(null)}
        aria-labelledby="LiveDemoExampleLabel"
      >
        <CModalHeader onClose={() => setApproveCenterId(null)}>
          <CModalTitle id="LiveDemoExampleLabel">Are you sure about that?</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>
            By selecting this option, you are confirming approval for the selected center. This
            action will initiate the approval process and update relevant records accordingly.
          </p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setApproveCenterId(null)}>
            Close
          </CButton>
          <CButton
            disabled={deleteButtonLoading}
            onClick={handleApproveCenter}
            color="success"
            style={{ color: 'white' }}
          >
            {deleteButtonLoading ? <CSpinner size="sm" /> : 'Approve'}
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal
        visible={!!rejectedCenterId && !!rejectedCenterId.length}
        onClose={() => setRejectCenterId(null)}
        aria-labelledby="LiveDemoExampleLabel"
      >
        <CModalHeader onClose={() => setRejectCenterId(null)}>
          <CModalTitle id="LiveDemoExampleLabel">Are you sure about that?</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>
            Proceeding with this option will result in the rejection of the selected center(s),
            particularly if multiple centers are chosen.
          </p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setRejectCenterId(null)}>
            Close
          </CButton>
          <CButton
            disabled={deleteButtonLoading}
            onClick={handleRejectCenter}
            color="info"
            style={{ color: 'white' }}
          >
            {deleteButtonLoading ? <CSpinner size="sm" /> : 'Reject'}
          </CButton>
        </CModalFooter>
      </CModal>

      {!!viewDocuments && !!viewDocuments.length && (
        <CenterModal
          visible={!!viewDocuments.length}
          viewDocuments={viewDocuments}
          setViewDocuments={setViewDocuments}
        />
      )}
    </>
  )
}

export default ListProduct
