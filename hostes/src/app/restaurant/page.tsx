"use client";
import { Grid } from "@mui/system";
import ZonesWithSlots from "./components/ZonesWithSlots";
import NotesWithRent from "./components/NotesWithRent";
import NotesPage from "./components/NotesWithRent/Notes";

const RestaurantPage = () => {
  return (
    <Grid container>
      <Grid size={{ xs: 12, lg: 7 }}>
        <ZonesWithSlots />
        <NotesPage />
      </Grid>
      <Grid size={{ xs: 12, lg: 5 }}>
        <NotesWithRent />
      </Grid>
    </Grid>
  );
};

export default RestaurantPage;
