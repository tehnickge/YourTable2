import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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
  uniqueKey: string;
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

  rentModal: {
    activeDate: Date | null;
    isOpen: boolean;
    activeSlot: number;
    avaibleTimes: string[];
    selectTimeStart: string;
    selectTimeEnd: string;
    amoutPeople: number;
  };
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
  rentModal: {
    isOpen: false,
    activeSlot: 0,
    activeDate: null,
    avaibleTimes: [],
    selectTimeStart: "",
    selectTimeEnd: "",
    amoutPeople: 1,
  },
  uniqueKey: ""
};

const restaurantSlice = createSlice({
  name: "restaurant",
  initialState: initialState,
  reducers: {
    setIsOpenModal: (state, action: PayloadAction<undefined>) => {
      state.rentModal.isOpen = !state.rentModal.isOpen;
    },
    setActiveSlot: (state, action: PayloadAction<number>) => {
      state.rentModal.activeSlot = action.payload;
    },
    resetModalState: (state, action: PayloadAction<undefined>) => {
      state.rentModal = {
        isOpen: false,
        activeSlot: 0,
        activeDate: null,
        avaibleTimes: [],
        selectTimeStart: "",
        selectTimeEnd: "",
        amoutPeople: 1,
      };
    },
    setActiveDate: (state, action: PayloadAction<Date | null>) => {
      state.rentModal.activeDate = action.payload;
    },
    setTimeStart: (state, action: PayloadAction<string>) => {
      state.rentModal.selectTimeStart = action.payload;
      state.rentModal.selectTimeEnd = "";
    },
    setTimeEnd: (state, action: PayloadAction<string>) => {
      state.rentModal.selectTimeEnd = action.payload;
    },
    setAmoutPeople: (state, action: PayloadAction<number>) => {
      state.rentModal.amoutPeople = action.payload > 0 ? action.payload : 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        restaurantAPI.endpoints.getByRestaurantId.matchFulfilled,
        (state, action) => {
          return { ...state, ...action.payload };
        }
      )
      .addMatcher(
        restaurantAPI.endpoints.getAvailableTime.matchFulfilled,
        (state, action) => {
          return {
            ...state,
            rentModal: {
              ...state.rentModal,
              selectTimeStart: "",
              selectTimeEnd: "",
            },
          };
        }
      )
      .addMatcher(
        restaurantAPI.endpoints.getAvailableTime.matchFulfilled,
        (state, action) => {
          return {
            ...state,
            rentModal: { ...state.rentModal, avaibleTimes: action.payload },
          };
        }
      )
      .addMatcher(
        restaurantAPI.endpoints.getAvailableTime.matchRejected,
        (state, action) => {
          return {
            ...state,
            rentModal: { ...state.rentModal, avaibleTimes: [] },
          };
        }
      );
  },
});

export const {
  setIsOpenModal,
  setActiveSlot,
  resetModalState,
  setActiveDate,
  setTimeStart,
  setTimeEnd,
  setAmoutPeople,
} = restaurantSlice.actions;
export default restaurantSlice.reducer;
