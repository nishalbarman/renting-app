import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const SERVER_URL = `${process.env.EXPO_PUBLIC_API_URL}/`;

export const productsApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: SERVER_URL,
    prepareHeaders: (headers, { getState }) => {
      headers.set("authorization", `Bearer ${getState().auth.jwtToken}`);
      return headers;
    },
  }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: (parameters = null) => {
        const queryObject = {
          url: `products`,
          method: "GET",
        };

        if (!!parameters) {
          queryObject.url = `products?`;
          Object.keys(parameters).forEach(
            (key) => (url += `${key}=${parameters[key]}&`)
          );
          return queryObject;
        }

        return queryObject;
      },
      providesTags: ["Product"],
      transformResponse: (response, meta, arg) => response.data,
      // transformErrorResponse: (response, meta, arg) => response.message,
    }),

    getOneProduct: builder.query({
      query: ({ _id }) => ({
        url: `products/${_id}`,
        method: "GET",
      }),
      // transformErrorResponse: (response, meta, arg) => response.message,
    }),

    addProduct: builder.mutation({
      query: ({ product }) => ({
        url: `products`,
        method: "POST",
        body: product,
      }),
      invalidatesTags: ["Product"],
      // transformErrorResponse: (response, meta, arg) => response.message,
    }),

    deleteProduct: builder.mutation({
      query: ({ _id }) => ({
        url: `products/${_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
      // transformErrorResponse: (response, meta, arg) => response.message,
    }),

    updateProduct: builder.mutation({
      query: ({ _id, updatedProduct }) => ({
        url: `products/${_id}`,
        method: "PATCH",
        body: updatedProduct,
      }),
      invalidatesTags: ["Product"],
      // transformErrorResponse: (response, meta, arg) => response.message,
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetOneProductQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
