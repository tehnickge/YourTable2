import BaseGrid from "@/components/BaseGrid";
import SmallHeader from "@/components/Header/SmallHeader";
import { Grid2 } from "@mui/material";

const RestaurantPage = ({ params }: { params: { id: string } }) => {
  return (
    <BaseGrid header={<SmallHeader />}>
      <div>{params.id}</div>
      <Grid2 size={12} container>
        <Grid2 size={{ xs: 12, sm: 12, md: 4 }}>dsfsdf</Grid2>
        <Grid2 size={{ xs: 12, sm: 12, md: 8 }}>Abpba</Grid2>
        <Grid2 size={{ xs: 12 }}>TEST</Grid2>
      </Grid2>
    </BaseGrid>
  );
};

export default RestaurantPage;
