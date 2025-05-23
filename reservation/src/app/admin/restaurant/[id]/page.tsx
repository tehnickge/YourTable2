"use client";
import { useGetAdminRestaurantByIdQuery } from "@/redux/slices/adminSlice/adminAPI";
import { useAppDispatch, useAppSelector } from "@/redux/store";

import { Grid2, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import BaseRestaurantInfo from "./components/BaseInfo";
import PhotoRestaurantInfo from "./components/PhotoInfo";
import AddressInfo from "./components/Address";
import {
  useLazyGetAllCitiesQuery,
  useLazyGetAllKitchensQuery,
} from "@/redux/slices/searchRestaurantSlice/searchRestaurantAPI";

const RestaurantAdminPage = () => {
  const dispatch = useAppDispatch();

  const params = useParams();

  useLazyGetAllKitchensQuery();
  useLazyGetAllCitiesQuery();

  const { data } = useGetAdminRestaurantByIdQuery(params.id as string);
  const { restaurant } = useAppSelector((state) => state.admin);

  return (
    <Grid2 container size={12}>
      <BaseRestaurantInfo restaurant={restaurant} />
      <PhotoRestaurantInfo restaurant={restaurant} />
      <AddressInfo restaurant={restaurant} />
    </Grid2>
  );
};

export default RestaurantAdminPage;
