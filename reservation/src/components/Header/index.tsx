import { Autocomplete, Button, Grid2, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const Header = () => {
  const serach = [
    { title: "32432423432ttt", id: 67 },
    { title: "tdsfsdtt", id: 3 },
    { title: "tdsfdsftt", id: 15 },
    { title: "ttt", id: 4 },
    { title: "tttdasf", id: 1 },
    { title: "tdsftt", id: 2 },
  ];

  return (
    <Grid2
      container
      justifyContent="center"
      alignContent="center"
      alignItems="center"
    >
      <Grid2 sx={{ backgroundColor: "orange" }} columns={{ xs: 10 }}>
        aboba
        {/* <Autocomplete
          freeSolo
          id="free-solo-2-demo"
          disableClearable
          options={serach.map((option) => option.title)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search input"
              slotProps={{
                input: {
                  ...params.InputProps,
                  type: "search",
                },
              }}
            />
          )}
        /> */}
      </Grid2>
      <Grid2 columns={{ xs: 2 }}>
        <Button variant="contained" endIcon={<SendIcon />} />
      </Grid2>
    </Grid2>
  );
};

export default Header;
