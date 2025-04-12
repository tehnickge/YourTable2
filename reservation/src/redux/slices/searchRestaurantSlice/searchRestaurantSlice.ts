import { IGetRestaurantWithFilter, IRestaurantTitle } from "@/types/restaurant";
import { Prisma } from "@prisma/client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { restaurantAPI } from "./searchRestaurantAPI";
import { BaseFilterData } from "@/components/BaseFilter";

type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

type SearchRestaurantState = Omit<
  Required<IGetRestaurantWithFilter>,
  "kitchens"
> & {
  kitchens: BaseFilterData[];
  restaurants: RestaurantWithKitchenZoneSchedule[];
  searchTips: IRestaurantTitle[];
  totalPages: number;
  totalCount: number;
  allKitchens: BaseFilterData[];
  allCities: string[];
};

export type RestaurantWithKitchenZoneSchedule = Prisma.RestaurantGetPayload<{
  include: {
    kitchens: { include: { kitchen: true } };
    zones: true;
    workShedules: { include: { day: true } };
    address: true;
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
  pageSize: 12,
  city: null,
  minBill: 0,
  maxBill: null,
  minRating: 0,
  title: "",
  totalPages: 0,
  totalCount: 0,
  allKitchens: [],
  allCities: [],
};
const SearchRestaurantSlice = createSlice({
  name: "searchRestaurant",
  initialState: initialState,
  reducers: {
    appendKitchen: (state, action: PayloadAction<BaseFilterData>) => {
      if (!state.kitchens.some((kitchen) => kitchen.id === action.payload.id)) {
        state.kitchens.push(action.payload);
      }
    },
    popKitchen: (state, action: PayloadAction<BaseFilterData>) => {
      state.kitchens = state.kitchens.filter(
        (kitchen) => kitchen.id !== action.payload.id
      );
    },
    setCity: (state, action: PayloadAction<string>) => {
      state.city = action.payload;
    },
    removeCity: (state, action: PayloadAction<string>) => {
      state.city = null;
    },
    setTitle: (state, action: PayloadAction<string>) => {
      !action.payload.length
        ? (state.title = "")
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
          return { ...state, minBill: action.payload };
        }
      }
      return { ...state, maxBill: action.payload };
    },
    setPage: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        page: action.payload >= 1 ? action.payload : 1,
      };
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
      restaurantAPI.endpoints.getAllTitle.matchRejected,
      (state, action) => {
        return {
          ...state,
        };
      }
    );
    builder.addMatcher(
      restaurantAPI.endpoints.getAllRestaurant.matchFulfilled,
      (state, action) => {
        return {
          ...state,
          restaurants: action.payload.data,
          totalPages: action.payload.totalPages,
          totalCount: action.payload.totalCount,
        };
      }
    );
    builder.addMatcher(
      restaurantAPI.endpoints.getAllRestaurant.matchPending,
      (state, action) => {
        return {
          ...state,
        };
      }
    );
    builder.addMatcher(
      restaurantAPI.endpoints.getAllRestaurant.matchRejected,
      (state, action) => {
        return {
          ...state,
        };
      }
    );
    builder.addMatcher(
      restaurantAPI.endpoints.getAllKitchens.matchFulfilled,
      (state, action) => {
        return {
          ...state,
          allKitchens: action.payload,
        };
      }
    );
    builder.addMatcher(
      restaurantAPI.endpoints.getAllKitchens.matchPending,
      (state, action) => {
        return {
          ...state,
        };
      }
    );
    builder.addMatcher(
      restaurantAPI.endpoints.getAllKitchens.matchRejected,
      (state, action) => {
        return {
          ...state,
        };
      }
    );
    builder.addMatcher(
      restaurantAPI.endpoints.getAllCities.matchFulfilled,
      (state, action) => {
        return { ...state, allCities: action.payload };
      }
    );
    builder.addMatcher(
      restaurantAPI.endpoints.getAllCities.matchPending,
      (state, action) => {
        return { ...state };
      }
    );
    builder.addMatcher(
      restaurantAPI.endpoints.getAllCities.matchRejected,
      (state, action) => {
        return { ...state };
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
