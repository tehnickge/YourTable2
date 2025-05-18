import { useUpdateAdminRestaurantByIdMutation } from "@/redux/slices/adminSlice/adminAPI";
import {
  setAverageBillToUpdate,
  setInfoToUpdate,
  setMaxHoursToRentToUpdate,
  setShortInfoToUpdate,
  setTitleToUpdate,
} from "@/redux/slices/adminSlice/adminRestaurantSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { AdminRestaurant } from "@/types/restaurant";
import {
  Button,
  Container,
  Grid2,
  Input,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";

interface BaseRestaurantInfoProps {
  restaurant?: AdminRestaurant;
}

const BaseRestaurantInfo: React.FC<BaseRestaurantInfoProps> = ({
  restaurant,
}) => {
  const dispatch = useAppDispatch();

  const [fetchUpdateBaseInfo, { isSuccess, isLoading }] =
    useUpdateAdminRestaurantByIdMutation();

  const handleUpdateRestaurantBaseInfo = () => {
    if (restaurant)
      fetchUpdateBaseInfo({
        id: restaurant.id,
        averageBill: restaurant.averageBill,
        info: restaurant.info,
        maxHoursToRent: restaurant.maxHoursToRent,
        shortInfo: restaurant.shortInfo,
        title: restaurant.title,
      });
  };

  if (!restaurant) return null;

  return (
    <Container maxWidth="sm">
      <Grid2 container spacing={2}>
        {isLoading && <Typography variant="h2"> Загрузка...</Typography>}
        {isSuccess && (
          <Typography variant="h2" color="info">
            Успех!
          </Typography>
        )}
        <Grid2
          container
          size={12}
          sx={{ justifyContent: "space-between", flexDirection: "row" }}
          spacing={2}
        >
          <Typography>Назваение: </Typography>
          <Input
            value={restaurant.title}
            onChange={(e) => dispatch(setTitleToUpdate(e.target.value))}
          />
        </Grid2>

        <Grid2
          container
          size={12}
          sx={{ justifyContent: "space-between", flexDirection: "row" }}
          spacing={2}
        >
          <Typography>Полная информация: </Typography>
          <TextField
            multiline
            value={restaurant.info}
            onChange={(e) => dispatch(setInfoToUpdate(e.target.value))}
          />
        </Grid2>

        <Grid2
          container
          size={12}
          sx={{ justifyContent: "space-between", flexDirection: "row" }}
          spacing={2}
        >
          <Typography>Короткая информация: </Typography>
          <TextField
            multiline
            value={restaurant.shortInfo}
            onChange={(e) => dispatch(setShortInfoToUpdate(e.target.value))}
          />
        </Grid2>

        <Grid2
          container
          size={12}
          sx={{ justifyContent: "space-between", flexDirection: "row" }}
          spacing={2}
        >
          <Typography>maxHoursToRent: </Typography>
          <Input
            type="number"
            value={restaurant.maxHoursToRent}
            className="w-9"
            onChange={(e) =>
              dispatch(setMaxHoursToRentToUpdate(Number(e.target.value)))
            }
          />
        </Grid2>

        <Grid2
          container
          size={12}
          sx={{ justifyContent: "space-between", flexDirection: "row" }}
          spacing={2}
        >
          <Typography>averageBill: </Typography>
          <Input
            type="number"
            value={restaurant.averageBill}
            className="w-24"
            onChange={(e) =>
              dispatch(setAverageBillToUpdate(Number(e.target.value)))
            }
          />
        </Grid2>

        <Grid2
          container
          size={12}
          sx={{ justifyContent: "space-between", flexDirection: "row" }}
          spacing={2}
          alignItems="center"
        >
          <Typography>Unique key: </Typography>
          <Typography
            variant="caption"
            children={restaurant.uniqueKey}
            sx={{}}
          />
        </Grid2>

        <Grid2
          container
          size={12}
          sx={{ justifyContent: "center", flexDirection: "row" }}
          spacing={2}
          alignItems="center"
        >
          <Button variant="contained" onClick={handleUpdateRestaurantBaseInfo}>
            Сохранить
          </Button>
        </Grid2>
      </Grid2>
    </Container>
  );
};

export default BaseRestaurantInfo;
