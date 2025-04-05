import { Container, Grid2 } from "@mui/material";
import { ReactNode } from "react";

interface BaseGridProps {
  children: ReactNode;
  header: ReactNode;
  footer?: ReactNode;
}

const BaseGrid: React.FC<BaseGridProps> = ({ children, header, footer }) => {
  return (
    <Grid2 container size={12} justifyContent="center">
      {/** Header */}
      {header}
      <Container maxWidth="md">
        {/** MAIN */}
        <Grid2
          container
          size={{ xs: 12 }}
          spacing={4}
          columnSpacing={4}
          flexDirection="row"
          justifyContent="center"
          alignItems="flex-start"
          flexWrap="wrap"
          className="item p-2 sm:p-2 lg:p-10"
        >
          {children}
        </Grid2>

        {/** footer */}
        <Grid2 size={{ xs: 12 }}>{footer}</Grid2>
      </Container>
    </Grid2>
  );
};

export default BaseGrid;
