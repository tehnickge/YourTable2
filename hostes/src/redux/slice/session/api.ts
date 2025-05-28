import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authAPI = createApi({
  reducerPath: "authAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://89.179.242.42:3000/api/",
  }),
  endpoints: (builder) => ({
    login: builder.query<
      { id: number; login: string; restaurantId: number; type: string },
      { login: string; password: string }
    >({
      query: ({ login, password }) => ({
        url: `restaurant/hostes?login=${login}&password=${password}`,
        method: "GET",
      }),
    }),

    logout: builder.query<string, null>({
      query: () => ({
        url: "auth/logout",
        method: "get",
      }),
    }),
  }),
});

export const { useLazyLoginQuery, useLazyLogoutQuery } = authAPI;
