"use client";
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Collapse,
  IconButton,
  IconButtonProps,
  styled,
  Typography,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import { RestaurantWithKitchenZoneSchedule } from "@/redux/slices/searchRestaurantSlice/searchRestaurantSlice";

interface RestaurantCardProps {
  restaurant: RestaurantWithKitchenZoneSchedule;
}

const randomColors = ["red", "purple", "blue", "orange", "yellow"];

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Card
      sx={{
        flex: {
          xs: "0 1 calc(100% / 2 - 20px * 1 / 2)",
          sm: "0 1 calc(100% / 2 - 20px * 1 / 2)",
          md: "0 1 calc(100% / 3 - 20px * 2 / 3)",
        },
      }}
      className="relative overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg group"
    >
      <div className="absolute inset-0 bg-gray-400 opacity-0 group-hover:opacity-35 transition-opacity duration-300 pointer-events-none z-10" />
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
        modules={[Navigation]}
        className="relative w-ful h-48 sm:h-60 md:h-80 xl:h-96 "
      >
        {restaurant.photos.map((photo, i) => (
          <SwiperSlide key={i}>
            <Image
              src={photo}
              alt={`photo-${i}`}
              layout="fill"
              objectFit="cover"
              priority
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <CardContent>
        <Typography
          variant="h6"
          className="w-full h-24 overflow-hidden text-ellipsis"
        >
          {restaurant.info}
        </Typography>
      </CardContent>

      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
