import {
  useAppendHostesToRestaurantMutation,
  useDeleteHostesFromRestaurantMutation,
} from "@/redux/slices/adminSlice/adminAPI";
import {
  setHostesLogin,
  setHostesPassword,
} from "@/redux/slices/adminSlice/adminRestaurantSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { AdminRestaurant } from "@/types/restaurant";
import { Button, Container, Grid2, Input, Typography } from "@mui/material";

interface HostesProps {
  restaurant?: AdminRestaurant;
}

const Hostes: React.FC<HostesProps> = ({ restaurant }) => {
  const dispatch = useAppDispatch();
  const {
    hostes: { login, password },
  } = useAppSelector((state) => state.admin);
  const [fetchAppendHostes] = useAppendHostesToRestaurantMutation();
  const [fetchDeleteHostes] = useDeleteHostesFromRestaurantMutation();
  if (!restaurant) return null;

  const handleAppendHostesToRestaurant = () => {
    fetchAppendHostes({ login, password, restaurantId: restaurant.id });
  };

  const handleDeleteHostesFromRestaurant = (id: number) => () => {
    fetchDeleteHostes({ id });
  };

  return (
    <Container maxWidth="sm">
      <Grid2 container spacing={2} direction="column">
        <Grid2 container spacing={2}>
          {restaurant.hostes.map((hostes) => (
            <Grid2
              container
              direction="column"
              position="relative"
              className="bg-white rounded-md p-2"
              sx={{ flexBasis: "calc(33% - 16px)" }}
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
                onClick={handleDeleteHostesFromRestaurant(hostes.id)}
              >
                x
              </Button>
              <Typography>#{hostes.id}</Typography>
              <Typography>Login: {hostes.login}</Typography>
              <Typography>Password: {hostes.password}</Typography>
            </Grid2>
          ))}
        </Grid2>
        <Grid2
          container
          size={12}
          sx={{ justifyContent: "space-between", flexDirection: "row" }}
          spacing={2}
        >
          <Typography>Login</Typography>{" "}
          <Input
            placeholder="Hostes123"
            value={login}
            onChange={(e) => {
              dispatch(setHostesLogin(e.target.value));
            }}
          ></Input>
        </Grid2>
        <Grid2
          container
          size={12}
          sx={{ justifyContent: "space-between", flexDirection: "row" }}
          spacing={2}
        >
          <Typography>Passowrd</Typography>
          <Input
            type="password"
            placeholder="1234"
            value={password}
            onChange={(e) => {
              dispatch(setHostesPassword(e.target.value));
            }}
          ></Input>
        </Grid2>
        <Grid2 container justifyContent="center" textAlign="center">
          <Button onClick={handleAppendHostesToRestaurant}>Добавить</Button>
        </Grid2>
      </Grid2>
    </Container>
  );
};

export default Hostes;
