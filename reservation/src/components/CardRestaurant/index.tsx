"use client";
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  Collapse,
  Grid2,
  IconButton,
  IconButtonProps,
  styled,
  Typography,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";

import { RestaurantWithKitchenZoneSchedule } from "@/redux/slices/searchRestaurantSlice/searchRestaurantSlice";
import Link from "next/link";

interface RestaurantCardProps {
  restaurant: RestaurantWithKitchenZoneSchedule;
}

const randomColors = ["red", "purple", "blue", "orange", "yellow"];

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: {
          xs: "0 1 calc(100% / 1 )",
          sm: "0 1 calc(100% / 2 - 20px * 1 / 2)",
          md: "0 1 calc(100% / 3 - 20px * 2 / 3)",
        },
      }}
      className="relative overflow-hidden"
    >
      <CardHeader
        avatar={
          <Avatar
            sx={{
              bgcolor:
                randomColors[Math.floor(Math.random() * randomColors.length)],
            }}
            aria-label="recipe"
          >
            {restaurant.title[0].toUpperCase()}
          </Avatar>
        }
        title={restaurant.title}
        subheader={restaurant.shortInfo}
      />
      <Swiper
        navigation
        pagination
        modules={[Navigation, Pagination]}
        className="relative w-full h-48 sm:h-60 md:h-80 xl:h-96"
      >
        {restaurant.photos.map((photo, i) => (
          <SwiperSlide key={i}>
            <Image
              src={photo}
              alt={`photo-${i}`}
              layout="fill"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
              objectFit="cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <Link href={`/restaurant/${restaurant.id}`} className="grow">
        <CardContent>
          <Grid2 size={{ xs: 12 }} container direction="row" gap={1}>
            <Typography
              className="overflow-hidden text-ellipsis hyphens-auto "
              lang="ru"
              sx={{
                fontSize: {
                  xs: 14,
                },

                wordWrap: "break-word",
              }}
            >
              Описание:
            </Typography>
            <Typography
              className="overflow-hidden text-ellipsis "
              lang="ru"
              sx={{
                fontSize: {
                  xs: 14,
                },
                wordWrap: "break-word",
              }}
            >
              {restaurant.shortInfo}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12 }} sx={{ mt: 1 }} container gap={1}>
            {restaurant.kitchens.map((kitchen, i) => (
              <Chip
                key={i}
                size="small"
                sx={{ fontSize: 12 }}
                label={kitchen.kitchen.title}
              />
            ))}
          </Grid2>
        </CardContent>
        <Box />
      </Link>

      <CardActions disableSpacing className="flex justify-between">
        <div className="flex">
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
        </div>
        <Typography
          className="overflow-hidden text-ellipsis "
          lang="ru"
          sx={{
            fontSize: {
              xs: 18,
            },
            wordWrap: "break-word",
          }}
        >
          {restaurant.address?.city}
        </Typography>
      </CardActions>
    </Card>
  );
}
