"use client";
import { useGetRestaurantMutation } from "@/redux/slice/restaurant/api";
import { setSelectedSlotId } from "@/redux/slice/restaurant/slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Box, Grid, Typography, Paper } from "@mui/material";
import { useEffect } from "react";

const ZonesWithSlots = () => {
  const dispatch = useAppDispatch();
  const { restaurant } = useAppSelector((state) => state.resturant);
  const { restaurantId } = useAppSelector((state) => state.session);
  const [fetchResturant, { data }] = useGetRestaurantMutation();

  useEffect(() => {
    if (restaurantId) fetchResturant({ restaurantId: restaurantId });
  }, [restaurantId]);

  return (
    <Grid container spacing={4}>
      {restaurant.zones.map((zone) => (
        <Grid size={12} key={zone.id}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              {zone.title}
            </Typography>

            <Grid container spacing={2}>
              {zone.slots.map((slot) => (
                <Grid size={{ xs: 4, sm: 3, lg: 3 }} key={slot.id}>
                  <div
                    onClick={() => {
                      dispatch(setSelectedSlotId(slot.id));
                    }}
                  >
                    <Paper
                      variant="outlined"
                      sx={{ p: 1.5, borderRadius: 2, transition: "0.3s" }}
                      className="bg-gray-200 hover:bg-slate-300"
                    >
                      <Typography variant="subtitle1" fontWeight="bold">
                        Стол №{slot.number}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {slot.description}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        До {slot.maxCountPeople} человек
                      </Typography>
                    </Paper>
                  </div>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default ZonesWithSlots;
