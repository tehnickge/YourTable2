import { AdminRestaurant } from "@/types/restaurant";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { adminAPI } from "./adminAPI";

export type AdminRestaurantState = {
  restaurant: AdminRestaurant;
};

const initialState: AdminRestaurantState = {
  restaurant: {
    id: 0,
    title: "",
    createdAt: "",
    info: null,
    shortInfo: null,
    restaurantChain_fk: null,
    uniqueKey: "",
    photos: [],
    maxHoursToRent: 0,
    averageBill: null,
    lastUpdate: "",
    rating: null,
    kitchens: [],
    zones: [],
    reviews: [],
    address: {
      id: 0,
      city: "",
      fullAddress: "",
      coordinate: "",
      timezone: "",
    },
    restaurantChain: {
      id: 0,
      title: "",
      company: {
        id: 0,
        title: "",
      },
    },
    menus: [],
    workShedules: [],
  },
};

const adminRestaurantSlice = createSlice({
  name: "adminRestaurantSlice",
  initialState,
  reducers: {
    setTitleToUpdate: (state, action: PayloadAction<string>) => {
      state.restaurant.title = action.payload;
    },
    setInfoToUpdate: (state, action: PayloadAction<string>) => {
      state.restaurant.info = action.payload;
    },
    setShortInfoToUpdate: (state, action: PayloadAction<string>) => {
      state.restaurant.shortInfo = action.payload;
    },
    setMaxHoursToRentToUpdate: (state, action: PayloadAction<number>) => {
      state.restaurant.maxHoursToRent = action.payload;
    },
    setAverageBillToUpdate: (state, action: PayloadAction<number>) => {
      state.restaurant.averageBill = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        adminAPI.endpoints.getAdminRestaurantById.matchFulfilled,
        (state, action) => {
          state.restaurant = action.payload;
        }
      )
      .addMatcher(
        adminAPI.endpoints.updateAdminRestaurantById.matchFulfilled,
        (state, action) => {
          return {
            ...state,
            restaurant: { ...state.restaurant, ...action.payload },
          };
        }
      )
      .addMatcher(
        adminAPI.endpoints.updateRestaurantPhotos.matchFulfilled,
        (state, action) => {
          state.restaurant.photos = action.payload.photos;
        }
      )
      .addMatcher(
        adminAPI.endpoints.deleteRestaurantPhoto.matchFulfilled,
        (state, action) => {
          state.restaurant.photos = action.payload.photos;
        }
      );
  },
});

export const {
  setAverageBillToUpdate,
  setInfoToUpdate,
  setMaxHoursToRentToUpdate,
  setShortInfoToUpdate,
  setTitleToUpdate,
} = adminRestaurantSlice.actions;
export default adminRestaurantSlice.reducer;
