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
      query: ({
        variant = undefined,
        productId,
        rentDays = undefined,
        productType = "rent",
        quantity = 1,
      }) => ({
        url: `cart`,
        method: "POST",
        body: {
          productId: productId,
          variant: variant,
          quantity: quantity,
          rentDays: rentDays,
          productType: productType,
        },
      }),
      invalidatesTags: ["Cart"],
      // transformErrorResponse: (res, meta, arg) => res.message,
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

    updateRentDaysCart: builder.mutation({
      query: ({ id, productType, rentDays }) => {
        return {
          url: `cart/${productType}?cart=${id}`,
          method: "PATCH",
          body: {
            rentDays: rentDays,
          },
        };
      },
      invalidatesTags: ["Cart"],
      transformErrorResponse: (res, meta, arg) => res.message,
    }),

    updateQuantityCart: builder.mutation({
      query: ({ id, productType, quantity }) => {
        return {
          url: `cart/${productType}?cart=${id}`,
          method: "PATCH",
          body: {
            quantity: quantity,
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
      // transformErrorResponse: (res, meta, arg) => res.message,
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddOneToCartMutation,
  useDeleteCartMutation,
  useUpdateCartMutation,
  useUpdateRentDaysCartMutation,
  useUpdateQuantityCartMutation,
} = cartApi;
