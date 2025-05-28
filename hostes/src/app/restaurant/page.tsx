"use client";
import { Grid } from "@mui/system";
import ZonesWithSlots from "./components/ZonesWithSlots";
import NotesWithRent from "./components/NotesWithRent";

const RestaurantPage = () => {
  return (
    <Grid container>
      <Grid size={{ xs: 12, lg: 7 }}>
        <ZonesWithSlots />
      </Grid>
      <Grid size={{ xs: 12, lg: 5 }}>
        <NotesWithRent />
      </Grid>
    </Grid>
  );
};

export default RestaurantPage;
