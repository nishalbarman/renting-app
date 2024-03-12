import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const SERVER_URL = process.env.SERVER_URL || "http://localhost:8000/";

export const wishlistApi = createApi({
  reducerPath: "wishlistApi",
  baseQuery: fetchBaseQuery({
    baseUrl: SERVER_URL,
  }),
  // tagTypes: ["Wishlist"],
  endpoints: (builder) => ({
    getWishlist: builder.query({
      query: () => "wishlist",
      providesTags: ["Wishlist"],
      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.message,
    }),

    addWishlist: builder.mutation({
      query: (id) => ({
        url: `wishlist`,
        method: "POST",
        body: {
          productId: id,
        },
        headers: {
          Authorization: ` Bearer ${getState().auth.jwtToken}`,
        },
      }),
      invalidatesTags: ["Wishlist"],
      transformErrorResponse: (response, meta, arg) => response.message,
    }),

    deleteWishlist: builder.mutation({
      query: (id) => ({
        url: `wishlist/${id}`,
        method: "DELETE",
        headers: {
          Authorization: ` Bearer ${getState().auth.jwtToken}`,
        },
      }),
      invalidatesTags: ["Wishlist"],
      transformErrorResponse: (response, meta, arg) => response.message,
    }),

    updateWishlist: builder.mutation({
      query: (id, item) => ({
        url: `wishlist/${id}`,
        method: "PATCH",
        body: item,
      }),
      headers: {
        Authorization: ` Bearer ${getState().auth.jwtToken}`,
      },
      invalidatesTags: ["Wishlist"],
      transformErrorResponse: (response, meta, arg) => response.message,
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useAddWishlistMutation,
  useUpdateWishlistMutation,
  useDeleteWishlistMutation,
} = wishlistApi;
