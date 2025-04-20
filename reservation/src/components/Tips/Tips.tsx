import React from "react";
import { Grid, Typography } from "@mui/material";

const Tips: React.FC = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={4}>
        <Typography variant="h6" gutterBottom>
          Tip 1
        </Typography>
        <Typography variant="body1">
          Always write clean and maintainable code.
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Typography variant="h6" gutterBottom>
          Tip 2
        </Typography>
        <Typography variant="body1">
          Use meaningful variable and function names.
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Typography variant="h6" gutterBottom>
          Tip 3
        </Typography>
        <Typography variant="body1">
          Keep components small and focused on a single responsibility.
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Tips;
