import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setUserAuthData } from "../slices/authSlice";

const SERVER_URL = "http://192.168.147.210:8000/";

export const userAPI = createApi({
  reducerPath: "user",
  baseQuery: fetchBaseQuery({
    baseUrl: SERVER_URL,
    prepareHeaders: (headers, { getState }) => {
      headers.set("authorization", `Bearer ${getState().auth.jwtToken}`);
      return headers;
    },
  }),
  tagTypes: ["Post"],
  endpoints: (builder) => ({
    /** REQUIRED ADMIN ROLE **/
    getAllUser: builder.query({
      query: () => ({
        url: `user`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState()?.auth?.jwtToken}`,
        },
      }),
      onQueryStarted: async (args, { dispatch, queryFulfilled, getState }) => {
        try {
          const response = await queryFulfilled;
          dispatch(setUserAuthData(response.data));
        } catch (error) {
          console.error("Get User --->", error);
        }
      },
    }),

    /** REQUIRED ADMIN ROLE **/
    getOneUser: builder.query({
      query: (id) => ({
        url: `${id}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState()?.auth?.jwtToken}`,
        },
      }),
      onQueryStarted: async (args, { dispatch, queryFulfilled, getState }) => {
        try {
          const response = await queryFulfilled;
          dispatch(setUserAuthData(response.data));
        } catch (error) {
          console.error("Get User --->", error);
        }
      },
    }),

    /* UPDATES LOGGED IN USERS DATA, ID GETS RETRIEVED FROM JWT TOKEN WHILE UPDATING */
    updateUserEmail: builder.mutation({
      query: ({ newEmail, prevEmailOTP, newEmailOTP }) => ({
        url: "update_email",
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState()?.auth?.jwtToken}`, // we will get the getState in the onQueryStarted
        },
        body: { email: newEmail, prevEmailOTP, newEmailOTP },
      }),
      onQueryStarted: async (args, { dispatch, getState, queryFulfilled }) => {
        try {
          const response = await queryFulfilled;
          dispatch(setUserAuthData(response.data));
        } catch (error) {
          console.error("Update user Email -->> ", error);
        }
      },
    }),

    /* UPDATES LOGGED IN USERS DATA, ID GETS RETRIEVED FROM JWT TOKEN WHILE UPDATING */
    updateUserMobile: builder.mutation({
      query: ({ newMobileNo, prevMobileOTP, newMobileOTP }) => ({
        url: "update_mobile",
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState()?.auth?.jwtToken}`, // we will get the getState in the onQueryStarted
        },
        body: { id, mobileNo: newMobileNo, prevMobileOTP, newMobileOTP },
      }),
      onQueryStarted: async (args, { dispatch, getState, queryFulfilled }) => {
        try {
          const response = await queryFulfilled;
          dispatch(setUserAuthData(response.data));
        } catch (error) {
          console.error("Update user Email -->> ", error);
        }
      },
    }),

    /** REQUIRED ADMIN ROLE **/
    updateUser: builder.mutation({
      query: (id, newUserObject) => ({
        url: `${id}`,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState()?.auth?.jwtToken}`,
        },
        body: newUserObject,
      }),
    }),
  }),
});

export const {
  useGetAllUserQuery,
  useGetOneUserQuery,
  useUpdateUserMutation,
  useUpdateUserMobileMutation,
  useUpdateUserEmailMutation,
} = userAPI;
