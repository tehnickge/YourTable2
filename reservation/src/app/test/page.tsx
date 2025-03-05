import Grid from "@mui/material/Grid2";

const TestPage = () => {
  return (
    <Grid container>
      <Grid size={{ xs: 4 }} sx={{ backgroundColor: "red" }}>
        jopa
      </Grid>
      <Grid size={{ xs: 4 }} sx={{ backgroundColor: "black" }}>
        siski{" "}
      </Grid>
      <Grid size={{ xs: 4 }} sx={{ backgroundColor: "blue" }}>
        twerk
      </Grid>
    </Grid>
  );
};

export default TestPage;
