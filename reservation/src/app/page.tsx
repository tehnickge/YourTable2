"use client";

import BaseGrid from "@/components/BaseGrid";
import RestaurantCard from "@/components/CardRestaurant";
import Header from "@/components/Header";
import { useGetAllMutation } from "@/redux/slices/searchRestaurantSlice/searchRestaurantAPI";
import { useLoginMutation } from "@/redux/slices/sessionSlice/sessionAPI";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { UserTypes } from "@/types/user";
import { Card, CardContent, Grid2, Typography } from "@mui/material";
import { useEffect } from "react";

export default function Home() {
  const [login] = useLoginMutation();
  const { username, type } = useAppSelector((state) => state.session);
  console.log(username, type);

  const handleLogin = async () => {
    try {
      const userData = {
        username: "nikita12",
        email: "nikita12@mail.ru",
        password: "1234",
      };
      await login(userData);
    } catch (error) {
      console.error("Ошибка авторизации", error);
    }
  };

  const dispatch = useAppDispatch();

  const [getRests] = useGetAllMutation();
  const {
    city,
    kitchens,
    maxBill,
    minBill,
    restaurants,
    page,
    minRating,
    pageSize,
    searchText,
    searchTips,
    title,
  } = useAppSelector((state) => state.searchRestaurant);
  useEffect(() => {
    getRests({
      kitchens: [],
      page: 1,
      pageSize: 25,
    });
  }, []);

  console.log(restaurants);
  return (
    <BaseGrid header={<Header />}>
      {restaurants.map((restaurant, i) => (
        <RestaurantCard key={i} restaurant={restaurant}></RestaurantCard>
      ))}
    </BaseGrid>
  );
}
