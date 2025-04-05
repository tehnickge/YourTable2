"use client";

import BaseGrid from "@/components/BaseGrid";
import RestaurantCard from "@/components/CardRestaurant";
import Header from "@/components/Header";
import {
  useGetAllRestaurantMutation,
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

  const [getRests, { isError, isLoading, status }] =
    useGetAllRestaurantMutation();

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
      kitchens: kitchens.map((kitchen) => kitchen.title),
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
      {isError && (
        <Grid2>
          <Typography
            sx={{ hyphens: "auto", fontSize: 20, textAlign: "center" }}
          >
            Ошибка...
          </Typography>
          <Typography sx={{ hyphens: "auto", textAlign: "center" }}>
            Попробуйте позже
          </Typography>
        </Grid2>
      )}

      <Grid2
        container
        size={{ xs: 12 }}
        sx={{ gap: "20px" }}
        padding={{ xs: 5, md: 0 }}
      >
        {restaurants.map((restaurant, i) => (
          <RestaurantCard key={i} restaurant={restaurant} />
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
          autoFocus={true}
          variant="text"
          onClick={prevButtonHandler}
          disabled={page <= 1}
          children={<Typography fontSize={24} children={"<"} />}
        />
        <Typography fontSize={18} children={`${page} / ${totalPages}`} />
        <Button
          autoFocus={true}
          disabled={page >= totalPages}
          variant="text"
          onClick={nextButtonHandler}
          children={<Typography fontSize={24} children={">"} />}
        />
      </Grid2>
    </BaseGrid>
  );
}
