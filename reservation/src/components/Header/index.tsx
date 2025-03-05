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
      textAlign="center"
      width="100%"
      spacing={2}
      height="35vh"
      size={12}
      className="bg-background-gradient p-4 sm:p-4 md:p-8 lg:p-12"
    >
      <Grid2
        size={{ xs: 9 }}
        justifyContent="center"
        alignContent="center"
        alignItems="center"
        textAlign="center"
      >
        <Autocomplete
          freeSolo
          fullWidth
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
        />
      </Grid2>
      <Grid2
        size={{ xs: 3 }}
        justifyContent="center"
        alignContent="center"
        alignItems="center"
        textAlign="center"
      >
        <Button
          size="small"
          endIcon={<SendIcon className="min-w-1" />}
          className="min-w-1"
        />
      </Grid2>
    </Grid2>
  );
};

export default Header;
