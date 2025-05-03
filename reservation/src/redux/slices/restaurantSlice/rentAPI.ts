import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";

export const restaurantAPI = createApi({
  reducerPath: "rentAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://89.179.242.42:3000/api/rent",
  }),
  endpoints: (builder) => ({
    createRent: builder.mutation<any, any>({
      query: (data) => ({
        url: "",
        method: "POST",
        body: data,
      }),
    }),
  }),
});
