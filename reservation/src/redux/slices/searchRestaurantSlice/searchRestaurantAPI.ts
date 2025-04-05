import { IGetRestaurantWithFilter, IRestaurantTitle } from "@/types/restaurant";
import { IUser, IUserAuth, IUserPayload } from "@/types/user";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  RestaurantsPagging,
  RestaurantWithKitchenZoneSchedule,
} from "./searchRestaurantSlice";
import { title } from "process";

export const restaurantAPI = createApi({
  reducerPath: "restaurantAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://89.179.242.42:3000/api/restaurant",
  }),
  endpoints: (builder) => ({
    getAllRestaurant: builder.mutation<RestaurantsPagging, IGetRestaurantWithFilter>({
      query: (userData) => ({
        url: "getAll",
        method: "POST",
        body: userData,
      }),
    }),

    getById: builder.query<string, null>({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
      }),
    }),

    getAllTitle: builder.query<IRestaurantTitle[], void>({
      query: (title) => ({
        url: `/getAllTitles`,
      }),
    }),

    getAllKitchens: builder.query<{ id: number; title: string }[], void>({
      query: () => ({
        url: "/kitchens",
        method: "GET",
      }),
    }),

    getAllCities: builder.query<string[], void>({
      query: () => ({
        url: "/address/city",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetAllRestaurantMutation,
  useLazyGetByIdQuery,
  useLazyGetAllTitleQuery,
  useLazyGetAllKitchensQuery,
  useLazyGetAllCitiesQuery,
} = restaurantAPI;
