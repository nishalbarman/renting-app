import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const SERVER_URL = "http://192.168.79.210:8000/";

export const wishlistApi = createApi({
  reducerPath: "wishlistApi",
  baseQuery: fetchBaseQuery({
    baseUrl: SERVER_URL,
    prepareHeaders: (headers, { getState }) => {
      headers.set("authorization", `Bearer ${getState().auth.jwtToken}`);
      return headers;
    },
  }),
  tagTypes: ["Wishlist"],
  endpoints: (builder) => ({
    getWishlist: builder.query({
      query: () => ({
        url: `wishlist`,
        method: "GET",
      }),
      providesTags: ["Wishlist"],
      transformResponse: (response, meta, arg) => response.data,
      // transformErrorResponse: (response, meta, arg) => response.message,
    }),

    addWishlist: builder.mutation({
      query: ({ id }) => ({
        url: `wishlist`,
        method: "POST",
        body: { productId: id },
      }),
      invalidatesTags: ["Wishlist"],
      // transformErrorResponse: (response, meta, arg) => response.message,
    }),

    deleteWishlist: builder.mutation({
      query: ({ _id }) => ({
        url: `wishlist/${_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
      // transformErrorResponse: (response, meta, arg) => response.message,
    }),

    updateWishlist: builder.mutation({
      query: (id, item) => ({
        url: `wishlist/${id}`,
        method: "PATCH",
        body: item,
      }),
      invalidatesTags: ["Wishlist"],
      // transformErrorResponse: (response, meta, arg) => response.message,
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useAddWishlistMutation,
  useUpdateWishlistMutation,
  useDeleteWishlistMutation,
} = wishlistApi;
