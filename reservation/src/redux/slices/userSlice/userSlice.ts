import { createSlice } from "@reduxjs/toolkit";

type UserState = {
  id: number;
  username: string;
  email: string;
  type: string;

  password: string;
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
  password: "",
  photo: null,
  historyRest: [],
  wishList: [],
  recommendations: [],
  phoneNumber: null,
};
const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export const {} = userSlice.actions;
export default userSlice.reducer;
