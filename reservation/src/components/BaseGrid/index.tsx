import { Container, Grid2 } from "@mui/material";
import { ReactNode } from "react";

interface BaseGridProps {
  children: ReactNode;
  header: ReactNode;
  footer?: ReactNode;
}

const BaseGrid: React.FC<BaseGridProps> = ({ children, header, footer }) => {
  return (
    <Grid2 container columns={{ xs: 12 }}>
      <Container maxWidth={"lg"} sx={{ backgroundColor: "red" }}>
        {/** Header */}
        <Grid2 alignContent="center" alignItems="center" textAlign="center">
          {header}
        </Grid2>

        {/** MAIN */}
        <Grid2
          container
          columns={{ xs: 12 }}
          spacing={4}
          flexDirection="row"
          justifyContent="center"
          alignItems="flex-start"
          flexWrap="wrap"
        >
          {children}
        </Grid2>

        {/** footer */}
        <Grid2 columns={{ xs: 12 }}>{footer}</Grid2>
      </Container>
    </Grid2>
  );
};

export default BaseGrid;
