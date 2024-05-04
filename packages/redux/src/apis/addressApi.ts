import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const SERVER_URL = `${process.env.EXPO_PUBLIC_API_URL}/`;

type location = {
  type: string;
  coordinates: [number, number]; // Array of [longitude, latitude]
};

type Address = {
  _id: string;
  user: string;
  prefix: string;
  locality: string;
  postalCode: string;
  country: string;
  streetName: string;
  city: string;
  state: string;
  longitude: number;
  latitude: number;
  location: location;
  createdAt: string;
  updatedAt: string;
};

export const addressApi = createApi({
  reducerPath: "addressApi",
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
    getAddress: builder.query<Address, any>({
      query: () => ({
        url: `address`,
        method: "GET",
      }),
      providesTags: ["Address"],
      transformResponse: (response: any, meta) => response.data,
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
      query: (id) => ({
        url: `address/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Address"],
      // transformErrorResponse: (response, meta, arg) => response.message,
    }),

    updateAddress: builder.mutation({
      query: ({ id, updatedAddress }) => ({
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
