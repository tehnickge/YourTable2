import { AdminRestaurant, IRestaurantCreateSchema } from "@/types/restaurant";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { adminAPI } from "./adminAPI";
import { BaseFilterData } from "@/components/BaseFilter";
import { restaurantAPI } from "../searchRestaurantSlice/searchRestaurantAPI";

export type AdminRestaurantState = {
  restaurant: AdminRestaurant;
  newRestaurant: {
    info: string;
    title: string;
    shortInfo: string;
  };
  address: {
    allCities: string[];
  };
  kitchens: {
    allKitchens: BaseFilterData[];
    selectedKitchen: BaseFilterData;
  };

  workShedule: {
    selectedDay: BaseFilterData;
    timeBegin: string;
    timeEnd: string;
  };

  zonesWithSlots: {
    activeZone: number;
    maxPeopleAmount: number;
    description: string;
    slotNumber: string;
    zoneTitle: string;
    zoneDescription: string;
  };

  hostes: {
    login: string;
    password: string;
  };
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
    hostes: [],
  },
  newRestaurant: {
    title: "",
    info: "",
    shortInfo: "",
  },
  kitchens: {
    allKitchens: [],
    selectedKitchen: {
      id: 0,
      title: "",
    },
  },
  address: {
    allCities: [],
  },
  workShedule: {
    selectedDay: { id: 0, title: "" },
    timeBegin: "",
    timeEnd: "",
  },
  zonesWithSlots: {
    activeZone: 0,
    maxPeopleAmount: 0,
    description: "",
    slotNumber: "",
    zoneTitle: "",
    zoneDescription: "",
  },
  hostes: {
    login: "",
    password: "",
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
      state.restaurant.maxHoursToRent =
        Number(action.payload) > 0 ? action.payload : 1;
    },
    setAverageBillToUpdate: (state, action: PayloadAction<number>) => {
      state.restaurant.averageBill =
        Number(action.payload) > 0 ? action.payload : 100;
    },
    setNewRestaurantTitle: (state, action: PayloadAction<string>) => {
      state.newRestaurant.title = action.payload;
    },
    setNewRestaurantShortInfo: (state, action: PayloadAction<string>) => {
      state.newRestaurant.shortInfo = action.payload;
    },
    setNewRestaurantInfo: (state, action: PayloadAction<string>) => {
      state.newRestaurant.info = action.payload;
    },
    setNewCity: (state, action: PayloadAction<string>) => {
      state.restaurant.address.city = action.payload;
    },
    setNewFullAddress: (state, action: PayloadAction<string>) => {
      state.restaurant.address.fullAddress = action.payload;
    },
    setNewCoordinate: (state, action: PayloadAction<string>) => {
      state.restaurant.address.coordinate = action.payload;
    },
    setNewTimeZone: (state, action: PayloadAction<string>) => {
      state.restaurant.address.timezone = action.payload;
    },
    setSelectedKitchen: (state, action: PayloadAction<BaseFilterData>) => {
      state.kitchens.selectedKitchen = action.payload;
    },
    setSelectedDay: (state, action: PayloadAction<BaseFilterData>) => {
      state.workShedule.selectedDay = action.payload;
    },
    setTimeBegin: (state, action: PayloadAction<string>) => {
      state.workShedule.timeBegin = action.payload;
    },
    setTimeEnd: (state, action: PayloadAction<string>) => {
      state.workShedule.timeEnd = action.payload;
    },
    setActiveZone: (state, action: PayloadAction<number>) => {
      state.zonesWithSlots.activeZone = action.payload;
    },
    setSlotNumber: (state, action: PayloadAction<string>) => {
      state.zonesWithSlots.slotNumber = action.payload;
    },
    setSlotDescriptionr: (state, action: PayloadAction<string>) => {
      state.zonesWithSlots.description = action.payload;
    },
    setSlotMaxPeopleAmount: (state, action: PayloadAction<number>) => {
      state.zonesWithSlots.maxPeopleAmount = action.payload;
    },
    setZoneTitle: (state, action: PayloadAction<string>) => {
      state.zonesWithSlots.zoneTitle = action.payload;
    },
    setZoneDescription: (state, action: PayloadAction<string>) => {
      state.zonesWithSlots.zoneDescription = action.payload;
    },
    setHostesLogin: (state, action: PayloadAction<string>) => {
      state.hostes.login = action.payload;
    },
    setHostesPassword: (state, action: PayloadAction<string>) => {
      state.hostes.password = action.payload;
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
      )
      .addMatcher(
        restaurantAPI.endpoints.getAllCities.matchFulfilled,
        (state, action) => {
          state.address.allCities = action.payload;
        }
      )
      .addMatcher(
        restaurantAPI.endpoints.getAllKitchens.matchFulfilled,
        (state, action) => {
          state.kitchens.allKitchens = action.payload;
        }
      )
      .addMatcher(
        adminAPI.endpoints.upDateAddressById.matchFulfilled,
        (state, action) => {
          state.restaurant.address = { ...action.payload };
        }
      )
      .addMatcher(
        adminAPI.endpoints.appendKitchenToRestaurant.matchFulfilled,
        (state, action) => {
          state.restaurant.kitchens.push(action.payload);
        }
      )
      .addMatcher(
        adminAPI.endpoints.deleteKitchenFromRestaurant.matchFulfilled,
        (state, action) => {
          state.restaurant.kitchens = state.restaurant.kitchens.filter(
            (kitchen) => kitchen.id !== action.payload.id
          );
        }
      )
      .addMatcher(
        adminAPI.endpoints.deleteWorkShedule.matchFulfilled,
        (state, action) => {
          state.restaurant.workShedules = state.restaurant.workShedules.filter(
            (shedule) => shedule.id !== action.payload.id
          );
        }
      )
      .addMatcher(
        adminAPI.endpoints.appendWorkSheduleToRestaurant.matchFulfilled,
        (state, action) => {
          return {
            ...state,
            restaurant: {
              ...state.restaurant,
              workShedules: [
                ...state.restaurant.workShedules,
                {
                  id: action.payload.id,
                  day: action.payload.day,
                  timeBegin: new Date(action.payload.timeBegin).toISOString(),
                  timeEnd: new Date(action.payload.timeEnd).toISOString(),
                },
              ],
            },
          };
        }
      )
      .addMatcher(
        adminAPI.endpoints.appnedSlotToZone.matchFulfilled,
        (state, action) => {
          const zoneIndex = state.restaurant.zones.findIndex(
            (zone) => zone.id === action.payload.zone_fk
          );

          state.restaurant.zones[zoneIndex].slots.push({
            ...action.payload,
            maxCountPeople: action.payload.maxCountPeople,
            description: action.payload.description ?? "",
          });
        }
      )
      .addMatcher(
        adminAPI.endpoints.deleteSlotfromZone.matchFulfilled,
        (state, action) => {
          const zoneIndex = state.restaurant.zones.findIndex(
            (zone) => zone.id === action.payload.zone_fk
          );

          state.restaurant.zones[zoneIndex].slots = state.restaurant.zones[
            zoneIndex
          ].slots.filter((slot) => slot.id !== action.payload.id);
        }
      )
      .addMatcher(
        adminAPI.endpoints.appendZoneToRestaurant.matchFulfilled,
        (state, action) => {
          state.restaurant.zones.push({
            id: action.payload.id,
            color: action.payload.color || "",
            description: action.payload.description || "",
            slots: [],
            title: action.payload.title || "",
          });
        }
      )
      .addMatcher(
        adminAPI.endpoints.deleteZoneFromRestaurant.matchFulfilled,
        (state, action) => {
          state.restaurant.zones = state.restaurant.zones.filter(
            (zone) => zone.id !== action.payload.id
          );
        }
      )
      .addMatcher(
        adminAPI.endpoints.appendHostesToRestaurant.matchFulfilled,
        (state, action) => {
          state.restaurant.hostes.push({
            id: action.payload.id,
            login: action.payload.login,
            password: action.payload.password,
          });
        }
      )
      .addMatcher(
        adminAPI.endpoints.deleteHostesFromRestaurant.matchFulfilled,
        (state, action) => {
          state.restaurant.hostes = state.restaurant.hostes.filter(
            (employee) => employee.id !== action.payload.id
          );
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
  setNewRestaurantInfo,
  setNewRestaurantShortInfo,
  setNewRestaurantTitle,
  setNewCity,
  setNewCoordinate,
  setNewFullAddress,
  setNewTimeZone,
  setSelectedKitchen,
  setSelectedDay,
  setTimeBegin,
  setTimeEnd,
  setActiveZone,
  setSlotDescriptionr,
  setSlotNumber,
  setSlotMaxPeopleAmount,
  setZoneDescription,
  setZoneTitle,
  setHostesLogin,
  setHostesPassword,
} = adminRestaurantSlice.actions;
export default adminRestaurantSlice.reducer;
