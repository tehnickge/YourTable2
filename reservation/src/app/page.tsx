"use client";

import BaseGrid from "@/components/BaseGrid";
import RestaurantCard from "@/components/CardRestaurant";
import Header from "@/components/Header";
import {
  useGetAllMutation,
  useLazyGetAllKitchensQuery,
} from "@/redux/slices/searchRestaurantSlice/searchRestaurantAPI";
import {
  setMaxBill,
  setPage,
} from "@/redux/slices/searchRestaurantSlice/searchRestaurantSlice";
import { useLoginMutation } from "@/redux/slices/sessionSlice/sessionAPI";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { UserTypes } from "@/types/user";
import { Button, Card, CardContent, Grid2, Typography } from "@mui/material";
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
    searchTips,
    title,
    totalCount,
    totalPages,
  } = useAppSelector((state) => state.searchRestaurant);

  useEffect(() => {
    getRests({
      kitchens: kitchens,
      page: page,
      pageSize: pageSize,
      city: city,
      maxBill: maxBill,
      minBill: minBill,
      minRating: minRating,
      title: title,
    });
  }, [page]);

  const prevButtonHandler = () => {
    dispatch(setPage(page - 1));
  };
  const nextButtonHandler = () => {
    if (page < totalPages) dispatch(setPage(page + 1));
  };

  return (
    <BaseGrid header={<Header />}>
      <Grid2 container size={{ xs: 12 }} gap="20px">
        {restaurants.map((restaurant, i) => (
          <RestaurantCard key={i} restaurant={restaurant}></RestaurantCard>
        ))}
      </Grid2>

      <Grid2
        size={{ xs: 12 }}
        container
        justifyContent="center"
        alignContent="center"
        alignItems="center"
      >
        <Button
          variant="text"
          onClick={prevButtonHandler}
          disabled={page <= 1}
          children={<Typography fontSize={24} children={"<"} />}
        />
        <Typography fontSize={24} children={`${page} / ${totalPages}`} />
        <Button
          disabled={page >= totalPages}
          variant="text"
          onClick={nextButtonHandler}
          children={<Typography fontSize={24} children={">"} />}
        />
      </Grid2>
    </BaseGrid>
  );
}
