import { IUserPayload } from './../../../types/user';
import { createSlice } from "@reduxjs/toolkit";
import { authAPI } from './sessionAPI';

type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};


type SessionState = Nullable<IUserPayload>;

const initialState: SessionState = {
    id: null,
    username: null,
    email: null,
    type: "unauthorized",
};
const SessionSlice = createSlice({
  name: "session",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      authAPI.endpoints.login.matchFulfilled, // Когда login-запрос успешен
      (state, { payload }) => {
        
        return { ...payload }; // Обновляем state из payload
      }
    );
  },
 
});

export const {  } = SessionSlice.actions;
export default SessionSlice.reducer;


