"use client";

import BaseGrid from "@/components/BaseGrid";
import RestaurantCard from "@/components/CardRestaurant";
import Header from "@/components/Header";
import {
  useGetAllRestaurantMutation,
  useLazyGetAllKitchensQuery,
  useLazyGetRecommendationQuery,
} from "@/redux/slices/searchRestaurantSlice/searchRestaurantAPI";
import {
  setMaxBill,
  setPage,
} from "@/redux/slices/searchRestaurantSlice/searchRestaurantSlice";
import { useMutationWishListMutation } from "@/redux/slices/userSlice/userApi";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Button, Grid2, Typography } from "@mui/material";
import { useEffect } from "react";

export default function Home() {
  const { username, type } = useAppSelector((state) => state.session);
  console.log(username, type);

  const [getRecommindation, { data: rec }] = useLazyGetRecommendationQuery();

  const dispatch = useAppDispatch();

  const [getRests, { isError, isLoading, status }] =
    useGetAllRestaurantMutation();

  const [fetchWishListMutation] = useMutationWishListMutation();

  const handleLikeClick = (restaurantId: number) => {
    fetchWishListMutation({ id: restaurantId });
  };

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

    getRecommindation();
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
      ></Grid2>
      {rec?.map((restaurant, i) => (
        <RestaurantCard
          key={i}
          restaurant={restaurant}
          onLikeClick={handleLikeClick}
        />
      ))}

      <div>TEST</div>
      <Grid2
        container
        size={{ xs: 12 }}
        sx={{ gap: "20px" }}
        padding={{ xs: 5, md: 0 }}
      >
        {restaurants.map((restaurant, i) => (
          <RestaurantCard
            key={i}
            restaurant={restaurant}
            onLikeClick={handleLikeClick}
          />
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
        <Typography
          fontSize={18}
          children={`${totalPages ? page : 0} / ${totalPages}`}
        />
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
