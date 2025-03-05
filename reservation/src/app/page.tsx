"use client";

import BaseGrid from "@/components/BaseGrid";
import { useLoginMutation } from "@/redux/slices/sessionSlice/sessionAPI";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { UserTypes } from "@/types/user";
import { Card, CardContent, Grid2, Typography } from "@mui/material";

export default function Home() {
  const [login] = useLoginMutation();
  const { username, type } = useAppSelector((state) => state.session);
  console.log(username, type);

  const handleLogin = async () => {
    try {
      const userData = {
        username: "nikita12",
        email: "nikita12@mail.ru",
        password: "1234",
      };
      await login(userData);
    } catch (error) {
      console.error("Ошибка авторизации", error);
    }
  };

  const baseData = [
    { data: "TEST", id: 1 },
    { data: "TEST", id: 2 },
    { data: "TEST", id: 2 },
    { data: "TEST", id: 1 },
    { data: "TEST", id: 2 },
    { data: "TEST", id: 2 },
    { data: "TEST", id: 1 },
    { data: "TEST", id: 2 },
    { data: "TEST", id: 2 },
    { data: "TEST", id: 1 },
    { data: "TEST", id: 2 },
    { data: "TEST", id: 2 },
    { data: "TEST", id: 1 },
    { data: "TEST", id: 2 },
    { data: "TEST", id: 2 },
  ];

  return (
    <BaseGrid header={<div className="">test</div>}>
      {baseData.map((d) => (
        <Grid2
          container
          columns={{
            xs: 12,
            sm: 6,
            md: 4,
            lg: 3,
          }}
        >
          <Card>
            <CardContent>
              <Typography variant="h6">{d.data}</Typography>
              <Typography>Описание... {d.id}</Typography>
            </CardContent>
          </Card>
        </Grid2>
      ))}
    </BaseGrid>
  );
}
