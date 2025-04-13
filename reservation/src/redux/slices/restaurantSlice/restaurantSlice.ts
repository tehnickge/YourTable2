import { createSlice } from "@reduxjs/toolkit";
import { restaurantAPI } from "../searchRestaurantSlice/searchRestaurantAPI";

type RestaurantState = {
  id: number;
  title: string;
  createdAt: string;
  info: string | null;
  shortInfo: string | null;
  restaurantChain_fk: number | null;
  photos: string[];
  maxHoursToRent: number;
  averageBill: number | null;
  lastUpdate: string;
  rating: number | null;
  kitchens: {
    id: number;
    kitchen: {
      id: number;
      title: string;
    };
  }[];
  zones: {
    id: number;
    title: string;
    description: string;
    color: string;
    slots: {
      id: number;
      description: string;
      maxCountPeople: string;
      number: string;
    }[];
  }[];
  reviews: {
    id: number;
    restaurant_fk: number;
    user_fk: number;
    user: {
      id: number;
      username: string;
      photo: string;
    };
    comment: string | null;
    rating: number;
  }[];
  address: {
    id: number;
    city: string;
    fullAddress: string;
    coordinate: string;
    timezone: string;
  };
  restaurantChain: {
    id: number;
    title: string;
  };
  menus: {
    id: number;
    titleDish: string | null;
    photo: string | null;
    price: number | null;
  }[];
  workShedules: {
    id: number;
    day: {
      id: number;
      title: string;
    };
    timeBegin: string;
    timeEnd: string;
  }[];
};

const initialState: RestaurantState = {
  id: 0,
  title: "",
  createdAt: "",
  info: null,
  shortInfo: null,
  restaurantChain_fk: null,
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
  },
  menus: [],
  workShedules: [],
};

const restaurantSlice = createSlice({
  name: "restaurant",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      restaurantAPI.endpoints.getByRestaurantId.matchFulfilled,
      (state, action) => {
        return { ...action.payload };
      }
    );
  },
});

export const {} = restaurantSlice.actions;
export default restaurantSlice.reducer;
