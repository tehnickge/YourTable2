"use client";

import { UserTypes } from "@/types/user";

import { withAuth } from "@/hocs/withAuth";
import RestaurantList from "./components/RestaurantsList";
import { Grid2 } from "@mui/material";
import Link from "next/link";
import {
  useLazyGetAllCitiesQuery,
  useLazyGetAllKitchensQuery,
} from "@/redux/slices/searchRestaurantSlice/searchRestaurantAPI";
import { useEffect } from "react";

const AdminPage = () => {
  return (
    <Grid2
      container
      direction="column"
      spacing={3}
      justifyContent="center"
      alignItems="center"
    >
      <Link href="/admin/restaurant/new">создать новый</Link>
      <RestaurantList></RestaurantList>
    </Grid2>
  );
};

export default withAuth(AdminPage, UserTypes.admin);
