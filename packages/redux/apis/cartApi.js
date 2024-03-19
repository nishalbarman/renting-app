import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const SERVER_URL = `${process.env.EXPO_PUBLIC_API_URL}/`;

export const cartApi = createApi({
  reducerPath: "cart",
  baseQuery: fetchBaseQuery({
    baseUrl: SERVER_URL,
    prepareHeaders: (headers, { getState }) => {
      headers.set("authorization", `Bearer ${getState().auth.jwtToken}`);
      return headers;
    },
  }),
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    getCart: builder.query({
      query: (productType) => `cart?productType=${productType}`,
      providesTags: ["Cart"],
      transformResponse: (res, meta, arg) => res.data,
      transformErrorResponse: (res, meta, arg) => res.message,
    }),

    addOneToCart: builder.mutation({
      query: (productId) => ({
        url: `cart`,
        method: "POST",
        body: {
          productId: productId,
        },
      }),
      invalidatesTags: ["Cart"],
      transformErrorResponse: (res, meta, arg) => res.message,
    }),

    updateCart: builder.mutation({
      query: ({ id, updatedItem }) => {
        return {
          url: `cart/${id}`,
          method: "PATCH",
          body: updatedItem,
          headers: {
            Authorization: ` Bearer ${getState().auth.jwtToken}`,
          },
        };
      },
      invalidatesTags: ["Cart"],
      transformErrorResponse: (res, meta, arg) => res.message,
    }),

    deleteCart: builder.mutation({
      query: (id) => ({
        url: `cart/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
      transformErrorResponse: (res, meta, arg) => res.message,
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddOneToCartMutation,
  useDeleteCartMutation,
  useUpdateCartMutation,
} = cartApi;
