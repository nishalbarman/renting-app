import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const SERVER_URL = process.env.SERVER_URL || "http://127.0.0.1:8000/";

export const addressApi = createApi({
  reducerPath: "addressApi",
  baseQuery: fetchBaseQuery({
    baseUrl: SERVER_URL,
    prepareHeaders: (headers, { getState }) => {
      headers.set("authorization", `Bearer ${getState().auth.jwtToken}`);
      return headers;
    },
  }),
  tagTypes: ["Address"],
  endpoints: (builder) => ({
    getAddress: builder.query({
      query: () => ({
        url: `address`,
        method: "GET",
      }),
      providesTags: ["Address"],
      transformResponse: (response, meta, arg) => response.data,
      // transformErrorResponse: (response, meta, arg) => response.message,
    }),

    addAddress: builder.mutation({
      query: ({ address }) => ({
        url: `address`,
        method: "POST",
        body: address,
      }),
      invalidatesTags: ["Address"],
      // transformErrorResponse: (response, meta, arg) => response.message,
    }),

    deleteAddress: builder.mutation({
      query: ({ id }) => ({
        url: `address/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Address"],
      // transformErrorResponse: (response, meta, arg) => response.message,
    }),

    updateAddress: builder.mutation({
      query: (id, updatedAddress) => ({
        url: `address/${id}`,
        method: "PATCH",
        body: updatedAddress,
      }),
      invalidatesTags: ["Address"],
      // transformErrorResponse: (response, meta, arg) => response.message,
    }),
  }),
});

export const {
  useGetAddressQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = addressApi;
