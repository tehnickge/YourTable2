import { IGetRestaurantWithFilter, IRestaurantTitle } from "@/types/restaurant";
import { IUser, IUserAuth, IUserPayload } from "@/types/user";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RestaurantWithKitchenZoneSchedule } from "./searchRestaurantSlice";
import { title } from "process";

export const restaurantAPI = createApi({
  reducerPath: "restaurantAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://89.179.242.42:3000/api/restaurant",
  }),
  endpoints: (builder) => ({
    getAll: builder.mutation<
      RestaurantWithKitchenZoneSchedule[],
      IGetRestaurantWithFilter
    >({
      query: (userData) => ({
        url: "getAll",
        method: "POST",
        body: userData,
      }),
    }),

    getById: builder.query<string, null>({
      query: (id) => ({
        url: `/${id}`,
        method: "get",
      }),
    }),

    getAllTitle: builder.query<IRestaurantTitle[], void>({
      query: (title) => ({
        url: `/getAllTitles`,
      }),
    }),
  }),
});

export const {
  useGetAllMutation,
  useLazyGetByIdQuery,
  useLazyGetAllTitleQuery,
} = restaurantAPI;
