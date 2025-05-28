import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { TypedUseSelectorHook } from "react-redux";
import { persistReducer } from "redux-persist";
import persistStore from "redux-persist/es/persistStore";
import storage from "redux-persist/lib/storage"; // Импортируем localStorage
import sessionSlice from "./slice/session/slice";
import restaurantSlice from "./slice/restaurant/slice";
import { authAPI } from "./slice/session/api";
import { noteAPI, restaurantAPI } from "./slice/restaurant/api";
// Комбинируем редюсеры
const rootReducer = combineReducers({
  session: sessionSlice,
  resturant: restaurantSlice,
  [authAPI.reducerPath]: authAPI.reducer,
  [restaurantAPI.reducerPath]: restaurantAPI.reducer,
  [noteAPI.reducerPath]: noteAPI.reducer,
});

// Конфиг для redux-persist
const persistConfig = {
  key: "root",
  storage, // Использует localStorage
  whitelist: ["session"], // Сохраняем только session и user
};

// Создаем persist reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Конфигурируем store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      authAPI.middleware,
      restaurantAPI.middleware,
      noteAPI.middleware
    ),
});

// Создаем persistor для обертывания приложения
export const persistor = persistStore(store);

// Типизация Redux
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Хуки для удобства
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
