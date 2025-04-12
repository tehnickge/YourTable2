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
    builder.addMatcher(
      userAPI.endpoints.getUser.matchFulfilled,
      (state, action) => {
        return { ...state, ...action.payload };
      }
    );
  },
});

export const { resetUserState } = userSlice.actions;
export default userSlice.reducer;
