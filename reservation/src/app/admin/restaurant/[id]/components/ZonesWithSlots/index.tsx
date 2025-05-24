import { useAppDispatch, useAppSelector } from "@/redux/store";
import { AdminRestaurant } from "@/types/restaurant";
import {
  Button,
  Container,
  Grid2,
  Input,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import {
  setActiveZone,
  setSlotDescriptionr,
  setSlotMaxPeopleAmount,
  setSlotNumber,
} from "@/redux/slices/adminSlice/adminRestaurantSlice";
import {
  useAppnedSlotToZoneMutation,
  useDeleteSlotfromZoneMutation,
} from "@/redux/slices/adminSlice/adminAPI";

interface ZonesWithSlotsProps {
  restaurant?: AdminRestaurant;
}

const ZonesWithSlots: React.FC<ZonesWithSlotsProps> = ({ restaurant }) => {
  const dispatch = useAppDispatch();
  const { zonesWithSlots } = useAppSelector((state) => state.admin);
  const [fetchAppendSlotToZone] = useAppnedSlotToZoneMutation();
  const [fetchDeleteSlotFromZone] = useDeleteSlotfromZoneMutation();

  if (!restaurant) return null;

  const handleAppendSlotToZone = () => {
    fetchAppendSlotToZone({
      maxCountPeople: zonesWithSlots.maxPeopleAmount,
      number: zonesWithSlots.slotNumber,
      zoneId: zonesWithSlots.activeZone,
      description: zonesWithSlots.description,
    });
  };

  const handleDeleteSlot = (id: number) => () => {
    fetchDeleteSlotFromZone({ id });
  };

  return (
    <Container maxWidth="sm">
      <Grid2 container spacing={2} direction="column">
        {restaurant.zones.map((zone, i) => (
          <Grid2
            key={zone.id}
            container
            size={12}
            sx={{ justifyContent: "center", flexDirection: "column" }}
            spacing={2}
            position="relative"
          >
            <Typography>
              {zone.title} #{zone.id}
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
              >
                X
              </Button>
            </Typography>

            <Grid2 container>
              {zone.slots.map((slot) => (
                <Grid2
                  key={slot.id}
                  direction="column"
                  container
                  className="bg-white rounded-md"
                  sx={{
                    flexBasis: "calc(33% - 16px)",
                    justifyContent: "center",
                    textAlign: "center",
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
                    onClick={handleDeleteSlot(slot.id)}
                  >
                    x
                  </Button>
                  <Typography>
                    #{slot.number} №{slot.id}
                  </Typography>
                  <Typography>
                    <PersonIcon /> {slot.maxCountPeople}
                  </Typography>
                  <Typography>{slot.description}</Typography>
                </Grid2>
              ))}
            </Grid2>
          </Grid2>
        ))}
        <Grid2 container direction="column">
          <Select
            className="w-52"
            onChange={(e) => {
              if (e.target.value as string)
                dispatch(setActiveZone(Number(e.target.value)));
            }}
          >
            {restaurant.zones.map((zone) => (
              <MenuItem value={zone.id}>
                {zone.title} #{zone.id}
              </MenuItem>
            ))}
          </Select>

          <Grid2 container direction="row" justifyContent="space-between">
            <Typography>Число персон</Typography>{" "}
            <Input
              value={zonesWithSlots.maxPeopleAmount}
              type="number"
              onChange={(e) => {
                dispatch(setSlotMaxPeopleAmount(Number(e.target.value)));
              }}
            />
          </Grid2>

          <Grid2 container direction="row" justifyContent="space-between">
            <Typography>Описание</Typography>
            <Input
              value={zonesWithSlots.description}
              onChange={(e) => {
                dispatch(setSlotDescriptionr(e.target.value));
              }}
            />
          </Grid2>

          <Grid2 container direction="row" justifyContent="space-between">
            <Typography>Номер слота</Typography>
            <Input
              value={zonesWithSlots.slotNumber}
              onChange={(e) => {
                dispatch(setSlotNumber(e.target.value));
              }}
            />
          </Grid2>

          <Button
            variant="contained"
            disabled={
              !zonesWithSlots.slotNumber.length ||
              zonesWithSlots.activeZone === 0
            }
            onClick={handleAppendSlotToZone}
          >
            Добавить слот
          </Button>
        </Grid2>
        <Grid2 container>
          <Button>Добавить зону</Button>
        </Grid2>
      </Grid2>
    </Container>
  );
};

export default ZonesWithSlots;
