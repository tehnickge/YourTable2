import { useAppDispatch, useAppSelector } from "@/redux/store";
import { AdminRestaurant } from "@/types/restaurant";
import {
  Autocomplete,
  Container,
  Grid2,
  Input,
  TextField,
  Typography,
} from "@mui/material";

interface AddressInfoProps {
  restaurant?: AdminRestaurant;
}

const AddressInfo: React.FC<AddressInfoProps> = ({ restaurant }) => {
  const dispatch = useAppDispatch();
  const {} = useAppSelector((state) => state.admin);
  const { allCities } = useAppSelector((state) => state.searchRestaurant);

  return (
    <Container maxWidth="sm">
      <Grid2 container spacing={2}></Grid2>

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
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Movie" />}
        />
      </Grid2>
    </Container>
  );
};

export default AddressInfo;
