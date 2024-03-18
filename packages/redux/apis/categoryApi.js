import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const SERVER_URL = "http://192.168.147.210:8000/";
console.log(SERVER_URL);

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: SERVER_URL,
    prepareHeaders: (headers, { getState }) => {
      headers.set("authorization", `Bearer ${getState().auth.jwtToken}`);
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
