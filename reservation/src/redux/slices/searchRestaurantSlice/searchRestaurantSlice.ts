import { IGetRestaurantWithFilter, IRestaurantTitle } from "@/types/restaurant";
import { Prisma } from "@prisma/client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { restaurantAPI } from "./searchRestaurantAPI";

type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

type SearchRestaurantState = Omit<
  Required<IGetRestaurantWithFilter>,
  "kitchens"
> & {
  kitchens: string[];
  restaurants: RestaurantWithKitchenZoneSchedule[];
  searchTips: IRestaurantTitle[];
  totalPages?: number;
  totalCount?: number;
};

export type RestaurantWithKitchenZoneSchedule = Prisma.RestaurantGetPayload<{
  include: {
    kitchens: true;
    zones: true;
    workShedules: true;
  };
}>;

export type RestaurantsPagging = {
  data: RestaurantWithKitchenZoneSchedule[];
  totalPages: number;
  totalCount: number;
};

const initialState: SearchRestaurantState = {
  restaurants: [],
  kitchens: [],
  searchTips: [],
  page: 1,
  pageSize: 25,
  city: null,
  minBill: 0,
  maxBill: null,
  minRating: 0,
  title: null,
  totalPages: undefined,
  totalCount: undefined,
};
const SearchRestaurantSlice = createSlice({
  name: "searchRestaurant",
  initialState: initialState,
  reducers: {
    appendKitchen: (state, action: PayloadAction<string>) => {
      if (!state.kitchens.includes(action.payload)) {
        state.kitchens.push(action.payload);
      }
    },
    popKitchen: (state, action: PayloadAction<string>) => {
      state.kitchens = state.kitchens.filter(
        (kitchen) => kitchen !== action.payload
      );
    },
    setCity: (state, action: PayloadAction<string>) => {
      state.city = action.payload;
    },
    removeCity: (state, action: PayloadAction<string>) => {
      state.city = null;
    },
    setTitle: (state, action: PayloadAction<string>) => {
      action.payload.length === 0
        ? (state.title = null)
        : (state.title = action.payload);
    },
    setMinBill: (state, action: PayloadAction<number>) => {
      if (state.maxBill) {
        if (action.payload > state.maxBill) {
          state.maxBill = action.payload;
        }
      }
      state.minBill = action.payload;
    },
    setMaxBill: (state, action: PayloadAction<number>) => {
      if (state.minBill) {
        if (action.payload < state.minBill) {
          state.minBill = action.payload;
        }
      }
      state.maxBill = action.payload;
    },
    setMinRating: (state, action: PayloadAction<number>) => {
      if (state.minBill) {
        if (action.payload < state.minBill) {
          state.minBill = action.payload;
        }
      }
      state.maxBill = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload >= 1 ? (state.page = action.payload) : 1;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      restaurantAPI.endpoints.getAllTitle.matchFulfilled,
      (state, action) => {
        const res = action.payload.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.title === value.title)
        );
        return { ...state, searchTips: res };
      }
    );
    builder.addMatcher(
      restaurantAPI.endpoints.getAllTitle.matchPending,
      (state, action) => {
        return {
          ...state,
        };
      }
    );
    builder.addMatcher(
      restaurantAPI.endpoints.getAll.matchFulfilled,
      (state, action) => {
        return { ...state, restaurants: action.payload.data };
      }
    );
  },
});

export const {
  appendKitchen,
  popKitchen,
  removeCity,
  setCity,
  setMaxBill,
  setMinBill,
  setMinRating,
  setPage,
  setTitle,
} = SearchRestaurantSlice.actions;
export default SearchRestaurantSlice.reducer;
