import { IGetRestaurantWithFilter, IRestaurantTitle } from "@/types/restaurant";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  RestaurantsPagging,
  RestaurantWithKitchenZoneSchedule,
} from "./searchRestaurantSlice";

export const restaurantAPI = createApi({
  reducerPath: "restaurantAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://89.179.242.42:3000/api/restaurant",
  }),
  endpoints: (builder) => ({
    getAllRestaurant: builder.mutation<
      RestaurantsPagging,
      IGetRestaurantWithFilter
    >({
      query: (userData) => ({
        url: "getAll",
        method: "POST",
        body: userData,
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
    getByRestaurantId: builder.query<any, string>({
      query: (id: string) => ({
        url: `/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetAllRestaurantMutation,
  useLazyGetAllTitleQuery,
  useLazyGetAllKitchensQuery,
  useLazyGetAllCitiesQuery,
  useLazyGetByRestaurantIdQuery,
} = restaurantAPI;
