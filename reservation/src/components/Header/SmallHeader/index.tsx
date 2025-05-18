"use client";
import { Button, Container, Grid2 } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import { UserTypes } from "@/types/user";

const SmallHeader = () => {
  const { id, type } = useAppSelector((state) => state.session);
  const router = useRouter();

  const homeButtonHandler = () => {
    router.push(`/`);
  };
  const profileButtonHandler = () => {
    if (id) router.push(`/user/${id}`);
  };

  return (
    <Grid2
      container
      justifyContent="center"
      alignContent="center"
      alignItems="center"
      textAlign="center"
      width="100%"
      spacing={2}
      height="12vh"
      size={12}
      className="bg-background-gradient p-4 sm:p-4 md:p-8 lg:p-12"
    >
      <Container>
        <Grid2 container size={{ xs: 12 }}>
          <Grid2>
            <Button
              variant="contained"
              sx={{
                color: "white",
                backgroundColor: "transparent",
                boxShadow: 0,
                "&:hover": { boxShadow: 0 },
                "&:disabled": { backgroundColor: "transparent" },
              }}
              startIcon={<HomeIcon />}
              onClick={homeButtonHandler}
            >
              Home
            </Button>
          </Grid2>

          <Grid2>
             {type !== UserTypes.unauthorized && (
              <Button
                variant="contained"
                sx={{
                  color: "white",
                  backgroundColor: "transparent",
                  boxShadow: 0,
                  "&:hover": { boxShadow: 0 },
                  "&:disabled": { backgroundColor: "transparent" },
                }}
                onClick={profileButtonHandler}
                startIcon={<AccountBoxRoundedIcon />}
              >
                profile
              </Button>
            )}
          </Grid2>
        </Grid2>
      </Container>
    </Grid2>
  );
};

export default SmallHeader;
