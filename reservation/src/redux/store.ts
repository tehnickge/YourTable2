// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import testSlice from "./slices/testSlice";
import sessionSlice from "./slices/sessionSlice/sessionSlice";
import { authAPI } from "./slices/sessionSlice/sessionAPI";



export const store = configureStore({
  reducer: {
    test: testSlice,
    session: sessionSlice,
    [authAPI.reducerPath]: authAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authAPI.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Хуки для использования в компонентах
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
