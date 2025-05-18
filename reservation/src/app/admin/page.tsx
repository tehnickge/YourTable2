"use client";

import { UserTypes } from "@/types/user";

import { withAuth } from "@/hocs/withAuth";
import RestaurantList from "./components/RestaurantsList";
import { Grid2 } from "@mui/material";

const AdminPage = () => {
  return (
    <Grid2 container>
      <RestaurantList></RestaurantList>
    </Grid2>
  );
};

export default withAuth(AdminPage, UserTypes.admin);
