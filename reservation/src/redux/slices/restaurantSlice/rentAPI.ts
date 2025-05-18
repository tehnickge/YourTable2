import { Irent, IRentCreateSchema } from "@/types/rent";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const rentAPI = createApi({
  reducerPath: "rentAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://89.179.242.42:3000/api/rent",
  }),
  endpoints: (builder) => ({
    createRent: builder.mutation<Irent, IRentCreateSchema>({
      query: (data) => ({
        url: "",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useCreateRentMutation } = rentAPI;
