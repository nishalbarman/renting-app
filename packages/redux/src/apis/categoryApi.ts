import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const SERVER_URL = `${process.env.EXPO_PUBLIC_API_URL}/`;
console.log(SERVER_URL);

export const categoryApi = createApi({
  reducerPath: "categoryApi",
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
  endpoints: (builder) => ({
    getAllCategory: builder.query({
      query: () => ({
        url: "category",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAllCategoryQuery } = categoryApi;
