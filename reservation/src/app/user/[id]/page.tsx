"use client";
import BaseGrid from "@/components/BaseGrid";
import CardRent from "@/components/CardRent";
import SmallHeader from "@/components/Header/SmallHeader";
import { useAppSelector } from "@/redux/store";
import { Avatar, Button, Card, Grid2, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { use } from "react";

interface UserPageProps {
  params: Promise<Params>;
}

interface Params {
  id: number;
}

const HISTORY = [
  {
    id: 1,
    createdAt: "2002 03 26",
    timeStart: "2002 03 26 15:00",
    timeEnd: "2002 03 26 17:00",
    restaurantTitle: "Burgeros",
  },
  {
    id: 1,
    createdAt: "2002 03 26",
    timeStart: "2002 03 26 15:00",
    timeEnd: "2002 03 26 17:00",
    restaurantTitle: "Burgeros",
  },
  {
    id: 1,
    createdAt: "2002 03 26",
    timeStart: "2002 03 26 15:00",
    timeEnd: "2002 03 26 17:00",
    restaurantTitle: "Burgeros",
  },
  {
    id: 1,
    createdAt: "2002 03 26",
    timeStart: "2002 03 26 15:00",
    timeEnd: "2002 03 26 17:00",
    restaurantTitle: "Burgeros",
  },
  {
    id: 1,
    createdAt: "2002 03 26",
    timeStart: "2002 03 26 15:00",
    timeEnd: "2002 03 26 17:00",
    restaurantTitle: "Burgeros",
  },
  {
    id: 1,
    createdAt: "2002 03 26",
    timeStart: "2002 03 26 15:00",
    timeEnd: "2002 03 26 17:00",
    restaurantTitle: "Burgeros",
  },
  {
    id: 1,
    createdAt: "2002 03 26",
    timeStart: "2002 03 26 15:00",
    timeEnd: "2002 03 26 17:00",
    restaurantTitle: "Burgeros",
  },
  {
    id: 1,
    createdAt: "2002 03 26",
    timeStart: "2002 03 26 15:00",
    timeEnd: "2002 03 26 17:00",
    restaurantTitle: "Burgeros",
  },
  {
    id: 1,
    createdAt: "2002 03 26",
    timeStart: "2002 03 26 15:00",
    timeEnd: "2002 03 26 17:00",
    restaurantTitle: "Burgeros",
  },
  {
    id: 1,
    createdAt: "2002 03 26",
    timeStart: "2002 03 26 15:00",
    timeEnd: "2002 03 26 17:00",
    restaurantTitle: "Burgeros",
  },
  {
    id: 1,
    createdAt: "2002 03 26",
    timeStart: "2002 03 26 15:00",
    timeEnd: "2002 03 26 17:00",
    restaurantTitle: "Burgeros",
  },
  {
    id: 1,
    createdAt: "2002 03 26",
    timeStart: "2002 03 26 15:00",
    timeEnd: "2002 03 26 17:00",
    restaurantTitle: "Burgeros",
  },
  {
    id: 1,
    createdAt: "2002 03 26",
    timeStart: "2002 03 26 15:00",
    timeEnd: "2002 03 26 17:00",
    restaurantTitle: "Burgeros",
  },
];

const UserPage: React.FC<UserPageProps> = ({ params }) => {
  const router = useRouter();
  const { id } = use(params);
  const { email, username } = useAppSelector((state) => state.user);

  return (
    <BaseGrid header={<SmallHeader />}>
      <Grid2
        sx={{ width: "100%" }}
        size={{
          xs: 12,
        }}
        justifyContent="center"
        spacing={{ xs: 2 }}
        container
      >
        <Grid2
          sx={{ borderRadius: "0.375rem", backgroundColor: "white" }}
          size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}
          padding={2}
          justifyContent="center"
          container
        >
          <Avatar variant="circular" />
          <hr className="w-full" />
          <Grid2 size={{ xs: 12 }}>
            <Typography children={`ФИО: ${username}`} />
            <Typography children={`Почта: ${email}`} />
          </Grid2>
          <Grid2 container gap={1} direction="column">
            <Typography
              textAlign="center"
              children={
                <Button
                  size="small"
                  children={"Редактировать"}
                  variant="contained"
                />
              }
            />
            <Typography
              textAlign="center"
              children={
                <Button
                  size="small"
                  children={"ВЫЙТИ"}
                  variant="contained"
                  color="error"
                  onClick={() => {
                    router.push("/auth/logout");
                  }}
                />
              }
            />
          </Grid2>
        </Grid2>
        <Grid2
          sx={{ borderRadius: "0.375rem", backgroundColor: "white" }}
          size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}
          padding={2}
          justifyContent="center"
          container
        >
          <Grid2
            size={{ xs: 12 }}
            justifyContent="center"
            textAlign="center"
            alignContent="center"
          >
            <Typography
              fontSize={22}
              alignItems="center"
              variant="overline"
              children={"Заказы"}
            />
          </Grid2>

          <Grid2 container size={{ xs: 12 }} gap="20px">
            {HISTORY.map(
              ({ createdAt, id, restaurantTitle, timeEnd, timeStart }, i) => (
                <CardRent
                  key={i}
                  id={id}
                  restaurantTitle={restaurantTitle}
                  createdAt={createdAt}
                  timeStart={timeStart}
                  timeEnd={timeEnd}
                />
              )
            )}
          </Grid2>
        </Grid2>
      </Grid2>
    </BaseGrid>
  );
};

export default UserPage;
