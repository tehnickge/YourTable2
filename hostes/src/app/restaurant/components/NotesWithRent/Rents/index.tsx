"use client";
import {
  Rent,
  useDeleteRentByIdMutation,
  useLazyGetRentsBySlotIdQuery,
  useUpdateRentByIdMutation,
} from "@/redux/slice/restaurant/api";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { RentStatus } from "@/types";
import { Typography, Paper, Button } from "@mui/material";
import { Grid } from "@mui/system";
import { DateTime } from "luxon";
import { useEffect } from "react";

const rentColor = ({ rentStatus, timeEnd }: Rent) => {
  if (
    Object.values(RentStatus).some(
      (currentStatus) => currentStatus === rentStatus
    )
  ) {
    if (rentStatus === RentStatus.IN_WORK) {
      return DateTime.fromISO(timeEnd) < DateTime.now()
        ? "text-red-500"
        : "text-yellow-300";
    }
    if (rentStatus === RentStatus.ABORT) {
      return "text-purple-500";
    }
    if (rentStatus === RentStatus.FINISH) {
      return "text-green-600";
    }
  }
  return "text-gray-300";
};

const Rents = () => {
  const dispatch = useAppDispatch();
  const { selectedSlotId, rents } = useAppSelector((state) => state.resturant);
  const [fetchRents, { reset: refetchRents }] = useLazyGetRentsBySlotIdQuery();
  const [fetchDeleteRent] = useDeleteRentByIdMutation();
  const [fetchUpdateRent] = useUpdateRentByIdMutation();

  const handleDeleteRent = (id: number) => () => {
    fetchDeleteRent(id.toString());
    if (selectedSlotId) fetchRents({ slotId: selectedSlotId });
  };

  const handleUpdateStatusRent = (rentId: number, status: string) => () => {
    fetchUpdateRent({ rentId, status });
    if (selectedSlotId) fetchRents({ slotId: selectedSlotId });
  };
  useEffect(() => {
    if (selectedSlotId) fetchRents({ slotId: selectedSlotId });
  }, [selectedSlotId]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (selectedSlotId) {
        fetchRents({ slotId: selectedSlotId });
      }
    }, 15000);

    return () => clearInterval(intervalId);
  }, [selectedSlotId, fetchRents]);

  return (
    <div className="p-4">
      <Typography variant="h5" className="mb-4">
        Бронирования
      </Typography>
      <Grid container spacing={2}>
        {rents.map((rent) => (
          <Grid key={rent.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper elevation={2} className="p-4 rounded-2xl shadow-md">
              <Typography variant="subtitle1" className="font-bold">
                создана {new Date(rent.createdAt).toLocaleDateString("ru-RU")}
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                С{" "}
                {DateTime.fromISO(rent.timeStart).toFormat("yyyy MM dd HH:mm")}{" "}
                До {DateTime.fromISO(rent.timeEnd).toFormat("HH:mm")}
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                Кол-во человек: {rent.amountPeople}
              </Typography>
              <Typography variant="body2" className={`mt-2 ${rentColor(rent)}`}>
                Статус: {rent.rentStatus}
              </Typography>
              <Grid>
                <Button
                  size="small"
                  sx={{ padding: 0, margin: 0 }}
                  color="info"
                  onClick={handleUpdateStatusRent(rent.id, RentStatus.CLOSED)}
                >
                  завершить
                </Button>
              </Grid>
              <Grid>
                <Button
                  size="small"
                  sx={{ padding: 0, margin: 0 }}
                  color="error"
                  onClick={handleUpdateStatusRent(rent.id, RentStatus.ABORT)}
                >
                  отменить
                </Button>
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Rents;
