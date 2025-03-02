import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import testSlice from "./slices/testSlice";
import sessionSlice from "./slices/sessionSlice/sessionSlice";
import { authAPI } from "./slices/sessionSlice/sessionAPI";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; //

// Комбинируем редюсеры
const rootReducer = combineReducers({
  test: testSlice,
  session: sessionSlice,
  [authAPI.reducerPath]: authAPI.reducer,
});

// Конфиг для redux-persist
const persistConfig = {
  key: "root",
  storage, // Использует localStorage
  whitelist: ["session"], // Сохраняем только session
};

// Создаем persist reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Конфигурируем store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      authAPI.middleware
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
