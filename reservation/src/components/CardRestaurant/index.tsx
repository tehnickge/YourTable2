"use client";
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Grid2,
  IconButton,
  Rating,
  Typography,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Pagination } from "swiper/modules";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";
import { RestaurantWithKitchenZoneSchedule } from "@/redux/slices/searchRestaurantSlice/searchRestaurantSlice";
import Link from "next/link";
import type SwiperCore from "swiper";

interface RestaurantCardProps {
  restaurant: RestaurantWithKitchenZoneSchedule;
}

const randomColors = ["red", "purple", "blue", "orange", "yellow"];

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const [swiperInstance, setSwiperInstance] = useState<SwiperCore | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!swiperInstance || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const xPos = e.clientX - rect.left;
    const progress = xPos / rect.width;
    const slideIndex = Math.floor(progress * restaurant.photos.length);

    if (slideIndex !== swiperInstance.activeIndex) {
      swiperInstance.slideTo(slideIndex);
    }
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: {
          xs: "0 1 calc(100% / 1)",
          sm: "0 1 calc(100% / 2 - 20px * 1 / 2)",
          md: "0 1 calc(100% / 3 - 20px * 2 / 3)",
        },
      }}
      className="relative overflow-hidden"
    >
      <Link href={`/restaurant/${restaurant.id}`}>
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
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          style={{ position: "relative", width: "100%" }}
        >
          <Swiper
            onSwiper={setSwiperInstance}
            modules={[Pagination]}
            pagination={{ clickable: true }}
            spaceBetween={0}
            slidesPerView={1}
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
        </div>
      </Link>

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

      <Box sx={{ flexGrow: 1 }} />

      <CardActions disableSpacing className="flex justify-between">
        <div className="flex">
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
        </div>

        <Rating
          name="size-medium"
          onChange={(e, a) => {}}
          value={Number(restaurant.rating)}
          defaultValue={Number(restaurant.rating)}
          readOnly
        />

        <div className="flex gap-1">
          <LocationOnRoundedIcon sx={{ color: "#0000008a" }} />
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
        </div>
      </CardActions>
    </Card>
  );
}
