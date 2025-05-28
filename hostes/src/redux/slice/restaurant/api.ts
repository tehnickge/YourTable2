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
  _id: string;
  name: string;
  secondName: string;
  phoneNumber: string;
  comment: string;
  created: string;
  date: string;
  restaurantId: number;
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

export const noteAPI = createApi({
  reducerPath: "noteAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://89.179.242.42:3001/api/",
  }),
  endpoints: (builder) => ({
    addRecord: builder.mutation<
      Note,
      {
        name: string;
        secondName: string;
        phoneNumber: string;
        comment: string;
        created: string;
        date: string;
        restaurantId: number;
      }
    >({
      query: (data) => ({
        url: `record`,
        method: "POST",
        body: data,
      }),
    }),
    getNoteByRestIdndDate: builder.query<
      Note[],
      { restaurantId: number; date: string }
    >({
      query: (data) => ({
        url: `record?restaurantId=${data.restaurantId}&date=${data.date}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useAddRecordMutation, useLazyGetNoteByRestIdndDateQuery } =
  noteAPI;

//  name: "Иван",
//   secondName: "Петров",
//   phoneNumber: "+79991234567",
//   comment: "Бронирование на день рождения",
//   date: "2025-05-25T19:00:00.000Z", // Время бронирования
//   restaurantId: 1

export const { useGetRestaurantMutation, useLazyGetRentsBySlotIdQuery } =
  restaurantAPI;
