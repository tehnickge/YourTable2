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
import UpdateKitchens from "./components/Kitchens";
import WorkShedule from "./components/WorkShedule";

const RestaurantAdminPage = () => {
  const dispatch = useAppDispatch();
  const { restaurant } = useAppSelector((state) => state.admin);

  const params = useParams();

  const [fetchAllCities] = useLazyGetAllCitiesQuery();
  const [fetchKitchens] = useLazyGetAllKitchensQuery();

  useEffect(() => {
    fetchAllCities();
    fetchKitchens();
  }, []);

  const { data } = useGetAdminRestaurantByIdQuery(params.id as string);

  return (
    <Grid2 container size={12} gap={8}>
      <BaseRestaurantInfo restaurant={restaurant} />
      <PhotoRestaurantInfo restaurant={restaurant} />
      <AddressInfo restaurant={restaurant} />
      <UpdateKitchens restaurant={restaurant} />
      <WorkShedule restaurant={restaurant} />
    </Grid2>
  );
};

export default RestaurantAdminPage;
