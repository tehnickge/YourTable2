import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type Restaurant = {
  id: number;
  title: string;
  info: string | null;
  shortInfo: string | null;
  createdAt: string;
  lastUpdate: string;
  maxHoursToRent: number;
  restaurantChain_fk: number | null;
  uniqueKey: string;
  averageBill: number | null;
  rating: number | null;
  photos: string[];
  zones: {
    id: number;
    title: string | null;
    restaurant_fk: number;
    color: string | null;
    description: string | null;
    slots: {
      number: string;
      id: number;
      description: string | null;
      maxCountPeople: number;
      zone_fk: number;
    }[];
  }[];
};

export type Rent = {
  id: number;
  createdAt: string;
  timeStart: string;
  timeEnd: string;
  user_fk: number;
  rentStatus: string;
  restaurant_fk: number;
  amountPeople: number;
  slot_fk: number | null;
};

export type Note = {
  restaurantId: number;
  name: string;
  secondName?: string;
  phoneNumber?: string;
  comment: string;
  created: string;
  rentDate?: string;
};

export const restaurantAPI = createApi({
  reducerPath: "restaurantApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://89.179.242.42:3000/api/",
  }),
  endpoints: (builder) => ({
    getRestaurant: builder.mutation<Restaurant, { restaurantId: number }>({
      query: (data) => ({
        url: `restaurant/hostes/zonesAndSlots`,
        method: "POST",
        body: data,
      }),
    }),
    getRentsBySlotId: builder.query<Rent[], { slotId: number }>({
      query: (data) => ({
        url: `restaurant/hostes/rents?slotId=${data.slotId}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetRestaurantMutation, useLazyGetRentsBySlotIdQuery } =
  restaurantAPI;
