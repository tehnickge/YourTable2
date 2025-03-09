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
    <Card className="min-w-80 max-w-96  flex-1">
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
