import { Irent, IRentCreateSchema } from "@/types/rent";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { AdminRestaurant } from "@/types/restaurant";
import { RestaurantUpdate } from "@/app/api/restaurant/[id]/update";
import { Prisma } from "@prisma/client";
export type BaseRestaurant = Prisma.RestaurantGetPayload<{}>;

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
  }),
});

export const {
  useGetAdminRestaurantByIdQuery,
  useUpdateAdminRestaurantByIdMutation,
  useDeleteRestaurantPhotoMutation,
  useUpdateRestaurantPhotosMutation,
} = adminAPI;
