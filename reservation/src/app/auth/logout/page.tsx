"use client";
import {
  useLoginMutation,
  useLazyLogoutQuery,
  useRegisterMutation,
} from "@/redux/slices/sessionSlice/sessionAPI";
import { resetUserState } from "@/redux/slices/userSlice/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Button, Grid2, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LogoutPage = () => {
  const router = useRouter();
  const [logout, { data, isError, isLoading, isSuccess, isFetching }] =
    useLazyLogoutQuery();
  const { type, username } = useAppSelector((state) => state.session);
  const dispatch = useAppDispatch();

  const logoutClickHandler = () => {
    logout(null);
    dispatch(resetUserState());
  };

  useEffect(() => {
    if (isSuccess) {
      router.push("/");
    }
  }, [isSuccess]);
  return (
    <Grid2
      size={12}
      container
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid2
        size={12}
        alignItems="center"
        justifyContent="center"
        textAlign={"center"}
      >
        <Typography variant="h2">{username}</Typography>
        {isSuccess && <Typography variant="h4">выход выполнен</Typography>}
        <Button variant="contained" onClick={logoutClickHandler}>
          Выйти
        </Button>
      </Grid2>
    </Grid2>
  );
};

export default LogoutPage;
