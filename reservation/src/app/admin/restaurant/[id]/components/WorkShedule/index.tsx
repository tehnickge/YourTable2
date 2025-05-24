import {
  useAppendWorkSheduleToRestaurantMutation,
  useDeleteWorkSheduleMutation,
} from "@/redux/slices/adminSlice/adminAPI";
import {
  setSelectedDay,
  setTimeBegin,
  setTimeEnd,
} from "@/redux/slices/adminSlice/adminRestaurantSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { AdminRestaurant } from "@/types/restaurant";
import {
  Button,
  Container,
  Grid2,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { DateTime, Duration, Interval, Info, Settings } from "luxon";
import { useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface WorkSheduleProps {
  restaurant?: AdminRestaurant;
}

const ALL_DAYS = [
  { id: 1, title: "понедельник" },
  { id: 2, title: "вторник" },
  { id: 3, title: "среда" },
  { id: 4, title: "четверг" },
  { id: 5, title: "пятница" },
  { id: 6, title: "суббота" },
  { id: 7, title: "воскресенье" },
];

const WorkShedule: React.FC<WorkSheduleProps> = ({ restaurant }) => {
  const dispatch = useAppDispatch();
  const { workShedule } = useAppSelector((state) => state.admin);
  const [fetchDeleteWorkShedule] = useDeleteWorkSheduleMutation();
  const [fetchAppendShedule] = useAppendWorkSheduleToRestaurantMutation();

  if (!restaurant) return null;

  const daysToSelect = useMemo(
    () =>
      ALL_DAYS.filter(
        (day) =>
          !restaurant.workShedules.some((shedule) => shedule.day.id === day.id)
      ),
    [restaurant, restaurant.workShedules]
  );

  const handleChangeSelectedKitchen = (event: SelectChangeEvent) => {
    const selectedId = Number(event.target.value);
    const selected = ALL_DAYS.find((d) => d.id === selectedId);
    if (selected) {
      dispatch(setSelectedDay(selected));
    }
  };

  const handleDeleteWorkShedule = (id: number) => () => {
    fetchDeleteWorkShedule({ id });
  };

  const handleAppendSheduleToRestaurant = () => {
    fetchAppendShedule({
      dayId: workShedule.selectedDay.id,
      restaurantId: restaurant.id,
      timeBegin: workShedule.timeBegin,
      timeEnd: workShedule.timeEnd,
    });
  };

  const sortedShedules = useMemo(
    () => [...restaurant.workShedules].sort((a, b) => a.day.id - b.day.id),
    [restaurant]
  );

  return (
    <Container maxWidth="sm">
      <Grid2 container spacing={2} direction="column">
        <Grid2
          container
          size={12}
          sx={{ justifyContent: "start", flexDirection: "row" }}
          spacing={2}
        >
          {sortedShedules.map((shedule, i) => (
            <Grid2
              key={i}
              container
              sx={{
                textAlign: "center",
                backgroundColor: "#dbdbdb",
                padding: 2,
                borderRadius: "0.375rem",
                flex: "0 1 calc(33% - 16px)",
                position: "relative",
              }}
            >
              <Button
                sx={{
                  position: "absolute !important",
                  top: "4px !important",
                  right: "4px !important",
                  minWidth: "24px !important",
                  minHeight: "24px !important",
                  padding: "0 !important",
                  lineHeight: "1 !important",
                }}
                onClick={handleDeleteWorkShedule(shedule.id)}
              >
                x
              </Button>

              <Grid2 size={12}>{shedule.day.title}</Grid2>

              <Grid2 size={12}>
                {DateTime.fromISO(shedule.timeBegin).toFormat(`HH:mm`)} -
                {DateTime.fromISO(shedule.timeEnd).toFormat(`HH:mm`)}
              </Grid2>
            </Grid2>
          ))}
        </Grid2>

        <Grid2
          container
          size={12}
          sx={{ justifyContent: "space-between", flexDirection: "row" }}
          spacing={2}
        >
          <Select className="w-36" onChange={handleChangeSelectedKitchen}>
            {daysToSelect.map((day, i) => (
              <MenuItem value={day.id} key={i}>
                {day.title}
              </MenuItem>
            ))}
          </Select>
        </Grid2>
        <Grid2 container direction="column">
          <Typography>время начала</Typography>
          <DatePicker
            showTimeInput
            value={workShedule.timeBegin}
            onChange={(date) => {
              if (date) dispatch(setTimeBegin(date.toISOString()));
            }}
          />
          <Typography>время конца</Typography>
          <DatePicker
            showTimeInput
            value={workShedule.timeEnd}
            onChange={(date) => {
              if (date) dispatch(setTimeEnd(date.toISOString()));
            }}
          />
        </Grid2>

        <Grid2 container justifyContent="center">
          <Button variant="contained" onClick={handleAppendSheduleToRestaurant}>
            Добавить
          </Button>
        </Grid2>
      </Grid2>
    </Container>
  );
};

export default WorkShedule;
