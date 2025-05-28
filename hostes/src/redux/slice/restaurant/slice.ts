import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Note, Rent, Restaurant, restaurantAPI } from "./api";

type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

type RestaurantState = {
  restaurant: Restaurant;
  selectedSlotId: number | null;
  rents: Rent[];

  notes: Note[];
  newNote: {
    name: string;
    secondName: string;
    phoneNumber: string;
    comment: string;
    created: string;
    date: string;
  };
};

const initialState: RestaurantState = {
  restaurant: {
    id: 0,
    title: "",
    info: null,
    shortInfo: null,
    createdAt: "",
    lastUpdate: "",
    maxHoursToRent: 0,
    restaurantChain_fk: null,
    uniqueKey: "",
    averageBill: null,
    rating: null,
    photos: [],
    zones: [],
  },
  notes: [],
  newNote: {
    name: "",
    secondName: "",
    phoneNumber: "",
    comment: "",
    created: "",
    date: "",
  },
  selectedSlotId: null,
  rents: [],
};

const RestaurantSlice = createSlice({
  name: "restaurant",
  initialState: initialState,
  reducers: {
    setSelectedSlotId: (state, action: PayloadAction<number>) => {
      state.selectedSlotId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        restaurantAPI.endpoints.getRestaurant.matchFulfilled,
        (state, action) => {
          state.restaurant = action.payload;
        }
      )
      .addMatcher(
        restaurantAPI.endpoints.getRentsBySlotId.matchFulfilled,
        (state, action) => {
          state.rents = action.payload;
        }
      );
  },
});

export const { setSelectedSlotId } = RestaurantSlice.actions;
export default RestaurantSlice.reducer;
