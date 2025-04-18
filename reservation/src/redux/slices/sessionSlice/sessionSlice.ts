import { IUserPayload, UserTypes } from "./../../../types/user";
import { createSlice } from "@reduxjs/toolkit";
import { authAPI } from "./sessionAPI";

type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

type SessionState = Nullable<IUserPayload>;

const initialState: SessionState = {
  id: null,
  username: null,
  email: null,
  type: UserTypes.unauthorized,
};
const SessionSlice = createSlice({
  name: "session",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authAPI.endpoints.login.matchFulfilled, // Когда login-запрос успешен
        (state, { payload }) => {
          return { ...payload }; // Обновляем state из payload
        }
      )
      .addMatcher(authAPI.endpoints.login.matchRejected, (state) => {
        state.id = null;
        state.username = null;
        state.email = null;
        state.type = UserTypes.unauthorized;
      })
      .addMatcher(
        authAPI.endpoints.register.matchFulfilled,
        (state, { payload }) => {
          return { ...payload };
        }
      )
      .addMatcher(authAPI.endpoints.register.matchRejected, (state) => {
        state.id = null;
        state.username = null;
        state.email = null;
        state.type = UserTypes.unauthorized;
      })
      .addMatcher(authAPI.endpoints.logout.matchFulfilled, (state) => {
        state.id = null;
        state.username = null;
        state.email = null;
        state.type = UserTypes.unauthorized;
      });
  },
});

export const {} = SessionSlice.actions;
export default SessionSlice.reducer;
