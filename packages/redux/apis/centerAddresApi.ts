import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const SERVER_URL = `${process.env.EXPO_PUBLIC_API_URL}/`;

export const centerAddressApi = createApi({
  reducerPath: "centerAddressApi",
  baseQuery: fetchBaseQuery({
    baseUrl: SERVER_URL,
    prepareHeaders: (headers, { getState }) => {
      headers.set(
        "authorization",
        `Bearer ${(getState() as any).auth.jwtToken}`
      );
      return headers;
    },
  }),
  tagTypes: ["Address"],
  endpoints: (builder) => ({
    getCenterAddress: builder.query({
      query: () => ({
        url: `address`,
        method: "GET",
      }),
      providesTags: ["Address"],
      transformResponse: (response, meta, arg) => (response as any).data,
      // transformErrorResponse: (response, meta, arg) => response.message,
    }),

    addCenterAddress: builder.mutation({
      query: ({ address }) => ({
        url: `address`,
        method: "POST",
        body: address,
      }),
      invalidatesTags: ["Address"],
      // transformErrorResponse: (response, meta, arg) => response.message,
    }),

    deleteCenterAddress: builder.mutation({
      query: (id) => ({
        url: `address/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Address"],
      // transformErrorResponse: (response, meta, arg) => response.message,
    }),

    updateCenterAddress: builder.mutation({
      query: ({ id, updatedAddress }: { id: string; updatedAddress: any }) => ({
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
  useGetCenterAddressQuery,
  useAddCenterAddressMutation,
  useUpdateCenterAddressMutation,
  useDeleteCenterAddressMutation,
} = centerAddressApi;
