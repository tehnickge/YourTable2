import { useUpDateAddressByIdMutation } from "@/redux/slices/adminSlice/adminAPI";
import {
  setNewCity,
  setNewCoordinate,
  setNewFullAddress,
  setNewTimeZone,
} from "@/redux/slices/adminSlice/adminRestaurantSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { AdminRestaurant } from "@/types/restaurant";
import {
  Autocomplete,
  Button,
  Container,
  Grid2,
  Input,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo } from "react";

interface AddressInfoProps {
  restaurant?: AdminRestaurant;
}

const AddressInfo: React.FC<AddressInfoProps> = ({ restaurant }) => {
  const dispatch = useAppDispatch();
  const { address } = useAppSelector((state) => state.admin);
  const { allCities } = useAppSelector((state) => state.searchRestaurant);
  const [fetchUpdateAddress] = useUpDateAddressByIdMutation();

  const handleUpdateRestaurantInformation = () => {
    if (restaurant) {
      const address = restaurant.address;
      fetchUpdateAddress({ ...address });
    }
  };

  return (
    <Container maxWidth="sm">
      <Grid2 container spacing={2}>
        <Grid2
          container
          size={12}
          sx={{ justifyContent: "space-between", flexDirection: "row" }}
          spacing={2}
        >
          <Typography>Address: </Typography>
          <Input
            value={restaurant?.address.fullAddress}
            onChange={(e) => dispatch(setNewFullAddress(e.target.value))}
          />
        </Grid2>

        <Grid2
          container
          size={12}
          sx={{ justifyContent: "space-between", flexDirection: "row" }}
          spacing={2}
        >
          <Typography>Город: </Typography>
          <Autocomplete
            disablePortal
            options={allCities}
            defaultValue={restaurant?.address.city}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Movie" />}
            onChange={(_, value) => {
              if (value) dispatch(setNewCity(value));
            }}
          />
        </Grid2>

        <Grid2
          container
          size={12}
          sx={{ justifyContent: "space-between", flexDirection: "row" }}
          spacing={2}
        >
          <Typography>Coordinate: </Typography>
          <Input
            value={restaurant?.address.coordinate}
            onChange={(e) => dispatch(setNewCoordinate(e.target.value))}
            placeholder="12.343,64.232"
          />
        </Grid2>
        <Grid2
          container
          size={12}
          sx={{ justifyContent: "space-between", flexDirection: "row" }}
          spacing={2}
        >
          <Typography>TimeZone: </Typography>
          <Input
            value={restaurant?.address.timezone}
            onChange={(e) => dispatch(setNewTimeZone(e.target.value))}
            placeholder="Europ/Moscow"
          />
        </Grid2>

        <Grid2
          container
          size={12}
          sx={{ justifyContent: "center", flexDirection: "row" }}
          spacing={2}
        >
          <Button
            onClick={handleUpdateRestaurantInformation}
            variant="contained"
          >
            Сохранить адрес
          </Button>
        </Grid2>
      </Grid2>
    </Container>
  );
};

export default AddressInfo;
