import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { UserState } from "./userSlice";

export const userAPI = createApi({
  reducerPath: "userAPI",
  baseQuery: fetchBaseQuery({ baseUrl: "http://89.179.242.42:3000/api/user" }),
  endpoints: (builder) => ({
    getUser: builder.query<UserState, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
      }),
    }),
    mutationWishList: builder.mutation<number[], { id: number }>({
      query: (data) => ({
        url: "/wishList",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useLazyGetUserQuery, useMutationWishListMutation } = userAPI;
