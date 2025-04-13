import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import testSlice from "./slices/testSlice";
import sessionSlice from "./slices/sessionSlice/sessionSlice";
import { authAPI } from "./slices/sessionSlice/sessionAPI";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; //
import { restaurantAPI } from "./slices/searchRestaurantSlice/searchRestaurantAPI";
import searchRestaurantSlice from "./slices/searchRestaurantSlice/searchRestaurantSlice";
import userSlice from "./slices/userSlice/userSlice";
import { userAPI } from "./slices/userSlice/userApi";
import restaurantSlice from "./slices/restaurantSlice/restaurantSlice";

// Комбинируем редюсеры
const rootReducer = combineReducers({
  test: testSlice,
  session: sessionSlice,
  searchRestaurant: searchRestaurantSlice,
  user: userSlice,
  restaurant: restaurantSlice,
  [authAPI.reducerPath]: authAPI.reducer,
  [restaurantAPI.reducerPath]: restaurantAPI.reducer,
  [userAPI.reducerPath]: userAPI.reducer,
});

// Конфиг для redux-persist
const persistConfig = {
  key: "root",
  storage, // Использует localStorage
  whitelist: ["session", "user"], // Сохраняем только session и user
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
      userAPI.middleware
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
