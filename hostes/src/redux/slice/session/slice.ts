import { createSlice } from "@reduxjs/toolkit";
import { authAPI } from "./api";

type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

type Session = {
  id: number;
  login: string;
  restaurantId: number;
  type: string;
};

type SessionState = Nullable<Session>;

const initialState: SessionState = {
  id: null,
  login: null,
  restaurantId: null,
  type: null,
};

const SessionSlice = createSlice({
  name: "session",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      authAPI.endpoints.login.matchFulfilled,
      (state, action) => {
        const { id, login, restaurantId, type } = action.payload;
        return { ...state, id, login, restaurantId, type };
      }
    );
  },
});

export const {} = SessionSlice.actions;
export default SessionSlice.reducer;
