import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setUserAuthData } from "../slices/authSlice";

const SERVER_URL = `${process.env.EXPO_PUBLIC_API_URL}/`;

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: SERVER_URL }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (user) => ({
        url: `auth/login`,
        method: "POST",
        body: user,
      }),
      onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
        try {
          const response = await queryFulfilled;
          dispatch(setUserAuthData(response.data));
        } catch (error) {
          console.error("-> authApi -> Login -> ", error);
        }
      },
    }),

    signup: builder.mutation({
      query: (user) => ({
        url: `auth/signup`,
        method: "POST",
        body: user,
      }),
      onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
        try {
          const response = await queryFulfilled;
          dispatch(setUserAuthData(response.data));
        } catch (error) {
          console.error("->authApi -> Login -> ", error);
        }
      },
    }),
  }),
});

export const { useLoginMutation, useSignupMutation } = authApi;
