import { IRestaurantCreateSchema } from "./../../../types/restaurant";
import { Irent, IRentCreateSchema } from "@/types/rent";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { AdminRestaurant } from "@/types/restaurant";
import { RestaurantUpdate } from "@/app/api/restaurant/[id]/update";
import { Prisma } from "@prisma/client";
import { number } from "yup";

export type BaseRestaurant = Prisma.RestaurantGetPayload<{}>;
export type BaseAddress = Prisma.AddressGetPayload<{}>;
export type BaseRestaurantKitchen = Prisma.RestaurantKitchenGetPayload<{
  include: { kitchen: true };
}>;
export type BaseWorkShadule = Prisma.WorkSheduleGetPayload<{
  include: { day: true };
}>;
export type BaseZone = Prisma.ZoneGetPayload<{}>;
export type BaseSlot = Prisma.SlotGetPayload<{}>;
export type BaseHostes = Prisma.HostesGetPayload<{}>;

export const adminAPI = createApi({
  reducerPath: "adminAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://89.179.242.42:3000/api/",
  }),
  endpoints: (builder) => ({
    getAdminRestaurantById: builder.query<AdminRestaurant, string>({
      query: (id) => ({
        url: `admin/restaurant/${id}`,
        method: "GET",
      }),
    }),
    updateAdminRestaurantById: builder.mutation<
      RestaurantUpdate,
      RestaurantUpdate & { id: number }
    >({
      query: (data) => ({
        url: `/restaurant/${data.id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteRestaurantPhoto: builder.mutation<
      BaseRestaurant,
      { restaurantId: number; photoUrl: string }
    >({
      query: ({ restaurantId, photoUrl }) => {
        // Правильное формирование URL с кодированием параметров
        const encodedPhotoUrl = encodeURIComponent(photoUrl);
        return {
          url: `restaurant/photos?restaurantId=${restaurantId}&photoUrl=${encodedPhotoUrl}`,
          method: "DELETE",
        };
      },
    }),
    updateRestaurantPhotos: builder.mutation<BaseRestaurant, FormData>({
      query: (formData) => ({
        url: `restaurant/photos`,
        method: "PUT",
        body: formData,
      }),
    }),
    createNewResturant: builder.mutation<
      BaseRestaurant,
      IRestaurantCreateSchema
    >({
      query: (data) => ({
        url: "restaurant",
        method: "POST",
        body: data,
      }),
    }),
    upDateAddressById: builder.mutation<
      BaseAddress,
      {
        id: number;
        fullAddress?: string;
        city?: string;
        coordinate?: string;
        timezone?: string;
      }
    >({
      query: (data) => ({
        url: "/restaurant/address",
        method: "PUT",
        body: data,
      }),
    }),
    appendKitchenToRestaurant: builder.mutation<
      BaseRestaurantKitchen,
      { restaurantId: number; kitchenId: number }
    >({
      query: (data) => ({
        url: "/restaurant/restaurantKitchen",
        method: "POST",
        body: data,
      }),
    }),
    deleteKitchenFromRestaurant: builder.mutation<
      { id: number; kitchen_fk: number; restaurant_fk: number },
      { id: number }
    >({
      query: (data) => ({
        url: "/restaurant/restaurantKitchen",
        method: "DELETE",
        body: data,
      }),
    }),
    appendWorkSheduleToRestaurant: builder.mutation<
      BaseWorkShadule,
      {
        timeBegin: string;
        timeEnd: string;
        restaurantId: number;
        dayId: number;
      }
    >({
      query: (data) => ({
        url: "restaurant/workShedule",
        method: "POST",
        body: data,
      }),
    }),
    deleteWorkShedule: builder.mutation<BaseWorkShadule, { id: number }>({
      query: (data) => ({
        url: "restaurant/workShedule",
        method: "DELETE",
        body: data,
      }),
    }),
    appnedSlotToZone: builder.mutation<
      BaseSlot,
      {
        number: string;
        description?: string;
        maxCountPeople: number;
        zoneId: number;
      }
    >({
      query: (data) => ({
        url: "/restaurant/slot",
        method: "POST",
        body: data,
      }),
    }),
    deleteSlotfromZone: builder.mutation<
      BaseSlot,
      {
        id: number;
      }
    >({
      query: (data) => ({
        url: "/restaurant/slot",
        method: "DELETE",
        body: data,
      }),
    }),
    appendZoneToRestaurant: builder.mutation<
      BaseZone,
      {
        title?: string;
        description?: string;
        color?: string;
        restaurantId: number;
      }
    >({
      query: (data) => ({
        url: "/restaurant/zone",
        method: "POST",
        body: data,
      }),
    }),
    deleteZoneFromRestaurant: builder.mutation<BaseZone, { id: number }>({
      query: (data) => ({
        url: "/restaurant/zone",
        method: "DELETE",
        body: data,
      }),
    }),
    appendHostesToRestaurant: builder.mutation<
      BaseHostes,
      {
        login: string;
        password: string;
        restaurantId: number;
      }
    >({
      query: (data) => ({
        url: "/restaurant/hostes",
        method: "POST",
        body: data,
      }),
    }),
    deleteHostesFromRestaurant: builder.mutation<
      BaseHostes,
      {
        id: number;
      }
    >({
      query: (data) => ({
        url: "/restaurant/hostes",
        method: "DELETE",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAdminRestaurantByIdQuery,
  useUpdateAdminRestaurantByIdMutation,
  useDeleteRestaurantPhotoMutation,
  useUpdateRestaurantPhotosMutation,
  useCreateNewResturantMutation,
  useUpDateAddressByIdMutation,
  useAppendKitchenToRestaurantMutation,
  useDeleteKitchenFromRestaurantMutation,
  useDeleteWorkSheduleMutation,
  useAppendWorkSheduleToRestaurantMutation,
  useAppnedSlotToZoneMutation,
  useDeleteSlotfromZoneMutation,
  useAppendZoneToRestaurantMutation,
  useDeleteZoneFromRestaurantMutation,
  useAppendHostesToRestaurantMutation,
  useDeleteHostesFromRestaurantMutation,
} = adminAPI;
