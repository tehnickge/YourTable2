"use client";
import BaseGrid from "@/components/BaseGrid";
import SmallHeader from "@/components/Header/SmallHeader";
import { useLazyGetByRestaurantIdQuery } from "@/redux/slices/searchRestaurantSlice/searchRestaurantAPI";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Button, Grid2, Rating, Skeleton, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Mousewheel, Pagination } from "swiper/modules";
import CurrencyRubleRoundedIcon from "@mui/icons-material/CurrencyRubleRounded";
import type SwiperCore from "swiper";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";
import { DateTime } from "luxon";
import RentModal from "./RentModal";
import {
  setActiveSlot,
  setIsOpenModal,
} from "@/redux/slices/restaurantSlice/restaurantSlice";

const RestaurantPage = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const [fetchRestaurantById, data] = useLazyGetByRestaurantIdQuery();
  const containerRef = useRef<HTMLDivElement>(null);
  const [swiperInstance, setSwiperInstance] = useState<SwiperCore | null>(null);

  const {
    photos,
    title,
    address,
    averageBill,
    createdAt,
    id,
    info,
    kitchens,
    lastUpdate,
    maxHoursToRent,
    menus,
    rating,
    restaurantChain,
    reviews,
    shortInfo,
    zones,
    workShedules,
    rentModal,
  } = useAppSelector((state) => state.restaurant);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!swiperInstance || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const xPos = e.clientX - rect.left;
    const progress = xPos / rect.width;
    const slideIndex = Math.floor(progress * photos.length);

    if (slideIndex !== swiperInstance.activeIndex) {
      swiperInstance.slideTo(slideIndex);
    }
  };

  useEffect(() => {
    if (params && params.id && !isNaN(Number(params.id as string))) {
      fetchRestaurantById(params.id as string);
    }
  }, [params.id, params]);

  const formatWorkShedules = useMemo(() => {
    return workShedules.map((workDay) => ({
      ...workDay,
      timeBegin: DateTime.fromISO(workDay.timeBegin, {
        locale: "ru",
        zone: "Europe/Moscow",
      }).toFormat("HH:mm"),
      timeEnd: DateTime.fromISO(workDay.timeEnd, {
        locale: "ru",
        zone: "Europe/Moscow",
      }).toFormat("HH:mm"),
    }));
  }, [workShedules]);

  const handleSlotClick = (id: number) => {
    dispatch(setActiveSlot(id));
    dispatch(setIsOpenModal());
  };

  return (
    <BaseGrid header={<SmallHeader />}>
      <Grid2 container spacing={4} sx={{ padding: { xs: 2, md: 4 } }}>
        {/* Hero Section with Image Slider */}

        <Grid2 size={12}>
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative w-full flex flex-col items-center"
          >
            {/* Rating Badge */}
            <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md">
              <Rating
                value={Number(rating)}
                precision={0.5}
                readOnly
                sx={{
                  "& .MuiRating-iconFilled": {
                    color: "#FFD700",
                  },
                }}
              />
            </div>

            {/* Image Slider */}
            <Swiper
              onSwiper={setSwiperInstance}
              modules={[Pagination]}
              pagination={{
                clickable: true,
                bulletClass: "swiper-pagination-bullet bg-white",
              }}
              spaceBetween={0}
              slidesPerView={1}
              className="w-full rounded-xl overflow-hidden shadow-lg"
              style={{
                height: "clamp(300px, 60vh, 800px)",
              }}
            >
              {photos.map((photo, i) => (
                <SwiperSlide key={i} className="relative">
                  <Image
                    src={photo}
                    alt={`${title} - Photo ${i + 1}`}
                    fill
                    priority={i === 0}
                    quality={90}
                    className="object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Restaurant Title */}
            <div className="w-full mt-4 bg-white rounded-lg p-4 shadow-sm">
              <Typography
                sx={{
                  textAlign: "center",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  color: "primary.main",
                  hyphens: "auto",
                  wordWrap: "break-word",
                  fontSize: {
                    xs: "36px",
                    md: "48px",
                    lg: "60px",
                  },
                }}
              >
                {title.toUpperCase()}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  textAlign: "center",
                  color: "text.secondary",
                  hyphens: "auto",
                  wordWrap: "break-word",
                }}
              >
                {address.fullAddress}
              </Typography>
            </div>
          </div>
        </Grid2>

        {/* Description Section */}
        <Grid2 size={12}>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <Typography
              variant="h4"
              sx={{
                mb: 3,
                textAlign: "center",
                fontWeight: 600,
                color: "primary.dark",
                hyphens: "auto",
                wordWrap: "break-word",
              }}
            >
              О нас
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: "1.1rem",
                lineHeight: 1.6,
                hyphens: "auto",
                wordWrap: "break-word",
              }}
            >
              {info}
            </Typography>
          </div>
        </Grid2>

        {/* Info Cards */}
        <Grid2 size={12} container spacing={3}>
          {/* Средний чек */}
          <Grid2
            size={{ xs: 12, md: 6 }}
            container
            sx={{ display: "flex", flexDirection: "row" }}
          >
            <div className="bg-gradient-to-r from-blue-400 to-blue-300 rounded-lg p-6 text-white shadow-md w-full h-full">
              <Typography
                variant="h6"
                sx={{ mb: 1, hyphens: "auto", wordWrap: "break-word" }}
              >
                Средний чек
              </Typography>
              <div className="flex items-center flex-1">
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    hyphens: "auto",
                    wordWrap: "break-word",
                  }}
                >
                  {averageBill}
                </Typography>
                <CurrencyRubleRoundedIcon fontSize="large" />
              </div>
            </div>
          </Grid2>

          {/* Кухни */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <div className="bg-gradient-to-r from-green-400 to-green-300 rounded-lg p-6 text-white shadow-md w-full h-full">
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  hyphens: "auto",
                  wordWrap: "break-word",
                }}
              >
                Кухни
              </Typography>
              <div className="flex flex-wrap gap-2">
                {kitchens.map((kitchen, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-gradient-to-r from-green-500/30 to-green-600/40 backdrop-blur-sm rounded-full text-sm font-medium"
                  >
                    {kitchen.kitchen.title}
                  </span>
                ))}
              </div>
            </div>
          </Grid2>
        </Grid2>

        {/* Working Hours */}
        <Grid2 size={12}>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <Typography
              variant="h4"
              sx={{
                mb: 4,
                textAlign: "center",
                fontWeight: 600,
                color: "primary.dark",
              }}
            >
              Часы работы
            </Typography>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {formatWorkShedules.map((workDay, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg p-3 text-center hover:shadow-md transition-shadow"
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: "primary.dark",
                      hyphens: "auto",
                      wordWrap: "break-word",
                    }}
                  >
                    {workDay.day.title}
                  </Typography>
                  <Typography variant="body2">
                    {workDay.timeBegin} - {workDay.timeEnd}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        </Grid2>

        {/* Menu Section */}

        <Grid2 size={12}>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <Typography
              variant="h4"
              sx={{
                mb: 4,
                textAlign: "center",
                fontWeight: 600,
                color: "primary.dark",
              }}
            >
              Меню
            </Typography>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {menus.map((menu, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  <div className="aspect-w-4 aspect-h-3 bg-white">
                    <Image
                      src={menu.photo || "/placeholder-food.jpg"}
                      alt={menu.titleDish || ""}
                      width={400}
                      height={300}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4">
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {menu.titleDish}
                    </Typography>
                    <div className="flex justify-between items-center">
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        "menu.titleDish"
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, color: "primary.main" }}
                      >
                        {menu.price}₽
                      </Typography>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Grid2>

        {/* Tables Section */}
        <Grid2 size={12}>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <Typography
              variant="h4"
              sx={{
                mb: 4,
                textAlign: "center",
                fontWeight: 600,
                color: "primary.dark",
              }}
            >
              Бронирование столов
            </Typography>

            {zones.map((zone, i) => (
              <div key={i} className="mb-8 last:mb-0">
                <Typography
                  variant="h5"
                  sx={{ mb: 2, fontWeight: 600, color: "primary.main" }}
                >
                  {zone.title}
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  {zone.description}
                </Typography>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {zone.slots.map((slot, i) => (
                    <div
                      key={i}
                      className="shadow-sm bg-white rounded-lg p-4 hover:border-primary.main transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600 }}
                        >
                          Стол №{slot.number}
                        </Typography>
                        <span className="px-2 py-1 bg-primary.light text-primary.contrastText rounded-full text-xs">
                          {slot.maxCountPeople} чел.
                        </span>
                      </div>
                      <Typography
                        variant="body2"
                        sx={{ mb: 3, color: "text.secondary", hyphens: "auto" }}
                      >
                        {slot.description}
                      </Typography>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleSlotClick(slot.id)}
                        sx={{
                          backgroundColor: "primary.main",
                          "&:hover": {
                            backgroundColor: "primary.dark",
                          },
                        }}
                      >
                        Забронировать
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Grid2>
      </Grid2>

      <RentModal />
    </BaseGrid>
  );
};

export default RestaurantPage;
