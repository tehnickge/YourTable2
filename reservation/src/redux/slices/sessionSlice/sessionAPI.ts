import {
  IUser,
  IUserAuth,
  IUserPayload,
  IUserValidSchemaRegistration,
} from "@/types/user";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authAPI = createApi({
  reducerPath: "authAPI",
  baseQuery: fetchBaseQuery({ baseUrl: "http://89.179.242.42:3000/api/auth" }),
  endpoints: (builder) => ({
    login: builder.mutation<IUserPayload, IUserAuth>({
      query: (userData) => ({
        url: "login",
        method: "POST",
        body: userData,
      }),
    }),
    register: builder.mutation<IUserPayload, IUserAuth>({
      query: (userData) => ({
        url: "register",
        method: "POST",
        body: userData,
      }),
    }),
    logout: builder.query<string, null>({
      query: () => ({
        url: "logout",
        method: "get",
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useLazyLogoutQuery } =
  authAPI;
