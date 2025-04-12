import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { userAPI } from "./userApi";

export type UserState = {
  id: number;
  username: string;
  email: string;
  type: string;
  photo: string | null;
  historyRest: number[];
  wishList: number[];
  recommendations: number[];
  phoneNumber: string | null;
};

const initialState: UserState = {
  id: 0,
  username: "",
  email: "",
  type: "",
  photo: null,
  historyRest: [],
  wishList: [],
  recommendations: [],
  phoneNumber: null,
};
const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    resetUserState: (state, action: PayloadAction<void>) => {
      return {
        id: 0,
        username: "",
        email: "",
        type: "",
        photo: null,
        historyRest: [],
        wishList: [],
        recommendations: [],
        phoneNumber: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(userAPI.endpoints.getUser.matchFulfilled, (state, action) => {
        return { ...state, ...action.payload };
      })
      .addMatcher(userAPI.endpoints.getUser.matchPending, (state, action) => {
        return { ...state };
      })
      .addMatcher(userAPI.endpoints.getUser.matchRejected, (state, action) => {
        return { ...state };
      })
      .addMatcher(
        userAPI.endpoints.mutationWishList.matchFulfilled,
        (state, action) => {
          return { ...state, wishList: action.payload };
        }
      )
      .addMatcher(
        userAPI.endpoints.mutationWishList.matchPending,
        (state, action) => {
          return { ...state };
        }
      )
      .addMatcher(
        userAPI.endpoints.mutationWishList.matchPending,
        (state, action) => {
          return { ...state };
        }
      );
  },
});

export const { resetUserState } = userSlice.actions;
export default userSlice.reducer;
