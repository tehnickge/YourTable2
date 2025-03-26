import { IRestaurantWithAll } from "@/types/restaurant";
import { Prisma } from "@prisma/client";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {

};

const RestaurantState = createSlice({
  name: "restaurant",
  initialState: initialState,
  reducers: {},
});
