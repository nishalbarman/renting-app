import { useCallback, useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
  MRT_ColumnDef,
} from "material-react-table";
import { Box, Button, MenuItem, lighten } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

import { ClipLoader } from "react-spinners";
import CenterModal from "./CenterModal";
import ConfirmModal from "../ConfirmModal";
import { useAppSelector } from "@store/rtk";
import { Center } from "../../types";

type DocViewType = { uri: any };

const ListProduct = () => {
  const { jwtToken } = useAppSelector((state) => state.auth);

  //data and fetching state
  const [data, setData] = useState<Center[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);

  //table state
  // const [columnFilters, setColumnFilters] = useState([]);
  // const [globalFilter, setGlobalFilter] = useState("");
  // const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const fetchData = useCallback(async () => {
    if (!data.length) {
      setIsLoading(true);
    } else {
      setIsRefetching(true);
    }

    const url = new URL("/center/list", process.env.VITE_APP_API_URL);
    url.searchParams.set("page", `${pagination.pageIndex}`);
    url.searchParams.set("limit", `${pagination.pageSize}`);

    try {
      const res = await axios.get(url.href, {
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
      });
      setData(res.data?.centers || []);
      setRowCount(res.data?.totalDocumentCount || 0);
    } catch (error) {
      setIsError(true);
      console.error(error);
      return;
    }
    setIsError(false);
    setIsLoading(false);
    setIsRefetching(false);
  }, [pagination.pageIndex, pagination.pageSize, data]);

  //if you want to avoid useEffect, look at the React Query example instead
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.pageIndex, pagination.pageSize]);

  const [approveCenterIds, setApproveCenterId] = useState<string[]>([]);
  const [rejectedCenterId, setRejectCenterId] = useState<string[]>([]);

  const [viewDocuments, setViewDocuments] = useState<DocViewType[]>([]);

  const columns = useMemo<MRT_ColumnDef<Center>[]>(
    () => [
      {
        id: "center_info", //id used to define `group` column
        header: "Center Information",
        columns: [
          {
            accessorKey: "centerName", //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            header: "Center Name",
            enableEditing: false,
            size: 50,
            enableColumnFilter: false,
            enableColumnFilterModes: false,
            enableFilters: false,
            Cell: ({ renderedCellValue }) => (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}>
                <span>{renderedCellValue}</span>
              </Box>
            ),
          },
          {
            accessorKey: "approvedStatus", //id is still required when using accessorFn instead of accessorKey
            header: "Approved Status",
            id: `_id`,
            enableEditing: false,
            editVariant: "select",
            editSelectOptions: [
              { value: "pending", label: "Pending" },
              { value: "approved", label: "Approved" },
              { value: "reject", label: "Reject" },
            ],
            // muiEditTextFieldProps: ({ row }) => ({
            //   select: true,
            //   onChange: (event) => {
            //     setEditedCenter((prev) => [
            //       ...prev,
            //       { ...row.original, approvedStatus: event.target.value },
            //     ]);
            //   },
            // }),

            Cell: ({ renderedCellValue }) => (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}>
                <span
                  style={{
                    textTransform: "capitalize",
                  }}>
                  {renderedCellValue}
                </span>
              </Box>
            ),
          },
        ],
      },

      {
        id: "user",
        header: "User Information",
        columns: [
          {
            accessorKey: "user.name", //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            filterVariant: "autocomplete",
            header: "Owner Name",
            enableEditing: false,
            size: 300,
            Cell: ({ renderedCellValue }) => (
              <Box>
                <span>{renderedCellValue}</span>
              </Box>
            ),
          },
          {
            accessorKey: "user.email", //hey a simple column for once
            header: "Owner Email",
            enableEditing: false,
            size: 350,
            Cell: ({ renderedCellValue }) => (
              <Box
                component="span"
                sx={() => ({
                  color: "black",
                  maxWidth: "9ch",
                  p: "0.25rem",
                })}>
                {renderedCellValue}
              </Box>
            ),
          },
          {
            accessorKey: "user.mobileNo", //hey a simple column for once
            header: "Mobile No",
            enableEditing: false,
            size: 350,
            Cell: ({ renderedCellValue }) => (
              <Box
                component="span"
                sx={() => ({
                  color: "black",
                  maxWidth: "9ch",
                  p: "0.25rem",
                })}>
                {renderedCellValue}
              </Box>
            ),
          },
        ],
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
    editDisplayMode: "table", // ('modal', 'row', 'cell', and 'custom' are also
    enableEditing: true,
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableGrouping: true,
    // enableColumnPinning: true,
    enableFacetedValues: true,
    enableRowActions: true,
    enableRowSelection: true,
    getRowId: (row) => row._id as string,
    initialState: {
      showColumnFilters: true,
      showGlobalFilter: true,
      columnPinning: {
        left: ["mrt-row-expand", "mrt-row-select"],
        right: ["mrt-row-actions"],
      },
    },
    manualFiltering: false,
    manualPagination: true,
    manualSorting: false,
    muiToolbarAlertBannerProps: isError
      ? {
          color: "error",
          children: "Error loading data",
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
      if (
        row.original.address === undefined ||
        row.original.address.latitude === undefined ||
        row.original.address.longitude === undefined
      ) {
        return;
      }

      const center = {
        lat: +row.original.address.latitude,
        lng: +row.original.address.longitude,
      };

      return (
        <div>
          <div>
            <div>Center Address</div>
            <div>
              <div>
                {isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={10}
                    onLoad={(map) => {
                      // This is just an example of getting and using the map instance!!! don't just blindly copy!
                      const bounds = new window.google.maps.LatLngBounds(
                        center
                      );
                      map.fitBounds(bounds);

                      // setMap(map);
                    }}
                    onUnmount={(_) => {
                      // setMap(null);
                    }}>
                    {/* Child components, such as markers, info windows, etc. */}
                    <Marker position={center} />
                  </GoogleMap>
                ) : (
                  <></>
                )}
              </div>

              <div
                style={{
                  marginTop: "20px",
                  marginBottom: "15px",
                }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 7,
                  }}>
                  <strong>Street: </strong>
                  <p>
                    {row.original.address.prefix},{" "}
                    {row.original.address.streetName}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 7,
                  }}>
                  <strong>Locality: </strong>
                  <p>{row.original.address.locality}</p>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 7,
                  }}>
                  <strong>City: </strong>
                  <p>{row.original.address.city || "N/A"}</p>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 7,
                  }}>
                  <strong>strongostal Code: </strong>
                  <p>{row.original.address.postalCode}</p>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 7,
                  }}>
                  <strong>Country:</strong>
                  <p>{row.original.address.country}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    },
    renderRowActionMenuItems: ({ row, closeMenu }) => [
      <MenuItem
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
        key={0}
        onClick={() => {
          // View profile logic...
          console.log(row.original);
          setViewDocuments([
            { uri: row.original.centerImage },
            { uri: row.original.addressProofImage },
            { uri: row.original.idProofImage },
          ]);
          closeMenu();
        }}
        sx={{ m: 0 }}>
        {/* <CIcon icon={cilFile} /> */}
        <span style={{ marginLeft: "9px" }}>View</span>
      </MenuItem>,
      <MenuItem
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
        key={1}
        onClick={() => {
          console.log(row);
          // Send email logic...
          setDeleteCenterId([row.original._id as string]);
          closeMenu();
        }}
        sx={{ m: 0 }}>
        {/* <CIcon icon={cilTrash} /> */}
        <span style={{ marginLeft: "9px" }}>Delete</span>
      </MenuItem>,
    ],
    renderTopToolbar: ({ table }) => {
      console.log(table.getIsAllRowsSelected());

      const handleTableSelectDelete = () => {
        const centerIds = table
          .getSelectedRowModel()
          .flatRows.map((row) => row.original._id);
        setDeleteCenterId(centerIds as string[]);
      };

      const handleTableSelectApprove = () => {
        const centerIds = table
          .getSelectedRowModel()
          .flatRows.map((row) => row.original._id as string);
        setApproveCenterId(centerIds);
      };

      const handleTableSelectReject = () => {
        const centerIds = table
          .getSelectedRowModel()
          .flatRows.map((row) => row.original._id as string);
        setRejectCenterId(centerIds);
      };

      return (
        <Box
          sx={(theme) => ({
            backgroundColor: lighten(theme.palette.background.default, 0.05),
            display: "flex",
            gap: "0.5rem",
            p: "8px",
            justifyContent: "space-between",
          })}>
          <Box sx={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            {/* import MRT sub-components */}
            <MRT_GlobalFilterTextField table={table} />
            <MRT_ToggleFiltersButton table={table} />
          </Box>
          <Box>
            <Box sx={{ display: "flex", gap: "0.5rem" }}>
              <Button
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                color="error"
                disabled={
                  !(
                    table.getIsSomePageRowsSelected() ||
                    table.getIsAllRowsSelected()
                  )
                }
                onClick={handleTableSelectDelete}
                variant="contained">
                Delete
              </Button>

              <Button
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                color="success"
                disabled={
                  !(
                    table.getIsSomePageRowsSelected() ||
                    table.getIsAllRowsSelected()
                  )
                }
                onClick={handleTableSelectApprove}
                variant="contained">
                Approve
              </Button>

              <Button
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                color="info"
                disabled={
                  !(
                    table.getIsSomePageRowsSelected() ||
                    table.getIsAllRowsSelected()
                  )
                }
                onClick={handleTableSelectReject}
                variant="contained">
                Reject
              </Button>
            </Box>
          </Box>
        </Box>
      );
    },
  });

  const [deleteCenterId, setDeleteCenterId] = useState<string[] | null>(null);
  const [deleteButtonLoading, setDeleteButtonLoading] = useState(false);

  const handleDeleteCenter = async () => {
    try {
      setDeleteButtonLoading(true);
      const response = await axios.post(
        `${process.env.VITE_APP_API_URL}/center/delete`,
        { centerIds: deleteCenterId },
        {
          headers: {
            authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      console.log(response);

      toast.success("Center deleted");
      setDeleteCenterId(null);
      fetchData();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setDeleteButtonLoading(false);
    }
  };

  const handleApproveCenter = async () => {
    try {
      setDeleteButtonLoading(true);
      const response = await axios.patch(
        `${process.env.VITE_APP_API_URL}/center/update/status`,
        { centerIds: approveCenterIds, approvedStatus: "approved" },
        {
          headers: {
            authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      console.log(response);

      toast.success("Center approved.");
      setApproveCenterId([]);
      fetchData();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setDeleteButtonLoading(false);
    }
  };

  const handleRejectCenter = async () => {
    try {
      setDeleteButtonLoading(true);
      const response = await axios.patch(
        `${process.env.VITE_APP_API_URL}/center/update/status`,
        { centerIds: rejectedCenterId, approvedStatus: "reject" },
        {
          headers: {
            authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      console.log(response);

      toast.success("Center rejected.");
      setRejectCenterId([]);
      fetchData();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setDeleteButtonLoading(false);
    }
  };

  const containerStyle = {
    width: "400px",
    height: "400px",
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyAEWQ-_fgz6IhfsVTAQwSytF9ZbibBX7dU",
  });

  // const [map, setMap] = React.useState<google.maps.Map | null>(null);

  // const [imageViewModalVisible, setImageViewModalVisible] = useState(false);

  return (
    <div className="flex flex-col flex-1 p-3 md:p-6 bg-gray-100 ml-64 max-md:ml-0">
      <div className="grid grid-cols-1 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Center</h1>
          {/* <div>
          <input
            type="text"
            placeholder="Type anywhere to search"
            className="px-4 py-2 border border-gray-300 rounded-md"
          />
        </div> */}
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              List of centers
            </h2>
          </div>
          <div>
            <MaterialReactTable table={table} />
          </div>
        </div>
      </div>

      {!!deleteCenterId && !!deleteCenterId.length && (
        <ConfirmModal
          title={"Are you sure about that?"}
          closeModal={() => setDeleteCenterId(null)}>
          <>
            <div className="w-full">
              <strong className="text-red-400">
                Warning: Permanent Deletion of Center Information
              </strong>
              <p>
                Deleting this center will permanently remove all associated
                information from the server and erase any related data from the
                database, including owner information.
              </p>
            </div>
            <div className="border-t mt-3 pt-3">
              <button
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 bg-red-400 hover:bg-red-500"
                disabled={deleteButtonLoading}
                onClick={handleDeleteCenter}>
                {deleteButtonLoading ? (
                  <ClipLoader color="#36d7b7" />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </>
        </ConfirmModal>
      )}

      {!!approveCenterIds && !!approveCenterIds.length && (
        <ConfirmModal
          title={"Are you sure about that?"}
          closeModal={() => setApproveCenterId([])}>
          <>
            <div className="w-full">
              <p>
                By selecting this option, you are confirming approval for the
                selected center. This action will initiate the approval process
                and update relevant records accordingly.
              </p>
            </div>
            <div className="border-t mt-3 pt-3">
              <button
                className="inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 bg-green-400 hover:bg-green-500"
                disabled={deleteButtonLoading}
                onClick={handleApproveCenter}>
                {deleteButtonLoading ? (
                  <ClipLoader color="white" size={10} />
                ) : (
                  "Approve"
                )}
              </button>
            </div>
          </>
        </ConfirmModal>
      )}

      {!!rejectedCenterId && !!rejectedCenterId.length && (
        <ConfirmModal
          title={"Are you sure about that?"}
          closeModal={() => setRejectCenterId([])}>
          <>
            <div className="w-full">
              <p>
                Proceeding with this option will result in the rejection of the
                selected center(s), particularly if multiple centers are chosen.
              </p>
            </div>
            <div className="border-t mt-3 pt-3">
              <button
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 bg-indigo-400 hover:bg-indigo-500"
                disabled={deleteButtonLoading}
                onClick={handleRejectCenter}>
                {deleteButtonLoading ? (
                  <ClipLoader color="white" size={10} />
                ) : (
                  "Reject"
                )}
              </button>
            </div>
          </>
        </ConfirmModal>
      )}

      {!!viewDocuments && !!viewDocuments.length && (
        <CenterModal
          visible={!!viewDocuments.length}
          viewDocuments={viewDocuments}
          setViewDocuments={setViewDocuments}
        />
      )}
    </div>
  );
};

export default ListProduct;
