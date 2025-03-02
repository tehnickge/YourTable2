import { IGetRestaurantWithFilter } from "@/types/restaurant";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

type SearchRestaurantState = Omit<
  Required<Nullable<IGetRestaurantWithFilter>>,
  "kitchens"
> & { kitchens: string[] };

const initialState: SearchRestaurantState = {
  kitchens: [],
  page: 1,
  pageSize: 25,
  city: null,
  minBill: 0,
  maxBill: null,
  minRating: null,
  title: null,
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
      state.title?.length === 0
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
      action.payload >= 1 ? (state.page = action.payload) : 1;
    },
  },
});

export const {} = SearchRestaurantSlice.actions;
export default SearchRestaurantSlice.reducer;
