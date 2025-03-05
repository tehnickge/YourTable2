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
      <Container maxWidth={"lg"}>
        {/** Header */}
        <Grid2 alignContent="center" alignItems="center" textAlign="center">
          {header}
        </Grid2>
        <Grid2 container columns={{ xs: 12 }} spacing={4}>
          {/** MAIN */}
          <Grid2
            columns={{ xs: 12 }}
            rowSpacing={8}
            spacing={12}
            flexDirection="row"
            display="flex"
          >
            {children}
          </Grid2>
        </Grid2>

        {/** footer */}
        <Grid2 columns={{ xs: 12 }}>{footer}</Grid2>
      </Container>
    </Grid2>
  );
};

export default BaseGrid;
