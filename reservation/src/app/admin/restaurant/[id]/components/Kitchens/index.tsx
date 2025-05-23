import { BaseFilterData } from "@/components/BaseFilter";
import {
  useAppendKitchenToRestaurantMutation,
  useDeleteKitchenFromRestaurantMutation,
} from "@/redux/slices/adminSlice/adminAPI";
import { setSelectedKitchen } from "@/redux/slices/adminSlice/adminRestaurantSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { AdminRestaurant } from "@/types/restaurant";
import {
  Button,
  Chip,
  Container,
  Grid2,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useMemo } from "react";

interface AdminRestaurantProps {
  restaurant?: AdminRestaurant;
}

const UpdateKitchens: React.FC<AdminRestaurantProps> = ({ restaurant }) => {
  const dispatch = useAppDispatch();
  const {
    kitchens: { allKitchens, selectedKitchen },
  } = useAppSelector((state) => state.admin);

  const [fetchAppendKitchen] = useAppendKitchenToRestaurantMutation();
  const [fetchDeleteKitchen] = useDeleteKitchenFromRestaurantMutation();

  if (!restaurant) return null;

  const handleChangeSelectedKitchen = (event: SelectChangeEvent) => {
    const selectedId = Number(event.target.value);
    const selected = allKitchens.find((k) => k.id === selectedId);
    if (selected) {
      dispatch(setSelectedKitchen(selected));
    }
  };

  const handleAppendKitchenToRestaurant = () => {
    fetchAppendKitchen({
      restaurantId: restaurant.id,
      kitchenId: selectedKitchen.id,
    });
  };

  const handleDeleteKitchenFromRestaurant = (id: number) => () => {
    fetchDeleteKitchen({ id: id });
  };

  const filteredKitchens = useMemo(
    () =>
      allKitchens.filter(
        (kitchen) =>
          !restaurant.kitchens.some(
            (restKitchen) => restKitchen.kitchen.id === kitchen.id
          )
      ),
    [restaurant.kitchens, allKitchens]
  );

  return (
    <Container maxWidth="sm">
      <Grid2 container spacing={2}>
        <Grid2
          container
          size={12}
          sx={{ justifyContent: "start", flexDirection: "row" }}
          spacing={2}
        >
          {restaurant.kitchens.map((kitchen, i) => (
            <Chip
              key={i}
              label={kitchen.kitchen.title}
              onDelete={handleDeleteKitchenFromRestaurant(kitchen.id)}
            />
          ))}
        </Grid2>
        <Grid2
          container
          size={12}
          sx={{ justifyContent: "space-between", flexDirection: "row" }}
          spacing={2}
        >
          <Select
            className="w-48"
            value={selectedKitchen.id.toString()}
            onChange={handleChangeSelectedKitchen}
          >
            {filteredKitchens.map((kitchen, i) => (
              <MenuItem value={kitchen.id} key={i}>
                {kitchen.title}
              </MenuItem>
            ))}
          </Select>
          <Button onClick={handleAppendKitchenToRestaurant}>
            Добавить кухню
          </Button>
        </Grid2>
      </Grid2>
    </Container>
  );
};

export default UpdateKitchens;
