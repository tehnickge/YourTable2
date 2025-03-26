"use client";
import { Card, CardContent, Grid2, Typography } from "@mui/material";
import Image from "next/image";

interface CardRentProps {
  id: number;
  restaurantTitle: string;
  createdAt: string;
  timeStart: string;
  timeEnd: string;
  image?: string;
}

const CardRent: React.FC<CardRentProps> = ({
  createdAt,
  id,
  restaurantTitle,
  timeEnd,
  timeStart,
  image,
}) => {
  return (
    <Card
      sx={{
        boxShadow: "4px 4px 8px 0px rgba(34, 60, 80, 0.2)",
        flex: "0 1 calc(100% / 3 - 20px * 2/3)",
      }}
    >
      <CardContent>
        <Grid2
          container
          spacing={{ xs: 2 }}
          size={{
            xs: 12,
          }}
        >
          <Grid2
            size={{ xs: 12 }}
            justifyContent="center"
            alignContent="center"
            alignItems="center"
            justifyItems="center"
          >
            {image && (
              <Image
                style={{ borderRadius: "0.375rem" }}
                src={image}
                width={220}
                height={120}
                alt="test"
              />
            )}
          </Grid2>
          <Grid2 size={{ xs: 12 }} container justifyContent="center">
            <Typography
              lang="ru"
              sx={{
                hyphens: "auto",
                wordWrap: "break-word",
              }}
              children={`Заказ: ${id}`}
            />
            <Typography
              lang="ru"
              sx={{
                hyphens: "auto",
                wordWrap: "break-word",
              }}
              children={`${restaurantTitle}`}
            />
          </Grid2>
          <Grid2 justifyContent="stretch" direction="column">
            <Typography
              lang="ru"
              sx={{
                hyphens: "auto",
                wordWrap: "break-word",
              }}
              children={`Начало: ${timeStart}`}
            />
            <Typography
              lang="ru"
              sx={{
                hyphens: "auto",
                wordWrap: "break-word",
              }}
              children={`Конец: ${timeEnd}`}
            />
          </Grid2>
        </Grid2>
      </CardContent>
    </Card>
  );
};

export default CardRent;
