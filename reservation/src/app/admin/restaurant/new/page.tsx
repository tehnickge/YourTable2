"use client";
import { useCreateNewResturantMutation } from "@/redux/slices/adminSlice/adminAPI";
import {
  setNewRestaurantInfo,
  setNewRestaurantShortInfo,
  setNewRestaurantTitle,
} from "@/redux/slices/adminSlice/adminRestaurantSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  Button,
  Container,
  Grid2,
  Input,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";

const CreateRestaurant = () => {
  const { newRestaurant } = useAppSelector((state) => state.admin);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [fetchCreateResturant, { data, isSuccess, isError, error }] =
    useCreateNewResturantMutation();

  const handleCreateRestaurant = () => {
    fetchCreateResturant({
      title: newRestaurant.title,
      info: newRestaurant.info,
      shortInfo: newRestaurant.shortInfo,
    });
  };

  if (isSuccess) {
    router.push(`/admin/restaurant/${data.id}`);
  }
  return (
    <Container maxWidth="sm">
      {isSuccess && <Typography color="info">УСПЕХ</Typography>}
      <Grid2
        container
        justifyContent="center"
        alignContent="center"
        justifyItems="center"
        textAlign="center"
        spacing={4}
      >
        <Grid2
          size={12}
          container
          spacing={2}
          direction="row"
          justifyContent="space-between"
        >
          <Typography>Название:</Typography>
          <Input
            value={newRestaurant.title}
            onChange={(e) => dispatch(setNewRestaurantTitle(e.target.value))}
          ></Input>
        </Grid2>
        <Grid2
          size={12}
          container
          spacing={2}
          direction="row"
          justifyContent="space-between"
        >
          <Typography>Короткая информация: </Typography>
          <Input
            value={newRestaurant.shortInfo}
            onChange={(e) =>
              dispatch(setNewRestaurantShortInfo(e.target.value))
            }
          ></Input>
        </Grid2>

        <Grid2
          size={12}
          container
          spacing={2}
          direction="row"
          justifyContent="space-between"
        >
          <Typography>Информация</Typography>
          <TextField
            multiline
            value={newRestaurant.info}
            onChange={(e) => dispatch(setNewRestaurantInfo(e.target.value))}
          ></TextField>
        </Grid2>
        <Grid2
          size={12}
          container
          spacing={2}
          direction="row"
          justifyContent="center"
        >
          <Button onClick={handleCreateRestaurant} variant="contained">
            Создать
          </Button>
        </Grid2>
      </Grid2>
    </Container>
  );
};

export default CreateRestaurant;
