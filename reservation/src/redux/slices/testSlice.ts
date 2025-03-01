import { createSlice } from "@reduxjs/toolkit";

interface TestState {
  value: number;
  msg: string | null;
  numbers: number[];
}

const initialState: TestState = { value: 0, msg: null, numbers: [] };

const testSlice = createSlice({
  name: "test",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    setValue: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { increment, decrement, setValue } = testSlice.actions;
export default testSlice.reducer;
