import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";

const SERVER_URL = process.env.SERVER_URL || "http://localhost:8000/";

const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({ baseUrl: SERVER_URL }),
  endpoints: (builder) => ({
    getAllCategory: builder.query({
      query: () => ({
        url: "category",
        method: "GET",
        Authorization: `Bearer ${getState().auth.jwtToken}`,
      }),
    }),
  }),
});
