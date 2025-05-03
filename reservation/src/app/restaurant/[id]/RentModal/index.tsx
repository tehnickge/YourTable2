import BaseMoal from "@/components/BaseMoal";
import {
  resetModalState,
  setActiveDate,
  setIsOpenModal,
  setTimeEnd,
  setTimeStart,
} from "@/redux/slices/restaurantSlice/restaurantSlice";
import { useGetAvailableTimeMutation } from "@/redux/slices/searchRestaurantSlice/searchRestaurantAPI";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Button, Grid2, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const RentModal = () => {
  const dispatch = useAppDispatch();

  const { rentModal, maxHoursToRent } = useAppSelector(
    (state) => state.restaurant
  );
  const [fetchAvailableTime] = useGetAvailableTimeMutation();

  const handleClose = useCallback(() => {
    dispatch(setIsOpenModal());
  }, [rentModal.isOpen]);

  const handleSetTimeStart = (time: string) => () => {
    dispatch(setTimeStart(time));
  };

  const handleSetTimeEnd = (time: string) => () => {
    dispatch(setTimeEnd(time));
  };

  useEffect(() => {
    if (!rentModal.isOpen) dispatch(resetModalState());
  }, [rentModal.isOpen, dispatch]);

  useEffect(() => {
    if (rentModal.activeDate && rentModal.activeSlot) {
      fetchAvailableTime({
        date: rentModal.activeDate,
        slotId: rentModal.activeSlot,
      });
    }
  }, [rentModal.activeSlot, rentModal.activeDate]);

  const getTimeEnd = () => {
    if (
      !rentModal.selectTimeStart ||
      !rentModal.avaibleTimes?.length ||
      !maxHoursToRent
    )
      return [];

    const startIndex = rentModal.avaibleTimes.findIndex(
      (time) => time === rentModal.selectTimeStart
    );

    if (startIndex === -1) return [];

    const result = [];
    const startTimeMinutes = convertToMinutes(rentModal.selectTimeStart);
    const maxEndTimeMinutes = startTimeMinutes + maxHoursToRent * 60;

    let prevTime = startTimeMinutes;

    // Проверяем все времена после выбранного
    for (let i = startIndex + 1; i < rentModal.avaibleTimes.length; i++) {
      const currentTime = convertToMinutes(rentModal.avaibleTimes[i]);

      // Проверяем три условия:
      // 1. Не превышает ли максимальное время аренды
      // 2. Нет ли пропуска больше 60 минут
      // 3. Время должно быть больше предыдущего
      if (currentTime > maxEndTimeMinutes) break;
      if (currentTime - prevTime > 60) break;
      if (currentTime <= prevTime) continue; // на случай некорректных данных

      result.push(rentModal.avaibleTimes[i]);
      prevTime = currentTime;
    }

    return result;
  };

  // Преобразование времени "HH:MM" в минуты
  const convertToMinutes = (timeString: string) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const timesEnd = getTimeEnd();

  return (
    <BaseMoal handleClose={handleClose} isOpen={rentModal.isOpen}>
      <Grid2
        container
        size={12}
        sx={{
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          justifyItems: "center",
        }}
        direction="column"
        spacing={2}
      >
        <Grid2 className="flex flex-row gap-1 text-center items-center">
          <Typography>Дата:</Typography>
          <DatePicker
            className="border-2 border-gray-500 p-1 rounded-xl"
            selected={rentModal.activeDate}
            onChange={(date) => dispatch(setActiveDate(date))}
            dateFormat="yyyy/MM/dd"
            placeholderText="Выберите дату"
          />
        </Grid2>
        <Typography>Время начала</Typography>
        <Grid2 container>
          {rentModal.avaibleTimes.map((time, i) => {
            if (i !== rentModal.avaibleTimes.length - 1)
              return (
                <div key={i}>
                  <Button onClick={handleSetTimeStart(time)}>
                    <Typography
                      sx={{
                        color:
                          rentModal.selectTimeStart === time
                            ? "red"
                            : "lightblue",
                      }}
                    >
                      {time}
                    </Typography>
                  </Button>
                </div>
              );
          })}
        </Grid2>
        <Typography>Время конца</Typography>
        <Grid2 container>
          {timesEnd.map((time, i) => (
            <div key={i}>
              <Button onClick={handleSetTimeEnd(time)}>
                <Typography
                  sx={{
                    color:
                      rentModal.selectTimeEnd === time ? "red" : "lightblue",
                  }}
                >
                  {time}
                </Typography>
              </Button>
            </div>
          ))}
        </Grid2>
        <Button
          variant="contained"
          disabled={
            !rentModal.activeDate ||
            !rentModal.avaibleTimes ||
            !rentModal.selectTimeStart.length ||
            !rentModal.selectTimeEnd.length
          }
        >
          Забронировать
        </Button>
      </Grid2>
    </BaseMoal>
  );
};

export default RentModal;
