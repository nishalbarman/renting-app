import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const userAPi = createApi({
  reducerPath: "user",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/user" }),
  tagTypes: ["Post"],
  endpoints: (builder) => ({
    // get all user endpoint needs admin role
    getAllUser: builder.query({
      query: () => ({
        url: `/`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState()?.user?.jwtToken}`,
        },
      }),
      onQueryStarted: async (args, { dispatch, queryFulfilled, getState }) => {
        try {
          const response = await queryFulfilled;
          dispatch(setUserData(response.data));
        } catch (error) {
          console.error("Get User --->", error);
        }
      },
    }),

    // get user endpoint needs admin role
    getOneUser: builder.query({
      query: (id) => ({
        url: `/${id}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState()?.user?.jwtToken}`,
        },
      }),
      onQueryStarted: async (args, { dispatch, queryFulfilled, getState }) => {
        try {
          const response = await queryFulfilled;
          dispatch(setUserData(response.data));
        } catch (error) {
          console.error("Get User --->", error);
        }
      },
    }),
    // user callable endpoint
    updateEmailUser: builder.mutation({
      query: ({ id, newEmail }) => ({
        url: "/update_email",
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState()?.user?.jwtToken}`, // we will get the getState in the onQueryStarted
        },
        body: { id, email: newEmail },
      }),
      onQueryStarted: async (args, { dispatch, getState, queryFulfilled }) => {
        try {
          const response = await queryFulfilled;
          dispatch(setUserData(response.data));
        } catch (error) {
          console.error("Update user Email -->> ", error);
        }
      },
    }),
  }),
});
